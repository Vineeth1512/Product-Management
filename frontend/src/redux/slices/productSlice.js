import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/**
 * Fetch products with pagination, search, category, and sorting
 */
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.search) queryParams.append("search", params.search);
      if (params.category) queryParams.append("category", params.category);
      if (params.sort) queryParams.append("sort", params.sort);

      const queryString = queryParams.toString();
      const url = `/products${queryString ? `?${queryString}` : ""}`;

      const response = await api.get(url);
      return response.data; // { products, pagination }
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch products");
    }
  }
);

/**
 * Fetch single product by ID
 */
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch product details");
    }
  }
);

/**
 * Add a new product
 */
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.post("/products", productData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create product");
    }
  }
);

/**
 * Update an existing product
 */
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/products/${id}`, productData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update product");
    }
  }
);

/**
 * Delete a product
 */
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete product");
    }
  }
);

const initialState = {
  products: [],
  selectedProduct: null,
  pagination: {
    totalProducts: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 8,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    search: "",
    category: "",
    sort: "newest",
    page: 1,
    limit: 8,
  },
  isLoading: false,
  isSubmitting: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
        // Reset to page 1 on filter changes unless page is explicitly given
        page: action.payload.page !== undefined ? action.payload.page : 1,
      };
    },
    resetFilters: (state) => {
      state.filters = {
        search: "",
        category: "",
        sort: "newest",
        page: 1,
        limit: 8,
      };
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Product By ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.selectedProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.products.unshift(action.payload);
        state.pagination.totalProducts += 1;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.selectedProduct?._id === action.payload._id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.products = state.products.filter((p) => p._id !== action.payload);
        state.pagination.totalProducts = Math.max(0, state.pagination.totalProducts - 1);
        if (state.selectedProduct?._id === action.payload) {
          state.selectedProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  resetFilters,
  clearSelectedProduct,
  clearProductError,
} = productSlice.actions;

export default productSlice.reducer;
