// src/pages/PublicEndpoints.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiLock } from "react-icons/fi";

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
            Public API Endpoints are currently being provisioned across our global edge network.
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
                placeholder="Search endpoints..."
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
        <div className="flex items-center gap-2 flex-wrap">
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

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
          {list.map((e) => (
            <div
              key={e.id}
              className="bg-[#121217] border border-white/5 rounded-xl overflow-hidden shadow-lg transition hover:bg-[#18181B]"
            >
              <div className="relative h-44 w-full">
                <img
                  src={e.img}
                  alt={e.name}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121217] to-transparent opacity-60" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white truncate">{e.name}</h3>
                    <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                      {e.desc}
                    </p>
                  </div>
                  {e.tag && (
                    <span className="shrink-0 px-2 py-0.5 border border-white/10 rounded text-[10px] font-mono text-gray-500 bg-[#09090B]">
                      {e.tag}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[10px] font-medium tracking-wider uppercase text-gray-600 bg-white/5 px-2 py-0.5 rounded">
                    Public Endpoint
                  </span>
                  <span className="text-xs text-violet-400 font-medium">
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