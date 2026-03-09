# BidMaster - Online Auction Platform

A high school Computer Science project - collaborative web development.

## 🎭 Multi-User Demo Mode (NEW!)

**Want to demo with 3 people on 3 computers?**

1. **Start server:** `./start-server.sh` or `python3 server.py`
2. **Connect 3 computers** to the same Wi-Fi
3. **Each person uses their own URL:**
   - Person 1 (Andy): `http://SERVER_IP:8000/?user=1001`
   - Person 2 (Bob): `http://SERVER_IP:8000/?user=1002`
   - Person 3 (Cathy): `http://SERVER_IP:8000/?user=1003`
4. **Start bidding!** All screens update in real-time
5. **Look for the green badge** 👤 Andy/Bob/Cathy at top-right

**Quick test (single computer):**
```bash
./test-users.sh
```
Opens 3 browser windows with different users.

See **[DEMO-GUIDE.md](DEMO-GUIDE.md)** for detailed instructions.

---

## Team Division

### Member 1 (HTML Structure) ✅ COMPLETED
**Responsible for:**
- All HTML page structures
- Navigation bar
- Product listing layout
- Item detail sections
- Bidding form structure
- Create listing form structure
- Dashboard layout

**Files created:**
- `index.html` - Homepage with item cards
- `item-detail.html` - Item detail page with bidding form
- `create-listing.html` - Create new listing form
- `dashboard.html` - User dashboard with bid history

---

### Member 2 (CSS Styling) 🎨 TO DO
**Responsible for:**
- Overall website design & colors
- Item card styling (shadows, hover effects)
- Button styles (primary, secondary, hover)
- Form input styling
- Layout & spacing
- Responsive design

**Files to work on:**
- `css/style.css` - Main stylesheet (basic structure provided)

**Key elements to style:**
- `.navbar` - Navigation bar
- `.hero-section` - Homepage banner
- `.item-card` - Product cards (important!)
- `.btn-primary`, `.btn-secondary` - Buttons
- `.input-field` - Form inputs
- `.bids-table` - Dashboard table
- `.footer` - Footer

---

### Member 3 (Bidding Logic - JavaScript) ⚙️ TO DO
**Responsible for:**
- Bidding functionality
- Price validation (bid must be higher than current price)
- Update current price on successful bid
- Countdown timer (optional)
- Item switching logic

**Files to work on:**
- `js/detail.js` - Item detail page logic (MAIN TASK)
- `js/main.js` - Homepage logic (optional enhancements)

**Key functionality:**
1. Get bid input value from `#bidInput`
2. Validate: bid must be > current price
3. If valid: update `#currentPrice` and show success message
4. If invalid: show error message in `#bidMessage`
5. (Optional) Countdown timer for `#timeRemaining`

---

### Member 4 (Forms & Records - JavaScript) 📝 TO DO
**Responsible for:**
- Create listing form validation
- Form submission handling
- Success/error messages
- My Bids dashboard data display
- Update bid history table

**Files to work on:**
- `js/create.js` - Form validation & submission
- `js/dashboard.js` - Dashboard data display

**Key functionality:**

**Create Listing:**
1. Validate all required fields
2. Check starting price > 0
3. Show success message on submit
4. Clear form or redirect to homepage

**Dashboard:**
1. Load bid history from `bidHistory` array in `data.js`
2. Populate `#bidsTableBody` with user's bids
3. Update stats: `#totalBids`, `#itemsWatching`, `#auctionsWon`

---

## Project Structure

```
AuctionProject/
├── index.html              # Homepage
├── item-detail.html        # Item detail page
├── create-listing.html     # Create listing page
├── dashboard.html          # My Bids page
├── css/
│   └── style.css           # Main stylesheet (Member 2)
├── js/
│   ├── data.js             # Shared data (provided)
│   ├── main.js             # Homepage logic (Member 3)
│   ├── detail.js           # Bidding logic (Member 3 - CORE)
│   ├── create.js           # Form logic (Member 4)
│   └── dashboard.js        # Dashboard logic (Member 4)
└── images/                 # Item images (need to add)
    ├── watch.jpg
    ├── keyboard.jpg
    ├── bike.jpg
    └── painting.jpg
```

---

## Important IDs & Classes

### For CSS (Member 2)
- `.navbar`, `.nav-links`, `.logo`
- `.hero-section`, `.hero-title`
- `.item-card`, `.item-image`, `.item-info`
- `.btn`, `.btn-primary`, `.btn-secondary`
- `.input-field`, `.form-group`
- `.bids-table`, `.stat-card`

### For JavaScript (Members 3 & 4)

**Member 3 (detail.js):**
- `#bidInput` - Bid input field
- `#placeBidBtn` - Place bid button
- `#currentPrice` - Current price display
- `#bidMessage` - Message area for success/error
- `#timeRemaining` - Countdown timer (optional)

**Member 4 (create.js):**
- `#createListingForm` - Form element
- `#itemName`, `#category`, `#startingPrice`, `#endTime`, `#description`
- `#formMessage` - Message area

**Member 4 (dashboard.js):**
- `#bidsTableBody` - Table body for bid history
- `#totalBids`, `#itemsWatching`, `#auctionsWon` - Stats

---

## Next Steps

1. **Member 2**: Start styling in `css/style.css`
   - Begin with navigation bar and hero section
   - Focus on item cards (most important visual element)

2. **Member 3**: Implement bidding logic in `js/detail.js`
   - This is the CORE functionality of the project

3. **Member 4**: Implement form validation in `js/create.js` and `js/dashboard.js`

4. **All members**: Add images to `images/` folder
   - Find 4 sample images for the items
   - Name them: `watch.jpg`, `keyboard.jpg`, `bike.jpg`, `painting.jpg`

---

## Testing Checklist

Before final submission, test:
- [ ] All page links work (navigation bar)
- [ ] Item cards display correctly
- [ ] Clicking "View Details" goes to item detail page
- [ ] Bidding functionality works (validation & price update)
- [ ] Create listing form validates input
- [ ] Dashboard displays bid history
- [ ] Website looks good on different screen sizes
- [ ] No console errors

---

## Demo Flow

When presenting to teacher:
1. Open `index.html` → Show homepage
2. Click an item → Show detail page
3. Enter bid → Demonstrate bidding
4. Go to "Sell Item" → Show form
5. Submit form → Show validation
6. Go to "My Bids" → Show dashboard

Good luck! 🎯
