import React from 'react';
import './Header.css';
import { ethers, Contract, Signer } from 'ethers';
import { useState, useRef, useContext } from 'react';
import PostUploadForm from '../../Components/PostUpload/PostUploadComp';
import { MyContext } from '../Context';

const Header = () => {

//   const { walletAdd, walletBal } = React.useContext(MyContext);

  const [walletAddress, setWalletAddress] = useContext(MyContext);
  const [walletBalance, setwalletBalance] = useState('');
  const [chainId, setChainId] = useState(null);
  const curstate = false;
  // const contractAbi = abi.abi;
  // const contractByteCode = abi.bytecode;
  
  const inputRef = useRef();
  const [contractAddress, setContractAddress] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const coinDesc = [
    {"chainId":"0x5", "coinName": "ETH"},
    {"chainId":"0x13881", "coinName": "MATIC"}];

  const connectWallet = async () => {
    const chainId = (await window.ethereum.request({ method: "eth_chainId" }));
    if (window.ethereum) {
      await window.ethereum.enable();
      window.ethereum.request({method: 'eth_requestAccounts'})
      .then(result => {
        if(result.length != 0){
          setWalletAddress(result[0]);
          console.log(walletAddress);
          getCurrentBalance(result[0]);
          setChainId([chainId]);
          console.log(result[0]);
          console.log(walletAddress);
        }
        else
          console.error("No authorized account found");
      })
    } else {
      setErrorMessage('Please install MetaMask');
    }
  }

  const getCurrentBalance = (accountAddress) => {
    window.ethereum.request({method: 'eth_getBalance', params: [String(accountAddress), "latest"]})
    .then(balance => {
      setUserBalance(parseFloat(ethers.formatEther(balance)).toFixed(2));
    })
  }
//   const renderWalletAddress = walletAddress => {
//     if (walletAddress) {
//       const lastFiveChars = walletAddress.slice(-5);
//       console.log(lastFiveChars)
//       return lastFiveChars;
//     }
//     return null;
//   };
  return (
    <header className="header">
      <div className="left-corner">
        <a href='/'><span className="company-name">SphereDAO</span></a>
      </div>
      <nav className="navigation">
          
          <a href='/feed'><span className="navigation-item">Feed</span></a>
          <a href='/upload'><span className="navigation-item">Upload New Post</span></a>
    </nav>
      <div className="right-corner">
        <h6>Wallet Address: </h6><h6>{walletAddress && `${walletAddress.slice(-5)}`}</h6>
        <h6>User Balance: </h6> <h6>{userBalance} DEV</h6>
        <button onClick={connectWallet} className="connect-button">Connect Wallet</button>
        {walletAddress &&
        curstate && <PostUploadForm state = {{walletAddr: walletAddress}} ></PostUploadForm>
        }
      </div>
    </header>
  );
};

export default Header;
