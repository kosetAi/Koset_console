// client/src/pages/Secrets.jsx

import React, { useEffect, useState } from "react";
import { FiSearch, FiLock } from "react-icons/fi";
import Loader from "../components/Loader";

/**
 * Secrets.jsx
 * - Logic: UNCHANGED
 * - Layout: UPDATED for Mobile Responsiveness
 * - Coming Soon Overlay: UPDATED to fixed positioning for viewport centering
 */

export default function Secrets() {
  const [isPageReady, setIsPageReady] = useState(false);
  useEffect(() => {
    // Simulate a brief delay or wait for actual data
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 1200); // 1.2 seconds feels snappy but professional

    return () => clearTimeout(timer);
  }, []);
  const [search, setSearch] = useState("");

  if (!isPageReady) return <Loader />;
  return (
    <div className="relative min-h-screen bg-[#09090B] text-white">
      
      {/* COMING SOON OVERLAY - FIXED TO SCREEN CENTER */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
        <div className="bg-[#121217]/90 border border-violet-500/20 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-2xl text-center max-w-sm w-full transition-all">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-violet-600/20 rounded-2xl border border-violet-500/40">
              <FiLock className="text-violet-500 text-3xl" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 tracking-tight">Coming Soon</h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            The encrypted vault system is being integrated with our secure hardware modules (HSM).
          </p>
          <div className="inline-block px-8 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-violet-500/20 uppercase tracking-widest">
            In Development
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-4 sm:p-10 space-y-6 sm:space-y-10 blur-[8px] pointer-events-none select-none grayscale-[0.4]">

        {/* TITLE + ACTION BAR - RESPONSIVE STACKING */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Secrets</h1>

          <button className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-violet-500/10 transition-all active:scale-95">
            + Create Secret
          </button>
        </div>

        {/* SEARCH BAR - ADAPTIVE ALIGNMENT */}
        <div className="flex justify-start sm:justify-end">
          <div className="relative w-full sm:max-w-xs">
            <input
              readOnly
              type="text"
              placeholder="Search secrets"
              value={search}
              className="w-full bg-[#121217] border border-white/10 px-4 py-2.5 sm:py-2 rounded-lg text-sm outline-none placeholder:text-gray-600 pr-10 focus:ring-1 focus:ring-violet-500/50"
            />
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
          </div>
        </div>

        {/* EMPTY STATE - RESPONSIVE PADDING */}
        <div className="max-w-3xl mx-auto bg-[#121217] border border-white/5 rounded-2xl px-6 py-12 sm:px-10 sm:py-16 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#18181B] border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-inner">
             <span className="text-2xl sm:text-3xl text-violet-500">🔑</span>
          </div>
          
          <h2 className="text-lg sm:text-xl font-semibold">Manage Secrets</h2>

          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed text-xs sm:text-sm">
            Secrets are a secure way to store sensitive information, such as 
            API keys or credentials. They are encrypted at rest and injected 
            into your pods as environment variables.
          </p>

          <button className="text-violet-400 underline hover:text-violet-300 transition text-sm font-medium">
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
}