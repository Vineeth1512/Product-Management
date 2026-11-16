import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Helper function to create JWT, set secure cookie, and return standard response
 */
const sendTokenResponse = (user, statusCode, res, message) => {
  // Generate token using User instance method
  const token = user.generateToken();

  // Configure cookie options
  const cookieExpiresDays = parseInt(process.env.COOKIE_EXPIRES_IN, 10) || 7;
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000),
    httpOnly: true, // Prevents client-side JavaScript from reading the cookie (protects against XSS)
    secure: isProduction, // Must be true when sameSite is 'none' (HTTPS required)
    sameSite: isProduction ? "none" : "lax" // 'none' enables cross-site cookies between Vercel & Render
  };

  return res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json(
      new ApiResponse(
        statusCode,
        {
          user,
          token
        },
        message
      )
    );
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // 1. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // 2. Create new user in database (password is hashed in pre-save hook)
  const user = await User.create({
    name,
    email,
    password,
    role: role || "user"
  });

  // 3. Return sanitized response (password excluded via toJSON)
  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

/**
 * @desc    Authenticate user & get JWT token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user by email and explicitly include password field (since select: false in schema)
  const user = await User.findOne({ email }).select("+password");

  // 2. If user not found, return generic 401 (prevents username/email harvesting)
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 3. Verify password using bcrypt compare
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 4. Send token and user in standard response envelope
  return sendTokenResponse(user, 200, res, "Login successful");
});

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/v1/auth/me
 * @access  Private (Requires valid JWT)
 */
export const getMe = asyncHandler(async (req, res) => {
  // req.user is attached by the 'protect' authentication middleware
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user profile fetched successfully"));
});
