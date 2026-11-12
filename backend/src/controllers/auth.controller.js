import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

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

  // 2. Create new user in database (password is automatically hashed via Mongoose pre-save hook)
  const user = await User.create({
    name,
    email,
    password,
    role: role || "user"
  });

  // 3. Return sanitized response (password is excluded via user.toJSON method)
  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

