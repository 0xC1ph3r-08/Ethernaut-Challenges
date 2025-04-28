async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const Fallback = await ethers.getContractFactory("Fallback");
    const fallback = await Fallback.deploy();
    await fallback.waitForDeployment(); // use this instead of .deployed() in newer versions
  
    const address = await fallback.getAddress();
    console.log("Fallback contract deployed to:", address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  