// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "./stackingInterface.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract DelegationDAO is AccessControl {
    using SafeMath for uint256;

    mapping(uint256 => uint256) postsUp;
    mapping(uint256 => bool) postStatus;
    mapping(uint256 => uint256) postsDown;

    bytes32 public constant MEMBER = keccak256("MEMBER");

    enum daoState {
        COLLECTING,
        STAKING,
        REVOKING,
        REVOKED
    }

    daoState public currentState;

    mapping(address => uint256) public memberStakes;

    uint256 public totalStake;

    ParachainStaking public staking;

    uint256 public constant minDelegationStk = 1 ether;

    address public constant stakingPrecompileAddress =
        0x0000000000000000000000000000000000000800;

    address public target;

    event deposit(address indexed _from, uint _value);

    event withdrawal(address indexed _from, address indexed _to, uint _value);

    constructor(address _target, address admin) {
        target = _target;

        staking = ParachainStaking(stakingPrecompileAddress);

        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(MEMBER, admin);

        currentState = daoState.COLLECTING;
    }

    // Grant a user the role of admin
    function grant_admin(
        address newAdmin
    ) public onlyRole(DEFAULT_ADMIN_ROLE) onlyRole(MEMBER) {
        grantRole(DEFAULT_ADMIN_ROLE, newAdmin);
        grantRole(MEMBER, newAdmin);
    }

    function grant_member(
        address newMember
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MEMBER, newMember);
    }

    function remove_member(
        address payable exMember
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(MEMBER, exMember);
    }

    function add_stake() external payable onlyRole(MEMBER) {
        if (currentState == daoState.STAKING) {
            if (!staking.is_delegator(address(this))) {
                revert("The DAO is in an inconsistent state.");
            }
            memberStakes[msg.sender] = memberStakes[msg.sender].add(msg.value);
            totalStake = totalStake.add(msg.value);
            emit deposit(msg.sender, msg.value);
            staking.delegator_bond_more(target, msg.value);
        } else if (currentState == daoState.COLLECTING) {
            memberStakes[msg.sender] = memberStakes[msg.sender].add(msg.value);
            totalStake = totalStake.add(msg.value);
            emit deposit(msg.sender, msg.value);
            if (totalStake < minDelegationStk) {
                return;
            } else {
                //initialiate the delegation and change the state
                staking.delegate(
                    target,
                    address(this).balance,
                    staking.candidate_delegation_count(target),
                    staking.delegator_delegation_count(address(this))
                );
                currentState = daoState.STAKING;
            }
        } else {
            revert("The DAO is not accepting new stakes in the current state.");
        }
    }

    function withdraw(address payable account) public onlyRole(MEMBER) {
        require(
            currentState != daoState.STAKING,
            "The DAO is not in the correct state to withdraw."
        );
        if (currentState == daoState.REVOKING) {
            bool result = execute_revoke();
            require(result, "Schedule revoke delay is not finished yet.");
        }
        if (
            currentState == daoState.REVOKED ||
            currentState == daoState.COLLECTING
        ) {
            //Sanity checks
            if (staking.is_delegator(address(this))) {
                revert("The DAO is in an inconsistent state.");
            }
            require(totalStake != 0, "Cannot divide by zero.");
            //Calculate the withdrawal amount including staking rewards
            uint amount = address(this)
                .balance
                .mul(memberStakes[msg.sender])
                .div(totalStake);
            require(
                check_free_balance() >= amount,
                "Not enough free balance for withdrawal."
            );
            Address.sendValue(account, amount);
            totalStake = totalStake.sub(memberStakes[msg.sender]);
            memberStakes[msg.sender] = 0;
            emit withdrawal(msg.sender, account, amount);
        }
    }

    function schedule_revoke() public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            currentState == daoState.STAKING,
            "The DAO is not in the correct state to schedule a revoke."
        );
        staking.schedule_revoke_delegation(target);
        currentState = daoState.REVOKING;
    }

    function execute_revoke() internal onlyRole(MEMBER) returns (bool) {
        require(
            currentState == daoState.REVOKING,
            "The DAO is not in the correct state to execute a revoke."
        );
        staking.execute_delegation_request(address(this), target);
        if (staking.is_delegator(address(this))) {
            return false;
        } else {
            currentState = daoState.REVOKED;
            return true;
        }
    }

    function check_free_balance()
        public
        view
        onlyRole(MEMBER)
        returns (uint256)
    {
        return address(this).balance;
    }

    function change_target(
        address newCollator
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            currentState == daoState.REVOKED ||
                currentState == daoState.COLLECTING,
            "The DAO is not in the correct state to change staking target."
        );
        target = newCollator;
    }

    function reset_dao() public onlyRole(DEFAULT_ADMIN_ROLE) {
        currentState = daoState.COLLECTING;
    }

    function newPost(uint256 postId) public {
        postsUp[postId] = 1;
    }

    function upVote(uint256 postId) public returns (bool) {
        postsUp[postId] += 1;

        return checkVote(postId);
    }

    function downVote(uint256 postId) public returns (bool) {
        postsDown[postId] += 1;
        return checkVote(postId);
    }

    function checkVote(uint256 postId) public returns (bool) {
        if (postsUp[postId] < postsDown[postId]) {
            postStatus[postId] = false;

            return false;
        } else {
            return true;
        }
    }
}
