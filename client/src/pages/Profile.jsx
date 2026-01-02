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
    // Fetch file history
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
    <div className="space-y-8">
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

        <button className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-md transition">
          + New
        </button>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* USAGE CARD */}
        <div className="lg:col-span-2 bg-[#15181D] rounded-xl border border-gray-700 p-6">
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
                  $0.00 <span className="text-sm text-gray-400">/ day</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Current Spend Rate</p>
                <p className="text-2xl font-bold text-white">
                  $0.00 <span className="text-sm text-gray-400">/ hr</span>
                </p>
              </div>
            </div>

            {/* Chart placeholder */}
            <div className="flex-1">
              <div className="h-32 rounded-lg bg-[#0F1114] border border-gray-700 flex flex-col justify-between px-4 py-3">
                {/* Y axis labels (left) */}
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>$1.00</span>
                  <span>$0.80</span>
                  <span>$0.60</span>
                  <span>$0.40</span>
                  <span>$0.20</span>
                  <span>$0.00</span>
                </div>

                {/* Fake line chart bars */}
                <div className="flex items-end gap-1 flex-1">
                  <div className="w-1.5 h-3 rounded-full bg-gray-700" />
                  <div className="w-1.5 h-5 rounded-full bg-gray-700" />
                  <div className="w-1.5 h-4 rounded-full bg-gray-700" />
                  <div className="w-1.5 h-6 rounded-full bg-gray-700" />
                  <div className="w-1.5 h-3 rounded-full bg-gray-700" />
                  <div className="w-1.5 h-2 rounded-full bg-gray-700" />
                  <div className="w-1.5 h-4 rounded-full bg-gray-700" />
                  <div className="w-1.5 h-1 rounded-full bg-gray-700" />
                </div>

                {/* X axis dates */}
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  <span>Nov 17</span>
                  <span>Nov 18</span>
                  <span>Nov 19</span>
                  <span>Nov 20</span>
                  <span>Nov 21</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RESOURCES CARD */}
        <div className="bg-[#15181D] rounded-xl border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-200">Resources</h2>
          <p className="text-xs text-gray-400 mt-1">
            Monitor your GPU, vCPU, storage, and endpoint usage.
          </p>

          <div className="mt-6 space-y-4 text-sm">
            {/* GPUs & vCPUs */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">GPUs</span>
              <span className="text-xl font-bold text-white">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">vCPUs</span>
              <span className="text-xl font-bold text-white">0</span>
            </div>

            <div className="border-t border-gray-700 my-2" />

            {/* Storage & Endpoints */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Storage</span>
              <span className="text-xl font-bold text-white">0 GB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Endpoints</span>
              <span className="text-xl font-bold text-white">0</span>
            </div>
          </div>
        </div>
      </div>
       <div className="bg-[#15181D] rounded-xl border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Recent Files</h2>
          
          {files.length === 0 ? (
            <p className="text-gray-400 text-sm">No files uploaded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs uppercase bg-[#111315] text-gray-500">
                  <tr>
                    <th className="px-4 py-3">File Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Uploaded</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {files.map((file) => (
                    <tr key={file._id} className="hover:bg-[#1A1D24] transition">
                      <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                        {file.category === 'dataset' ? <FiDatabase className="text-emerald-400"/> : <FiCode className="text-cyan-400"/>}
                        {file.originalName}
                      </td>
                      <td className="px-4 py-3 capitalize">{file.category}</td>
                      <td className="px-4 py-3">{(file.size / 1024).toFixed(1)} KB</td>
                      <td className="px-4 py-3">{new Date(file.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                         <span className="px-2 py-1 rounded text-xs bg-green-500/10 text-green-400 border border-green-500/20">
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
