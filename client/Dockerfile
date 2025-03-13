# Stage 1: Build Stage for Client
FROM node:18-alpine AS builder
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only package files to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the client source code
COPY . .

# Build the Next.js (or React) client (this also compiles TypeScript)
RUN pnpm run build

# Stage 2: Production Stage for Client
FROM node:18-alpine
WORKDIR /app

# Install pnpm in the production container
RUN npm install -g pnpm

# Copy built assets and dependencies from the builder stage
COPY --from=builder /app ./

# Expose the port the client runs on
EXPOSE 3000

# Start the client application
CMD ["pnpm", "start"]
