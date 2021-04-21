import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import './App.css';
import MyToken from './contracts/contracts/MyToken.sol/MyToken.json';
import contractAddress from './contracts/contracts/contract-address.json';

function App() {
  console.log('contractAddress: ', contractAddress);

  // let [isConnected, setIsConnected] = useState();
  // let [isLoading, setIsLoading] = useState();
  //
  // useEffect(() => {
  //   const init = async () => {
  //     //detect whether the browser is connected to a provider
  //     const provider = await detectEthereumProvider();
  //     if (provider) {
  //       startApp(provider);
  //     } else {
  //       alert('Please install MetaMask!');
  //       setIsConnected(false);
  //       setIsLoading(false);
  //       return;
  //     };
  //
  //     async function startApp(provider) {
  //       //The provider detected by detectEthereumProvider() is the same as window.ethereum
  //       if (provider !== window.ethereum) {
  //         alert('Do you have multiple wallets installed?');
  //         setIsConnected(false);
  //         setIsLoading(false);
  //         return;
  //       };
  //
  //       //ADD CHAIN ID CODE FROM METAMASK DOCS
  //
  //       const ethersProvider = new ethers.providers.Web3Provider(provider);
  //
  //
  //       const myToken = new ethers.Contract();
  //
  //       //create ricer instance to interact with deployed Ricer contract
  //       const networkId = await web3.eth.net.getId();
  //       const deploymentNetwork = Ricer.networks[networkId];
  //       if (deploymentNetwork !== undefined) {
  //         const deployedRicer = new web3.eth.Contract(
  //           Ricer.abi,
  //           deploymentNetwork.address
  //         );
  //         setRicer(deployedRicer);
  //       };
  //
  //       let accounts = await provider.request({ method: 'eth_accounts' });
  //       if (accounts.length > 0) {
  //         setIsConnected(true);
  //         setCurrentMetaMaskAccount(accounts[0]);
  //       };
  //     };
  //   };
  //   init();
  // }, []);

  return (
    <div className="app-margin">
      La la la...
    </div>
  );
}

export default App;
