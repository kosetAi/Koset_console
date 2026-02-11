// src/pages/ServerlessRepos.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiSearch,
  FiStar,
  FiChevronDown,
  FiClock,
  FiLock,
} from "react-icons/fi";

const CATEGORIES = ["All", "Image", "Video", "Audio", "Language", "Embedding"];

const sampleRepos = [
  {
    id: "add",
    name: "Add your repo",
    desc: "Add your own repo to the Runpod Hub!",
    icon: "▦",
    installs: null,
    tag: null,
    category: "All",
  },
  {
    id: "axolotl",
    name: "Axolotl Fine-Tuning",
    desc: "Serverless fine-tuning of open-source LLMs with Axolotl. Supports LoRA, QLoRA, DPO and more.",
    icon: "🦎",
    installs: 10855,
    tag: "v0.12.2",
    category: "Language",
  },
  {
    id: "comfyui",
    name: "ComfyUI",
    desc: "Generate images with ComfyUI using FLUX.1-dev (fp8).",
    icon: "🧩",
    installs: 605,
    tag: "5.5.1",
    category: "Image",
  },
  {
    id: "vllm",
    name: "vLLM",
    desc: "Deploy OpenAI-Compatible blazing-fast LLM endpoints powered by vLLM.",
    icon: "▦",
    installs: 385,
    tag: "v2.11.0",
    category: "Language",
  },
];

function shortNum(n) {
  if (n === null || n === undefined) return "";
  if (n >= 1000) return `${Math.round(n / 100) / 10}K`;
  return `${n}`;
}

export default function ServerlessRepos() {
  const navigate = useNavigate();
  const location = useLocation();

  const path = (location.pathname || "").toLowerCase();
  const activeTab = path.startsWith("/templates")
    ? "templates"
    : path.startsWith("/endpoints")
    ? "endpoints"
    : "repos";

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Most Popular");

  const currentList = useMemo(() => sampleRepos, []);

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return currentList.filter((it) => {
      if (it.id === "add" && (!qLower || it.name.toLowerCase().includes(qLower)))
        return true;

      const matchesQ =
        !qLower ||
        (it.name && it.name.toLowerCase().includes(qLower)) ||
        (it.desc && it.desc.toLowerCase().includes(qLower));
      const matchesCategory = category === "All" || it.category === category;
      return matchesQ && matchesCategory;
    });
  }, [currentList, q, category]);

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
            The Serverless Repository Hub is currently undergoing core synchronization.
          </p>
          <div className="inline-block px-6 py-2 bg-violet-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-violet-600/20">
            In Development
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-8 space-y-6 blur-[6px] pointer-events-none select-none grayscale-[0.4]">
        
        {/* HERO */}
        <div className="bg-[#121217] rounded-xl border border-white/5 p-8 flex flex-col items-center">
          <h1 className="text-3xl font-semibold mb-5 text-white italic">
            Kickstart Your Next <span className="text-violet-600">Project</span>
          </h1>

          <div className="w-full max-w-2xl">
            <div className="relative">
              <input
                readOnly
                placeholder="What are you looking for?"
                className="w-full bg-[#18181B] border border-white/10 px-4 py-3 rounded-lg text-sm outline-none placeholder:text-gray-600"
              />
              <FiSearch className="absolute right-4 top-3 text-gray-500" />
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="border-b border-white/5 flex gap-8">
          {["repos", "templates", "endpoints"].map((tab) => (
            <button
              key={tab}
              className={`pb-4 text-sm transition-colors ${
                activeTab === tab
                  ? "text-violet-400 border-b-2 border-violet-600"
                  : "text-gray-500"
              }`}
            >
              {tab === "repos" ? "Serverless Repos" : tab === "templates" ? "Pod Templates" : "Public Endpoints"}
            </button>
          ))}
        </div>

        {/* FILTER ROW */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2 items-center flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`px-3 py-1.5 text-xs rounded-md border transition ${
                  category === c
                    ? "bg-violet-600 border-violet-500 text-white"
                    : "border-white/5 text-gray-400 bg-[#121217] hover:bg-[#18181B]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="bg-[#121217] px-3 py-1.5 rounded-md border border-white/5 text-xs text-gray-400 flex items-center gap-2">
            {sort} <FiChevronDown />
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-5 flex flex-col justify-between transition ${
                item.id === "add" 
                ? "border-dashed border-white/10 bg-transparent" 
                : "bg-[#121217] border-white/5 shadow-lg"
              }`}
            >
              <div>
                <div className="h-10 w-10 rounded-lg bg-[#18181B] border border-white/5 flex items-center justify-center text-xl mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-white">{item.name}</h3>
                <p className="text-gray-400 text-xs mt-2 leading-relaxed line-clamp-2">{item.desc}</p>
              </div>
              
              <div className="mt-6 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <FiStar className="text-violet-500" />
                  {shortNum(item.installs) || "0"}
                </div>
                <div className="text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                  {item.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}