// dashboard.js - My Bids page functionality
// Displays user's bid history and statistics

console.log("Dashboard page loaded");

// User mapping (same as other pages)
const USER_MAP = {
    '1001': 'Andy',
    '1002': 'Bob',
    '1003': 'Cathy'
};

let currentUser = null;
let currentUserId = null;

// LocalStorage helpers
function getItemsFromStorage() {
    const storedItems = localStorage.getItem('auctionItems');
    return storedItems ? JSON.parse(storedItems) : [];
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

// Display current user badge
function displayCurrentUser() {
    currentUser = getCurrentUser();

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

    // Update page title
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle && currentUser) {
        pageTitle.textContent = `Welcome back, ${currentUser}`;
    }
}

// Update navigation links to preserve user parameter
function updateNavLinksWithUser() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');
    if (!userId) return;

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Skip if already has user parameter
        if (href.includes('user=')) return;

        // Add user parameter
        if (href.includes('?') || href.includes('#')) {
            const separator = href.includes('?') ? '&' : '?';
            link.setAttribute('href', href + separator + 'user=' + userId);
        } else {
            link.setAttribute('href', href + '?user=' + userId);
        }
    });
}

// Get user's bid history
function getUserBidHistory() {
    if (!currentUserId) return [];

    const items = getItemsFromStorage();
    const userBids = [];

    items.forEach(item => {
        if (!item.bidHistory || item.bidHistory.length === 0) return;

        // Find all bids by current user
        const userBidsOnItem = item.bidHistory.filter(bid => bid.bidder === currentUserId);

        if (userBidsOnItem.length > 0) {
            // Get highest bid by this user
            const highestUserBid = Math.max(...userBidsOnItem.map(bid => bid.amount));

            // Find the bid with highest amount to get its time
            const highestBidEntry = userBidsOnItem.find(bid => bid.amount === highestUserBid);
            const bidTime = highestBidEntry ? highestBidEntry.time : 'N/A';

            // Check if user has the current highest bid
            const isHighestBid = item.currentPrice === highestUserBid;

            // Check if auction ended
            const ended = item.timeLeft <= 0;

            // Determine status
            let status = 'Outbid';
            if (ended) {
                status = isHighestBid ? 'Won' : 'Lost';
            } else {
                status = isHighestBid ? 'Highest Bid' : 'Outbid';
            }

            userBids.push({
                itemId: item.id,
                itemName: item.name,
                userBid: highestUserBid,
                bidTime: bidTime,
                currentPrice: item.currentPrice,
                status: status,
                timeLeft: item.timeLeft,
                ended: ended
            });
        }
    });

    return userBids;
}

// Render bid history table
function renderBidHistory() {
    const tableBody = document.getElementById('bidsTableBody');
    if (!tableBody) return;

    const userBids = getUserBidHistory();

    if (userBids.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px; color: #666;">
                    No bids placed yet. <a href="index.html?user=${currentUserId}" style="color: #007bff;">Browse auctions</a>
                </td>
            </tr>
        `;
        return;
    }

    // Sort by status: Highest Bid first, then Outbid, then ended auctions
    userBids.sort((a, b) => {
        const statusOrder = { 'Highest Bid': 0, 'Outbid': 1, 'Won': 2, 'Lost': 3 };
        return statusOrder[a.status] - statusOrder[b.status];
    });

    tableBody.innerHTML = userBids.map(bid => {
        const statusClass = bid.status === 'Highest Bid' ? 'status-winning' :
                           bid.status === 'Won' ? 'status-won' :
                           bid.status === 'Outbid' ? 'status-outbid' :
                           'status-lost';

        const currentBidDisplay = bid.ended ? '-' : `$${bid.currentPrice}`;

        const userParam = currentUserId ? `?id=${bid.itemId}&user=${currentUserId}` : `?id=${bid.itemId}`;

        return `
            <tr>
                <td>${bid.itemName}</td>
                <td class="bid-amount">$${bid.userBid}</td>
                <td style="color: #666; font-size: 0.9em;">${bid.bidTime}</td>
                <td class="current-bid">${currentBidDisplay}</td>
                <td><span class="status ${statusClass}">${bid.status}</span></td>
                <td><a href="item-detail.html${userParam}" class="btn-link">View</a></td>
            </tr>
        `;
    }).join('');
}

// Update statistics
function updateStats() {
    const userBids = getUserBidHistory();

    // Total bids placed
    const totalBids = userBids.length;
    document.getElementById('totalBids').textContent = totalBids;

    // Items watching (active bids)
    const itemsWatching = userBids.filter(bid => !bid.ended).length;
    document.getElementById('itemsWatching').textContent = itemsWatching;

    // Auctions won
    const auctionsWon = userBids.filter(bid => bid.status === 'Won').length;
    document.getElementById('auctionsWon').textContent = auctionsWon;
}

// Load bid history
function loadBidHistory() {
    if (!currentUserId) {
        const tableBody = document.getElementById('bidsTableBody');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px; color: #666;">
                        Please access this page with a user parameter (e.g., ?user=1002)
                    </td>
                </tr>
            `;
        }

        // Reset stats
        document.getElementById('totalBids').textContent = '0';
        document.getElementById('itemsWatching').textContent = '0';
        document.getElementById('auctionsWon').textContent = '0';

        return;
    }

    renderBidHistory();
    updateStats();
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayCurrentUser();
    updateNavLinksWithUser();
    loadBidHistory();

    // Auto-refresh every 5 seconds to update status
    setInterval(() => {
        loadBidHistory();
    }, 5000);
});
