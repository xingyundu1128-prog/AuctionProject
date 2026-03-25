// Server-side items management implementation example
// This file shows how to implement the items CRUD endpoints on the server

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Path to data file
const DATA_FILE = path.join(__dirname, 'data', 'items.json');

// Helper: Read items from file
function readItems() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            // Create data directory and file if not exists
            const dataDir = path.dirname(DATA_FILE);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            fs.writeFileSync(DATA_FILE, JSON.stringify({ items: [] }, null, 2));
            return [];
        }

        const data = fs.readFileSync(DATA_FILE, 'utf8');
        const json = JSON.parse(data);
        return json.items || [];
    } catch (error) {
        console.error('Error reading items:', error);
        return [];
    }
}

// Helper: Write items to file
function writeItems(items) {
    try {
        const dataDir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify({ items: items }, null, 2),
            'utf8'
        );
        return true;
    } catch (error) {
        console.error('Error writing items:', error);
        return false;
    }
}

// GET /api/items - Get all items
app.get('/api/items', (req, res) => {
    try {
        const items = readItems();

        // Update timeLeft for all items (countdown logic)
        const now = Date.now();
        const updatedItems = items.map(item => {
            if (item.timeLeft > 0) {
                // Calculate elapsed time since last update
                const lastUpdate = item.lastUpdate || now;
                const elapsed = Math.floor((now - lastUpdate) / 1000);
                item.timeLeft = Math.max(0, item.timeLeft - elapsed);
                item.lastUpdate = now;
            }
            return item;
        });

        writeItems(updatedItems);

        res.json({
            success: true,
            items: updatedItems
        });
    } catch (error) {
        console.error('Error getting items:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get items'
        });
    }
});

// POST /api/items - Create new item
app.post('/api/items', (req, res) => {
    try {
        const { name, description, image, startingPrice, currentPrice, timeLeft, category, seller, bidHistory } = req.body;

        // Validation
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Item name is required'
            });
        }

        if (!startingPrice || startingPrice <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Starting price must be greater than 0'
            });
        }

        if (!seller) {
            return res.status(400).json({
                success: false,
                message: 'Seller information is required'
            });
        }

        // Read existing items
        const items = readItems();

        // Generate new ID
        const newId = items.length > 0
            ? Math.max(...items.map(item => item.id || 0)) + 1
            : 1;

        // Create new item
        const newItem = {
            id: newId,
            name: name,
            description: description || '',
            image: image || 'images/bike.jpg',
            startingPrice: parseFloat(startingPrice),
            currentPrice: parseFloat(currentPrice || startingPrice),
            timeLeft: parseInt(timeLeft) || 3600,
            category: category || 'other',
            seller: seller,
            bidHistory: bidHistory || [],
            createdAt: new Date().toISOString(),
            lastUpdate: Date.now()
        };

        // Add to items array
        items.push(newItem);

        // Save to file
        if (writeItems(items)) {
            res.json({
                success: true,
                message: 'Item created successfully',
                item: newItem
            });
        } else {
            throw new Error('Failed to save item');
        }
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create item'
        });
    }
});

// POST /api/bid - Place a bid on an item
app.post('/api/bid', (req, res) => {
    try {
        const { itemId, amount, bidder } = req.body;

        // Validation
        if (!itemId || !amount || !bidder) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const items = readItems();
        const itemIndex = items.findIndex(item => item.id === itemId);

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        const item = items[itemIndex];

        // Check if auction ended
        if (item.timeLeft <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Auction has ended'
            });
        }

        // Check if bid is higher than current price
        if (amount <= item.currentPrice) {
            return res.status(400).json({
                success: false,
                message: `Bid must be higher than $${item.currentPrice}`
            });
        }

        // Update item
        item.currentPrice = amount;
        item.bidHistory = item.bidHistory || [];
        item.bidHistory.unshift({
            bidder: bidder,
            amount: amount,
            time: new Date().toISOString()
        });

        items[itemIndex] = item;

        // Save to file
        if (writeItems(items)) {
            res.json({
                success: true,
                message: 'Bid placed successfully',
                item: item
            });
        } else {
            throw new Error('Failed to save bid');
        }
    } catch (error) {
        console.error('Error placing bid:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to place bid'
        });
    }
});

// DELETE /api/items/:id - Delete an item (optional, for admin)
app.delete('/api/items/:id', (req, res) => {
    try {
        const itemId = parseInt(req.params.id);
        const items = readItems();

        const filteredItems = items.filter(item => item.id !== itemId);

        if (filteredItems.length === items.length) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        if (writeItems(filteredItems)) {
            res.json({
                success: true,
                message: 'Item deleted successfully'
            });
        } else {
            throw new Error('Failed to delete item');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete item'
        });
    }
});

// Example: Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

module.exports = app;
