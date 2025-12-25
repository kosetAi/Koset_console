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
    <div className="p-10 text-white space-y-8">

      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold">Fine Tuning</h1>

      {/* MAIN CARD */}
      <div className="max-w-3xl bg-[#111315] border border-gray-700 rounded-xl px-8 py-10 space-y-8">

        {/* Subtitle */}
        <p className="text-gray-400 leading-relaxed">
          Start fine tuning a large language model with minimal config.&nbsp;
          <a
            href="#"
            className="text-purple-400 underline hover:text-purple-300 transition"
          >
            Read our Fine Tuning tutorial.
          </a>
        </p>

        {/* FORM FIELDS */}
        <div className="space-y-6">

          {/* Base Model */}
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Base Model <span className="text-gray-500 text-xs">(Required)</span>
            </label>
            <input
              type="text"
              value={modelUrl}
              onChange={(e) => setModelUrl(e.target.value)}
              placeholder="https://huggingface.co/organization/model-name"
              className="w-full bg-[#0B0E11] border border-gray-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* Hugging Face Token */}
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Hugging Face Access Token
            </label>
            <div className="relative">
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="hf_*********************"
                className="w-full bg-[#0B0E11] border border-gray-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-purple-500 transition"
              />
              <FiLock className="absolute right-3 top-3 text-gray-400 text-lg" />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              You can create a token in your Hugging Face account settings.
            </p>
          </div>

          {/* Dataset URL */}
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Dataset (Optional)
            </label>
            <input
              type="text"
              value={dataset}
              onChange={(e) => setDataset(e.target.value)}
              placeholder="https://huggingface.co/datasets/organization/dataset-name"
              className="w-full bg-[#0B0E11] border border-gray-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-purple-500 transition"
            />
          </div>

        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            onClick={deploy}
            className="w-fit px-6 py-2 bg-purple-600 hover:bg-purple-500 transition shadow-lg rounded-lg text-sm font-semibold"
          >
            Deploy Fine Tuning Pod
          </button>
        </div>
      </div>
    </div>
  );
}
