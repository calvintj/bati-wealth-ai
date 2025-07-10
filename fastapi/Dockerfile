FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt /app/
RUN apt-get update --fix-missing && \
    apt-get install -y --fix-missing build-essential && \
    pip install --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy application code
COPY . /app

# Make init script executable
RUN chmod +x /app/init-db.py

# Expose port
EXPOSE 8000

# Create startup script
RUN echo '#!/bin/bash\npython /app/init-db.py\nuvicorn main:app --host 0.0.0.0 --port 8000' > /app/start.sh && chmod +x /app/start.sh

# Run startup script when the container launches
CMD ["/app/start.sh"]