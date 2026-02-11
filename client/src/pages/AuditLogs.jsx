// src/pages/AuditLogs.jsx
import React, { useEffect, useState } from "react";
import { FiSearch, FiFilter, FiCalendar, FiLock, FiActivity } from "react-icons/fi";
import { get } from "../api.js";

export default function AuditLogs() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(null);

  async function loadLogs() {
    setLoading(true);
    setError("");

    try {
      const res = await get("/audit-logs");
      if (!res.ok) {
        setError(res.error?.message || "Failed to load logs");
        setLogs([]);
      } else {
        setLogs(res.logs || []);
      }
    } catch {
      setError("Network error");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  const filtered = logs.filter((l) => {
    const matchesQuery =
      query.trim() === "" ||
      l.action?.toLowerCase().includes(query.toLowerCase()) ||
      l.resource?.toLowerCase().includes(query.toLowerCase()) ||
      l.user?.toLowerCase().includes(query.toLowerCase());

    const matchesAction =
      actionFilter === "all" || l.action === actionFilter;

    const matchesDate =
      !dateFilter ||
      new Date(l.timestamp).toDateString() === new Date(dateFilter).toDateString();

    return matchesQuery && matchesAction && matchesDate;
  });

  return (
    <div className="relative min-h-screen bg-[#09090B]">
      
      {/* COMING SOON OVERLAY */}
      <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
        <div className="bg-[#121217]/80 border border-violet-500/20 backdrop-blur-md p-8 rounded-xl shadow-2xl text-center max-w-sm w-full">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-violet-600/20 rounded-full border border-violet-500/40">
              <FiLock className="text-violet-500 text-2xl" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            The immutable Audit Logging system is being integrated with our secure event-streaming pipeline.
          </p>
          <div className="inline-block px-6 py-2 bg-violet-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-violet-500/20">
            Security Module
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-8 space-y-6 blur-[6px] pointer-events-none select-none grayscale-[0.4]">
        <h1 className="text-2xl font-bold text-white mb-6">Audit Logs</h1>

        {error && (
          <div className="mb-4 text-red-300 bg-red-900/30 p-3 rounded border border-red-700">
            {error}
          </div>
        )}

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="flex items-center bg-[#121217] border border-white/10 rounded-md px-3 py-2 flex-1">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              readOnly
              type="text"
              placeholder="Search logs..."
              className="bg-transparent text-gray-400 text-sm outline-none w-full"
            />
          </div>

          <div className="relative">
            <select
              disabled
              className="bg-[#121217] border border-white/10 text-gray-500 text-sm px-3 py-2 rounded-md outline-none cursor-not-allowed appearance-none"
            >
              <option value="all">Filter by action</option>
            </select>
          </div>

          <button
            disabled
            className="flex items-center bg-[#121217] border border-white/10 text-gray-500 text-sm px-3 py-2 rounded-md gap-2"
          >
            <FiCalendar /> Select date
          </button>
        </div>

        {/* Logs section */}
        <div className="bg-[#121217] border border-white/5 rounded-xl p-6 min-h-[400px] flex flex-col items-center">
          
          <div className="w-full flex justify-between items-center mb-6 opacity-30">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <FiActivity className="text-violet-500" /> Event Stream
            </h2>
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-tighter">Buffer: Syncing...</span>
          </div>

          {!loading && filtered.length === 0 ? (
            <div className="text-center text-gray-600 py-20">
              <div className="text-5xl mb-4 opacity-20">🤖</div>
              <div className="text-lg font-semibold text-gray-500">No logs found</div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead>
                  <tr className="text-gray-600 border-b border-white/5 uppercase text-[10px] font-bold tracking-wider">
                    <th className="pb-4">Timestamp</th>
                    <th className="pb-4">Action</th>
                    <th className="pb-4">Resource</th>
                    <th className="pb-4">User Identity</th>
                    <th className="pb-4">Source IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="opacity-10">
                      <td className="py-4 text-gray-400 font-mono">2026-02-10 08:31:42</td>
                      <td className="py-4 font-semibold uppercase">resource_access</td>
                      <td className="py-4">pod_cluster_v4</td>
                      <td className="py-4">admin@koset.io</td>
                      <td className="py-4 text-xs font-mono">192.168.1.1</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}