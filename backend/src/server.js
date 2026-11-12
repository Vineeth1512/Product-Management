import dotenv from "dotenv";

// Load environment variables from .env file immediately
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas and start server
const startServer = async () => {
  try {
    // 1. Establish database connection
    await connectDB();

    // 2. Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`[Server] Server is running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
      console.log(`[Server] Health check endpoint: http://localhost:${PORT}/api/v1/health`);
    });

    // Handle Unhandled Promise Rejections (e.g. Async DB errors after startup)
    process.on("unhandledRejection", (err) => {
      console.error(`[Server Error] Unhandled Rejection: ${err.message}`);
      // Graceful shutdown
      server.close(() => process.exit(1));
    });

    // Handle Uncaught Exceptions (e.g. Synchronous runtime bugs)
    process.on("uncaughtException", (err) => {
      console.error(`[Server Error] Uncaught Exception: ${err.message}`);
      process.exit(1);
    });

    // Handle Graceful Termination signals (e.g. Docker, Render, Ctrl+C)
    const gracefulShutdown = () => {
      console.log("[Server] Received termination signal. Closing server gracefully...");
      server.close(() => {
        console.log("[Server] Closed remaining connections. Exiting process.");
        process.exit(0);
      });
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);

  } catch (error) {
    console.error(`[Server Error] Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

