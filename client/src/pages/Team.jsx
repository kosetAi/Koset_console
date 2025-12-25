
// src/pages/Team.jsx
import React, { useEffect, useState } from "react";
import { FiUserPlus, FiUser, FiTrash2, FiUsers } from "react-icons/fi";
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
      // Backend method could be delete; using post for compatibility with your api.js helper
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
      <div className="p-8">
        <div className="text-gray-300">Loading team…</div>
      </div>
    );
  }

  // Empty (not a team account)
  if (!team || !team.isTeam) {
    return (
      <div className="p-8">
        <h1 className="text-lg font-semibold text-white mb-6">Team</h1>

        {error && (
          <div className="mb-4 text-red-300 bg-red-900/30 p-3 rounded border border-red-700">
            {error}
          </div>
        )}

        <div className="bg-[#111315] border border-gray-700 rounded-xl px-8 py-12 flex items-center gap-8">
          {/* Illustration placeholder */}
          <div className="w-1/2 hidden lg:block">
            <img
              src="https://dummyimage.com/600x360/111/4455&text=Team+illustration"
              alt="Team illustration"
              className="w-full"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Convert your account to a team account to collaborate with others.
            </h2>
            <p className="text-gray-400 mb-6">
              Invite other users to your team to share access to the account and resources using scoped roles.
            </p>

            <div>
              <button
                onClick={handleConvertToTeam}
                disabled={busy}
                className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-md transition"
              >
                {busy ? "Converting…" : "Convert to a Team Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Team exists — show members
  return (
    <div className="p-8">
      <h1 className="text-lg font-semibold text-white mb-6">Team</h1>

      {error && (
        <div className="mb-4 text-red-300 bg-red-900/30 p-3 rounded border border-red-700">
          {error}
        </div>
      )}

      <div className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">{team.orgName || "Your Team"}</h2>
            <p className="text-sm text-gray-400 mt-1">
              Manage members and roles for your team account.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400">Members: <strong className="text-white">{team.members?.length || 0}</strong></div>
            <button
              onClick={() => { /* focus invite input below */ document.getElementById("invite-email")?.focus(); }}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md inline-flex items-center gap-2"
            >
              <FiUserPlus /> Invite
            </button>
          </div>
        </div>
      </div>

      {/* Invite form */}
      <form onSubmit={handleInvite} className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-6 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            id="invite-email"
            type="email"
            placeholder="user@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1 bg-[#0b0d0f] border border-gray-700 px-3 py-2 rounded text-sm outline-none"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="w-40 bg-[#0b0d0f] border border-gray-700 px-3 py-2 rounded text-sm"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
            <option value="billing">Billing</option>
          </select>

          <button
            type="submit"
            disabled={inviting}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md"
          >
            {inviting ? "Inviting…" : <span className="inline-flex items-center gap-2"><FiUserPlus /> Invite</span>}
          </button>
        </div>
      </form>

      {/* Members list */}
      <div className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-6">
        <h3 className="font-semibold text-white mb-4">Members</h3>

        {(!team.members || team.members.length === 0) ? (
          <div className="text-gray-400">No members yet.</div>
        ) : (
          <div className="space-y-3">
            {team.members.map((m) => (
              <div key={m.id} className="flex items-center justify-between bg-[#0b0d0f] p-3 rounded border border-gray-800">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-[#1a1b1d] flex items-center justify-center text-white text-sm font-medium">
                    {m.name ? m.name.charAt(0).toUpperCase() : m.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-gray-200 truncate">{m.name || m.email}</div>
                    <div className="text-xs text-gray-400">{m.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs px-2 py-1 rounded bg-[#131416] border border-gray-700 text-gray-300">
                    {m.role || "member"}
                  </div>

                  <button
                    onClick={() => handleRemoveMember(m.id)}
                    disabled={busy}
                    className="text-red-400 hover:text-white text-sm inline-flex items-center gap-2"
                    title="Remove member"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
