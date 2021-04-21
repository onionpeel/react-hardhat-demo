import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import './App.css';
import MyToken from './contracts/contracts/MyToken.sol/MyToken.json';
import contractAddress from './contracts/contracts/contract-address.json';

function App() {
  let [isConnected, setIsConnected] = useState();
  let [isLoading, setIsLoading] = useState();
  let [currentMetaMaskAccount, setCurrentMetaMaskAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      //detect whether the browser is connected to a provider
      const provider = await detectEthereumProvider();
      if (provider) {
        startApp(provider);
      } else {
        alert('Please install MetaMask!');
        setIsConnected(false);
        setIsLoading(false);
        return;
      };

      async function startApp(provider) {
        //The provider detected by detectEthereumProvider() is the same as window.ethereum
        if (provider !== window.ethereum) {
          alert('Do you have multiple wallets installed?');
          setIsConnected(false);
          setIsLoading(false);
          return;
        };

        //ADD CHAIN ID CODE FROM METAMASK DOCS
        //POLLING?
        //ERROR HANDLING

        const ethersProvider = new ethers.providers.Web3Provider(provider);
        //Create a reference to the deployed MyToken contract
        const myToken = new ethers.Contract(
          contractAddress.MyToken,
          MyToken.abi,
          ethersProvider
        );
        //Create a reference in state to the current MetaMask account
        let accounts = await provider.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          setCurrentMetaMaskAccount(accounts[0]);
        };
      };
    };
    init();
  }, []);

  return (
    <div className="app-margin">
      <div>
        The current user address: {currentMetaMaskAccount}
      </div>
      <br></br>
      La la la...
    </div>
  );
}

export default App;
