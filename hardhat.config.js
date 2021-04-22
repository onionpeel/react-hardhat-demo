require('dotenv').config()
require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
  paths: {
    artifacts: './frontend/src/contracts'
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_ACCOUNT_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};
