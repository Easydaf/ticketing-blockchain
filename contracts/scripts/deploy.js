import { network } from "hardhat";

async function main() {
  console.log("Starting Hardhat 3 deployment...");

  // Hardhat 3's new way to load ethers and connect to the network
  const { ethers, networkName } = await network.create();
  console.log(`Connected to: ${networkName}`);

  // Hardhat 3 makes deploying a one-liner!
  const ticket = await ethers.deployContract("FootballTicket");
  
  console.log("Waiting for transaction to finish...");
  await ticket.waitForDeployment();

  // Get the final address
  const address = await ticket.getAddress();
  console.log(`✅ FootballTicket successfully deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});