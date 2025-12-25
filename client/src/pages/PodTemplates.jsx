// src/pages/PodTemplates.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

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

  // derive activeTab from pathname so both sidebar and tabs stay in sync
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
    <div className="p-8 text-white space-y-6">
      {/* HERO (same header as ServerlessRepos) */}
      <div className="bg-[#0c0d0f] rounded-xl border border-[#161616] p-8 relative overflow-hidden">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-semibold mb-5">
            Kickstart Your Next Project
          </h1>

          <div className="w-full max-w-2xl">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full bg-[#0f1112] border border-[#222] px-4 py-3 rounded-lg text-sm placeholder:text-gray-500 outline-none"
              />
              <FiSearch className="absolute right-4 top-3 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div>
        <div className="flex items-end gap-6 border-b border-[#1b1b1b] pb-2">
          <button
            onClick={() => goToTab("repos")}
            className={`pb-2 text-sm ${
              activeTab === "repos"
                ? "text-purple-400 border-b-2 border-purple-600"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Serverless Repos
          </button>

          <button
            onClick={() => goToTab("templates")}
            className={`pb-2 text-sm ${
              activeTab === "templates"
                ? "text-purple-400 border-b-2 border-purple-600"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Pod Templates
          </button>

          <button
            onClick={() => goToTab("endpoints")}
            className={`pb-2 text-sm ${
              activeTab === "endpoints"
                ? "text-purple-400 border-b-2 border-purple-600"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Public Endpoints
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-3">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm transition ${
              filter === f
                ? "bg-purple-600 text-white"
                : "border border-[#2a2a2a] text-gray-300 hover:bg-[#101214]"
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
            className="bg-[#0e0f10] border border-[#1b1b1b] rounded-lg p-5 hover:shadow-lg hover:shadow-purple-900/20 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md flex items-center justify-center text-2xl bg-[#141416]">
                {t.icon}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-lg truncate">{t.name}</h3>
                <p className="text-gray-400 text-sm mt-1 line-clamp-3">
                  {t.desc}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
              <div className="text-gray-300">{t.tag}</div>
              <div className="text-gray-500">Runpod</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
