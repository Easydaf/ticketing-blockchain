// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FootballTicket is ERC721 {
    uint256 private _nextTokenId;
    address public owner; 
    
    uint256 public constant TICKET_PRICE = 0.01 ether; 
    uint256 public constant MAX_TICKETS = 1000;

    // Struct
    struct TicketDetails {
        address buyer;
        uint256 pricePaid;
        uint256 purchaseTime;
        uint256 eventId;
    }

    // Mapping
    mapping(uint256 => TicketDetails) public ticketRegistry;
    mapping(address => mapping(uint256 => uint256)) public ticketsPurchasedPerEvent;

    // Event
    event TicketPurchased(address indexed buyer, uint256 indexed ticketId, uint256 timestamp);

    constructor() ERC721("FootballMatchTicket", "FMT") {
        owner = msg.sender; 
    }

    // Modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Access Denied: Only the contract owner can call this!");
        _;
    }

    // ==========================================
    // RUBRIC 2 & 3: FUNCTIONS & REQUIRE
    // ==========================================

    // Function 1 (Write): The main logic to buy a ticket
    function buyTicket(uint256 eventId, uint256 quantity, string memory /* tokenURI */) public payable {
        // Require: Rules that must be met to proceed
        require(quantity > 0, "Quantity must be at least 1.");
        require(ticketsPurchasedPerEvent[msg.sender][eventId] + quantity <= 2, "Purchase limit exceeded: Max 2 tickets per event per wallet.");
        require(msg.value >= TICKET_PRICE * quantity, "Not enough ETH sent to buy the tickets.");
        require(_nextTokenId + quantity <= MAX_TICKETS, "Sorry, the match is sold out!");

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _nextTokenId++;
            
            // Save the data into our custom Struct and Mapping
            ticketRegistry[tokenId] = TicketDetails({
                buyer: msg.sender,
                pricePaid: TICKET_PRICE,
                purchaseTime: block.timestamp,
                eventId: eventId
            });

            // Mint the NFT
            _mint(msg.sender, tokenId);

            // Trigger the event notification
            emit TicketPurchased(msg.sender, tokenId, block.timestamp);
        }

        ticketsPurchasedPerEvent[msg.sender][eventId] += quantity;
    }

    // Function 2 (View): To read data without spending gas fees
    function getTicketInfo(uint256 ticketId) public view returns (address, uint256, uint256, uint256) {
        require(ticketId < _nextTokenId, "This ticket does not exist yet!");
        
        TicketDetails memory details = ticketRegistry[ticketId];
        return (details.buyer, details.pricePaid, details.purchaseTime, details.eventId);
    }

    // Function override to return metadata URI for all tickets to save deployment & minting gas fees
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(tokenId < _nextTokenId, "This ticket does not exist yet!");
        return "ipfs://bafkreieo5xbybigup2yftevba5c5ois43fnaazs7uin2ftre4zpeiukynu";
    }

    // Function 3 (Write/Admin): Uses the onlyOwner modifier
    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        // Sends all the collected ticket money to the football club (owner)
        payable(owner).transfer(balance);
    }
}