// C:\Users\Asus\code\Koset Console\client\src\pages\Profile.jsx

import React from "react";
import { useAuth } from "../context/AuthContext";
import { get } from "../api.js";
import { useEffect, useState } from "react";
import { FiFile, FiClock, FiDatabase, FiCode } from "react-icons/fi";
import Loader from "../components/Loader.jsx";

export default function Profile() {
  const [isPageReady, setIsPageReady] = useState(false);
  useEffect(() => {
    // Simulate a brief delay or wait for actual data
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 1200); // 1.2 seconds feels snappy but professional

    return () => clearTimeout(timer);
  }, []);

  
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
if (!isPageReady) return <Loader />;
  return (
    <div className="space-y-6 md:space-y-8 bg-[#09090B] min-h-screen p-4 md:p-8">
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            G&apos;day, {displayName}!
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Keep an eye on your daily spend and resource usage.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="w-full sm:w-auto px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-md shadow-violet-500/10 transition active:scale-95">
            + New
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* USAGE CARD */}
        <div className="lg:col-span-2 bg-[#121217] rounded-xl border border-white/5 p-5 md:p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-gray-200">Usage</h2>
          <p className="text-xs text-gray-400 mt-1">
            Keep an eye on your daily spend with real-time insights.
          </p>

          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-8">
            {/* Spend numbers */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Rolling Average</p>
                <p className="text-xl md:text-2xl font-bold text-white">
                  $0.00 <span className="text-xs font-normal text-gray-500">/ day</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Current Rate</p>
                <p className="text-xl md:text-2xl font-bold text-white">
                  $0.00 <span className="text-xs font-normal text-gray-500">/ hr</span>
                </p>
              </div>
            </div>

            {/* Chart placeholder */}
            <div className="flex-1 w-full overflow-hidden">
              <div className="h-32 rounded-lg bg-[#18181B] border border-white/5 flex flex-col justify-between px-4 py-3 relative">
                {/* Y axis labels */}
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>$1.00</span>
                  <span className="hidden sm:inline">$0.60</span>
                  <span>$0.00</span>
                </div>

                {/* Bars */}
                <div className="flex items-end gap-1 md:gap-2 flex-1 justify-between sm:justify-start">
                  {[3, 5, 4, 6, 3, 2, 4, 1, 5, 3, 2, 4].map((h, i) => (
                    <div 
                      key={i} 
                      className={`w-full sm:w-2 md:w-3 rounded-full bg-violet-600/20 border-t border-violet-500/50 ${i > 7 ? 'hidden sm:block' : ''}`} 
                      style={{ height: `${h * 15}%` }} 
                    />
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
            Monitor your GPU, vCPU, and storage.
          </p>

          <div className="mt-6 space-y-4 text-sm">
            {[
              { label: "GPUs", value: "0" },
              { label: "vCPUs", value: "0" },
              { label: "Storage", value: "0 GB" },
              { label: "Endpoints", value: "0" },
            ].map((res, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-gray-300">{res.label}</span>
                <span className="text-lg font-bold text-white">{res.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT FILES SECTION */}
      <div className="bg-[#121217] rounded-xl border border-white/5 p-4 md:p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-200 mb-4">Recent Files</h2>
        
        {files.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No files uploaded yet.</p>
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle px-4 md:px-0">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-[10px] uppercase bg-[#18181B] text-gray-500 font-bold tracking-wider">
                  <tr>
                    <th className="px-4 py-3 border-b border-white/5">File Name</th>
                    <th className="px-4 py-3 border-b border-white/5 hidden sm:table-cell">Type</th>
                    <th className="px-4 py-3 border-b border-white/5">Size</th>
                    <th className="px-4 py-3 border-b border-white/5 hidden md:table-cell">Uploaded</th>
                    <th className="px-4 py-3 border-b border-white/5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {files.map((file) => (
                    <tr key={file._id} className="hover:bg-white/[0.02] transition">
                      <td className="px-4 py-3 font-medium text-white">
                        <div className="flex items-center gap-2 max-w-[150px] sm:max-w-none">
                          {file.category === 'dataset' ? <FiDatabase className="text-violet-400 shrink-0"/> : <FiCode className="text-violet-400 shrink-0"/>}
                          <span className="truncate">{file.originalName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize hidden sm:table-cell">{file.category}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{(file.size / 1024).toFixed(1)} KB</td>
                      <td className="px-4 py-3 hidden md:table-cell whitespace-nowrap">{new Date(file.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                         <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-tighter">
                           Synced
                         </span>
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
  );
}