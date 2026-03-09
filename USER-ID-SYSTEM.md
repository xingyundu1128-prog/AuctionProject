# User ID System Design

## 📋 Overview

The auction system uses **User IDs** (e.g., `1001`, `1002`) internally for data storage, and **Display Names** (e.g., "Andy", "Bob") for presentation.

---

## 🎯 Design Rationale

### Why User IDs?

1. **Data Consistency**
   - All bids stored with same ID format
   - Easy to track user activity across system

2. **Easy to Extend**
   - Just add new mapping: `'1004': 'David'`
   - No need to change data structure

3. **Professional Design**
   - Mimics real user authentication systems
   - Separates identity (ID) from presentation (name)

---

## 🔧 How It Works

### User Mapping

Defined in `js/detail.js` and `js/main.js`:

```javascript
const USER_MAP = {
    '1001': 'Andy',
    '1002': 'Bob',
    '1003': 'Cathy'
};
```

### Data Flow

**1. User accesses site:**
```
URL: http://localhost:8000/?user=1001
↓
JavaScript reads user=1001
↓
Looks up USER_MAP['1001'] = 'Andy'
↓
Displays: 👤 Andy
```

**2. User places bid:**
```
User clicks "Place Bid" with $150
↓
JavaScript sends to server:
{
  itemId: 1,
  amount: 150,
  bidder: "1001"  ← User ID, not name
}
↓
Server saves to shared-data.json:
{
  "bidder": "1001",
  "amount": 150,
  "time": "2026-03-08 14:30"
}
```

**3. Displaying bids:**
```
Server returns:
{
  "bidder": "1001",
  "amount": 150
}
↓
JavaScript maps:
USER_MAP["1001"] → "Andy"
↓
Displays: Andy: $150
```

---

## 📂 File Structure

### Where User IDs are Stored:

**`shared-data.json`** (server-side data):
```json
{
  "bidHistory": [
    {
      "bidder": "1001",  ← User ID
      "amount": 120
    }
  ]
}
```

### Where Mapping Happens:

**`js/detail.js`** - Bidding page logic
**`js/main.js`** - Homepage logic

Both files contain:
```javascript
const USER_MAP = {
    '1001': 'Andy',
    '1002': 'Bob',
    '1003': 'Cathy'
};
```

### Where Display Happens:

**Bid History Display** (`detail.js`):
```javascript
// Map user ID to display name
const displayName = USER_MAP[bid.bidder] || bid.bidder;
```

If `bid.bidder = "1001"`, displays "Andy"
If `bid.bidder = "unknown"`, displays "unknown" (fallback)

---

## ➕ Adding New Users

### Method 1: Pre-defined Users

Edit both `js/detail.js` and `js/main.js`:

```javascript
const USER_MAP = {
    '1001': 'Andy',
    '1002': 'Bob',
    '1003': 'Cathy',
    '1004': 'David',   // Add here
    '1005': 'Emma'
};
```

Access with: `?user=1004`

### Method 2: Dynamic Users (Manual Entry)

If user accesses without `?user=` parameter:
1. System prompts for name
2. Uses entered name as both ID and display name
3. Stores in localStorage for session

---

## 🎬 Demo Examples

### Example 1: Andy bids $130

**URL:** `http://localhost:8000/?user=1001`

**Display:**
- Badge: 👤 Andy
- Bid shows as: "Andy: $130"

**Data stored:**
```json
{
  "bidder": "1001",
  "amount": 130
}
```

### Example 2: Unknown user bids

**URL:** `http://localhost:8000/` (no user parameter)

**Flow:**
1. Prompt: "Enter your name:"
2. User types: "Charlie"
3. Badge: 👤 Charlie
4. Data: `{"bidder": "Charlie", "amount": 100}`

---

## 🔍 Advantages Over Name-Only System

| Feature | User ID System | Name-Only System |
|---------|----------------|------------------|
| Consistency | ✅ Always `1001` | ❌ "Andy" vs "andy" vs "ANDY" |
| Privacy | ✅ Can hide real names | ❌ Names always visible |
| Extensibility | ✅ Easy to add metadata | ❌ Limited |
| Professional | ✅ Industry standard | ❌ Toy project feel |

---

## 🛠️ Future Enhancements

1. **User Profiles**
   - Store more info: `'1001': {name: 'Andy', email: '...', avatar: '...'}`

2. **Real Authentication**
   - Replace URL parameter with login system
   - Store JWT tokens

3. **Database Integration**
   - Move USER_MAP to database
   - Add user registration

---

## ✅ Summary

- **Internal Storage**: User IDs (`1001`, `1002`, `1003`)
- **User Display**: Names (Andy, Bob, Cathy)
- **Mapping**: `USER_MAP` object in JavaScript
- **Access**: URL parameter `?user=1001`
- **Fallback**: Manual name entry if no ID

This design is simple yet scalable! 🚀
