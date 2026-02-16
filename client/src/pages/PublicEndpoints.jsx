// src/pages/PublicEndpoints.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiLock } from "react-icons/fi";
import Loader from "../components/Loader";

const CATEGORIES = ["All", "Image", "Video", "Audio", "Language", "Embedding"];

const ENDPOINTS = [
  {
    id: "sora",
    name: "openai / sora 2 i2v",
    desc: "OpenAI's Sora 2 is new state of the art video and audio generation model.",
    img: "https://dummyimage.com/800x450/222/888&text=Sora+2",
    category: "Video",
    tag: "image-to-video",
  },
  {
    id: "infinitetalk",
    name: "meigen-ai / infinitetalk",
    desc: "InfiniteTalk is an audio-driven conversational AI video generation model.",
    img: "https://dummyimage.com/800x450/2a2a2a/ccc&text=InfiniteTalk",
    category: "Video",
    tag: "image-to-video",
  },
  {
    id: "deepc",
    name: "Deep Cogito - 2.1",
    desc: "Optimized for STEM, coding and structured reasoning.",
    img: "https://dummyimage.com/800x450/333/ddd&text=Deep+Cogito",
    category: "Language",
    tag: "llm",
  },
];

export default function PublicEndpoints() {
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
  const [category, setCategory] = useState("All");

  const list = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return ENDPOINTS.filter((e) => {
      const matchesQ =
        !qLower ||
        e.name.toLowerCase().includes(qLower) ||
        e.desc.toLowerCase().includes(qLower);
      const matchesCat = category === "All" || e.category === category;
      return matchesQ && matchesCat;
    });
  }, [q, category]);

  if (!isPageReady) return <Loader />;
  return (
    <div className="relative min-h-screen bg-[#09090B] text-white">
      
      {/* COMING SOON OVERLAY - FIXED TO SCREEN CENTER */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
        <div className="bg-[#121217]/90 border border-violet-500/20 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-2xl text-center max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-violet-600/20 rounded-2xl border border-violet-500/40">
              <FiLock className="text-violet-500 text-3xl" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 tracking-tight">Coming Soon</h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Public API Endpoints are currently being provisioned across our global edge network.
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
                placeholder="Search endpoints..."
                className="w-full bg-[#18181B] border border-white/10 px-4 py-3 rounded-lg text-sm outline-none placeholder:text-gray-600 pr-10"
              />
              <FiSearch className="absolute right-4 top-3.5 text-gray-500" />
            </div>
          </div>
        </div>

        {/* TABS - Scrollable for smaller screens */}
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
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`px-3 py-1.5 text-[10px] sm:text-xs rounded-md border transition ${
                category === c
                  ? "bg-violet-600 border-violet-500 text-white"
                  : "border-white/5 text-gray-400 bg-[#121217] hover:bg-[#18181B]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7">
          {list.map((e) => (
            <div
              key={e.id}
              className="bg-[#121217] border border-white/5 rounded-xl overflow-hidden shadow-lg transition hover:bg-[#18181B] flex flex-col"
            >
              <div className="relative h-40 sm:h-44 w-full">
                <img
                  src={e.img}
                  alt={e.name}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121217] to-transparent opacity-60" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">{e.name}</h3>
                      <p className="text-gray-400 text-[11px] sm:text-xs mt-2 line-clamp-2 leading-relaxed">
                        {e.desc}
                      </p>
                    </div>
                    {e.tag && (
                      <span className="shrink-0 px-2 py-0.5 border border-white/10 rounded text-[9px] sm:text-[10px] font-mono text-gray-500 bg-[#09090B]">
                        {e.tag}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[9px] sm:text-[10px] font-medium tracking-wider uppercase text-gray-600 bg-white/5 px-2 py-0.5 rounded">
                    Public Endpoint
                  </span>
                  <span className="text-xs text-violet-400 font-medium uppercase tracking-tighter">
                    {e.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}