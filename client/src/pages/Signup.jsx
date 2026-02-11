import React, { useState } from "react";
import { post, endpoints } from "../api.js";
import { Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  function stashProfileForAfterOtp() {
    const payload = { name, company, role, _ts: Date.now() };
    localStorage.setItem("pendingProfile", JSON.stringify(payload));
  }

  async function sendSignupOtp() {
    setSending(true);
    setError("");

    if (!name.trim()) {
      setSending(false);
      setError("Please enter your name.");
      return;
    }

    if (!email || !email.includes("@")) {
      setSending(false);
      setError("Please enter a valid email.");
      return;
    }

    const endpoint = "/otp/send-email";
    const payload = { email, context: "signup" };

    const res = await post(endpoint, payload);
    setSending(false);

    if (res?.ok) {
      stashProfileForAfterOtp();
      const params = `email=${encodeURIComponent(email)}`;
      const url = `/otp?${params}&nonce=${res.nonce}`;
      window.location.href = url;
    } else {
      const msg =
        res?.error?.message ||
        (typeof res?.error === "string" ? res.error : "Failed to send OTP");
      setError(msg);
    }
  }

  function googleLogin() {
    stashProfileForAfterOtp();
    window.location.href = endpoints.googleStart();
  }

  return (
    // ✅ CONSISTENCY FIX: Changed background to match Landing Page #0B0E11
    <div className="min-h-screen bg-[#0B0E11] text-white pt-24 px-4 flex flex-col items-center ">
      <div className="w-full max-w-xl">
        {/* ✅ LAYOUT FIX: Consistent spacing and card styling */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Create your account
            </h2>
            <p className="text-gray-400 mt-3">
              Join the premium GPU cloud platform.
            </p>
          </div>

          {/* Google Login Section */}
          <button
            onClick={googleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 rounded-xl px-4 py-3 font-semibold hover:bg-gray-100 transition duration-200"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="px-4 text-xs text-gray-500 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Profile Form Fields */}
          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                Full Name <span className="text-violet-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                  Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            disabled={sending}
            onClick={sendSignupOtp}
            className={`mt-8 w-full py-3.5 rounded-xl text-white font-bold transition shadow-xl
            ${
              sending
                ? "bg-violet-600/50 cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-500 shadow-violet-500/10"
            }`}
          >
            {sending ? "Processing..." : "Verify via OTP"}
          </button>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Footer Link */}
        <p className="text-center mt-4 mb-8 text-gray-500 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-violet-400 hover:text-violet-300 transition "
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}