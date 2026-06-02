// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract FootballTicket is ERC721URIStorage {
    uint256 private _nextTokenId;
    address public owner; 
    
    uint256 public constant TICKET_PRICE = 0.01 ether; 
    uint256 public constant MAX_TICKETS = 1000;

    // Struct
    struct TicketDetails {
        address buyer;
        uint256 pricePaid;
        uint256 purchaseTime;
    }

    // Mapping
    mapping(uint256 => TicketDetails) public ticketRegistry;

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
    function buyTicket(string memory tokenURI) public payable {
        // Require: Rules that must be met to proceed
        require(msg.value >= TICKET_PRICE, "Not enough ETH sent to buy the ticket.");
        require(_nextTokenId < MAX_TICKETS, "Sorry, the match is sold out!");

        uint256 tokenId = _nextTokenId++;
        
        // Save the data into our custom Struct and Mapping
        ticketRegistry[tokenId] = TicketDetails({
            buyer: msg.sender,
            pricePaid: msg.value,
            purchaseTime: block.timestamp // block.timestamp gets the current network time
        });

        // Mint the NFT and set the Pinata IPFS link
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        // Trigger the event notification
        emit TicketPurchased(msg.sender, tokenId, block.timestamp);
    }

    // Function 2 (View): To read data without spending gas fees
    function getTicketInfo(uint256 ticketId) public view returns (address, uint256, uint256) {
        require(ticketId < _nextTokenId, "This ticket does not exist yet!");
        
        TicketDetails memory details = ticketRegistry[ticketId];
        return (details.buyer, details.pricePaid, details.purchaseTime);
    }

    // Function 3 (Write/Admin): Uses the onlyOwner modifier
    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        // Sends all the collected ticket money to the football club (owner)
        payable(owner).transfer(balance);
    }
}