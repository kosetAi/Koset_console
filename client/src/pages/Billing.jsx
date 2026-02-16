// src/pages/Billing.jsx
import React, { useEffect, useState } from "react";
import {
  FiCreditCard,
  FiPlus,
  FiChevronDown,
  FiRefreshCw,
  FiLock,
} from "react-icons/fi";
import { get, post, put } from "../api.js";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader.jsx";

export default function Billing() {
  const [isPageReady, setIsPageReady] = useState(false);
  useEffect(() => {
    // Simulate a brief delay or wait for actual data
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 1200); // 1.2 seconds feels snappy but professional

    return () => clearTimeout(timer);
  }, []);
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [redeemCode, setRedeemCode] = useState("");
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
        setBilling(
          res.billing || { balance: 0, spendLimit: 0, currentRate: 0 },
        );
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

  if (!isPageReady) return <Loader />;

  return (
    <div className="relative min-h-screen bg-[#09090B]">
      {/* COMING SOON OVERLAY - FIXED TO VIEWPORT CENTER */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
        <div className="bg-[#121217]/90 border border-violet-500/20 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-2xl text-center max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-violet-600/20 rounded-2xl border border-violet-500/40">
              <FiLock className="text-violet-500 text-3xl" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
            Coming Soon
          </h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            The Billing and Transaction system is currently being integrated
            with our secure payment gateway.
          </p>
          <div className="inline-block px-8 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-violet-500/20 uppercase tracking-widest">
            In Development
          </div>
        </div>
      </div>

      {/* BLURRED CONTENT LAYER */}
      <div className="p-4 sm:p-8 space-y-6 blur-[8px] pointer-events-none select-none grayscale-[0.4]">
        <h1 className="text-xl sm:text-2xl font-semibold text-white mb-6">
          Billing
        </h1>

        {error && (
          <div className="mb-4 text-red-300 bg-red-900/30 p-3 rounded border border-red-700 text-sm">
            {error}
          </div>
        )}

        {/* BALANCE CARD - RESPONSIVE STACKING */}
        <div className="bg-[#111315] border border-gray-700 rounded-xl p-5 sm:p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="text-xl sm:text-2xl font-semibold text-white">
                Balance: ${Number(billing?.balance || 0).toFixed(2)}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 mt-2 space-y-1">
                <p>
                  Spend Limit: $
                  {Number(billing?.spendLimit || 0).toLocaleString()} / hr
                </p>
                <p>
                  Current GPU Cloud Spend: $
                  {Number(billing?.currentRate || 0).toFixed(3)} / hr
                </p>
              </div>

              <div className="mt-6">
                <div className="text-xs sm:text-sm text-gray-300 mb-3">
                  Choose an amount to add:
                </div>
                <div className="flex flex-wrap gap-2">
                  {[150, 200, 250, 500].map((amt) => (
                    <button
                      key={amt}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-md bg-[#0d0f11] border border-gray-700 text-xs sm:text-sm text-gray-200"
                    >
                      ${amt}
                    </button>
                  ))}
                  <button className="flex-1 sm:flex-none px-4 py-2 rounded-md bg-[#0d0f11] border border-gray-700 text-xs sm:text-sm text-gray-200">
                    Other
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-stretch sm:items-end gap-3 lg:min-w-[200px]">
              <button className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-bold inline-flex items-center justify-center gap-2 shadow-lg shadow-violet-500/10">
                <FiCreditCard /> Pay with card <FiChevronDown />
              </button>
              <div className="text-[10px] sm:text-xs text-gray-500 text-center sm:text-right">
                Last payment: {billing?.lastPaymentDate || "—"}
              </div>
            </div>
          </div>
        </div>

        {/* AUTO-PAY SECTION */}
        <div className="bg-[#111315] border border-gray-700 rounded-xl p-5 sm:px-8 sm:py-5 mb-6 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="font-semibold text-white text-sm sm:text-base flex items-center gap-2">
              Auto-Pay
              <span
                className={`text-[10px] uppercase px-2 py-0.5 rounded ${autoPayEnabled ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
              >
                {autoPayEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl truncate sm:whitespace-normal">
              Configure automatic billing by adding a card.
            </p>
          </div>
          <div className="relative inline-block w-10 h-6 flex-shrink-0">
            <input
              type="checkbox"
              checked={autoPayEnabled}
              readOnly
              className="sr-only"
            />
            <div
              className={`block w-10 h-6 rounded-full border border-gray-600 transition-colors ${autoPayEnabled ? "bg-violet-600 border-violet-500" : "bg-gray-800"}`}
            />
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${autoPayEnabled ? "translate-x-4" : "translate-x-0"}`}
            />
          </div>
        </div>

        {/* PAYMENT METHODS SECTION */}
        <div className="bg-[#111315] border border-gray-700 rounded-xl p-5 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-white text-sm sm:text-base">
                My Payment Methods
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Manage your connected billing methods.
              </p>
            </div>
            <button className="w-full sm:w-auto px-4 py-2 rounded-lg bg-violet-600 text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-lg shadow-violet-500/10">
              <FiPlus /> Add Card
            </button>
          </div>
          <div className="mt-6 min-h-[100px] border border-dashed border-gray-800 rounded-lg p-6 text-center text-gray-500 text-xs sm:text-sm font-medium flex items-center justify-center">
            No Payment Methods Detected
          </div>
        </div>

        {/* CREDIT CODES + TRANSACTIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111315] border border-gray-700 rounded-xl p-5 sm:p-6">
            <h3 className="font-semibold text-white text-sm sm:text-base mb-4">
              Credit Codes
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                readOnly
                placeholder="Enter code"
                className="w-full sm:flex-1 bg-[#0b0d0f] border border-gray-700 px-4 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-violet-500"
              />
              <button className="w-full sm:w-auto px-4 py-2 bg-[#222225] text-white rounded-lg text-sm font-bold">
                Redeem
              </button>
            </div>
          </div>

          <div className="bg-[#111315] border border-gray-700 rounded-xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white text-sm sm:text-base">
                Recent Transactions
              </h3>
              <FiRefreshCw className="text-gray-500 cursor-pointer" />
            </div>
            <div className="text-xs sm:text-sm text-gray-500 italic py-4">
              No transactions recorded.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
