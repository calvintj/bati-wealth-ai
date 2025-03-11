// src/server.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express with TypeScript!");
});

// Import routes
import authRoutes from "./routes/auth";
import overviewRoutes from "./routes/overview";
import customerListRoutes from "./routes/customer-list";
import customerDetailsRoutes from "./routes/customer-details";
import taskManagerRoutes from "./routes/task-manager";

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/overview", overviewRoutes);
app.use("/api/customer-list", customerListRoutes);
app.use("/api/customer-details", customerDetailsRoutes);
app.use("/api/task-manager", taskManagerRoutes);

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
