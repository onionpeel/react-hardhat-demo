//SPDX-License-Identifier: MIT;
pragma solidity ^0.7.3;

import './MyToken.sol';
import 'hardhat/console.sol';

contract Faucet {
  MyToken myToken;

  constructor(MyToken _myToken) {
    myToken = _myToken;
  }

  function getTokens(uint amount) public {
    console.log(amount);
    myToken.transfer(msg.sender, amount);
    console.log(myToken.balanceOf(address(this)));
    console.log(myToken.balanceOf(msg.sender));
  }

  function getFaucetOwnerBalance() public view returns (uint) {
    return myToken.balanceOf(address(this));
  }
}
