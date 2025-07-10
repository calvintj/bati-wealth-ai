#!/usr/bin/env python3
"""
Database initialization script for FastAPI container
This script runs when the container starts to ensure the database is properly set up
"""

import os
import time

import dotenv
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Load environment variables
dotenv.load_dotenv()

# Database configuration
DB_HOST = os.getenv("DB_HOST", "postgres")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "wealth_platform")
DB_USER = os.getenv("DB_USER", "calvintj")
DB_PASSWORD = os.getenv("DB_PASSWORD", "280603")


def wait_for_postgres():
    """Wait for PostgreSQL to be ready"""
    max_attempts = 30
    attempt = 0

    while attempt < max_attempts:
        try:
            conn = psycopg2.connect(
                host=DB_HOST,
                port=DB_PORT,
                user=DB_USER,
                password=DB_PASSWORD,
                database="postgres",  # Connect to default postgres database
            )
            conn.close()
            print(f"✅ PostgreSQL is ready!")
            return True
        except psycopg2.OperationalError as e:
            attempt += 1
            print(f"⏳ Waiting for PostgreSQL... (attempt {attempt}/{max_attempts})")
            time.sleep(2)

    print("❌ Failed to connect to PostgreSQL after maximum attempts")
    return False


def create_database():
    """Create the database if it doesn't exist"""
    try:
        # Connect to PostgreSQL server (not to a specific database)
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database="postgres",  # Connect to default postgres database
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()

        # Check if database exists
        cursor.execute(
            "SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (DB_NAME,)
        )
        exists = cursor.fetchone()

        if not exists:
            cursor.execute(f'CREATE DATABASE "{DB_NAME}"')
            print(f"✅ Database '{DB_NAME}' created successfully!")
        else:
            print(f"✅ Database '{DB_NAME}' already exists.")

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"❌ Error creating database: {e}")
        return False

    return True


def populate_database():
    """Populate the database with data"""
    try:
        print("📊 Populating database with data...")
        from data import (
            input_customer_transaction_to_postgres,
            input_product_data_to_postgres,
        )

        # Run the data population functions
        input_product_data_to_postgres()
        input_customer_transaction_to_postgres()

        print("✅ Database populated successfully!")
        return True
    except Exception as e:
        print(f"❌ Error populating database: {e}")
        return False


if __name__ == "__main__":
    print("🚀 Starting FastAPI database initialization...")

    # Wait for PostgreSQL to be ready
    if not wait_for_postgres():
        exit(1)

    # Create database
    if not create_database():
        exit(1)

    # Populate database
    if not populate_database():
        print("⚠️  Database population failed, but continuing...")

    print("✅ Database initialization completed!")
