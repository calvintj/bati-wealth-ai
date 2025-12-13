# Black Box Testing - Complete Feature List

## BATI Wealth AI Platform

This document provides a comprehensive list of all features in the BATI Wealth AI Platform for black box testing purposes. Features are organized by functional areas and include user-facing functionality, API endpoints, and system behaviors.

**Document Version:** 2.0  
**Last Updated:** Based on current codebase analysis  
**Total Features Identified:** 250+ individual features across 15 major categories

---

## 1. AUTHENTICATION & AUTHORIZATION

### 1.1 Login System

- **Login Page** (`/`)
  - Email and password input fields
  - Form validation (email format, required fields)
  - Login button functionality
  - Error handling for invalid credentials
  - Success redirect to dashboard
  - Dark/Light theme toggle
  - Responsive design (mobile/desktop)
  - Loading state during authentication
  - JWT token storage in localStorage
  - Session persistence
  - Role-based redirect (Admin → `/admin`, User → `/dashboard-overview`)

### 1.2 Password Management

- **Update Password** (Authenticated users)
  - Change password functionality
  - Password validation
  - Email verification
  - Success/error feedback
  - Admin can reset user passwords

### 1.3 User Management (Admin Only)

- **User Registration**

  - Create new RM user
  - Email auto-generation from RM number (`{rm_number}@batiinvestasi.ai`)
  - Role assignment (Admin/User)
  - Password setup
  - Validation and error handling
  - RM number format validation (RMXXX)

- **User List**

  - View all users with pagination
  - User details (RM number, email, role, created_at)
  - Search functionality
  - Pagination controls (10 items per page)
  - Sortable columns

- **User Update**

  - Update user information
  - Modify email
  - Change role
  - Update RM number
  - Form validation

- **User Deletion**
  - Delete user account
  - Confirmation dialog
  - Cascade handling
  - Success/error feedback

### 1.4 Permission Management System (Admin Only)

- **Page Permissions**

  - View all available pages
  - Manage permissions per page (View, Add, Update, Delete)
  - Default permissions for all RM users
  - Individual user permission override
  - Bulk permission updates
  - Permission inheritance from defaults

- **Permission Types**

  - `can_view` - View page and data
  - `can_add` - Create new records
  - `can_update` - Edit existing records
  - `can_delete` - Remove records
  - Page-specific restrictions (e.g., Chatbot has no Add/Update/Delete)

- **Permission Application**
  - Apply default permissions to all RM users
  - Individual user permission customization
  - Permission checking middleware
  - Real-time permission validation

### 1.5 Access Control

- **Protected Routes**

  - Authentication required for all pages except login
  - Redirect to login if not authenticated
  - Token expiration handling
  - Role-based access (Admin vs User)
  - Permission-based access (canView, canAdd, canUpdate, canDelete)
  - Admin-only routes (`/admin`, `/logs`)

- **Session Management**
  - Token refresh
  - Automatic logout on token expiry
  - Session timeout handling
  - LocalStorage-based session persistence

---

## 2. DASHBOARD OVERVIEW

### 2.1 Portfolio Metrics

- **Total Customers Card**

  - Display total customer count
  - Breakdown by risk profile:
    - Conservative
    - Balanced
    - Moderate
    - Growth
    - Aggressive
  - Gauge chart visualization
  - Target value display (customizable)
  - Progress percentage
  - Real-time data updates
  - Risk profile filtering

- **AUM (Assets Under Management) Metrics**

  - Total AUM display
  - AUM per risk profile
  - Comparison with previous period
  - Growth indicators
  - Currency formatting
  - Gauge chart with target
  - Progress tracking

- **FBI (Foreign Bank Investment) Metrics**
  - Total FBI display
  - Breakdown per risk profile
  - Components: FBI_RD + FBI_SB + FBI_BAC
  - Trend analysis
  - Gauge chart with target
  - Progress tracking

### 2.2 Quarterly Performance Charts

- **FUM Quarterly Chart**

  - Line chart visualization
  - 6 quarters of historical data
  - Breakdown per risk profile
  - Interactive tooltips
  - Export capability
  - Risk profile filtering

- **FBI Quarterly Chart**

  - Line chart visualization
  - 6 quarters of historical data
  - Breakdown per risk profile
  - Interactive tooltips
  - Export capability
  - Risk profile filtering

- **Customer Risk Profile Chart**
  - Pie chart visualization
  - Distribution by risk profile
  - Interactive tooltips
  - Percentage breakdown

### 2.3 Top Products Table

- **Product Rankings**
  - Top 5 products by total amount
  - Breakdown per risk profile
  - Product name, amount, transaction count
  - Bar chart visualization
  - Sortable columns
  - Search functionality
  - Risk profile filtering

### 2.4 Customer List Table

- **Customer Data Display**

  - Customer ID
  - Risk Profile
  - AUM Label
  - Propensity
  - Customer Type
  - Priority/Private status
  - Sortable columns
  - Search functionality
  - Filter by risk profile
  - Pagination
  - Row selection
  - Navigation to customer details

- **Customer Quick Edit**

  - Edit customer directly from table
  - Modal dialog with form fields
  - Update risk profile, AUM label, propensity, etc.
  - Form validation
  - Success/error feedback

- **Bulk Customer Operations**
  - Select multiple customers (checkbox)
  - Bulk update risk profile
  - Bulk update AUM label
  - Bulk update propensity
  - Bulk reassign RM
  - Bulk update priority/private
  - Select all / Deselect all
  - Confirmation dialog
  - Progress indicator

### 2.5 Dashboard Targets Management (CRUD)

- **Target Management**
  - Set custom targets for Total Customers
  - Set custom targets for Total AUM
  - Set custom targets for Total FBI
  - View current targets
  - Update existing targets
  - Delete targets
  - Target date setting
  - Notes/description
  - Progress tracking
  - Visual indicators when target is reached

### 2.6 Filtering & Search

- **Risk Profile Filter**

  - Filter all metrics by risk profile
  - Real-time data updates
  - Clear filter option
  - "All" option to show all profiles

- **Search Functionality**
  - Search customers by ID
  - Search products by name
  - Real-time search results
  - Case-insensitive search

---

## 3. AI CHATBOT

### 3.1 Chat Interface

- **Chat UI**
  - Message input field
  - Send button
  - Message history display
  - User messages vs AI responses
  - Timestamp display
  - Scroll to latest message
  - Clear chat functionality
  - Dark/Light theme support
  - Responsive design

### 3.2 AI Functions

- **Customer Profile Analysis**

  - `present_customer_profile` function
  - Display customer information
  - Risk profile analysis
  - Portfolio overview
  - Demographics display

- **Portfolio Optimization**

  - `present_optimized_portfolio` function
  - Recommended asset allocation
  - Comparison with current portfolio
  - Expected returns
  - USD allocation suggestions

- **Historical Transaction Analysis**

  - `present_historical_transaction` function
  - Transaction history display
  - Pattern analysis
  - Performance evaluation
  - Trend identification

- **Period Performance Analysis**

  - `previous_period_performance` function
  - Quarter-over-quarter comparison
  - Performance trends
  - Growth analysis
  - Historical comparison

- **Product Recommendations**

  - `present_recommended_products` function
  - Personalized product suggestions
  - Risk-appropriate recommendations
  - Product details
  - Risk matching

- **New Allocation Recommendations**

  - `get_new_allocation` function
  - Structured allocation output
  - RD and SB allocation suggestions
  - Portfolio rebalancing advice
  - Allocation percentage calculation

- **Customer Filtering**

  - `filter_customers_region` function
  - Filter customers by region
  - Regional analysis
  - Geographic distribution

- **SQL Query Generation**
  - `generate_sql_syntax_product_data` function
  - `generate_sql_syntax_customer_transaction` function
  - Custom query generation
  - Query execution
  - Results presentation
  - Error handling for invalid queries

### 3.3 Chat Features

- **Streaming Response**

  - Real-time text streaming
  - Loading indicators
  - Progressive message display
  - Chunk-based rendering

- **Function Calling Indicator**

  - Visual indicator when AI calls functions
  - Status updates
  - Progress feedback
  - Function execution status

- **Multi-language Support**

  - Indonesian (default)
  - English
  - Language selection
  - Context-aware responses
  - Language-specific formatting

- **Context Awareness**

  - Conversation history
  - Follow-up questions
  - Contextual responses
  - Customer ID integration
  - Session persistence

- **Error Handling**
  - Invalid query handling
  - Missing customer ID warnings
  - API error messages
  - Timeout handling
  - Database connection errors

---

## 4. CUSTOMER DETAILS

### 4.1 Customer Profile Section

- **Customer Information Display**

  - Customer ID
  - Risk Profile
  - AUM Label
  - Propensity
  - Priority/Private status
  - Customer Type
  - Demographics:
    - Pekerjaan (Occupation)
    - Status Nikah (Marital Status)
    - Usia (Age)
  - Annual Income
  - Vintage (years since joining)
  - Total FUM, AUM, FBI

- **Customer Selection**

  - Dropdown for customer selection
  - Search in dropdown
  - Quick customer switching
  - Customer ID list retrieval
  - Recent customers list

- **Customer Information Update (CRUD)**
  - Update customer details
  - Modify risk profile
  - Update AUM label
  - Change propensity
  - Update priority/private status
  - Modify customer type
  - Update occupation, marital status, age
  - Change annual income
  - Form validation
  - Success/error feedback

### 4.2 Portfolio Metrics

- **Current Portfolio Allocation**

  - CASA (Current Account Savings Account)
  - Deposito
  - RD (Risk Diversification)
  - SB (Savings Balance)
  - BAC (Balance at Account)
  - Pie chart visualization
  - Bar chart visualization
  - Percentage breakdown
  - Amount display
  - Currency formatting

- **Optimized Portfolio**
  - Recommended allocation per asset type
  - USD allocation
  - Comparison with current allocation
  - Expected return vs current expected return
  - Visual comparison charts
  - Difference indicators
  - Rebalancing suggestions

### 4.3 Quarterly Performance

- **AUM Quarterly Chart**

  - 4 quarters of historical data
  - Line chart visualization
  - Trend analysis
  - Interactive tooltips
  - Export capability

- **FUM Quarterly Chart**
  - 4 quarters of historical data
  - Line chart visualization
  - Trend analysis
  - Interactive tooltips
  - Export capability

### 4.4 Owned Products Table

- **Product Holdings**
  - Product name
  - Number of transactions
  - Amount
  - Price bought
  - Profit
  - Return value
  - Sortable columns
  - Search functionality
  - Filter options
  - Export capability

### 4.5 Recommendation Products

- **Product Recommendations**
  - Recommended products based on risk profile
  - Offer product risk (1-5)
  - Reprofile risk target
  - Product details
  - Risk matching
  - Sortable table
  - Filter by risk level

### 4.6 Customer Activities (CRUD)

- **Activity List**

  - View all activities for customer
  - Activity details (Title, Description, Date)
  - Sortable by date
  - Search functionality
  - Filter by date range
  - Pagination

- **Create Activity**

  - Add new activity
  - Title input
  - Description input
  - Date selection
  - Form validation
  - Success/error feedback
  - Permission checking (canAdd)

- **Update Activity**

  - Edit existing activity
  - Modify title, description, date
  - Form validation
  - Success/error feedback
  - Permission checking (canUpdate)

- **Delete Activity**
  - Remove activity
  - Confirmation dialog
  - Success/error feedback
  - Permission checking (canDelete)

---

## 5. CUSTOMER MAPPING

### 5.1 Multi-dimensional Filtering

- **Propensity Filter**

  - Filter by propensity score
  - Multiple propensity levels
  - Real-time updates
  - Clear filter option

- **AUM Label Filter**

  - Filter by AUM levels
  - Multiple AUM categories
  - Real-time updates
  - Clear filter option

- **Risk Profile Filter**

  - Filter by risk profile
  - Multiple risk levels
  - Real-time updates
  - Clear filter option

- **Combined Filters**
  - Multiple filter combinations
  - AND logic (all filters must match)
  - Clear all filters
  - Filter persistence

### 5.2 Visualization

- **Stacked Bar Chart**
  - Customer distribution visualization
  - Breakdown per risk profile
  - Breakdown per propensity
  - Breakdown per AUM label
  - Interactive tooltips
  - Export capability
  - Responsive design

### 5.3 Customer List Table

- **Filtered Customer List**
  - Customer ID
  - Risk Profile
  - AUM Label
  - Propensity
  - Customer Type
  - Total FUM, AUM, FBI
  - Sortable columns
  - Search functionality
  - Pagination
  - Navigation to customer details
  - Export capability

---

## 6. RECOMMENDATION CENTRE

### 6.1 Managed Numbers

- **Summary Metrics**
  - Total customers managed
  - Total AUM
  - Total FBI
  - Display cards
  - Real-time updates
  - Visual indicators

### 6.2 Increased Numbers

- **Growth Metrics**
  - Current quarter vs previous quarter
  - Growth percentage for customers
  - Growth percentage for AUM
  - Growth percentage for FBI
  - Visual indicators (positive/negative)
  - Trend arrows
  - Color coding (green/red)

### 6.3 Portfolio Summary

- **Portfolio Breakdown**
  - CASA total
  - SB total
  - Deposito total
  - RD total
  - Visual charts
  - Percentage breakdown
  - Amount display

### 6.4 Last Transaction

- **Recent Transactions Table**
  - Last 5 transactions
  - Customer ID
  - Transaction ID
  - Amount
  - Date
  - Sortable by date
  - Navigation to customer details
  - Export capability

### 6.5 Potential Transaction

- **Opportunity List**
  - Potential transactions sorted by profit
  - Customer ID
  - Product Name
  - Profit amount
  - Transaction ID
  - Sorted by transaction_id DESC
  - Filter options
  - Search functionality
  - Export capability

### 6.6 Offer Product Risk

- **Product Recommendations**
  - Recommendations based on risk profile
  - Risk level (1-5)
  - Product details
  - Customer matching
  - Sortable table
  - Filter by risk level
  - Export capability

### 6.7 Reprofile Risk Target

- **Reprofiling Recommendations**
  - Customers requiring risk profile update
  - Target risk profile
  - Current risk profile
  - Filter: offer_reprofile_risk_target != '0'
  - Action buttons
  - Bulk reprofiling option

### 6.8 Task Manager (CRUD)

- **Task List**

  - View all tasks
  - Task details (Description, Due Date, Invitee)
  - Filter by RM number
  - Sortable by due date
  - Status indicators
  - Search functionality
  - Pagination

- **Create Task**

  - Add new task
  - Description input
  - Due date selection
  - Invitee selection
  - Form validation
  - Success/error feedback
  - Permission checking (canAdd)

- **Update Task**

  - Edit existing task
  - Modify description, due date, invitee
  - Form validation
  - Success/error feedback
  - Permission checking (canUpdate)

- **Delete Task**
  - Remove task
  - Confirmation dialog
  - Success/error feedback
  - Permission checking (canDelete)

---

## 7. MARKET INDICES

### 7.1 Market Data Display

- **S&P 500 (SPX)**

  - Current value
  - Change percentage
  - Change amount
  - Last update time
  - Color coding (positive/negative)
  - Historical data

- **NASDAQ (NDX)**

  - Current value
  - Change percentage
  - Change amount
  - Last update time
  - Color coding
  - Historical data

- **Dow Jones (DJI)**

  - Current value
  - Change percentage
  - Change amount
  - Last update time
  - Color coding
  - Historical data

- **LQ45 (Indonesia)**

  - Current value
  - Change percentage
  - Change amount
  - Last update time
  - Color coding
  - Historical data

- **Composite Index (Indonesia)**
  - Current value
  - Change percentage
  - Change amount
  - Last update time
  - Color coding
  - Historical data

### 7.2 Visualization

- **Line Charts**
  - Historical trend visualization
  - Multiple timeframes
  - Interactive tooltips
  - Export capability
  - Responsive design

### 7.3 Watchlist Management (CRUD)

- **Watchlist Features**
  - View watchlist
  - Add indices to watchlist
  - Update watchlist preferences
  - Delete from watchlist
  - Custom watchlist organization
  - Permission checking

### 7.4 Notes Management (CRUD)

- **Market Notes**
  - Create notes about market indices
  - View all notes
  - Update existing notes
  - Delete notes
  - Link notes to specific indices
  - Date/time stamping
  - Permission checking

### 7.5 Real-time Updates

- **Auto-refresh**
  - Automatic data updates
  - Manual refresh button
  - Update indicators
  - Error handling for API failures
  - Connection status display

---

## 8. MARKET NEWS

### 8.1 Economic Indicators

- **GDP Growth Rate**

  - Indonesian GDP data
  - Real-time updates
  - Historical trends
  - Chart visualization

- **BI Rate**

  - Bank Indonesia policy rate
  - Current rate display
  - Historical data
  - Trend visualization

- **Inflation Rate**
  - Current inflation metrics
  - Trend visualization
  - Historical comparison
  - Chart display

### 8.2 News Feed

- **Financial News**

  - Latest market news
  - News articles display
  - Article details
  - Source information
  - Date filtering
  - Category filtering

- **News Filtering**
  - Filter by category
  - Search functionality
  - Date filtering
  - Source filtering

### 8.3 Product Highlights

- **Featured Products**
  - Daily featured products
  - Products: BBCA, BBNI, BMRN, BTPN, DCII, ADRO
  - Product details
  - Performance metrics
  - Historical data

### 8.4 Product Picks Management (CRUD)

- **Product Picks**
  - View featured product picks
  - Create new product pick
  - Update product pick details
  - Delete product pick
  - Link to products
  - Notes and observations
  - Permission checking

### 8.5 News Notes Management (CRUD)

- **News Notes**
  - Create notes about news articles
  - View all news notes
  - Update existing notes
  - Delete notes
  - Link notes to articles
  - Relevance tracking
  - Permission checking

---

## 9. ADMIN PANEL

### 9.1 User Management

- **User List**

  - Display all users
  - User details (RM number, email, role, created_at)
  - Pagination (10 items per page)
  - Search functionality
  - Sortable columns
  - Admin-only access

- **Create User**

  - Add new RM user
  - Email auto-generation
  - Role assignment
  - Password setup
  - Form validation
  - Success/error feedback
  - RM number format validation

- **Update User**

  - Edit user information
  - Modify email
  - Change role
  - Update RM number
  - Form validation
  - Success/error feedback

- **Delete User**
  - Remove user account
  - Confirmation dialog
  - Cascade handling
  - Success/error feedback

### 9.2 Password Management

- **Reset Password**
  - Reset user password
  - Generate new password
  - Email-based password reset
  - Success/error feedback
  - Security notifications

### 9.3 Permission Management

- **Default Page Permissions**

  - Set default permissions for all RM users
  - Manage View, Add, Update, Delete per page
  - Apply to all RM users
  - Permission inheritance
  - Page-specific restrictions

- **Individual User Permissions**

  - View user permissions
  - Customize permissions per user
  - Override default permissions
  - Bulk permission updates
  - Permission matrix display

- **Permission Types**
  - View permission (can_view)
  - Add permission (can_add)
  - Update permission (can_update)
  - Delete permission (can_delete)
  - Page-specific restrictions

### 9.4 System Logs Access

- **Logs Navigation**
  - Link to system logs page
  - Admin-only access
  - Quick access from admin panel

### 9.5 System Settings

- **System Configuration**
  - System-wide settings display
  - Security level indicators
  - Backup status
  - System health metrics

---

## 10. SYSTEM LOGS

### 10.1 Log Display

- **Real-time Logging**
  - Live log streaming
  - Log entries display
  - Timestamp information
  - Log level indicators
  - Auto-refresh (every 5 seconds)
  - Admin-only access

### 10.2 Log Filtering

- **Filter by Log Level**
  - Error logs
  - Warning logs
  - Info logs
  - Debug logs
  - All logs
  - Filter buttons
  - Active filter highlighting

### 10.3 Log Management

- **Log Clearing**

  - Clear logs functionality
  - Confirmation dialog
  - Log retention
  - Clear all logs button

- **Log Display Format**
  - Log level badges
  - Timestamp display
  - Message content
  - Data object display (JSON format)
  - Color coding by level
  - Scrollable log container

---

## 11. UI/UX FEATURES

### 11.1 Theme Management

- **Dark/Light Mode**
  - Theme toggle
  - Persistent theme preference
  - System theme detection
  - Smooth transitions
  - Color mode toggle component
  - Theme-aware components

### 11.2 Responsive Design

- **Mobile Support**

  - Responsive layouts
  - Touch-friendly interactions
  - Mobile navigation
  - Optimized tables
  - Collapsible sidebar
  - Mobile-friendly forms

- **Desktop Support**
  - Full-featured desktop UI
  - Multi-column layouts
  - Keyboard shortcuts
  - Hover effects
  - Desktop-optimized tables
  - Expanded sidebar

### 11.3 Navigation

- **Sidebar Navigation**

  - Menu items
  - Active route highlighting
  - Icon indicators
  - Collapsible on mobile
  - Route-based visibility
  - Permission-based visibility

- **Navbar**

  - User information display
  - Logout functionality
  - Theme toggle
  - Risk profile filter (dashboard)
  - Breadcrumbs (where applicable)

- **User Navigation**
  - User profile display
  - Logout option
  - Settings access
  - Role display

### 11.4 Loading States

- **Loading Indicators**
  - Spinner animations
  - Skeleton loaders
  - Progress bars
  - Loading messages
  - Permission loading states
  - Data fetching indicators

### 11.5 Error Handling

- **Error Messages**
  - User-friendly error messages
  - Error toast notifications
  - Error page (404, 500)
  - Retry mechanisms
  - Permission denied messages
  - API error handling

### 11.6 Data Visualization

- **Charts & Graphs**
  - Pie charts
  - Bar charts
  - Line charts
  - Stacked charts
  - Gauge charts
  - Interactive tooltips
  - Export functionality
  - Responsive charts

### 11.7 Form Validation

- **Input Validation**
  - Real-time validation
  - Error messages
  - Required field indicators
  - Format validation
  - Email validation
  - Password validation
  - RM number format validation

---

## 12. API ENDPOINTS (Backend Testing)

### 12.1 Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Create new user (Admin)
- `GET /api/auth/users` - Get all users (Admin)
- `PUT /api/auth/update-user/:rm_number` - Update user (Admin)
- `DELETE /api/auth/delete-user/:rm_number` - Delete user (Admin)
- `PUT /api/auth/update-password` - Update password

### 12.2 Overview Endpoints

- `GET /api/overview/total-customer` - Total customers by risk profile
- `GET /api/overview/total-aum` - Total AUM by risk profile
- `GET /api/overview/total-fbi` - Total FBI by risk profile
- `GET /api/overview/quarterly-fum` - Quarterly FUM data
- `GET /api/overview/quarterly-fbi` - Quarterly FBI data
- `GET /api/overview/top-products` - Top 5 products
- `GET /api/overview/certain-customer-list` - Filtered customer list

### 12.3 Dashboard Targets Endpoints

- `GET /api/dashboard-targets` - Get all targets
- `GET /api/dashboard-targets/:metric_type` - Get target by metric type
- `POST /api/dashboard-targets` - Create/update target
- `PUT /api/dashboard-targets/:metric_type` - Update target
- `DELETE /api/dashboard-targets/:metric_type` - Delete target

### 12.4 Customer Details Endpoints

- `GET /api/customer-details/customer-id-list` - Customer ID list
- `GET /api/customer-details/customer-details` - Customer details
- `GET /api/customer-details/customer-portfolio` - Current portfolio
- `GET /api/customer-details/optimized-portfolio` - Optimized portfolio
- `GET /api/customer-details/return-percentage` - Return percentage
- `GET /api/customer-details/owned-product` - Owned products
- `GET /api/customer-details/recommendation-product` - Recommendations
- `GET /api/customer-details/quarterly-aum` - Quarterly AUM
- `GET /api/customer-details/quarterly-fum` - Quarterly FUM
- `GET /api/customer-details/get-activity` - Get activities
- `POST /api/customer-details/post-activity` - Create activity
- `PUT /api/customer-details/update-activity` - Update activity
- `DELETE /api/customer-details/delete-activity` - Delete activity
- `PUT /api/customer-details/update-customer-info` - Update customer information
- `PUT /api/customer-details/bulk-update-customers` - Bulk update customers

### 12.5 Customer List Endpoints

- `GET /api/customer-list/customer-list` - Get all customers
- `GET /api/customer-list/certain-customer-list` - Get filtered customers

### 12.6 Task Manager Endpoints

- `GET /api/task-manager/managed-number` - Managed numbers
- `GET /api/task-manager/increased-number` - Increased numbers
- `GET /api/task-manager/portfolio` - Portfolio summary
- `GET /api/task-manager/last-transaction` - Last transactions
- `GET /api/task-manager/potential-transaction` - Potential transactions
- `GET /api/task-manager/offer-product-risk` - Offer product risk
- `GET /api/task-manager/re-profile-risk-target` - Reprofile targets
- `GET /api/task-manager/get-task` - Get tasks
- `POST /api/task-manager/post-task` - Create task
- `PUT /api/task-manager/update-task` - Update task
- `DELETE /api/task-manager/delete-task` - Delete task

### 12.7 Market Indices Endpoints

- `GET /api/market-indices/watchlists` - Get watchlists
- `POST /api/market-indices/watchlists` - Create watchlist
- `PUT /api/market-indices/watchlists` - Update watchlist
- `DELETE /api/market-indices/watchlists` - Delete watchlist
- `GET /api/market-indices/notes` - Get notes
- `POST /api/market-indices/notes` - Create note
- `PUT /api/market-indices/notes` - Update note
- `DELETE /api/market-indices/notes` - Delete note

### 12.8 Market News Endpoints

- `GET /api/market-news/product-picks` - Get product picks
- `POST /api/market-news/product-picks` - Create product pick
- `PUT /api/market-news/product-picks/:id` - Update product pick
- `DELETE /api/market-news/product-picks/:id` - Delete product pick
- `GET /api/market-news/news-notes` - Get news notes
- `POST /api/market-news/news-notes` - Create news note
- `PUT /api/market-news/news-notes/:id` - Update news note
- `DELETE /api/market-news/news-notes/:id` - Delete news note

### 12.9 Economic Indicators Endpoints

- `GET /api/economic-indicators` - Get economic indicators (GDP, BI Rate, Inflation)

### 12.10 Permissions Endpoints

- `GET /api/permissions/pages` - Get all pages (Admin)
- `GET /api/permissions/users` - Get users with permissions (Admin)
- `GET /api/permissions/users/:rm_account_id` - Get user permissions (Admin)
- `GET /api/permissions/check/:page_path` - Check current user permission
- `PUT /api/permissions/users/:rm_account_id/pages/:page_id` - Update user permission (Admin)
- `PUT /api/permissions/users/:rm_account_id/bulk` - Bulk update user permissions (Admin)
- `DELETE /api/permissions/users/:rm_account_id/pages/:page_id` - Delete user permission (Admin)
- `POST /api/permissions/defaults/apply-to-all-rm` - Apply default permissions to all RM (Admin)

### 12.11 AI Service Endpoints (FastAPI)

- `GET /` - Health check
- `GET /health` - Health check with database status
- `POST /api_chat` - AI chatbot endpoint (streaming response)

### 12.12 Frontend API Routes (Next.js)

- `GET /api/market-indices/spx` - S&P 500 data
- `GET /api/market-indices/ndx` - NASDAQ data
- `GET /api/market-indices/dji` - Dow Jones data
- `GET /api/market-indices/lq45` - LQ45 data
- `GET /api/market-indices/composite` - Composite Index data
- `GET /api/v1/customers` - Get customers list
- `GET /api/v1/customers/[id]` - Get customer by ID

---

## 13. SECURITY FEATURES

### 13.1 Authentication Security

- JWT token validation
- Token expiration handling
- Password hashing (bcrypt)
- Session management
- CSRF protection
- Secure cookie settings
- Token storage in localStorage

### 13.2 API Security

- Rate limiting (1000 requests per 15 minutes per IP)
- CORS configuration
- Input validation
- SQL injection prevention (parameterized queries)
- XSS prevention
- Parameter sanitization
- MongoDB injection prevention
- HPP (HTTP Parameter Pollution) prevention
- Request timeout (30 seconds)

### 13.3 Security Headers (Helmet.js)

- Content Security Policy
- Cross-Origin Embedder Policy
- Cross-Origin Opener Policy
- Cross-Origin Resource Policy
- DNS Prefetch Control
- Frame Guard (deny)
- Hide Powered-By header
- HSTS (HTTP Strict Transport Security)
- IE No Open
- No Sniff
- Referrer Policy
- XSS Filter

### 13.4 Permission-Based Access Control

- Page-level permissions
- Action-level permissions (View, Add, Update, Delete)
- Middleware-based permission checking
- Role-based access control (Admin vs User)
- Permission inheritance
- Default permissions
- Individual user overrides

### 13.5 Data Protection

- Environment variable security
- Database encryption
- HTTPS support (production)
- Secure headers
- Input sanitization
- Output encoding
- Trust proxy configuration

---

## 14. PERFORMANCE FEATURES

### 14.1 Data Loading

- Lazy loading
- Pagination
- Data caching (React Query)
- Optimistic updates
- Request debouncing
- Loading state management

### 14.2 Response Times

- API response time optimization
- Database query optimization
- Frontend rendering optimization
- Chart rendering optimization
- Streaming responses (AI chatbot)
- Connection pooling

### 14.3 Caching

- Client-side caching
- API response caching
- Permission caching
- User data caching
- Chart data caching

---

## 15. INTEGRATION FEATURES

### 15.1 External APIs

- Trading Economics API integration (Economic indicators)
- DeepInfra API integration (AI chatbot)
- OpenAI-compatible API (GPT models)
- Market data feeds
- News aggregation

### 15.2 Database Integration

- PostgreSQL connection
- Connection pooling
- Query optimization
- Transaction management
- Parameterized queries
- Error handling
- Connection retry logic

### 15.3 Frontend-Backend Communication

- RESTful API design
- JSON data format
- Error handling
- Request/response interceptors
- Authentication headers
- CORS handling

---

## TESTING PRIORITIES

### High Priority Features

1. Authentication & Authorization (including permissions)
2. Dashboard Overview (Core metrics, targets, bulk operations)
3. AI Chatbot (Primary feature)
4. Customer Details (Core functionality, CRUD operations)
5. CRUD Operations (Activities, Tasks, Customer Info)
6. Permission System (Access control)

### Medium Priority Features

7. Customer Mapping
8. Recommendation Centre
9. Market Indices & News (with CRUD)
10. Admin Panel (User & Permission management)
11. Dashboard Targets

### Low Priority Features

12. System Logs
13. UI/UX enhancements
14. Performance optimizations
15. Export functionality

---

## TEST SCENARIOS TO CONSIDER

### Functional Testing

- All CRUD operations (Create, Read, Update, Delete)
- Form validations
- Data filtering and search
- Chart rendering
- API endpoint responses
- Error handling
- Permission checking
- Role-based access
- Bulk operations

### Integration Testing

- Frontend-Backend communication
- Backend-Database communication
- Frontend-AI Service communication
- External API integrations
- Permission middleware
- Authentication flow

### Security Testing

- Authentication bypass attempts
- SQL injection attempts
- XSS attempts
- CSRF attacks
- Rate limiting effectiveness
- Permission bypass attempts
- Role escalation attempts
- Token manipulation

### Performance Testing

- Load testing
- Stress testing
- Response time validation
- Database query performance
- AI response time
- Chart rendering performance
- Bulk operation performance

### Usability Testing

- Navigation flow
- Form usability
- Error message clarity
- Responsive design
- Accessibility
- Theme switching
- Permission feedback

---

## PERMISSION TESTING MATRIX

### Pages and Required Permissions

| Page                  | View            | Add                       | Update                       | Delete                    |
| --------------------- | --------------- | ------------------------- | ---------------------------- | ------------------------- |
| Dashboard Overview    | ✅              | ❌                        | ✅ (Targets)                 | ✅ (Targets)              |
| Customer Details      | ✅              | ✅ (Activity)             | ✅ (Activity, Customer Info) | ✅ (Activity)             |
| Customer Mapping      | ✅              | ❌                        | ❌                           | ❌                        |
| Recommendation Centre | ✅              | ✅ (Tasks)                | ✅ (Tasks)                   | ✅ (Tasks)                |
| Market Indices        | ✅              | ✅ (Watchlist, Notes)     | ✅ (Watchlist, Notes)        | ✅ (Watchlist, Notes)     |
| Market News           | ✅              | ✅ (Product Picks, Notes) | ✅ (Product Picks, Notes)    | ✅ (Product Picks, Notes) |
| Chatbot               | ✅              | ❌                        | ❌                           | ❌                        |
| Admin                 | ✅ (Admin only) | ✅ (Users, Permissions)   | ✅ (Users, Permissions)      | ✅ (Users, Permissions)   |
| Logs                  | ✅ (Admin only) | ❌                        | ❌                           | ❌                        |

---

**Document Version:** 2.0  
**Last Updated:** Based on current codebase analysis  
**Total Features Identified:** 250+ individual features across 15 major categories
