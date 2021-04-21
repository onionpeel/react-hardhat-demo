import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import './App.css';
import MyToken from './contracts/contracts/MyToken.sol/MyToken.json';
import myTokenContractAddress from './contracts/contracts/MyToken/contract-address.json';
import Faucet from './contracts/contracts/Faucet.sol/Faucet.json';
import faucetContractAddress from './contracts/contracts/Faucet/contract-address.json';

function App() {
  let [isConnected, setIsConnected] = useState();
  let [isLoading, setIsLoading] = useState();
  let [currentMetaMaskAccount, setCurrentMetaMaskAccount] = useState();
  let [myToken, setMyToken] = useState();
  let [faucet, setFaucet] = useState();
  let [tokenName, setTokenName] = useState();
  let [tokenSymbol, setTokenSymbol] = useState();
  let [userBalance, setUserBalance] = useState();
  let [faucetBalance, setFaucetBalance] = useState();

  let [tokensWanted, setTokensWanted] = useState();

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
          myTokenContractAddress.MyToken,
          MyToken.abi,
          ethersProvider.getSigner(0)
        );
        setMyToken(_myToken);

        //Create a reference to the deployed Faucet contract
        const _faucet = new ethers.Contract(
          faucetContractAddress.Faucet,
          Faucet.abi,
          ethersProvider.getSigner(0)
        )
        setFaucet(_faucet);

        getNameAndSymbol(_myToken);
        getFaucetBalance(_faucet);

        let signerAddress = await ethersProvider.getSigner(0).getAddress();
        getUserBalance(_myToken, signerAddress);

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

  const handleTokensWantedOnChange = e => {
    setTokensWanted(e.target.value);
  };

  const handleTokensWantedOnClick = async e => {
    const exp = ethers.BigNumber.from('10').pow(18);
    let amount = ethers.BigNumber.from(tokensWanted).mul(exp);
    await faucet.getTokens(amount);
  };

  const getTokenBalance = async () => {
    const exp = ethers.BigNumber.from('10').pow(18);
    let b = ethers.BigNumber.from(await myToken.balanceOf(currentMetaMaskAccount));
    b = b/exp;
    setUserBalance(b.toString());
    console.log('user balance: ', b.toString());
  };

  const getNameAndSymbol = async _myToken => {
    let name = await _myToken.name();
    setTokenName(name);
    let symbol = await _myToken.symbol();
    setTokenSymbol(symbol);
  };

  const getUserBalance = async (_myToken, account) => {
    const exp = ethers.BigNumber.from('10').pow(18);
    let b = await _myToken.balanceOf(account);
    b = b/exp;
    setUserBalance(b.toString());
  };

  const getFaucetBalance = async (_faucet) => {
    const exp = ethers.BigNumber.from('10').pow(18);
    let b = await _faucet.getFaucetOwnerBalance();
    b = b/exp;
    setFaucetBalance(b.toString());
  };

  return (
    <div className="app-margin">
      <div>
        The symbol for <b>{tokenName}</b> is <b>{tokenSymbol}</b>
      </div>
      <div>
        The faucet contract has <b>{faucetBalance}</b> <b>{tokenSymbol}</b> tokens
      </div>
      <br></br>
      <div>
        The current user address: {currentMetaMaskAccount}
      </div>
      <br></br>
      <div>
        The user's token balance is: {userBalance}
      </div>
      <div>
        <button onClick={getTokenBalance}>update balance</button>
      </div>
      <br></br>
      <div>
        <label htmlFor="amount">How many tokens do you want from the faucet contract? </label>
        <input type="text" id="amount" name="amount" onChange={handleTokensWantedOnChange}></input>
      </div>
      <div>
        <button onClick={handleTokensWantedOnClick}>Get your tokens</button>
      </div>
    </div>
  );
}

export default App;
