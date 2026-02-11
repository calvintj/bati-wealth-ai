import os
from typing import Optional

import dotenv
from openai import OpenAI
from pydantic import BaseModel

from fastapi import FastAPI

# Load environment variables
dotenv.load_dotenv()

# Initialize OpenRouter client (OpenAI-compatible API)
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

# FastAPI app
app = FastAPI()

# Add CORS middleware
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# PostgreSQL database configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "wealth_platform")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")

# PostgreSQL connection string
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"


# Request model for the chat API
class ChatRequest(BaseModel):
    query: str
    language: str
    customer_id: Optional[str] = None


# Response model for the SQL syntax
class SQLresponse(BaseModel):
    sql_syntax: str


# Allocation model
class Allocation(BaseModel):
    SB_allocation: float
    RD_allocation: float
