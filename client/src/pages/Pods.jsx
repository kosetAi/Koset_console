import React, { useEffect, useMemo, useState } from "react";
import VRAMSlider from "../components/VRAMSlider.jsx";
import GPUCard from "../components/GPUCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { get } from "../api.js";
import Loader from "../components/Loader.jsx";

// ------------ AUTO CATEGORY DETECTION ------------
function categoryFromName(name = "") {
  
  const n = name.toUpperCase();
  if (n.includes("5090") || n.includes("5080")) return "NVIDIA Latest Gen";
  if (n.includes("H200") || n.includes("H100") || n.includes("B200"))
    return "NVIDIA H & B Series";
  if (
    n.includes("A40") ||
    n.includes("A100") ||
    n.includes("A4000") ||
    n.includes("A4500") ||
    n.includes("A5000") ||
    n.includes("A6000")
  )
    return "NVIDIA Previous Gen";
  if (n.includes("3090") || n.includes("3080") || n.includes("3070"))
    return "NVIDIA GeForce";
  if (n.startsWith("MI") || n.includes("AMD")) return "AMD";
  return "Other";
}

const CATEGORY_ORDER = [
  "Featured GPUs",
  "NVIDIA Latest Gen",
  "NVIDIA H & B Series",
  "NVIDIA Previous Gen",
  "NVIDIA GeForce",
  "AMD",
  "Other",
];

export default function Pods() {
  const [isPageReady, setIsPageReady] = useState(false);
  useEffect(() => {
    // Simulate a brief delay or wait for actual data
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 1200); // 1.2 seconds feels snappy but professional

    return () => clearTimeout(timer);
  }, []);
  const [gpus, setGpus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [minVram, setMinVram] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("vram");
  const [instanceType, setInstanceType] = useState("GPU");

  async function loadGPUs(vram) {
    try {
      setLoading(true);
      const res = await get(`/gpu?minVram=${vram || 0}`);
      if (!res.ok) {
        setError(res.error || "Failed to load GPUs");
        setGpus([]);
      } else {
        setGpus(res.gpus || []);
      }
    } catch (e) {
      setError("Unable to reach backend server.");
      setGpus([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGPUs(0);
  }, []);
  useEffect(() => {
    setMinVram(0);
  }, []);

  const maxVRAM = useMemo(() => {
    if (!gpus.length) return 200;
    return Math.max(...gpus.map((g) => g.vram || 0)) + 20;
  }, [gpus]);

  // ---------------- UPDATED FILTER + SORT + GROUP ----------------
  const grouped = useMemo(() => {
    if (!gpus.length) return [];

    // 1) INITIAL FILTER: VRAM + SEARCH
    let list = gpus.filter((g) => {
      const matchesVram = Number(g.vram || 0) >= minVram;
      const matchesSearch =
        !search.trim() ||
        g.name?.toLowerCase().includes(search.trim().toLowerCase());
      return matchesVram && matchesSearch;
    });

    // 2) FUNCTIONAL SORTING LOGIC
    list.sort((a, b) => {
      if (sortBy === "vram") {
        // Sort by VRAM Descending (Highest first)
        return (b.vram || 0) - (a.vram || 0);
      }
      if (sortBy === "price") {
        // Sort by Price Ascending (Cheapest first)
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === "name") {
        // Alphabetical sort
        return (a.name || "").localeCompare(b.name || "");
      }
      return 0;
    });

    // 3) CATEGORY GROUPING
    const buckets = new Map();

    // Handle Featured First
    const featured = list.filter((g) => g.isFeatured);
    if (featured.length) buckets.set("Featured GPUs", featured);

    // Group remaining into buckets
    for (const g of list.filter((g) => !g.isFeatured)) {
      const cat = categoryFromName(g.name);
      if (!buckets.has(cat)) buckets.set(cat, []);
      buckets.get(cat).push(g);
    }

    // 4) FINAL ORDERED OUTPUT
    const ordered = [];
    for (const cat of CATEGORY_ORDER) {
      if (buckets.has(cat)) ordered.push([cat, buckets.get(cat)]);
    }
    return ordered;
  }, [gpus, minVram, search, sortBy]);

  if (!isPageReady) return <Loader />;
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Deploy a Pod</h1>
          <p className="text-xs text-gray-400">
            Choose the right GPU based on VRAM, RAM, CPU, and availability.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto hide-scrollbar pb-1 sm:pb-0">
          <div className="inline-flex text-xs rounded-lg bg-[#111317] border border-gray-700 flex-shrink-0">
            <button
              onClick={() => setInstanceType("GPU")}
              className={`px-3 py-1.5 transition-colors ${instanceType === "GPU" ? "bg-violet-500 text-white" : "text-gray-400 hover:text-white"}`}
            >
              GPU
            </button>
            <button
              onClick={() => setInstanceType("CPU")}
              className={`px-3 py-1.5 transition-colors ${instanceType === "CPU" ? "bg-violet-500 text-white" : "text-gray-500 hover:text-white"}`}
            >
              CPU
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-[#111317] border border-gray-700 rounded-lg px-2 py-1.5 text-gray-300 outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="vram">Sort by VRAM</option>
            <option value="price">Sort by price</option>
            <option value="name">Sort by name</option>
          </select>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-[#15181d] border border-gray-700 rounded-xl p-4 space-y-5">
        <VRAMSlider value={minVram} onChange={setMinVram} max={maxVRAM} />
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="flex gap-2 text-[10px] sm:text-xs overflow-x-auto hide-scrollbar pb-1 md:pb-0">
            {["Secure Cloud", "Any Region", "Additional Filters"].map((btn) => (
              <button
                key={btn}
                className="px-3 py-2 rounded-lg bg-[#111317] border border-gray-700 text-gray-200 whitespace-nowrap hover:border-violet-500/50 transition-colors"
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GPU LIST RENDER */}
      {loading ? (
        <p className="text-gray-300 text-sm">Loading GPUs…</p>
      ) : error ? (
        <p className="text-red-400 bg-red-900/30 border border-red-700 rounded-lg p-3 text-sm">
          API Error: {error}
        </p>
      ) : grouped.length === 0 ? (
        <p className="text-gray-300 text-sm">
          No GPUs match the current filters.
        </p>
      ) : (
        grouped.map(([category, items]) => (
          <div key={category} className="mb-8">
            <h2 className="text-sm font-semibold text-gray-200 mb-3 uppercase tracking-wider">
              {category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((gpu) => (
                <GPUCard key={gpu._id || gpu.name} gpu={gpu} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
