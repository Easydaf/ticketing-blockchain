# E-Ticketing using Smart Contract for Football Ticket

A blockchain-based e-ticketing system for football events that leverages smart contracts to ensure secure, transparent, and verifiable ticket distribution and validation.

## Project Overview

This project combines Ethereum smart contracts with a modern web frontend to create a decentralized ticketing platform for football matches. Key features include:

- **Smart Contract-Based Ticketing**: Secure ticket issuance and management using Solidity smart contracts
- **NFT Tickets**: Tickets implemented as non-fungible tokens for authenticity and uniqueness
- **Ticket Validation**: On-chain verification of ticket authenticity
- **Role-Based Access**: Support for different user roles (Admin, Panitia/Event Organizer, Attendees)
- **User-Friendly Interface**: Modern React-based frontend for ticket management

## Technology Stack

- **Blockchain**: Ethereum (Sepolia testnet)
- **Smart Contract Language**: Solidity
- **Smart Contract Development**: Hardhat (for contract development reference)
- **Frontend Framework**: React with Vite
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## Requirements

### Prerequisites

- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher (comes with Node.js)
- **Git**: For version control

### Additional Requirements

- **MetaMask or Web3 Wallet**: For interacting with the blockchain (Chrome, Firefox, or Brave extensions)
- **Sepolia ETH**: Free test ETH from a [faucet](https://sepolia-faucet.pk910.de/) to pay for transactions

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ticketing-blockchain
```

### 2. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

**Note:** Smart contracts are already deployed on Sepolia testnet, so no contract compilation or deployment is needed.

## Running the Project

### 1. Configure Wallet for Sepolia

The smart contract is already deployed on the **Sepolia testnet** at:
```
0x90e3060d25f9c983c226B7e1AAC1CC2A403A3B05
```

To run the application:
1. Install **MetaMask** or another Web3 wallet extension
2. Add Sepolia network to your wallet (or use automatic detection)
3. Fund your wallet with Sepolia ETH from a [Sepolia faucet](https://sepolia-faucet.pk910.de/)

### 2. Start the Frontend Development Server

Navigate to the frontend directory and start the development server:

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use)

### 3. Connect Your Wallet

1. Open the application in your browser
2. Click "Connect Wallet" in the application
3. Select your Web3 wallet and approve the connection
4. Ensure you're connected to the **Sepolia testnet**

## Project Structure

```
ticketing-blockchain/
├── contracts/              # Smart contracts directory
│   ├── contracts/         # Solidity smart contract files
│   ├── scripts/           # Deployment scripts
│   ├── hardhat.config.js  # Hardhat configuration
│   └── package.json       # Contract dependencies
│
├── frontend/              # Frontend application
│   ├── src/              # React source code
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   └── App.jsx       # Main App component
│   ├── vite.config.js    # Vite configuration
│   └── package.json      # Frontend dependencies
│
└── README.md             # Project documentation
```

## Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Configuration

The contract address is already configured in `frontend/src/contractInfo.js`:

```javascript
export const CONTRACT_ADDRESS = "0x90e3060d25f9c983c226B7e1AAC1CC2A403A3B05"; // Sepolia testnet
```

The contract ABI is also pre-configured in the same file. No additional configuration is needed to run the application.

## Usage

1. Open the application in your browser
2. Connect your Web3 wallet (MetaMask)
3. Depending on your role:
   - **Admin**: Manage events and ticket distribution
   - **Panitia**: Organize events and validate tickets
   - **Users**: Purchase and manage tickets

## Troubleshooting

- **Port Already in Use**: Change the port in `vite.config.js` or stop the service using the port
- **MetaMask Connection Issues**: Ensure you're connected to the **Sepolia testnet**. Add the Sepolia network if not available
- **Insufficient Funds**: Get free Sepolia ETH from a [faucet](https://sepolia-faucet.pk910.de/)
- **Contract Address Not Found**: The contract is at `0x90e3060d25f9c983c226B7e1AAC1CC2A403A3B05` on Sepolia
- **Transaction Fails**: Check your wallet balance and ensure you have enough Sepolia ETH for gas fees

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues or questions, please create an issue in the repository.
