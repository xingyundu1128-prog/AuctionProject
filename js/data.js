// Shared data file - all pages can use this
// This provides sample data for the auction items

const items = [
    {
        id: 1,
        name: "Vintage Watch",
        description: "A beautiful vintage timepiece from the 1960s. Excellent condition with original leather strap.",
        startingPrice: 100,
        currentPrice: 150,
        timeLeft: 5400, // seconds
        image: "images/watch.jpg",
        category: "Collectibles",
        bidHistory: [
            { bidder: "1003", amount: 150, time: "2026-03-24, 10:30:00 AM" },
            { bidder: "1002", amount: 135, time: "2026-03-24, 10:15:00 AM" },
            { bidder: "1003", amount: 120, time: "2026-03-24, 10:00:00 AM" }
        ]
    },
    {
        id: 2,
        name: "Gaming Keyboard",
        description: "Mechanical gaming keyboard with RGB lighting. Perfect condition, barely used.",
        startingPrice: 60,
        currentPrice: 80,
        timeLeft: 3600,
        image: "images/keyboard.jpg",
        category: "Electronics",
        bidHistory: [
            { bidder: "1002", amount: 80, time: "2026-03-24, 09:45:00 AM" },
            { bidder: "1001", amount: 75, time: "2026-03-24, 09:30:00 AM" }
        ]
    },
    {
        id: 3,
        name: "Mountain Bike",
        description: "High-quality mountain bike, suitable for trails and rough terrain.",
        startingPrice: 250,
        currentPrice: 300,
        timeLeft: 7200,
        image: "images/bike.jpg",
        category: "Sports",
        bidHistory: [
            { bidder: "1001", amount: 300, time: "2026-03-24, 11:00:00 AM" },
            { bidder: "1003", amount: 280, time: "2026-03-24, 10:45:00 AM" }
        ]
    },
    {
        id: 4,
        name: "Art Painting",
        description: "Original abstract painting by a local artist. 24x36 inches.",
        startingPrice: 400,
        currentPrice: 450,
        timeLeft: 10800,
        image: "images/painting.jpg",
        category: "Art",
        bidHistory: [
            { bidder: "1002", amount: 450, time: "2026-03-24, 11:30:00 AM" },
            { bidder: "1001", amount: 420, time: "2026-03-24, 11:15:00 AM" }
        ]
    }
];

// Bid history (sample data for dashboard)
// Note: In real implementation, this would be filtered by current user
const bidHistory = [
    { itemId: 1, itemName: "Vintage Watch", userId: "1001", yourBid: 120, currentBid: 135, status: "outbid" },
    { itemId: 3, itemName: "Mountain Bike", userId: "1001", yourBid: 300, currentBid: 300, status: "winning" },
    { itemId: 4, itemName: "Art Painting", userId: "1001", yourBid: 90, currentBid: null, status: "won" }
];
