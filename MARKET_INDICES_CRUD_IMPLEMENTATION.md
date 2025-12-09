# Market Indices CRUD Implementation

## ✅ **COMPLETED BACKEND**

### Database Tables
- ✅ Created SQL migration: `server/db-data/market_indices_tables.sql`
- Run this SQL in your PostgreSQL database to create the tables

### Backend Files Created
1. ✅ `server/src/models/market-indices.ts` - Database models
2. ✅ `server/src/controllers/market-indices.ts` - Controllers
3. ✅ `server/src/routes/market-indices.ts` - Routes
4. ✅ Updated `server/src/server.ts` - Added route mounting

### API Endpoints
- `GET /api/market-indices/watchlists?rm_number=XXX` - Get all watchlists
- `POST /api/market-indices/watchlists` - Create watchlist
- `PUT /api/market-indices/watchlists` - Update watchlist
- `DELETE /api/market-indices/watchlists?id=XXX` - Delete watchlist

- `GET /api/market-indices/notes?rm_number=XXX&index_name=XXX` - Get notes
- `POST /api/market-indices/notes` - Create note
- `PUT /api/market-indices/notes` - Update note
- `DELETE /api/market-indices/notes?id=XXX` - Delete note

## ✅ **COMPLETED FRONTEND**

### Types
- ✅ `client/src/types/page/market-indices.ts`

### Services
- ✅ `client/src/services/market-indices/market-watchlists-api.ts`
- ✅ `client/src/services/market-indices/market-notes-api.ts`

### Hooks
- ✅ `client/src/hooks/market-indices/use-market-watchlists.ts`
- ✅ `client/src/hooks/market-indices/use-market-notes.ts`

## 📋 **NEXT STEPS: CREATE UI COMPONENTS**

### 1. Create Market Watchlists Component
**File:** `client/src/components/market-indices/market-watchlists.tsx`

**Features:**
- Display list of watchlists
- Create new watchlist (name + select indices)
- Edit watchlist
- Delete watchlist
- Show indices in each watchlist

### 2. Create Market Notes Component
**File:** `client/src/components/market-indices/market-notes.tsx`

**Features:**
- Display notes (filterable by index)
- Create note (select index, title, content)
- Edit note
- Delete note
- Filter by index name

### 3. Integrate into Market Indices Page
**File:** `client/src/app/market-indices/page.tsx`

**Add:**
- Sidebar or collapsible panel with Watchlists and Notes
- Or add as separate sections below the charts

## 🚀 **QUICK START**

### Step 1: Run Database Migration
```sql
-- Run this in your PostgreSQL database
-- File: server/db-data/market_indices_tables.sql
```

### Step 2: Test Backend
```bash
# Start your server
cd server
npm run dev

# Test endpoints (use Postman or curl)
GET http://localhost:YOUR_PORT/api/market-indices/watchlists?rm_number=RM001
```

### Step 3: Create UI Components
Follow the pattern from `activity-manager.tsx` to create similar components for watchlists and notes.

### Step 4: Add to Page
Import and add the components to `market-indices/page.tsx`

## 📝 **COMPONENT STRUCTURE SUGGESTION**

### Market Watchlists Component
```tsx
- Header with "Market Watchlists" + Add button
- List of watchlists
  - Watchlist name
  - Indices badges (SPX, NDX, etc.)
  - Edit/Delete buttons
- Modal/Dialog for Create/Edit
  - Input: Watchlist name
  - Multi-select: Indices (SPX, NDX, DJI, LQ45, Composite)
  - Save/Cancel buttons
```

### Market Notes Component
```tsx
- Header with "Market Notes" + Add button
- Filter dropdown: All / SPX / NDX / DJI / LQ45 / Composite / General
- List of notes
  - Note title
  - Index badge
  - Note content (truncated)
  - Date
  - Edit/Delete buttons
- Modal/Dialog for Create/Edit
  - Select: Index name
  - Input: Note title
  - Textarea: Note content
  - Save/Cancel buttons
```

## 🎨 **UI PLACEMENT OPTIONS**

### Option 1: Sidebar (Recommended)
Add a collapsible sidebar on the right side of the page with:
- Market Watchlists section
- Market Notes section

### Option 2: Below Charts
Add sections below all the charts:
- Market Watchlists card
- Market Notes card

### Option 3: Floating Panel
Add a floating button that opens a panel with watchlists and notes

## ✅ **TESTING CHECKLIST**

- [ ] Database tables created successfully
- [ ] Backend endpoints working (test with Postman)
- [ ] Frontend hooks working (check React Query devtools)
- [ ] UI components render correctly
- [ ] Create watchlist works
- [ ] Edit watchlist works
- [ ] Delete watchlist works
- [ ] Create note works
- [ ] Edit note works
- [ ] Delete note works
- [ ] Filter notes by index works

---

**Status:** Backend and hooks complete ✅ | UI components pending ⏳


