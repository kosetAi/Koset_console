// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import { FiGithub, FiChevronDown, FiTrash2, FiKey, FiLock, FiSettings } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import { get, post, put } from "../api.js";
import { useNavigate } from "react-router-dom";

function Accordion({ title, children, openByDefault = false, className = "" }) {
  const [open, setOpen] = useState(openByDefault);
  return (
    <div className={`bg-[#121217] border border-white/5 rounded-xl mb-3 overflow-hidden ${className}`}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between px-5 py-4 text-left group"
      >
        <div className="font-semibold text-gray-300 group-hover:text-white transition-colors">{title}</div>
        <div className="text-gray-500 transform transition-transform" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          <FiChevronDown />
        </div>
      </button>

      {open && <div className="px-5 pb-5 pt-0 text-sm text-gray-400 leading-relaxed border-t border-white/5 mt-2 pt-4">{children}</div>}
    </div>
  );
}

export default function Settings() {
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

  function handleChange(field, value) {
    setProfile((p) => ({ ...p, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const payload = {
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        company: profile?.company,
        country: profile?.country,
        address1: profile?.address1,
        address2: profile?.address2,
        companyId: profile?.companyId,
        taxId: profile?.taxId,
      };
      const res = await put("/me/profile", payload);
      if (!res.ok) setError(res.error?.message || "Save failed");
      else await load();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 bg-[#09090B] min-h-screen">
        <h1 className="text-lg font-semibold text-white mb-6">Settings</h1>
        <div className="text-gray-500 font-mono text-xs animate-pulse tracking-widest">INITIALIZING_CONFIGURATION_PROFILE...</div>
      </div>
    );
  }

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
          <h2 className="text-xl font-bold text-white mb-2 italic">Terminal Locked</h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            User preferences and security configurations are currently being migrated to our high-availability database cluster.
          </p>
          <div className="inline-block px-6 py-2 bg-violet-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-violet-500/20">
            System Maintenance
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-8 space-y-8 blur-[6px] pointer-events-none select-none grayscale-[0.4]">
        <div className="flex items-center gap-3">
            <FiSettings className="text-violet-500 text-xl" />
            <h1 className="text-2xl font-bold text-white italic uppercase tracking-tight">Settings</h1>
        </div>

        {error && (
          <div className="mb-4 text-red-300 bg-red-900/30 p-3 rounded border border-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#121217] border border-white/5 rounded-xl p-6 shadow-xl">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Display Theme</h2>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded bg-black/40 border border-white/5 text-xs text-gray-400">System</button>
              <button className="px-4 py-2 rounded bg-black/40 border border-white/5 text-xs text-gray-400">Light</button>
              <button className="px-4 py-2 rounded bg-violet-600/20 border border-violet-500/30 text-xs text-violet-400">Dark</button>
            </div>
          </div>

          <div className="bg-[#121217] border border-white/5 rounded-xl p-6 shadow-xl">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Account Metadata</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-20">
              <input readOnly placeholder="First Name" className="bg-black/40 border border-white/5 px-3 py-2 rounded text-xs outline-none" />
              <input readOnly placeholder="Last Name" className="bg-black/40 border border-white/5 px-3 py-2 rounded text-xs outline-none" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">OAuth Connections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#121217] border border-white/5 rounded-xl p-5 flex items-center justify-between opacity-30">
                <div className="flex items-center gap-3">
                    <FiGithub className="text-xl" />
                    <span className="text-sm font-bold">GitHub</span>
                </div>
                <div className="h-6 w-10 bg-white/5 rounded" />
            </div>
            <div className="bg-[#121217] border border-white/5 rounded-xl p-5 flex items-center justify-between opacity-30">
                <div className="flex items-center gap-3">
                    <SiDiscord className="text-xl" />
                    <span className="text-sm font-bold">Discord</span>
                </div>
                <div className="h-6 w-10 bg-white/5 rounded" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Security & Access Control</h2>
          <Accordion title="API Authentication Keys">Manage programmatic access.</Accordion>
          <Accordion title="S3 Storage Credentials">Manage object storage keys.</Accordion>
          <Accordion title="Identity & MFA Settings">Multi-factor authentication.</Accordion>
          <Accordion title="Container Registry Registry">Deployment credentials.</Accordion>
          <Accordion title="SSH Gateway Keys">Direct pod access.</Accordion>
          <Accordion title="Danger Zone" className="border-red-900/50">
             <button className="px-4 py-2 bg-red-900/20 border border-red-500/30 text-red-500 text-xs rounded font-bold">Delete Account</button>
          </Accordion>
        </div>
      </div>
    </div>
  );
}