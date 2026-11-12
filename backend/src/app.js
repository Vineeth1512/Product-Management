import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import apiRoutes from "./routes/index.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);

// Logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Body Parsing Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Root Route (Quick verification)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Product Management System API is running."
  });
});

// API Routes
app.use("/api/v1", apiRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;

