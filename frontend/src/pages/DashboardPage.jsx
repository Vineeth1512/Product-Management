import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, KeyRound, LogOut, CheckCircle2 } from "lucide-react";
import { logoutUser } from "../redux/slices/authSlice";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import toast from "react-hot-toast";

/**
 * Protected Dashboard View
 */
const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-indigo-100 backdrop-blur mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            Session Authenticated
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name || "User"}!
          </h1>
          <p className="text-indigo-100 text-sm mt-1 max-w-xl">
            You are currently authenticated via JWT &amp; HttpOnly cross-domain cookies.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={handleLogout}
          className="gap-2 shrink-0 bg-white text-slate-800 hover:bg-slate-100"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>

      {/* User Profile & Security Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-base">User Profile</h2>
          </div>

          <dl className="space-y-3.5 text-sm">
            <div className="flex justify-between items-center py-1">
              <dt className="text-slate-500 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </dt>
              <dd className="font-semibold text-slate-900">{user?.name}</dd>
            </div>

            <div className="flex justify-between items-center py-1">
              <dt className="text-slate-500 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </dt>
              <dd className="font-semibold text-slate-900">{user?.email}</dd>
            </div>

            <div className="flex justify-between items-center py-1">
              <dt className="text-slate-500 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Role
              </dt>
              <dd>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                    user?.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {user?.role || "user"}
                </span>
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <KeyRound className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-base">Security &amp; Token</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Storage Strategy:</p>
              <p>• <strong>HttpOnly Cookie:</strong> Protected against XSS attacks.</p>
              <p>• <strong>Bearer Authorization:</strong> Injected automatically by Axios interceptor.</p>
            </div>

            <div className="pt-1">
              <p className="text-xs text-slate-500 mb-1">Decoded Token User ID:</p>
              <code className="block p-2 rounded bg-slate-100 text-slate-800 text-xs font-mono break-all select-all">
                {user?._id || "Unavailable"}
              </code>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
