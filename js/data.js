// Shared data file - all pages can use this
// This provides sample data for the auction items

const items = [
    {
        id: 1,
        name: "Vintage Watch",
        description: "A beautiful vintage timepiece from the 1960s. Excellent condition with original leather strap.",
        startingPrice: 100,
        currentPrice: 120,
        timeLeft: 5400, // seconds
        image: "images/watch.jpg",
        category: "Collectibles"
    },
    {
        id: 2,
        name: "Gaming Keyboard",
        description: "Mechanical gaming keyboard with RGB lighting. Perfect condition, barely used.",
        startingPrice: 60,
        currentPrice: 80,
        timeLeft: 3600,
        image: "images/keyboard.jpg",
        category: "Electronics"
    },
    {
        id: 3,
        name: "Mountain Bike",
        description: "High-quality mountain bike, suitable for trails and rough terrain.",
        startingPrice: 250,
        currentPrice: 300,
        timeLeft: 7200,
        image: "images/bike.jpg",
        category: "Sports"
    },
    {
        id: 4,
        name: "Art Painting",
        description: "Original abstract painting by a local artist. 24x36 inches.",
        startingPrice: 400,
        currentPrice: 450,
        timeLeft: 10800,
        image: "images/painting.jpg",
        category: "Art"
    }
];

// Bid history (sample data for dashboard)
const bidHistory = [
    { itemId: 1, itemName: "Vintage Watch", yourBid: 120, currentBid: 135, status: "outbid" },
    { itemId: 3, itemName: "Mountain Bike", yourBid: 300, currentBid: 300, status: "winning" },
    { itemId: 4, itemName: "Art Painting", yourBid: 90, currentBid: null, status: "won" }
];
