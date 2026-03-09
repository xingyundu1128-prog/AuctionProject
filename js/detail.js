// detail.js - Item detail page & bidding logic
// 3号成员负责的核心功能：
// - 出价逻辑（验证价格）
// - 更新当前价格
// - 倒计时功能（可选）
// - 出价历史更新

console.log("Item detail page loaded");

// Configuration
const USE_SERVER = true; // Set to false to use local data.js only
const API_URL = '/api';
const REFRESH_INTERVAL = 3000; // 3 seconds

let currentItem = null;
let refreshTimer = null;

// User mapping
const USER_MAP = {
    '1001': 'Andy',
    '1002': 'Bob',
    '1003': 'Cathy'
};

let currentUser = null;

// Get item ID from URL parameter
function getItemIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 1; // Default to item 1
}

// Get current user from URL parameter
function getCurrentUser() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');

    if (userId && USER_MAP[userId]) {
        return USER_MAP[userId];
    }

    // If no user in URL, try to get from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        return storedUser;
    }

    // Fallback: prompt for name
    return null;
}

// Display current user in the page
function displayCurrentUser() {
    currentUser = getCurrentUser();

    // Create user display element if it doesn't exist
    let userDisplay = document.getElementById('currentUserDisplay');
    if (!userDisplay) {
        userDisplay = document.createElement('div');
        userDisplay.id = 'currentUserDisplay';
        userDisplay.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #4CAF50; color: white; padding: 8px 15px; border-radius: 20px; font-size: 14px; z-index: 1000;';
        document.body.appendChild(userDisplay);
    }

    if (currentUser) {
        userDisplay.textContent = `👤 ${currentUser}`;
        userDisplay.style.display = 'block';
    } else {
        userDisplay.style.display = 'none';
    }
}

// Load item data from server
async function loadItemData() {
    const itemId = getItemIdFromURL();

    if (USE_SERVER) {
        try {
            const response = await fetch(`${API_URL}/items`);
            const data = await response.json();
            currentItem = data.items.find(item => item.id === itemId);
        } catch (error) {
            console.log('Server not available, using local data');
            currentItem = items.find(item => item.id === itemId);
        }
    } else {
        currentItem = items.find(item => item.id === itemId);
    }

    if (currentItem) {
        updatePageContent();
    }
}

// Update page content with item data
function updatePageContent() {
    document.getElementById('itemTitle').textContent = currentItem.name;
    document.getElementById('itemDescription').textContent = currentItem.description;
    document.getElementById('itemImage').src = currentItem.image;
    document.getElementById('startingPrice').textContent = `$${currentItem.startingPrice}`;
    document.getElementById('currentPrice').textContent = `$${currentItem.currentPrice}`;

    // Update time remaining (simplified)
    const hours = Math.floor(currentItem.timeLeft / 3600);
    const minutes = Math.floor((currentItem.timeLeft % 3600) / 60);
    document.getElementById('timeRemaining').textContent = `${hours}h ${minutes}m`;

    // Update bid history
    if (currentItem.bidHistory) {
        const historyList = document.getElementById('bidHistoryList');
        historyList.innerHTML = '';
        currentItem.bidHistory.forEach(bid => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `
                <span class="bidder">${bid.bidder}</span>
                <span class="bid-amount">$${bid.amount}</span>
            `;
            historyList.appendChild(li);
        });
    }
}

// Place a bid
async function placeBid() {
    const bidInput = document.getElementById('bidInput');
    const bidAmount = parseInt(bidInput.value);
    const messageElement = document.getElementById('bidMessage');

    // Validation
    if (!bidAmount || bidAmount <= 0) {
        messageElement.textContent = 'Please enter a valid bid amount';
        messageElement.style.color = 'red';
        return;
    }

    if (bidAmount <= currentItem.currentPrice) {
        messageElement.textContent = `Bid must be higher than $${currentItem.currentPrice}`;
        messageElement.style.color = 'red';
        return;
    }

    // Get bidder name from current user or prompt
    let bidderName = currentUser;
    if (!bidderName) {
        bidderName = prompt('Enter your name:');
        if (bidderName) {
            localStorage.setItem('currentUser', bidderName);
            currentUser = bidderName;
            displayCurrentUser();
        } else {
            bidderName = 'Anonymous';
        }
    }

    if (USE_SERVER) {
        try {
            const response = await fetch(`${API_URL}/bid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itemId: currentItem.id,
                    amount: bidAmount,
                    bidder: bidderName
                })
            });

            const result = await response.json();

            if (result.success) {
                messageElement.textContent = 'Bid placed successfully! 🎉';
                messageElement.style.color = 'green';
                bidInput.value = '';

                // Refresh data immediately
                await loadItemData();
            } else {
                messageElement.textContent = result.message;
                messageElement.style.color = 'red';
            }
        } catch (error) {
            messageElement.textContent = 'Server error, please try again';
            messageElement.style.color = 'red';
        }
    } else {
        // Local mode (no server)
        currentItem.currentPrice = bidAmount;
        currentItem.bidHistory.unshift({
            bidder: bidderName,
            amount: bidAmount,
            time: new Date().toLocaleString()
        });
        updatePageContent();
        messageElement.textContent = 'Bid placed successfully! 🎉';
        messageElement.style.color = 'green';
        bidInput.value = '';
    }
}

// Auto-refresh data
function startAutoRefresh() {
    if (USE_SERVER) {
        refreshTimer = setInterval(() => {
            loadItemData();
        }, REFRESH_INTERVAL);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayCurrentUser();
    loadItemData();
    startAutoRefresh();

    // Bind place bid button
    const placeBidBtn = document.getElementById('placeBidBtn');
    if (placeBidBtn) {
        placeBidBtn.addEventListener('click', placeBid);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }
});
