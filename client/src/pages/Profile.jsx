// C:\Users\Asus\code\Koset Console\client\src\pages\Profile.jsx

import React from "react";
import { useAuth } from "../context/AuthContext";
import { get } from "../api.js";
import { useEffect, useState } from "react";
import { FiFile, FiClock, FiDatabase, FiCode } from "react-icons/fi";

export default function Profile() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      const res = await get("/me/files");
      if (res.ok) setFiles(res.files);
    }
    fetchHistory();
  }, []);

  const displayName =
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    user?.phone ||
    "User";

  return (
    <div className="space-y-8 bg-[#09090B] min-h-screen p-4 md:p-8">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            G&apos;day, {displayName}!
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Keep an eye on your daily spend and resource usage.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          
          <button className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-md shadow-violet-500/10 transition active:scale-95">
            + New
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* USAGE CARD */}
        <div className="lg:col-span-2 bg-[#121217] rounded-xl border border-white/5 p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-gray-200">Usage</h2>
          <p className="text-xs text-gray-400 mt-1">
            Keep an eye on your daily spend with real-time insights.
          </p>

          <div className="mt-6 flex items-end justify-between gap-8">
            {/* Spend numbers */}
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400">Rolling Average</p>
                <p className="text-2xl font-bold text-white">
                  $0.00 <span className="text-sm font-normal text-gray-500">/ day</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Current Spend Rate</p>
                <p className="text-2xl font-bold text-white">
                  $0.00 <span className="text-sm font-normal text-gray-500">/ hr</span>
                </p>
              </div>
            </div>

            {/* Chart placeholder */}
            <div className="flex-1">
              <div className="h-32 rounded-lg bg-[#18181B] border border-white/5 flex flex-col justify-between px-4 py-3 relative">
                {/* Y axis labels */}
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>$1.00</span>
                  <span>$0.80</span>
                  <span>$0.60</span>
                  <span>$0.40</span>
                  <span>$0.20</span>
                  <span>$0.00</span>
                </div>

                {/* Bars */}
                <div className="flex items-end gap-1 flex-1">
                  {[3, 5, 4, 6, 3, 2, 4, 1].map((h, i) => (
                    <div key={i} className="w-1.5 rounded-full bg-violet-600/20 border-t border-violet-500/50" style={{ height: `${h * 15}%` }} />
                  ))}
                </div>

                {/* X axis dates */}
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  <span>Nov 17</span>
                  <span>Nov 21</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RESOURCES CARD */}
        <div className="bg-[#121217] rounded-xl border border-white/5 p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-gray-200">Resources</h2>
          <p className="text-xs text-gray-400 mt-1">
            Monitor your GPU, vCPU, storage, and endpoint usage.
          </p>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-gray-300">GPUs</span>
              <span className="text-xl font-bold text-white">0</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-gray-300">vCPUs</span>
              <span className="text-xl font-bold text-white">0</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-gray-300">Storage</span>
              <span className="text-xl font-bold text-white">0 GB</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-gray-300">Endpoints</span>
              <span className="text-xl font-bold text-white">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT FILES SECTION */}
      <div className="bg-[#121217] rounded-xl border border-white/5 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-200 mb-4">Recent Files</h2>
        
        {files.length === 0 ? (
          <p className="text-gray-400 text-sm">No files uploaded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs uppercase bg-[#18181B] text-gray-500">
                <tr>
                  <th className="px-4 py-3 border-b border-white/5">File Name</th>
                  <th className="px-4 py-3 border-b border-white/5">Type</th>
                  <th className="px-4 py-3 border-b border-white/5">Size</th>
                  <th className="px-4 py-3 border-b border-white/5">Uploaded</th>
                  <th className="px-4 py-3 border-b border-white/5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {files.map((file) => (
                  <tr key={file._id} className="hover:bg-white/[0.02] transition">
                    <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                      {file.category === 'dataset' ? <FiDatabase className="text-violet-400"/> : <FiCode className="text-violet-400"/>}
                      {file.originalName}
                    </td>
                    <td className="px-4 py-3 capitalize">{file.category}</td>
                    <td className="px-4 py-3">{(file.size / 1024).toFixed(1)} KB</td>
                    <td className="px-4 py-3">{new Date(file.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                       <span className="px-2 py-1 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                         Synced
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}