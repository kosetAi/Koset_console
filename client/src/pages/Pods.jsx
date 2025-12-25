import React, { useEffect, useMemo, useState } from "react";
import VRAMSlider from "../components/VRAMSlider.jsx";
import GPUCard from "../components/GPUCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { get } from "../api.js";

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

// -------------- MAIN COMPONENT -------------------
export default function Pods() {
  const [gpus, setGpus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [minVram, setMinVram] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("vram");
  const [instanceType, setInstanceType] = useState("GPU");

  // LOAD GPUs FROM BACKEND
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

  // First load
  useEffect(() => {
    loadGPUs(0);
  }, []);

  // Reset VRAM slider on mount
  useEffect(() => {
    setMinVram(0);
  }, []);

  // Dynamic slider max (auto detect from your DB)
  const maxVRAM = useMemo(() => {
    if (!gpus.length) return 200;
    return Math.max(...gpus.map((g) => g.vram || 0)) + 20;
  }, [gpus]);

  // ---------------- FILTER + SORT + GROUP ----------------
  const grouped = useMemo(() => {
    if (!gpus.length) return [];

    let list = [...gpus];

    // 1) FILTER: VRAM >= slider
    list = list.filter((g) => Number(g.vram || 0) >= minVram);

    // 2) SEARCH
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((g) => g.name?.toLowerCase().includes(q));
    }

    // 3) SORT — CLOSEST-TO-SLIDER FIRST THEN ASCENDING
    list.sort((a, b) => {
      const distA = Math.abs(a.vram - minVram);
      const distB = Math.abs(b.vram - minVram);

      if (distA !== distB) return distA - distB;

      return a.vram - b.vram; // true ascending
    });

    // 4) AUTO GROUPING
    const buckets = new Map();

    // Featured first
    const featured = list.filter((g) => g.isFeatured);
    if (featured.length) buckets.set("Featured GPUs", featured);

    // Other categories
    for (const g of list.filter((g) => !g.isFeatured)) {
      const cat = categoryFromName(g.name);
      if (!buckets.has(cat)) buckets.set(cat, []);
      buckets.get(cat).push(g);
    }

    // ORDERED RESULT
    const ordered = [];
    for (const cat of CATEGORY_ORDER) {
      if (buckets.has(cat)) ordered.push([cat, buckets.get(cat)]);
    }

    return ordered;
  }, [gpus, minVram, search, sortBy]);

  // SECTION RENDER
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-white">Deploy a Pod</h1>
          <p className="text-xs text-gray-400">
            Choose the right GPU based on VRAM, RAM, CPU, and availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* GPU / CPU Toggle */}
          <div className="inline-flex text-xs rounded-lg bg-[#111317] border border-gray-700">
            <button
              onClick={() => setInstanceType("GPU")}
              className={`px-3 py-1.5 ${
                instanceType === "GPU"
                  ? "bg-violet-500 text-white"
                  : "text-gray-400"
              }`}
            >
              GPU
            </button>
            <button
              onClick={() => setInstanceType("CPU")}
              className={`px-3 py-1.5 ${
                instanceType === "CPU"
                  ? "bg-violet-500 text-white"
                  : "text-gray-500"
              }`}
            >
              CPU
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-[#111317] border border-gray-700 rounded-lg px-2 py-1.5 text-gray-300"
          >
            <option value="vram">Sort by VRAM</option>
            <option value="price">Sort by price</option>
            <option value="name">Sort by name</option>
          </select>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-[#15181d] border border-gray-700 rounded-xl p-4 space-y-4">
        <VRAMSlider value={minVram} onChange={setMinVram} max={maxVRAM} />

        <div className="flex flex-col md:flex-row gap-3">
          <SearchBar value={search} onChange={setSearch} />

          <div className="flex gap-2 text-xs">
            <button className="px-3 py-1.5 rounded-lg bg-[#111317] border border-gray-700 text-gray-200">
              Secure Cloud
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-[#111317] border border-gray-700 text-gray-200">
              Any Region
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-[#111317] border border-gray-700 text-gray-200">
              Additional Filters
            </button>
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
          <div key={category}>
            <h2 className="text-sm font-semibold text-gray-200 mb-2">
              {category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
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
