// C:\Users\Asus\code\Koset Console\client\src\pages\Signup.jsx

import React, { useState } from "react";
import { post, endpoints } from "../api.js";
import { Link } from "react-router-dom";

export default function Signup() {
  // Removed 'method' and 'phone'
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
    <div className="min-h-screen bg-gradient-to-br from-[#0B1020] via-[#1B1540] to-[#0E1324] pt-16 px-4">
      <div className="w-full max-w-2xl mx-auto py-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl shadow-xl p-8">
          <h2 className="text-4xl font-extrabold text-white text-center">
            Create your Koset account
          </h2>
          <p className="text-center text-violet-200 mt-2">
            Premium GPU cloud, zero-DevOps experience.
          </p>

          <button
            onClick={googleLogin}
            className="mt-8 w-full flex items-center justify-center gap-3 bg-white text-gray-900 rounded-xl px-4 py-3 hover:bg-gray-100 transition duration-200 shadow"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6"
            />
            <span className="font-semibold">Continue with Google</span>
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="px-4 text-sm text-white/70 uppercase">or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-white/80 mb-1 block">
                Full Name <span className="text-pink-300">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full px-4 py-2.5 rounded-xl bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white/80 mb-1 block">
                Company (optional)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Koset Labs"
                className="w-full px-4 py-2.5 rounded-xl bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-white/80 mb-1 block">
                Role (optional)
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="ML Engineer / Founder / SRE"
                className="w-full px-4 py-2.5 rounded-xl bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* EMAIL INPUT - Always Visible */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <label className="text-sm font-medium text-white/80 mb-1 block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <button
            disabled={sending}
            onClick={sendSignupOtp}
            className={`mt-6 w-full py-3 rounded-xl text-white font-semibold transition shadow-lg
            ${
              sending
                ? "bg-white/30 cursor-not-allowed"
                : "bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#22D3EE] hover:opacity-95"
            }`}
          >
            {sending ? "Sending..." : "Send OTP"}
          </button>

          {error && (
            <div className="text-red-200 text-sm mt-4 text-center bg-red-500/20 p-3 rounded-lg border border-red-400/30">
              {error}
            </div>
          )}
        </div>

        <p className="text-center mt-6 text-white/80">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-cyan-300 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}