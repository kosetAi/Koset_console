// src/pages/SavingsPlans.jsx
import React, { useEffect, useState } from "react";
import { FiPlus, FiBox, FiTrash2, FiLock } from "react-icons/fi";
import { get, post, put, post as _post } from "../api.js";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader.jsx";

/**
 * SavingsPlans.jsx
 * - Logic: UNCHANGED
 * - Layout: UPDATED for Mobile Responsiveness
 * - Coming Soon Overlay: UPDATED to fixed positioning for viewport centering
 */

export default function SavingsPlans() {
  const [isPageReady, setIsPageReady] = useState(false);
  useEffect(() => {
    // Simulate a brief delay or wait for actual data
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 1200); // 1.2 seconds feels snappy but professional

    return () => clearTimeout(timer);
  }, []);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await get("/savings-plans");
      if (!res.ok) {
        setError(res.error?.message || "Failed to load savings plans");
        setPlans([]);
      } else {
        setPlans(res.plans || []);
      }
    } catch (e) {
      setError("Network error");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleDeployPod() {
    navigate("/pods");
  }

  async function handleCancel(planId) {
    if (!confirm("Cancel this savings plan?")) return;
    setBusy(true);
    setError("");
    try {
      const res = await post(`/savings-plans/${planId}/cancel`, {});
      if (!res.ok) setError(res.error?.message || "Failed to cancel plan");
      else await load();
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  if (!isPageReady) return <Loader />;

  return (
    <div className="relative min-h-screen bg-[#09090B]">
      
      {/* COMING SOON OVERLAY - FIXED POSITIONING FOR VIEWPORT CENTERING */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
        <div className="bg-[#121217]/90 border border-violet-500/20 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-2xl text-center max-w-sm w-full transition-all">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-violet-600/20 rounded-2xl border border-violet-500/40 shadow-inner">
              <FiLock className="text-violet-500 text-3xl" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">Coming Soon</h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Reserved Capacity and Long-term Savings Plans are currently being integrated into our financial engine.
          </p>
          <div className="inline-block px-8 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-violet-500/30 uppercase tracking-widest">
            Phase 2 Financials
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-4 sm:p-8 space-y-6 blur-[8px] pointer-events-none select-none grayscale-[0.4]">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-6">Savings Plans</h1>

        {error && (
          <div className="mb-4 text-red-300 bg-red-900/30 p-3 rounded border border-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <button
            className="text-violet-400 hover:text-violet-300 text-xs sm:text-sm underline font-medium"
          >
            What are savings plans? ↗
          </button>
        </div>

        {plans.length === 0 ? (
          /* EMPTY STATE CARD - RESPONSIVE STACKING */
          <div className="bg-[#111315] border border-gray-700 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
            <div className="max-w-xl">
              <div className="font-semibold text-white text-lg italic mb-2">Commitment Credits</div>
              <div className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Deploy a Pod with a Savings Plan to reduce long-term compute costs.
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-violet-500/20 whitespace-nowrap active:scale-95 transition-all">
                Explore Capacity
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE PLANS LIST - RESPONSIVE REFLOW */
          <div className="space-y-4">
            {plans.map((p) => (
              <div key={p.id} className="bg-[#111315] border border-gray-700 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="min-w-0 w-full md:w-auto">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[#0d0f11] border border-white/5 flex items-center justify-center text-violet-500 text-xl shadow-inner flex-shrink-0">
                      <FiBox />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate text-sm sm:text-base">{p.name || `Plan ${p.id}`}</div>
                      <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">
                        {p.duration_months || 0} Month Reserved
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 sm:gap-8 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                  <div className="text-left md:text-right">
                    <div className="font-bold text-emerald-500 text-lg">${Number(p.savings || 0).toFixed(2)}</div>
                    <div className="text-[9px] text-gray-600 uppercase font-black tracking-tighter">Accrued Savings</div>
                  </div>

                  <button className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-bold flex items-center gap-2 hover:bg-red-500/20 transition-all">
                    <FiTrash2 /> Cancel
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