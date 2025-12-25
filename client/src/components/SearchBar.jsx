import React from "react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-md">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 text-sm">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for a GPU"
        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-[#111317] border border-gray-700/80 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400"
      />
    </div>
  );
}
