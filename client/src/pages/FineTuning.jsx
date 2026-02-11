// client/src/pages/FineTuning.jsx

import React, { useState } from "react";
import { FiLock } from "react-icons/fi";

export default function FineTuning() {
  const [modelUrl, setModelUrl] = useState("");
  const [token, setToken] = useState("");
  const [dataset, setDataset] = useState("");

  function deploy() {
    alert("🚀 Fine-tuning pod will be deployed soon!");
    // Later this will call backend → /fine-tune/deploy
  }

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
            The Fine-Tuning orchestration engine is being optimized for distributed LoRA and QLoRA training workflows.
          </p>
          <div className="inline-block px-6 py-2 bg-violet-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-violet-500/20">
            In Development
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-10 space-y-8 blur-[6px] pointer-events-none select-none grayscale-[0.4]">

        {/* PAGE TITLE */}
        <h1 className="text-2xl font-bold">Fine Tuning</h1>

        {/* MAIN CARD */}
        <div className="max-w-3xl bg-[#121217] border border-white/5 rounded-xl px-8 py-10 space-y-8 shadow-xl">

          {/* Subtitle */}
          <p className="text-gray-400 leading-relaxed text-sm">
            Start fine tuning a large language model with minimal config.&nbsp;
            <button
              className="text-violet-400 underline hover:text-violet-300 transition"
            >
              Read our Fine Tuning tutorial.
            </button>
          </p>

          {/* FORM FIELDS */}
          <div className="space-y-6">

            {/* Base Model */}
            <div>
              <label className="text-sm text-gray-300 mb-1.5 block">
                Base Model <span className="text-gray-500 text-xs">(Required)</span>
              </label>
              <input
                readOnly
                type="text"
                value={modelUrl}
                placeholder="https://huggingface.co/organization/model-name"
                className="w-full bg-[#0B0E11] border border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none placeholder:text-gray-600"
              />
            </div>

            {/* Hugging Face Token */}
            <div>
              <label className="text-sm text-gray-300 mb-1.5 block">
                Hugging Face Access Token
              </label>
              <div className="relative">
                <input
                  readOnly
                  type="password"
                  value={token}
                  placeholder="hf_*********************"
                  className="w-full bg-[#0B0E11] border border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none"
                />
                <FiLock className="absolute right-3 top-3.5 text-gray-600 text-lg" />
              </div>
              <p className="text-[11px] text-gray-500 mt-2">
                You can create a token in your Hugging Face account settings.
              </p>
            </div>

            {/* Dataset URL */}
            <div>
              <label className="text-sm text-gray-300 mb-1.5 block">
                Dataset (Optional)
              </label>
              <input
                readOnly
                type="text"
                value={dataset}
                placeholder="https://huggingface.co/datasets/organization/dataset-name"
                className="w-full bg-[#0B0E11] border border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none placeholder:text-gray-600"
              />
            </div>

          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              className="w-fit px-8 py-2.5 bg-violet-600 text-white shadow-lg shadow-violet-500/10 rounded-lg text-sm font-semibold uppercase tracking-wide"
            >
              Deploy Fine Tuning Pod
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}