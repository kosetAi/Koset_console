// client/src/pages/Serverless.jsx

import React, { useEffect, useState } from "react";
import { FiSearch, FiLock } from "react-icons/fi";
import { HiRefresh } from "react-icons/hi";
import { AiOutlinePlus } from "react-icons/ai";
import Loader from "../components/Loader";

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
  const [isPageReady, setIsPageReady] = useState(false);
  useEffect(() => {
    // Simulate a brief delay or wait for actual data
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 1200); // 1.2 seconds feels snappy but professional

    return () => clearTimeout(timer);
  }, []);
  const [search, setSearch] = useState("");

  const filtered = readyRepos.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isPageReady) return <Loader />;
  return (
    <div className="relative min-h-screen bg-[#09090B] text-white">
      
      {/* COMING SOON OVERLAY - FIXED POSITION TO STAY IN CENTER DURING SCROLL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
        <div className="bg-[#121217]/90 border border-violet-500/20 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-2xl text-center max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-violet-600/20 rounded-2xl border border-violet-500/40">
              <FiLock className="text-violet-500 text-3xl" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 tracking-tight">Coming Soon</h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            The Serverless GPU engine is currently being integrated with our orchestration layer.
          </p>
          <div className="inline-block px-8 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-violet-500/20 uppercase tracking-widest">
            In Development
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-4 sm:p-8 space-y-6 sm:space-y-10 blur-[8px] pointer-events-none select-none grayscale-[0.4]">

        {/* HEADER - RESPONSIVE STACKING */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Serverless</h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button className="bg-violet-600 hover:bg-violet-500 rounded-md text-sm px-4 py-2.5 flex items-center justify-center gap-2 transition font-semibold shadow-md shadow-violet-500/10 order-2 sm:order-1">
              <AiOutlinePlus className="text-md" /> New Endpoint
            </button>

            <div className="flex items-center justify-between sm:justify-start gap-3 text-gray-400 bg-[#121217] border border-white/5 px-4 py-2 rounded-md order-1 sm:order-2">
              <p className="text-xs sm:text-sm">0/5 Workers Deployed</p>
              <HiRefresh className="cursor-pointer hover:text-white transition text-xl" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md">
          <input
            readOnly
            type="text"
            placeholder="Search endpoints"
            className="bg-[#121217] border border-white/10 px-4 py-3 sm:py-2 rounded-md text-sm w-full outline-none placeholder:text-gray-600"
            value={search}
          />
          <FiSearch className="absolute right-3 top-3.5 sm:top-2.5 text-gray-500 text-lg" />
        </div>

        {/* Empty State Box */}
        <div className="bg-[#121217] border border-white/5 p-6 sm:p-12 rounded-xl text-center shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">Autoscale with Serverless</h2>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed text-sm">
            Koset supports scalable GPU workloads. Choose from recommended models,
            deploy API endpoints, or bring your own docker runtime.
          </p>
          <button className="text-violet-400 text-sm font-medium underline block mx-auto mt-4 hover:text-violet-300 transition">
            Tutorials →
          </button>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h2 className="text-lg font-semibold text-gray-200 uppercase tracking-wider">Ready-to-Deploy Repos</h2>
          <button className="text-violet-400 text-xs sm:text-sm font-medium hover:text-violet-300 transition">
            Browse hub →
          </button>
        </div>

        {/* CARD GRID - FULLY RESPONSIVE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filtered.map((item, index) => (
            <div
              key={index}
              className="bg-[#121217] border border-white/5 p-6 rounded-xl shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-5 bg-[#18181B] w-12 h-12 flex items-center justify-center rounded-lg border border-white/5 shadow-inner">
                  {item.icon}
                </div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
                  <span className="shrink-0 text-[9px] sm:text-[10px] font-mono text-gray-500 bg-[#18181B] border border-white/10 px-2 py-0.5 rounded">
                    {item.tag}
                  </span>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-3">{item.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] sm:text-xs text-violet-400/70 flex items-center gap-1.5 uppercase font-bold tracking-widest">
                <span className="h-1.5 w-1.5 bg-violet-500 rounded-full animate-pulse" />
                {item.source} Repository
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}