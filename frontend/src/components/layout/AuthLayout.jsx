import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Package } from "lucide-react";

/**
 * Focused layout for Authentication views (Login & Register)
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-slate-50 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2.5 font-bold text-2xl text-slate-900 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow group-hover:bg-indigo-700 transition-colors">
            <Package className="w-6 h-6" />
          </div>
          <span>Product<span className="text-indigo-600">Hub</span></span>
        </Link>
      </div>

      {/* Auth Card Container */}
      <div className="w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
