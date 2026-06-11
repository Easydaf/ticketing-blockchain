// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title FootballTicket
 * @dev A smart contract for minting and managing NFT tickets for football matches.
 * Inherits ERC721 standard from OpenZeppelin.
 */
contract FootballTicket is ERC721 {
    // Counter for assigning the next unique NFT token ID
    uint256 private _nextTokenId;
    
    // Address of the contract deployer (owner) who has administrative access (e.g. withdrawing funds)
    address public owner; 
    
    // Constant ticket price set to 0.01 ether per ticket
    uint256 public constant TICKET_PRICE = 0.01 ether; 
    
    // Hard limit on the maximum number of tickets that can be minted
    uint256 public constant MAX_TICKETS = 1000;

    /**
     * @dev Structure containing details of each minted ticket.
     * @param buyer The address of the account that purchased the ticket.
     * @param pricePaid The amount of ETH paid for the ticket.
     * @param purchaseTime The block timestamp when the ticket was bought.
     * @param eventId The unique identifier of the football match/event.
     * @param matchTitle The title of the match.
     * @param venue The location/stadium of the match.
     * @param matchDate The scheduled date of the match.
     */
    struct TicketDetails {
        address buyer;
        uint256 pricePaid;
        uint256 purchaseTime;
        uint256 eventId;
        string matchTitle;
        string venue;
        string matchDate;
    }

    /**
     * @dev Mapping from token ID to its respective TicketDetails.
     * Keeps a registry of all purchased tickets.
     */
    mapping(uint256 => TicketDetails) public ticketRegistry;
    
    /**
     * @dev Mapping to track the number of tickets purchased per user address per event ID.
     * Used to enforce the limit of 2 tickets per event per wallet.
     */
    mapping(address => mapping(uint256 => uint256)) public ticketsPurchasedPerEvent;

    /**
     * @dev Event emitted when a ticket is successfully purchased and minted.
     * @param buyer Address of the ticket purchaser.
     * @param ticketId Unique ID of the minted ticket NFT.
     * @param timestamp The time of purchase.
     */
    event TicketPurchased(address indexed buyer, uint256 indexed ticketId, uint256 timestamp);

    /**
     * @dev Constructor initializes the ERC721 token with name "FootballMatchTicket" and symbol "FMT".
     * Also sets the owner of the contract to the deployer.
     */
    constructor() ERC721("FootballMatchTicket", "FMT") {
        owner = msg.sender; 
    }

    /**
     * @dev Modifier that restricts function access to the contract owner only.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Access Denied: Only the contract owner can call this!");
        _;
    }

    // ==========================================
    // FUNCTIONS
    // ==========================================

    /**
     * @notice Purchases one or more tickets for a specific football match.
     * @dev Mints one NFT per ticket purchased. Enforces validation rules (price, maximum ticket limit, and 2-tickets-per-wallet rule).
     * @param eventId The ID of the match event.
     * @param quantity The number of tickets to purchase.
     * @param matchTitle The name of the football match.
     * @param venue The venue of the match.
     * @param matchDate The date of the match.
     */
    function buyTicket(
        uint256 eventId,
        uint256 quantity,
        string memory matchTitle,
        string memory venue,
        string memory matchDate,
        string memory /* tokenURI */
    ) public payable {
        // Validation: Must purchase at least one ticket
        require(quantity > 0, "Quantity must be at least 1.");
        
        // Validation: Limit purchases to maximum of 2 tickets per user per event
        require(ticketsPurchasedPerEvent[msg.sender][eventId] + quantity <= 2, "Purchase limit exceeded: Max 2 tickets per event per wallet.");
        
        // Validation: Ensure sufficient ETH was sent to cover the total ticket price
        require(msg.value >= TICKET_PRICE * quantity, "Not enough ETH sent to buy the tickets.");
        
        // Validation: Ensure the transaction does not exceed the absolute capacity limit of the contract
        require(_nextTokenId + quantity <= MAX_TICKETS, "Sorry, the match is sold out!");

        // Loop to mint each ticket individually
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _nextTokenId++;
            
            // Save the purchase details into the mapping registry
            ticketRegistry[tokenId] = TicketDetails({
                buyer: msg.sender,
                pricePaid: TICKET_PRICE,
                purchaseTime: block.timestamp,
                eventId: eventId,
                matchTitle: matchTitle,
                venue: venue,
                matchDate: matchDate
            });

            // Mint the ERC721 token (NFT ticket) to the buyer's wallet
            _mint(msg.sender, tokenId);

            // Emit the event to notify listeners of a successful purchase
            emit TicketPurchased(msg.sender, tokenId, block.timestamp);
        }

        // Update the user's purchased ticket count for this event
        ticketsPurchasedPerEvent[msg.sender][eventId] += quantity;
    }

    /**
     * @notice Retrieves basic information for a given ticket ID.
     * @dev A public view function allowing off-chain queries without gas fees.
     * @param ticketId The ID of the ticket NFT to query.
     * @return buyer The wallet address of the ticket owner.
     * @return pricePaid The cost of the ticket in wei.
     * @return purchaseTime The timestamp of purchase.
     * @return eventId The ID of the event/match.
     */
    function getTicketInfo(uint256 ticketId) public view returns (address, uint256, uint256, uint256) {
        require(ticketId < _nextTokenId, "This ticket does not exist yet!");
        
        TicketDetails memory details = ticketRegistry[ticketId];
        return (details.buyer, details.pricePaid, details.purchaseTime, details.eventId);
    }

    /**
     * @dev Converts an Ethereum address to its lowercase hexadecimal string representation.
     * @param _addr The address to convert.
     * @return The hex string representing the address (with a '0x' prefix).
     */
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

    /**
     * @dev Converts a uint256 value to its decimal string representation.
     * @param value The uint256 value to convert.
     * @return The string representation of the number.
     */
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

    /**
     * @notice Generates the dynamic metadata URI (tokenURI) for a given ticket ID.
     * @dev Overrides ERC721's tokenURI function. Generates an on-chain Base64 JSON data URI.
     * To prevent Solidity's "Stack too deep" compiler error, the attributes JSON string 
     * is constructed separately before assembling the main metadata object.
     * @param tokenId The ID of the ticket NFT to generate metadata for.
     * @return The Base64 encoded JSON data URI.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(tokenId < _nextTokenId, "This ticket does not exist yet!");
        TicketDetails memory details = ticketRegistry[tokenId];
        
        string memory buyerStr = addressToString(details.buyer);
        
        // Construct description containing match details, buyer address, and ticket ID
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

        // Pre-build the attributes list to keep the main abi.encodePacked call simple and avoid stack issues
        string memory attributesStr = string(
            abi.encodePacked(
                '[{"trait_type": "Match", "value": "', details.matchTitle, '"},',
                '{"trait_type": "Venue", "value": "', details.venue, '"},',
                '{"trait_type": "Date", "value": "', details.matchDate, '"},',
                '{"trait_type": "Buyer Wallet", "value": "', buyerStr, '"},',
                '{"trait_type": "Ticket ID", "value": "TKT-', toString(tokenId), '"}]'
            )
        );

        // Build base64 JSON payload
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

    /**
     * @notice Withdraws all accumulated ether from the contract to the owner's address.
     * @dev Restricted to the contract owner via the onlyOwner modifier.
     */
    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        // Transfer the entire balance to the owner wallet
        payable(owner).transfer(balance);
    }
}