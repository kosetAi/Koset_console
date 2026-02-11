// src/pages/SavingsPlans.jsx
import React, { useEffect, useState } from "react";
import { FiPlus, FiBox, FiTrash2, FiLock } from "react-icons/fi";
import { get, post, put, post as _post } from "../api.js";
import { useNavigate } from "react-router-dom";

export default function SavingsPlans() {
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

  if (loading) {
    return (
      <div className="p-8 bg-[#09090B] min-h-screen">
        <h1 className="text-lg font-semibold text-white mb-4 italic">Savings Plans</h1>
        <div className="text-gray-500 font-mono text-xs animate-pulse">CALCULATING_COMMITMENT_DATA...</div>
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
            Reserved Capacity and Long-term Savings Plans are currently being integrated into our financial engine.
          </p>
          <div className="inline-block px-6 py-2 bg-violet-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-violet-500/20">
            Phase 2 Financials
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-8 space-y-6 blur-[6px] pointer-events-none select-none grayscale-[0.4]">
        <h1 className="text-lg font-semibold text-white mb-6">Savings Plans</h1>

        {error && (
          <div className="mb-4 text-red-300 bg-red-900/30 p-3 rounded border border-red-700">
            {error}
          </div>
        )}

        <div className="mb-6">
          <button
            className="text-violet-400 hover:text-violet-300 text-sm underline"
          >
            What are savings plans? ↗
          </button>
        </div>

        {plans.length === 0 ? (
          <div className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-8 flex items-center justify-between shadow-xl">
            <div>
              <div className="font-semibold text-white text-lg italic">Commitment Credits</div>
              <div className="text-sm text-gray-400 mt-2">
                Deploy a Pod with a Savings Plan to reduce long-term compute costs.
              </div>
            </div>

            <div>
              <button className="px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-md shadow-lg shadow-violet-500/10">
                Explore Capacity
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((p) => (
              <div key={p.id} className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-5 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-[#0d0f11] border border-white/5 flex items-center justify-center text-violet-500 text-xl shadow-inner">
                      <FiBox />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">{p.name || `Plan ${p.id}`}</div>
                      <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">
                        {p.duration_months || 0} Month Reserved
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-bold text-emerald-500 text-lg">${Number(p.savings || 0).toFixed(2)}</div>
                    <div className="text-[10px] text-gray-600 uppercase font-black tracking-tighter">Accrued Savings</div>
                  </div>

                  <button className="px-3 py-2 rounded bg-black/40 border border-white/5 text-xs text-red-400 flex items-center gap-2">
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