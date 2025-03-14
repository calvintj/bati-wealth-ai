# -----------------------
# Stage 1: Build Stage
# -----------------------
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    # Install pnpm globally
    RUN npm install -g pnpm
    
    # Copy package files for caching
    COPY package.json pnpm-lock.yaml ./
    
    # Install server dependencies
    RUN pnpm install
    
    # Copy the rest of the server source
    COPY . .
    
    # Build the server (assumes a build script in package.json, e.g. "build": "tsc")
    RUN pnpm run build
    
    
    # -----------------------
    # Stage 2: Production Stage
    # -----------------------
    FROM node:18-alpine
    WORKDIR /app
    
    RUN npm install -g pnpm
    
    # Copy built server and node_modules from the builder
    COPY --from=builder /app ./
    
    # Expose port 5000 (server)
    EXPOSE 5000
    
    # Start the server
    CMD ["pnpm", "start"]
    