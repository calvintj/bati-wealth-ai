# Wealth AI

A full-stack web application for wealth management and financial analysis, built with Next.js, Node.js, and PostgreSQL.

## Tech Stack

### Frontend

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI Components

### Backend

- Node.js
- Express.js
- TypeScript
- PostgreSQL

### Infrastructure

- Docker & Docker Compose
- Nginx (for production deployment)

## Prerequisites

Before you begin, ensure you have the following installed:

- Docker and Docker Compose
- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Git

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd wealth-ai
```

2. Set up environment variables:

Create `.env` files in both client and server directories:

Client (.env):

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Server (.env):

```
DATABASE_URL=postgres://calvintj:280603@postgres:5432/bati_crm_db
JWT_SECRET=your_jwt_secret
```

3. Start the application using Docker Compose:

```bash
docker-compose up --build
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

## Development

### Frontend Development

```bash
cd client
pnpm install
pnpm dev
```

### Backend Development

```bash
cd server
pnpm install
pnpm dev
```

## Project Structure

```
wealth-ai/
├── client/                 # Frontend Next.js application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   └── Dockerfile         # Frontend Docker configuration
├── server/                # Backend Node.js application
│   ├── src/              # Source code
│   ├── db-data/          # Database initialization scripts
│   └── Dockerfile        # Backend Docker configuration
├── nginx/                 # Nginx configuration for production
└── docker-compose.yml     # Docker Compose configuration
```

## Database

The application uses PostgreSQL as its database. The database is automatically initialized with the schema and initial data when the containers are first started.

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## Deployment (AWS EC2)

### Prerequisites

- AWS Account
- AWS CLI configured
- EC2 instance with Ubuntu (recommended t2.micro or larger)
- Domain name (optional)

### EC2 Setup

1. Launch an EC2 instance:

   - AMI: Ubuntu Server 22.04 LTS
   - Instance type: t2.micro (free tier) or larger
   - Security Group: Open ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
   - Storage: At least 8GB

2. Connect to your instance:

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

3. Install Docker and Docker Compose:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo apt install docker-compose -y
```

4. Clone and deploy the application:

```bash
# Clone repository
git clone <repository-url>
cd wealth-ai

# Create environment files
# Create .env files in client and server directories as described in Getting Started

# Start the application
docker-compose up -d
```

### Nginx Setup (Optional, for production)

1. Install Nginx:

```bash
sudo apt install nginx -y
```

2. Configure Nginx:

```bash
sudo nano /etc/nginx/sites-available/wealth-ai
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/wealth-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL Setup (Optional, for HTTPS)

1. Install Certbot:

```bash
sudo apt install certbot python3-certbot-nginx -y
```

2. Obtain SSL certificate:

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Monitoring and Maintenance

- View logs: `docker-compose logs -f`
- Restart services: `docker-compose restart`
- Update application:

```bash
git pull
docker-compose down
docker-compose up -d --build
```

## License

[Add your license information here]
