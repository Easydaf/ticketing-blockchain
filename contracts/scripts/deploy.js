import { network } from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Starting Hardhat 3 deployment...");

  // Hardhat 3's way to load ethers and connect to the network
  const { ethers, networkName } = await network.create();
  console.log(`Connected to: ${networkName}`);

  const ticket = await ethers.deployContract("FootballTicket");
  
  console.log("Waiting for transaction to finish...");
  await ticket.waitForDeployment();

  // Get the final address
  const address = await ticket.getAddress();
  console.log(`✅ FootballTicket successfully deployed to: ${address}`);

  // Auto-update the frontend contractInfo.js file with new address and ABI
  try {
    const artifactPath = path.resolve(__dirname, "../artifacts/contracts/FootballTicket.sol/FootballTicket.json");
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    
    const contractInfoPath = path.resolve(__dirname, "../../frontend/src/contractInfo.js");
    
    const fileContent = `// src/contractInfo.js

// Replace this with your actual contract address from GitHub
export const CONTRACT_ADDRESS = "${address}"; 

// Replace this array with the massive JSON wall of text from your ABI file
export const CONTRACT_ABI = ${JSON.stringify(artifact.abi, null, 2)};
`;

    fs.writeFileSync(contractInfoPath, fileContent, "utf8");
    console.log(`✅ Frontend contractInfo.js updated successfully!`);
  } catch (err) {
    console.error("Failed to update frontend contractInfo.js:", err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});