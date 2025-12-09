import json
import logging

import pandas as pd
import psycopg2
from functions import *
from setup import *
from tools import *

from fastapi import HTTPException
from fastapi.responses import PlainTextResponse, StreamingResponse

######################################################## Logger Configuration
# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

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
    logger.info("Root endpoint accessed")
    return {"message": "Wealth Management API is running!", "status": "healthy"}


@app.get("/health")
async def health_check():
    logger.info("Health check endpoint accessed")
    return {"status": "healthy", "database": "postgresql"}


######################################################## Chat API endpoint
@app.post("/api_chat")
async def api_chat(request: ChatRequest):
    logger.info(
        f"API chat request received - Query: {request.query[:100]}..., Language: {request.language}, Customer ID: {request.customer_id}"
    )

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

    # Call DeepInfra API
    logger.info("Calling DeepInfra API for tool selection")
    try:
        response_tool_call = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=messages,
            tools=tools,  # Use function calling
            temperature=0.3,
        )
        logger.info("DeepInfra API tool call response received")
    except Exception as e:
        logger.error(f"Error calling DeepInfra API for tool selection: {e}")
        raise

    # Extract tool calls (function calling)
    tool_calls = response_tool_call.choices[0].message.tool_calls

    if tool_calls is not None:
        tool_call = tool_calls[0]
        function_name = tool_call.function.name

        logger.info(f"Tool call detected - Function: {function_name}")

        # For function that requires customer_id
        if function_name in list_functions_id_required:
            customer_id = request.customer_id
            if customer_id is not None:
                logger.info(
                    f"Executing function '{function_name}' for customer_id: {customer_id}"
                )
                if function_name == "get_new_allocation":
                    logger.info("Getting new allocation for customer")
                    prompt, current_asset = get_new_allocation(
                        int(customer_id), request.query
                    )
                    msg = [{"role": "user", "content": prompt}]
                    logger.info("Calling DeepInfra API for allocation parsing")
                    try:
                        # Try structured output first
                        response_reallocation = client.beta.chat.completions.parse(
                            model="Qwen/Qwen3-Coder-480B-A35B-Instruct-Turbo",
                            messages=msg,
                            response_format=Allocation,
                        )
                        allocation = response_reallocation.choices[0].message.parsed
                        logger.info(
                            f"Allocation received (structured) - RD: {allocation.RD_allocation}, SB: {allocation.SB_allocation}"
                        )
                    except Exception as parse_error:
                        logger.warning(
                            f"Structured output failed: {parse_error}, trying JSON mode fallback"
                        )
                        # Fallback: Use JSON mode with explicit prompt
                        json_prompt = f'{prompt}\n\nIMPORTANT: Respond with ONLY a valid JSON object in this exact format: {{"RD_allocation": 0.0, "SB_allocation": 0.0}}'
                        response_reallocation = client.chat.completions.create(
                            model="Qwen/Qwen3-Coder-480B-A35B-Instruct-Turbo",
                            messages=[{"role": "user", "content": json_prompt}],
                            response_format={"type": "json_object"},
                        )
                        response_content = response_reallocation.choices[
                            0
                        ].message.content
                        logger.info(f"Raw allocation response: {response_content}")

                        # Parse JSON response
                        try:
                            response_json = json.loads(response_content)
                            allocation = Allocation(
                                RD_allocation=float(
                                    response_json.get("RD_allocation", 0.0)
                                ),
                                SB_allocation=float(
                                    response_json.get("SB_allocation", 0.0)
                                ),
                            )
                            logger.info(
                                f"Allocation received (fallback) - RD: {allocation.RD_allocation}, SB: {allocation.SB_allocation}"
                            )
                        except (json.JSONDecodeError, ValueError, KeyError) as e:
                            logger.error(f"Failed to parse allocation JSON: {e}")
                            # Default allocation if parsing fails
                            allocation = Allocation(
                                RD_allocation=0.0, SB_allocation=0.0
                            )
                            logger.warning(
                                "Using default allocation values due to parsing error"
                            )
                    prompt = present_new_portfolio(
                        int(customer_id),
                        request.language,
                        current_asset,
                        allocation.RD_allocation,
                        allocation.SB_allocation,
                    )
                elif function_name == "previous_period_performance":
                    logger.info("Getting previous period performance")
                    prompt = function_map[function_name](
                        int(customer_id), request.language, request.query
                    )
                else:
                    logger.info(f"Executing function: {function_name}")
                    prompt = function_map[function_name](
                        int(customer_id), request.language
                    )
                # Append prompt to messages
                messages.append({"role": "user", "content": prompt})
                logger.info(f"Function '{function_name}' executed successfully")
            else:
                logger.warning("Function requires customer_id but none provided")
                return PlainTextResponse("Please provide a customer ID.")

        # For function that requires SQL syntax
        elif function_name in [
            "generate_sql_syntax_product_data",
            "generate_sql_syntax_customer_transaction",
        ]:
            logger.info(f"Generating SQL syntax using function: {function_name}")
            sql_generation_prompt = function_map[function_name](request.query)

            # Generate SQL query using DeepInfra
            logger.info("Calling DeepInfra API for SQL generation")
            try:
                # Try structured output first
                query_response = client.beta.chat.completions.parse(
                    model="Qwen/Qwen3-Coder-480B-A35B-Instruct-Turbo",
                    messages=[{"role": "system", "content": sql_generation_prompt}],
                    temperature=0.7,
                    response_format=SQLresponse,
                )
                # Extract the SQL syntax from the response
                sql_syntax = query_response.choices[0].message.parsed.sql_syntax
                logger.info(f"Generated SQL query (structured): {sql_syntax}")
            except Exception as parse_error:
                logger.warning(
                    f"Structured output failed: {parse_error}, trying JSON mode fallback"
                )
                # Fallback: Use JSON mode with explicit prompt
                json_prompt = f'{sql_generation_prompt}\n\nIMPORTANT: Respond with ONLY a valid JSON object in this exact format: {{"sql_syntax": "YOUR_SQL_QUERY_HERE"}}'
                query_response = client.chat.completions.create(
                    model="Qwen/Qwen3-Coder-480B-A35B-Instruct-Turbo",
                    messages=[{"role": "system", "content": json_prompt}],
                    temperature=0.7,
                    response_format={"type": "json_object"},
                )
                response_content = query_response.choices[0].message.content
                logger.info(f"Raw response: {response_content}")

                # Try to parse as JSON
                try:
                    response_json = json.loads(response_content)
                    sql_syntax = response_json.get("sql_syntax", response_content)
                except json.JSONDecodeError:
                    # If it's not JSON, check if it's just the SQL query
                    if response_content.strip().upper().startswith("SELECT"):
                        sql_syntax = response_content.strip()
                    else:
                        # Last resort: try to extract SQL from the response
                        logger.warning(
                            "Could not parse JSON, using raw response as SQL"
                        )
                        sql_syntax = response_content.strip()

                logger.info(f"Generated SQL query (fallback): {sql_syntax}")

            # Execute generated query
            logger.info("Connecting to database and executing SQL query")
            try:
                conn = psycopg2.connect(DATABASE_URL)
                results = pd.read_sql_query(sql_syntax, conn)
                conn.close()
                logger.info(
                    f"SQL query executed successfully - Rows returned: {len(results)}"
                )

                if not results.empty:
                    prompt = present_sql_results(results, request.language)
                else:
                    logger.warning(f"No results found for SQL query: {sql_syntax}")
                    prompt = f"No results found for query: {sql_syntax}. Explain possible failure of the query."
                messages.append({"role": "user", "content": prompt})
            except Exception as db_error:
                logger.error(f"Database error executing SQL query: {db_error}")
                raise

        elif function_name == "filter_customers_region":
            logger.info("Filtering customers by region")
            prompt = function_map[function_name](request.query, request.language)
            messages.append({"role": "user", "content": prompt})
    else:
        logger.info("No tool calls detected, proceeding with direct chat response")

    try:
        logger.info("Starting streaming response generation")

        def data_generator():
            # Call the DeepInfra API
            logger.info("Calling DeepInfra API for streaming chat response")
            try:
                response = client.chat.completions.create(
                    model="openai/gpt-oss-120b",
                    messages=messages,
                    temperature=1,
                    stream=True,
                )
                chunk_count = 0
                for chunk in response:
                    content = chunk.choices[0].delta.content
                    if content:
                        chunk_count += 1
                        yield content
                logger.info(f"Streaming completed - Total chunks: {chunk_count}")
            except Exception as stream_error:
                logger.error(f"Error during streaming: {stream_error}")
                raise

            # # For SQL-related functions, append the query results at the end
            # if function_name in ['generate_sql_syntax_product_data', 'generate_sql_syntax_customer_transaction']:
            #     yield "\n\nSQL Query Results:\n"
            #     yield results.to_string()

        return StreamingResponse(data_generator(), media_type="text/plain")

    except Exception as e:
        # Log the error for debugging purposes
        logger.error(f"Error calling DeepInfra API: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")


######################################################## End of Chat API endpoint

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
