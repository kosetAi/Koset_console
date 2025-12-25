// src/pages/RemoteAccess.jsx
import React, { useEffect, useState } from "react";
import { get } from "../api.js";

export default function RemoteAccess() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  async function loadRequests() {
    setLoading(true);
    setError("");

    try {
      // Expected endpoint: GET /remote-access
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
    <div className="p-8">
      <h1 className="text-lg font-semibold text-white mb-6">Remote Access</h1>

      {error && (
        <div className="mb-4 text-red-300 bg-red-900/30 p-3 rounded border border-red-700">
          {error}
        </div>
      )}

      <div className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-6">

        <h2 className="text-white font-semibold text-lg mb-4">
          Remote Access Requests
        </h2>

        {/* Loading */}
        {loading && (
          <div className="text-gray-400 py-10 text-center">
            Loading remote access requests…
          </div>
        )}

        {/* Empty */}
        {!loading && requests.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            No access requests found
          </div>
        )}

        {/* Table if there are requests */}
        {!loading && requests.length > 0 && (
          <table className="w-full text-sm text-gray-300">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="pb-2">User</th>
                <th className="pb-2">Resource</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Requested At</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-gray-800">
                  <td className="py-3 text-gray-200">{r.user}</td>
                  <td className="py-3">{r.resource}</td>
                  <td className="py-3">{r.status}</td>
                  <td className="py-3">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}
