// src/server.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import cookieParser from "cookie-parser";

// Import routes
import authRoutes from "./routes/auth";
import overviewRoutes from "./routes/overview";
import customerListRoutes from "./routes/customer-list";
import customerDetailsRoutes from "./routes/customer-details";
import taskManagerRoutes from "./routes/task-manager";
import marketIndicesRoutes from "./routes/market-indices";
import dashboardTargetsRoutes from "./routes/dashboard-targets";
import economicIndicatorsRoutes from "./routes/economic-indicators";
import marketNewsRoutes from "./routes/market-news";

dotenv.config();

const app = express();
const port = process.env.PORT;

// Trust only first proxy in the chain - more secure than trusting all proxies
// Only trusts the immediate proxy (nginx in this case)
app.set("trust proxy", 1);

// CORS Configuration - Moving this up before other middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
      "Accept",
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Handle OPTIONS method for preflight requests
app.options("*", cors());

// Request timeout
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setTimeout(30000, () => {
    res.status(408).send("Request Timeout");
  });
  next();
});

// 1. Basic Security Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: true,
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true,
  })
);

// 2. Rate Limiting - Prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Use a more specific IP extraction method that works with proxies
  keyGenerator: (req) => {
    // Get IP from X-Forwarded-For (first value in the header)
    const xForwardedFor = req.get("X-Forwarded-For");
    // Make sure we always return a string value, never undefined
    return xForwardedFor
      ? xForwardedFor.split(",")[0].trim()
      : req.ip || "unknown-ip";
  },
  // Skip validation errors to prevent app from crashing
  validate: {
    trustProxy: false,
    xForwardedForHeader: false,
  },
});
app.use(limiter);

// 3. Data Sanitization against NoSQL Injection
app.use(mongoSanitize());

// 4. Prevent Parameter Pollution
app.use(hpp());

// 5. Secure Cookie Settings
app.use(cookieParser());

// Middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/overview", overviewRoutes);
app.use("/api/customer-list", customerListRoutes);
app.use("/api/customer-details", customerDetailsRoutes);
app.use("/api/task-manager", taskManagerRoutes);
app.use("/api/market-indices", marketIndicesRoutes);
app.use("/api/dashboard-targets", dashboardTargetsRoutes);
app.use("/api/economic-indicators", economicIndicatorsRoutes);
app.use("/api/market-news", marketNewsRoutes);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "healthy" });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Resource not found" });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
