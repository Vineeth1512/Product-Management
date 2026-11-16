import React, { useState, useEffect } from "react";
import { X, PackagePlus, Edit3, AlertCircle } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Footwear",
  "Home & Kitchen",
  "Books",
  "Sports & Fitness",
  "Beauty & Personal Care",
  "Accessories",
];

/**
 * Modal Dialog for Creating or Editing Products
 */
const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) => {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: "",
    category: "electronics",
    price: "",
    stock: "0",
    sku: "",
    image: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        category: initialData.category || "electronics",
        price: initialData.price !== undefined ? String(initialData.price) : "",
        stock: initialData.stock !== undefined ? String(initialData.stock) : "0",
        sku: initialData.sku || "",
        image: initialData.image || "",
        description: initialData.description || "",
      });
    } else {
      setFormData({
        name: "",
        category: "electronics",
        price: "",
        stock: "0",
        sku: "",
        image: "",
        description: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = "Valid positive price is required";
    }

    if (formData.stock === "" || isNaN(formData.stock) || Number(formData.stock) < 0) {
      newErrors.stock = "Stock must be a non-negative integer";
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU identifier is required";
    } else if (formData.sku.trim().length < 3) {
      newErrors.sku = "SKU must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sku" ? value.toUpperCase() : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      category: formData.category.toLowerCase().trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      sku: formData.sku.toUpperCase().trim(),
      image: formData.image.trim() || undefined,
      description: formData.description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <PackagePlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg leading-tight">
                {isEditing ? "Edit Product" : "Add New Product"}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing ? "Update product specifications" : "Fill details to add to catalog"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Product Name"
            name="name"
            placeholder="e.g. Mechanical Gaming Keyboard"
            required
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Select */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full rounded-lg border border-slate-300 text-slate-900 text-sm py-2.5 px-3.5 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 capitalize"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="SKU Identifier"
              name="sku"
              placeholder="e.g. KB-RGB-001"
              required
              value={formData.sku}
              onChange={handleChange}
              error={errors.sku}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Price ($ USD)"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="99.99"
              required
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
            />

            <Input
              label="Stock Quantity"
              name="stock"
              type="number"
              min="0"
              placeholder="50"
              required
              value={formData.stock}
              onChange={handleChange}
              error={errors.stock}
            />
          </div>

          <Input
            label="Image URL"
            name="image"
            type="url"
            placeholder="https://example.com/product.jpg"
            value={formData.image}
            onChange={handleChange}
            error={errors.image}
          />

          {/* Description Textarea */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Detailed product features, dimensions, specifications..."
              value={formData.description}
              onChange={handleChange}
              className={`block w-full rounded-lg border text-sm p-3 focus:outline-none focus:ring-2 ${
                errors.description
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                  : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {errors.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              {isEditing ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
