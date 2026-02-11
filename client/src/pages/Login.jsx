import React, { useState } from "react";
import { post, endpoints } from "../api.js";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const params = new URLSearchParams(window.location.search);
  const errorParam = params.get("err");

  // Determine error message based on URL param
  let errorMessage = "";
  if (errorParam === "access_restricted") {
    errorMessage = "We're currently hand-crafting the Koset for a selected group. We've noted your interest and will reach out as soon as a spot opens up for you! ✨";
  } else if (errorParam === "google_failed") {
    errorMessage = "Google login failed. Please try again.";
  } else if (errorParam) {
    errorMessage = "An error occurred during login. Please try again.";
  }

  async function sendOtp() {
    setSending(true);
    setError("");

    if (!email || !email.includes("@")) {
      setSending(false);
      setError("Please enter a valid email.");
      return;
    }

    const endpoint = "/otp/send-email";
    const payload = { email, context: "signin" };

    const res = await post(endpoint, payload);
    setSending(false);

    if (res?.ok) {
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
    window.location.href = endpoints.googleStart();
  }

  return (
    // ✅ CONSISTENCY FIX: Background set to #0B0E11 to match Landing Page
    <div className="min-h-screen bg-[#0B0E11] text-white pt-24 px-4 flex flex-col items-center">
      <div className="w-full max-w-xl">
        {/* ✅ LAYOUT FIX: Consistent card styling with Signup page */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Welcome back
            </h2>
            <p className="text-gray-400 mt-3">
              Login to continue to the Koset Console.
            </p>
          </div>

          {/* Conditional Error Display */}
          {errorMessage && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm text-center">
               {errorMessage}
            </div>
          )}

          {/* Google Login Section */}
          <button
            onClick={googleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 rounded-xl px-4 py-3 font-semibold hover:bg-gray-100 transition duration-200 shadow-sm"
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

          {/* Manual Email Flow */}
          <div className="space-y-6">
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

            <button
              disabled={sending}
              onClick={sendOtp}
              className={`w-full py-3.5 rounded-xl text-white font-bold transition shadow-xl
              ${
                sending
                  ? "bg-violet-600/50 cursor-not-allowed"
                  : "bg-violet-600 hover:bg-violet-500 shadow-violet-500/10"
              }`}
            >
              {sending ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>

          {/* Error Display for Manual Flow */}
          {error && (
            <div className="mt-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Footer Link */}
        <p className="text-center mt-8 text-gray-500 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-violet-400 hover:text-violet-300 transition"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}