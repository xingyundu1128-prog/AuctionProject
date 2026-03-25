// detail.js - Item detail page & bidding logic
// 3号成员负责的核心功能：
// - 出价逻辑（验证价格）
// - 更新当前价格
// - 倒计时功能
// - 出价历史更新

console.log("Item detail page loaded");

// Configuration
const REFRESH_INTERVAL = 3000; // 3 seconds

let currentItem = null;
let refreshTimer = null;
let countdownTimer = null;

// LocalStorage helpers
function getItemsFromStorage() {
    const storedItems = localStorage.getItem('auctionItems');
    if (storedItems) {
        return JSON.parse(storedItems);
    }

    // If no items in storage, use default items from data.js
    if (typeof items !== 'undefined' && Array.isArray(items)) {
        localStorage.setItem('auctionItems', JSON.stringify(items));
        return items;
    }

    return [];
}

function saveItemsToStorage(items) {
    localStorage.setItem('auctionItems', JSON.stringify(items));
}

// User mapping
const USER_MAP = {
    '1001': 'Andy',
    '1002': 'Bob',
    '1003': 'Cathy'
};

let currentUser = null;   // Display name
let currentUserId = null; // User ID


// Get item ID from URL parameter
function getItemIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'), 10) || 1;
}


// Get current user from URL parameter or localStorage
function getCurrentUser() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');

    if (userId && USER_MAP[userId]) {
        currentUserId = userId;
        currentUser = USER_MAP[userId];

        localStorage.setItem('currentUserId', userId);
        localStorage.setItem('currentUser', currentUser);

        return currentUser;
    }

    const storedUserId = localStorage.getItem('currentUserId');
    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
        currentUserId = storedUserId || null;
        currentUser = storedUser;
        return currentUser;
    }

    currentUserId = null;
    currentUser = null;
    return null;
}


// Display current user in the page
function displayCurrentUser() {
    currentUser = getCurrentUser();

    let userDisplay = document.getElementById('currentUserDisplay');

    if (!userDisplay) {
        userDisplay = document.createElement('div');
        userDisplay.id = 'currentUserDisplay';
        userDisplay.style.cssText =
            'position: fixed; top: 10px; right: 10px; background: #4CAF50; color: white; padding: 8px 15px; border-radius: 20px; font-size: 14px; z-index: 1000;';
        document.body.appendChild(userDisplay);
    }

    if (currentUser) {
        userDisplay.textContent = `👤 ${currentUser}`;
        userDisplay.style.display = 'block';
    } else {
        userDisplay.style.display = 'none';
    }
}


// Update navigation links to preserve user parameter
function updateNavLinksWithUser() {
    if (!currentUserId) return;

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Skip if already has user parameter
        if (href.includes('user=')) return;

        // Add user parameter
        if (href.includes('?') || href.includes('#')) {
            const separator = href.includes('?') ? '&' : '?';
            link.setAttribute('href', href + separator + 'user=' + currentUserId);
        } else {
            link.setAttribute('href', href + '?user=' + currentUserId);
        }
    });
}


// Ensure item has bidHistory array
function ensureBidHistory(item) {
    if (!item.bidHistory || !Array.isArray(item.bidHistory)) {
        item.bidHistory = [];
    }
}


// Load item data from localStorage
function loadItemData() {
    const itemId = getItemIdFromURL();
    const allItems = getItemsFromStorage();

    currentItem = allItems.find(item => item.id === itemId);

    if (!currentItem) {
        console.log("Item not found");
        return;
    }

    // Update timeLeft based on elapsed time
    if (currentItem.timeLeft > 0 && currentItem.createdAt) {
        const now = Date.now();
        const elapsed = Math.floor((now - currentItem.createdAt) / 1000);
        currentItem.timeLeft = Math.max(0, currentItem.timeLeft - elapsed);
    }

    ensureBidHistory(currentItem);
    updatePageContent();
}


// Format remaining time
function formatTime(seconds) {
    const safeSeconds = Math.max(0, seconds);
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const secs = safeSeconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
}


// Update bid button state
function updateBidButtonState() {
    const placeBidBtn = document.getElementById('placeBidBtn');
    const bidInput = document.getElementById('bidInput');

    if (!placeBidBtn || !bidInput || !currentItem) return;

    if (currentItem.timeLeft <= 0) {
        placeBidBtn.disabled = true;
        placeBidBtn.textContent = 'Auction Ended';
        bidInput.disabled = true;
    } else {
        placeBidBtn.disabled = false;
        placeBidBtn.textContent = 'Place Bid';
        bidInput.disabled = false;
    }
}


// Update page content with item data
function updatePageContent() {
    if (!currentItem) return;

    ensureBidHistory(currentItem);

    const titleEl = document.getElementById('itemTitle');
    const descEl = document.getElementById('itemDescription');
    const imageEl = document.getElementById('itemImage');
    const startPriceEl = document.getElementById('startingPrice');
    const currentPriceEl = document.getElementById('currentPrice');
    const timeEl = document.getElementById('timeRemaining');
    const historyList = document.getElementById('bidHistoryList');

    if (titleEl) titleEl.textContent = currentItem.name;
    if (descEl) descEl.textContent = currentItem.description;
    if (imageEl) {
        imageEl.src = currentItem.image;
        imageEl.alt = currentItem.name;
    }
    if (startPriceEl) startPriceEl.textContent = `$${currentItem.startingPrice}`;
    if (currentPriceEl) currentPriceEl.textContent = `$${currentItem.currentPrice}`;
    if (timeEl) timeEl.textContent = formatTime(currentItem.timeLeft);

    if (historyList) {
        historyList.innerHTML = '';

        if (currentItem.bidHistory.length === 0) {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.textContent = 'No bids yet';
            historyList.appendChild(li);
        } else {
            currentItem.bidHistory.forEach((bid, index) => {
                const displayName = USER_MAP[bid.bidder] || bid.bidder;

                const li = document.createElement('li');
                li.className = 'history-item';

                li.innerHTML = `
                    <span class="bidder">${index === 0 ? '👑 ' : ''}${displayName}</span>
                    <span class="bid-amount">$${bid.amount}</span>
                `;

                historyList.appendChild(li);
            });
        }
    }

    updateBidButtonState();
}


// Place a bid
async function placeBid() {
    if (!currentItem) return;

    const bidInput = document.getElementById('bidInput');
    const messageElement = document.getElementById('bidMessage');

    if (!bidInput || !messageElement) return;

    const bidAmount = parseInt(bidInput.value, 10);

    // Check if auction ended
    if (currentItem.timeLeft <= 0) {
        messageElement.textContent = 'Auction has ended';
        messageElement.style.color = 'red';
        updateBidButtonState();
        return;
    }

    // Validation
    if (isNaN(bidAmount) || bidAmount <= 0) {
        messageElement.textContent = 'Please enter a valid bid amount';
        messageElement.style.color = 'red';
        return;
    }

    if (bidAmount <= currentItem.currentPrice) {
        messageElement.textContent = `Bid must be higher than $${currentItem.currentPrice}`;
        messageElement.style.color = 'red';
        return;
    }

    // Get bidder
    let bidderId = currentUserId;

    if (!bidderId) {
        const bidderName = prompt('Enter your name:');

        if (bidderName && bidderName.trim() !== '') {
            currentUser = bidderName.trim();
            currentUserId = bidderName.trim(); // local mode fallback
            bidderId = currentUserId;

            localStorage.setItem('currentUser', currentUser);
            localStorage.setItem('currentUserId', currentUserId);

            displayCurrentUser();
        } else {
            messageElement.textContent = 'Bid cancelled';
            messageElement.style.color = 'red';
            return;
        }
    }

    // Update bid in localStorage
    ensureBidHistory(currentItem);

    currentItem.currentPrice = bidAmount;
    currentItem.bidHistory.unshift({
        bidder: bidderId,
        amount: bidAmount,
        time: new Date().toLocaleString()
    });

    // Update item in storage
    const allItems = getItemsFromStorage();
    const itemIndex = allItems.findIndex(item => item.id === currentItem.id);
    if (itemIndex !== -1) {
        allItems[itemIndex] = currentItem;
        saveItemsToStorage(allItems);
    }

    bidInput.value = '';
    messageElement.textContent = 'Bid placed successfully! 🎉';
    messageElement.style.color = 'green';
    updatePageContent();

    console.log('✅ Bid placed:', bidAmount, 'by', bidderId);
}


// Auto-refresh from localStorage
function startAutoRefresh() {
    refreshTimer = setInterval(() => {
        loadItemData();
    }, REFRESH_INTERVAL);
}


// Countdown timer
function startCountdown() {
    countdownTimer = setInterval(() => {
        if (currentItem && currentItem.timeLeft > 0) {
            currentItem.timeLeft--;
            updatePageContent();
        }
    }, 1000);
}


// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayCurrentUser();
    updateNavLinksWithUser();
    loadItemData();
    startAutoRefresh();
    startCountdown();

    const placeBidBtn = document.getElementById('placeBidBtn');
    if (placeBidBtn) {
        placeBidBtn.addEventListener('click', placeBid);
    }
});


// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (refreshTimer) clearInterval(refreshTimer);
    if (countdownTimer) clearInterval(countdownTimer);
});