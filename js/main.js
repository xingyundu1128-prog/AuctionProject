// main.js - Homepage functionality
// 3号成员可以在这里添加：
// - 动态加载商品列表
// - 商品卡片切换
// - 搜索/筛选功能（可选）

console.log("Homepage loaded");

const USE_SERVER = true; // Set to false to use local data.js only
const API_URL = '/api';
const REFRESH_INTERVAL = 5000; // 5 seconds for homepage

let itemsData = [];
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

// Update all links to preserve user parameter
function updateLinksWithUser() {
    if (!currentUser) return;

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');
    if (!userId) return;

    // Update all item detail links
    document.querySelectorAll('a[href^="item-detail.html"]').forEach(link => {
        const href = link.getAttribute('href');
        if (href.includes('?')) {
            link.setAttribute('href', href + '&user=' + userId);
        } else {
            link.setAttribute('href', href + '?user=' + userId);
        }
    });
}

// Load items from server
async function loadItems() {
    if (USE_SERVER) {
        try {
            const response = await fetch(`${API_URL}/items`);
            const data = await response.json();
            itemsData = data.items;
        } catch (error) {
            console.log('Server not available, using local data');
            itemsData = items; // Fallback to local data.js
        }
    } else {
        itemsData = items;
    }

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
    if (USE_SERVER) {
        refreshTimer = setInterval(() => {
            loadItems();
        }, REFRESH_INTERVAL);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayCurrentUser();
    loadItems();
    startAutoRefresh();
});

// Cleanup
window.addEventListener('beforeunload', () => {
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }
});
