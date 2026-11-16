import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

/**
 * Standard layout wrapping general application pages
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} ProductHub. Built with MERN Stack & Tailwind CSS.
      </footer>
    </div>
  );
};

export default MainLayout;
