// main.js - Homepage functionality
// 3号成员可以在这里添加：
// - 动态加载商品列表
// - 商品卡片切换
// - 搜索/筛选功能（可选）

console.log("Homepage loaded");

const REFRESH_INTERVAL = 5000; // 5 seconds for homepage

let itemsData = [];

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
let refreshTimer = null;

// User mapping (same as detail.js)
const USER_MAP = {
    '1001': 'Andy',
    '1002': 'Bob',
    '1003': 'Cathy'
};

let currentUser = null;

// Get current user from URL parameter
function getCurrentUser() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');

    if (userId && USER_MAP[userId]) {
        return USER_MAP[userId];
    }

    const storedUser = localStorage.getItem('currentUser');
    return storedUser || null;
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

// Update all links to preserve user parameter
function updateLinksWithUser() {
    if (!currentUser) return;

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');
    if (!userId) return;

    // Update all item detail links
    document.querySelectorAll('a[href^="item-detail.html"]').forEach(link => {
        const href = link.getAttribute('href');

        // Skip if link already has user parameter
        if (href.includes('user=')) return;

        if (href.includes('?')) {
            link.setAttribute('href', href + '&user=' + userId);
        } else {
            link.setAttribute('href', href + '?user=' + userId);
        }
    });
}

// Load items from localStorage
function loadItems() {
    itemsData = getItemsFromStorage();

    // Update timeLeft for all items
    const now = Date.now();
    itemsData = itemsData.map(item => {
        if (item.timeLeft > 0 && item.createdAt) {
            const elapsed = Math.floor((now - item.createdAt) / 1000);
            item.timeLeft = Math.max(0, item.timeLeft - elapsed);
        }
        return item;
    });

    // Save updated items back to storage
    localStorage.setItem('auctionItems', JSON.stringify(itemsData));

    updateItemCards();
    updateLinksWithUser();
}

// Update item cards on homepage
function updateItemCards() {
    const itemsGrid = document.getElementById('itemsGrid');
    if (!itemsGrid) return;

    // Clear existing cards
    itemsGrid.innerHTML = '';

    // Get user parameter to pass along
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');
    const userParam = userId ? `&user=${userId}` : '';

    // Create cards for each item
    itemsData.forEach(item => {
        const hours = Math.floor(item.timeLeft / 3600);
        const minutes = Math.floor((item.timeLeft % 3600) / 60);

        const card = document.createElement('div');
        card.className = 'item-card';
        card.setAttribute('data-item-id', item.id);
        card.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-info">
                <h3 class="item-title">${item.name}</h3>
                <p class="item-price">Current Bid: <span class="price">$${item.currentPrice}</span></p>
                <p class="item-time">Time Left: <span class="time-left">${hours}h ${minutes}m</span></p>
                <a href="item-detail.html?id=${item.id}${userParam}" class="btn btn-secondary">View Details</a>
            </div>
        `;
        itemsGrid.appendChild(card);
    });
}

// Auto-refresh items
function startAutoRefresh() {
    refreshTimer = setInterval(() => {
        loadItems();
    }, REFRESH_INTERVAL);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayCurrentUser();
    updateNavLinksWithUser();
    loadItems();
    startAutoRefresh();
});

// Cleanup
window.addEventListener('beforeunload', () => {
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }
});
