// src/pages/PodTemplates.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiLock } from "react-icons/fi";

const FILTERS = ["All", "Official", "Community"];

const templates = [
  {
    id: "pytorch-2-1",
    name: "Runpod Pytorch 2.1",
    desc: "runpod/pytorch:2.1.0-py3.10-cuda11.8.0-dev-ubuntu22.04",
    tag: "Official",
    icon: "🔥",
  },
  {
    id: "comfyui",
    name: "ComfyUI",
    desc: "runpod/comfyui:latest",
    tag: "Community",
    icon: "🧩",
  },
  {
    id: "ubuntu-22",
    name: "Runpod Ubuntu 22.04",
    desc: "runpod/base:1.0.2-ubuntu2204",
    tag: "Official",
    icon: "🐧",
  },
];

export default function PodTemplates() {
  const navigate = useNavigate();
  const location = useLocation();

  const path = (location.pathname || "").toLowerCase();
  const activeTab = path.startsWith("/templates")
    ? "templates"
    : path.startsWith("/endpoints")
    ? "endpoints"
    : "repos";

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");

  const list = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return templates.filter((t) => {
      const matchesQ =
        !qLower ||
        t.name.toLowerCase().includes(qLower) ||
        t.desc.toLowerCase().includes(qLower);
      const matchesFilter = filter === "All" || t.tag === filter;
      return matchesQ && matchesFilter;
    });
  }, [q, filter]);

  function goToTab(tabKey) {
    if (tabKey === "repos") navigate("/repos");
    else if (tabKey === "templates") navigate("/templates");
    else if (tabKey === "endpoints") navigate("/endpoints");
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
            The Pod Template Registry is currently being synchronized with our deployment clusters.
          </p>
          <div className="inline-block px-6 py-2 bg-violet-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-violet-500/20">
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
                placeholder="Search templates..."
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
                  : "text-gray-400"
              }`}
            >
              {tab === "repos" ? "Serverless Repos" : tab === "templates" ? "Pod Templates" : "Public Endpoints"}
            </button>
          ))}
        </div>

        {/* FILTERS */}
        <div className="flex items-center gap-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`px-4 py-1.5 rounded-md text-xs transition border ${
                filter === f
                  ? "bg-violet-600 border-violet-500 text-white"
                  : "border-white/5 text-gray-400 bg-[#121217] hover:bg-[#18181B]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((t) => (
            <div
              key={t.id}
              className="bg-[#121217] border border-white/5 rounded-xl p-5 shadow-lg transition hover:bg-[#18181B]"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-[#18181B] border border-white/5 flex items-center justify-center text-2xl shadow-inner">
                  {t.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white truncate">{t.name}</h3>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-2 font-mono opacity-80">
                    {t.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-[10px] font-medium tracking-wider uppercase">
                <div className="text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                  {t.tag}
                </div>
                <div className="text-gray-600">Runpod Official</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}