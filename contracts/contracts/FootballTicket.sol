// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

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
        string matchTitle;
        string venue;
        string matchDate;
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
    function buyTicket(
        uint256 eventId,
        uint256 quantity,
        string memory matchTitle,
        string memory venue,
        string memory matchDate,
        string memory /* tokenURI */
    ) public payable {
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
                eventId: eventId,
                matchTitle: matchTitle,
                venue: venue,
                matchDate: matchDate
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

    // Helper: Address to Hex String
    function addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2 * i + 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[2 * i + 3] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }

    // Helper: Uint to String
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    // Function override to return metadata URI for all tickets to save deployment & minting gas fees
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(tokenId < _nextTokenId, "This ticket does not exist yet!");
        TicketDetails memory details = ticketRegistry[tokenId];
        
        string memory buyerStr = addressToString(details.buyer);
        
        // Construct dynamic description with match details and buyer wallet
        string memory dynamicDesc = string(
            abi.encodePacked(
                "Official MetaCup Match Ticket. Valid for entry.\\n\\n",
                "Match: ", details.matchTitle, "\\n",
                "Venue: ", details.venue, "\\n",
                "Date: ", details.matchDate, "\\n",
                "Buyer: ", buyerStr, "\\n",
                "Ticket ID: TKT-", toString(tokenId)
            )
        );

        // Split attributes array packaging to prevent Solidity Stack Too Deep error
        string memory attributesStr = string(
            abi.encodePacked(
                '[{"trait_type": "Match", "value": "', details.matchTitle, '"},',
                '{"trait_type": "Venue", "value": "', details.venue, '"},',
                '{"trait_type": "Date", "value": "', details.matchDate, '"},',
                '{"trait_type": "Buyer Wallet", "value": "', buyerStr, '"},',
                '{"trait_type": "Ticket ID", "value": "TKT-', toString(tokenId), '"}]'
            )
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "MetaCup Ticket #', toString(tokenId), '", ',
                        '"description": "', dynamicDesc, '", ',
                        '"image": "ipfs://bafkreihj25pbqko6trc6seo6g3hjmxkw37a2tnvtt2rfusmyxpckx4dimm", ',
                        '"attributes": ', attributesStr, '}'
                    )
                )
            )
        );
        
        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    // Function 3 (Write/Admin): Uses the onlyOwner modifier
    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        // Sends all the collected ticket money to the football club (owner)
        payable(owner).transfer(balance);
    }
}