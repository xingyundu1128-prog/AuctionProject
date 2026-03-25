// create.js - Create listing form functionality
// Using localStorage for data persistence

console.log("Create listing page loaded");

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

function saveItemsToStorage(items) {
    localStorage.setItem('auctionItems', JSON.stringify(items));
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

// Form validation
function validateListingForm(itemName, category, startingPrice, duration, description) {
    if (!itemName || !itemName.trim()) {
        return "Item name cannot be empty.";
    }

    if (!category || category === "") {
        return "Please select a category.";
    }

    if (isNaN(startingPrice) || startingPrice <= 0) {
        return "Starting price must be greater than 0.";
    }

    if (!duration || duration === "") {
        return "Please select auction duration.";
    }

    if (!description || !description.trim()) {
        return "Description cannot be empty.";
    }

    return "";
}

// Handle image file - convert to base64 or use placeholder
function handleImageFile(imageFile) {
    return new Promise((resolve) => {
        if (!imageFile) {
            // No file selected, use default placeholder
            resolve('images/bike.jpg');
            return;
        }

        // Convert image to base64 for localStorage
        const reader = new FileReader();

        reader.onload = function(e) {
            // e.target.result contains the base64 data URL (e.g., "data:image/jpeg;base64,...")
            resolve(e.target.result);
        };

        reader.onerror = function(error) {
            console.error('Error reading file:', error);
            // Fallback to placeholder on error
            resolve('images/bike.jpg');
        };

        reader.readAsDataURL(imageFile);
    });
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const formMessage = document.getElementById('formMessage');
    const itemNameInput = document.getElementById('itemName');
    const categoryInput = document.getElementById('category');
    const startingPriceInput = document.getElementById('startingPrice');
    const durationInput = document.getElementById('endTime');
    const descriptionInput = document.getElementById('description');
    const imageInput = document.getElementById('imageUpload');

    // Get form values
    const itemName = itemNameInput.value;
    const category = categoryInput.value;
    const startingPrice = parseFloat(startingPriceInput.value);
    const duration = parseInt(durationInput.value, 10);
    const description = descriptionInput.value;
    const imageFile = imageInput.files[0];

    // Validate form
    const error = validateListingForm(itemName, category, startingPrice, duration, description);

    if (error) {
        formMessage.textContent = error;
        formMessage.style.color = 'red';
        return;
    }

    // Check if user is logged in
    if (!currentUserId) {
        formMessage.textContent = 'Please access this page with a user parameter (e.g., ?user=1002)';
        formMessage.style.color = 'red';
        return;
    }

    // Show processing message
    formMessage.textContent = 'Creating listing...';
    formMessage.style.color = 'blue';

    // Handle image
    const imageUrl = await handleImageFile(imageFile);

    // Create item data
    const timeLeft = duration * 3600; // Convert hours to seconds
    const items = getItemsFromStorage();

    // Generate new ID
    const newId = items.length > 0
        ? Math.max(...items.map(item => item.id || 0)) + 1
        : 1;

    const newItem = {
        id: newId,
        name: itemName,
        description: description,
        image: imageUrl,
        startingPrice: startingPrice,
        currentPrice: startingPrice,
        timeLeft: timeLeft,
        category: category,
        seller: currentUserId,
        bidHistory: [],
        createdAt: Date.now()
    };

    // Add to localStorage
    items.push(newItem);
    saveItemsToStorage(items);

    console.log('✅ Item created:', newItem);

    formMessage.textContent = 'Listing created successfully! 🎉';
    formMessage.style.color = 'green';

    // Reset form
    document.getElementById('createListingForm').reset();

    // Redirect to homepage after 1.5 seconds
    setTimeout(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('user');
        const userParam = userId ? `?user=${userId}` : '';
        window.location.href = `index.html${userParam}`;
    }, 1500);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayCurrentUser();
    updateNavLinksWithUser();

    const createListingForm = document.getElementById('createListingForm');
    if (createListingForm) {
        createListingForm.addEventListener('submit', handleFormSubmit);
    }
});
