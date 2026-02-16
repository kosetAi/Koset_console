// client/src/pages/InstantClusters.jsx

import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiLock } from "react-icons/fi";
import Loader from "../components/Loader";

export default function InstantClusters() {
  const [isPageReady, setIsPageReady] = useState(false);
  useEffect(() => {
    // Simulate a brief delay or wait for actual data
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 1200); // 1.2 seconds feels snappy but professional

    return () => clearTimeout(timer);
  }, []);
  if (!isPageReady) return <Loader />;
  return (
    
    <div className="relative min-h-screen bg-[#09090B] text-white">
      
      {/* COMING SOON OVERLAY - FIXED TO VIEWPORT CENTER */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
        <div className="bg-[#121217]/90 border border-violet-500/20 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-2xl text-center max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-violet-600/20 rounded-2xl border border-violet-500/40">
              <FiLock className="text-violet-500 text-3xl" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 tracking-tight">Coming Soon</h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            The Instant Clusters orchestration layer is currently being calibrated for high-performance multi-GPU scaling.
          </p>
          <div className="inline-block px-8 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-violet-500/20 uppercase tracking-widest">
            In Development
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-4 sm:p-8 space-y-6 sm:space-y-10 blur-[8px] pointer-events-none select-none grayscale-[0.4]">

        {/* PAGE TITLE + ACTION BUTTON - RESPONSIVE STACKING */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Instant Clusters</h1>

          <button className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 rounded-md text-sm px-4 py-2.5 flex items-center justify-center gap-2 transition font-semibold shadow-md shadow-violet-500/10">
            <AiOutlinePlus className="text-md" /> Create a Cluster
          </button>
        </div>

        {/* EMPTY STATE BOX - RESPONSIVE PADDING */}
        <div className="bg-[#121217] border border-white/5 p-6 sm:p-12 rounded-xl text-center max-w-4xl mx-auto shadow-xl">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#18181B] border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
             <span className="text-2xl sm:text-3xl text-violet-500">🛰️</span>
          </div>
          
          <h2 className="text-lg sm:text-xl font-semibold mb-3">Instant Clusters</h2>

          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed text-xs sm:text-sm">
            An on-demand, fully managed, multi-GPU compute service you can launch in
            minutes. Attach shared storage, run jobs, then spin it down when done.
            Pay only for what you use — no contracts or capacity planning.
          </p>

          <button className="text-violet-400 text-sm font-medium underline block mx-auto mt-6 hover:text-violet-300 transition">
            Tutorials →
          </button>
        </div>
      </div>
    </div>
  );
}