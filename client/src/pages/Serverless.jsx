// client/src/pages/Serverless.jsx

import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
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
    <div className="p-8 text-white space-y-10">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Serverless</h1>

        <div className="flex gap-3">
          <button className="bg-purple-600 hover:bg-purple-500 rounded-md text-sm px-4 py-2 flex items-center gap-2 transition">
            <AiOutlinePlus className="text-md" /> New Endpoint
          </button>

          <div className="flex items-center gap-2 text-gray-400">
            <p className="text-sm">0/5 Workers Deployed</p>
            <HiRefresh className="cursor-pointer hover:text-white transition text-xl" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search endpoints"
          className="bg-[#111315] border border-gray-700 px-4 py-2 rounded-md text-sm w-full outline-none focus:border-purple-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FiSearch className="absolute right-3 top-2.5 text-gray-400 text-lg" />
      </div>

      {/* Empty State Box */}
      <div className="bg-[#111315] border border-gray-700 p-10 rounded-xl text-center">
        <h2 className="text-xl font-semibold mb-2">Autoscale with Serverless</h2>
        <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
          Koset supports scalable GPU workloads. Choose from recommended models,
          deploy API endpoints, or bring your own docker runtime.
        </p>
        <a
          href="#"
          className="text-purple-400 text-sm underline block mt-3 hover:text-purple-300 transition"
        >
          Tutorials →
        </a>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Ready-to-Deploy Repos</h2>
        <button className="text-purple-400 text-sm hover:text-purple-300 transition">
          Browse hub →
        </button>
      </div>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {filtered.map((item, index) => (
          <div
            key={index}
            className="bg-[#111315] border border-gray-700 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-900/20 transition p-6 rounded-lg cursor-pointer"
          >
            <div className="text-3xl mb-4">{item.icon}</div>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <span className="text-xs bg-gray-800 border border-gray-600 px-2 py-1 rounded-md">
                {item.tag}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-2">{item.desc}</p>

            <div className="mt-5 text-xs text-gray-500 flex items-center gap-1">
              🏷 {item.source}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
