import React from "react";
import { Link } from "react-router-dom";
import { Edit2, Trash2, Eye, Tag, AlertCircle } from "lucide-react";

/**
 * Product Card Component
 */
const ProductCard = ({ product, currentUser, onEdit, onDelete }) => {
  // Check authorization: Admins or original creators can modify/delete
  const isOwner =
    currentUser &&
    (product.createdBy?._id === currentUser._id ||
      product.createdBy === currentUser._id);
  const isAdmin = currentUser?.role === "admin";
  const canModify = isOwner || isAdmin;

  const isOutOfStock = Number(product.stock) <= 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Product Image Header */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img
          src={
            product.image ||
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";
          }}
        />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-slate-800 backdrop-blur shadow-sm capitalize">
          <Tag className="w-3 h-3 text-indigo-600" />
          {product.category}
        </span>

        {/* Stock Badge */}
        <span
          className={`absolute top-3 right-3 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
            isOutOfStock
              ? "bg-rose-50 text-rose-700 border border-rose-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : `${product.stock} in stock`}
        </span>
      </div>

      {/* Product Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <Link
              to={`/products/${product._id}`}
              className="font-bold text-slate-900 text-base hover:text-indigo-600 transition-colors line-clamp-1"
              title={product.name}
            >
              {product.name}
            </Link>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Metadata */}
        <div>
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                Price
              </span>
              <span className="text-xl font-extrabold text-indigo-600">
                ${Number(product.price).toFixed(2)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">SKU</span>
              <code className="text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                {product.sku}
              </code>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              to={`/products/${product._id}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </Link>

            {canModify && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                  title="Edit Product"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(product)}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
