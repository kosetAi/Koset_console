// client/src/pages/InstantClusters.jsx

import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

export default function InstantClusters() {
  return (
    <div className="p-8 space-y-10 text-white">

      {/* PAGE TITLE + ACTION BUTTON */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Instant Clusters</h1>

        <button className="bg-purple-600 hover:bg-purple-500 rounded-md text-sm px-4 py-2 flex items-center gap-2 transition">
          <AiOutlinePlus className="text-md" /> Create a Cluster
        </button>
      </div>

      {/* EMPTY STATE BOX */}
      <div className="bg-[#111315] border border-gray-700 p-12 rounded-xl text-center max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-3">Instant Clusters</h2>

        <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
          An on-demand, fully managed, multi-GPU compute service you can launch in
          minutes. Attach shared storage, run jobs, then spin it down when done.
          Pay only for what you use — no contracts or capacity planning.
        </p>

        <a
          href="#"
          className="text-purple-400 text-sm underline block mt-4 hover:text-purple-300 transition"
        >
          Tutorials →
        </a>
      </div>
    </div>
  );
}
