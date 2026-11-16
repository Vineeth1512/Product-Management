import Product from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private (Authenticated users / Admins)
 */
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, sku, image } = req.body;

  // 1. Check for duplicate SKU
  const normalizedSku = sku.toUpperCase().trim();
  const existingProduct = await Product.findOne({ sku: normalizedSku });
  if (existingProduct) {
    throw new ApiError(409, `Product with SKU '${normalizedSku}' already exists`);
  }

  // 2. Create product with current user as creator
  const product = await Product.create({
    name,
    description,
    price: Number(price),
    category: category.toLowerCase().trim(),
    stock: stock !== undefined ? Number(stock) : 0,
    sku: normalizedSku,
    image: image || undefined,
    createdBy: req.user._id
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

/**
 * @desc    Get all products with filtering, searching, sorting & pagination
 * @route   GET /api/v1/products
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    minPrice,
    maxPrice,
    sort = "newest"
  } = req.query;

  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (parsedPage - 1) * parsedLimit;

  // 1. Build Query Filters
  const query = {};

  // Category filter
  if (category) {
    query.category = category.toLowerCase().trim();
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
  }

  // Search filter across name, description, and SKU
  if (search) {
    const searchRegex = new RegExp(search.trim(), "i");
    query.$or = [
      { name: searchRegex },
      { description: searchRegex },
      { sku: searchRegex }
    ];
  }

  // 2. Build Sort Options
  const sortOptionsMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    name_asc: { name: 1 },
    name_desc: { name: -1 }
  };
  const sortCriteria = sortOptionsMap[sort] || { createdAt: -1 };

  // 3. Execute count and query in parallel for performance
  const [totalProducts, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(parsedLimit)
      .populate("createdBy", "name email role")
  ]);

  const totalPages = Math.ceil(totalProducts / parsedLimit) || 1;

  const responsePayload = {
    products,
    pagination: {
      totalProducts,
      totalPages,
      currentPage: parsedPage,
      limit: parsedLimit,
      hasNextPage: parsedPage < totalPages,
      hasPrevPage: parsedPage > 1
    }
  };

  return res
    .status(200)
    .json(new ApiResponse(200, responsePayload, "Products retrieved successfully"));
});

/**
 * @desc    Get single product by ID
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "createdBy",
    "name email role"
  );

  if (!product) {
    throw new ApiError(404, `Product not found with ID: ${req.params.id}`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product retrieved successfully"));
});

/**
 * @desc    Update product by ID (Full update or partial patch)
 * @route   PUT /api/v1/products/:id or PATCH /api/v1/products/:id
 * @access  Private (Admin or Product Creator only)
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, `Product not found with ID: ${req.params.id}`);
  }

  // Authorization Check: Must be admin or original creator
  const isOwner = product.createdBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(
      403,
      "Forbidden: You do not have permission to modify this product"
    );
  }

  // Check duplicate SKU if SKU is being updated
  if (req.body.sku && req.body.sku.toUpperCase() !== product.sku) {
    const duplicateSku = await Product.findOne({
      sku: req.body.sku.toUpperCase(),
      _id: { $ne: product._id }
    });
    if (duplicateSku) {
      throw new ApiError(
        409,
        `Product with SKU '${req.body.sku.toUpperCase()}' already exists`
      );
    }
  }

  // Update allowed fields
  const allowedUpdates = [
    "name",
    "description",
    "price",
    "category",
    "stock",
    "sku",
    "image"
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (field === "sku") {
        product.sku = req.body.sku.toUpperCase().trim();
      } else if (field === "category") {
        product.category = req.body.category.toLowerCase().trim();
      } else if (field === "price" || field === "stock") {
        product[field] = Number(req.body[field]);
      } else {
        product[field] = req.body[field];
      }
    }
  });

  const updatedProduct = await product.save();
  await updatedProduct.populate("createdBy", "name email role");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

/**
 * @desc    Delete a product by ID
 * @route   DELETE /api/v1/products/:id
 * @access  Private (Admin or Product Creator only)
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, `Product not found with ID: ${req.params.id}`);
  }

  // Authorization Check: Must be admin or original creator
  const isOwner = product.createdBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(
      403,
      "Forbidden: You do not have permission to delete this product"
    );
  }

  await product.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted successfully"));
});
