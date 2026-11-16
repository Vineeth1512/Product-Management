import { Router } from "express";
import {
  registerUser,
  loginUser,
  getMe
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator
} from "../validators/auth.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// Public Routes
router.post("/register", validate(registerValidator), registerUser);
router.post("/login", validate(loginValidator), loginUser);

// Protected Routes (Requires valid JWT)
router.get("/me", protect, getMe);

export default router;
