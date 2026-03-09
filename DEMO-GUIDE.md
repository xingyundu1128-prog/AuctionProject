# 🎭 Multi-User Demo Guide

This guide explains how to demo the auction website with 3 people on 3 different computers.

## 🚀 Setup (5 minutes before demo)

### Step 1: Start the Server

On **ONE** computer (the "server" computer):

```bash
cd /path/to/AuctionProject
python3 server.py
```

You'll see:
```
🚀 BidMaster Server Running!
📍 Local access:   http://localhost:8000
🌐 Network access: http://192.168.1.100:8000  <-- SHARE THIS IP
```

**Important:** Copy the "Network access" URL (the one with 192.168.x.x)

---

### Step 2: Connect Other Computers with User IDs

On the **other 2 computers**, each person uses a different URL:

**Person 1 (Andy):**
```
http://192.168.1.100:8000/?user=1001
```

**Person 2 (Bob):**
```
http://192.168.1.100:8000/?user=1002
```

**Person 3 (Cathy):**
```
http://192.168.1.100:8000/?user=1003
```

✨ **Each person will see their name in a green badge at the top-right corner!**

**Benefits:**
- No need to type your name every time you bid
- Your name automatically appears on all your bids
- Easy to track who's bidding what

---

## 🎬 Demo Script (Show to Teacher)

### Scene 1: Show the Homepage (All 3 people)

**Person 1:**
> "Welcome to BidMaster. This is our online auction platform. You can see 4 items currently available for bidding."

(All 3 screens should show the same items)

---

### Scene 2: Real-time Bidding (The Magic Part!)

**Person 1 (Andy):** Click on "Vintage Watch" → View Details
- See green badge "👤 Andy" at top-right
- Enter bid: $130
- Click "Place Bid"
- ✅ Success message appears
- No need to enter name - it's automatic!

**Person 2 & 3 (Bob & Cathy):** Watch your screens
- Current price updates to $130 automatically (within 3 seconds)
- **Andy's** bid appears in bid history

**Person 2 (Bob):** Now bid $140
- See green badge "👤 Bob"
- Bid: $140
- ✅ Success!

**Person 1 & 3:** See **Bob's** bid update on your screens!

**Person 3 (Cathy):** Try to bid $135 (lower than current)
- ❌ Error message: "Bid must be higher than $140"

**Teacher sees:**
- ✅ Real-time updates across 3 computers
- ✅ Bid validation working
- ✅ Competition between users

---

### Scene 3: Multiple Items

**Person 1 (Andy):** Bid on "Mountain Bike" → Shows as "Andy: $320"
**Person 2 (Bob):** Bid on "Gaming Keyboard" → Shows as "Bob: $90"
**Person 3 (Cathy):** Bid on "Art Painting" → Shows as "Cathy: $460"

All screens update independently for different items!

---

### Scene 4: Dashboard (Optional)

**Person 1 (Andy):** Go to "My Bids"
- Still shows "👤 Andy" badge
- Shows all bids placed by Andy
- Shows current status (Winning/Outbid)

---

## 🛠️ Technical Explanation (for Teacher Q&A)

**If teacher asks: "How does it work?"**

> "We built a simple Python HTTP server that stores auction data in a JSON file.
> Each browser polls the server every 3 seconds to get updated prices and bids.
> When someone places a bid, it's validated server-side and saved to the shared data file.
> This simulates a real auction website without needing a complex database."

**If teacher asks: "Why not use a real database?"**

> "For this prototype, a JSON file is sufficient to demonstrate the concept.
> In a production system, we would use PostgreSQL or MongoDB for scalability."

---

## 🐛 Troubleshooting

### Problem: "Can't connect to server"
- ✅ Check all computers are on same Wi-Fi
- ✅ Check firewall isn't blocking port 8000
- ✅ Try using server computer's IP instead of localhost

### Problem: "Server not available" message in console
- ✅ Website still works using local data (fallback mode)
- ✅ Multi-user features won't work

### Problem: "Bids not updating"
- ✅ Wait 3-5 seconds (auto-refresh interval)
- ✅ Manually refresh browser (F5)

---

## 📊 Data File

All auction data is stored in `shared-data.json`

To **reset** the demo:
```bash
rm shared-data.json
python3 server.py
```

The server will create a fresh data file with default items.

---

## 🎯 Alternative: Single Computer Demo

If you only have 1 computer:

1. Open 3 different browsers:
   - Chrome: http://localhost:8000
   - Safari: http://localhost:8000
   - Firefox: http://localhost:8000

2. Arrange windows side-by-side

3. Each person controls one browser

Still looks impressive! ✨

---

## 👥 User ID Reference

Quick reference for demo:

| Person | User ID | Name  | URL Parameter |
|--------|---------|-------|---------------|
| 1      | 1001    | Andy  | `?user=1001`  |
| 2      | 1002    | Bob   | `?user=1002`  |
| 3      | 1003    | Cathy | `?user=1003`  |

**To add more users**, edit `USER_MAP` in:
- `js/detail.js`
- `js/main.js`

Example:
```javascript
const USER_MAP = {
    '1001': 'Andy',
    '1002': 'Bob',
    '1003': 'Cathy',
    '1004': 'David',  // Add more here
    '1005': 'Emma'
};
```

---

## ✅ Pre-Demo Checklist

- [ ] Server computer has Python 3 installed
- [ ] All computers on same Wi-Fi
- [ ] Server IP address shared with team
- [ ] **Each person has their user URL (with ?user=ID)**
- [ ] Test connection from all 3 computers
- [ ] Verify user badges appear (green badge at top-right)
- [ ] Images folder has all 4 images
- [ ] Each person knows their role

Good luck! 🎉
