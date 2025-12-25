import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function Secrets() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-10 text-white space-y-10">

      {/* TITLE + ACTION BAR */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Secrets</h1>

        <button className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-md text-sm font-semibold shadow transition">
          + Create Secret
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="flex justify-end">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search secrets"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111315] border border-gray-700 px-4 py-2 rounded-md text-sm outline-none focus:border-purple-500"
          />
          <FiSearch className="absolute right-3 top-2.5 text-gray-400 text-lg" />
        </div>
      </div>

      {/* EMPTY STATE */}
      <div className="max-w-3xl mx-auto bg-[#111315] border border-gray-700 rounded-xl px-10 py-16 text-center space-y-4">
        <h2 className="text-xl font-semibold">Manage Secrets</h2>

        <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
          Secrets are a secure way to store sensitive information, such as 
          API keys or credentials.
        </p>

        <a
          href="#"
          className="text-purple-400 underline hover:text-purple-300 transition text-sm"
        >
          Learn More →
        </a>
      </div>
    </div>
  );
}
