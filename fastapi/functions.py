import re

import pandas as pd
import psycopg2
from data import *
from setup import *

# Load data
(
    Mutual_Fund_Equity,
    Mutual_Fund_Fixed_Income,
    Mutual_Fund_Money_Market,
    historical_transaction,
    customer_data,
    optimized_portfolio,
) = load_data()

# Basic definitions
additional_definitions = f"""
    FBI = Fee Based Income
    BAC = Banca = BAnCassurance
    RD = Reksa Dana
    SB = Surat Berharga (Bond) = SB Perdana + SB Sekunder
    TD = Time Deposit
    CASA = Current Account Savings Account
    FUM = Fund Under Management = CASA + Deposito + BAC + RD + SB
    AUM = Asset Under Management = BAC + SB + RD

    Default currency is USD. Use short notation like K (thousand), M (million) or B (billion). Don't use decimal point in the currency.
    Use simple, clear text for explanation. For headers, use <b><span style="color:#5772f9; font-size:18px;">some text</span></b>, do not use heading tags.
    Use <b><span style="color:red;">some text or numbers</span></b> to highlight numbers and important information.
"""


# Function to get the latest period columns
def get_latest_period_columns():
    # Get allocation columns from customer_data
    cols = [i for i in customer_data.columns if i[0] == "%"]
    # Find columns that match the pattern 'Q[1-4] 20[0-9]{2}$'
    period_columns = [col for col in cols if re.search(r"Q[1-4] 20[0-9]{2}$", col)]
    # Extract quarters and years
    periods = [(col.split()[-2], int(col.split()[-1])) for col in period_columns]
    # Find the latest period
    latest_q, latest_year = max(periods, key=lambda x: (x[1], x[0]))
    # Generate the latest period string
    latest_period = f"{latest_q} {latest_year}"
    # Create list of columns for the latest period
    latest_columns = [
        f"CASA {latest_period}",
        f"Deposito {latest_period}",
        f"AUM RD {latest_period}",
        f"AUM SBN PERDANA {latest_period}",
        f"AUM SBN SEKUNDER {latest_period}",
        f"AUM BAC {latest_period}",
        f"FBI RD {latest_period}",
        f"FBI SBN PERDANA {latest_period}",
        f"FBI SBN SEKUNDER {latest_period}",
        f"FBI BAC {latest_period}",
    ]
    # Get previous year period
    prev_year = latest_year - 1
    prev_period = f"{latest_q} {prev_year}"
    # Create list of columns for YoY comparison
    yoy_columns = [
        (f"CASA {latest_period}", f"CASA {prev_period}"),
        (f"Deposito {latest_period}", f"Deposito {prev_period}"),
        (f"AUM RD {latest_period}", f"AUM RD {prev_period}"),
        (f"AUM SBN PERDANA {latest_period}", f"AUM SBN PERDANA {prev_period}"),
        (f"AUM SBN SEKUNDER {latest_period}", f"AUM SBN SEKUNDER {prev_period}"),
        (f"AUM BAC {latest_period}", f"AUM BAC {prev_period}"),
        (f"FBI RD {latest_period}", f"FBI RD {prev_period}"),
        (f"FBI SBN PERDANA {latest_period}", f"FBI SBN PERDANA {prev_period}"),
        (f"FBI SBN SEKUNDER {latest_period}", f"FBI SBN SEKUNDER {prev_period}"),
        (f"FBI BAC {latest_period}", f"FBI BAC {prev_period}"),
    ]
    return latest_columns, yoy_columns, latest_period


# Function to present user profile
def present_customer_profile(customer_id: str, language: str) -> str:
    data = customer_data[customer_data["BP Number WM Core"] == customer_id]
    # Get latest columns and YoY columns
    _, yoy_columns, latest_period = get_latest_period_columns()
    latest_period = "Q4 2023"
    fum_latest_period = [
        "usd_cur_casa_allocation",
        "usd_cur_bac_allocation",
        "usd_cur_td_allocation",
        "usd_cur_bonds_allocation",
        "usd_cur_mf_allocation",
    ]
    total_fum = data[fum_latest_period].values.sum()
    fum_composition = data[fum_latest_period]
    percent_cols = [i for i in data.columns if i[0] == "%"]
    percent_cols_latest_period = [
        i for i in percent_cols if " ".join(i.split(" ")[-2:]) == latest_period
    ]
    fum_composition_percentage = data[percent_cols_latest_period]

    client_optimized_portfolio = optimized_portfolio[
        optimized_portfolio["Customer ID"] == customer_id
    ]
    current_return = client_optimized_portfolio["usd_current_expected_return"].sum()
    current_return_percentage = (
        client_optimized_portfolio["current_expected_return"].sum() * 100
    )

    # Create list of all required columns
    # use_columns = ['BP Number WM Core', 'Customer Type', 'Client Segment', 'Priority_Private',
    #                'Transaction Label', 'AUM Label', 'BAC', 'SB', 'RD',
    #                'Risk Profile Description', 'Score Overall', 'Score BAC', 'Score SB', 'Score RD']
    use_columns = [
        "BP Number WM Core",
        "Customer Type",
        "Priority_Private",
        "AUM Label",
        "BAC",
        "SB",
        "RD",
        "Risk Profile",
        "Score Overall",
        "Score BAC",
        "Score SB",
        "Score RD",
    ]

    # overview = data[['Customer Type', 'Client Segment', 'Priority_Private', 'Transaction Label', 'AUM Label', 'Overall Propensity']]
    overview = data[["Customer Type", "Priority_Private", "AUM Label", "Risk Profile"]]

    # Add all YoY column pairs to use_columns
    for latest, previous in yoy_columns:
        use_columns.extend([latest, previous])

    data = customer_data[customer_data["BP Number WM Core"] == customer_id][use_columns]

    # Generate prompt
    prompt = f"""
    Answer in {language}. 
    {additional_definitions}

    #### User Data ####
    {data.to_dict(orient='records')}
    ####
    
    - Client Overview: describe in detail {overview.to_dict(orient='records')}. Highlight the Risk Profile.
    - Current Total Asset: {total_fum}
    - Present client's asset composition in a table with the following columns:
        - "Investment Type": CASA, Deposito, BAC, RD, SB
        - "Current Allocation (%)": {fum_composition_percentage.to_dict(orient='records')}
        - "Current Allocation (USD)": {fum_composition.to_dict(orient='records')}
     - YoY asset growth in the past year (mention the period) from "User Data" section. Present in table with columns: "Asset Type", "Growth (USD)", "Growth (%)". Elaborate. 
    - Explain risk tolerance based on propensity and score (3 is highest for each asset) in "User Data" section for RD, SB and BAC.
    - Ask for risk profile reassesment if:
        - risk profile is "Conservative" but score RD is high
        - risk profile is "Growth", "High", or "Aggressive", but score SB and/or score RD are low
    - Explain behavioral changes over time (Look at "User Data" section from quarter to quarter). Check consistency with propensity.
    - Analyze the compatibility of the current FUM composition with the client's risk profile.
    - Show the expected return from current FUM composition: 
        - {current_return} in USD
        - {current_return_percentage} in %
    - Replace BAC with the word Banca, SB with the word Bonds, SB Perdana with the word Primary Bonds, SB Sekunder with the word Secondary Bonds, and RD with the word Mutual Fund.
    In the end, ask if RM wants to see the recommended optimized portfolio.
    """
    return prompt


# Function to present user performances from different periods
def previous_period_performance(customer_id: str, language: str, question: str) -> str:

    # Get the current period (assuming Q4 2023 is current)
    current_quarter = "Q4"
    current_year = 2023

    # Parse the time period request
    if "month" in question.lower():
        # For monthly view, we'll use the previous quarter
        if "last" in question.lower() or "previous" in question.lower():
            previous_quarter = "Q3"
            previous_year = current_year
        elif "3" in question or "three" in question.lower():
            previous_quarter = "Q2"
            previous_year = current_year
        elif "6" in question or "six" in question.lower():
            previous_quarter = "Q1"
            previous_year = current_year
    elif "year" in question.lower():
        previous_quarter = current_quarter
        previous_year = current_year - 1
    else:
        # Default to previous quarter
        previous_quarter = "Q3"
        previous_year = current_year

    previous_period = f"{previous_quarter} {previous_year}"
    period_columns = [
        f"CASA {previous_period}",
        f"Deposito {previous_period}",
        f"AUM RD {previous_period}",
        f"AUM SBN PERDANA {previous_period}",
        f"AUM SBN SEKUNDER {previous_period}",
        f"AUM BAC {previous_period}",
        f"FBI RD {previous_period}",
        f"FBI SBN PERDANA {previous_period}",
        f"FBI SBN SEKUNDER {previous_period}",
        f"FBI BAC {previous_period}",
    ]
    # Get master data of customer for the period
    data = customer_data[customer_data["BP Number WM Core"] == customer_id][
        period_columns
    ]

    # Calculate metrics for the period
    total_fum = data[period_columns[:6]].values.sum()
    fum_composition = data[period_columns[:6]]
    fbi_composition = data[period_columns[6:]].values.sum()

    # Calculate return for the period
    previous_return = (
        data[f"AUM RD {previous_period}"] * 0.13
        + (
            data[f"AUM SBN PERDANA {previous_period}"]
            + data[f"AUM SBN SEKUNDER {previous_period}"]
        )
        * 0.06
    )

    # Get recent purchases
    data_hist = historical_transaction[
        historical_transaction["Customer ID"] == customer_id
    ]
    data_hist = data_hist[
        (data_hist["Quarter"] == "Q3") & (data_hist["Year"] == "2023")
    ]
    recent_purchases = data_hist["Product Name"].value_counts().to_frame()

    # Get optimized portfolio
    cur_opt_portfolio = optimized_portfolio[
        optimized_portfolio["Customer ID"] == customer_id
    ][["asset_type", "recommended_allocation"]]

    # Generate prompt
    prompt = f"""
    Answer in {language}. 
    {additional_definitions}

    #### User Data for {previous_period} ####
    {data.to_dict(orient='records')}
    ####
    
    - Do not mention any month and/or year. Just mention what the query asks (for example: last month, last three months, last year)
    - Customer's Total Asset in the month/year: {total_fum}
    - Present client's asset composition in a table with the following columns:
        - "Investment Type": CASA, Deposito, BAC, RD, SB Perdana, SB Sekunder
        - "Previous Allocation (USD)": {fum_composition.to_dict(orient='records')}
    - Show the realized return from FUM composition: 
        - {previous_return} in USD
    - FBI in the month/year: {fbi_composition}
    - In table format, compare their allocation with the recommended allocation: {cur_opt_portfolio.to_dict(orient='records')}. Explain the difference.
    - In table form, present the product names and count of products of recent purchases: {recent_purchases}. Analyze the customer's preferences.
        If none, explain that the client has not made any purchases in the past month.
    - Explain how the client's performance on the previous period.
    - Replace BAC with the word Banca, SB Perdana with the word Primary Bonds, SB Sekunder with the word Secondary Bonds, and RD with the word Mutual Fund.
    """
    return prompt


# Function to present optimized portfolio
def present_optimized_portfolio(customer_id: str, language: str) -> str:
    # Generate required data
    use_columns, _, latest_period = get_latest_period_columns()
    data = customer_data[customer_data["BP Number WM Core"] == customer_id][use_columns]
    client_optimized_portfolio = optimized_portfolio[
        optimized_portfolio["Customer ID"] == customer_id
    ]
    total_current_asset = (
        data["CASA " + latest_period]
        + data["Deposito " + latest_period]
        + data["AUM BAC " + latest_period]
        + data["AUM RD " + latest_period]
        + data["AUM SBN PERDANA " + latest_period]
        + data["AUM SBN SEKUNDER " + latest_period]
    )
    total_current_return_usd = client_optimized_portfolio[
        "usd_current_expected_return"
    ].sum()
    total_current_return_percentage = (
        client_optimized_portfolio["current_expected_return"].sum() * 100
    )
    total_recommended_return_usd = client_optimized_portfolio[
        "usd_expected_return"
    ].sum()
    total_recommended_return_percentage = (
        client_optimized_portfolio["expected_return"].sum() * 100
    )
    total_current_fbi = (
        data["FBI SBN PERDANA " + latest_period]
        + data["FBI SBN SEKUNDER " + latest_period]
        + data["FBI RD " + latest_period]
        + data["FBI BAC " + latest_period]
    )
    total_recommended_fbi = client_optimized_portfolio["usd_fee"].sum()
    used_columns = ["asset_type", "recommended_allocation", "cur_allocation"]
    # Generate prompt
    prompt = f"""
    Answer in {language}. 
    {additional_definitions}

    #### Portfolio Optimization ####
    {client_optimized_portfolio[used_columns].to_dict(orient='records')}
    ####

    - Show and highlight total asset in USD: {total_current_asset}
    - Replace BAC with the word Banca, SB with the word Bonds, and RD with the word Mutual Fund.
    - Create a table with the following columns (use numbers from "Portfolio Optimization" section, convert fraction to percentage):
        - "Investment Type": CASA, Deposito, BAC, RD, SB
        - "Current Allocation (%)"
        - "Recommended Allocation (%)"
        - "Change (%)": Recommended Allocation (%) - Current Allocation (%)
        - "Current Allocation (USD)".
        - "Recommended Allocation (USD)"
        - "Change (USD)": Recommended Allocation (USD) - Current Allocation (USD)

    - Compare the expected returns of the current ({total_current_return_usd/1e3} USD, {total_current_return_percentage} %) and recommended portfolios ({total_recommended_return_usd/1e3} USD, {total_recommended_return_percentage}%). Highlight the numbers.
    - How the risk profile will change?
    - What benefits the bank gain for recommended portfolio? Show total FBI from current portfolio ({total_current_fbi}) and FBI of the recommended portfolio ({total_recommended_fbi}) in USD. Highlight the numbers.
    In the end, offer follow up questions for recommended products or further asset allocation adjustments.
    
    """
    return prompt


# Function to present client's past behaviour (historical transaction)
def present_historical_transaction(customer_id: str, language: str) -> str:
    data = historical_transaction[historical_transaction["Customer ID"] == customer_id][
        [
            "Product Name",
            "Product Type",
            "Product Detail",
            "Number of Transaction",
            "Total Amount",
            "Quarter",
            "Year",
            "Asset Type",
        ]
    ]
    prompt = f"""
    Answer in {language}.
    {additional_definitions}
    Assume that current month is 

    #### Historical Transaction ####
    {data.to_dict(orient='records')}
    ####

    - Present historical transaction in table.
    - Replace BAC with the word Banca, SB with the word Bonds, SB Perdana with the word Primary Bonds, SB Sekunder with the word Secondary Bonds, and RD with the word Mutual Fund.
    - What is the behavior of the client?
    - What funds are the client interested in?
    """
    return prompt


# Function to recommend products for the client
def present_recommended_products(customer_id: str, language: str) -> str:
    # Get optimized portfolio recommendations
    client_optimized_portfolio = optimized_portfolio[
        optimized_portfolio["Customer ID"] == customer_id
    ]
    recommended_products = client_optimized_portfolio[
        ["asset_type", "product_1", "product_2", "product_3"]
    ]

    # Connect to PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL)

    # Get product details for each recommended product
    product_details = []
    for _, row in recommended_products.iterrows():
        for col in ["product_1", "product_2", "product_3"]:
            if pd.notna(row[col]):
                # Clean product name for matching
                product_name = row[col].replace("(", "").replace(")", "").strip()
                # Query product details from database
                query = f"""
                SELECT "Product Name", "Fund Category", "Risk Level", 
                       "1 Year Return", "YTD", "Since Inception", "Asset Allocation as of Reporting Date",
                       "Minimum Initial Subscription", "Management Fee"
                FROM product_data 
                WHERE REPLACE(REPLACE(UPPER("Product Name"), '(', ''), ')', '') 
                LIKE '%{product_name.upper()}%'
                OR REPLACE(REPLACE(UPPER("Product Name"), '(', ''), ')', '')
                LIKE '%{product_name.upper().replace(" ", "%")}%'
                """
                product_info = pd.read_sql_query(query, conn)
                if not product_info.empty:
                    product_info["Asset Type"] = row["asset_type"]
                    product_details.append(product_info)

    conn.close()

    # Combine all product details into a single DataFrame
    if product_details:
        all_product_details = pd.concat(product_details, ignore_index=True)
    else:
        all_product_details = pd.DataFrame()

    prompt = f"""
    Answer in {language}.
    {additional_definitions}

    #### Recommended Products ####
    {recommended_products.to_dict(orient='records')}

    #### Product Details ####
    {all_product_details.to_dict(orient='records')}
    ####

    - Replace BAC with the word Banca, SB with the word Bonds, SB Perdana with the word Primary Bonds, SB Sekunder with the word Secondary Bonds, and RD with the word Mutual Fund.
    - Present recommended products in a detailed table with the following columns:
        - Asset Type
        - Product Name
        - Fund Category
        - Risk Level
        - 1 Year Return
        - YTD Return    
        - Since Inception Return
        - Minimum Initial Subscription
        - Management Fee
    - Skip empty product rows
    - Group products by Asset Type
    - For each product:
        - Explain its investment policy
        - Highlight its key features and performance
    - Explain the rationale behind the recommendation
    - If able, give rationale based on the client's risk profile and preferences
    """
    return prompt


# Function to get new allocation
def get_new_allocation(customer_id: str, question: str):
    client_optimized_portfolio = optimized_portfolio[
        optimized_portfolio["Customer ID"] == customer_id
    ]
    current_allocation = client_optimized_portfolio[["asset_type", "cur_allocation"]]
    current_asset = client_optimized_portfolio["usd_current_allocation"].sum()

    prompt = f"""
        SB: Surat Berharga
        RD: Reksa Dana
        Using this current portfolio allocation:
        SB = {current_allocation[current_allocation['asset_type'] == 'SB']['cur_allocation'].values[0]}
        RD = {current_allocation[current_allocation['asset_type'] == 'RD']['cur_allocation'].values[0]}
        combined with this question:
        "{question}",
        calculate new allocation for SB and RD.
        Note: percentage change in the question is with respect to the total asset, not the individual asset.
        For example, if ask for 10% more SB, new SB is SB + 10%.
        If ask for moving 10% from SB to RD, then new SB is SB - 10% and new RD is RD + 10%.
    """

    return prompt, current_asset


# Function to present new portfolio allocation
def present_new_portfolio(
    customer_id: str,
    language: str,
    current_asset: float,
    RD_allocation: float,
    SB_allocation: float,
) -> str:
    data = customer_data[customer_data["BP Number WM Core"] == customer_id][
        ["BAC", "SB", "RD"]
    ]
    client_optimized_portfolio = optimized_portfolio[
        optimized_portfolio["Customer ID"] == customer_id
    ]
    current_allocation = client_optimized_portfolio[
        ["asset_type", "cur_allocation", "usd_current_allocation"]
    ]
    current_return = client_optimized_portfolio["usd_current_expected_return"].sum()

    SB_cur_allocation = current_allocation[current_allocation["asset_type"] == "SB"][
        "cur_allocation"
    ].values[0]
    RD_cur_allocation = current_allocation[current_allocation["asset_type"] == "RD"][
        "cur_allocation"
    ].values[0]

    SB_changes = SB_allocation - SB_cur_allocation
    RD_changes = RD_allocation - RD_cur_allocation

    SB_changes_USD = abs(SB_changes * current_asset)
    RD_changes_USD = abs(RD_changes * current_asset)

    # Generate prompt
    prompt = f"""
    Answer in {language}.
    {additional_definitions}
    
    #### Current Allocation ####
    {current_allocation.to_dict(orient='records')}
    ####

    #### Adjusted Allocation ####
    SB_allocation = {SB_allocation}
    RD_allocation = {RD_allocation}
    ####

    #### Total Asset ####
    {current_asset}
    ####

    #### Risk Profile ####
    SB_risk = {data['SB'].values[0]}
    RD_risk = {data['RD'].values[0]}
    ####

    - Check if the requested/adjusted allocation is compatible with the current risk profile. If not compatible, do not proceed and explain why, then ask to re-profile the customer.
    - Replace BAC with the word Banca, SB with the word Bonds, and RD with the word Mutual Fund.
    - If compatible, create a table with the following columns.
        - "Investment Type": CASA, Deposito, BAC, RD, SB, Total
        - "Current Allocation (%)"
        - "Adjusted Allocation (%)". Adjusted allocation for SB is {SB_allocation * 100}%, for RD is {RD_allocation * 100}%. Total should be 100%.
        - "Change (%)": Adjusted Allocation (%) - Current Allocation (%)
        - "Current Allocation (USD)": Multiply current allocation (%) by total asset
        - "Adjusted Allocation (USD)": Multiply adjusted allocation (%) by total asset
        - "Change (USD)": Adjusted Allocation - Current Allocation.
    - Show the previous  {current_return} and new expected return {(0.065 * SB_allocation * current_asset) + (0.13 * RD_allocation * current_asset)} in USD. Compare.
    - Show the new FBI {(SB_changes_USD * 0.00633) + (RD_changes_USD * 0.011)} in USD
    - Replace BAC with the word Banca, SB with the word Bonds, and RD with the word Mutual Fund.
    """
    return prompt


# Function to generate SQL syntax for fund details
def generate_sql_syntax_product_data(question: str) -> str:
    prompt = f"""
    Rules:
    1. Return ONLY the SQL query, nothing else
    2. Only use columns that exist in the schemas
    3. Use proper SQL syntax for SQLite
    4. If the query is asking for list of products, order by Fund category and then by Risk Level and 1 Year Return in descending order
    5. When the query is asking for products comparison, use all available information.
    6. Consider possible typos or incomplete product names in the question and use LIKE to find similar matches
    Given these SQLite table schemas:
    {table_schemas_product_data}
    Generate a SQL query to answer this question: {question} by following the rules.
    If not specified, important fields to show: Product Name, Fund Category, Effective Date, Risk Level, 1 Year Return, Since Inception. Avoid selecting all fields.
    Give analysis on which customers are most likely to invest in the product, by risk profile and preferences.
    Return list in table format.

    Example of flexible product name matching:
    WHERE REPLACE(REPLACE(UPPER("Product Name"), '(', ''), ')', '') LIKE '%PRODUCT_NAME%'
    OR REPLACE(REPLACE(UPPER("Product Name"), '(', ''), ')', '') LIKE '%PRODUCT_NAME_WITHOUT_SPACES%'
    """
    return prompt


# Function to generate SQL syntax for customer transaction
def generate_sql_syntax_customer_transaction(question: str) -> str:
    prompt = f"""
    Rules:
    1. Return ONLY the SQL query, nothing else
    2. Only use columns that exist in the schemas
    3. Use proper SQL syntax for SQLite
    4. If the query is asking for list of customers, order by profit in descending order
    5. Limit the result to 10 customers
    Given these SQLite table schemas:
    {table_schemas_customer_transaction}
    Generate a SQL query to answer this question: {question} by following the rules.
    If not specified, important fields to show: Product Name, Return, Profit, Current Amount. Avoid selecting all fields.
    Return the list in table format.
    """
    return prompt


# Function to present SQL results
def present_sql_results(results: pd.DataFrame, language: str) -> str:
    # Convert results to string format and append to prompt
    prompt = f"""
    Answer in {language}.
    Results found:
    {results.to_dict(orient='records')}
    Present data in an engaging and organized way. 
    Present all found results. Split to some tables if necessary. Elaborate on the data and provide insights.
    Highlight this in bold red: "Please use dashboard to see all data, because this response will be cut short due to the size of the data."
    For headers, use <b><span style="color:#5772f9; font-size:18px;">some text</span></b>, do not use heading tags.
    Use <b><span style="color:red;">some text or numbers</span></b> to highlight numbers and important information.
    """
    return prompt


def filter_customers_region(question: str, language: str) -> str:
    """
    Filter customers based on region and/or area from the customer_data DataFrame
    Default: Show top 5 customers by AUM
    Filters: region, area
    """

    # Create base DataFrame with required columns
    data = customer_data[
        [
            "BP Number WM Core",
            "Region Number",
            "Region Name",
            "Nama Area",
            "Risk Profile",
            "Priority_Private",
            "AUM Q4 2023",
        ]
    ]

    # Extract number for top N from the question (default to 5 if not specified)
    match = re.search(r"top\s+(\d+)", question.lower())
    top_n = int(match.group(1)) if match else 5

    # Apply filters based on the question

    region_number = data["Region Number"].unique()
    for region in region_number:
        if re.search(rf"\b{str(region).lower()}\b", question.lower()):
            data = data[data["Region Number"] == region]

    region_name = data["Region Name"].unique()
    for region in region_name:
        if re.search(rf"\b{str(region).lower()}\b", question.lower()):
            data = data[data["Region Name"] == region]

    areas = data["Nama Area"].unique()
    for area in areas:
        if str(area).lower() in question.lower():
            data = data[data["Nama Area"] == area]

    # Get top N customers by AUM
    result_df = data.nlargest(top_n, "AUM Q4 2023")[
        [
            "BP Number WM Core",
            "Region Number",
            "Region Name",
            "Nama Area",
            "Risk Profile",
            "Priority_Private",
            "AUM Q4 2023",
        ]
    ]

    prompt = f"""
        Answer in {language}.
        {additional_definitions}
        
        #### Filtered Customer List ####
        {result_df.to_dict(orient='records')}
        
        Present the top {top_n} customers in a table with:
        - Customer ID: {result_df['BP Number WM Core'].values[0]}
        - Region: {result_df['Region Number'].values[0]}
        - Area: {result_df['Nama Area'].values[0]}
        - Risk Profile: {result_df['Risk Profile'].values[0]}
        - Segment (Priority/Private): {result_df['Priority_Private'].values[0]}
        - Total AUM (use K, M, B notation): {result_df['AUM Q4 2023'].values[0]}
        
        Highlight any notable patterns or concentrations in the data.
        Ask if user wants to:
        1. See more customers
        2. Apply different filters
        3. View detailed information for any specific customer
        """

    return prompt
