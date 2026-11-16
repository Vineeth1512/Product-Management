import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, PackageX, AlertCircle } from "lucide-react";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setFilters,
  resetFilters,
} from "../redux/slices/productSlice";
import ProductCard from "../components/products/ProductCard";
import ProductFilters from "../components/products/ProductFilters";
import ProductFormModal from "../components/products/ProductFormModal";
import DeleteConfirmModal from "../components/products/DeleteConfirmModal";
import Pagination from "../components/ui/Pagination";
import { ProductCardSkeleton } from "../components/ui/Skeleton";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

/**
 * Main Product Catalog View
 */
const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, pagination, filters, isLoading, isSubmitting, error } =
    useSelector((state) => state.products);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Modal State Management
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Trigger query fetch whenever filters change
  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const handlePageChange = (newPage) => {
    dispatch(setFilters({ page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Open Add Product
  const handleOpenAddModal = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add products");
      return;
    }
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Product
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  // Open Delete Confirmation
  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // Handle Form Submission (Add or Edit)
  const handleFormSubmit = async (formData) => {
    if (editingProduct) {
      const result = await dispatch(
        updateProduct({ id: editingProduct._id, productData: formData })
      );
      if (updateProduct.fulfilled.match(result)) {
        toast.success("Product updated successfully!");
        setIsFormModalOpen(false);
        setEditingProduct(null);
      } else {
        toast.error(result.payload || "Failed to update product");
      }
    } else {
      const result = await dispatch(addProduct(formData));
      if (addProduct.fulfilled.match(result)) {
        toast.success("Product created successfully!");
        setIsFormModalOpen(false);
      } else {
        toast.error(result.payload || "Failed to create product");
      }
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    const result = await dispatch(deleteProduct(productToDelete._id));
    if (deleteProduct.fulfilled.match(result)) {
      toast.success("Product deleted successfully!");
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      // Re-fetch current page
      dispatch(fetchProducts(filters));
    } else {
      toast.error(result.payload || "Failed to delete product");
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Product Catalog
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage inventory, view specifications, and search products
          </p>
        </div>

        {isAuthenticated && (
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAddModal}
            className="gap-2 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Button>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <PackageX className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-1">
            No products found
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            We couldn&apos;t find any products matching your current filters or search term.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Clear Filters
            </Button>
            {isAuthenticated && (
              <Button variant="primary" size="sm" onClick={handleOpenAddModal}>
                Create Product
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              currentUser={user}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalProducts={pagination.totalProducts}
        limit={pagination.limit}
        onPageChange={handlePageChange}
      />

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        productName={productToDelete?.name}
        isDeleting={isSubmitting}
      />
    </div>
  );
};

export default ProductsPage;
