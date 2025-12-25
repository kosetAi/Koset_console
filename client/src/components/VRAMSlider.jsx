import React from "react";

export default function VRAMSlider({ value, onChange, max = 200 }) {
  const marks = [0, 16, 24, 48, 80, 160, max];

  return (
    <div>
      <div className="flex justify-between mb-1">
        <label className="text-xs font-medium text-gray-300">
          Filter GPUs by VRAM
        </label>
        <span className="text-xs text-gray-400">
          {value > 0 ? `${value} GB+` : "Any VRAM"}
        </span>
      </div>

      <input
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-violet-500"
      />

      <div className="flex justify-between mt-1 text-[9px] text-gray-500">
        {marks.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}
