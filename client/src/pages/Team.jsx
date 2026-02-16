// src/pages/Team.jsx
import React, { useEffect, useState } from "react";
import { FiUserPlus, FiUser, FiTrash2, FiUsers, FiLock } from "react-icons/fi";
import { get, post, put } from "../api.js";
import Loader from "../components/Loader.jsx";

/**
 * Team.jsx
 * - Logic: UNCHANGED
 * - Layout: UPDATED for Mobile Responsiveness
 * - Coming Soon Overlay: UPDATED to fixed positioning for viewport centering
 */

export default function Team() {
  const [isPageReady, setIsPageReady] = useState(false);
  useEffect(() => {
    // Simulate a brief delay or wait for actual data
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 1200); // 1.2 seconds feels snappy but professional

    return () => clearTimeout(timer);
  }, []);
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

  if (loading) {
    return (
      <div className="p-8 bg-[#09090B] min-h-screen">
        <div className="text-gray-300">Loading team…</div>
      </div>
    );
  }

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
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
            Coming Soon
          </h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            The Multi-User Collaboration and RBAC (Role-Based Access Control)
            system is currently being finalized.
          </p>
          <div className="inline-block px-8 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-violet-500/20 uppercase tracking-widest">
            Phase 2 Deployment
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-4 sm:p-8 space-y-6 blur-[6px] pointer-events-none select-none grayscale-[0.4]">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Team</h1>

        {error && (
          <div className="mb-4 text-red-300 bg-red-900/30 p-3 rounded border border-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Not a team account view - RESPONSIVE FLEX */}
        {!team || !team.isTeam ? (
          <div className="bg-[#111315] border border-gray-700 rounded-2xl p-6 sm:p-12 flex flex-col lg:flex-row items-center gap-8 shadow-xl">
            <div className="w-full lg:w-1/2 hidden sm:block opacity-20 order-2 lg:order-1">
              <img
                src="https://dummyimage.com/600x360/111/4455&text=Team+System"
                alt="Team illustration"
                className="w-full rounded-xl"
              />
            </div>
            <div className="flex-1 text-center lg:text-left order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Convert to Collaborate
              </h2>
              <p className="text-gray-400 mb-8 text-sm sm:text-base leading-relaxed">
                Invite users to your team to share resources using scoped roles.
              </p>
              <button className="w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-lg shadow-purple-500/20 transition-all active:scale-95">
                Convert to Team
              </button>
            </div>
          </div>
        ) : (
          /* Team Active view - RESPONSIVE STACKING */
          <div className="space-y-6">
            <div className="bg-[#111315] border border-gray-700 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {team.orgName || "Your Team"}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Manage members and roles.
                </p>
              </div>
              <div className="flex flex-row items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <div className="text-sm text-gray-400">
                  Members:{" "}
                  <strong className="text-white">
                    {team.members?.length || 0}
                  </strong>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg inline-flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all active:scale-95">
                  <FiUserPlus /> Invite
                </button>
              </div>
            </div>

            {/* Invite Form Row - RESPONSIVE FLEX */}
            <div className="bg-[#111315] border border-gray-700 rounded-xl p-5 sm:p-6 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4 opacity-50">
                <input
                  readOnly
                  placeholder="user@example.com"
                  className="w-full md:flex-1 bg-[#0b0d0f] border border-gray-700 px-4 py-2.5 sm:py-2 rounded-lg text-sm outline-none"
                />
                <select
                  disabled
                  className="w-full md:w-40 bg-[#0b0d0f] border border-gray-700 px-4 py-2.5 sm:py-2 rounded-lg text-sm outline-none appearance-none"
                >
                  <option>Member</option>
                </select>
                <button
                  disabled
                  className="w-full md:w-auto px-6 py-2.5 sm:py-2 bg-purple-600 text-white rounded-lg flex items-center justify-center gap-2 font-bold transition-all"
                >
                  <FiUserPlus /> Send
                </button>
              </div>
            </div>

            {/* Members Section - RESPONSIVE LIST */}
            <div className="bg-[#111315] border border-gray-700 rounded-xl p-5 sm:p-6 shadow-lg">
              <h3 className="font-semibold text-white mb-4 uppercase tracking-widest text-xs">
                Members
              </h3>
              <div className="space-y-3 opacity-20">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-[#0b0d0f] p-4 rounded-xl border border-gray-800 transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white font-bold flex-shrink-0">
                        U
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-gray-200 truncate">
                          Example User
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          user@example.com
                        </div>
                      </div>
                    </div>
                    <FiTrash2 className="text-gray-700 flex-shrink-0 cursor-not-allowed ml-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
