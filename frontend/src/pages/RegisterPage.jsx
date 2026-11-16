import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User, Mail, Lock, Shield, AlertCircle } from "lucide-react";
import { registerUser, clearAuthError } from "../redux/slices/authSlice";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

/**
 * Connected Register Page with validation and Redux registration
 */
const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (clientErrors[name]) {
      setClientErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await dispatch(
      registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created successfully! Please sign in.");
      navigate("/login");
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Create an account
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Start managing your product catalog today
        </p>
      </div>

      {/* Backend API Error Banner */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Full Name"
          name="name"
          placeholder="Jane Doe"
          icon={User}
          required
          value={formData.name}
          onChange={handleChange}
          error={clientErrors.name}
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="jane@company.com"
          icon={Mail}
          required
          value={formData.email}
          onChange={handleChange}
          error={clientErrors.email}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="At least 6 characters"
          icon={Lock}
          required
          value={formData.password}
          onChange={handleChange}
          error={clientErrors.password}
        />

        {/* Role Selector */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Account Role
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Shield className="h-5 w-5" />
            </div>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="block w-full rounded-lg border border-slate-300 text-slate-900 text-sm py-2.5 pl-10 pr-3.5 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="user">User (Standard viewer)</option>
              <option value="admin">Admin (Full Product CRUD capabilities)</option>
            </select>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Choose &apos;Admin&apos; if you wish to create and edit products.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
