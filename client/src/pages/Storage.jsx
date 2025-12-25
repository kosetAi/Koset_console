// client/src/pages/Storage.jsx

import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";

export default function Storage() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-8 space-y-10 text-white">

      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Network Storage</h1>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search volumes"
              className="bg-[#111315] border border-gray-700 px-4 py-2 rounded-md text-sm w-52 outline-none focus:border-purple-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FiSearch className="absolute right-3 top-2.5 text-gray-400 text-lg" />
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-3">
        <button className="bg-purple-600 hover:bg-purple-500 rounded-md text-sm px-4 py-2 flex items-center gap-2 transition">
          <AiOutlinePlus /> New Network Volume
        </button>

        <button className="bg-[#1A1C1F] border border-gray-700 hover:bg-[#2A2D31] text-sm rounded-md px-4 py-2 flex items-center gap-2 transition">
          <AiOutlinePlus /> Create S3 API Key
        </button>
      </div>

      {/* EMPTY STATE */}
      <div className="bg-[#111315] border border-gray-700 p-12 rounded-xl text-center max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-3">Manage Network Storage</h2>

        <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
          Network storage volumes allow you to persist data across pod restarts
          and share data between pods.
        </p>

        <a
          href="#"
          className="text-purple-400 text-sm underline hover:text-purple-300 transition block mt-4"
        >
          Learn More →
        </a>
      </div>
    </div>
  );
}
