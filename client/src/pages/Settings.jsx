// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import { FiGithub, FiChevronDown, FiTrash2, FiKey, FiLock, FiSettings } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import { get, post, put } from "../api.js";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader.jsx";

/**
 * Accordion Component
 * - UPDATED: Added responsive padding for mobile
 */
function Accordion({ title, children, openByDefault = false, className = "" }) {
  const [open, setOpen] = useState(openByDefault);
  return (
    <div className={`bg-[#121217] border border-white/5 rounded-xl mb-3 overflow-hidden ${className}`}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-4 text-left group"
      >
        <div className="font-semibold text-gray-300 group-hover:text-white transition-colors text-sm sm:text-base">{title}</div>
        <div className="text-gray-500 transform transition-transform" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          <FiChevronDown />
        </div>
      </button>

      {open && (
        <div className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-white/5 mt-2 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Settings() {
  const [isPageReady, setIsPageReady] = useState(false);
  useEffect(() => {
    // Simulate a brief delay or wait for actual data
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 1200); // 1.2 seconds feels snappy but professional

    return () => clearTimeout(timer);
  }, []);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await get("/me");
      if (!res.ok) {
        setError(res.error?.message || "Failed to load settings");
      } else {
        setProfile(res.user || {});
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  

  if (!isPageReady) return <Loader />;
  return (
    <div className="relative min-h-screen bg-[#09090B]">
      
      {/* COMING SOON OVERLAY - FIXED TO VIEWPORT CENTER */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
        <div className="bg-[#121217]/90 border border-violet-500/20 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-2xl text-center max-w-sm w-full transition-all">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-violet-600/20 rounded-2xl border border-violet-500/40">
              <FiLock className="text-violet-500 text-3xl" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 italic">Terminal Locked</h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            User preferences and security configurations are currently being migrated to our high-availability database cluster.
          </p>
          <div className="inline-block px-8 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-violet-500/20 uppercase tracking-widest">
            System Maintenance
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 blur-[8px] pointer-events-none select-none grayscale-[0.6]">
        <div className="flex items-center gap-3">
            <FiSettings className="text-violet-500 text-xl" />
            <h1 className="text-xl sm:text-2xl font-bold text-white italic uppercase tracking-tight">Settings</h1>
        </div>

        {error && (
          <div className="mb-4 text-red-300 bg-red-900/30 p-3 rounded-lg border border-red-700 text-xs sm:text-sm">
            {error}
          </div>
        )}

        {/* THEME + METADATA GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-[#121217] border border-white/5 rounded-xl p-5 sm:p-6 shadow-xl">
            <h2 className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Display Theme</h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-black/40 border border-white/5 text-[11px] sm:text-xs text-gray-400">System</button>
              <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-black/40 border border-white/5 text-[11px] sm:text-xs text-gray-400">Light</button>
              <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-violet-600/20 border border-violet-500/30 text-[11px] sm:text-xs text-violet-400 font-bold">Dark</button>
            </div>
          </div>

          <div className="bg-[#121217] border border-white/5 rounded-xl p-5 sm:p-6 shadow-xl">
            <h2 className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Account Metadata</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-20">
              <input readOnly placeholder="First Name" className="bg-black/40 border border-white/5 px-4 py-2.5 sm:py-2 rounded-lg text-xs outline-none" />
              <input readOnly placeholder="Last Name" className="bg-black/40 border border-white/5 px-4 py-2.5 sm:py-2 rounded-lg text-xs outline-none" />
            </div>
          </div>
        </div>

        {/* OAUTH GRID */}
        <div>
          <h2 className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">OAuth Connections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#121217] border border-white/5 rounded-xl p-5 flex items-center justify-between opacity-30">
                <div className="flex items-center gap-3">
                    <FiGithub className="text-xl" />
                    <span className="text-sm font-bold">GitHub</span>
                </div>
                <div className="h-6 w-10 bg-white/10 rounded-full" />
            </div>
            <div className="bg-[#121217] border border-white/5 rounded-xl p-5 flex items-center justify-between opacity-30">
                <div className="flex items-center gap-3">
                    <SiDiscord className="text-xl" />
                    <span className="text-sm font-bold">Discord</span>
                </div>
                <div className="h-6 w-10 bg-white/10 rounded-full" />
            </div>
          </div>
        </div>

        {/* SECURITY ACCORDIONS */}
        <div className="space-y-3">
          <h2 className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Security & Access Control</h2>
          <Accordion title="API Authentication Keys">Manage programmatic access.</Accordion>
          <Accordion title="S3 Storage Credentials">Manage object storage keys.</Accordion>
          <Accordion title="Identity & MFA Settings">Multi-factor authentication.</Accordion>
          <Accordion title="Container Registry Registry">Deployment credentials.</Accordion>
          <Accordion title="SSH Gateway Keys">Direct pod access.</Accordion>
          
          <Accordion title="Danger Zone" className="border-red-900/50">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-xs text-gray-500">Permanently delete your account and all associated resource data.</p>
                <button className="w-full sm:w-auto px-6 py-2 bg-red-900/20 border border-red-500/30 text-red-500 text-xs rounded-lg font-bold hover:bg-red-500/10 transition-colors uppercase tracking-widest">
                  Delete Account
                </button>
             </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
}