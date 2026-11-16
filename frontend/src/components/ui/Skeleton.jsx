import React from "react";

/**
 * Shimmering skeleton loader for card placeholders
 */
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 bg-slate-200 w-full" />

      {/* Content placeholder */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-200 rounded w-1/5" />
        </div>
        <div className="h-6 bg-slate-200 rounded w-3/4" />
        <div className="space-y-1.5">
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-5/6" />
        </div>
        <div className="pt-2 flex justify-between items-center border-t border-slate-100">
          <div className="h-7 bg-slate-200 rounded w-1/3" />
          <div className="h-8 bg-slate-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};
