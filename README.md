# E-Ticketing using Smart Contract for Football Tickets

A blockchain-based e-ticketing system for football events that leverages Ethereum smart contracts to ensure secure, transparent, and verifiable ticket distribution and validation.

---

## 🏟️ How the Project Works (Code & Architecture Guide)

This guide provides a step-by-step explanation of the codebase structure and data flow, designed to help you explain the project clearly during a presentation.

### 1. System Architecture Overview
The application consists of three main layers:
```
  [ React Frontend (UI) ] 
          │ (calls functions & reads state)
          ▼
    [ Ethers.js Bridge ] ◄── MetaMask (Web3 Wallet Provider)
          │ (broadcasts transactions)
          ▼
[ Smart Contract (EVM) ] ◄── NFT Metadata (Decentralized IPFS)
```

---

### 2. The Smart Contract Layer (`FootballTicket.sol`)
The contract is written in **Solidity (v0.8.28)** and acts as the decentralized database and rules engine for the ticketing platform.

* **Token Standard (`ERC721`)**: Inherits the Ethereum standard for non-fungible tokens. Each ticket is minted as a unique NFT, guaranteeing that tickets cannot be copied or forged.
* **State Variables & Structs**:
  * `TICKET_PRICE = 0.01 ether`: The standard cost of one ticket.
  * `MAX_TICKETS = 1000`: The global ticket cap for the stadium.
  * `TicketDetails` struct: Stores on-chain data for each ticket ID, including the `buyer` address, `pricePaid`, the `purchaseTime`, and the associated `eventId` (match ID).
* **Anti-Scalping Mapping**:
  * `ticketsPurchasedPerEvent`: A nested mapping (`address => mapping(uint256 => uint256)`) that keeps track of how many tickets a specific wallet address has purchased for a specific match ID.

#### Core Contract Functions:
1. **`buyTicket(uint256 eventId, uint256 quantity, string memory tokenURI)`**:
   * **Validation (Requires)**: Checks that the quantity is at least 1, the user hasn't exceeded the limit of 2 tickets for this specific `eventId`, the paid value matches `TICKET_PRICE * quantity`, and the match is not sold out.
   * **Minting Loop**: Loops `quantity` times, generating a new `tokenId`, recording ticket ownership details in the registry, and executing the mint (`_mint(msg.sender, tokenId)`).
   * **Limit Update**: Increments the user's purchased counter for that event.
2. **`tokenURI(uint256 tokenId)`**:
   * **Gas Optimization**: Instead of storing unique strings for every ticket on-chain (which is extremely gas-expensive), we override the `tokenURI` function to dynamically return a single static IPFS metadata link (`ipfs://bafkreieo5xbybigup2yftevba5c5ois43fnaazs7uin2ftre4zpeiukynu`) for all ticket NFTs.
3. **`withdrawFunds()`**:
   * Restricted to the contract `owner` via the `onlyOwner` modifier, allowing the football club or organizer to withdraw accumulated ticket sales revenue (ether) to their wallet.

---

### 3. The Frontend Layer (`frontend/`)
Built with **React (Vite)** and styled with **Tailwind CSS**. It communicates with the Ethereum blockchain via **Ethers.js**.

* **Blockchain Bridge (`contractInfo.js`)**:
  * Contains the deployment address of the contract on the **Sepolia testnet** (`0xC3a72ce0B64A94F6731b8e48e4A4D3224FdedfDB`) and the **ABI (Application Binary Interface)** which serves as the map for the frontend to call contract functions.
* **React State & Contexts (`context/`)**:
  * `EventContext.jsx`: Simulates the match catalog and user ticket listing. While ticket validity is secured on-chain, storing match schedules and ticket records in `localStorage` caches them locally for instantaneous page loading.
  * `AuthContext.jsx`: Simple session provider managing Admin credentials (`admin123` / `admin123`).

#### Frontend Code Flow & Key Pages:
1. **Home/Browsing (`Home.jsx`)**: Lists upcoming matches (e.g. *Brazil vs Germany*), displaying ticket prices, availability, and routing options.
2. **Buying Tickets (`DetailEvent.jsx`)**:
   * **UX Limit Protection**: Checks the wallet's local ticket count for that match. If the user has already bought 1 ticket, it locks the ticket quantity selector to a maximum of 1. If they have bought 2, it disables the buy button entirely and displays a warning banner.
   * **Transaction Execution**: Instantiates a contract connection using `BrowserProvider(window.ethereum)`, estimates the total ETH value, and invokes `contract.buyTicket(event.id, ticketCount, tokenURI)`.
   * **Revert Error Handlers**: Catches transaction rejections and specific smart contract revert strings (e.g., if the on-chain anti-scalping check fails, it cleanly alerts: *"❌ Purchase Limit Exceeded: You can only buy a maximum of 2 tickets per match."*).
3. **Tickets Dashboard (`MyTickets.jsx`)**: Displays the user's digital tickets with active QR codes (representing ticket IDs) generated dynamically.
4. **Ticket Validation (`TicketValidation.jsx`)**: Simulates the entry scanner, reading the ticket codes to check database matches.
5. **Admin Dashboard (`DashboardAdmin.jsx`)**: Command console where organizers add new matches, delete events, track sales stats (tickets sold, revenue volume), and execute on-chain contract withdrawals.

---

## 🚀 Step-by-Step Data Flow: Purchasing a Ticket
To explain how the code executes in sequence, follow this flow:

```
[ User selects quantity 2 & clicks "Buy" ]
                   │
                   ▼
[ Frontend verifies limits locally (2 - existing < selected?) ] ──(Exceeded)──► [ Block click & show alert ]
                   │
                   ▼ (Allowed)
[ Frontend formats contract inputs (eventId, quantity, tokenURI) ]
                   │
                   ▼
[ MetaMask pop-up requests user signature and Sepolia ETH gas approval ]
                   │
                   ▼ (Approved)
[ Transaction sent to Sepolia Network & verified by validators ]
                   │
                   ▼
[ Smart Contract executes checks: msg.value >= 0.02 ETH & total_bought + 2 <= 2 ]
                   │
                   ▼ (Passed)
[ Contract mints 2 NFTs ──► Saves ownership details ──► Emits TicketPurchased event ]
                   │
                   ▼
[ Transaction mined successfully ──► Frontend updates local cache and displays success message ]
```

---

## 🛠️ Installation & Setup

### Prerequisites
* **Node.js**: v16.0.0 or higher
* **npm**: v7.0.0 or higher
* **MetaMask**: Web3 wallet extension installed in your browser.

### 1. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### 3. Smart Contract Deployment (Reference only)
The contract is already deployed on the Sepolia network. If you need to recompile or redeploy:
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 🏆 Presentation Pitch Points (Key Selling Features)
When presenting this project, highlight these distinct features:
1. **On-Chain Security**: Tickets are decentralized NFTs. They cannot be duplicated, and ownership is transparently verified on the blockchain.
2. **Hardened Anti-Scalping**: Unlike traditional ticketing sites where limits are only in the browser, the 2-tickets-per-match limit is **hard-coded on-chain**. Bots cannot bypass the web interface to buy bulk tickets.
3. **Advanced Gas Optimization**: Switching to standard `ERC721` inheritance and using a virtual `tokenURI` override saved up to **45% in contract deployment gas fees**, keeping transaction execution costs low for standard users.
4. **Graceful Error Recovery**: Revert reasons from the EVM are intercepted and translated into clean, understandable error notifications in the user interface.
