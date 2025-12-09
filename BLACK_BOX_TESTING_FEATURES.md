# Black Box Testing - Complete Feature List
## BATI Wealth AI Platform

This document provides a comprehensive list of all features in the BATI Wealth AI Platform for black box testing purposes. Features are organized by functional areas and include user-facing functionality, API endpoints, and system behaviors.

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

### 1.2 Password Management
- **Update Password** (Authenticated users)
  - Change password functionality
  - Password validation
  - Old password verification
  - Success/error feedback

### 1.3 User Management (Admin Only)
- **User Registration**
  - Create new RM user
  - Email generation
  - Role assignment (Admin/User)
  - Password setup
  - Validation and error handling

- **User List**
  - View all users
  - Pagination
  - Search functionality
  - Filter capabilities

- **User Update**
  - Update user information
  - Modify email
  - Change role
  - Update RM number

- **User Deletion**
  - Delete user account
  - Confirmation dialog
  - Cascade handling

- **Password Reset** (Admin)
  - Reset user password
  - Generate new password
  - Notification to user

### 1.4 Access Control
- **Protected Routes**
  - Authentication required for all pages except login
  - Redirect to login if not authenticated
  - Token expiration handling
  - Role-based access (Admin vs User)

- **Session Management**
  - Token refresh
  - Automatic logout on token expiry
  - Session timeout handling

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
  - Visual representation (charts/graphs)
  - Real-time data updates

- **AUM (Assets Under Management) Metrics**
  - Total AUM display
  - AUM per risk profile
  - Comparison with previous period
  - Growth indicators
  - Currency formatting

- **FUM (Funds Under Management) Metrics**
  - Total FUM display
  - Breakdown per risk profile
  - Quarterly trend data
  - Visual charts

- **FBI (Foreign Bank Investment) Metrics**
  - Total FBI display
  - Breakdown per risk profile
  - Components: FBI_RD + FBI_SB + FBI_BAC
  - Trend analysis

### 2.2 Quarterly Performance Charts
- **FUM Quarterly Chart**
  - Line chart visualization
  - 6 quarters of historical data
  - Breakdown per risk profile
  - Interactive tooltips
  - Export capability

- **FBI Quarterly Chart**
  - Line chart visualization
  - 6 quarters of historical data
  - Breakdown per risk profile
  - Interactive tooltips
  - Export capability

### 2.3 Top Products Table
- **Product Rankings**
  - Top 5 products by total amount
  - Breakdown per risk profile
  - Product name, amount, transaction count
  - Sortable columns
  - Search functionality

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

### 2.5 Filtering & Search
- **Risk Profile Filter**
  - Filter all metrics by risk profile
  - Real-time data updates
  - Clear filter option

- **Search Functionality**
  - Search customers by ID
  - Search products by name
  - Real-time search results

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

### 3.2 AI Functions
- **Customer Profile Analysis**
  - `present_customer_profile` function
  - Display customer information
  - Risk profile analysis
  - Portfolio overview

- **Portfolio Optimization**
  - `present_optimized_portfolio` function
  - Recommended asset allocation
  - Comparison with current portfolio
  - Expected returns

- **Historical Transaction Analysis**
  - `present_historical_transaction` function
  - Transaction history display
  - Pattern analysis
  - Performance evaluation

- **Period Performance Analysis**
  - `previous_period_performance` function
  - Quarter-over-quarter comparison
  - Performance trends
  - Growth analysis

- **Product Recommendations**
  - `present_recommended_products` function
  - Personalized product suggestions
  - Risk-appropriate recommendations
  - Product details

- **New Allocation Recommendations**
  - `get_new_allocation` function
  - Structured allocation output
  - RD and SB allocation suggestions
  - Portfolio rebalancing advice

- **Customer Filtering**
  - `filter_customers_region` function
  - Filter customers by region
  - Regional analysis

- **SQL Query Generation**
  - `generate_sql_syntax_product_data` function
  - `generate_sql_syntax_customer_transaction` function
  - Custom query generation
  - Query execution
  - Results presentation

### 3.3 Chat Features
- **Streaming Response**
  - Real-time text streaming
  - Loading indicators
  - Progressive message display

- **Function Calling Indicator**
  - Visual indicator when AI calls functions
  - Status updates
  - Progress feedback

- **Multi-language Support**
  - Indonesian (default)
  - English
  - Language selection
  - Context-aware responses

- **Context Awareness**
  - Conversation history
  - Follow-up questions
  - Contextual responses
  - Customer ID integration

- **Error Handling**
  - Invalid query handling
  - Missing customer ID warnings
  - API error messages
  - Timeout handling

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

- **Optimized Portfolio**
  - Recommended allocation per asset type
  - USD allocation
  - Comparison with current allocation
  - Expected return vs current expected return
  - Visual comparison charts
  - Difference indicators

### 4.3 Quarterly Performance
- **AUM Quarterly Chart**
  - 4 quarters of historical data
  - Line chart visualization
  - Trend analysis
  - Interactive tooltips

- **FUM Quarterly Chart**
  - 4 quarters of historical data
  - Line chart visualization
  - Trend analysis
  - Interactive tooltips

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

### 4.5 Recommendation Products
- **Product Recommendations**
  - Recommended products based on risk profile
  - Offer product risk (1-5)
  - Reprofile risk target
  - Product details
  - Risk matching
  - Sortable table

### 4.6 Customer Activities (CRUD)
- **Activity List**
  - View all activities
  - Activity details (Title, Description, Date)
  - Sortable by date
  - Search functionality

- **Create Activity**
  - Add new activity
  - Title input
  - Description input
  - Date selection
  - Form validation
  - Success/error feedback

- **Update Activity**
  - Edit existing activity
  - Modify title, description, date
  - Form validation
  - Success/error feedback

- **Delete Activity**
  - Remove activity
  - Confirmation dialog
  - Success/error feedback

---

## 5. CUSTOMER MAPPING

### 5.1 Multi-dimensional Filtering
- **Propensity Filter**
  - Filter by propensity score
  - Multiple propensity levels
  - Real-time updates

- **AUM Label Filter**
  - Filter by AUM levels
  - Multiple AUM categories
  - Real-time updates

- **Risk Profile Filter**
  - Filter by risk profile
  - Multiple risk levels
  - Real-time updates

- **Combined Filters**
  - Multiple filter combinations
  - AND/OR logic
  - Clear all filters

### 5.2 Visualization
- **Stacked Bar Chart**
  - Customer distribution visualization
  - Breakdown per risk profile
  - Breakdown per propensity
  - Breakdown per AUM label
  - Interactive tooltips
  - Export capability

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

---

## 6. RECOMMENDATION CENTRE

### 6.1 Managed Numbers
- **Summary Metrics**
  - Total customers managed
  - Total AUM
  - Total FBI
  - Display cards
  - Real-time updates

### 6.2 Increased Numbers
- **Growth Metrics**
  - Current quarter vs previous quarter
  - Growth percentage for customers
  - Growth percentage for AUM
  - Growth percentage for FBI
  - Visual indicators (positive/negative)
  - Trend arrows

### 6.3 Portfolio Summary
- **Portfolio Breakdown**
  - CASA total
  - SB total
  - Deposito total
  - RD total
  - Visual charts
  - Percentage breakdown

### 6.4 Last Transaction
- **Recent Transactions Table**
  - Last 5 transactions
  - Customer ID
  - Transaction ID
  - Amount
  - Date
  - Sortable by date
  - Navigation to customer details

### 6.5 Potential Transaction
- **Opportunity List**
  - Potential transactions sorted by profit
  - Customer ID
  - Product Name
  - Profit amount
  - Transaction ID
  - Sorted by transaction_id DESC
  - Filter options

### 6.6 Offer Product Risk
- **Product Recommendations**
  - Recommendations based on risk profile
  - Risk level (1-5)
  - Product details
  - Customer matching
  - Sortable table

### 6.7 Reprofile Risk Target
- **Reprofiling Recommendations**
  - Customers requiring risk profile update
  - Target risk profile
  - Current risk profile
  - Filter: offer_reprofile_risk_target != '0'
  - Action buttons

### 6.8 Task Manager (CRUD)
- **Task List**
  - View all tasks
  - Task details (Description, Due Date, Invitee)
  - Filter by RM number
  - Sortable by due date
  - Status indicators

- **Create Task**
  - Add new task
  - Description input
  - Due date selection
  - Invitee selection
  - Form validation
  - Success/error feedback

- **Update Task**
  - Edit existing task
  - Modify description, due date, invitee
  - Form validation
  - Success/error feedback

- **Delete Task**
  - Remove task
  - Confirmation dialog
  - Success/error feedback

---

## 7. MARKET INDICES

### 7.1 Market Data Display
- **S&P 500 (SPX)**
  - Current value
  - Change percentage
  - Change amount
  - Last update time
  - Color coding (positive/negative)

- **NASDAQ (NDX)**
  - Current value
  - Change percentage
  - Change amount
  - Last update time
  - Color coding

- **Dow Jones (DJI)**
  - Current value
  - Change percentage
  - Change amount
  - Last update time
  - Color coding

- **LQ45 (Indonesia)**
  - Current value
  - Change percentage
  - Change amount
  - Last update time
  - Color coding

- **Composite Index (Indonesia)**
  - Current value
  - Change percentage
  - Change amount
  - Last update time
  - Color coding

### 7.2 Visualization
- **Line Charts**
  - Historical trend visualization
  - Multiple timeframes
  - Interactive tooltips
  - Export capability

### 7.3 Real-time Updates
- **Auto-refresh**
  - Automatic data updates
  - Manual refresh button
  - Update indicators
  - Error handling for API failures

---

## 8. MARKET NEWS

### 8.1 Economic Indicators
- **GDP Growth Rate**
  - Indonesian GDP data
  - Real-time updates
  - Historical trends

- **BI Rate**
  - Bank Indonesia policy rate
  - Current rate display
  - Historical data

- **Inflation Rate**
  - Current inflation metrics
  - Trend visualization
  - Historical comparison

### 8.2 News Feed
- **Financial News**
  - Latest market news
  - News articles display
  - Article details
  - Source information

- **News Filtering**
  - Filter by category
  - Search functionality
  - Date filtering

### 8.3 Product Highlights
- **Featured Products**
  - Daily featured products
  - Products: BBCA, BBNI, BMRN, BTPN, DCII, ADRO
  - Product details
  - Performance metrics

---

## 9. ADMIN PANEL

### 9.1 User Management
- **User List**
  - Display all users
  - User details (RM number, email, role)
  - Pagination
  - Search functionality
  - Sortable columns

- **Create User**
  - Add new RM user
  - Email generation
  - Role assignment
  - Password setup
  - Form validation
  - Success/error feedback

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
  - Notification system
  - Success/error feedback

### 9.3 Activity Monitoring
- **System Logs**
  - View system logs
  - Monitor user activities
  - Log filtering
  - Log level indicators

- **User Activity Tracking**
  - Login history
  - Action logging
  - Timestamp tracking
  - Export capability

### 9.4 System Administration
- **Security Settings**
  - System-wide security configuration
  - Access control settings
  - Security monitoring

- **Backup Management**
  - Database backup status
  - Backup scheduling
  - Backup history

- **Performance Metrics**
  - System health monitoring
  - Performance analytics
  - Resource usage

---

## 10. SYSTEM LOGS

### 10.1 Log Display
- **Real-time Logging**
  - Live log streaming
  - Log entries display
  - Timestamp information
  - Log level indicators

### 10.2 Log Filtering
- **Filter by Log Level**
  - Error logs
  - Warning logs
  - Info logs
  - Debug logs
  - All logs

### 10.3 Log Management
- **Log Clearing**
  - Clear logs functionality
  - Confirmation dialog
  - Log retention

- **Log Export**
  - Export logs to file
  - Date range selection
  - Format options

---

## 11. UI/UX FEATURES

### 11.1 Theme Management
- **Dark/Light Mode**
  - Theme toggle
  - Persistent theme preference
  - System theme detection
  - Smooth transitions

### 11.2 Responsive Design
- **Mobile Support**
  - Responsive layouts
  - Touch-friendly interactions
  - Mobile navigation
  - Optimized tables

- **Desktop Support**
  - Full-featured desktop UI
  - Multi-column layouts
  - Keyboard shortcuts
  - Hover effects

### 11.3 Navigation
- **Sidebar Navigation**
  - Menu items
  - Active route highlighting
  - Collapsible sections
  - Icon indicators

- **Breadcrumbs**
  - Navigation path
  - Quick navigation
  - Context awareness

### 11.4 Loading States
- **Loading Indicators**
  - Spinner animations
  - Skeleton loaders
  - Progress bars
  - Loading messages

### 11.5 Error Handling
- **Error Messages**
  - User-friendly error messages
  - Error toast notifications
  - Error page (404, 500)
  - Retry mechanisms

### 11.6 Data Visualization
- **Charts & Graphs**
  - Pie charts
  - Bar charts
  - Line charts
  - Stacked charts
  - Interactive tooltips
  - Export functionality

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

### 12.3 Customer Details Endpoints
- `GET /api/customer-details/customer-id-list` - Customer ID list
- `GET /api/customer-details/customer-details` - Customer details
- `GET /api/customer-details/customer-portfolio` - Current portfolio
- `GET /api/customer-details/optimized-portfolio` - Optimized portfolio
- `GET /api/customer-details/return-percentage` - Return percentage
- `GET /api/customer-details/owned-product` - Owned products
- `GET /api/customer-details/recommendation-product` - Recommendations
- `GET /api/customer-details/quarterly-aum` - Quarterly AUM
- `GET /api/customer-details/quarterly-fum` - Quarterly FUM
- `GET /api/customer-details/activity` - Get activities
- `POST /api/customer-details/activity` - Create activity
- `PUT /api/customer-details/activity` - Update activity
- `DELETE /api/customer-details/activity` - Delete activity

### 12.4 Customer List Endpoints
- `GET /api/customer-list` - Get all customers
- `GET /api/customer-list/certain-customer-list` - Get filtered customers

### 12.5 Task Manager Endpoints
- `GET /api/task-manager/managed-number` - Managed numbers
- `GET /api/task-manager/increased-number` - Increased numbers
- `GET /api/task-manager/portfolio` - Portfolio summary
- `GET /api/task-manager/last-transaction` - Last transactions
- `GET /api/task-manager/potential-transaction` - Potential transactions
- `GET /api/task-manager/offer-product-risk` - Offer product risk
- `GET /api/task-manager/reprofile-risk-target` - Reprofile targets
- `GET /api/task-manager/task` - Get tasks
- `POST /api/task-manager/task` - Create task
- `PUT /api/task-manager/task` - Update task
- `DELETE /api/task-manager/task` - Delete task

### 12.6 AI Service Endpoints (FastAPI)
- `GET /` - Health check
- `GET /health` - Health check with database status
- `POST /api_chat` - AI chatbot endpoint

### 12.7 Market Data Endpoints (Frontend API Routes)
- `GET /api/market-indices/spx` - S&P 500 data
- `GET /api/market-indices/ndx` - NASDAQ data
- `GET /api/market-indices/dji` - Dow Jones data
- `GET /api/market-indices/lq45` - LQ45 data
- `GET /api/market-indices/composite` - Composite Index data

### 12.8 Customer API Endpoints (Frontend API Routes)
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

### 13.2 API Security
- Rate limiting
- CORS configuration
- Input validation
- SQL injection prevention
- XSS prevention
- Parameter sanitization

### 13.3 Data Protection
- Environment variable security
- Database encryption
- HTTPS support (production)
- Secure headers (Helmet.js)

---

## 14. PERFORMANCE FEATURES

### 14.1 Data Loading
- Lazy loading
- Pagination
- Infinite scroll (where applicable)
- Data caching (React Query)
- Optimistic updates

### 14.2 Response Times
- API response time < 500ms
- AI response time < 5 seconds
- Database query optimization
- Frontend rendering optimization

---

## 15. INTEGRATION FEATURES

### 15.1 External APIs
- Trading Economics API integration
- OpenAI API integration
- Market data feeds
- News aggregation

### 15.2 Database Integration
- PostgreSQL connection
- Connection pooling
- Query optimization
- Transaction management

---

## TESTING PRIORITIES

### High Priority Features
1. Authentication & Authorization
2. Dashboard Overview (Core metrics)
3. AI Chatbot (Primary feature)
4. Customer Details (Core functionality)
5. CRUD Operations (Activities & Tasks)

### Medium Priority Features
6. Customer Mapping
7. Recommendation Centre
8. Market Indices & News
9. Admin Panel

### Low Priority Features
10. System Logs
11. UI/UX enhancements
12. Performance optimizations

---

## TEST SCENARIOS TO CONSIDER

### Functional Testing
- All CRUD operations
- Form validations
- Data filtering and search
- Chart rendering
- API endpoint responses
- Error handling

### Integration Testing
- Frontend-Backend communication
- Backend-Database communication
- Frontend-AI Service communication
- External API integrations

### Security Testing
- Authentication bypass attempts
- SQL injection attempts
- XSS attempts
- CSRF attacks
- Rate limiting effectiveness

### Performance Testing
- Load testing
- Stress testing
- Response time validation
- Database query performance
- AI response time

### Usability Testing
- Navigation flow
- Form usability
- Error message clarity
- Responsive design
- Accessibility

---

**Document Version:** 1.0  
**Last Updated:** Based on application analysis  
**Total Features Identified:** 200+ individual features across 15 major categories





