// src/pages/RemoteAccess.jsx
import React, { useEffect, useState } from "react";
import { get } from "../api.js";
import { FiLock, FiTerminal } from "react-icons/fi";
import Loader from "../components/Loader.jsx";

/**
 * RemoteAccess.jsx
 * - Logic: UNCHANGED
 * - Layout: UPDATED for Mobile Responsiveness
 * - Coming Soon Overlay: UPDATED to fixed positioning for viewport centering
 */

export default function RemoteAccess() {
  const [isPageReady, setIsPageReady] = useState(false);
  useEffect(() => {
    // Simulate a brief delay or wait for actual data
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 1200); // 1.2 seconds feels snappy but professional

    return () => clearTimeout(timer);
  }, []);
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

  if (!isPageReady) return <Loader />;
  return (
    <div className="relative min-h-screen bg-[#09090B]">
      
      {/* COMING SOON OVERLAY - FIXED TO VIEWPORT CENTER */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
        <div className="bg-[#121217]/90 border border-violet-500/20 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-2xl text-center max-w-sm w-full transition-all">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-violet-600/20 rounded-2xl border border-violet-500/40 shadow-inner">
              <FiLock className="text-violet-500 text-3xl" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">Coming Soon</h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Secure Remote Access and SSH gateway management are currently being integrated with our identity provider.
          </p>
          <div className="inline-block px-8 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-violet-500/30 uppercase tracking-widest">
            Secure Tunneling
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-4 sm:p-8 space-y-6 blur-[8px] pointer-events-none select-none grayscale-[0.6]">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Remote Access</h1>

        {error && (
          <div className="mb-4 text-red-300 bg-red-900/30 p-3 rounded border border-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="bg-[#121217] border border-white/5 rounded-2xl p-5 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
             <FiTerminal className="text-violet-500 text-xl" />
             <h2 className="text-white font-semibold text-lg sm:text-xl">
                Remote Access Requests
             </h2>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-gray-500 py-12 text-center font-mono text-xs tracking-widest animate-pulse">
              SYNCHRONIZING_ACCESS_REQUESTS...
            </div>
          )}

          {/* Empty State */}
          {!loading && requests.length === 0 && (
            <div className="py-20 text-center text-gray-500">
              <div className="text-5xl mb-4 opacity-20">📡</div>
              <p className="text-sm italic">No access requests found in this sector</p>
            </div>
          )}

          {/* Table - Responsive Horizontal Scroll */}
          {!loading && requests.length > 0 && (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="w-full text-sm text-gray-400 min-w-[650px]">
                  <thead>
                    <tr className="text-gray-500 border-b border-white/5 text-[10px] uppercase tracking-widest font-bold">
                      <th className="pb-4 text-left">User</th>
                      <th className="pb-4 text-left">Resource</th>
                      <th className="pb-4 text-left">Status</th>
                      <th className="pb-4 text-left">Requested At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {requests.map((r) => (
                      <tr key={r.id} className="opacity-10">
                        <td className="py-5 text-gray-200 font-medium">{r.user}</td>
                        <td className="py-5">{r.resource}</td>
                        <td className="py-5">
                          <span className="px-2.5 py-1 rounded bg-white/5 text-gray-500 text-[9px] uppercase font-black tracking-widest border border-white/5">
                            {r.status}
                          </span>
                        </td>
                        <td className="py-5 font-mono text-[11px]">
                          {new Date(r.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}