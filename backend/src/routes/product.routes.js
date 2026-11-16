import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";
import {
  createProductValidator,
  updateProductValidator,
  productIdValidator,
  queryProductValidator
} from "../validators/product.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes: browsing product catalog
router.get("/", validate(queryProductValidator), getProducts);
router.get("/:id", validate(productIdValidator), getProductById);

// Protected routes: Creating, updating and deleting products
router.post("/", protect, validate(createProductValidator), createProduct);
router.put("/:id", protect, validate(updateProductValidator), updateProduct);
router.patch("/:id", protect, validate(updateProductValidator), updateProduct);
router.delete("/:id", protect, validate(productIdValidator), deleteProduct);

export default router;
