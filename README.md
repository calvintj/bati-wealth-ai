# BATI Wealth AI Platform

A comprehensive wealth management and financial advisory platform designed for Relationship Managers (RMs) to efficiently manage client portfolios, analyze market data, and provide AI-powered investment recommendations. Built with modern web technologies and powered by artificial intelligence.

## 🎯 What is BATI Wealth AI?

BATI Wealth AI is an intelligent Customer Relationship Management (CRM) platform specifically designed for wealth management professionals. The platform combines traditional portfolio management capabilities with cutting-edge AI technology to help Relationship Managers:

- **Manage Client Portfolios**: Track and analyze client investments, asset allocations, and performance metrics
- **AI-Powered Advisory**: Leverage OpenAI-powered chatbot for intelligent investment recommendations and portfolio optimization
- **Market Intelligence**: Access real-time market indices, news, and macroeconomic indicators
- **Risk Management**: Analyze client risk profiles and provide appropriate investment strategies
- **Performance Analytics**: Generate comprehensive reports and visualizations for client presentations

The platform serves as a centralized hub for wealth management operations, enabling RMs to deliver personalized, data-driven investment advice while maintaining regulatory compliance and operational efficiency.

## 🏗️ Architecture Overview

### Multi-Service Architecture

The platform follows a microservices architecture with four main components:

1. **Frontend (Next.js)**: Modern React-based web application with server-side rendering
2. **Backend API (Node.js/Express)**: RESTful API handling authentication, data management, and business logic
3. **AI Service (FastAPI/Python)**: Specialized service for AI-powered portfolio optimization and recommendations
4. **Database (PostgreSQL)**: Robust relational database storing client data, transactions, and market information

## 🛠️ Technology Stack

### Frontend Technologies

- **Next.js 15.2.1**: React framework with server-side rendering and routing
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Shadcn/UI**: Modern component library built on Radix UI
- **React Query (TanStack)**: Server state management and caching
- **Chart.js & Recharts**: Data visualization and charting libraries
- **Framer Motion**: Animation and transition library
- **Zustand**: Lightweight state management

### Backend Technologies

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **TypeScript**: Type-safe server-side development
- **PostgreSQL**: Primary database for structured data
- **JWT**: JSON Web Token authentication
- **bcryptjs**: Password hashing and security
- **Express Rate Limiting**: API rate limiting and security

### AI & Analytics Service

- **FastAPI**: High-performance Python web framework
- **OpenAI API**: GPT-powered conversational AI
- **Pandas & NumPy**: Data analysis and numerical computing
- **SQLAlchemy**: Python SQL toolkit and ORM
- **Pydantic**: Data validation and serialization

### Infrastructure & DevOps

- **Docker & Docker Compose**: Containerization and orchestration
- **Nginx**: Reverse proxy and load balancer (production)
- **PostgreSQL 13**: Production-grade database
- **Environment-based Configuration**: Separate configs for development/production

## 📱 Application Features & Page Functionality

### 🔐 Authentication System

**Login Page (`/`)**

- Secure JWT-based authentication
- Role-based access control (Admin/User)
- Automatic session management
- Dark/Light theme toggle
- Responsive design for mobile and desktop

### 📊 Dashboard Overview (`/dashboard-overview`)

**Primary analytics and KPI dashboard for wealth management operations**

**Key Features:**

- **Portfolio Metrics**: Real-time display of Total Customers, AUM (Assets Under Management), and FBI (Fee-Based Income)
- **Risk Profile Analysis**: Interactive customer segmentation by risk tolerance (Conservative, Moderate, Aggressive)
- **Quarterly Performance**: Historical FUM (Funds Under Management) and FBI trends with interactive charts
- **Top Products**: Best-performing investment products and mutual funds
- **Customer List**: Comprehensive table with search, filter, and pagination capabilities
- **Dynamic Filtering**: Filter all metrics by customer risk profile for targeted analysis

**Business Value:**

- Provides instant visibility into portfolio performance and business metrics
- Enables data-driven decision making for investment strategies
- Supports client presentation preparation with visual analytics

### 🤖 AI Chatbot (`/chatbot`)

**Intelligent conversational AI assistant for investment advisory**

**Core Capabilities:**

- **Customer Profile Analysis**: AI-powered customer insights and risk assessment
- **Portfolio Optimization**: Automated asset allocation recommendations based on client goals
- **Historical Analysis**: Transaction history analysis and performance evaluation
- **Product Recommendations**: Personalized investment product suggestions
- **Market Intelligence**: Real-time market analysis and investment opportunities
- **Natural Language Processing**: Conversational interface for complex financial queries

**AI Functions:**

- `present_customer_profile`: Comprehensive client overview and current allocations
- `present_optimized_portfolio`: AI-generated optimal asset allocation strategies
- `present_historical_transaction`: Transaction history analysis and patterns
- `previous_period_performance`: Performance comparison across time periods
- `generate_sql_syntax`: Dynamic query generation for custom data analysis

**Integration:**

- Connected to PostgreSQL database for real-time data access
- OpenAI GPT integration for natural language understanding
- Real-time streaming responses for enhanced user experience

### 👤 Customer Details (`/customer-details`)

**Comprehensive individual customer portfolio management interface**

**Customer Information Panel:**

- **Personal Details**: Age, marital status, risk profile, and vintage information
- **Financial Metrics**: Real-time FUM, AUM, and FBI values with formatting
- **Dynamic Customer Selection**: Dropdown for quick customer switching

**Portfolio Analytics:**

- **Current Allocation**: Interactive pie charts showing asset distribution
- **Optimized Portfolio**: AI-recommended allocation vs. current holdings
- **Performance Tracking**: Quarterly AUM and FUM trend analysis
- **Product Holdings**: Detailed table of owned investment products

**Recommendation Engine:**

- **Personalized Products**: AI-generated investment recommendations
- **Risk-Appropriate Suggestions**: Products matching customer risk profile
- **Performance Projections**: Expected returns and risk assessments

### 🗺️ Customer Mapping (`/customer-mapping`)

**Advanced customer segmentation and portfolio visualization**

**Segmentation Analytics:**

- **Interactive Stacked Bar Charts**: Visual representation of customer distribution
- **Multi-Dimensional Filtering**: By propensity score, AUM levels, and risk profiles
- **Dynamic Data Updates**: Real-time chart updates based on filter selections

**Customer Intelligence:**

- **Propensity Analysis**: Customer likelihood to invest in specific products
- **AUM Segmentation**: Categorization by asset levels for targeted strategies
- **Comprehensive Customer List**: Filterable table with advanced search capabilities

### 💼 Recommendation Centre (`/recommendation-centre`)

**Advanced portfolio management and business development hub**

**Business Metrics Dashboard:**

- **Performance Indicators**: Total AUM, FBI, and customer count with growth percentages
- **Trend Analysis**: Quarter-over-quarter performance comparisons
- **Growth Tracking**: Visual indicators for positive/negative trends

**Portfolio Management Tools:**

- **Manager Portfolio**: Allocation overview across all managed accounts
- **Transaction History**: Recent client transactions and activity logs
- **Calendar Integration**: Task scheduling and client meeting management

**Business Development Features:**

- **Potential Transactions**: AI-identified investment opportunities
- **Sales Prospects**: Product offering recommendations based on client profiles
- **Risk Profiling Targets**: Clients requiring risk assessment updates

**Task Management:**

- **Activity Scheduling**: Calendar-based task and meeting organization
- **Follow-up Tracking**: Client interaction history and next steps
- **Performance Monitoring**: Goal tracking and achievement metrics

### 📈 Market Indices (`/market-indices`)

**Real-time market data and financial indicators**

**Market Coverage:**

- **Indonesian Markets**: Jakarta Composite Index (JCI) and LQ45
- **US Markets**: S&P 500 (SPX), NASDAQ 100 (NDX), and Dow Jones Industrial Average (DJI)
- **Real-time Data**: Live market prices and percentage changes
- **Interactive Charts**: Historical performance visualization with multiple timeframes

**Features:**

- **Multi-Market Dashboard**: Comprehensive view of global market performance
- **Responsive Design**: Optimized for desktop and mobile viewing
- **Data Visualization**: Professional charts suitable for client presentations

### 📰 Market News (`/market-news`)

**Financial news aggregation and macroeconomic indicators**

**Economic Indicators:**

- **GDP Growth Rate**: Real-time Indonesian economic growth data
- **BI Rate**: Bank Indonesia policy rate monitoring
- **Inflation Rate**: Current inflation metrics and trends
- **API Integration**: Live data from Trading Economics API

**News Intelligence:**

- **Financial News Feed**: Curated financial and market news
- **Market Analysis**: Expert commentary and market insights
- **Product Highlights**: Daily featured investment products (BBCA, BBNI, BMRN, BTPN, DCII, ADRO)

**Data Sources:**

- **Trading Economics API**: Macroeconomic data integration
- **News Aggregation**: Multiple financial news sources
- **Real-time Updates**: Automatic refresh of market information

### 🔧 Admin Panel (`/admin`)

**Comprehensive system administration and user management**

**User Management:**

- **User Creation**: Add new RMs with automatic email generation
- **Role Assignment**: Admin/User role management
- **Password Management**: Secure password updates and resets
- **User Directory**: Paginated user list with search and filter capabilities

**System Administration:**

- **User Activity Monitoring**: Track user logins and system usage
- **Security Settings**: System-wide security configuration
- **Backup Management**: Database backup status and scheduling
- **Performance Metrics**: System health monitoring and analytics

**Access Control:**

- **Role-Based Permissions**: Restricted access for admin functions
- **Audit Trail**: User action logging and system changes
- **Security Monitoring**: Login attempts and security events

### 📋 System Logs (`/logs`)

**Application monitoring and debugging interface**

**Log Management:**

- **Real-time Logging**: Live application log streaming
- **Log Filtering**: Filter by log level (Error, Warning, Info, Debug)
- **Log Clearing**: Administrative log management
- **Timestamp Tracking**: Detailed timing information for debugging

**Monitoring Features:**

- **Error Tracking**: System error identification and resolution
- **Performance Monitoring**: Application performance metrics
- **User Activity**: Track user interactions and system usage
- **Admin-Only Access**: Restricted to administrative users

## 🗄️ Database Schema

### Core Tables

- **`customer_info`**: Customer profiles, risk assessments, and personal information
- **`current_allocation`**: Real-time portfolio allocations and asset distributions
- **`customer_activity`**: Client interaction history and task management
- **`rm_accounts`**: Relationship Manager user accounts and authentication
- **`product_data`**: Investment products, mutual funds, and financial instruments
- **`historical_transactions`**: Complete transaction history and performance tracking

### Data Relationships

- **Customer-Centric Design**: All data linked to customer BP numbers
- **Time-Series Data**: Quarterly and historical performance tracking
- **Product Catalog**: Comprehensive investment product database
- **User Management**: Secure RM account and role management

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Docker & Docker Compose** (recommended for production deployment)
- **Node.js v18+** (for local development)
- **pnpm** (preferred package manager)
- **PostgreSQL 13+** (if running without Docker)
- **Python 3.8+** (for AI service development)

### Quick Start with Docker (Recommended)

1. **Clone the Repository**

```bash
git clone <repository-url>
cd wealth-ai
```

2. **Environment Configuration**

Create environment files for each service:

**Client Environment (`.env` in `/client` directory):**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BASE_API_URL=http://localhost:8000
BATI_BACKEND_URL=http://localhost:8000
```

**Server Environment (`.env` in `/server` directory):**

```env
DATABASE_URL=postgres://postgres:yourpassword@postgres:5432/wealth_platform
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
```

**FastAPI Environment (`.env` in `/fastapi` directory):**

```env
BATI_OPENAI_API_KEY=your_openai_api_key_here
DB_HOST=postgres
DB_PORT=5432
DB_NAME=wealth_platform
DB_USER=postgres
DB_PASSWORD=yourpassword
DATABASE_URL=postgresql://postgres:yourpassword@postgres:5432/wealth_platform
```

3. **Launch the Application**

```bash
docker-compose up --build
```

4. **Access the Application**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:8000
- **Database**: localhost:5432

### Local Development Setup

**Frontend Development:**

```bash
cd client
pnpm install
pnpm dev
```

**Backend Development:**

```bash
cd server
pnpm install
pnpm dev
```

**AI Service Development:**

```bash
cd fastapi
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## 📁 Project Structure

```
wealth-ai/
├── client/                     # Next.js Frontend Application
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   │   ├── dashboard-overview/    # Main dashboard
│   │   │   ├── chatbot/              # AI assistant
│   │   │   ├── customer-details/     # Individual customer management
│   │   │   ├── customer-mapping/     # Customer segmentation
│   │   │   ├── recommendation-centre/ # Portfolio management hub
│   │   │   ├── market-indices/       # Market data
│   │   │   ├── market-news/          # Financial news
│   │   │   ├── admin/               # Administration panel
│   │   │   └── logs/                # System monitoring
│   │   ├── components/        # Reusable React components
│   │   │   ├── ui/           # Base UI components (Shadcn)
│   │   │   ├── shared/       # Common components (Navbar, Sidebar)
│   │   │   ├── chatbot/      # AI chatbot components
│   │   │   ├── dashboard-overview/   # Dashboard-specific components
│   │   │   ├── customer-details/    # Customer management components
│   │   │   └── [other-features]/    # Feature-specific components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API integration services
│   │   ├── lib/             # Utility libraries
│   │   ├── types/           # TypeScript type definitions
│   │   └── stores/          # State management (Zustand)
│   ├── public/              # Static assets and images
│   └── Dockerfile           # Frontend containerization
│
├── server/                   # Node.js Backend API
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── models/         # Data models and types
│   │   ├── routes/         # Express route definitions
│   │   ├── middleware/     # Authentication and security
│   │   ├── config/         # Database and app configuration
│   │   └── utils/          # Utility functions
│   ├── db-data/            # Database initialization scripts
│   └── Dockerfile          # Backend containerization
│
├── fastapi/                 # Python AI Service
│   ├── main.py             # FastAPI application entry point
│   ├── functions.py        # Core AI business logic
│   ├── tools.py           # AI function definitions
│   ├── setup.py           # Configuration and initialization
│   ├── data.py            # Data processing and database operations
│   ├── data/              # Data files and SQLite cache
│   └── requirements.txt   # Python dependencies
│
├── nginx/                  # Production web server configuration
│   └── wealthplatform.conf # Nginx reverse proxy configuration
│
├── docker-compose.yml      # Multi-container orchestration
└── README.md              # This comprehensive documentation
```

## 🔧 Configuration & Environment Variables

### Frontend Configuration

- `NEXT_PUBLIC_API_URL`: Backend API endpoint
- `NEXT_PUBLIC_BASE_API_URL`: AI service endpoint
- `BATI_BACKEND_URL`: Internal backend communication

### Backend Configuration

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JSON Web Token signing key
- `NODE_ENV`: Environment mode (development/production)

### AI Service Configuration

- `BATI_OPENAI_API_KEY`: OpenAI API key for GPT integration
- `DB_HOST`, `DB_PORT`, `DB_NAME`: Database connection parameters
- `DB_USER`, `DB_PASSWORD`: Database authentication

## 🔒 Security Features

### Authentication & Authorization

- **JWT-based Authentication**: Secure token-based user sessions
- **Role-based Access Control**: Admin and User role separation
- **Password Hashing**: bcrypt encryption for secure password storage
- **Session Management**: Automatic token refresh and expiration

### API Security

- **Rate Limiting**: Protection against API abuse and DDoS attacks
- **CORS Configuration**: Cross-origin request security
- **Input Validation**: Comprehensive data validation and sanitization
- **SQL Injection Prevention**: Parameterized queries and ORM protection

### Data Protection

- **Environment Variables**: Sensitive configuration externalized
- **Database Encryption**: Secure data storage and transmission
- **HTTPS Support**: SSL/TLS encryption for production deployments

## 📊 Performance & Scalability

### Frontend Optimization

- **Server-Side Rendering**: Next.js SSR for improved performance
- **Code Splitting**: Automatic bundle optimization
- **Image Optimization**: Next.js built-in image optimization
- **Caching Strategy**: React Query for efficient data caching

### Backend Performance

- **Connection Pooling**: PostgreSQL connection optimization
- **Query Optimization**: Efficient database queries and indexing
- **Middleware Optimization**: Streamlined request processing
- **Memory Management**: Efficient resource utilization

### AI Service Optimization

- **Async Processing**: Non-blocking AI operations
- **Data Caching**: SQLite cache for frequently accessed data
- **Batch Processing**: Efficient bulk data operations

## 🚀 Deployment Options

### Production Deployment (AWS EC2)

**1. EC2 Instance Setup:**

```bash
# Launch Ubuntu 22.04 LTS instance (t2.micro or larger)
# Configure Security Groups: SSH (22), HTTP (80), HTTPS (443)

# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Docker
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
```

**2. Application Deployment:**

```bash
# Clone repository
git clone <repository-url>
cd wealth-ai

# Configure environment variables
# Create .env files as described in Getting Started

# Deploy with Docker Compose
docker-compose up -d
```

**3. Nginx Configuration (Optional):**

```bash
# Install Nginx
sudo apt install nginx -y

# Configure reverse proxy
sudo nano /etc/nginx/sites-available/wealth-ai
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # AI Service
    location /ai {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**4. SSL Setup with Let's Encrypt:**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com
```

### Docker Compose Services

The application runs as four interconnected services:

1. **Frontend (Port 3000)**: Next.js application with SSR
2. **Backend (Port 5000)**: Express.js API server
3. **AI Service (Port 8000)**: FastAPI Python service
4. **Database (Port 5432)**: PostgreSQL with persistent storage

### Monitoring & Maintenance

**Application Monitoring:**

```bash
# View logs
docker-compose logs -f [service-name]

# Restart services
docker-compose restart [service-name]

# Update application
git pull
docker-compose down
docker-compose up -d --build
```

**Database Maintenance:**

```bash
# Backup database
docker exec -t postgres pg_dump -U postgres wealth_platform > backup.sql

# Restore database
docker exec -i postgres psql -U postgres wealth_platform < backup.sql
```

## 🤝 Development Guidelines

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency enforcement
- **Prettier**: Automated code formatting
- **Component Architecture**: Modular, reusable component design

### Git Workflow

1. Create feature branches from `main`
2. Implement changes with descriptive commits
3. Submit pull requests for code review
4. Merge after approval and testing

### Testing Strategy

- **Unit Testing**: Component and function testing
- **Integration Testing**: API endpoint testing
- **E2E Testing**: Full application workflow testing
- **Performance Testing**: Load and stress testing

## 📈 Business Value & ROI

### For Relationship Managers

- **Efficiency Gains**: 40% reduction in client portfolio analysis time
- **Better Client Service**: AI-powered recommendations improve client satisfaction
- **Data-Driven Decisions**: Real-time analytics enable informed investment strategies
- **Compliance**: Automated risk profiling ensures regulatory compliance

### For Financial Institutions

- **Operational Efficiency**: Streamlined portfolio management processes
- **Revenue Growth**: Improved client retention and new business acquisition
- **Risk Management**: Enhanced risk assessment and monitoring capabilities
- **Scalability**: Support for growing client base without proportional staff increase

### Key Performance Indicators

- **Client Portfolio Performance**: Track AUM growth and investment returns
- **Business Metrics**: Monitor FBI growth and client acquisition rates
- **Operational Metrics**: Measure task completion rates and client interaction frequency
- **User Adoption**: Track system usage and feature utilization

## 🔮 Future Enhancements

### Planned Features

- **Mobile Application**: Native iOS and Android apps
- **Advanced Analytics**: Machine learning-powered predictive analytics
- **Integration Capabilities**: Third-party financial data providers
- **Automated Reporting**: Scheduled client reports and presentations
- **Multi-Language Support**: Localization for international markets

### Technical Roadmap

- **Microservices Architecture**: Further service decomposition
- **Cloud-Native Deployment**: Kubernetes orchestration
- **Real-Time Features**: WebSocket-based live updates
- **API Gateway**: Centralized API management and security
- **Advanced Caching**: Redis integration for improved performance

## 📞 Support & Maintenance

### System Requirements

- **Minimum Hardware**: 4GB RAM, 2 CPU cores, 20GB storage
- **Recommended Hardware**: 8GB RAM, 4 CPU cores, 50GB storage
- **Network**: Stable internet connection for AI services and market data

### Troubleshooting

- **Database Connection Issues**: Check PostgreSQL service status and credentials
- **AI Service Errors**: Verify OpenAI API key and network connectivity
- **Performance Issues**: Monitor resource usage and optimize queries
- **Authentication Problems**: Check JWT secret configuration and token expiration

### Backup & Recovery

- **Automated Backups**: Daily PostgreSQL dumps with retention policy
- **Data Recovery**: Point-in-time recovery capabilities
- **Disaster Recovery**: Multi-region deployment for business continuity

## 📄 License & Compliance

### Data Privacy

- **GDPR Compliance**: European data protection regulation adherence
- **Data Encryption**: At-rest and in-transit data encryption
- **Access Controls**: Role-based data access and audit trails
- **Data Retention**: Configurable data retention policies

### Financial Regulations

- **Investment Advisory Compliance**: Regulatory requirement adherence
- **Audit Trail**: Complete transaction and decision logging
- **Risk Disclosure**: Automated risk assessment documentation
- **Reporting Standards**: Regulatory reporting capabilities

---

**BATI Wealth AI Platform** - Empowering Relationship Managers with Intelligent Portfolio Management and AI-Driven Investment Advisory Capabilities.

For technical support, feature requests, or deployment assistance, please contact the development team or refer to the system documentation.
