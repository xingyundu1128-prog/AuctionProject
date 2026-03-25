# 🎭 BidMaster Auction Demo Guide

Complete guide for demonstrating the auction website with multiple users.

## 🚀 Quick Start

### Step 1: Start the Server

```bash
cd /path/to/AuctionProject
python3 server.py
```

You'll see:
```
🚀 BidMaster Server Running!
📍 Local access:   http://localhost:8000
🌐 Network access: http://192.168.1.100:8000
```

### Step 2: Access with Different Users

**Single Computer Demo:**
- Andy: `http://localhost:8000/?user=1001`
- Bob: `http://localhost:8000/?user=1002`
- Cathy: `http://localhost:8000/?user=1003`

**Multi-Computer Demo:**
- Replace `localhost:8000` with the network IP (e.g., `192.168.1.100:8000`)
- Each person uses their own user ID parameter

✨ **Each user will see their name badge at the top-right corner!**

---

## 📱 Main Features

### 1. Homepage (index.html)
- Browse all auction items
- Real-time countdown timers
- Category filtering
- Auto-refresh every 5 seconds

### 2. Item Details (item-detail.html)
- View item description and image
- See current price and time remaining
- Place bids with validation
- View complete bid history
- Auto-refresh every 3 seconds

### 3. Create Listing (create-listing.html)
- Add new auction items
- **Upload images** (stored as base64 in localStorage)
- Set starting price and duration
- Select category

### 4. My Bids Dashboard (dashboard.html)
- View all your bids
- See bid status (Highest Bid, Outbid, Won, Lost)
- **View bid time** for each bid
- Statistics: Total Bids, Items Watching, Auctions Won
- Auto-refresh every 5 seconds

---

## 🎬 Demo Script

### Scene 1: Browse Items

**All users:** Visit homepage
- See 4 default items (Watch, Keyboard, Bike, Painting)
- Notice user badge at top-right
- See countdown timers

### Scene 2: Real-Time Bidding

**Andy (1001):** Click "Vintage Watch" → View Details
- Current price: $150
- See existing bids from Cathy and Bob
- Enter bid: $160
- Click "Place Bid"
- ✅ Success! Bid appears in history

**Bob (1002) & Cathy (1003):** Refresh or wait 3 seconds
- See Andy's $160 bid in history
- Current price updated to $160

**Bob:** Try to bid $155 (lower than current)
- ❌ Error: "Bid must be higher than $160"

**Cathy:** Bid $170
- ✅ Success! Now Cathy has highest bid

### Scene 3: Create New Item

**Bob:** Go to "Sell Item"
- Item name: "Gaming Console"
- Description: "PlayStation 5 with 2 controllers"
- **Upload image** (select any image file)
- Starting price: $200
- Duration: 6 hours
- Category: Electronics
- Submit

**All users:** Return to homepage
- New item appears with uploaded image
- Starting price $200

### Scene 4: My Bids Dashboard

**Andy:** Click "My Bids"
- See "Bike" with status "Highest Bid" (green)
- See "Watch" with status "Outbid" (yellow)
- **Bid time shown** for each bid
- Statistics updated:
  - Total Bids: 2
  - Items Watching: 1
  - Auctions Won: 0

**Cathy:** Click "My Bids"
- See "Watch" with status "Highest Bid"
- Different statistics than Andy's

---

## 💾 Data Storage (localStorage)

### How It Works
- All data stored in browser's localStorage (client-side)
- Each browser has **independent** data
- Default items loaded from `js/data.js` on first visit

### View Current Data

Open browser Console (F12) and run:
```javascript
// View all auction items
localStorage.getItem('auctionItems')

// View current user
localStorage.getItem('currentUser')
```

### Clear Data

**Clear all data:**
```javascript
localStorage.clear()
```

**Clear only auction items:**
```javascript
localStorage.removeItem('auctionItems')
```

**Then refresh the page** to reload default items from `data.js`

### Reset Demo to Default State

1. Open Console (F12)
2. Run: `localStorage.clear()`
3. Refresh page (F5)
4. Default items with sample bids will be loaded

---

## 🖼️ Image Upload

### How It Works
- Images converted to base64 data URLs
- Stored directly in localStorage
- No server upload needed

### Limitations
- **localStorage total limit**: ~5-10MB per domain
- **Each image size**: 30KB-500KB when base64 encoded
- **Recommended**: 10-20 reasonably-sized images maximum

### Tips
- Use compressed images (JPEG instead of PNG)
- Resize large images before upload
- If storage full, clear old items

---

## 🐛 Troubleshooting

### Problem: Old Code Still Running

**Symptoms:** Changes not appearing, old features still present

**Solution:** Clear browser cache
- **Safari:** Develop menu → Empty Caches (Cmd+Option+E)
- **Chrome/Firefox:** Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- **Or:** Open DevTools → Network tab → Check "Disable cache"

### Problem: My Bids Shows No Data

**Cause:** No bids placed yet or localStorage cleared

**Solution:**
1. Place some bids on items
2. Check `localStorage.getItem('auctionItems')` in Console
3. Verify `bidHistory` arrays exist for items
4. Reload default data: `localStorage.clear()` + refresh

### Problem: Uploaded Image Shows Wrong Picture

**Cause:** Browser cached old `create.js` file

**Solution:**
1. Hard refresh (Cmd+Shift+R)
2. Check DevTools → Sources → `js/create.js`
3. Verify line 137 has `reader.readAsDataURL(imageFile)`
4. If not, completely close and reopen browser

### Problem: Different Users See Different Data

**Expected Behavior:** This is normal for localStorage mode
- Each browser has independent data
- Bids placed in one browser won't appear in another

**For synchronized demo:**
- Use server mode (Node.js `server.js` with database)
- Or use single computer with 3 browser windows

### Problem: Items Have No Bid History After Clear

**Cause:** Cleared localStorage, data reloaded from `data.js`

**Check:**
1. Open DevTools → Sources → `js/data.js`
2. Verify items have `bidHistory` arrays (lines 14-60)
3. If not, file may be cached
4. Hard refresh or restart browser

---

## 📊 Default Sample Data

After clearing localStorage, default items include:

| Item            | Starting | Current | Top Bidder | Bids       |
|-----------------|----------|---------|------------|------------|
| Vintage Watch   | $100     | $150    | Cathy      | 3 bids     |
| Gaming Keyboard | $60      | $80     | Bob        | 2 bids     |
| Mountain Bike   | $250     | $300    | Andy       | 2 bids     |
| Art Painting    | $400     | $450    | Bob        | 2 bids     |

**Expected My Bids for each user:**
- **Andy (1001)**: Bike (Highest), Painting (Outbid)
- **Bob (1002)**: Keyboard (Highest), Painting (Highest), Watch (Outbid)
- **Cathy (1003)**: Watch (Highest), Bike (Outbid)

---

## 👥 User Reference

| User ID | Name  | URL Parameter | Badge Display |
|---------|-------|---------------|---------------|
| 1001    | Andy  | `?user=1001`  | 👤 Andy       |
| 1002    | Bob   | `?user=1002`  | 👤 Bob        |
| 1003    | Cathy | `?user=1003`  | 👤 Cathy      |

### Add More Users

Edit `USER_MAP` in these files:
- `js/main.js`
- `js/detail.js`
- `js/create.js`
- `js/dashboard.js`

```javascript
const USER_MAP = {
    '1001': 'Andy',
    '1002': 'Bob',
    '1003': 'Cathy',
    '1004': 'David',  // Add new users here
    '1005': 'Emma'
};
```

---

## 🛠️ Developer Tips

### Safari Cache Management

**Enable Develop Menu:**
1. Safari → Settings → Advanced
2. Check "Show Develop menu in menu bar"

**Clear Cache:**
- Method 1: Develop → Empty Caches (Cmd+Option+E)
- Method 2: Safari → Settings → Privacy → Manage Website Data → Remove "localhost"
- Method 3: DevTools → Network → Check "Disable Caches"

### Console Debugging

**Check if new code loaded:**
```javascript
// Should show base64 conversion code, not placeholders
handleImageFile.toString()
```

**Inspect localStorage size:**
```javascript
// Calculate approximate size
JSON.stringify(localStorage).length
```

**View specific item:**
```javascript
let items = JSON.parse(localStorage.getItem('auctionItems'));
console.log(items[0]); // View first item
```

---

## ✅ Pre-Demo Checklist

**Setup:**
- [ ] Python server running (`python3 server.py`)
- [ ] Browser cache cleared (hard refresh)
- [ ] localStorage cleared and default data loaded
- [ ] Images folder has default images (watch.jpg, bike.jpg, etc.)

**Test Each Feature:**
- [ ] Homepage shows 4 items with countdown timers
- [ ] User badge appears when accessing with `?user=1001`
- [ ] Item detail page shows bid history
- [ ] Placing bid works and appears in history
- [ ] My Bids shows correct data for each user
- [ ] Bid times displayed in My Bids table
- [ ] Create listing works with image upload
- [ ] Uploaded image displays correctly (not placeholder)

**Multi-User Test (if applicable):**
- [ ] All computers on same Wi-Fi
- [ ] Each person has correct user URL
- [ ] Each browser shows independent data

Good luck with your demo! 🎉
