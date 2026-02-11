# Wealth AI Platform

A comprehensive wealth management platform consisting of a Next.js frontend, Express.js backend, and FastAPI service for AI-powered portfolio management.

## Project Structure

```
wealth-ai/
├── client/          # Next.js frontend application
├── server/          # Express.js backend API
├── fastapi/         # FastAPI service for AI/ML features
└── nginx/           # Nginx configuration
```

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher) and npm/pnpm/yarn
- **Python** (v3.9 or higher) and pip
- **PostgreSQL** (v13 or higher)
- **Git**

## Required Files

**⚠️ Important:** The following files are required for the application to work:

1. **Database SQL files:**
   - `server/db-data/bati_wealthai_db.sql` - **REQUIRED** - Complete database schema and data for Express server
   - `server/db-data/user_permissions_tables.sql` - **Optional** - User permissions tables (separate file, not included in main SQL file)

2. **FastAPI data files** (all 5 files required in `fastapi/data/` directory):
   - `product_data.xlsx` - Creates `product_data` table
   - `historical_transaction_usd.csv` - Creates `customer_transaction` table
   - `Mutual_Fund_Data.xlsx` - Required for FastAPI functions
   - `Master_Data_for_RM_Tableau_usd.csv` - Required for FastAPI functions
   - `optimized_allocation_usd.csv` - Required for FastAPI functions

**Note:** The `fastapi/data/` directory is gitignored. Ensure all 5 files are present before starting FastAPI, otherwise it will crash on startup.

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd wealth-ai
```

### 2. Database Setup

**⚠️ Important:** The `server/db-data/bati_wealthai_db.sql` file is **highly recommended** and contains the database schema and data required for the **Express server backend** to function properly. However, it does **NOT** include `product_data` and `customer_transaction` tables (these are created separately by FastAPI).

#### Option A: Using Provided SQL File (Recommended)

**This is the recommended approach** for the Express server backend. The SQL file includes:
- Complete database schema for Express server tables:
  - `customer_info` - Customer information and profiles
  - `rm_account` - Relationship Manager accounts (for authentication)
  - `current_allocation` - Current portfolio allocations
  - `historical_transaction` - Historical transaction records (note: different from `customer_transaction`)
  - `optimized_allocation` - Optimized portfolio recommendations
  - `rm_task_manager` - Task management for RMs
  - `customer_activity` - Customer activity logs
  - `customer_segmentation_offer` - Customer segmentation data
- All customer data, RM accounts, and transaction records
- Proper relationships and constraints

**Note:** After importing the SQL file, you'll still need to run FastAPI's `init-db.py` script to create the `product_data` and `customer_transaction` tables required by the FastAPI service (see Step 7 below).

##### Step 1: Start PostgreSQL Service

Choose one of the following methods:

**macOS (using Homebrew):**
```bash
brew services start postgresql@13
# or for PostgreSQL 14+
brew services start postgresql@14
```

**Linux:**
```bash
sudo systemctl start postgresql
# or
sudo service postgresql start
```

**Windows:**
- Start PostgreSQL from Services (services.msc)
- Or use pgAdmin to start the service

**Docker (Alternative):**
```bash
docker run --name postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=wealth_platform \
  -p 5432:5432 \
  -d postgres:13-alpine
```

##### Step 2: Verify PostgreSQL is Running

```bash
# Test connection
psql -U postgres -c "SELECT version();"

# If you get a password prompt, enter your PostgreSQL password
# If connection fails, check PostgreSQL is running and credentials are correct
```

##### Step 3: Create the Database

**Method 1: Using psql command line**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE wealth_platform;

# Exit psql
\q
```

**Method 2: Using createdb command**
```bash
createdb -U postgres wealth_platform
```

**Method 3: Using SQL file**
```bash
psql -U postgres -c "CREATE DATABASE wealth_platform;"
```

##### Step 4: Import the SQL File

**Important:** The SQL file (`server/db-data/bati_wealthai_db.sql`) is large and may take several minutes to import depending on your system.

**Method 1: Using psql (Recommended)**
```bash
# From the project root directory
psql -U postgres -d wealth_platform -f server/db-data/bati_wealthai_db.sql

# If you get a password prompt, enter your PostgreSQL password
# The import will show progress and may take 2-5 minutes
```

**Method 2: Using psql with verbose output**
```bash
# To see detailed progress
psql -U postgres -d wealth_platform -f server/db-data/bati_wealthai_db.sql -v ON_ERROR_STOP=1

# This will stop on errors and show more details
```

**Method 3: Using psql interactive mode**
```bash
# Connect to the database
psql -U postgres -d wealth_platform

# Then run:
\i server/db-data/bati_wealthai_db.sql

# Exit when done
\q
```

**Method 4: Using pgAdmin (GUI)**
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on `wealth_platform` database → **Query Tool**
4. Click **Open File** (folder icon)
5. Select `server/db-data/bati_wealthai_db.sql`
6. Click **Execute** (play button) or press F5
7. Wait for the import to complete

**Method 5: Using Docker (if PostgreSQL is in Docker)**
```bash
# Copy SQL file to container
docker cp server/db-data/bati_wealthai_db.sql postgres:/tmp/

# Execute SQL file inside container
docker exec -i postgres psql -U postgres -d wealth_platform -f /tmp/bati_wealthai_db.sql

# Clean up
docker exec postgres rm /tmp/bati_wealthai_db.sql
```

##### Step 5: Verify the Import

After importing, verify that tables and data were created successfully:

```bash
# Connect to the database
psql -U postgres -d wealth_platform

# List all tables
\dt

# Check table counts (should show data)
SELECT 
  'customer_info' as table_name, COUNT(*) as row_count FROM customer_info
UNION ALL
SELECT 'rm_account', COUNT(*) FROM rm_account
UNION ALL
SELECT 'current_allocation', COUNT(*) FROM current_allocation
UNION ALL
SELECT 'historical_transaction', COUNT(*) FROM historical_transaction
UNION ALL
SELECT 'optimized_allocation', COUNT(*) FROM optimized_allocation
UNION ALL
SELECT 'rm_task_manager', COUNT(*) FROM rm_task_manager;

# Exit
\q
```

**Expected Output:**
You should see tables with row counts > 0, indicating data was imported successfully.

##### Step 6: Import User Permissions Tables (Optional)

**Note:** The `user_permissions` and `pages` tables are **NOT** included in `bati_wealthai_db.sql`. They are in a separate file.

If you need user permissions functionality:

```bash
psql -U postgres -d wealth_platform -f server/db-data/user_permissions_tables.sql
```

This will create:
- `pages` table - Stores available pages/menus in the system
- `user_permissions` table - Stores permissions for each user on each page

##### Step 7: Create FastAPI Tables (Required for FastAPI Service)

**Important:** The SQL file does NOT include `product_data` and `customer_transaction` tables. These are created separately by FastAPI from Excel/CSV files located in `fastapi/data/` directory.

After importing the SQL file, you need to create these tables for FastAPI:

1. **Ensure ALL required data files exist** in `fastapi/data/` directory:
   
   **Required for table creation:**
   - `product_data.xlsx` - Product information (creates `product_data` table)
   - `historical_transaction_usd.csv` - Customer transaction data (creates `customer_transaction` table)
   
   **Required for FastAPI to run (loaded at startup):**
   - `Mutual_Fund_Data.xlsx` - Mutual fund data used by FastAPI functions
   - `Master_Data_for_RM_Tableau_usd.csv` - Customer data used by FastAPI functions
   - `optimized_allocation_usd.csv` - Optimized portfolio data used by FastAPI functions
   
   **⚠️ Important:** All 5 files are required. FastAPI will crash on startup if any are missing because `functions.py` loads them when imported.
   
   **Note:** The `fastapi/data/` directory is gitignored, so you'll need to obtain these files separately if they're not in your repository.

2. Navigate to the FastAPI directory:
   ```bash
   cd fastapi
   ```

3. Ensure you have a `.env` file with database configuration:
   ```bash
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=wealth_platform
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. Install Python dependencies (if not already done):
   ```bash
   pip install -r requirements.txt
   ```

5. Run the initialization script to create FastAPI tables:
   ```bash
   python init-db.py
   ```

   This script will:
   - Read `fastapi/data/product_data.xlsx` and create the `product_data` table
   - Read `fastapi/data/historical_transaction_usd.csv` and create the `customer_transaction` table
   - Populate both tables with data from these files

6. Return to root directory:
   ```bash
   cd ..
   ```

**Summary:** You need BOTH:
- The SQL file import (for Express server tables: `customer_info`, `rm_account`, `current_allocation`, etc.)
- FastAPI `init-db.py` script (for `product_data` and `customer_transaction` tables from `fastapi/data/` files)

**Data File Sources:**
- `product_data` table ← Created from `fastapi/data/product_data.xlsx`
- `customer_transaction` table ← Created from `fastapi/data/historical_transaction_usd.csv`

##### Troubleshooting SQL Import

**Issue: "Permission denied" or "Access denied"**
```bash
# Ensure PostgreSQL user has proper permissions
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE wealth_platform TO postgres;"
psql -U postgres -d wealth_platform -c "GRANT ALL ON SCHEMA public TO postgres;"
```

**Issue: "Database already exists"**
```bash
# Drop and recreate (WARNING: This deletes all data)
psql -U postgres -c "DROP DATABASE IF EXISTS wealth_platform;"
psql -U postgres -c "CREATE DATABASE wealth_platform;"
# Then retry import
```

**Issue: "File not found"**
```bash
# Ensure you're in the project root directory
cd /path/to/wealth-ai

# Verify file exists
ls -lh server/db-data/bati_wealthai_db.sql

# Use absolute path if relative path doesn't work
psql -U postgres -d wealth_platform -f /absolute/path/to/server/db-data/bati_wealthai_db.sql
```

**Issue: Import takes too long or hangs**
- Large SQL files can take time. Wait at least 5-10 minutes
- Check PostgreSQL logs for errors
- Ensure sufficient disk space
- Try importing with `-v ON_ERROR_STOP=1` to see where it fails

**Issue: "Encoding" or "Character set" errors**
```bash
# Ensure database uses UTF-8 encoding
psql -U postgres -c "DROP DATABASE IF EXISTS wealth_platform;"
psql -U postgres -c "CREATE DATABASE wealth_platform WITH ENCODING 'UTF8';"
# Retry import
```

**Issue: Partial import (some tables missing)**
- Check PostgreSQL logs for specific errors
- The SQL file may have dependencies - ensure all statements execute in order
- Try importing again (some statements may be idempotent)

#### Option B: Initialize Database Without SQL File (Limited Functionality)

**⚠️ Warning:** This option only creates tables for FastAPI (`product_data` and `customer_transaction`). The Express server backend requires additional tables (`rm_account`, `customer_info`, `current_allocation`, `historical_transaction`, `optimized_allocation`, `rm_task_manager`, etc.) that are **only** available in the SQL file. **The Express server will not function properly without the SQL file.**

If you don't have the SQL file, you can still initialize the FastAPI service:

1. Ensure PostgreSQL is running (see Option A, step 1)

2. Navigate to the FastAPI directory:
   ```bash
   cd fastapi
   ```

3. Create a `.env` file with database configuration:
   ```bash
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=wealth_platform
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the database initialization script:
   ```bash
   python init-db.py
   ```

   This script will:
   - Wait for PostgreSQL to be ready
   - Create the `wealth_platform` database if it doesn't exist
   - Create `product_data` and `customer_transaction` tables (for FastAPI only)

6. Return to root directory:
   ```bash
   cd ..
   ```

**Note:** If using Option B, you'll need to manually create the remaining tables required by the Express server or obtain the SQL file for full functionality.

### 3. Environment Configuration

#### Client (`client/.env`)

Create `client/.env` with:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BASE_API_URL=http://localhost:8000
BATI_BACKEND_URL=http://localhost:8000
```

#### Server (`server/.env`)

Create `server/.env` with:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/wealth_platform
# OR use individual variables:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wealth_platform
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret_key
```

#### FastAPI (`fastapi/.env`)

Create `fastapi/.env` with:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wealth_platform
DB_USER=postgres
DB_PASSWORD=yourpassword
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 4. Install Dependencies

#### Client
```bash
cd client
npm install
# or
pnpm install
# or
yarn install
cd ..
```

#### Server
```bash
cd server
npm install
# or
pnpm install
cd ..
```

#### FastAPI
```bash
cd fastapi
pip install -r requirements.txt
cd ..
```

## Starting the Services

### Start Client (Frontend)

```bash
cd client
npm run dev
# or
pnpm dev
# or
yarn dev
```

The client will be available at: **http://localhost:3000**

### Start Server (Backend API)

In a new terminal:
```bash
cd server
npm run dev
# or
pnpm dev
```

The server will be available at: **http://localhost:5000**

### Start FastAPI (AI Service)

In a new terminal:
```bash
cd fastapi
uvicorn main:app --reload
```

The FastAPI service will be available at: **http://localhost:8000**

API documentation will be available at: **http://localhost:8000/docs**

## Using Docker Compose (Alternative)

If you prefer to run everything with Docker:

1. Ensure all `.env` files are configured (see Environment Configuration above)

2. Start all services:
   ```bash
   docker-compose up -d
   ```

3. View logs:
   ```bash
   docker-compose logs -f
   ```

4. Stop all services:
   ```bash
   docker-compose down
   ```

**Note:** When using Docker Compose, the SQL file at `server/db-data/bati_wealthai_db.sql` will be automatically imported if it exists. Otherwise, the FastAPI container will initialize the database using `init-db.py`.

## Development Workflow

1. **Start PostgreSQL** (if not using Docker)
2. **Start FastAPI** service (port 8000)
3. **Start Server** backend (port 5000)
4. **Start Client** frontend (port 3000)

Access the application at: **http://localhost:3000**

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `psql -U postgres -c "SELECT version();"`
- Check database credentials in `.env` files match your PostgreSQL setup
- Ensure the database `wealth_platform` exists
- Check if port 5432 is available and not blocked

### Port Already in Use

If a port is already in use:

- **Port 3000 (Client)**: Change in `client/package.json` scripts or use `PORT=3001 npm run dev`
- **Port 5000 (Server)**: Change `PORT` in `server/.env`
- **Port 8000 (FastAPI)**: Use `uvicorn main:app --reload --port 8001`
- **Port 5432 (PostgreSQL)**: Change in PostgreSQL config or use a different port

### Database Not Populated

If the database is empty or missing tables:

1. **Verify SQL file exists:**
   ```bash
   ls -lh server/db-data/bati_wealthai_db.sql
   ```

2. **Import the SQL file** (see [Option A: Using Provided SQL File](#option-a-using-provided-sql-file-recommended) above):
   ```bash
   psql -U postgres -d wealth_platform -f server/db-data/bati_wealthai_db.sql
   ```

3. **Check if tables exist:**
   ```bash
   psql -U postgres -d wealth_platform -c "\dt"
   ```
   You should see tables like `customer_info`, `rm_account`, `current_allocation`, etc.

4. **If using FastAPI only** (limited functionality), run:
   ```bash
   cd fastapi
   python init-db.py
   cd ..
   ```
   Note: This only creates `product_data` and `customer_transaction` tables.

5. **Verify ALL data files exist** in `fastapi/data/` directory (for FastAPI):
   
   **All 5 files are REQUIRED for FastAPI to start:**
   - `product_data.xlsx` - Creates `product_data` table + used by FastAPI functions
   - `historical_transaction_usd.csv` - Creates `customer_transaction` table + used by FastAPI functions
   - `Mutual_Fund_Data.xlsx` - **Required** - Loaded at FastAPI startup
   - `Master_Data_for_RM_Tableau_usd.csv` - **Required** - Loaded at FastAPI startup
   - `optimized_allocation_usd.csv` - **Required** - Loaded at FastAPI startup
   
   **⚠️ Critical:** FastAPI will crash on startup if any file is missing because `functions.py` loads all files when imported.
   
   **Note:** The `fastapi/data/` directory is gitignored. You'll need to obtain these files separately if they're not available in your local setup.

### FastAPI Import Errors

- Ensure you're in the `fastapi` directory when running scripts
- Verify all Python dependencies are installed: `pip install -r requirements.txt`
- Check Python version: `python --version` (should be 3.9+)

## Quick Reference: Database Setup

### Quick SQL File Import (Copy-Paste Ready)

```bash
# 1. Start PostgreSQL
brew services start postgresql@13  # macOS
# OR: sudo systemctl start postgresql  # Linux

# 2. Create database
createdb -U postgres wealth_platform

# 3. Import SQL file (from project root)
psql -U postgres -d wealth_platform -f server/db-data/bati_wealthai_db.sql

# 4. Verify import
psql -U postgres -d wealth_platform -c "\dt"  # List tables
psql -U postgres -d wealth_platform -c "SELECT COUNT(*) FROM customer_info;"  # Check data

# 5. (Optional) Import permissions (separate file, not in main SQL)
psql -U postgres -d wealth_platform -f server/db-data/user_permissions_tables.sql
```

### SQL File Location

- **Main database:** `server/db-data/bati_wealthai_db.sql` - **REQUIRED**
- **Permissions:** `server/db-data/user_permissions_tables.sql` - **Optional** (separate file, not included in main SQL)

### Database Tables Created

**From SQL file (`bati_wealthai_db.sql`):**
- `customer_info` - Customer information and profiles
- `rm_account` - Relationship Manager accounts (for authentication)
- `current_allocation` - Current portfolio allocations
- `historical_transaction` - Historical transaction records (for Express server)
- `optimized_allocation` - Optimized portfolio recommendations
- `rm_task_manager` - Task management for RMs
- `customer_activity` - Customer activity logs
- `customer_segmentation_offer` - Customer segmentation data

**From FastAPI `init-db.py` script (reads from `fastapi/data/` directory):**
- `product_data` - Product information (created from `fastapi/data/product_data.xlsx`)
- `customer_transaction` - Customer transaction data (created from `fastapi/data/historical_transaction_usd.csv`, different from `historical_transaction`)

**Note:** The SQL file does NOT include `product_data` and `customer_transaction`. These must be created separately using FastAPI's initialization script, which reads data files from the `fastapi/data/` directory.

## Submission Package Structure

If you're setting up from a submission package (zip file), ensure the following structure:

```
wealth-ai/
├── README.md                          # This file
├── client/                            # Next.js frontend
├── server/
│   └── db-data/
│       ├── bati_wealthai_db.sql      # ⚠️ REQUIRED: Main database SQL file
│       └── user_permissions_tables.sql # Optional: Permissions tables (separate file)
├── fastapi/
│   └── data/                          # ⚠️ REQUIRED: All 5 files must be here
│       ├── product_data.xlsx
│       ├── historical_transaction_usd.csv
│       ├── Mutual_Fund_Data.xlsx
│       ├── Master_Data_for_RM_Tableau_usd.csv
│       └── optimized_allocation_usd.csv
└── ... (other project files)
```

**Setup Steps:**
1. Extract the zip file
2. Follow the [Database Setup](#2-database-setup) section above
3. Import `server/db-data/bati_wealthai_db.sql` into PostgreSQL
4. Ensure all 5 files are in `fastapi/data/` directory
5. Run `python fastapi/init-db.py` to create FastAPI tables
6. Configure environment variables (see [Environment Configuration](#3-environment-configuration))
7. Install dependencies and start services (see [Starting the Services](#starting-the-services))

## Additional Resources

- [Client README](client/README.md) - Next.js specific documentation
- [FastAPI README](fastapi/README.md) - FastAPI service documentation
- [System Architecture Documentation](files/ARSITEKTUR_DAN_DOKUMENTASI_SISTEM.md) - Detailed system architecture

## Support

For issues or questions, please refer to the project documentation or contact the development team.
