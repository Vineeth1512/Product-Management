import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { registerValidator } from "../validators/auth.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

// Route: POST /api/v1/auth/register
router.post("/register", validate(registerValidator), registerUser);

export default router;

