// src/pages/Team.jsx
import React, { useEffect, useState } from "react";
import { FiUserPlus, FiUser, FiTrash2, FiUsers, FiLock } from "react-icons/fi";
import { get, post, put } from "../api.js";

export default function Team() {
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState(null); // expected { isTeam: bool, members: [], orgName }
  const [inviting, setInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadTeam() {
    setLoading(true);
    setError("");
    try {
      const res = await get("/team");
      if (!res.ok) {
        setError(res.error?.message || "Failed to load team");
        setTeam(null);
      } else {
        setTeam(res.team || { isTeam: false, members: [] });
      }
    } catch {
      setError("Network error");
      setTeam(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeam();
  }, []);

  async function handleConvertToTeam() {
    setBusy(true);
    setError("");
    try {
      const res = await post("/team/convert", {});
      if (!res.ok) setError(res.error?.message || "Failed to convert account");
      else await loadTeam();
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  async function handleInvite(e) {
    e?.preventDefault();
    if (!inviteEmail.trim()) {
      setError("Please enter an email to invite.");
      return;
    }

    setInviting(true);
    setError("");
    try {
      const res = await post("/team/invite", {
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      if (!res.ok) setError(res.error?.message || "Invite failed");
      else {
        setInviteEmail("");
        setInviteRole("member");
        await loadTeam();
      }
    } catch {
      setError("Network error");
    } finally {
      setInviting(false);
    }
  }

  async function handleRemoveMember(memberId) {
    if (!confirm("Remove this member from the team?")) return;
    setBusy(true);
    setError("");
    try {
      const res = await post(`/team/members/${memberId}/remove`, {});
      if (!res.ok) setError(res.error?.message || "Failed to remove member");
      else await loadTeam();
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 bg-[#09090B] min-h-screen">
        <div className="text-gray-300">Loading team…</div>
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
          <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            The Multi-User Collaboration and RBAC (Role-Based Access Control) system is currently being finalized.
          </p>
          <div className="inline-block px-6 py-2 bg-violet-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-violet-500/20">
            Phase 2 Deployment
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-8 blur-[6px] pointer-events-none select-none grayscale-[0.4]">
        <h1 className="text-lg font-semibold text-white mb-6">Team</h1>

        {error && (
          <div className="mb-4 text-red-300 bg-red-900/30 p-3 rounded border border-red-700">
            {error}
          </div>
        )}

        {/* Not a team account view */}
        {(!team || !team.isTeam) ? (
          <div className="bg-[#111315] border border-gray-700 rounded-xl px-8 py-12 flex items-center gap-8">
            <div className="w-1/2 hidden lg:block opacity-20">
              <img src="https://dummyimage.com/600x360/111/4455&text=Team+System" alt="Team illustration" className="w-full" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-3">Convert to Collaborate</h2>
              <p className="text-gray-400 mb-6">Invite users to your team to share resources using scoped roles.</p>
              <button className="px-5 py-3 bg-purple-600 text-white rounded-md">Convert to Team</button>
            </div>
          </div>
        ) : (
          /* Team Active view */
          <div className="space-y-6">
            <div className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">{team.orgName || "Your Team"}</h2>
                <p className="text-sm text-gray-400 mt-1">Manage members and roles.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-400">Members: <strong className="text-white">{team.members?.length || 0}</strong></div>
                <button className="px-3 py-2 bg-purple-600 text-white rounded-md inline-flex items-center gap-2"><FiUserPlus /> Invite</button>
              </div>
            </div>

            <div className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-6">
              <div className="flex flex-col md:flex-row gap-3 opacity-50">
                <input readOnly placeholder="user@example.com" className="flex-1 bg-[#0b0d0f] border border-gray-700 px-3 py-2 rounded text-sm outline-none" />
                <select disabled className="w-40 bg-[#0b0d0f] border border-gray-700 px-3 py-2 rounded text-sm"><option>Member</option></select>
                <button disabled className="px-4 py-2 bg-purple-600 text-white rounded-md flex items-center gap-2"><FiUserPlus /> Invite</button>
              </div>
            </div>

            <div className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-6">
              <h3 className="font-semibold text-white mb-4">Members</h3>
              <div className="space-y-3 opacity-20">
                <div className="flex items-center justify-between bg-[#0b0d0f] p-3 rounded border border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#1a1b1d] flex items-center justify-center text-white">U</div>
                    <div>
                      <div className="text-sm text-gray-200">Example User</div>
                      <div className="text-xs text-gray-400">user@example.com</div>
                    </div>
                  </div>
                  <FiTrash2 className="text-gray-700" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}