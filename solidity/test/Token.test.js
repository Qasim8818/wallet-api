const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ChainstackDollars", function () {
  let token;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const Token = await ethers.getContractFactory("ChainstackDollars");
    token = await Token.deploy("ChainstackDollars", "CHSD", 1000000);
    await token.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await token.balanceOf(owner.address)).to.equal(
        ethers.utils.parseEther("1000000")
      );
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await token.transfer(addr1.address, ethers.utils.parseEther("50"));
      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(ethers.utils.parseEther("50"));
    });
  });
});