import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Middleware to verify JWT and authenticate user
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization Bearer header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2. Alternatively check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // If token is missing
  if (!token) {
    throw new ApiError(401, "Authentication token missing. Please log in.");
  }

  try {
    // 3. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Check if user still exists in database
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, "User belonging to this token no longer exists.");
    }

    // 5. Attach user document to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired. Please log in again.");
    }
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token. Please log in again.");
    }
    throw error;
  }
});

/**
 * Middleware factory for Role-Based Access Control (RBAC)
 * @param  {...string} roles - Allowed roles (e.g. 'admin', 'user')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Forbidden: Role '${req.user?.role || "unknown"}' does not have permission to access this resource`
      );
    }
    next();
  };
};

