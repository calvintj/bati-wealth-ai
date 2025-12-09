# Next Features to Implement in Dashboard Overview

## ✅ **ALREADY IMPLEMENTED**
1. ✅ **Customer Quick Edit** - Edit customer directly from table

---

## 🎯 **TOP PRIORITY - HIGH IMPACT**

### **1. Bulk Customer Operations** ⭐⭐⭐
**Why:** Saves massive time when managing multiple customers
**Effort:** Medium (2-3 days)
**Impact:** Very High

**Features:**
- Checkbox column to select multiple customers
- Bulk actions toolbar:
  - Bulk update Risk Profile
  - Bulk update AUM Label
  - Bulk update Propensity
  - Bulk reassign RM
  - Bulk update Priority/Private
- Select All / Deselect All
- Show count: "5 customers selected"

**UI:**
```
┌─────────────────────────────────────────────┐
│ [✓] 5 customers selected                    │
│ [Bulk Actions ▼] [Clear Selection]         │
│   • Update Risk Profile                     │
│   • Update AUM Label                        │
│   • Update Propensity                       │
│   • Reassign RM                             │
│   • Update Priority/Private                │
└─────────────────────────────────────────────┘
```

**Database:** No new tables needed (uses existing customer update API)

---

### **2. Target/Goal Management** ⭐⭐⭐
**Why:** Currently targets are hardcoded (500, 500M, 800K). RMs should set their own goals.
**Effort:** Medium (2-3 days)
**Impact:** High

**Features:**
- Set custom targets for:
  - Total Customers (currently: 500)
  - Total AUM (currently: 500,000,000)
  - Total FBI (currently: 800,000)
- Edit targets directly on gauge charts
- Show progress percentage
- Visual indicator when target is reached

**UI on Gauge Charts:**
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

**Database Schema:**
```sql
CREATE TABLE dashboard_targets (
  id SERIAL PRIMARY KEY,
  rm_number VARCHAR(50) REFERENCES rm_account(rm_number),
  metric_type VARCHAR(50), -- 'customers', 'aum', 'fbi'
  target_value DECIMAL(15,2),
  target_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📊 **MEDIUM PRIORITY - GOOD VALUE**

### **3. Export Dashboard Data** ⭐⭐
**Why:** RMs need to export data for reports and analysis
**Effort:** Low-Medium (1-2 days)
**Impact:** Medium

**Features:**
- Export Customer List to Excel/CSV
- Export Dashboard Summary to PDF
- Export Charts as images (PNG/JPEG)
- Date range selection for historical data

**UI:**
- "Export" button in top right
- Dropdown: Excel, CSV, PDF, Image
- Date range picker

**Libraries Needed:**
- `xlsx` or `exceljs` for Excel export
- `jspdf` or `react-pdf` for PDF export
- `html2canvas` for chart images

---

### **4. Saved Filter Presets** ⭐⭐
**Why:** RMs frequently use same filter combinations
**Effort:** Low (1-2 days)
**Impact:** Medium

**Features:**
- Save current risk profile filter as preset
- Quick access dropdown with saved filters
- Name your filters (e.g., "High Priority Customers", "Conservative Portfolio")
- Edit/Delete saved filters

**UI:**
```
[Risk Profile: All ▼] [Save Filter] [Saved Filters ▼]
  • High Priority Customers
  • Conservative Portfolio
  • Q1 Targets
```

**Database Schema:**
```sql
CREATE TABLE dashboard_filter_presets (
  id SERIAL PRIMARY KEY,
  rm_number VARCHAR(50) REFERENCES rm_account(rm_number),
  preset_name VARCHAR(255),
  risk_profile VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### **5. Dashboard Notes/Annotations** ⭐⭐
**Why:** RMs want to track goals, observations, meeting notes
**Effort:** Medium (2-3 days)
**Impact:** Medium

**Features:**
- Add notes to dashboard
- Link notes to specific metrics (optional)
- View all notes in sidebar or modal
- Edit/Delete notes

**UI:**
- "Add Note" button
- Notes panel or modal
- Notes list with date, title, content

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

---

## 💡 **NICE TO HAVE - LOWER PRIORITY**

### **6. Customer Quick View** ⭐
**Why:** Quick access to customer details without leaving dashboard
**Effort:** Medium (2-3 days)
**Impact:** Low-Medium

**Features:**
- Click customer ID → Opens quick view modal
- Shows: All customer info, Portfolio summary, Recent activities
- Link to full customer details page
- Quick actions: Edit, Add Note, View Portfolio

---

### **7. Customer Tags/Labels** ⭐
**Why:** Organize customers with custom tags
**Effort:** Medium (2-3 days)
**Impact:** Low-Medium

**Features:**
- Add tags to customers (e.g., "VIP", "High Priority", "Follow-up Needed")
- Color-coded tag badges
- Filter customers by tags
- Tag management panel

**Database Schema:**
```sql
CREATE TABLE customer_tags (
  id SERIAL PRIMARY KEY,
  rm_number VARCHAR(50) REFERENCES rm_account(rm_number),
  tag_name VARCHAR(100),
  tag_color VARCHAR(7), -- hex color
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_tag_assignments (
  id SERIAL PRIMARY KEY,
  customer_id VARCHAR(50) REFERENCES customer_info(bp_number_wm_core),
  tag_id INTEGER REFERENCES customer_tags(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### **8. Dashboard Widget Customization** ⭐
**Why:** Personalize dashboard layout
**Effort:** High (3-5 days)
**Impact:** Low

**Features:**
- Drag-and-drop to rearrange widgets
- Show/hide widgets
- Save custom layouts
- Reset to default

**Libraries Needed:**
- `react-grid-layout` or `dnd-kit` for drag-and-drop

---

## 🚀 **RECOMMENDED IMPLEMENTATION ORDER**

### **Phase 1: High Impact (Next 1-2 weeks)**
1. **Bulk Customer Operations** - Most requested, saves time
2. **Target/Goal Management** - Makes dashboard interactive

### **Phase 2: Medium Impact (Next 2-3 weeks)**
3. **Export Dashboard Data** - Useful for reporting
4. **Saved Filter Presets** - Quick win, easy to implement
5. **Dashboard Notes** - Helps with tracking goals

### **Phase 3: Nice to Have (Future)**
6. **Customer Quick View** - Convenience feature
7. **Customer Tags** - Organization tool
8. **Dashboard Widget Customization** - Personalization

---

## 📝 **QUICK WINS (Easiest to Implement First)**

### **1. Saved Filter Presets** ⚡
- Simple database table
- Save/load filter state
- **Estimated Time:** 1-2 days

### **2. Export Customer List to CSV** ⚡
- Use existing customer list data
- Simple CSV generation
- **Estimated Time:** 1 day

### **3. Target Management** ⚡
- Simple form + database
- Update gauge charts to use stored targets
- **Estimated Time:** 2-3 days

---

## 🎯 **MY RECOMMENDATION**

**Start with Bulk Customer Operations** because:
1. ✅ **High Impact** - Saves massive time
2. ✅ **Addresses "Too Shallow"** - Adds significant interactivity
3. ✅ **Reuses Existing Code** - Uses customer update API we just built
4. ✅ **Visible Feature** - Users will immediately see the value

**Then Target Management** because:
1. ✅ **Makes Charts Interactive** - Users can set their own goals
2. ✅ **High Visibility** - Targets shown on every gauge chart
3. ✅ **Quick Win** - Relatively simple to implement

---

## 💻 **IMPLEMENTATION TIPS**

### For Bulk Operations:
- Use React Query's `useMutation` with array of updates
- Show progress indicator during bulk update
- Handle partial failures gracefully
- Add confirmation dialog before bulk update

### For Target Management:
- Store targets per RM (each RM has different targets)
- Calculate progress automatically
- Show visual indicators when targets are met
- Allow editing targets inline or via modal

### For Export:
- Use `xlsx` library for Excel export
- Use `jspdf` + `html2canvas` for PDF with charts
- Show loading state during export
- Download file automatically

---

_Last Updated: After Customer Quick Edit implementation_
_Next Priority: Bulk Customer Operations + Target Management_


