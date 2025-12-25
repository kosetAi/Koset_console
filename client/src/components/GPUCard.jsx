import React from "react";

function availabilityColor(status) {
  if (!status) return "text-gray-400";
  const s = status.toLowerCase();
  if (s === "high") return "text-emerald-400";
  if (s === "medium") return "text-amber-300";
  if (s === "low") return "text-red-400";
  return "text-gray-400";
}

export default function GPUCard({ gpu }) {
  const basePrice = Number(gpu.price || 0);
  const discountPrice = basePrice > 0 ? basePrice * 0.85 : 0; // Q2 = B

  return (
    <div className="bg-[#14171b] border border-gray-700/70 rounded-xl px-4 py-3 hover:border-violet-400/80 hover:-translate-y-0.5 transition-all duration-150 flex flex-col gap-2">
      {/* TOP ROW: name + featured badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white tracking-tight">
              {gpu.name}
            </h3>
            {gpu.isFeatured && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-violet-400/60 text-violet-300 uppercase tracking-wide">
                Featured
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {gpu.vendor || ""}{gpu.vendor ? " · " : ""}
            {gpu.arch || ""}
          </p>
        </div>

        {/* PRICES */}
        <div className="text-right">
          <div className="text-[13px] font-semibold text-white">
            ${basePrice.toFixed(2)}/hr
          </div>
          {discountPrice > 0 && (
            <div className="text-[11px] font-medium text-emerald-400">
              ${discountPrice.toFixed(2)}/hr
            </div>
          )}
        </div>
      </div>

      {/* SPECS */}
      <div className="text-[11px] text-gray-300 mt-1 space-y-0.5">
        <p>
          {gpu.vram} GB VRAM
        </p>
        <p>
          {gpu.ram} GB RAM • {gpu.cpu} vCPU
        </p>
        <p>
          {gpu.max} max instances
        </p>
      </div>

      {/* STATUS */}
      <div className="flex items-center justify-between pt-1">
        <span className={`text-[11px] font-medium ${availabilityColor(gpu.status)}`}>
          {gpu.status || "Unknown"}
        </span>
        <button className="text-[11px] px-2 py-1 rounded-md border border-gray-700/80 text-gray-200 hover:border-violet-400 hover:text-white transition">
          View details
        </button>
      </div>
    </div>
  );
}
