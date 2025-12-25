// src/pages/PublicEndpoints.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

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

  // derive activeTab from pathname so both sidebar and tabs stay in sync
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
      <div className="flex items-center gap-3 flex-wrap">
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

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
        {list.map((e) => (
          <div
            key={e.id}
            className="bg-[#0e0f10] border border-[#1b1b1b] rounded-lg overflow-hidden hover:shadow-lg hover:shadow-purple-900/20 transition cursor-pointer"
          >
            <img
              src={e.img}
              alt={e.name}
              className="w-full h-44 object-cover"
            />
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg truncate">{e.name}</h3>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-3">
                    {e.desc}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {e.tag && (
                    <span className="px-2 py-1 border border-[#222] rounded text-[11px]">
                      {e.tag}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-400">Public</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
