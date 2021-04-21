async function main() {
  //This script needs to be updated so that the deployer is a real account so that it can be put on a testnet

  // const [deployer] = await ethers.getSigners();
  //
  // console.log(
  //   "Deploying contracts with the account:",
  //   deployer.address
  // );
  //
  // console.log("Account balance:", (await deployer.getBalance()).toString());
  //
  // const MyToken = await ethers.getContractFactory('MyToken');
  // const exp = ethers.BigNumber.from('10').pow(18);
  // const initialValue = ethers.BigNumber.from('100').mul(exp);
  // const myToken = await MyToken.deploy(initialValue);
  //
  // console.log("Token address:", myToken.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
