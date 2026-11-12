import mongoose from "mongoose";
import ApiResponse from "../utils/apiResponse.js";

/**
 * @desc    Health Check API to verify server and database status
 * @route   GET /api/v1/health
 * @access  Public
 */
export const checkHealth = (req, res) => {
  const dbStatusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  const dbState = mongoose.connection.readyState;

  const healthData = {
    server: "UP",
    database: dbStatusMap[dbState] || "unknown",
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
    environment: process.env.NODE_ENV || "development"
  };

  return res
    .status(200)
    .json(new ApiResponse(200, healthData, "System is running healthy"));
};

