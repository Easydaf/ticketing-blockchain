// Canonical IPFS CID for the metadata JSON file.
// IMPORTANT:
// - Do NOT append `/ticket.json` for this CID, because this CID already points to a file.
// - Keep the exact case of the CID (lower/upper case changes can break CID parsing).
export const TICKET_METADATA_CID = "bafkreieo5xbybigup2yftevba5c5ois43fnaazs7uin2ftre4zpeiukynu";

export const TICKET_METADATA_URI = `ipfs://${TICKET_METADATA_CID}`;

// Single source of truth used by the mint flow.
export function getLockedTicketTokenURI() {
  return TICKET_METADATA_URI;
}

// Guardrail so malformed formats are rejected before sending a transaction.
export function isValidLockedTicketTokenURI(uri) {
  return uri === TICKET_METADATA_URI;
}
