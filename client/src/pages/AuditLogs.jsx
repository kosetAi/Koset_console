// src/pages/AuditLogs.jsx
import React, { useEffect, useState } from "react";
import { FiSearch, FiFilter, FiCalendar, FiLock, FiActivity } from "react-icons/fi";
import { get } from "../api.js";
import Loader from "../components/Loader.jsx";

/**
 * AuditLogs.jsx
 * - Logic: UNCHANGED
 * - Layout: UPDATED for Mobile Responsiveness
 * - Coming Soon Overlay: UPDATED to fixed positioning for viewport centering
 */

export default function AuditLogs() {
  const [isPageReady, setIsPageReady] = useState(false);
  useEffect(() => {
    // Simulate a brief delay or wait for actual data
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 1200); // 1.2 seconds feels snappy but professional

    return () => clearTimeout(timer);
  }, []);
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

  if (!isPageReady) return <Loader />;

  return (
    <div className="relative min-h-screen bg-[#09090B]">
      
      {/* COMING SOON OVERLAY - FIXED POSITIONING FOR VIEWPORT CENTERING */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
        <div className="bg-[#121217]/90 border border-violet-500/20 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-2xl text-center max-w-sm w-full transition-all">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-violet-600/20 rounded-2xl border border-violet-500/40">
              <FiLock className="text-violet-500 text-3xl" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">Coming Soon</h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            The immutable Audit Logging system is being integrated with our secure event-streaming pipeline.
          </p>
          <div className="inline-block px-8 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-violet-500/20 uppercase tracking-widest">
            Security Module
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-4 sm:p-8 space-y-6 blur-[8px] pointer-events-none select-none grayscale-[0.4]">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Audit Logs</h1>

        {error && (
          <div className="mb-4 text-red-300 bg-red-900/30 p-3 rounded border border-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Search + Filters - RESPONSIVE STACKING */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="flex items-center bg-[#121217] border border-white/10 rounded-lg px-4 py-2.5 sm:py-2 flex-1">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              readOnly
              type="text"
              placeholder="Search logs..."
              className="bg-transparent text-gray-400 text-sm outline-none w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-48">
              <select
                disabled
                className="w-full bg-[#121217] border border-white/10 text-gray-500 text-sm px-4 py-2.5 sm:py-2 rounded-lg outline-none cursor-not-allowed appearance-none"
              >
                <option value="all">Filter by action</option>
              </select>
            </div>

            <button
              disabled
              className="flex items-center justify-center bg-[#121217] border border-white/10 text-gray-500 text-sm px-4 py-2.5 sm:py-2 rounded-lg gap-2 flex-1 sm:flex-none whitespace-nowrap"
            >
              <FiCalendar /> Select date
            </button>
          </div>
        </div>

        {/* Logs section */}
        <div className="bg-[#121217] border border-white/5 rounded-2xl p-4 sm:p-6 min-h-[400px] flex flex-col items-center">
          
          <div className="w-full flex justify-between items-center mb-6 opacity-30">
            <h2 className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <FiActivity className="text-violet-500" /> Event Stream
            </h2>
            <span className="text-[9px] sm:text-[10px] font-mono text-gray-600 uppercase tracking-tighter">Buffer: Syncing...</span>
          </div>

          <div className="w-full overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <table className="w-full text-left text-sm text-gray-500 min-w-[700px]">
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
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <tr key={i} className="opacity-10">
                      <td className="py-4 text-gray-400 font-mono whitespace-nowrap text-xs">2026-02-10 08:31:42</td>
                      <td className="py-4 font-semibold uppercase text-xs">resource_access</td>
                      <td className="py-4 text-xs">pod_cluster_v4</td>
                      <td className="py-4 text-xs">admin@koset.io</td>
                      <td className="py-4 text-xs font-mono">192.168.1.1</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}