// src/pages/Billing.jsx
import React, { useEffect, useState } from "react";
import { FiCreditCard, FiPlus, FiChevronDown, FiRefreshCw } from "react-icons/fi";
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
      const res = await get("/billing"); // expected: { ok:true, billing: { balance, spendLimit, currentRate }, paymentMethods: [] }
      if (!res.ok) {
        setError(res.error?.message || "Failed to load billing");
      } else {
        setBilling(res.billing || { balance: 0, spendLimit: 0, currentRate: 0 });
        setPaymentMethods(res.paymentMethods || []);
        setAutoPayEnabled(!!res.billing?.autoPayEnabled);
      }

      const tx = await get("/billing/transactions"); // expected: { ok:true, transactions: [...] }
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
        // optionally open a modal or reload list
        await loadAll();
      }
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  // A simple Add Payment Method placeholder — most real apps use Stripe/PCI flow
  function handleAddPaymentMethod() {
    // navigate to a dedicated page or show modal. For now navigation placeholder:
    navigate("/billing/add-payment");
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-gray-300">Loading billing…</div>
      </div>
    );
  }

  return (
    <div className="p-6">
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
                    className="px-4 py-2 rounded-md bg-[#0d0f11] border border-gray-700 text-sm text-gray-200 hover:bg-[#101213] transition"
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
            <div>
              <button className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-sm transition inline-flex items-center gap-2">
                <FiCreditCard /> Pay with card
                <FiChevronDown />
              </button>
            </div>

            <div className="text-xs text-gray-400">Last payment: {billing?.lastPaymentDate || "—"}</div>
          </div>
        </div>
      </div>

      {/* AUTO-PAY */}
      <div className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-5 mb-6 flex items-center justify-between">
        <div>
          <div className="font-semibold text-white">Auto-Pay <span className="text-sm text-red-400 ml-3">{autoPayEnabled ? "Enabled" : "Disabled"}</span></div>
          <div className="text-sm text-gray-400 mt-1 max-w-xl">
            Configure automatic billing by adding a card to your account. When your balance nears your Auto-Pay threshold, we will attempt to reload credits by billing your default saved card.
          </div>
        </div>

        <div>
          <label className="inline-flex items-center gap-3">
            <input
              type="checkbox"
              checked={autoPayEnabled}
              onChange={handleToggleAutoPay}
              disabled={busy}
              className="w-10 h-6 rounded-full accent-violet-500"
            />
          </label>
        </div>
      </div>

      {/* PAYMENT METHODS */}
      <div className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">My Payment Methods</h2>
            <p className="text-sm text-gray-400">Payment methods associated with your account.</p>
          </div>

          <div>
            <button onClick={handleAddPaymentMethod} className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-sm inline-flex items-center gap-2">
              <FiPlus /> Add Payment Method
            </button>
          </div>
        </div>

        <div className="mt-6 min-h-[120px] border border-gray-800 rounded p-6 text-center text-gray-400">
          {paymentMethods.length === 0 ? (
            <div>
              <div className="text-2xl mb-3"><FiCreditCard className="inline" /></div>
              <div className="font-medium text-gray-200 mb-1">No Payment Methods</div>
              <div className="text-sm">You haven't added any payment methods yet.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((m) => (
                <div key={m.id} className="flex items-center justify-between bg-[#0b0d0f] p-3 rounded border border-gray-800">
                  <div>
                    <div className="text-sm text-gray-200">{m.brand} **** {m.last4}</div>
                    <div className="text-xs text-gray-400">{m.expiry}</div>
                  </div>
                  <div className="text-sm text-gray-400">{m.primary ? "Default" : ""}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CREDIT CODES + TRANSACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-white">Credit Codes</h3>
              <p className="text-sm text-gray-400">Create and redeem credit codes for your organization.</p>
            </div>

            <div>
              <button onClick={handleGenerateCode} disabled={busy} className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-sm">
                Generate Code
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className="inline-flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={creditCodesVisible} onChange={() => setCreditCodesVisible((s) => !s)} />
              Show redeemed
            </label>

            <div className="mt-4 flex gap-2">
              <input
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value)}
                placeholder="Credit code"
                className="flex-1 bg-[#0b0d0f] border border-gray-700 px-3 py-2 rounded text-sm outline-none"
              />
              <button onClick={handleRedeem} disabled={busy} className="px-3 py-2 bg-[#222225] hover:bg-[#2a2b2d] text-white rounded-md text-sm">Redeem Code</button>
            </div>

            {/* list placeholder */}
            <div className="mt-4 text-sm text-gray-400">
              No codes to show.
            </div>
          </div>
        </div>

        <div className="bg-[#111315] border border-gray-700 rounded-xl px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-white">Recent Transactions</h3>
              <p className="text-sm text-gray-400">Your latest billing activity.</p>
            </div>

            <div className="text-sm">
              <button onClick={loadAll} className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white">
                <FiRefreshCw /> Refresh
              </button>
            </div>
          </div>

          <div className="mt-4">
            {transactions.length === 0 ? (
              <div className="text-sm text-gray-400">No transactions yet.</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400">
                    <th className="pb-2">Time</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Platform</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-t border-gray-800">
                      <td className="py-3 text-gray-200">{new Date(tx.time).toLocaleString()}</td>
                      <td className="py-3 text-gray-200">{tx.type}</td>
                      <td className="py-3 text-gray-200">{tx.platform}</td>
                      <td className="py-3 text-right text-gray-200">${Number(tx.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Billing Explorer placeholder */}
      <div className="mt-6 bg-[#111315] border border-gray-700 rounded-xl px-6 py-6 text-gray-300">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">Billing Explorer</h3>
            <p className="text-sm text-gray-400">Summary / Cloud GPU / Cloud CPU / Serverless / Storage / Savings Plans</p>
          </div>
          <div className="text-sm">
            <select className="bg-[#0b0d0f] border border-gray-700 px-3 py-2 rounded">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-400">
          {/* This is a placeholder — hook it to your billing analytics data */}
          Billing data is 1 hour behind.
        </div>
      </div>
    </div>
  );
}
