import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2, ShieldAlert } from "lucide-react";

/**
 * Route wrapper that prevents unauthorized access
 * @param {Array} allowedRoles - Optional list of authorized roles (e.g. ['admin'])
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, isCheckingAuth, user } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  // 1. Show loading spinner while session verification (/auth/me) is underway
  if (isCheckingAuth) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">
          Authenticating session...
        </p>
      </div>
    );
  }

  // 2. Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Check role-based permission if specific roles are required
  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-slate-600 max-w-md text-sm mb-6">
          Your account role (<span className="font-semibold text-slate-800">{user?.role || "user"}</span>)
          does not have permission to view this page. Contact an administrator.
        </p>
      </div>
    );
  }

  // 4. Authorized: Render matched child route
  return <Outlet />;
};

export default ProtectedRoute;
