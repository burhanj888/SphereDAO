// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AlphaToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Alpha Token", "ALP") {
        _mint(msg.sender, initialSupply);
    }

    function mint(address sendTo, uint256 count) public {
        _mint(sendTo, count);
    }
}
