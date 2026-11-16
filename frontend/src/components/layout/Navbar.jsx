import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Package, LogIn, UserPlus, LogOut, LayoutDashboard, ShoppingBag } from "lucide-react";
import { logoutUser } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

/**
 * Main application navigation bar with Product catalog link and auth states
 */
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-2.5 font-bold text-lg text-slate-900 group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
              <Package className="w-5 h-5" />
            </div>
            <span>
              Product<span className="text-indigo-600">Hub</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 sm:gap-3">
            {/* Products Catalog Link (Visible to All) */}
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Products</span>
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-slate-100 text-slate-900 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`
                  }
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </NavLink>

                {/* User Info Badge */}
                <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold uppercase">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-800 leading-tight">
                      {user?.name}
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium uppercase">
                      {user?.role}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`
                  }
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </NavLink>

                <NavLink
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
