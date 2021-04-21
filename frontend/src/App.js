import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import './App.css';
import MyToken from './contracts/contracts/MyToken.sol/MyToken.json';
import contractAddress from './contracts/contracts/contract-address.json';

function App() {
  let [isConnected, setIsConnected] = useState();
  let [isLoading, setIsLoading] = useState();
  let [currentMetaMaskAccount, setCurrentMetaMaskAccount] = useState();
  let [myToken, setMyToken] = useState();
  let [tokenName, setTokenName] = useState();
  let [tokenSymbol, setTokenSymbol] = useState();

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
        console.log('ethersProvider: ', ethersProvider)
        //Create a reference to the deployed MyToken contract
        const _myToken = new ethers.Contract(
          contractAddress.MyToken,
          MyToken.abi,
          ethersProvider.getSigner(0)
        );
        setMyToken(_myToken);

        const signer = ethersProvider.getSigner();
        let addr = await signer.getAddress();
        console.log('signer: ', addr)

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

  const getName = async () => {
    let name = await myToken.name();
    console.log(name);
  };


  const getTokens = async () => {
    const exp = ethers.BigNumber.from('10').pow(18);
    let tokens = ethers.BigNumber.from(50).mul(exp);
    await myToken.connect('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266').approve(currentMetaMaskAccount, tokens);
    // await myToken.connect(currentMetaMaskAccount).transferFrom('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', currentMetaMaskAccount, tokens);
    // let bal = await myToken.balanceOf(currentMetaMaskAccount);
    // bal = bal/exp;
    // console.log(bal);
  };
  // const _getTokenData = async (_myToken) => {
  //   const name = await _myToken.name();
  //   setTokenName(name);
  //
  //   const symbol = await _myToken.symbol();
  //   setTokenSymbol(symbol);
  // };

  return (
    <div className="app-margin">
      <div>
        The symbol for <b></b> is <b>{tokenSymbol}</b>
      </div>
      <br></br>
      <div>
        The current user address: {currentMetaMaskAccount}
      </div>
      <br></br>
      <button onClick={getName}>get name</button>
      <div>
        {tokenName}
      </div>
      <button onClick={getTokens}>get tokens</button>
    </div>
  );
}

export default App;
