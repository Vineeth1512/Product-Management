import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Tag,
  PackageCheck,
  PackageX,
  Calendar,
  User,
  Shield,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  fetchProductById,
  updateProduct,
  deleteProduct,
  clearSelectedProduct,
} from "../redux/slices/productSlice";
import ProductFormModal from "../components/products/ProductFormModal";
import DeleteConfirmModal from "../components/products/DeleteConfirmModal";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import toast from "react-hot-toast";

/**
 * Product Specification & Details Page
 */
const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct, isLoading, isSubmitting, error } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading product details...</p>
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Product Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          {error || "The product you requested does not exist or may have been deleted."}
        </p>
        <Link to="/products">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  // Authorization Check
  const isOwner =
    user &&
    (selectedProduct.createdBy?._id === user._id ||
      selectedProduct.createdBy === user._id);
  const isAdmin = user?.role === "admin";
  const canModify = isOwner || isAdmin;

  const isOutOfStock = Number(selectedProduct.stock) <= 0;

  const handleUpdate = async (formData) => {
    const result = await dispatch(
      updateProduct({ id: selectedProduct._id, productData: formData })
    );
    if (updateProduct.fulfilled.match(result)) {
      toast.success("Product updated successfully!");
      setIsEditModalOpen(false);
      dispatch(fetchProductById(id));
    } else {
      toast.error(result.payload || "Failed to update product");
    }
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteProduct(selectedProduct._id));
    if (deleteProduct.fulfilled.match(result)) {
      toast.success("Product deleted successfully!");
      navigate("/products");
    } else {
      toast.error(result.payload || "Failed to delete product");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        {canModify && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              className="gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </Button>
          </div>
        )}
      </div>

      {/* Main Product Showcase Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
        {/* Left: Product Image */}
        <div className="rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center max-h-[420px]">
          <img
            src={
              selectedProduct.image ||
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
            }
            alt={selectedProduct.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";
            }}
          />
        </div>

        {/* Right: Specifications & Details */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 capitalize">
                <Tag className="w-3 h-3 text-indigo-600" />
                {selectedProduct.category}
              </span>

              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  isOutOfStock
                    ? "bg-rose-50 text-rose-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {isOutOfStock ? (
                  <>
                    <PackageX className="w-3.5 h-3.5" /> Out of Stock
                  </>
                ) : (
                  <>
                    <PackageCheck className="w-3.5 h-3.5" /> In Stock ({selectedProduct.stock} units)
                  </>
                )}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {selectedProduct.name}
            </h1>

            <div>
              <span className="text-xs text-slate-400 block uppercase tracking-wider mb-0.5">
                Current Price
              </span>
              <span className="text-3xl font-extrabold text-indigo-600">
                ${Number(selectedProduct.price).toFixed(2)}
              </span>
            </div>

            <div className="pt-2">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">
                Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {selectedProduct.description}
              </p>
            </div>
          </div>

          {/* Metadata Footer */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">SKU Code</span>
              <code className="font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                {selectedProduct.sku}
              </code>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Created On</span>
              <span className="text-slate-700 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {new Date(selectedProduct.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Creator Info Card */}
      {selectedProduct.createdBy && (
        <Card className="p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold uppercase">
              {selectedProduct.createdBy.name?.charAt(0) || <User className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-slate-900">
                  {selectedProduct.createdBy.name}
                </h4>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                  {selectedProduct.createdBy.role}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Product catalog creator • Contact: {selectedProduct.createdBy.email}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      <ProductFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdate}
        initialData={selectedProduct}
        isSubmitting={isSubmitting}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        productName={selectedProduct.name}
        isDeleting={isSubmitting}
      />
    </div>
  );
};

export default ProductDetailsPage;
