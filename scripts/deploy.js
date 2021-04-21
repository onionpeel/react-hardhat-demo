async function main() {
  //This script needs to be updated so that the deployer is a real account so that it can be put on a testnet

  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const MyToken = await ethers.getContractFactory('MyToken');
  const exp = ethers.BigNumber.from('10').pow(18);
  const initialValue = ethers.BigNumber.from('100').mul(exp);
  const myToken = await MyToken.deploy(initialValue);

  console.log("Token address:", myToken.address);

  setMyTokenAddressInCompiledContracts(myToken)
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


const setMyTokenAddressInCompiledContracts = myToken => {
  const fs = require("fs");
  const path = require('path');

  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  };

  myTokenAddressPath = path.join(contractsDir, "contract-address.json");

  fs.writeFileSync(
    myTokenAddressPath,
    JSON.stringify({ MyToken: myToken.address }, undefined, 2)
  );
};
