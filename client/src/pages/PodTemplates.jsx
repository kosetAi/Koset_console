// src/pages/PodTemplates.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiLock } from "react-icons/fi";
import Loader from "../components/Loader";

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
  const [isPageReady, setIsPageReady] = useState(false);
  useEffect(() => {
    // Simulate a brief delay or wait for actual data
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 1200); // 1.2 seconds feels snappy but professional

    return () => clearTimeout(timer);
  }, []);
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

  if (!isPageReady) return <Loader />;
  return (
    <div className="relative min-h-screen bg-[#09090B] text-white">
      
      {/* COMING SOON OVERLAY - FIXED TO VIEWPORT */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
        <div className="bg-[#121217]/90 border border-violet-500/20 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-2xl text-center max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-violet-600/20 rounded-2xl border border-violet-500/40">
              <FiLock className="text-violet-500 text-3xl" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 tracking-tight">Coming Soon</h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            The Pod Template Registry is currently being synchronized with our deployment clusters.
          </p>
          <div className="inline-block px-8 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-violet-500/20 uppercase tracking-widest">
            In Development
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-4 sm:p-8 space-y-6 blur-[8px] pointer-events-none select-none grayscale-[0.4]">
        
        {/* HERO */}
        <div className="bg-[#121217] rounded-xl border border-white/5 p-6 sm:p-10 flex flex-col items-center text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-5 text-white italic">
            Kickstart Your Next <span className="text-violet-600">Project</span>
          </h1>

          <div className="w-full max-w-2xl">
            <div className="relative">
              <input
                readOnly
                placeholder="Search templates..."
                className="w-full bg-[#18181B] border border-white/10 px-4 py-3 rounded-lg text-sm outline-none placeholder:text-gray-600 pr-10"
              />
              <FiSearch className="absolute right-4 top-3.5 text-gray-500" />
            </div>
          </div>
        </div>

        {/* TABS - Scrollable for small screens */}
        <div className="border-b border-white/5 flex gap-4 sm:gap-8 overflow-x-auto hide-scrollbar whitespace-nowrap">
          {["repos", "templates", "endpoints"].map((tab) => (
            <button
              key={tab}
              className={`pb-4 text-xs sm:text-sm transition-colors border-b-2 ${
                activeTab === tab
                  ? "text-violet-400 border-violet-600"
                  : "text-gray-500 border-transparent"
              }`}
            >
              {tab === "repos" ? "Serverless Repos" : tab === "templates" ? "Pod Templates" : "Public Endpoints"}
            </button>
          ))}
        </div>

        {/* FILTERS */}
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`px-4 py-1.5 rounded-md text-[10px] sm:text-xs transition border ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {list.map((t) => (
            <div
              key={t.id}
              className="bg-[#121217] border border-white/5 rounded-xl p-5 shadow-lg transition hover:bg-[#18181B] flex flex-col justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-[#18181B] border border-white/5 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
                  {t.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white text-sm sm:text-base truncate">{t.name}</h3>
                  <p className="text-gray-400 text-[11px] sm:text-xs mt-1 line-clamp-2 font-mono opacity-80">
                    {t.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-[9px] sm:text-[10px] font-medium tracking-wider uppercase">
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