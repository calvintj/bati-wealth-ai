# 4.4 Implementasi

Bagian ini memaparkan hasil implementasi sistem BATI Wealth AI Platform berdasarkan perancangan pada Bab 3. Proses implementasi mencakup pembuatan antarmuka pengguna (UI), integrasi backend REST API, layanan AI berbasis FastAPI, serta database PostgreSQL. Dokumentasi ini juga menyertakan bukti visual berupa screenshot tampilan aplikasi yang telah berjalan.

---

## 4.4.1 Spesifikasi yang Digunakan

### 1. Perangkat Keras

- **Processor:** Intel Core i5/i7 Gen 10+ atau AMD Ryzen 5/7 setara
- **RAM:** Minimum 16 GB (disarankan 32 GB untuk development)
- **Storage:** SSD 512 GB atau lebih
- **OS:** Windows 11 / macOS 12+ / Linux Ubuntu 20.04+
- **Network:** Koneksi internet stabil untuk mengakses OpenAI API dan Trading Economics API

Spesifikasi ini memadai untuk menjalankan Docker, Next.js, Node.js, dan FastAPI secara simultan tanpa performa yang menurun.

### 2. Perangkat Lunak

#### Frontend Stack:

- **Next.js 15.2.1** - Framework React untuk server-side rendering dan static generation
- **TypeScript 5.x** - Type-safe JavaScript untuk mengurangi error
- **Tailwind CSS 3.x** - Utility-first CSS framework untuk styling
- **Shadcn/UI** - Komponen UI yang dapat dikustomisasi
- **React Query (TanStack Query)** - State management dan data fetching
- **React Hook Form** - Form handling yang performant
- **Zod** - Schema validation untuk TypeScript

#### Backend Stack:

- **Node.js 20.x** - Runtime JavaScript di server
- **Express.js 4.x** - Web framework untuk REST API
- **PostgreSQL 13** - Database relasional
- **JWT (jsonwebtoken)** - Autentikasi berbasis token
- **bcrypt** - Hashing password untuk keamanan

#### AI Service Stack:

- **FastAPI** - Framework Python modern untuk API
- **OpenAI API (GPT-4o)** - Model AI untuk analisis dan rekomendasi
- **Pandas** - Data manipulation dan analysis
- **SQLAlchemy** - ORM untuk database operations
- **psycopg2** - PostgreSQL adapter untuk Python

#### Infrastructure:

- **Docker & Docker Compose** - Containerization dan orchestration
- **Nginx** - Reverse proxy untuk production
- **Git** - Version control

---

## 4.4.2 Arsitektur Sistem

### A. Struktur Folder Proyek

Sistem BATI Wealth AI Platform menggunakan arsitektur microservices dengan pemisahan yang jelas antara frontend, backend, dan AI service. Struktur folder utama adalah sebagai berikut:

```
wealth-ai/
├── client/                    # Next.js Frontend Application
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   │   ├── admin/        # Admin panel page
│   │   │   ├── chatbot/      # AI chatbot interface
│   │   │   ├── customer-details/  # Customer detail page
│   │   │   ├── customer-mapping/  # Customer segmentation
│   │   │   ├── dashboard-overview/ # Main dashboard
│   │   │   ├── recommendation-centre/ # Recommendation page
│   │   │   ├── market-indices/    # Market data page
│   │   │   └── market-news/       # News page
│   │   ├── components/       # Reusable React components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── chatbot/      # Chatbot UI components
│   │   │   ├── customer-details/  # Customer detail components
│   │   │   ├── dashboard-overview/ # Dashboard components
│   │   │   ├── ui/           # Shadcn UI components
│   │   │   └── shared/       # Shared components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API service functions
│   │   ├── types/            # TypeScript type definitions
│   │   ├── lib/              # Utility functions
│   │   └── stores/            # State management (Zustand)
│   ├── public/               # Static assets
│   ├── Dockerfile            # Frontend container config
│   └── package.json          # Frontend dependencies
│
├── server/                   # Express.js Backend API
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   │   └── db.ts         # Database connection
│   │   ├── controllers/       # Request handlers
│   │   │   ├── auth.ts       # Authentication controller
│   │   │   ├── overview.ts   # Dashboard controller
│   │   │   ├── customer-details.ts  # Customer detail controller
│   │   │   ├── customer-list.ts     # Customer list controller
│   │   │   └── task-manager.ts      # Task management controller
│   │   ├── routes/            # API route definitions
│   │   ├── models/            # Database query models
│   │   │   ├── customer-details.ts
│   │   │   ├── customer-mapping.ts
│   │   │   ├── dashboard-overview.ts
│   │   │   ├── recommendation-centre.ts
│   │   │   └── rm-account.ts
│   │   ├── middleware/       # Express middleware
│   │   │   └── auth.ts       # JWT authentication middleware
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Utility functions
│   │   └── server.ts          # Express app entry point
│   ├── db-data/              # Database initialization scripts
│   ├── Dockerfile            # Backend container config
│   └── package.json          # Backend dependencies
│
├── fastapi/                  # AI Service (Python)
│   ├── data/                 # Data files (CSV, Excel)
│   │   ├── historical_transaction_usd.csv
│   │   ├── Master_Data_for_RM_Tableau_usd.csv
│   │   ├── optimized_allocation_usd.csv
│   │   └── Mutual_Fund_Data.xlsx
│   ├── main.py               # FastAPI app entry point
│   ├── functions.py           # AI analysis functions
│   ├── tools.py               # OpenAI function calling definitions
│   ├── data.py                # Data loading utilities
│   ├── optimize.py            # Portfolio optimization logic
│   ├── setup.py               # Configuration and initialization
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile             # FastAPI container config
│
├── nginx/                     # Nginx configuration
│   └── wealthplatform.conf    # Reverse proxy config
│
├── docker-compose.yml         # Multi-container orchestration
└── README.md                  # Project documentation
```

### B. Arsitektur Komunikasi

Sistem menggunakan arsitektur client-server dengan tiga layer utama:

1. **Frontend Layer (Next.js)**

   - Berjalan di port 3000
   - Menggunakan React Server Components dan Client Components
   - Komunikasi dengan backend via REST API
   - Komunikasi dengan AI service via REST API

2. **Backend Layer (Express.js)**

   - Berjalan di port 5000
   - Menyediakan REST API untuk data nasabah, transaksi, dan portfolio
   - Menggunakan JWT untuk autentikasi
   - Terhubung langsung ke PostgreSQL database

3. **AI Service Layer (FastAPI)**

   - Berjalan di port 8000
   - Menyediakan endpoint untuk chatbot AI
   - Menggunakan OpenAI GPT-4o untuk analisis
   - Terhubung ke PostgreSQL untuk membaca data

4. **Database Layer (PostgreSQL)**
   - Berjalan di port 5432
   - Menyimpan semua data nasabah, transaksi, dan portfolio
   - Menggunakan schema relasional dengan foreign keys

**Diagram Arsitektur:**

```
┌─────────────┐
│   Browser    │
│  (Port 3000) │
└──────┬───────┘
       │ HTTP/HTTPS
       │
┌──────▼──────────────────────────────────────┐
│         Nginx (Reverse Proxy)                │
│  - Routes requests to appropriate service    │
│  - SSL termination                          │
└──────┬──────────────────────────────────────┘
       │
       ├──────────────┬───────────────────────┐
       │              │                       │
┌──────▼──────┐  ┌────▼──────┐        ┌──────▼──────┐
│   Client    │  │  Server   │        │   FastAPI   │
│  (Next.js)  │  │ (Express) │        │  (AI Service)│
│  Port 3000  │  │ Port 5000 │        │  Port 8000  │
└─────────────┘  └─────┬─────┘        └──────┬─────┘
                       │                      │
                       │                      │
                       └──────────┬───────────┘
                                  │
                          ┌───────▼────────┐
                          │   PostgreSQL   │
                          │   Port 5432    │
                          └────────────────┘
```

---

## 4.4.3 Dokumentasi Program

### A. Implementasi Antarmuka Pengguna (UI)

Sistem menggunakan Next.js 15 dengan App Router untuk membangun antarmuka pengguna yang modern dan responsif. Berikut adalah dokumentasi setiap halaman utama:

---

#### 1. Halaman Login

**Lokasi File:** `client/src/app/page.tsx`

**Penjelasan:**

Halaman login merupakan entry point sistem. RM (Relationship Manager) melakukan autentikasi menggunakan email dan password. Sistem memvalidasi kredensial melalui backend API dan mengembalikan JWT token yang disimpan di localStorage untuk sesi berikutnya.

**Fitur:**

- Form login dengan validasi email dan password
- Dark mode toggle (terintegrasi dengan next-themes)
- Responsive design untuk mobile dan desktop
- Error handling untuk kredensial yang salah
- Loading state saat proses autentikasi

**Komponen Utama:**

- `LoginForm` - Form component dengan validasi menggunakan React Hook Form dan Zod
- `ColorModeToggle` - Toggle untuk dark/light mode

**Flow Autentikasi:**

1. User memasukkan email dan password
2. Frontend mengirim POST request ke `/api/auth/login`
3. Backend memverifikasi kredensial di database `rm_account`
4. Jika valid, backend mengembalikan JWT token
5. Frontend menyimpan token dan redirect ke dashboard

**Screenshot:**
_(Tempel screenshot halaman login di sini - Gambar 4.1)_

**Kode Implementasi:**

```typescript
// client/src/components/login/login-form.tsx
// Form menggunakan React Hook Form dengan validasi Zod
// Menggunakan custom hook useLogin untuk API call
```

---

#### 2. Dashboard Overview

**Lokasi File:** `client/src/app/dashboard-overview/page.tsx`

**Penjelasan:**

Dashboard Overview adalah halaman utama setelah login. Halaman ini menampilkan ringkasan performa portfolio nasabah yang dikelola oleh RM, termasuk metrik AUM (Assets Under Management), FUM (Funds Under Management), dan FBI (Foreign Bank Investment).

**Fitur yang Ditampilkan:**

1. **Total Customers Card**

   - Total semua nasabah
   - Breakdown berdasarkan risk profile (Conservative, Balanced, Moderate, Growth, Aggressive)
   - Visualisasi dengan pie chart atau bar chart

2. **AUM Metrics**

   - Total AUM keseluruhan
   - AUM per risk profile
   - Perbandingan dengan periode sebelumnya

3. **FUM Metrics**

   - Total FUM (CASA + Deposito)
   - Breakdown per risk profile
   - Trend kuartalan

4. **FBI Metrics**

   - Total Foreign Bank Investment
   - Breakdown per risk profile
   - Komponen: FBI_RD + FBI_SB + FBI_BAC

5. **Quarterly Performance Charts**

   - Grafik line chart untuk FUM dan FBI
   - Data 6 kuartal terakhir
   - Breakdown per risk profile

6. **Top Products Table**

   - 5 produk teratas berdasarkan total amount
   - Breakdown per risk profile
   - Data dari `historical_transaction`

7. **Customer List Table**
   - Daftar nasabah dengan filter
   - Kolom: Customer ID, Risk Profile, AUM Label, Propensity, dll
   - Sortable dan searchable

**Komponen Utama:**

- `TotalCustomerCard` - Card untuk total customers
- `AUMCard` - Card untuk AUM metrics
- `FUMCard` - Card untuk FUM metrics
- `FBICard` - Card untuk FBI metrics
- `QuarterlyChart` - Chart untuk trend kuartalan
- `TopProductsTable` - Tabel produk teratas
- `CustomerListTable` - Tabel daftar nasabah

**API Endpoints yang Digunakan:**

- `GET /api/overview/total-customer` - Total customers
- `GET /api/overview/total-aum` - Total AUM
- `GET /api/overview/total-fbi` - Total FBI
- `GET /api/overview/quarterly-fum` - Quarterly FUM data
- `GET /api/overview/quarterly-fbi` - Quarterly FBI data
- `GET /api/overview/top-products` - Top products
- `GET /api/customer-list` - Customer list

**Screenshot:**
_(Tempel screenshot dashboard overview di sini - Gambar 4.2)_

**Screenshot Detail Cards:**
_(Tempel screenshot detail cards AUM/FUM/FBI - Gambar 4.3)_

**Screenshot Charts:**
_(Tempel screenshot quarterly charts - Gambar 4.4)_

---

#### 3. AI Chatbot

**Lokasi File:** `client/src/app/chatbot/page.tsx`

**Penjelasan:**

AI Chatbot adalah fitur utama sistem yang menggunakan OpenAI GPT-4o untuk memberikan analisis dan rekomendasi portfolio. Chatbot dapat menjawab pertanyaan tentang profil nasabah, performa portfolio, rekomendasi produk, dan optimasi alokasi aset.

**Fitur:**

1. **Function Calling**

   - `present_customer_profile` - Menampilkan profil nasabah
   - `previous_period_performance` - Analisis performa periode sebelumnya
   - `present_optimized_portfolio` - Portfolio yang dioptimasi
   - `present_historical_transaction` - Riwayat transaksi
   - `present_recommended_products` - Rekomendasi produk
   - `get_new_allocation` - Rekomendasi alokasi baru
   - `filter_customers_region` - Filter nasabah berdasarkan region
   - `generate_sql_syntax` - Generate SQL query untuk analisis custom

2. **Multi-language Support**

   - Bahasa Indonesia (default)
   - Bahasa Inggris
   - Dapat diubah melalui parameter request

3. **Context Awareness**

   - Chatbot mengingat konteks percakapan
   - Dapat mengakses data real-time dari database
   - Memberikan follow-up questions

4. **Streaming Response**
   - Response ditampilkan secara streaming untuk UX yang lebih baik
   - Loading indicator saat AI sedang memproses

**Komponen Utama:**

- `ChatInterface` - Main chat UI component
- `MessageList` - List of chat messages
- `MessageInput` - Input field untuk user
- `FunctionCallIndicator` - Indicator saat AI memanggil function

**Flow Interaksi:**

1. User mengetik pertanyaan di chat input
2. Frontend mengirim POST request ke FastAPI `/api_chat`
3. FastAPI menggunakan OpenAI API dengan function calling
4. AI menentukan function yang perlu dipanggil
5. Function dijalankan dan mengembalikan data
6. Data dikirim kembali ke OpenAI untuk generate response
7. Response dikirim ke frontend secara streaming
8. Frontend menampilkan response di chat interface

**API Endpoint:**

- `POST http://localhost:8000/api_chat`
- Request body: `{ query: string, language: string, customer_id?: string }`
- Response: Streaming text response

**Screenshot:**
_(Tempel screenshot AI chatbot interface - Gambar 4.5)_

**Screenshot Function Calling:**
_(Tempel screenshot saat AI memanggil function - Gambar 4.6)_

**Screenshot Response dengan Data:**
_(Tempel screenshot response AI dengan data portfolio - Gambar 4.7)_

**Contoh Percakapan:**

**User:** "Tunjukkan profil nasabah dengan ID 12345"

**AI:** "Baik, saya akan menampilkan profil nasabah dengan ID 12345..."
_[AI memanggil function present_customer_profile]_
"Berikut adalah profil nasabah dengan ID 12345:

- Risk Profile: 3 - Moderate
- AUM: $500,000
- Usia: 45 tahun
- Annual Income: $100,000
  ..."

---

#### 4. Customer Details

**Lokasi File:** `client/src/app/customer-details/page.tsx`

**Penjelasan:**

Halaman Customer Details menampilkan informasi lengkap tentang seorang nasabah, termasuk profil risiko, portfolio saat ini, portfolio yang dioptimasi, riwayat transaksi, dan rekomendasi produk.

**Fitur yang Ditampilkan:**

1. **Customer Profile Section**

   - Customer ID
   - Risk Profile
   - AUM Label
   - Propensity
   - Priority/Private status
   - Customer Type
   - Demografi: Pekerjaan, Status Nikah, Usia
   - Annual Income
   - Vintage (tahun sejak join)

2. **Portfolio Metrics**

   - Total FUM (Funds Under Management)
   - Total AUM (Assets Under Management)
   - Total FBI (Foreign Bank Investment)

3. **Current Portfolio Allocation**

   - CASA (Current Account Savings Account)
   - Deposito
   - RD (Risk Diversification)
   - SB (Savings Balance)
   - BAC (Balance at Account)
   - Visualisasi dengan pie chart atau bar chart

4. **Optimized Portfolio**

   - Recommended allocation per asset type
   - USD allocation
   - Comparison dengan current allocation
   - Expected return vs current expected return

5. **Quarterly Performance**

   - Grafik AUM per kuartal (4 kuartal terakhir)
   - Grafik FUM per kuartal
   - Trend analysis

6. **Owned Products**

   - Daftar produk yang dimiliki nasabah
   - Informasi: Nama Produk, Jumlah Transaksi, Amount, Price Bought, Profit, Return Value
   - Sortable table

7. **Recommendation Products**

   - Rekomendasi produk berdasarkan risk profile
   - Offer product risk (1-5)
   - Reprofile risk target
   - Data dari `customer_segmentation_offer`

8. **Customer Activities**
   - Log aktivitas nasabah
   - CRUD operations (Create, Read, Update, Delete)
   - Fields: Title, Description, Date

**Komponen Utama:**

- `CustomerProfileCard` - Card untuk profil nasabah
- `PortfolioMetrics` - Metrics untuk FUM/AUM/FBI
- `CurrentPortfolio` - Current allocation visualization
- `OptimizedPortfolio` - Optimized allocation visualization
- `QuarterlyCharts` - Charts untuk trend kuartalan
- `OwnedProductsTable` - Tabel produk yang dimiliki
- `RecommendationProducts` - Rekomendasi produk
- `ActivityLog` - Activity log dengan CRUD

**API Endpoints:**

- `GET /api/customer-details/customer-details?rm_number=xxx&customerID=xxx`
- `GET /api/customer-details/customer-portfolio`
- `GET /api/customer-details/optimized-portfolio`
- `GET /api/customer-details/return-percentage`
- `GET /api/customer-details/owned-product`
- `GET /api/customer-details/recommendation-product`
- `GET /api/customer-details/quarterly-aum`
- `GET /api/customer-details/quarterly-fum`
- `GET /api/customer-details/activity` - Get activities
- `POST /api/customer-details/activity` - Create activity
- `PUT /api/customer-details/activity` - Update activity
- `DELETE /api/customer-details/activity` - Delete activity

**Screenshot:**
_(Tempel screenshot halaman customer details lengkap - Gambar 4.8)_

**Screenshot Portfolio Comparison:**
_(Tempel screenshot perbandingan current vs optimized portfolio - Gambar 4.9)_

**Screenshot Recommendation Products:**
_(Tempel screenshot rekomendasi produk - Gambar 4.10)_

---

#### 5. Customer Mapping

**Lokasi File:** `client/src/app/customer-mapping/page.tsx`

**Penjelasan:**

Customer Mapping adalah halaman untuk segmentasi dan analisis nasabah menggunakan berbagai dimensi seperti risk profile, propensity, dan AUM label. Halaman ini membantu RM untuk memahami distribusi nasabah mereka.

**Fitur:**

1. **Multi-dimensional Filtering**

   - Filter berdasarkan Propensity
   - Filter berdasarkan AUM Label
   - Filter berdasarkan Risk Profile
   - Kombinasi multiple filters

2. **Visualization**

   - Stacked bar chart untuk distribusi nasabah
   - Breakdown per risk profile
   - Breakdown per propensity
   - Breakdown per AUM label

3. **Customer List Table**
   - Daftar nasabah dengan filter yang diterapkan
   - Kolom: Customer ID, Risk Profile, AUM Label, Propensity, Customer Type, dll
   - Total metrics: Total FUM, Total AUM, Total FBI

**Komponen Utama:**

- `FilterSection` - Section untuk filter controls
- `VisualizationChart` - Chart untuk visualisasi
- `CustomerMappingTable` - Tabel daftar nasabah

**API Endpoints:**

- `GET /api/customer-list?rm_number=xxx` - Get all customers
- `GET /api/customer-list/certain?rm_number=xxx&propensity=xxx&aum=xxx` - Get filtered customers

**Screenshot:**
_(Tempel screenshot customer mapping dengan filters - Gambar 4.11)_

**Screenshot Visualization:**
_(Tempel screenshot chart visualization - Gambar 4.12)_

---

#### 6. Recommendation Centre

**Lokasi File:** `client/src/app/recommendation-centre/page.tsx`

**Penjelasan:**

Recommendation Centre adalah halaman yang menampilkan berbagai rekomendasi dan task management untuk RM. Halaman ini membantu RM untuk mengelola tugas mereka dan melihat peluang transaksi.

**Fitur:**

1. **Managed Numbers**

   - Total customers yang dikelola
   - Total AUM
   - Total FBI
   - Summary metrics

2. **Increased Numbers**

   - Perbandingan kuartal saat ini vs kuartal sebelumnya
   - Growth metrics untuk customers, AUM, dan FBI

3. **Portfolio Summary**

   - Breakdown portfolio: CASA, SB, Deposito, RD
   - Total per kategori

4. **Last Transaction**

   - 5 transaksi terakhir
   - Informasi: Customer ID, Transaction ID, Amount

5. **Potential Transaction**

   - Daftar potensi transaksi berdasarkan profit
   - Informasi: Customer ID, Product Name, Profit
   - Sorted by transaction_id DESC

6. **Offer Product Risk**

   - Rekomendasi produk berdasarkan risk profile
   - Data dari `customer_segmentation_offer`
   - Breakdown per risk level (1-5)

7. **Reprofile Risk Target**

   - Rekomendasi untuk reprofiling nasabah
   - Target risk profile baru
   - Filter: hanya yang offer_reprofile_risk_target != '0'

8. **Task Manager**
   - CRUD operations untuk tasks
   - Fields: Description, Due Date, Invitee
   - Filter by RM number

**Komponen Utama:**

- `ManagedNumbersCard` - Card untuk managed numbers
- `IncreasedNumbersCard` - Card untuk growth metrics
- `PortfolioSummaryCard` - Card untuk portfolio summary
- `LastTransactionTable` - Tabel transaksi terakhir
- `PotentialTransactionTable` - Tabel potensi transaksi
- `OfferProductRiskTable` - Tabel offer product risk
- `ReprofileRiskTargetTable` - Tabel reprofile recommendations
- `TaskManager` - Task management dengan CRUD

**API Endpoints:**

- `GET /api/task-manager/managed-number`
- `GET /api/task-manager/increased-number`
- `GET /api/task-manager/portfolio`
- `GET /api/task-manager/last-transaction`
- `GET /api/task-manager/potential-transaction`
- `GET /api/task-manager/offer-product-risk`
- `GET /api/task-manager/reprofile-risk-target`
- `GET /api/task-manager/task` - Get tasks
- `POST /api/task-manager/task` - Create task
- `PUT /api/task-manager/task` - Update task
- `DELETE /api/task-manager/task` - Delete task

**Screenshot:**
_(Tempel screenshot recommendation centre lengkap - Gambar 4.13)_

**Screenshot Task Manager:**
_(Tempel screenshot task manager dengan CRUD - Gambar 4.14)_

---

#### 7. Market Indices & Market News

**Lokasi File:**

- `client/src/app/market-indices/page.tsx`
- `client/src/app/market-news/page.tsx`

**Penjelasan:**

Halaman Market Indices menampilkan data pasar real-time menggunakan Trading Economics API. Halaman Market News menampilkan berita pasar terkini.

**Fitur Market Indices:**

1. **Indices Display**

   - S&P 500 (SPX)
   - NASDAQ (NDX)
   - Dow Jones (DJI)
   - LQ45 (Indonesia)
   - Composite Index (Indonesia)

2. **Real-time Data**

   - Current value
   - Change percentage
   - Change amount
   - Last update time

3. **Visualization**
   - Line chart untuk trend
   - Color coding untuk positive/negative change

**Fitur Market News:**

1. **News Feed**
   - Latest market news
   - Filter by category
   - Search functionality

**API Integration:**

- Trading Economics API untuk market data
- External news API untuk market news

**Screenshot:**
_(Tempel screenshot market indices - Gambar 4.15)_

**Screenshot Market News:**
_(Tempel screenshot market news - Gambar 4.16)_

---

#### 8. Admin Panel

**Lokasi File:** `client/src/app/admin/page.tsx`

**Penjelasan:**

Admin Panel adalah halaman khusus untuk administrator sistem. Halaman ini memungkinkan admin untuk mengelola user RM, reset password, dan monitoring aktivitas sistem.

**Fitur:**

1. **User Management**

   - Create new RM user
   - Update user information
   - Delete user
   - List all users

2. **Password Management**

   - Reset password user
   - Update password sendiri

3. **Activity Monitoring**
   - View system logs
   - Monitor user activities

**Komponen Utama:**

- `UserListTable` - Tabel daftar users
- `CreateUserForm` - Form untuk create user
- `UpdateUserForm` - Form untuk update user
- `ResetPasswordForm` - Form untuk reset password

**API Endpoints:**

- `GET /api/auth/users` - Get all users
- `POST /api/auth/register` - Create user
- `PUT /api/auth/update-user/:rm_number` - Update user
- `DELETE /api/auth/delete-user/:rm_number` - Delete user
- `PUT /api/auth/update-password` - Update password

**Screenshot:**
_(Tempel screenshot admin panel - Gambar 4.17)_

---

### B. Implementasi Backend

Backend Express.js menyediakan REST API untuk semua operasi data. Berikut adalah dokumentasi implementasi backend:

#### 1. Struktur Backend

```
server/src/
├── config/
│   └── db.ts                 # PostgreSQL connection
├── controllers/              # Request handlers
│   ├── auth.ts              # Authentication logic
│   ├── overview.ts          # Dashboard data
│   ├── customer-details.ts  # Customer detail data
│   ├── customer-list.ts     # Customer list data
│   └── task-manager.ts      # Task management
├── routes/                   # API route definitions
│   ├── auth.ts
│   ├── overview.ts
│   ├── customer-details.ts
│   ├── customer-list.ts
│   └── task-manager.ts
├── models/                   # Database query models
│   ├── customer-details.ts
│   ├── customer-mapping.ts
│   ├── dashboard-overview.ts
│   ├── recommendation-centre.ts
│   └── rm-account.ts
├── middleware/
│   └── auth.ts              # JWT authentication
├── types/                    # TypeScript types
├── utils/                    # Utility functions
└── server.ts                 # Express app entry point
```

#### 2. Database Connection

**File:** `server/src/config/db.ts`

```typescript
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;
```

#### 3. API Endpoints Documentation

##### Authentication Endpoints

| Method | Endpoint                           | Description     | Auth Required |
| ------ | ---------------------------------- | --------------- | ------------- |
| POST   | `/api/auth/login`                  | User login      | No            |
| POST   | `/api/auth/register`               | Create new user | Yes (Admin)   |
| GET    | `/api/auth/users`                  | Get all users   | Yes (Admin)   |
| PUT    | `/api/auth/update-user/:rm_number` | Update user     | Yes (Admin)   |
| DELETE | `/api/auth/delete-user/:rm_number` | Delete user     | Yes (Admin)   |
| PUT    | `/api/auth/update-password`        | Update password | Yes           |

**Contoh Request Login:**

```json
POST /api/auth/login
{
  "email": "rm@example.com",
  "password": "password123"
}
```

**Contoh Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "rm_number": "RM001",
    "email": "rm@example.com",
    "role": "user"
  }
}
```

##### Overview Endpoints

| Method | Endpoint                              | Description                         | Auth Required |
| ------ | ------------------------------------- | ----------------------------------- | ------------- |
| GET    | `/api/overview/total-customer`        | Get total customers by risk profile | Yes           |
| GET    | `/api/overview/total-aum`             | Get total AUM by risk profile       | Yes           |
| GET    | `/api/overview/total-fbi`             | Get total FBI by risk profile       | Yes           |
| GET    | `/api/overview/quarterly-fum`         | Get quarterly FUM data              | Yes           |
| GET    | `/api/overview/quarterly-fbi`         | Get quarterly FBI data              | Yes           |
| GET    | `/api/overview/top-products`          | Get top 5 products                  | Yes           |
| GET    | `/api/overview/certain-customer-list` | Get filtered customer list          | Yes           |

**Contoh Request:**

```json
GET /api/overview/total-customer?rm_number=RM001
```

**Contoh Response:**

```json
{
  "all": 150,
  "conservative": 30,
  "balanced": 40,
  "moderate": 50,
  "growth": 20,
  "aggressive": 10
}
```

##### Customer Details Endpoints

| Method | Endpoint                                       | Description             | Auth Required |
| ------ | ---------------------------------------------- | ----------------------- | ------------- |
| GET    | `/api/customer-details/customer-id-list`       | Get customer ID list    | Yes           |
| GET    | `/api/customer-details/customer-details`       | Get customer details    | Yes           |
| GET    | `/api/customer-details/customer-portfolio`     | Get current portfolio   | Yes           |
| GET    | `/api/customer-details/optimized-portfolio`    | Get optimized portfolio | Yes           |
| GET    | `/api/customer-details/return-percentage`      | Get return percentage   | Yes           |
| GET    | `/api/customer-details/owned-product`          | Get owned products      | Yes           |
| GET    | `/api/customer-details/recommendation-product` | Get recommendations     | Yes           |
| GET    | `/api/customer-details/quarterly-aum`          | Get quarterly AUM       | Yes           |
| GET    | `/api/customer-details/quarterly-fum`          | Get quarterly FUM       | Yes           |
| GET    | `/api/customer-details/activity`               | Get activities          | Yes           |
| POST   | `/api/customer-details/activity`               | Create activity         | Yes           |
| PUT    | `/api/customer-details/activity`               | Update activity         | Yes           |
| DELETE | `/api/customer-details/activity`               | Delete activity         | Yes           |

**Contoh Request:**

```json
GET /api/customer-details/customer-details?rm_number=RM001&customerID=12345
```

**Contoh Response:**

```json
{
  "ID": "12345",
  "Risk_Profile": "3 - Moderate",
  "AUM_Label": "High",
  "Propensity": "High",
  "Priority_Private": "Priority",
  "Customer_Type": "Individual",
  "Pekerjaan": "Business Owner",
  "Status_Nikah": "Married",
  "Usia": 45,
  "Annual_Income": 100000,
  "Vintage": 5,
  "Total_FUM": 200000,
  "Total_AUM": 500000,
  "Total_FBI": 100000
}
```

##### Task Manager Endpoints

| Method | Endpoint                                  | Description                | Auth Required |
| ------ | ----------------------------------------- | -------------------------- | ------------- |
| GET    | `/api/task-manager/managed-number`        | Get managed numbers        | Yes           |
| GET    | `/api/task-manager/increased-number`      | Get increased numbers      | Yes           |
| GET    | `/api/task-manager/portfolio`             | Get portfolio summary      | Yes           |
| GET    | `/api/task-manager/last-transaction`      | Get last transactions      | Yes           |
| GET    | `/api/task-manager/potential-transaction` | Get potential transactions | Yes           |
| GET    | `/api/task-manager/offer-product-risk`    | Get offer product risk     | Yes           |
| GET    | `/api/task-manager/reprofile-risk-target` | Get reprofile targets      | Yes           |
| GET    | `/api/task-manager/task`                  | Get tasks                  | Yes           |
| POST   | `/api/task-manager/task`                  | Create task                | Yes           |
| PUT    | `/api/task-manager/task`                  | Update task                | Yes           |
| DELETE | `/api/task-manager/task`                  | Delete task                | Yes           |

#### 4. Authentication Middleware

**File:** `server/src/middleware/auth.ts`

```typescript
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
```

#### 5. Security Features

Backend mengimplementasikan berbagai security measures:

1. **Helmet.js** - Security headers
2. **Rate Limiting** - Mencegah brute force attacks
3. **CORS** - Cross-Origin Resource Sharing configuration
4. **Data Sanitization** - Mencegah NoSQL injection
5. **HPP** - Mencegah HTTP Parameter Pollution
6. **JWT Authentication** - Token-based authentication
7. **bcrypt** - Password hashing

**Contoh Implementasi Security di server.ts:**

```typescript
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
});

// Helmet security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);
```

---

### C. Implementasi AI Service (FastAPI)

AI Service menggunakan FastAPI dan OpenAI GPT-4o untuk memberikan analisis dan rekomendasi portfolio.

#### 1. Struktur FastAPI Service

```
fastapi/
├── main.py              # FastAPI app entry point
├── functions.py         # AI analysis functions
├── tools.py             # OpenAI function calling definitions
├── data.py              # Data loading utilities
├── optimize.py          # Portfolio optimization logic
├── setup.py             # Configuration
└── requirements.txt     # Python dependencies
```

#### 2. Main FastAPI Application

**File:** `fastapi/main.py`

**Key Features:**

- OpenAI GPT-4o integration
- Function calling untuk akses database
- Streaming response untuk better UX
- Multi-language support
- Error handling

**System Instructions:**

```python
system_instructions = """
You are an expert financial advisor, providing a help for RM
in managing customer's portfolio with friendly and professional tone.
Position RM as 2nd person, and customer as 3rd person.
Do not just present the data, but also explain the data in detail
in a way that is easy to understand.
Always ask for follow-up questions after giving the answer.
"""
```

#### 3. Available Functions

| Function Name                              | Description                                       |
| ------------------------------------------ | ------------------------------------------------- |
| `present_customer_profile`                 | Menampilkan profil nasabah lengkap                |
| `previous_period_performance`              | Analisis performa periode sebelumnya              |
| `present_optimized_portfolio`              | Portfolio yang dioptimasi                         |
| `present_historical_transaction`           | Riwayat transaksi nasabah                         |
| `present_recommended_products`             | Rekomendasi produk berdasarkan risk profile       |
| `get_new_allocation`                       | Rekomendasi alokasi baru dengan structured output |
| `filter_customers_region`                  | Filter nasabah berdasarkan region                 |
| `generate_sql_syntax_product_data`         | Generate SQL untuk query product data             |
| `generate_sql_syntax_customer_transaction` | Generate SQL untuk query transaction              |

#### 4. API Endpoint

**Endpoint:** `POST /api_chat`

**Request Body:**

```json
{
  "query": "Tunjukkan profil nasabah dengan ID 12345",
  "language": "id",
  "customer_id": "12345"
}
```

**Response:**
Streaming text response dari OpenAI GPT-4o

**Flow:**

1. User mengirim query
2. FastAPI memanggil OpenAI API dengan function calling
3. AI menentukan function yang perlu dipanggil
4. Function dijalankan dan mengembalikan data
5. Data dikirim kembali ke OpenAI untuk generate response
6. Response dikirim ke client secara streaming

#### 5. Function Implementation Example

**File:** `fastapi/functions.py`

```python
def present_customer_profile(customer_id: str, language: str) -> str:
    """
    Menampilkan profil nasabah lengkap
    """
    # Query database untuk mendapatkan data nasabah
    query = f"""
    SELECT * FROM customer_info
    WHERE bp_number_wm_core = {customer_id}
    """
    # Process data dan generate prompt
    prompt = f"""
    Answer in {language}.
    Present the customer profile with ID {customer_id}:
    - Risk Profile: {risk_profile}
    - AUM: ${aum}
    - Age: {usia}
    ...
    """
    return prompt
```

---

### D. Implementasi Database

Database menggunakan PostgreSQL 13 dengan schema relasional. Berikut adalah dokumentasi tabel-tabel utama:

#### 1. Schema Database

**Tabel Utama:**

1. **customer_info** - Informasi nasabah
2. **current_allocation** - Alokasi portfolio saat ini
3. **historical_transaction** - Riwayat transaksi
4. **optimized_allocation** - Portfolio yang dioptimasi
5. **customer_segmentation_offer** - Rekomendasi produk
6. **customer_activity** - Log aktivitas nasabah
7. **rm_account** - Akun Relationship Manager
8. **rm_task_manager** - Task management

#### 2. Entity Relationship Diagram

_(Referensi ke ERD yang sudah diberikan sebelumnya)_

#### 3. Key Relationships

- `customer_info.bp_number_wm_core` → Primary key, referenced by:

  - `current_allocation.bp_number_wm_core`
  - `historical_transaction.bp_number_wm_core`
  - `optimized_allocation.bp_number_wm_core`
  - `customer_segmentation_offer.bp_number_wm_core`
  - `customer_activity.bp_number_wm_core`

- `customer_info.assigned_rm` → Foreign key to `rm_task_manager.rm_number`

- `rm_account.rm_number` → Foreign key to `rm_task_manager.rm_number`

#### 4. Database Queries Examples

**Contoh Query untuk Customer Details:**

```sql
SELECT
  ci.bp_number_wm_core AS "ID",
  ci.risk_profile AS "Risk_Profile",
  ci.aum_label AS "AUM_Label",
  SUM(ca.fum) AS "Total_FUM",
  SUM(ca.aum) AS "Total_AUM"
FROM customer_info ci
JOIN current_allocation ca ON ci.bp_number_wm_core = ca.bp_number_wm_core
WHERE ci.assigned_rm = $1 AND ci.bp_number_wm_core = $2
GROUP BY ci.bp_number_wm_core, ci.risk_profile, ci.aum_label;
```

**Contoh Query untuk Quarterly AUM:**

```sql
WITH latest_quarters AS (
  SELECT
    bp_number_wm_core,
    year,
    quarter,
    SUM(rd + sb + bac) AS total_aum
  FROM current_allocation
  WHERE bp_number_wm_core = $1
  GROUP BY bp_number_wm_core, year, quarter
  ORDER BY year DESC, quarter DESC
  LIMIT 4
)
SELECT * FROM latest_quarters
ORDER BY year ASC, quarter ASC;
```

---

### E. Deployment Sistem

Sistem di-deploy menggunakan Docker Compose untuk memudahkan deployment dan scaling.

#### 1. Docker Compose Configuration

**File:** `docker-compose.yml`

**Services:**

- **client** - Next.js frontend (Port 3000)
- **server** - Express.js backend (Port 5000)
- **fastapi** - AI service (Port 8000)
- **postgres** - PostgreSQL database (Port 5432)

**Network:**

- Semua services terhubung dalam network `app_net`

**Volumes:**

- `pgdata` - Persistent storage untuk PostgreSQL
- `./fastapi/data` - Data files untuk FastAPI

#### 2. Environment Variables

**Client (.env):**

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BASE_API_URL=http://localhost:8000
BATI_BACKEND_URL=http://localhost:8000
```

**Server (.env):**

```
DATABASE_URL=postgres://postgres:password@postgres:5432/wealth_platform
JWT_SECRET=your_secret_key
PORT=5000
```

**FastAPI (.env):**

```
DB_HOST=postgres
DB_PORT=5432
DB_NAME=wealth_platform
DB_USER=postgres
DB_PASSWORD=yourpassword
BATI_OPENAI_API_KEY=your_openai_key
```

#### 3. Running the System

**Development:**

```bash
docker-compose up --build
```

**Production:**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### 4. Nginx Configuration (Production)

**File:** `nginx/wealthplatform.conf`

Nginx berfungsi sebagai reverse proxy untuk:

- Route requests ke appropriate service
- SSL termination
- Load balancing (jika diperlukan)

---

## 4.4.4 Testing dan Validasi

### A. Functional Testing

Sistem telah diuji untuk memastikan semua fitur berfungsi dengan baik:

1. **Authentication Testing**

   - Login dengan kredensial valid
   - Login dengan kredensial invalid
   - Token validation
   - Session management

2. **Dashboard Testing**

   - Data loading
   - Chart rendering
   - Filter functionality
   - Real-time updates

3. **AI Chatbot Testing**

   - Function calling
   - Multi-language support
   - Error handling
   - Streaming response

4. **CRUD Operations Testing**
   - Create, Read, Update, Delete untuk activities
   - Create, Read, Update, Delete untuk tasks
   - Data validation

### B. Performance Testing

- Response time untuk API endpoints < 500ms
- Database query optimization
- Frontend rendering performance
- AI response time < 5 seconds

### C. Security Testing

- JWT token validation
- SQL injection prevention
- XSS prevention
- CSRF protection
- Rate limiting

---

## 4.4.5 Kesimpulan Implementasi

Sistem BATI Wealth AI Platform telah berhasil diimplementasikan dengan fitur-fitur berikut:

1. ✅ **Frontend** - Next.js dengan UI yang modern dan responsif
2. ✅ **Backend** - Express.js dengan REST API yang secure
3. ✅ **AI Service** - FastAPI dengan OpenAI GPT-4o integration
4. ✅ **Database** - PostgreSQL dengan schema yang terstruktur
5. ✅ **Deployment** - Docker Compose untuk easy deployment
6. ✅ **Security** - Multiple security layers
7. ✅ **Documentation** - Comprehensive documentation

Sistem siap untuk digunakan oleh Relationship Managers dalam mengelola portfolio nasabah mereka.

---

**Catatan untuk Screenshot:**

Screenshot yang diperlukan:

1. Gambar 4.1 - Halaman Login
2. Gambar 4.2 - Dashboard Overview (full page)
3. Gambar 4.3 - Detail Cards (AUM/FUM/FBI)
4. Gambar 4.4 - Quarterly Charts
5. Gambar 4.5 - AI Chatbot Interface
6. Gambar 4.6 - Function Calling Indicator
7. Gambar 4.7 - AI Response dengan Data
8. Gambar 4.8 - Customer Details (full page)
9. Gambar 4.9 - Portfolio Comparison
10. Gambar 4.10 - Recommendation Products
11. Gambar 4.11 - Customer Mapping dengan Filters
12. Gambar 4.12 - Visualization Charts
13. Gambar 4.13 - Recommendation Centre
14. Gambar 4.14 - Task Manager
15. Gambar 4.15 - Market Indices
16. Gambar 4.16 - Market News
17. Gambar 4.17 - Admin Panel

Setiap screenshot harus disertai dengan caption yang menjelaskan fitur yang ditampilkan.

---

**End of Documentation**
