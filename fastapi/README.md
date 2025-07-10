# Wealth Management Assistant API

A FastAPI-based application that provides wealth management assistance and portfolio optimization services.

## Components

### Data Directory

Contains various data files including:

- Mutual Fund data (Excel)
- Historical transaction data (CSV)
- Customer data (CSV)
- Optimized portfolio data (CSV)
- PostgreSQL database

### data.py

Handles all data-related operations:

- Loading data from Excel and CSV files
- PostgreSQL database operations
- Data transformation and preprocessing
- Table schema management

### functions.py

Contains core business logic functions:

- User profile presentation
- Portfolio optimization
- Historical transaction analysis
- Portfolio recalculation
- SQL query generation for product details

### setup.py

Manages application setup and configuration:

- Environment variable loading
- OpenAI client initialization
- FastAPI application setup
- PostgreSQL database configuration

### tools.py

Defines function calling tools for:

- User profile presentation
- Portfolio optimization
- Portfolio recalculation
- Historical transaction presentation
- SQL syntax generation

## Getting Started

1. **Install PostgreSQL** and ensure it's running on your system
2. Ensure all required data files are present in the `data/` directory
3. Set up environment variables in `.env` file:
   ```
   BATI_OPENAI_API_KEY=your_api_key
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=wealth_platform
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```
4. Install dependencies: `pip install -r requirements.txt`
5. Set up the database: `python setup_database.py`
6. Populate the database: `python data.py`
7. Run the FastAPI application: `uvicorn main:app --reload`

## Environment Variables

- `BATI_OPENAI_API_KEY`: OpenAI API key for AI functionality
- `DB_HOST`: PostgreSQL host (default: localhost)
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_NAME`: Database name (default: wealth_platform)
- `DB_USER`: Database user (default: postgres)
- `DB_PASSWORD`: Database password
