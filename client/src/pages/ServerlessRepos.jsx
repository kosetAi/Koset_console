// src/pages/ServerlessRepos.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiSearch,
  FiStar,
  FiChevronDown,
  FiClock,
  FiExternalLink,
} from "react-icons/fi";

/**
 * ServerlessRepos page (Hub entry)
 *
 * - Tabs on top navigate to existing routes:
 *   /repos  -> Serverless Repos (this page)
 *   /templates -> Pod Templates
 *   /endpoints -> Public Endpoints
 *
 * This ensures tab clicks update the URL and work together with the sidebar.
 */

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

  // derive activeTab from pathname so both sidebar and tabs stay in sync
  const path = (location.pathname || "").toLowerCase();
  const activeTab = path.startsWith("/templates")
    ? "templates"
    : path.startsWith("/endpoints")
    ? "endpoints"
    : "repos";

  // local UI state (search & filters apply to current page content)
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Most Popular");

  // data for the current tab: since we use route navigation, this file is the repos page.
  // We still show sampleRepos here; /templates and /endpoints are separate pages.
  const currentList = useMemo(() => sampleRepos, []);

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return currentList.filter((it) => {
      // 'add' card should always remain visible when searching empty or matching
      if (
        it.id === "add" &&
        (!qLower || it.name.toLowerCase().includes(qLower))
      )
        return true;

      const matchesQ =
        !qLower ||
        (it.name && it.name.toLowerCase().includes(qLower)) ||
        (it.desc && it.desc.toLowerCase().includes(qLower));
      const matchesCategory = category === "All" || it.category === category;
      return matchesQ && matchesCategory;
    });
  }, [currentList, q, category]);

  function goToTab(tabKey) {
    if (tabKey === "repos") navigate("/repos");
    else if (tabKey === "templates") navigate("/templates");
    else if (tabKey === "endpoints") navigate("/endpoints");
  }

  return (
    <div className="p-8 text-white space-y-6">
      {/* HERO */}
      <div className="bg-[#0c0d0f] rounded-xl border border-[#161616] p-8 relative overflow-hidden">
        {/* faint decorative icon groups (left/right) */}
        <div
          className="absolute left-6 top-8 grid gap-3"
          style={{ gridTemplateColumns: "repeat(3, 42px)" }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-10 rounded-lg bg-[#0f1112] border border-[#141416] opacity-30"
            />
          ))}
        </div>

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
                className="w-full bg-[#0f1112] border border-[#222] px-4 py-3 rounded-lg text-sm placeholder:text-gray-500 focus:ring-0 outline-none"
              />
              <FiSearch className="absolute right-4 top-3 text-gray-400" />
            </div>
          </div>

          <div
            className="absolute right-6 top-8 grid gap-3"
            style={{ gridTemplateColumns: "repeat(3, 42px)" }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-10 rounded-lg bg-[#0f1112] border border-[#141416] opacity-30"
              />
            ))}
          </div>
        </div>
      </div>

      {/* TABS (navigate to existing routes so sidebar/history stays in sync) */}
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

      {/* FILTER ROW */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-3 items-center flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 text-sm rounded-md transition ${
                category === c
                  ? "bg-purple-600 text-white"
                  : "border border-[#2a2a2a] text-gray-300 hover:bg-[#101214]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setSort((s) => (s === "Most Popular" ? "Newest" : "Most Popular"))
            }
            className="bg-[#0f1112] px-3 py-1.5 rounded border border-[#222] text-sm flex items-center gap-2"
          >
            {sort} <FiChevronDown />
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((item) => {
          if (item.id === "add") {
            return (
              <div
                key="add"
                className="border border-dashed border-[#2f2f2f] rounded-lg p-6 flex flex-col justify-between bg-[#0e0f10]"
              >
                <div>
                  <div className="text-3xl mb-4">▦</div>
                  <h3 className="font-semibold text-lg">Add your repo</h3>
                  <p className="text-gray-400 text-sm mt-2">
                    Add your own repo to the Runpod Hub!
                  </p>
                </div>
                <div className="mt-6">
                  <button className="w-full bg-purple-600 text-black px-4 py-2 rounded font-medium">
                    Get Started
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className="bg-[#0e0f10] border border-[#1b1b1b] rounded-lg p-5 hover:shadow-lg hover:shadow-purple-900/20 transition cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-md flex items-center justify-center text-2xl bg-[#141416]">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-3">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  {item.tag && (
                    <span className="px-2 py-1 border border-[#222] rounded text-[11px]">
                      {item.tag}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <FiStar />
                    <span>{shortNum(item.installs)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="border border-[#222] px-2 py-1 rounded text-[11px]">
                    {item.category}
                  </div>
                  <div className="text-gray-500">⋅</div>
                  <div className="text-gray-400 text-xs">
                    <FiClock className="inline mr-1" />—
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
