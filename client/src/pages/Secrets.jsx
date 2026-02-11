// client/src/pages/Secrets.jsx

import React, { useState } from "react";
import { FiSearch, FiLock } from "react-icons/fi";

export default function Secrets() {
  const [search, setSearch] = useState("");

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
            The encrypted vault system is being integrated with our secure hardware modules (HSM).
          </p>
          <div className="inline-block px-6 py-2 bg-violet-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-violet-500/20">
            In Development
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-10 space-y-10 blur-[6px] pointer-events-none select-none grayscale-[0.4]">

        {/* TITLE + ACTION BAR */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Secrets</h1>

          <button className="bg-violet-600 hover:bg-violet-500 px-6 py-2 rounded-md text-sm font-semibold shadow-lg shadow-violet-500/10 transition">
            + Create Secret
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="flex justify-end">
          <div className="relative w-full max-w-xs">
            <input
              readOnly
              type="text"
              placeholder="Search secrets"
              value={search}
              className="w-full bg-[#121217] border border-white/10 px-4 py-2 rounded-md text-sm outline-none placeholder:text-gray-600"
            />
            <FiSearch className="absolute right-3 top-2.5 text-gray-500 text-lg" />
          </div>
        </div>

        {/* EMPTY STATE */}
        <div className="max-w-3xl mx-auto bg-[#121217] border border-white/5 rounded-xl px-10 py-16 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-[#18181B] border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-inner">
             <span className="text-3xl text-violet-500">🔑</span>
          </div>
          
          <h2 className="text-xl font-semibold">Manage Secrets</h2>

          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed text-sm">
            Secrets are a secure way to store sensitive information, such as 
            API keys or credentials. They are encrypted at rest and injected 
            into your pods as environment variables.
          </p>

          <button className="text-violet-400 underline hover:text-violet-300 transition text-sm">
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
}