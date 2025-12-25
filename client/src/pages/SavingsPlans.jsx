// src/pages/SavingsPlans.jsx
import React, { useEffect, useState } from "react";
import { FiPlus, FiBox, FiTrash2 } from "react-icons/fi";
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
      // Expected endpoint: GET /savings-plans
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
    // Navigate user to pods page where they can choose a plan when they create a pod
    navigate("/pods");
  }

  async function handleCancel(planId) {
    if (!confirm("Cancel this savings plan?")) return;
    setBusy(true);
    setError("");
    try {
      // Expected: POST /savings-plans/:id/cancel or DELETE /savings-plans/:id
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
      <div className="p-8">
        <h1 className="text-lg font-semibold text-white mb-4">Savings Plans</h1>
        <div className="text-gray-300">Loading savings plans…</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-lg font-semibold text-white mb-6">Savings Plans</h1>

      {error && (
        <div className="mb-4 text-red-300 bg-red-900/30 p-3 rounded border border-red-700">
          {error}
        </div>
      )}

      {/* Top help link */}
      <div className="mb-6">
        <a
          href="#"
          className="text-purple-400 hover:text-purple-300 text-sm"
          onClick={(e) => {
            e.preventDefault();
            // link to docs or open external link
            window.open("https://docs.example.com/savings-plans", "_blank");
          }}
        >
          What are savings plans? ↗
        </a>
      </div>

      {/* Empty state */}
      {plans.length === 0 ? (
        <div className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-6 flex items-center justify-between">
          <div>
            <div className="font-semibold text-white text-lg">You don't have any Savings Plans</div>
            <div className="text-sm text-gray-400 mt-2">
              Deploy a Pod with a Savings Plan to get started
            </div>
          </div>

          <div>
            <button
              onClick={handleDeployPod}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md"
            >
              Deploy a Pod
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active plans list */}
          {plans.map((p) => (
            <div key={p.id} className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-5 flex items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-md bg-[#0d0f11] flex items-center justify-center text-lg">
                    <FiBox />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">{p.name || `Plan ${p.id}`}</div>
                    <div className="text-sm text-gray-400">
                      {p.description || `${p.duration_months || 0} month plan — ${p.discount_percent || 0}% off`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-300 text-right">
                  <div className="font-medium text-white">${Number(p.savings || 0).toFixed(2)}</div>
                  <div className="text-xs text-gray-400">Estimated savings</div>
                </div>

                <div>
                  <button
                    onClick={() => handleCancel(p.id)}
                    disabled={busy}
                    className="px-3 py-2 rounded-md bg-[#0b0d0f] border border-gray-700 text-sm text-red-400 hover:text-white"
                  >
                    <FiTrash2 /> Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Explore / manage more */}
          <div className="flex justify-end">
            <button
              onClick={handleDeployPod}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md"
            >
              Deploy a Pod
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
