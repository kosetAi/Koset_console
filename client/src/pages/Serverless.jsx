// client/src/pages/Serverless.jsx

import React, { useState } from "react";
import { FiSearch, FiLock } from "react-icons/fi";
import { HiRefresh } from "react-icons/hi";
import { AiOutlinePlus } from "react-icons/ai";

const readyRepos = [
  {
    name: "Axolotl Fine-Tuning",
    tag: "v0.12.2",
    desc: "Serverless fine-tuning of open-source LLMs with Axolotl. Supports LoRA, QLoRA, DPO, and more using Hugging Face models.",
    icon: "🐍",
    source: "Official",
  },
  {
    name: "ComfyUI",
    tag: "5.5.1",
    desc: "Generate images with ComfyUI using FLUX-1-dev (fp8).",
    icon: "🧩",
    source: "Community",
  },
  {
    name: "vLLM",
    tag: "v2.10.0",
    desc: "Deploy OpenAI-Compatible, blazing-fast inference endpoints with vLLM.",
    icon: "⚡",
    source: "Official",
  },
];

export default function Serverless() {
  const [search, setSearch] = useState("");

  const filtered = readyRepos.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

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
            The Serverless GPU engine is currently being integrated with our orchestration layer.
          </p>
          <div className="inline-block px-6 py-2 bg-violet-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-violet-500/20">
            In Development
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-8 space-y-10 blur-[6px] pointer-events-none select-none grayscale-[0.4]">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Serverless</h1>

          <div className="flex gap-3 text-white">
            <button className="bg-violet-600 hover:bg-violet-500 rounded-md text-sm px-4 py-2 flex items-center gap-2 transition font-semibold shadow-md shadow-violet-500/10">
              <AiOutlinePlus className="text-md" /> New Endpoint
            </button>

            <div className="flex items-center gap-2 text-gray-400 bg-[#121217] border border-white/5 px-3 py-1.5 rounded-md">
              <p className="text-sm">0/5 Workers Deployed</p>
              <HiRefresh className="cursor-pointer hover:text-white transition text-xl" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <input
            readOnly
            type="text"
            placeholder="Search endpoints"
            className="bg-[#121217] border border-white/10 px-4 py-2 rounded-md text-sm w-full outline-none"
            value={search}
          />
          <FiSearch className="absolute right-3 top-2.5 text-gray-500 text-lg" />
        </div>

        {/* Empty State Box */}
        <div className="bg-[#121217] border border-white/5 p-10 rounded-xl text-center shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Autoscale with Serverless</h2>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed text-sm">
            Koset supports scalable GPU workloads. Choose from recommended models,
            deploy API endpoints, or bring your own docker runtime.
          </p>
          <button className="text-violet-400 text-sm underline block mx-auto mt-3 hover:text-violet-300 transition">
            Tutorials →
          </button>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ready-to-Deploy Repos</h2>
          <button className="text-violet-400 text-sm hover:text-violet-300 transition">
            Browse hub →
          </button>
        </div>

        {/* CARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((item, index) => (
            <div
              key={index}
              className="bg-[#121217] border border-white/5 p-6 rounded-lg shadow-lg"
            >
              <div className="text-3xl mb-4 bg-[#18181B] w-12 h-12 flex items-center justify-center rounded-lg border border-white/5 shadow-inner">
                {item.icon}
              </div>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <span className="text-[10px] font-mono text-gray-500 bg-[#18181B] border border-white/10 px-2 py-0.5 rounded">
                  {item.tag}
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">{item.desc}</p>

              <div className="mt-5 text-xs text-violet-400/70 flex items-center gap-1.5 uppercase font-medium tracking-wider">
                <span className="h-1 w-1 bg-violet-500 rounded-full" />
                {item.source} Repository
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}