import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Reusable Pagination Controls
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalProducts = 0,
  limit = 8,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalProducts);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-slate-200 mt-8">
      {/* Item summary */}
      <p className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{startItem}</span> to{" "}
        <span className="font-semibold text-slate-700">{endItem}</span> of{" "}
        <span className="font-semibold text-slate-700">{totalProducts}</span> products
      </p>

      {/* Page navigation */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed select-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Page Buttons */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              // Show first, last, current, and surrounding pages
              return (
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
              );
            })
            .map((page, index, array) => {
              const prevPage = array[index - 1];
              const showEllipsis = prevPage && page - prevPage > 1;

              return (
                <React.Fragment key={page}>
                  {showEllipsis && (
                    <span className="px-1 text-slate-400 text-xs select-none">...</span>
                  )}
                  <button
                    type="button"
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors select-none ${
                      currentPage === page
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed select-none transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
