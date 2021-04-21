const { expect } = require('chai');

describe('MyToken', () => {
  const exp = ethers.BigNumber.from('10').pow(18);
  let MyToken, myToken;

  beforeEach(async () => {
    MyToken = await ethers.getContractFactory('MyToken');
    const initialValue = ethers.BigNumber.from('100').mul(exp);
    myToken = await MyToken.deploy(initialValue);
    await myToken.deployed();

  });

  it('should create a new contract', async () => {
    expect(myToken.address).to.not.equal('0x');
    expect(myToken.address).to.not.equal('undefined');
    expect(myToken.address).to.not.equal('null');
    expect(myToken.address).to.not.equal('');
  });

  it('should be named "MyToken"', async () => {
    let name = await myToken.name();
    expect(name).to.equal('MyToken');
  });

  it('should have a symbol "MYT"', async () => {
    let symbol = await myToken.symbol();
    expect(symbol).to.equal('MYT');
  });

  it('should have a value of 100 tokens', async () => {
    let supply = await myToken.totalSupply();
    supply = (supply/exp).toString();
    expect(supply).to.equal('100');
  });

  it('should transfer 10 tokens', async () => {
    const [a0, a1] = await ethers.getSigners();
    let transferAmount = ethers.BigNumber.from('10').mul(exp);
    await myToken.transfer(a1.address, transferAmount);

    let a0Bal = await myToken.balanceOf(a0.address);
    a0Bal = (a0Bal/exp).toString();
    expect(a0Bal).to.equal('90');

    let a1Bal = await myToken.balanceOf(a1.address);
    a1Bal = (a1Bal/exp).toString();
    expect(a1Bal).to.equal('10');
  });

  it('should transferFrom() five tokens', async () => {
    const [a0, a1] = await ethers.getSigners();
    let transferAmount = ethers.BigNumber.from('10').mul(exp);
    await myToken.transfer(a1.address, transferAmount);

    await myToken.connect(a1).approve(a0.address, ethers.BigNumber.from('5').mul(exp));
    await myToken.transferFrom(a1.address, a0.address, ethers.BigNumber.from('5').mul(exp));

    let a0Bal = await myToken.balanceOf(a0.address);
    a0Bal = (a0Bal/exp).toString();
    expect(a0Bal).to.equal('95');

    let a1Bal = await myToken.balanceOf(a1.address);
    a1Bal = (a1Bal/exp).toString();
    expect(a1Bal).to.equal('5');
  });
});
