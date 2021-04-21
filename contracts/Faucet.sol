//SPDX-License-Identifier: MIT;
pragma solidity ^0.7.3;

import './MyToken.sol';

contract Faucet {
  MyToken myToken;

  constructor(MyToken _myToken) {
    myToken = _myToken;
  }

  function getTokens(uint amount) public {
    myToken.transfer(msg.sender, amount);
  }
}
