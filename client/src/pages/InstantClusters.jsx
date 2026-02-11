// client/src/pages/InstantClusters.jsx

import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiLock } from "react-icons/fi";

export default function InstantClusters() {
  return (
    <div className="relative min-h-screen bg-[#09090B] text-white">
      
      {/* COMING SOON OVERLAY */}
      <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
        <div className="bg-[#121217]/80 border border-violet-500/20 backdrop-blur-md p-8 rounded-xl shadow-2xl text-center max-w-sm w-full">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-violet-600/20 rounded-full border border-violet-500/40">
              <FiLock className="text-violet-500 text-2xl" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            The Instant Clusters orchestration layer is currently being calibrated for high-performance multi-GPU scaling.
          </p>
          <div className="inline-block px-6 py-2 bg-violet-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-violet-500/20">
            In Development
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-8 space-y-10 blur-[6px] pointer-events-none select-none grayscale-[0.4]">

        {/* PAGE TITLE + ACTION BUTTON */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Instant Clusters</h1>

          <button className="bg-violet-600 hover:bg-violet-500 rounded-md text-sm px-4 py-2 flex items-center gap-2 transition font-semibold shadow-md shadow-violet-500/10">
            <AiOutlinePlus className="text-md" /> Create a Cluster
          </button>
        </div>

        {/* EMPTY STATE BOX */}
        <div className="bg-[#121217] border border-white/5 p-12 rounded-xl text-center max-w-4xl mx-auto shadow-xl">
          <div className="w-16 h-16 bg-[#18181B] border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
             <span className="text-3xl text-violet-500">🛰️</span>
          </div>
          
          <h2 className="text-xl font-semibold mb-3">Instant Clusters</h2>

          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed text-sm">
            An on-demand, fully managed, multi-GPU compute service you can launch in
            minutes. Attach shared storage, run jobs, then spin it down when done.
            Pay only for what you use — no contracts or capacity planning.
          </p>

          <button className="text-violet-400 text-sm underline block mx-auto mt-6 hover:text-violet-300 transition">
            Tutorials →
          </button>
        </div>
      </div>
    </div>
  );
}