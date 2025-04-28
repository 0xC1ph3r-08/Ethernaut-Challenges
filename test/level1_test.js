const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Fallback contract", function () {
    let fallbackContract;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        const Fallback = await ethers.getContractFactory("Fallback");
        fallbackContract = await Fallback.deploy(); // Already deployed
    });

    it("should set deployer as initial owner and contribution", async function () {
        expect(await fallbackContract.owner()).to.equal(owner.address);
        const initialContribution = await fallbackContract.contributions(owner.address);
        expect(initialContribution).to.equal(ethers.parseEther("1000"));
    });

    it("should allow contribution < 0.001 ether and update contributions", async function () {
        const value = ethers.parseEther("0.0005");
        await fallbackContract.connect(addr1).contribute({ value });
        const contribution = await fallbackContract.contributions(addr1.address);
        expect(contribution).to.equal(value);
    });

    it("should not allow contribution >= 0.001 ether", async function () {
        const value = ethers.parseEther("0.001");
        await expect(
            fallbackContract.connect(addr1).contribute({ value })
        ).to.be.reverted;
    });

    it("should change owner when contribution exceeds current owner's and fallback is triggered", async function () {
        const value = ethers.parseEther("0.0008");
    
        await fallbackContract.connect(addr1).contribute({ value });
    
        await addr1.sendTransaction({
            to: fallbackContract.target,
            value: ethers.parseEther("0.0001"), 
        });
    
        expect(await fallbackContract.owner()).to.equal(addr1.address);
    });
    
    

});
