import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Zap, Layers, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";

const HomePage = () => {
  return (
    <div className="py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-4">
          MERN Production Architecture
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          Production-Level Product Management System
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Enterprise-grade MERN application built with JWT authentication, role-based access control, MongoDB Atlas, and Tailwind CSS.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/register">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">
              Sign In to Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1.5">Secure JWT Auth</h3>
          <p className="text-sm text-slate-600">
            HttpOnly cross-domain cookie and Bearer token security with bcrypt salted password encryption.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1.5">Scalable Architecture</h3>
          <p className="text-sm text-slate-600">
            Layered MVC architecture separating routes, controllers, middleware, models, and UI components.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1.5">Vite & Tailwind Speed</h3>
          <p className="text-sm text-slate-600">
            Instant Hot Module Replacement (HMR) powered by Vite with accessible, responsive Tailwind CSS styling.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
