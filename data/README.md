# Data Directory

This directory stores the auction items data for the server.

## Files

### items.json
Main data file containing all auction items.

**Structure:**
```json
{
  "items": [
    {
      "id": 1,                    // Unique item ID
      "name": "Item Name",        // Item title
      "description": "...",       // Item description
      "image": "images/xxx.jpg",  // Image path
      "startingPrice": 100,       // Starting bid price
      "currentPrice": 120,        // Current highest bid
      "timeLeft": 7200,           // Remaining time in seconds
      "category": "electronics",  // Item category
      "seller": "1002",           // Seller user ID
      "bidHistory": [...],        // Array of bids
      "createdAt": "...",         // ISO timestamp
      "lastUpdate": 1710329400000 // Unix timestamp (ms)
    }
  ]
}
```

## Usage

The server reads and writes to `items.json` to:
- Store newly created items (POST /api/items)
- Update items when bids are placed (POST /api/bid)
- Retrieve items for display (GET /api/items)

## Backup

Consider backing up this file regularly in production.

## Reset

To reset the auction system, replace `items.json` with an empty structure:
```json
{
  "items": []
}
```
