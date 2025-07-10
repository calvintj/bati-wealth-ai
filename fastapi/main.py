import json

import pandas as pd
import psycopg2
from functions import *
from setup import *
from tools import *

from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse, StreamingResponse

######################################################## Initialization
# System instructions
system_instructions = f"""
You are an expert financial advisor, providing a help for RM in managing customer's portfolio with friendly and professional tone.
Position RM as 2nd person, and customer as 3rd person.
Do not just present the data, but also explain the data in detail in a way that is easy to understand.
Always ask for follow-up questions after giving the answer. If the prompt looks like it answered a follow-up question, reply in an excited way, such as "Great! Let's dive deep into...".
If the query is completely unrelated to investment or portfolio management, do not proceed.
"""
default_messages = [{"role": "system", "content": system_instructions}]

# Define a dictionary to map function names to their corresponding functions
function_map = {
    "present_customer_profile": present_customer_profile,
    "previous_period_performance": previous_period_performance,
    "present_optimized_portfolio": present_optimized_portfolio,
    "present_historical_transaction": present_historical_transaction,
    "present_recommended_products": present_recommended_products,
    "get_new_allocation": get_new_allocation,
    "filter_customers_region": filter_customers_region,
    "generate_sql_syntax_product_data": generate_sql_syntax_product_data,
    "generate_sql_syntax_customer_transaction": generate_sql_syntax_customer_transaction,
}
table_schemas_map = {
    "table_schemas_product_data": table_schemas_product_data,
    "table_schemas_customer_transaction": table_schemas_customer_transaction,
}
######################################################## End of Initialization


######################################################## Health Check endpoint
@app.get("/")
async def root():
    return {"message": "Wealth Management API is running!", "status": "healthy"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "postgresql"}


######################################################## Chat API endpoint
@app.post("/api_chat")
async def api_chat(request: ChatRequest):
    # Initialize messages
    messages = [{"role": "user", "content": request.query}]
    messages.insert(
        0,
        {
            "role": "user",
            "content": f"language: {request.language}, customer_id: {request.customer_id}",
        },
    )
    messages = default_messages + messages

    # Call OpenAI API
    response_tool_call = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        tools=tools,  # Use function calling
        temperature=0.3,
    )

    # Extract tool calls (function calling)
    tool_calls = response_tool_call.choices[0].message.tool_calls

    if tool_calls is not None:
        tool_call = tool_calls[0]
        function_name = tool_call.function.name

        print(f"Calling function: {tool_call.function.name}")

        # For function that requires customer_id
        if function_name in list_functions_id_required:
            customer_id = request.customer_id
            if customer_id is not None:
                if function_name == "get_new_allocation":
                    prompt, current_asset = get_new_allocation(
                        int(customer_id), request.query
                    )
                    msg = [{"role": "user", "content": prompt}]
                    response_reallocation = client.beta.chat.completions.parse(
                        model="gpt-4o",
                        messages=msg,
                        response_format=Allocation,
                    )
                    allocation = response_reallocation.choices[0].message.parsed
                    prompt = present_new_portfolio(
                        int(customer_id),
                        request.language,
                        current_asset,
                        allocation.RD_allocation,
                        allocation.SB_allocation,
                    )
                elif function_name == "previous_period_performance":
                    prompt = function_map[function_name](
                        int(customer_id), request.language, request.query
                    )
                else:
                    prompt = function_map[function_name](
                        int(customer_id), request.language
                    )
                # Append prompt to messages
                messages.append({"role": "user", "content": prompt})
            else:
                return PlainTextResponse("Please provide a customer ID.")

        # For function that requires SQL syntax
        elif function_name in [
            "generate_sql_syntax_product_data",
            "generate_sql_syntax_customer_transaction",
        ]:
            sql_generation_prompt = function_map[function_name](request.query)

            # Generate SQL query using OpenAI
            query_response = client.beta.chat.completions.parse(
                model="gpt-4o",
                messages=[{"role": "system", "content": sql_generation_prompt}],
                temperature=0.7,
                response_format=SQLresponse,  # Use structured output
            )
            # Extract the SQL syntax from the response
            sql_syntax = query_response.choices[0].message.parsed.sql_syntax
            # Execute generated query
            conn = psycopg2.connect(DATABASE_URL)
            results = pd.read_sql_query(sql_syntax, conn)
            if not results.empty:
                prompt = present_sql_results(results, request.language)
            else:
                prompt = f"No results found for query: {sql_syntax}. Explain possible failure of the query."
            messages.append({"role": "user", "content": prompt})

        elif function_name == "filter_customers_region":
            prompt = function_map[function_name](request.query, request.language)
            messages.append({"role": "user", "content": prompt})
    try:

        def data_generator():
            # Call the OpenAI API
            response = client.chat.completions.create(
                model="gpt-4o", messages=messages, temperature=1, stream=True
            )
            for chunk in response:
                content = chunk.choices[0].delta.content
                if content:
                    yield content

            # # For SQL-related functions, append the query results at the end
            # if function_name in ['generate_sql_syntax_product_data', 'generate_sql_syntax_customer_transaction']:
            #     yield "\n\nSQL Query Results:\n"
            #     yield results.to_string()

        return StreamingResponse(data_generator(), media_type="text/plain")

    except Exception as e:
        # Log the error for debugging purposes
        print(f"Error calling OpenAI API: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


######################################################## End of Chat API endpoint

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
