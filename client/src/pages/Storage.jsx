// client/src/pages/Storage.jsx

import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiSearch, FiLock } from "react-icons/fi";
import Loader from "../components/Loader";

/**
 * Storage.jsx
 * - Logic: UNCHANGED
 * - Layout: UPDATED for Mobile Responsiveness
 * - Coming Soon Overlay: UPDATED to fixed positioning for scroll-sync
 */

export default function Storage() {
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
      
      {/* COMING SOON OVERLAY - FIXED POSITIONING */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
        <div className="bg-[#121217]/90 border border-violet-500/20 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-2xl text-center max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-violet-600/20 rounded-2xl border border-violet-500/40 shadow-inner">
              <FiLock className="text-violet-500 text-3xl" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 tracking-tight">Coming Soon</h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            The Network Storage provisioning system is currently being optimized for high-IOPS data persistence.
          </p>
          <div className="inline-block px-8 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-violet-500/20 uppercase tracking-widest">
            In Development
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-4 sm:p-8 space-y-6 sm:space-y-10 blur-[8px] pointer-events-none select-none grayscale-[0.4]">

        {/* PAGE HEADER - RESPONSIVE STACKING */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Network Storage</h1>

          <div className="flex items-center w-full md:w-auto">
            {/* Search Bar - Full width on mobile */}
            <div className="relative w-full md:w-64">
              <input
                readOnly
                type="text"
                placeholder="Search volumes"
                className="w-full bg-[#121217] border border-white/10 px-4 py-2.5 sm:py-2 rounded-lg text-sm outline-none placeholder:text-gray-600 pr-10"
                value={search}
              />
              <FiSearch className="absolute right-3 top-3 sm:top-2.5 text-gray-500 text-lg" />
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS - RESPONSIVE GRID */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 rounded-lg text-sm px-5 py-2.5 flex items-center justify-center gap-2 transition font-semibold shadow-md shadow-violet-500/10 text-white">
            <AiOutlinePlus /> New Volume
          </button>

          <button className="w-full sm:w-auto bg-[#18181B] border border-white/10 hover:bg-[#222226] text-sm rounded-lg px-5 py-2.5 flex items-center justify-center gap-2 transition text-gray-300">
            <AiOutlinePlus /> Create S3 Key
          </button>
        </div>

        {/* EMPTY STATE - ADAPTIVE PADDING */}
        <div className="bg-[#121217] border border-white/5 p-6 sm:p-12 rounded-2xl text-center max-w-4xl mx-auto shadow-xl">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#18181B] border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
             <span className="text-2xl sm:text-3xl text-violet-500">💾</span>
          </div>
          
          <h2 className="text-lg sm:text-xl font-semibold mb-3">Manage Network Storage</h2>

          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed text-xs sm:text-sm">
            Network storage volumes allow you to persist data across pod restarts
            and share data between pods. All volumes are encrypted at rest and 
            backed by high-performance NVMe arrays.
          </p>

          <button className="text-violet-400 text-sm font-medium underline block mx-auto mt-6 hover:text-violet-300 transition">
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
}