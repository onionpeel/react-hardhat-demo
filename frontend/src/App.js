import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import './App.css';
import MyToken from './contracts/contracts/MyToken.sol/MyToken.json';
import myTokenContractAddress from './contracts/contracts/MyToken/contract-address.json';
import Faucet from './contracts/contracts/Faucet.sol/Faucet.json';
import faucetContractAddress from './contracts/contracts/Faucet/contract-address.json';

function App() {
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
        setIsLoading(false);
        return;
      };

      async function startApp(provider) {
        //The provider detected by detectEthereumProvider() is the same as window.ethereum
        if (provider !== window.ethereum) {
          alert('Do you have multiple wallets installed?');
          setIsLoading(false);
          return;
        };

        //ADD CHAIN ID CODE FROM METAMASK DOCS
        //POLLING?
        //ERROR HANDLING

        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();
        let signerAddress = await signer.getAddress();
        setCurrentMetaMaskAccount(signerAddress);

        //Create a reference to the deployed MyToken contract
        const _myToken = new ethers.Contract(
          myTokenContractAddress.MyToken,
          MyToken.abi,
          signer
        );
        setMyToken(_myToken);

        //Create a reference to the deployed Faucet contract
        const _faucet = new ethers.Contract(
          faucetContractAddress.Faucet,
          Faucet.abi,
          signer
        )
        setFaucet(_faucet);

        //set various properties into state
        getNameAndSymbol(_myToken);
        getFaucetBalance(_faucet);
        getUserBalance(_myToken, signerAddress);
      };
    };
    init();
  }, []);

  const handleTokensWantedOnChange = e => {
    setTokensWanted(e.target.value);
  };

  const handleTokensWantedOnClick = async e => {
    setIsLoading(true);
    const exp = ethers.BigNumber.from('10').pow(18);
    let amount = ethers.BigNumber.from(tokensWanted).mul(exp);
    let tx = await faucet.getTokens(amount);
    await tx.wait();
    setIsLoading(false);
  };

  const handleOnReturn = async () => {
    setIsLoading(true);
    let roundedUserBalance = Math.floor(userBalance);
    const exp = ethers.BigNumber.from('10').pow(18);
    const returnAmount = ethers.BigNumber.from(roundedUserBalance).mul(exp);
    let tx = await myToken.transfer(faucet.address, returnAmount);
    await tx.wait();
    setIsLoading(false);
  };

  const getTokenBalance = async () => {
    setIsLoading(true);
    const exp = ethers.BigNumber.from('10').pow(18);
    let b = ethers.BigNumber.from(await myToken.balanceOf(currentMetaMaskAccount));
    b = b/exp;
    setUserBalance(b.toString());
    setIsLoading(false);
  };

  const getNameAndSymbol = async _myToken => {
    let name = await _myToken.name();
    setTokenName(name);
    let symbol = await _myToken.symbol();
    setTokenSymbol(symbol);
  };

  const getUserBalance = async (_myToken, account) => {
    setIsLoading(true);
    const exp = ethers.BigNumber.from('10').pow(18);
    let b = await _myToken.balanceOf(account);
    b = b/exp;
    setUserBalance(b.toString());
    setIsLoading(false);
  };

  const getFaucetBalance = async (_faucet) => {
    setIsLoading(true);
    const exp = ethers.BigNumber.from('10').pow(18);
    let b = await _faucet.getFaucetOwnerBalance();
    b = b/exp;
    setFaucetBalance(b.toString());
    setIsLoading(false);
  };

  return (
    <div className="app-margin">
      <div>
        The symbol for <b>{tokenName}</b> is <b>{tokenSymbol}</b>
      </div>
      <div>
        The faucet contract has <b>{faucetBalance}</b> <b>{tokenSymbol}</b> tokens
      </div>
      <div>
        Refresh browser to update faucet contract balance
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
        <button onClick={handleTokensWantedOnClick}>Get tokens</button>
      </div>
      <br></br>
      <div>
        <b>Please return all your tokens when you are finished so the faucet contract does not become empty</b>
      </div>
      <div>
        <button onClick={handleOnReturn}>Return tokens</button>
      </div>
      <br></br>
      <div>
        {isLoading ? "Loading . . ." : ""}
      </div>
    </div>
  );
}

export default App;
