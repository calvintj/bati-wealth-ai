# Define the tools

tools = [
    {
        "type": "function",
        "function": {
            "name": "present_customer_profile",
            "description": "Function to present customer / client overview and profile. Use this if the query is just plainly asking about the customer / client. Example of questions: Tell me about the customer/client, Show the client's profile, Show client's current asset allocation",
        }
    }, 
    {
        "type": "function",
        "function": {
            "name": "previous_period_performance",
            "description": "Function to present customer / client asset composition for previous period. Use this if the query is asking about the customer / client for previous period. Example of questions: Show the client's performance for previous period, Show client's asset allocation for last month, Show the client's performance for last three months, How did the customer perform in the past year?",
        }
    },
    {
        "type": "function",
        "function": {
            "name": "present_optimized_portfolio",
            "description": "Function to present and answer about optimized portfolio for a customer / client. Example of questions: Show me the optimized portfolio for the customer, what's the best asset allocation for the client, show the customer's investment plan",
        }
    },
    {
        "type": "function",
        "function": {
            "name": "present_historical_transaction",
            "description": "Function to present historical transaction of the customer. Example of questions: show me the historical transaction for this customer, what's the historical behavior of the client, what are the product holdings of this customer",
        }
    },
    {
        "type": "function",
        "function": {
            "name": "present_recommended_products",
            "description": "Function to present recommended products for a customer / client. Example of questions: show me the recommended products for this customer, what's the most suitable fund for the customer, what products/fund should be offered to this customer",
        }
    },
    {
        "type": "function",
        "function": {
            "name": "filter_customers_region",
            "description": "Function to present top customers by highest AUM filtered by region and/or area. Example of questions: find top 10 customers with highest AUM in Jakarta 1, find top 10 customers with highest AUM in Region I, find top highest AUM customer in Bali dan Nusa Tenggara",
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_new_allocation",
            "description": "Function to reallocate / redistribute asset allocation. Example of questions: simulate new portfolio allocation if SB is 10% and RD is 30%, what's the new portfolio allocation if SB is set to 30%, I want to move 10% from SB to RD",
        }
    },
    {
        "type": "function",
        "function": {
            "name": "generate_sql_syntax_product_data",
            "description": "Function to use if the query is to search for fund fact / investment products in database or to compare one product with another. Example of questions: list all products, what are the available funds, show all low level risk products, get top 5 fund by since inception return",
        }
    },
    {
        "type": "function",
        "function": {
            "name": "generate_sql_syntax_customer_transaction",
            "description": "Function to use if the query is to search for customer transaction in database, or to find customer with specific transaction / profit. Example of questions: find customer with highest profit, find customer with highest number of transaction, find customer with highest total amount, find customer with highest profit/return, which customers has positive return, list top 10 customers with positive profit for BAC, SB, RD",
        }
    }
]


list_functions_id_required = ["present_customer_profile", "present_optimized_portfolio", 
"present_historical_transaction", "present_recommended_products", "get_new_allocation", "previous_period_performance"]