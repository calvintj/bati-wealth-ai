import os

import pandas as pd
import psycopg2
from setup import DATABASE_URL
from sqlalchemy import create_engine

# Add PostgreSQL engine creation with echo=False to hide SQL output
engine = create_engine(DATABASE_URL, echo=False)


# Load data
def load_data():

    # Load Mutual Fund data from Excel file
    file_path = os.path.join(os.path.dirname(__file__), "data", "Mutual_Fund_Data.xlsx")
    sheets = [
        "Mutual Fund Equity",
        "Mutual Fund Fixed Income",
        "Mutual Funds Money Market",
    ]
    mutual_fund_data = pd.read_excel(file_path, sheet_name=sheets)

    # Extract data for each sheet
    Mutual_Fund_Equity = mutual_fund_data["Mutual Fund Equity"]
    Mutual_Fund_Fixed_Income = mutual_fund_data["Mutual Fund Fixed Income"]
    Mutual_Fund_Money_Market = mutual_fund_data["Mutual Funds Money Market"]

    # Load historical transaction data
    historical_transaction = pd.read_csv(
        os.path.join(
            os.path.dirname(__file__), "data", "historical_transaction_usd.csv"
        )
    )
    historical_transaction = historical_transaction[
        historical_transaction["Year"] < 2024
    ]
    historical_transaction["BP Number WM Core"] = historical_transaction[
        "BP Number WM Core"
    ].astype(int)
    historical_transaction.columns = [
        "Customer ID",
        "Product Name",
        "Product Type",
        "Product Detail",
        "Number of Transaction",
        "Total Amount",
        "Quarter",
        "Year",
        "Asset Type",
        "Transaction ID",
        "Price Bought",
        "Current Price",
        "Return",
        "Profit",
        "Current Amount",
    ]
    historical_transaction["Year"] = historical_transaction["Year"].astype(str)
    historical_transaction["Product Name"] = historical_transaction[
        "Product Name"
    ].str.strip()
    historical_transaction = historical_transaction.sort_values(
        by=["Year", "Quarter"], ascending=[False, False]
    )

    # load customer data
    customer_data = pd.read_csv(
        os.path.join(
            os.path.dirname(__file__), "data", "Master_Data_for_RM_Tableau_usd.csv"
        )
    )
    customer_data = customer_data.rename(columns={"Client Segment ": "Client Segment"})
    customer_data[["Region Number", "Region Name"]] = customer_data["Region"].str.split(
        "/", expand=True
    )
    customer_data["Region Number"] = customer_data["Region Number"].str.strip()
    customer_data["Region Name"] = customer_data["Region Name"].str.strip()

    # Load optimized portfolio data
    optimized_portfolio = pd.read_csv(
        os.path.join(os.path.dirname(__file__), "data", "optimized_allocation_usd.csv")
    )
    optimized_portfolio["BP Number WM Core"] = optimized_portfolio[
        "BP Number WM Core"
    ].astype(int)
    optimized_portfolio.rename(
        columns={
            "BP Number WM Core": "Customer ID",
        },
        inplace=True,
    )

    return (
        Mutual_Fund_Equity,
        Mutual_Fund_Fixed_Income,
        Mutual_Fund_Money_Market,
        historical_transaction,
        customer_data,
        optimized_portfolio,
    )


# Function to convert Excel file to PostgreSQL database
def input_product_data_to_postgres():
    # Read Excel file
    df = pd.read_excel(
        os.path.join(os.path.dirname(__file__), "data", "product_data.xlsx")
    )
    # Convert to PostgreSQL database
    df.to_sql("product_data", con=engine, if_exists="replace", index=False)


# Function to convert customer historical transaction CSV file to PostgreSQL database
def input_customer_transaction_to_postgres():
    df = pd.read_csv(
        os.path.join(
            os.path.dirname(__file__), "data", "historical_transaction_usd.csv"
        )
    )
    df.columns = [
        "Customer ID",
        "Product Name",
        "Product Type",
        "Product Detail",
        "Number of Transaction",
        "Total Amount",
        "Quarter",
        "Year",
        "Asset Type",
        "Transaction ID",
        "Price Bought",
        "Current Price",
        "Return",
        "Profit",
        "Current Amount",
    ]
    df.to_sql("customer_transaction", con=engine, if_exists="replace", index=False)


# Function to get table schemas
def get_table_schemas(table_name: str):
    conn = psycopg2.connect(DATABASE_URL)
    schema_query = f"""
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = '{table_name}'
        ORDER BY ordinal_position
    """
    schemas = pd.read_sql_query(schema_query, conn)
    table_schemas = f"Table {table_name}:\n"
    for _, row in schemas.iterrows():
        nullable = "NULL" if row["is_nullable"] == "YES" else "NOT NULL"
        default = f" DEFAULT {row['column_default']}" if row["column_default"] else ""
        table_schemas += (
            f"    {row['column_name']} {row['data_type']} {nullable}{default}\n"
        )
    conn.close()

    return table_schemas


# Run this function to convert product data Excel file to PostgreSQL database
input_product_data_to_postgres()

# Run this function to convert customer historical transaction data CSV file to PostgreSQL database
input_customer_transaction_to_postgres()


# # Get table schemas
# table_schemas_product_data = get_table_schemas("product_data")
# table_schemas_customer_transaction = get_table_schemas("customer_transaction")

table_schemas_product_data = """
    Table Name: product_data
    Fields:
        "Product Name" TEXT,
        "Fund Category" TEXT,
        "Effective Date" TEXT,
        "Currency" TEXT,
        "Minimum Initial Subscription" TEXT,
        "Valuation Period" TEXT,
        "Subscription Fee" TEXT,
        "Redemption Fee" TEXT,
        "Switching Fee" TEXT,
        "Management Fee" TEXT,
        "Custodian Bank" TEXT,
        "Custodian Fee" TEXT,
        "ISIN Code" TEXT,
        "Bloomberg Ticker" TEXT,
        "Benchmark" TEXT,
        "Risk Factor" TEXT,
        "Risk Level" TEXT,
        "Top Holdings" TEXT, (composition)
        "Investment Policy" TEXT,
        "Asset Allocation as of Reporting Date" TEXT,
        "1 Month Return" TEXT,
        "3 Month Return" TEXT,
        "6 Month Return" TEXT,
        "YTD" TEXT, (YTD return)
        "1 Year Return" TEXT,
        "3 Year Return" TEXT,
        "5 Year Return" TEXT,
        "Since Inception" TEXT (since inception return)
"""

table_schemas_customer_transaction = """
    Table Name: customer_transaction
    Fields:
        "Customer ID" BIGINT, 
        "Product Name" TEXT, 
        "Product Type" TEXT, 
        "Product Detail" TEXT, 
        "Number of Transaction" BIGINT, 
        "Total Amount" FLOAT, 
        "Quarter" TEXT, 
        "Year" BIGINT, 
        "Asset Type" TEXT, (BAC, SB, RD)
        "Transaction ID" TEXT, 
        "Price Bought" BIGINT, 
        "Current Price" BIGINT, 
        "Return" FLOAT, (percentage)
        "Profit" FLOAT, (return in amount)
        "Current Amount" FLOAT
"""
