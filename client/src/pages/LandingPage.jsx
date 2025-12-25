import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl space-y-8">
        {/* Hero Section */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400">
          Koset Console
        </h1>
        
        <p className="text-xl text-gray-400 leading-relaxed">
          Premium GPU cloud, zero-DevOps experience. <br />
          Deploy pods, serverless endpoints, and clusters in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            to="/login"
            className="px-8 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-lg transition shadow-lg shadow-violet-500/20"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="px-8 py-3 rounded-lg bg-[#1A1D24] border border-gray-700 hover:border-gray-500 text-gray-200 font-semibold text-lg transition"
          >
            Create Account
          </Link>
        </div>
      </div>
      
      {/* Footer / Extra info */}
      <div className="absolute bottom-10 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Koset.io. All rights reserved.
      </div>
    </div>
  );
}