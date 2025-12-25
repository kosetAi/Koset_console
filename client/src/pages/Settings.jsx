// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";

// after (works)
import { FiGithub, FiChevronDown, FiTrash2, FiKey } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";            // or import { FaDiscord } from 'react-icons/fa'

import { get, post, put } from "../api.js";
import { useNavigate } from "react-router-dom";

function Accordion({ title, children, openByDefault = false, className = "" }) {
  const [open, setOpen] = useState(openByDefault);
  return (
    <div className={`bg-[#111315] border border-gray-700 rounded mb-3 overflow-hidden ${className}`}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between px-5 py-3 text-left"
      >
        <div className="font-medium text-gray-200">{title}</div>
        <div className="text-gray-400 transform transition-transform" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          <FiChevronDown />
        </div>
      </button>

      {open && <div className="px-5 pb-5 pt-0 text-sm text-gray-300">{children}</div>}
    </div>
  );
}

export default function Settings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accordionsOpen, setAccordionsOpen] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await get("/me"); // expected: { ok:true, user: {...} }
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
      // send only limited profile fields; adapt as backend expects
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
      else {
        await load();
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function handleConnect(provider) {
    // redirect to the provider auth start endpoint
    if (provider === "github") window.location.href = "/auth/github";
    if (provider === "discord") window.location.href = "/auth/discord";
  }

  async function handleGenerateApiKey() {
    setSaving(true);
    setError("");
    try {
      const res = await post("/keys/create", {});
      if (!res.ok) setError(res.error?.message || "Failed to create key");
      else {
        // reload or show key; for now, reload profile/keys
        await load();
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!confirm("This will permanently delete your account. Are you sure?")) return;
    setSaving(true);
    setError("");
    try {
      const res = await post("/me/delete", {});
      if (!res.ok) setError(res.error?.message || "Failed to delete account");
      else {
        // signed out after deletion — redirect to homepage or login
        window.location.href = "/goodbye";
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-lg font-semibold text-white mb-6">Settings</h1>
        <div className="text-gray-300">Loading settings…</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-lg font-semibold text-white mb-6">Settings</h1>

      {error && (
        <div className="mb-4 text-red-300 bg-red-900/30 p-3 rounded border border-red-700">
          {error}
        </div>
      )}

      {/* Top form: Theme + Account Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#111315] border border-gray-700 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-200 mb-3">Theme</h2>
          <div className="flex items-center gap-3">
            <button className="px-3 py-1 rounded bg-[#0b0d0f] border border-gray-700 text-sm text-gray-300">System</button>
            <button className="px-3 py-1 rounded bg-[#0b0d0f] border border-gray-700 text-sm text-gray-300">Light</button>
            <button className="px-3 py-1 rounded bg-[#0b0d0f] border border-gray-700 text-sm text-gray-300">Dark</button>
          </div>
        </div>

        <div className="bg-[#111315] border border-gray-700 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-200 mb-3">Account Info</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              placeholder="First Name"
              value={profile?.firstName || ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="bg-[#0b0d0f] border border-gray-700 px-3 py-2 rounded text-sm outline-none"
            />
            <input
              placeholder="Last Name"
              value={profile?.lastName || ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="bg-[#0b0d0f] border border-gray-700 px-3 py-2 rounded text-sm outline-none"
            />

            <input
              placeholder="Address Line 1"
              value={profile?.address1 || ""}
              onChange={(e) => handleChange("address1", e.target.value)}
              className="md:col-span-2 bg-[#0b0d0f] border border-gray-700 px-3 py-2 rounded text-sm outline-none"
            />
            <input
              placeholder="Address Line 2"
              value={profile?.address2 || ""}
              onChange={(e) => handleChange("address2", e.target.value)}
              className="md:col-span-2 bg-[#0b0d0f] border border-gray-700 px-3 py-2 rounded text-sm outline-none"
            />

            <select
              value={profile?.country || ""}
              onChange={(e) => handleChange("country", e.target.value)}
              className="bg-[#0b0d0f] border border-gray-700 px-3 py-2 rounded text-sm outline-none"
            >
              <option value="">Country</option>
              <option value="IN">India</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
            </select>

            <input
              placeholder="Company Name"
              value={profile?.company || ""}
              onChange={(e) => handleChange("company", e.target.value)}
              className="bg-[#0b0d0f] border border-gray-700 px-3 py-2 rounded text-sm outline-none"
            />

            <input
              placeholder="Company ID"
              value={profile?.companyId || ""}
              onChange={(e) => handleChange("companyId", e.target.value)}
              className="bg-[#0b0d0f] border border-gray-700 px-3 py-2 rounded text-sm outline-none"
            />

            <input
              placeholder="Tax ID"
              value={profile?.taxId || ""}
              onChange={(e) => handleChange("taxId", e.target.value)}
              className="bg-[#0b0d0f] border border-gray-700 px-3 py-2 rounded text-sm outline-none"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Connections */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-200 mb-3">Connections</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#111315] border border-gray-700 rounded p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <FiGithub className="text-gray-200" />
                <div className="font-medium text-gray-200">GitHub</div>
              </div>
              <div className="text-sm text-gray-400">
                Connect your GitHub account to deploy Serverless Endpoints from your repositories.
              </div>
            </div>

            <div className="flex items-center">
              <button onClick={() => handleConnect("github")} className="px-3 py-2 bg-[#0b0d0f] border border-gray-700 rounded text-sm">
                Connect
              </button>
            </div>
          </div>

          <div className="bg-[#111315] border border-gray-700 rounded p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <SiDiscord className="text-blue-400" />
                <div className="font-medium text-gray-200">Discord</div>
              </div>
              <div className="text-sm text-gray-400">
                Connect your Discord account for support and community access.
              </div>
            </div>

            <div>
              <button onClick={() => handleConnect("discord")} className="px-3 py-2 bg-[#0b0d0f] border border-gray-700 rounded text-sm">
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accordions list */}
      <div>
        <Accordion title="API Keys">
          <div className="flex items-center gap-3">
            <div className="flex-1 text-sm text-gray-300">Manage your API keys for programmatic access.</div>
            <div className="flex gap-2">
              <button onClick={handleGenerateApiKey} className="px-3 py-2 rounded bg-[#0b0d0f] border border-gray-700 text-sm">
                <FiKey /> Generate
              </button>
            </div>
          </div>
        </Accordion>

        <Accordion title="S3 API Keys">
          <div className="text-sm text-gray-300">Manage S3-compatible API keys for object storage.</div>
        </Accordion>

        <Accordion title="Login Settings">
          <div className="text-sm text-gray-300">Configure OTP, session timeouts and multi-factor auth (if available).</div>
        </Accordion>

        <Accordion title="Active Sessions">
          <div className="text-sm text-gray-300">List of active sessions. Option to revoke individual sessions.</div>
        </Accordion>

        <Accordion title="Container Registry Auth">
          <div className="text-sm text-gray-300">Configure container registry credentials used for deployments.</div>
        </Accordion>

        <Accordion title="Notification Settings">
          <div className="text-sm text-gray-300">Email and Slack notification preferences.</div>
        </Accordion>

        <Accordion title="SSH Public Keys">
          <div className="text-sm text-gray-300">Add or remove SSH public keys for direct pod access.</div>
        </Accordion>

        <Accordion title="Onboarding Checklist">
          <div className="text-sm text-gray-300">Helpful steps for first-time users.</div>
        </Accordion>

        <Accordion title="Delete Account" className="border-red-600">
          <div className="text-sm text-red-300 mb-3">
            Deleting your account will remove all data and cannot be undone.
          </div>
          <div className="flex gap-3">
            <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded">
              <FiTrash2 /> Delete Account
            </button>
            <button onClick={() => navigate("/support")} className="px-4 py-2 bg-[#0b0d0f] border border-gray-700 rounded text-sm">
              Contact Support
            </button>
          </div>
        </Accordion>
      </div>
    </div>
  );
}
