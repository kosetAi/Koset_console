// src/pages/RemoteAccess.jsx
import React, { useEffect, useState } from "react";
import { get } from "../api.js";
import { FiLock, FiTerminal } from "react-icons/fi";

export default function RemoteAccess() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  async function loadRequests() {
    setLoading(true);
    setError("");

    try {
      const res = await get("/remote-access");

      if (!res.ok) {
        setError(res.error?.message || "Failed to load remote access requests");
        setRequests([]);
      } else {
        setRequests(res.requests || []);
      }
    } catch (e) {
      setError("Network error");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

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
            Secure Remote Access and SSH gateway management are currently being integrated with our identity provider.
          </p>
          <div className="inline-block px-6 py-2 bg-violet-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-violet-500/20">
            Secure Tunneling
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-8 blur-[6px] pointer-events-none select-none grayscale-[0.4]">
        <h1 className="text-lg font-semibold text-white mb-6">Remote Access</h1>

        {error && (
          <div className="mb-4 text-red-300 bg-red-900/30 p-3 rounded border border-red-700">
            {error}
          </div>
        )}

        <div className="bg-[#121217] border border-white/5 rounded-xl px-6 py-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
             <FiTerminal className="text-violet-500" />
             <h2 className="text-white font-semibold text-lg">
                Remote Access Requests
             </h2>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-gray-500 py-10 text-center font-mono text-xs">
              SYNCHRONIZING_ACCESS_REQUESTS...
            </div>
          )}

          {/* Empty */}
          {!loading && requests.length === 0 && (
            <div className="py-20 text-center text-gray-500">
              <div className="text-4xl mb-2 opacity-20">📡</div>
              <p className="text-sm italic">No access requests found in this sector</p>
            </div>
          )}

          {/* Table if there are requests */}
          {!loading && requests.length > 0 && (
            <table className="w-full text-sm text-gray-400">
              <thead>
                <tr className="text-gray-500 border-b border-white/5 text-[11px] uppercase tracking-wider font-bold">
                  <th className="pb-3 text-left">User</th>
                  <th className="pb-3 text-left">Resource</th>
                  <th className="pb-3 text-left">Status</th>
                  <th className="pb-3 text-left">Requested At</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 opacity-10">
                    <td className="py-4 text-gray-200">{r.user}</td>
                    <td className="py-4">{r.resource}</td>
                    <td className="py-4">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-gray-500 text-[10px] uppercase font-bold tracking-widest border border-white/5">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-xs">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}