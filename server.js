// server.js - Complete auction server implementation
// Handles items management, bidding, and image uploads

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Path to data file
const DATA_FILE = path.join(__dirname, 'data', 'items.json');

// ===== Helper Functions =====

// Read items from file
function readItems() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
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

// Write items to file
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

// ===== Image Upload Configuration =====

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'images');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'item-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: fileFilter
});

// ===== API Routes =====

// GET /api/items - Get all items
app.get('/api/items', (req, res) => {
    try {
        const items = readItems();

        // Update timeLeft for all items (countdown logic)
        const now = Date.now();
        const updatedItems = items.map(item => {
            if (item.timeLeft > 0) {
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
            console.log('✅ New item created:', newItem.name);
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
            console.log(`✅ Bid placed: $${amount} on "${item.name}" by ${bidder}`);
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

// POST /api/upload - Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file uploaded'
            });
        }

        const imageUrl = 'images/' + req.file.filename;
        console.log('✅ Image uploaded:', imageUrl);

        res.json({
            success: true,
            imageUrl: imageUrl,
            message: 'Image uploaded successfully'
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image'
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size is too large. Max 5MB allowed.'
            });
        }
    }

    res.status(500).json({
        success: false,
        message: error.message || 'Server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Auction Server Started!');
    console.log(`📡 Server running at http://localhost:${PORT}`);
    console.log(`📁 Data file: ${DATA_FILE}`);
    console.log('');
    console.log('Available endpoints:');
    console.log('  GET  /api/items     - Get all items');
    console.log('  POST /api/items     - Create new item');
    console.log('  POST /api/bid       - Place a bid');
    console.log('  POST /api/upload    - Upload image');
    console.log('');
    console.log('Access the auction site at: http://localhost:3000/index.html?user=1002');
    console.log('');
});
