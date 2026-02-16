// client/src/pages/FineTuning.jsx

import React, { useEffect, useState } from "react";
import { FiLock } from "react-icons/fi";
import Loader from "../components/Loader";

/**
 * FineTuning.jsx
 * - Logic: UNCHANGED
 * - Layout: UPDATED for Mobile Responsiveness
 * - Coming Soon Overlay: UPDATED to fixed positioning for viewport centering
 */

export default function FineTuning() {
  const [isPageReady, setIsPageReady] = useState(false);
  useEffect(() => {
    // Simulate a brief delay or wait for actual data
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 1200); // 1.2 seconds feels snappy but professional

    return () => clearTimeout(timer);
  }, []);
  const [modelUrl, setModelUrl] = useState("");
  const [token, setToken] = useState("");
  const [dataset, setDataset] = useState("");

  function deploy() {
    alert("🚀 Fine-tuning pod will be deployed soon!");
    // Later this will call backend → /fine-tune/deploy
  }

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
            The Fine-Tuning orchestration engine is being optimized for distributed LoRA and QLoRA training workflows.
          </p>
          <div className="inline-block px-8 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-violet-500/20 uppercase tracking-widest">
            In Development
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-4 sm:p-10 space-y-6 sm:space-y-8 blur-[8px] pointer-events-none select-none grayscale-[0.4]">

        {/* PAGE TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold">Fine Tuning</h1>

        {/* MAIN CARD - RESPONSIVE MAX WIDTH & PADDING */}
        <div className="max-w-3xl bg-[#121217] border border-white/5 rounded-xl px-5 py-8 sm:px-8 sm:py-10 space-y-6 sm:space-y-8 shadow-xl">

          {/* Subtitle */}
          <div className="space-y-2">
            <p className="text-gray-400 leading-relaxed text-xs sm:text-sm">
              Start fine tuning a large language model with minimal config.&nbsp;
              <button
                className="text-violet-400 underline hover:text-violet-300 transition"
              >
                Read our Fine Tuning tutorial.
              </button>
            </p>
          </div>

          {/* FORM FIELDS */}
          <div className="space-y-5 sm:space-y-6">

            {/* Base Model */}
            <div>
              <label className="text-xs sm:text-sm text-gray-300 mb-1.5 block font-medium">
                Base Model <span className="text-gray-500 text-[10px] sm:text-xs">(Required)</span>
              </label>
              <input
                readOnly
                type="text"
                value={modelUrl}
                placeholder="https://huggingface.co/organization/model-name"
                className="w-full bg-[#0B0E11] border border-white/10 rounded-lg px-4 py-3 sm:py-2.5 text-sm outline-none placeholder:text-gray-600 focus:ring-1 focus:ring-violet-500/50"
              />
            </div>

            {/* Hugging Face Token */}
            <div>
              <label className="text-xs sm:text-sm text-gray-300 mb-1.5 block font-medium">
                Hugging Face Access Token
              </label>
              <div className="relative">
                <input
                  readOnly
                  type="password"
                  value={token}
                  placeholder="hf_*********************"
                  className="w-full bg-[#0B0E11] border border-white/10 rounded-lg px-4 py-3 sm:py-2.5 text-sm outline-none focus:ring-1 focus:ring-violet-500/50"
                />
                <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-lg" />
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-500 mt-2">
                You can create a token in your Hugging Face account settings.
              </p>
            </div>

            {/* Dataset URL */}
            <div>
              <label className="text-xs sm:text-sm text-gray-300 mb-1.5 block font-medium">
                Dataset (Optional)
              </label>
              <input
                readOnly
                type="text"
                value={dataset}
                placeholder="https://huggingface.co/datasets/organization/dataset-name"
                className="w-full bg-[#0B0E11] border border-white/10 rounded-lg px-4 py-3 sm:py-2.5 text-sm outline-none placeholder:text-gray-600 focus:ring-1 focus:ring-violet-500/50"
              />
            </div>

          </div>

          {/* Submit Button - Full width on very small screens */}
          <div className="pt-2">
            <button
              className="w-full sm:w-fit px-8 py-3 sm:py-2.5 bg-violet-600 text-white shadow-lg shadow-violet-500/10 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-widest transition-all active:scale-95"
            >
              Deploy Fine Tuning Pod
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}