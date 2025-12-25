// src/pages/AuditLogs.jsx
import React, { useEffect, useState } from "react";
import { FiSearch, FiFilter, FiCalendar } from "react-icons/fi";
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
      const res = await get("/audit-logs"); // Expected: { ok:true, logs:[{}] }
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

  // Client-side filtering
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
    <div className="p-8">
      <h1 className="text-lg font-semibold text-white mb-6">Audit Logs</h1>

      {error && (
        <div className="mb-4 text-red-300 bg-red-900/30 p-3 rounded border border-red-700">
          {error}
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">

        {/* Search box */}
        <div className="flex items-center bg-[#111315] border border-gray-700 rounded-md px-3 py-2 flex-1">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search logs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-gray-200 text-sm outline-none w-full"
          />
        </div>

        {/* Action filter */}
        <div className="relative">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-[#111315] border border-gray-700 text-gray-300 text-sm px-3 py-2 rounded-md outline-none cursor-pointer"
          >
            <option value="all">Filter by action</option>
            <option value="login">Login</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </div>

        {/* Date filter */}
        <button
          onClick={() => {
            const d = prompt("Enter date (YYYY-MM-DD):");
            if (d) setDateFilter(d);
          }}
          className="flex items-center bg-[#111315] border border-gray-700 text-gray-300 text-sm px-3 py-2 rounded-md gap-2 hover:bg-[#1a1d20]"
        >
          <FiCalendar /> Select date
        </button>
      </div>

      {/* Logs section */}
      <div className="bg-[#111315] border border-gray-700 rounded-xl p-6 min-h-[250px] flex flex-col justify-center items-center">

        {/* Loading */}
        {loading && (
          <div className="text-gray-400">Loading logs…</div>
        )}

        {/* No logs */}
        {!loading && filtered.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            <div className="text-5xl mb-4">🤖</div>
            <div className="text-lg font-semibold text-gray-300">No logs found</div>
            <div className="text-sm text-gray-500 mt-1">
              No logs found for the selected filters. Try changing the date range or search term.
            </div>
          </div>
        )}

        {/* Logs table */}
        {!loading && filtered.length > 0 && (
          <table className="w-full text-left text-sm text-gray-300">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="pb-2">Timestamp</th>
                <th className="pb-2">Action</th>
                <th className="pb-2">Resource</th>
                <th className="pb-2">User</th>
                <th className="pb-2">IP</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} className="border-b border-gray-800">
                  <td className="py-3 text-gray-200">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-3">{log.action || "-"}</td>
                  <td className="py-3">{log.resource || "-"}</td>
                  <td className="py-3">{log.user || "-"}</td>
                  <td className="py-3">{log.ip || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}
