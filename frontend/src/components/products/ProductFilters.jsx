import React from "react";
import { Search, Filter, ArrowUpDown, X } from "lucide-react";

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
 * Filter and Search Controls Bar
 */
const ProductFilters = ({ filters, onFilterChange, onReset }) => {
  const isFiltered = filters.search || filters.category || filters.sort !== "newest";

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm mb-6 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search products by name, description, SKU..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder-slate-400"
        />
      </div>

      {/* Category Dropdown */}
      <div className="relative sm:w-48">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Filter className="w-4 h-4" />
        </div>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className="w-full text-xs sm:text-sm pl-9 pr-8 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-700 capitalize cursor-pointer"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat.toLowerCase()}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Dropdown */}
      <div className="relative sm:w-44">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <ArrowUpDown className="w-4 h-4" />
        </div>
        <select
          value={filters.sort}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
          className="w-full text-xs sm:text-sm pl-9 pr-8 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-700 cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
        </select>
      </div>

      {/* Reset Filters Button */}
      {isFiltered && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
          title="Reset all filters"
        >
          <X className="w-4 h-4" />
          <span className="hidden lg:inline">Clear</span>
        </button>
      )}
    </div>
  );
};

export default ProductFilters;
