//SPDX-License-Identifier: MIT;
pragma solidity ^0.7.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
  constructor(uint256 _initialAmount) ERC20("MyToken", "MYT") {
    _mint(msg.sender, _initialAmount);
  }
}
