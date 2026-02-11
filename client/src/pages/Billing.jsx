// src/pages/Billing.jsx
import React, { useEffect, useState } from "react";
import { FiCreditCard, FiPlus, FiChevronDown, FiRefreshCw, FiLock } from "react-icons/fi";
import { get, post, put } from "../api.js";
import { useNavigate } from "react-router-dom";

export default function Billing() {
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState(null); // { balance, spendLimit, currentRate }
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [redeemCode, setRedeemCode] = useState("");
  const [creditCodesVisible, setCreditCodesVisible] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const res = await get("/billing");
      if (!res.ok) {
        setError(res.error?.message || "Failed to load billing");
      } else {
        setBilling(res.billing || { balance: 0, spendLimit: 0, currentRate: 0 });
        setPaymentMethods(res.paymentMethods || []);
        setAutoPayEnabled(!!res.billing?.autoPayEnabled);
      }

      const tx = await get("/billing/transactions");
      setTransactions(tx?.transactions || []);
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleToggleAutoPay() {
    const next = !autoPayEnabled;
    setBusy(true);
    try {
      const res = await put("/billing/autopay", { enabled: next });
      if (!res.ok) {
        setError(res.error?.message || "Failed to update Auto-Pay");
      } else {
        setAutoPayEnabled(next);
      }
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  async function handleRedeem() {
    if (!redeemCode.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await post("/billing/redeem", { code: redeemCode.trim() });
      if (!res.ok) setError(res.error?.message || "Redeem failed");
      else {
        setRedeemCode("");
        await loadAll();
      }
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  async function handleGenerateCode() {
    setBusy(true);
    setError("");
    try {
      const res = await post("/billing/generate-code", {});
      if (!res.ok) setError(res.error?.message || "Failed to generate code");
      else {
        await loadAll();
      }
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  function handleAddPaymentMethod() {
    navigate("/billing/add-payment");
  }

  if (loading) {
    return (
      <div className="p-8 bg-[#09090B] min-h-screen">
        <div className="text-gray-300">Loading billing…</div>
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
            The Billing and Transaction system is currently being integrated with our secure payment gateway.
          </p>
          <div className="inline-block px-6 py-2 bg-violet-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-violet-500/20">
            In Development
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-6 blur-[6px] pointer-events-none select-none grayscale-[0.4]">
        <h1 className="text-lg font-semibold text-white mb-6">Billing</h1>

        {error && (
          <div className="mb-4 text-red-300 bg-red-900/30 p-3 rounded border border-red-700">
            {error}
          </div>
        )}

        {/* BALANCE CARD */}
        <div className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl font-semibold text-white">
                Balance: ${Number(billing?.balance || 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                Spend Limit: ${Number(billing?.spendLimit || 0).toLocaleString()} / hr
                <div className="mt-1">Current GPU Cloud Spend: ${Number(billing?.currentRate || 0).toFixed(3)} / hr</div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-gray-300 mb-2">Choose an amount to add.</div>
                <div className="flex gap-2 flex-wrap">
                  {[150, 200, 250, 500].map((amt) => (
                    <button
                      key={amt}
                      className="px-4 py-2 rounded-md bg-[#0d0f11] border border-gray-700 text-sm text-gray-200"
                    >
                      ${amt}
                    </button>
                  ))}
                  <button className="px-4 py-2 rounded-md bg-[#0d0f11] border border-gray-700 text-sm text-gray-200">
                    Other
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <button className="px-4 py-2 rounded-md bg-purple-600 text-white text-sm inline-flex items-center gap-2">
                <FiCreditCard /> Pay with card <FiChevronDown />
              </button>
              <div className="text-xs text-gray-400">Last payment: {billing?.lastPaymentDate || "—"}</div>
            </div>
          </div>
        </div>

        {/* AUTO-PAY */}
        <div className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-5 mb-6 flex items-center justify-between">
          <div>
            <div className="font-semibold text-white">Auto-Pay <span className="text-sm text-red-400 ml-3">{autoPayEnabled ? "Enabled" : "Disabled"}</span></div>
            <p className="text-sm text-gray-400 mt-1 max-w-xl">
              Configure automatic billing by adding a card to your account.
            </p>
          </div>
          <input type="checkbox" checked={autoPayEnabled} readOnly className="w-10 h-6 rounded-full accent-violet-500" />
        </div>

        {/* PAYMENT METHODS */}
        <div className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white">My Payment Methods</h2>
              <p className="text-sm text-gray-400">Payment methods associated with your account.</p>
            </div>
            <button className="px-4 py-2 rounded-md bg-purple-600 text-white text-sm inline-flex items-center gap-2">
              <FiPlus /> Add Payment Method
            </button>
          </div>
          <div className="mt-6 min-h-[120px] border border-gray-800 rounded p-6 text-center text-gray-400 font-medium">
             No Payment Methods Detected
          </div>
        </div>

        {/* CREDIT CODES + TRANSACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-6">
            <h3 className="font-semibold text-white">Credit Codes</h3>
            <div className="mt-4 flex gap-2">
              <input readOnly placeholder="Credit code" className="flex-1 bg-[#0b0d0f] border border-gray-700 px-3 py-2 rounded text-sm outline-none" />
              <button className="px-3 py-2 bg-[#222225] text-white rounded-md text-sm">Redeem Code</button>
            </div>
          </div>

          <div className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-6">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-white">Recent Transactions</h3>
              <FiRefreshCw className="text-gray-500" />
            </div>
            <div className="mt-4 text-sm text-gray-400 italic">No transactions recorded.</div>
          </div>
        </div>
      </div>
    </div>
  );
}