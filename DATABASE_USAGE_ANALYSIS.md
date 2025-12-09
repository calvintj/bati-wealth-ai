# Database Table Usage Analysis

This document explains what each table does in the codebase and identifies unused tables/columns.

## Table Usage Summary

### 1. `customer_info` (Central Table) ✅ **HEAVILY USED**

**Purpose:** Stores core customer information and demographics. This is the central table that links to most other tables.

**Used Columns:**
- `bp_number_wm_core` (PK) - Used everywhere as customer identifier
- `assigned_rm` (FK) - Used to link customers to Relationship Managers
- `risk_profile` - Used extensively for filtering and grouping customers
- `aum_label` - Used in customer lists and filtering
- `propensity` - Used in customer filtering
- `priority_private` - Used in customer details display
- `customer_type` - Used in customer details
- `pekerjaan` (occupation) - Used in customer details
- `status_nikah` (marital status) - Used in customer details
- `usia` (age) - Used in customer details
- `annual_income` - Used in customer details
- `tanggal_join_wealth` - Used to calculate "Vintage" (years since joining)

**UNUSED Columns:**
- ❌ `risk_profile_number` - Not referenced in any queries
- ❌ `risk_profile_description` - Not referenced in any queries
- ❌ `transaction_label` - Not referenced in any queries
- ❌ `aum_label` - Actually USED (found in queries)
- ❌ `bac` (Balance at Account) - Not used directly from customer_info
- ❌ `sb` (Savings Balance) - Not used directly from customer_info
- ❌ `rd` (Risk Diversification) - Not used directly from customer_info
- ❌ `score_overall` - Not referenced in any queries
- ❌ `score_bac` - Not referenced in any queries
- ❌ `score_sb` - Not referenced in any queries
- ❌ `score_rd` - Not referenced in any queries
- ❌ `region` - Not referenced in any queries
- ❌ `nama_area` (area name) - Not referenced in any queries

---

### 2. `historical_transaction` ✅ **HEAVILY USED**

**Purpose:** Records past transactions made by customers. Used for portfolio analysis, product recommendations, and transaction history.

**Used Columns:**
- `transaction_id` (PK) - Used for ordering transactions
- `bp_number_wm_core` (FK) - Links to customer_info
- `nama_produk` (product name) - Used extensively in product analysis
- `jumlah_amount` (transaction amount) - Used for calculating totals
- `price_bought` - Used in owned products display
- `jumlah_transaksi` (number of transactions) - Used in owned products
- `profit` - Used in recommendations and owned products
- `return_value` - Used in owned products
- `keterangan` (description) - Used in owned products display

**UNUSED Columns:**
- ❌ `jenis_produk` (product type) - Not referenced in queries
- ❌ `detail_product` (detailed product description) - Not referenced
- ❌ `quarter` - Not used (though year/quarter exist in current_allocation)
- ❌ `year` - Not used (though year/quarter exist in current_allocation)
- ❌ `current_price` - Not referenced in queries
- ❌ `current_amount` - Not referenced in queries
- ❌ `transaction_date` - Not referenced in queries

**Note:** The `quarter` and `year` columns exist but are not used in queries. Instead, time-based analysis uses `current_allocation` table's quarter/year.

---

### 3. `current_allocation` ✅ **HEAVILY USED**

**Purpose:** Stores current asset allocation details for customers, organized by quarter and year. Used for portfolio analysis, AUM/FUM calculations, and quarterly trends.

**Used Columns:**
- `bp_number_wm_core` (PK, FK) - Links to customer_info
- `quarter` - Used extensively for quarterly analysis
- `year` - Used extensively for quarterly analysis
- `fum` (Funds Under Management) - Used in dashboard and customer details
- `aum` (Assets Under Management) - Used extensively in dashboards
- `casa` (Current Account Savings Account) - Used in portfolio and quarterly FUM
- `deposito` (Deposit) - Used in portfolio and quarterly FUM
- `rd` (Risk Diversification) - Used in portfolio and quarterly AUM
- `sb` (Savings Balance) - Used in portfolio and quarterly AUM
- `bac` (Balance at Account) - Used in portfolio and quarterly AUM
- `fbi_rd` (Foreign Bank Investment Risk Diversification) - Used in FBI calculations
- `fbi_sb` (Foreign Bank Investment Savings Balance) - Used in FBI calculations
- `fbi_bac` (Foreign Bank Investment Balance at Account) - Used in FBI calculations

**UNUSED Columns:**
- ✅ All columns are used

---

### 4. `rm_account` ✅ **USED**

**Purpose:** Manages authentication and account information for Relationship Managers.

**Used Columns:**
- `rm_account_id` (PK) - Used in queries
- `email` - Used for authentication (login)
- `password_hash` - Used for authentication
- `rm_number` (FK) - Used to link to rm_task_manager and customer_info
- `created_at` - Used in admin queries to list users
- `role` - Used in admin queries (filtering by role='user')

**UNUSED Columns:**
- ✅ All columns are used

---

### 5. `rm_task_manager` ✅ **USED**

**Purpose:** Manages tasks assigned to Relationship Managers. Used in the recommendation center.

**Used Columns:**
- `id` (PK) - Used for task CRUD operations
- `rm_number` (PK, FK) - Used to filter tasks by RM
- `description` - Used in task display and CRUD operations
- `due_date` - Used in task display and CRUD operations
- `invitee` - Used in task display and CRUD operations

**UNUSED Columns:**
- ❌ `created_at` - Not referenced in queries

---

### 6. `customer_activity` ✅ **USED**

**Purpose:** Logs various activities related to customers. Used in customer details page for activity tracking.

**Used Columns:**
- `id` (PK) - Used for activity CRUD operations
- `bp_number_wm_core` (FK) - Links to customer_info
- `title` - Used in activity display and CRUD
- `description` - Used in activity display and CRUD
- `date` - Used in activity display and CRUD (ordered by date DESC)

**UNUSED Columns:**
- ❌ `created_at` - Not referenced in queries

---

### 7. `optimized_allocation` ✅ **USED**

**Purpose:** Stores optimized asset allocation recommendations for customers. Used for portfolio optimization and recommendations.

**Used Columns:**
- `bp_number_wm_core` (PK, FK) - Links to customer_info
- `asset_type` - Used in optimized portfolio display
- `usd_allocation` - Used in optimized portfolio display
- `expected_return` - Used in return percentage calculations
- `current_expected_return` - Used in return percentage calculations

**UNUSED Columns:**
- ❌ `recommended_allocation` - Not referenced in queries
- ❌ `cur_allocation` (current allocation) - Not referenced
- ❌ `usd_current_allocation` - Not referenced
- ❌ `product_1` - **Used in FastAPI backend** (functions.py) but NOT in Node.js server
- ❌ `product_2` - **Used in FastAPI backend** (functions.py) but NOT in Node.js server
- ❌ `product_3` - **Used in FastAPI backend** (functions.py) but NOT in Node.js server
- ❌ `usd_expected_return` - Not referenced
- ❌ `usd_current_expected_return` - Not referenced
- ❌ `usd_fee` - Not referenced

**Note:** The `product_1`, `product_2`, `product_3` columns are used in the FastAPI Python backend (in `functions.py` for product recommendations), but not in the Node.js server codebase.

---

### 8. `customer_segmentation_offer` ✅ **PARTIALLY USED**

**Purpose:** Contains customer segmentation data and product offers based on risk profiles. Used for product recommendations.

**Used Columns:**
- `bp_number_wm_core` (PK, FK) - Links to customer_info
- `risk_profile` - Used in offer queries
- `offer_product_risk_1` - Used in recommendation queries
- `offer_product_risk_2` - Used in recommendation queries
- `offer_product_risk_3` - Used in recommendation queries
- `offer_product_risk_4` - Used in recommendation queries
- `offer_product_risk_5` - Used in recommendation queries
- `offer_reprofile_risk_target` - Used in reprofiling recommendations

**UNUSED Columns:**
- ❌ `offer_reprofile` - Not referenced in queries
- ❌ `product_risk_1_offer_1` through `product_risk_1_offer_3` - Not referenced
- ❌ `product_risk_2_offer_1` through `product_risk_2_offer_3` - Not referenced
- ❌ `product_risk_3_offer_1` through `product_risk_3_offer_3` - Not referenced
- ❌ `product_risk_4_offer_1` through `product_risk_4_offer_3` - Not referenced
- ❌ `product_risk_5_offer_1` through `product_risk_5_offer_3` - Not referenced

**Note:** There are 15 specific product offer columns (3 per risk level) that are completely unused in the codebase.

---

## Summary Statistics

### Tables Usage:
- ✅ **7 out of 8 tables are actively used** in the Node.js server
- ⚠️ All tables exist in the database, but some have many unused columns

### Most Used Tables:
1. `customer_info` - Central hub, used in almost every query
2. `current_allocation` - Used extensively for portfolio metrics
3. `historical_transaction` - Used for transaction history and product analysis
4. `customer_segmentation_offer` - Used for recommendations

### Least Used Tables:
- `rm_task_manager` - Only used in recommendation center (task management)
- `customer_activity` - Only used in customer details page (CRUD operations)

### Unused Columns Summary:

**customer_info:**
- Scoring columns: `score_overall`, `score_bac`, `score_sb`, `score_rd`
- Profile metadata: `risk_profile_number`, `risk_profile_description`, `transaction_label`
- Location: `region`, `nama_area`
- Direct allocation values: `bac`, `sb`, `rd` (these are in current_allocation instead)

**historical_transaction:**
- Product details: `jenis_produk`, `detail_product`
- Time fields: `quarter`, `year` (unused, time analysis uses current_allocation)
- Price tracking: `current_price`, `current_amount`, `transaction_date`

**optimized_allocation:**
- Most columns unused in Node.js server (only 5 out of 13 columns used)
- `product_1`, `product_2`, `product_3` are used in FastAPI backend only

**customer_segmentation_offer:**
- 15 specific product offer columns completely unused
- `offer_reprofile` column unused

**rm_task_manager:**
- `created_at` timestamp unused

**customer_activity:**
- `created_at` timestamp unused

---

## Recommendations

1. **Consider removing unused columns** if they're not needed for future features
2. **Document why certain columns exist** if they're for future use or external systems
3. **The FastAPI backend uses some columns** (like `product_1`, `product_2`, `product_3`) that the Node.js server doesn't - ensure both backends are aware of each other's usage
4. **The 15 unused product offer columns** in `customer_segmentation_offer` might be for future features - verify if they should be removed or if functionality is planned

