# CRUD Operations by Page

## 📝 **ANSWERS TO YOUR QUESTIONS**

### 1. **Customer Notes vs Activity Manager**

**Activity Manager (Current):**
- **Purpose:** Log specific events/activities that happened
- **Fields:** Title, Description, Date
- **Use Case:** "Meeting with customer", "Phone call", "Portfolio review completed"
- **Nature:** Event-based, chronological log
- **Table:** `customer_activity`

**Customer Notes (Recommended):**
- **Purpose:** General notes, preferences, important information
- **Fields:** Title, Content, Category, Priority, Date
- **Use Case:** "Customer prefers conservative approach", "Important: Allergic to high-risk products", "Meeting notes from Q1 review"
- **Nature:** Information-based, can be referenced anytime
- **Table:** `customer_notes` (new)

**Difference:**
- **Activity** = "What happened" (events/actions)
- **Notes** = "What to remember" (information/preferences)

**Recommendation:** Keep both! They serve different purposes. Activity is for logging what happened, Notes is for storing important information.

---

### 2. **Customer Info Fields You Can Update**

Based on `customer_info` table structure, you can UPDATE:

**Core Demographics:**
- ✅ `risk_profile` - Risk Profile (Conservative, Balanced, Moderate, Growth, Aggressive)
- ✅ `aum_label` - AUM Label
- ✅ `propensity` - Propensity
- ✅ `priority_private` - Priority/Private status
- ✅ `customer_type` - Customer Type
- ✅ `pekerjaan` - Occupation
- ✅ `status_nikah` - Marital Status
- ✅ `usia` - Age
- ✅ `annual_income` - Annual Income

**Assignment:**
- ✅ `assigned_rm` - Reassign customer to different RM

**Read-Only (Don't Update):**
- ❌ `bp_number_wm_core` - Primary Key (cannot change)
- ❌ `tanggal_join_wealth` - Join date (historical, shouldn't change)

---

## 🎯 **CRUD OPERATIONS BY PAGE**

---

## 1. **DASHBOARD OVERVIEW** (`/dashboard-overview`)

### Current Display:
- Total Customers (by risk profile)
- Total AUM (by risk profile)
- Total FBI (by risk profile)
- Quarterly FUM chart
- Quarterly FBI chart
- Customer Risk Profile pie chart
- Top Products
- Customer List table

### CRUD Operations to Implement:

#### ✅ **Customer List - Bulk Operations**
- **UPDATE** - Bulk edit customer fields:
  - Select multiple customers
  - Update: Risk Profile, AUM Label, Propensity, Priority/Private
  - Bulk reassign to different RM
- **READ** - View customer list (already exists)

#### ✅ **Customer Quick Edit**
- **UPDATE** - Quick edit from table:
  - Click on customer row → Edit modal
  - Update: Risk Profile, AUM Label, Propensity, Priority/Private, Customer Type
  - Save changes

#### ✅ **Saved Filters**
- **CREATE** - Save current filter combination (risk profile + other filters)
- **READ** - Load saved filters
- **UPDATE** - Modify saved filter
- **DELETE** - Remove saved filter

#### ✅ **Dashboard Widget Preferences**
- **CREATE** - Save dashboard layout (widget positions)
- **READ** - Load saved layout
- **UPDATE** - Update layout preferences
- **DELETE** - Reset to default

---

## 2. **CUSTOMER DETAILS** (`/customer-details`)

### Current Display:
- Customer ID, FUM, AUM, FBI
- Customer Info (Status, Age, Marital Status, Risk Profile, Vintage)
- Recommendation Products
- Portfolio Pie Chart
- Optimized Portfolio
- Quarterly AUM
- Quarterly FUM
- Owned Products Table
- **Activity Manager** (already has CRUD)

### CRUD Operations to Implement:

#### ✅ **Customer Information Update**
- **UPDATE** - Edit customer details:
  - Risk Profile
  - AUM Label
  - Propensity
  - Priority/Private
  - Customer Type
  - Occupation (Pekerjaan)
  - Marital Status (Status Nikah)
  - Age (Usia)
  - Annual Income
  - Assigned RM (reassign)

#### ✅ **Customer Notes** (Different from Activity)
- **CREATE** - Add notes:
  - Title, Content, Category (Meeting, Call, Note, Reminder), Priority, Date
- **READ** - View all notes (chronological)
- **UPDATE** - Edit notes
- **DELETE** - Remove notes

#### ✅ **Transaction Management**
- **CREATE** - Add new transaction:
  - Product Name, Amount, Price Bought, Number of Transactions, Description, Date
  - Auto-calculate profit/return
- **READ** - View transaction history (enhance existing)
- **UPDATE** - Edit transaction details
- **DELETE** - Remove transactions (with audit trail)

#### ✅ **Recommendation Status Tracking**
- **CREATE** - Record recommendation status:
  - Link to displayed recommendation
  - Status: Pending, Accepted, Rejected, On Hold
  - Customer feedback/notes
  - Follow-up date
- **READ** - View recommendation history
- **UPDATE** - Update status, add notes
- **DELETE** - Remove tracking (rarely)

#### ✅ **Portfolio Performance Notes**
- **CREATE** - Add performance review notes:
  - Review date, Performance period, Notes, Customer feedback, Action items
- **READ** - View performance notes history
- **UPDATE** - Edit notes
- **DELETE** - Remove notes

#### ✅ **Investment Goals Tracking**
- **CREATE** - Add investment goals:
  - Goal name, Target amount, Target date, Current progress, Priority
- **READ** - View all goals
- **UPDATE** - Update progress, modify targets
- **DELETE** - Remove goals

#### ✅ **Follow-up Reminders**
- **CREATE** - Set reminders:
  - Reminder type (Call, Meeting, Review), Due date, Priority, Notes, Recurring option
- **READ** - View all reminders
- **UPDATE** - Mark as completed, reschedule
- **DELETE** - Remove reminders

#### ✅ **Risk Profile Assessment History**
- **CREATE** - Record risk assessment:
  - Old risk profile, New risk profile, Assessment date, Reason, Assessed by
- **READ** - View assessment history
- **UPDATE** - Edit assessment (rare)
- **DELETE** - Remove (for corrections only)

---

## 3. **CUSTOMER MAPPING** (`/customer-mapping`)

### Current Display:
- Stacked Bar Chart (Customer segmentation by Propensity & AUM)
- Customer List Table (filtered by Propensity & AUM)

### CRUD Operations to Implement:

#### ✅ **Customer Quick Edit**
- **UPDATE** - Edit from table:
  - Click customer → Edit modal
  - Update: Propensity, AUM Label, Risk Profile, Priority/Private
  - Save changes

#### ✅ **Bulk Customer Update**
- **UPDATE** - Bulk operations:
  - Select multiple customers from chart/table
  - Bulk update: Propensity, AUM Label, Risk Profile
  - Bulk reassign RM

#### ✅ **Customer Tags/Labels**
- **CREATE** - Add tags to customers (VIP, High Priority, Follow-up Needed)
- **READ** - View tags per customer
- **UPDATE** - Edit tag assignments
- **DELETE** - Remove tags

#### ✅ **Saved Filter Presets**
- **CREATE** - Save filter combination (Propensity + AUM + Risk Profile)
- **READ** - Load saved filters
- **UPDATE** - Modify saved filters
- **DELETE** - Remove saved filters

---

## 4. **RECOMMENDATION CENTRE** (`/recommendation-centre`)

### Current Display:
- Managed Numbers (customers, AUM, FBI)
- Increased Numbers (growth metrics)
- Portfolio Summary
- Calendar
- **Task Manager** (already has CRUD)
- Last Transactions
- Potential Transactions
- Offer Products Risk
- Reprofile Risk Target

### CRUD Operations to Implement:

#### ✅ **Task Manager Enhancements** (Improve Existing)
- **UPDATE** - Add fields:
  - Status (To Do, In Progress, Completed, Cancelled)
  - Priority (High, Medium, Low)
  - Category/Tags
  - Completion date
  - Notes
- **READ** - Enhanced filtering by status/priority
- **UPDATE** - Update status, priority, notes
- **DELETE** - Already exists

#### ✅ **Recommendation Status Tracking**
- **CREATE** - Track recommendations from "Potential Transactions", "Offer Products Risk", "Reprofile Risk Target":
  - Mark as: Pending, Accepted, Rejected, On Hold
  - Add customer feedback
  - Set follow-up date
- **READ** - View recommendation status
- **UPDATE** - Update status, add notes
- **DELETE** - Remove tracking

#### ✅ **Transaction Management**
- **CREATE** - Add new transaction (from "Last Transactions" or "Potential Transactions"):
  - Product Name, Amount, Date, Customer ID
  - Auto-calculate profit
- **READ** - View transactions (enhance existing)
- **UPDATE** - Edit transaction details
- **DELETE** - Remove transactions

#### ✅ **Follow-up Reminders**
- **CREATE** - Create reminders from recommendations:
  - Link to specific recommendation
  - Set follow-up date
  - Add notes
- **READ** - View reminders
- **UPDATE** - Mark as completed, reschedule
- **DELETE** - Remove reminders

#### ✅ **Portfolio Notes**
- **CREATE** - Add notes to portfolio summary:
  - Notes about portfolio changes
  - Observations
  - Action items
- **READ** - View portfolio notes
- **UPDATE** - Edit notes
- **DELETE** - Remove notes

---

## 5. **MARKET INDICES** (`/market-indices`)

### Current Display:
- S&P 500, NASDAQ, Dow Jones, LQ45, Composite Index
- Real-time market data (read-only from external API)

### CRUD Operations to Implement:

#### ✅ **Market Watchlists**
- **CREATE** - Create watchlists:
  - Watchlist name
  - Add indices to watch
  - Set price alerts (optional)
- **READ** - View watchlists
- **UPDATE** - Add/remove indices, update alerts
- **DELETE** - Remove watchlists

#### ✅ **Market Notes**
- **CREATE** - Add notes about market conditions:
  - Date, Notes, Observations
- **READ** - View market notes
- **UPDATE** - Edit notes
- **DELETE** - Remove notes

**Note:** Market data itself is read-only (from external API), but you can add user-generated content around it.

---

## 6. **MARKET NEWS** (`/market-news`)

### Current Display:
- Economic Indicators (GDP, BI Rate, Inflation)
- Financial News Feed
- Product Highlights

### CRUD Operations to Implement:

#### ✅ **News Bookmarks/Favorites**
- **CREATE** - Bookmark important news articles
- **READ** - View bookmarked news
- **UPDATE** - Add notes to bookmarks
- **DELETE** - Remove bookmarks

#### ✅ **News Notes**
- **CREATE** - Add notes about news:
  - Link to article
  - Notes, Observations
  - Relevance to customers
- **READ** - View news notes
- **UPDATE** - Edit notes
- **DELETE** - Remove notes

**Note:** News content is read-only (from external API), but you can add user interactions.

---

## 7. **CHATBOT** (`/chatbot`)

### Current Display:
- AI Chatbot interface
- Chat history (current session)

### CRUD Operations to Implement:

#### ✅ **Chat History**
- **CREATE** - Save chat conversations:
  - Link to customer (if applicable)
  - Save conversation
  - Add tags/categories
- **READ** - View past conversations
- **UPDATE** - Add notes to conversations
- **DELETE** - Remove conversations

#### ✅ **Chat Actions Integration**
- **CREATE** - Allow chatbot to create:
  - Tasks (integrate with Task Manager)
  - Activities (integrate with Activity Manager)
  - Notes (integrate with Customer Notes)
- **UPDATE** - Allow chatbot to update customer info (with confirmation)

---

## 8. **ADMIN** (`/admin`)

### Current Display:
- User List
- User Management (already has CRUD)

### CRUD Operations to Implement:

#### ✅ **User Management** (Already Exists - Enhance)
- **CREATE** - Create users (already exists)
- **READ** - View users (already exists)
- **UPDATE** - Update users (already exists)
- **DELETE** - Delete users (already exists)

#### ✅ **System Configuration**
- **CREATE** - Create system settings:
  - Risk profile definitions
  - Product categories
  - Email templates
- **READ** - View settings
- **UPDATE** - Update settings
- **DELETE** - Remove settings

#### ✅ **Audit Log**
- **READ** - View audit logs:
  - All CRUD operations
  - Who changed what and when
  - Filter by user, date, action type
- **EXPORT** - Export audit logs

---

## 📊 **SUMMARY BY PRIORITY**

### **High Priority (Address "Too Shallow" Issue):**

1. **Customer Details Page:**
   - Customer Info Update ⭐⭐⭐
   - Transaction Management ⭐⭐⭐
   - Recommendation Status Tracking ⭐⭐⭐
   - Customer Notes ⭐⭐⭐

2. **Recommendation Centre:**
   - Task Manager Enhancements ⭐⭐
   - Recommendation Status Tracking ⭐⭐⭐

3. **Dashboard Overview:**
   - Customer Quick Edit ⭐⭐
   - Bulk Customer Update ⭐⭐

### **Medium Priority:**

4. **Customer Details:**
   - Follow-up Reminders ⭐⭐
   - Investment Goals ⭐⭐
   - Portfolio Performance Notes ⭐⭐

5. **Customer Mapping:**
   - Customer Quick Edit ⭐⭐
   - Customer Tags ⭐

6. **Recommendation Centre:**
   - Follow-up Reminders ⭐⭐

### **Low Priority (Nice to Have):**

7. **All Pages:**
   - Saved Filters ⭐
   - Dashboard Widget Preferences ⭐
   - Market Watchlists ⭐
   - News Bookmarks ⭐
   - Chat History ⭐

---

## 🎯 **RECOMMENDED IMPLEMENTATION ORDER**

### **Week 1:**
1. Customer Info Update (Customer Details page)
2. Customer Notes (Customer Details page)

### **Week 2:**
3. Transaction Management (Customer Details + Recommendation Centre)
4. Recommendation Status Tracking (Customer Details + Recommendation Centre)

### **Week 3:**
5. Task Manager Enhancements (Recommendation Centre)
6. Follow-up Reminders (Customer Details)

### **Week 4:**
7. Customer Quick Edit (Dashboard + Customer Mapping)
8. Investment Goals (Customer Details)

---

## ✅ **SUCCESS METRICS**

After implementing these CRUD operations:

- **Customer Details Page:** 8+ CRUD features
- **Recommendation Centre:** 4+ CRUD features
- **Dashboard Overview:** 2+ CRUD features
- **Customer Mapping:** 2+ CRUD features
- **Total:** 16+ CRUD features across all pages

This will transform your app from "read-only display" to "interactive management platform"!

---

_Last Updated: Based on page analysis and database structure_
_Focus: Practical CRUD operations per page to address "too shallow" feedback_


