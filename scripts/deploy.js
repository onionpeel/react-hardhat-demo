async function main() {
  //This script needs to be updated so that the deployer is a real account so that it can be put on a testnet

  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  //Deploy MyToken
  const MyToken = await ethers.getContractFactory('MyToken');
  const exp = ethers.BigNumber.from('10').pow(18);
  const initialValue = ethers.BigNumber.from('1000000').mul(exp);
  const myToken = await MyToken.deploy(initialValue);

  console.log("Token address:", myToken.address);

  setAddressInCompiledContracts(myToken, "MyToken");

  //Deploy Faucet
  const Faucet = await ethers.getContractFactory('Faucet');
  const faucet = await Faucet.deploy(myToken.address);

  console.log('faucet: ', faucet.address);

  setAddressInCompiledContracts(faucet, "Faucet");

  //transfer balance from deployer to faucet address;
  await myToken.transfer(faucet.address, initialValue);
  let faucetBalance = await myToken.balanceOf(faucet.address);
  let deployerBalance = await myToken.balanceOf(deployer.address);
  faucetBalance = faucetBalance/exp;
  deployerBalance = deployerBalance/exp;
  console.log('faucetBalance: ', faucetBalance);
  console.log('deployerBalance: ', deployerBalance);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

//This function gives the front end access to the address of the contract, which Ethers uses to generate a local instance
const setAddressInCompiledContracts = (instance, contractAsString) => {
  const fs = require("fs");
  const path = require('path');

  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts", "contracts", `${contractAsString}`);

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  };

  instanceAddressPath = path.join(contractsDir, "contract-address.json");
  //Write the address of the deployed contract to the src directory of the front end
  fs.writeFileSync(
    instanceAddressPath,
    JSON.stringify({ [contractAsString]: instance.address }, undefined, 2)
  );
};
