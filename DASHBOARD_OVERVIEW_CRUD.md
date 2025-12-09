# CRUD Operations for Dashboard Overview Page

## 📊 **CURRENT DASHBOARD OVERVIEW DISPLAY**

The dashboard shows:
1. **Total Customers** (gauge chart)
2. **Total AUM** (gauge chart)
3. **Total FBI** (gauge chart)
4. **Quarterly FUM** (line chart)
5. **Quarterly FBI** (line chart)
6. **Customer Risk Profile** (pie chart)
7. **Top Products** (bar chart)
8. **Customer List Table** (read-only table with 13 columns)

---

## 🎯 **CRUD OPERATIONS TO IMPLEMENT**

### **1. Customer Quick Edit from Table** ⭐⭐⭐
**Priority: HIGH**

**Location:** Customer List Table

**CRUD Operations:**
- ✅ **UPDATE** - Edit customer directly from table:
  - Click on any customer row → Opens edit modal
  - Editable fields:
    - Risk Profile
    - AUM Label
    - Propensity
    - Priority/Private
    - Customer Type
    - Occupation (Pekerjaan)
    - Marital Status (Status Nikah)
    - Age (Usia)
    - Annual Income
  - Save button to update
  - Cancel to close

**UI Implementation:**
- Add "Edit" button/icon to each row
- Modal dialog with form fields
- Validation before saving
- Success/error notifications

**Business Value:** Very High - Quick access to edit customer data without navigating away

---

### **2. Bulk Customer Operations** ⭐⭐⭐
**Priority: HIGH**

**Location:** Customer List Table

**CRUD Operations:**
- ✅ **UPDATE** - Bulk edit multiple customers:
  - Checkbox column to select customers
  - "Bulk Actions" dropdown:
    - Bulk update Risk Profile
    - Bulk update AUM Label
    - Bulk update Propensity
    - Bulk reassign RM
    - Bulk update Priority/Private
  - Select all / Deselect all
  - Show count of selected customers

**UI Implementation:**
- Checkbox column (first column)
- Bulk actions toolbar above table
- Confirmation dialog before bulk update
- Progress indicator during bulk operation

**Business Value:** Very High - Efficient for managing multiple customers at once

---

### **3. Customer Quick View/Details** ⭐⭐
**Priority: MEDIUM**

**Location:** Customer List Table

**CRUD Operations:**
- ✅ **READ** - Quick view customer details:
  - Click customer ID → Opens quick view modal
  - Shows: All customer info, Portfolio summary, Recent activities
  - Link to full customer details page
  - Quick actions: Edit, Add Note, View Portfolio

**UI Implementation:**
- Clickable customer ID (link or button)
- Modal with tabs: Overview, Portfolio, Activities
- Quick action buttons

**Business Value:** Medium - Improves navigation and workflow

---

### **4. Saved Filter Presets** ⭐⭐
**Priority: MEDIUM**

**Location:** Top of dashboard (near risk profile filter)

**CRUD Operations:**
- ✅ **CREATE** - Save current filter state:
  - Filter name (e.g., "High Priority Customers", "Conservative Portfolio")
  - Current risk profile selection
  - Additional filters (if added later)
- ✅ **READ** - Load saved filters:
  - Dropdown with saved filter presets
  - Quick filter buttons
- ✅ **UPDATE** - Modify saved filter
- ✅ **DELETE** - Remove saved filter

**UI Implementation:**
- "Save Filter" button next to risk profile dropdown
- "Saved Filters" dropdown
- Manage filters modal (edit/delete)

**Business Value:** Medium - Saves time for frequently used filter combinations

---

### **5. Dashboard Notes/Annotations** ⭐⭐
**Priority: MEDIUM**

**Location:** Add notes section to dashboard

**CRUD Operations:**
- ✅ **CREATE** - Add dashboard notes:
  - Note title
  - Note content
  - Link to specific metric (optional)
  - Date
- ✅ **READ** - View all dashboard notes
- ✅ **UPDATE** - Edit notes
- ✅ **DELETE** - Remove notes

**Use Cases:**
- "Q1 target: 500 customers by March"
- "Focus on increasing AUM for Conservative customers"
- "Meeting notes: Discussed portfolio rebalancing strategy"

**Database Schema:**
```sql
CREATE TABLE dashboard_notes (
  id SERIAL PRIMARY KEY,
  rm_number VARCHAR(50) REFERENCES rm_account(rm_number),
  note_title VARCHAR(255),
  note_content TEXT,
  linked_metric VARCHAR(50), -- 'customers', 'aum', 'fbi', 'products', etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Business Value:** Medium - Helps RMs track goals and observations

---

### **6. Target/Goal Management** ⭐⭐⭐
**Priority: HIGH**

**Location:** Add to gauge charts (Total Customers, AUM, FBI)

**CRUD Operations:**
- ✅ **CREATE** - Set targets/goals:
  - Target for Total Customers (currently hardcoded: 500)
  - Target for Total AUM (currently hardcoded: 500,000,000)
  - Target for Total FBI (currently hardcoded: 800,000)
  - Target date
  - Notes
- ✅ **READ** - View current targets
- ✅ **UPDATE** - Modify targets
- ✅ **DELETE** - Remove targets

**UI Implementation:**
- "Set Target" button on each gauge chart
- Edit target inline or via modal
- Show progress percentage
- Visual indicator when target is reached

**Database Schema:**
```sql
CREATE TABLE dashboard_targets (
  id SERIAL PRIMARY KEY,
  rm_number VARCHAR(50) REFERENCES rm_account(rm_number),
  metric_type VARCHAR(50), -- 'customers', 'aum', 'fbi'
  target_value DECIMAL(15,2),
  current_value DECIMAL(15,2),
  target_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Business Value:** High - Allows RMs to set and track their own goals

---

### **7. Export Dashboard Data** ⭐⭐
**Priority: MEDIUM**

**Location:** Top right of dashboard

**CRUD Operations:**
- ✅ **EXPORT** - Export dashboard data:
  - Export Customer List to Excel/CSV
  - Export Dashboard Summary to PDF
  - Export Charts as images
  - Custom date range selection

**UI Implementation:**
- "Export" dropdown button
- Options: Excel, CSV, PDF, Image
- Date range picker for historical data

**Business Value:** Medium - Useful for reporting and analysis

---

### **8. Customer Tags/Labels** ⭐
**Priority: LOW-MEDIUM**

**Location:** Customer List Table

**CRUD Operations:**
- ✅ **CREATE** - Add tags to customers:
  - Tag name (e.g., "VIP", "High Priority", "Follow-up Needed")
  - Color coding
- ✅ **READ** - View tags per customer
- ✅ **UPDATE** - Edit tag assignments
- ✅ **DELETE** - Remove tags

**UI Implementation:**
- Tag badges in customer list
- Filter by tags
- Tag management panel

**Business Value:** Low-Medium - Organization tool

---

### **9. Dashboard Widget Customization** ⭐
**Priority: LOW**

**Location:** Dashboard settings

**CRUD Operations:**
- ✅ **CREATE** - Save custom dashboard layout
- ✅ **READ** - Load saved layouts
- ✅ **UPDATE** - Rearrange widgets
- ✅ **DELETE** - Reset to default

**UI Implementation:**
- Drag-and-drop widget reordering
- Show/hide widgets
- Save layout button

**Business Value:** Low - Nice to have for personalization

---

## 📋 **RECOMMENDED IMPLEMENTATION ORDER**

### **Phase 1: High Priority (Address "Too Shallow" Issue)**
1. ✅ **Customer Quick Edit** - Click row → Edit modal
2. ✅ **Bulk Customer Operations** - Select multiple → Bulk update
3. ✅ **Target/Goal Management** - Set custom targets for gauges

### **Phase 2: Medium Priority**
4. ✅ **Saved Filter Presets** - Save/load filter combinations
5. ✅ **Dashboard Notes** - Add notes to dashboard
6. ✅ **Export Dashboard Data** - Export to Excel/PDF

### **Phase 3: Nice to Have**
7. ✅ **Customer Quick View** - Quick details modal
8. ✅ **Customer Tags** - Tagging system
9. ✅ **Dashboard Widget Customization** - Layout customization

---

## 🎯 **QUICK WINS (Easiest to Implement)**

### 1. **Customer Quick Edit** ⚡
- Add edit button to each row
- Modal with form
- Use existing customer update API
- **Estimated Time:** 2-3 days

### 2. **Target Management** ⚡
- Simple form to set targets
- Store in database
- Update gauge charts to use stored targets
- **Estimated Time:** 2-3 days

### 3. **Saved Filters** ⚡
- Save current filter state
- Load saved filters
- **Estimated Time:** 1-2 days

---

## 💡 **SPECIFIC IMPLEMENTATION SUGGESTIONS**

### **Customer Quick Edit Modal**

**Fields to Include:**
```
┌─────────────────────────────────┐
│ Edit Customer: [Customer ID]   │
├─────────────────────────────────┤
│ Risk Profile: [Dropdown]        │
│ AUM Label: [Input]               │
│ Propensity: [Input]              │
│ Priority/Private: [Dropdown]     │
│ Customer Type: [Input]          │
│ Occupation: [Input]               │
│ Marital Status: [Dropdown]       │
│ Age: [Number Input]              │
│ Annual Income: [Number Input]    │
│                                 │
│ [Cancel]  [Save Changes]        │
└─────────────────────────────────┘
```

### **Bulk Actions Toolbar**

```
┌─────────────────────────────────────────────┐
│ [✓] 5 customers selected                    │
│ [Bulk Actions ▼] [Clear Selection]         │
│   • Update Risk Profile                     │
│   • Update AUM Label                        │
│   • Reassign RM                             │
│   • Update Priority/Private                 │
└─────────────────────────────────────────────┘
```

### **Target Management on Gauge Charts**

```
┌─────────────────────────┐
│   Total Customers       │
│                         │
│   [Gauge Chart]         │
│                         │
│   Current: 450          │
│   Target: [500] [Edit]  │
│   Progress: 90%         │
└─────────────────────────┘
```

---

## ✅ **SUCCESS METRICS**

After implementing Phase 1, the Dashboard Overview page will have:
- ✅ **3+ CRUD features** (currently 0)
- ✅ **Ability to edit customer data directly from dashboard**
- ✅ **Bulk operations for efficiency**
- ✅ **Customizable targets/goals**

This transforms the dashboard from "read-only display" to "interactive management hub"!

---

## 🛠️ **TECHNICAL NOTES**

### For Customer Quick Edit:
- Reuse customer update API endpoint
- Add validation (risk profile must be valid, age must be positive, etc.)
- Add audit logging (who changed what and when)

### For Bulk Operations:
- Add transaction support for bulk updates
- Show progress indicator
- Handle partial failures gracefully

### For Target Management:
- Store targets per RM (each RM can have different targets)
- Calculate progress automatically
- Show visual indicators when targets are met

---

_Last Updated: Based on dashboard overview page analysis_
_Focus: Practical CRUD operations that add interactivity to dashboard_


