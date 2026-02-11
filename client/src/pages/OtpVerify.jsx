import React, { useState, useEffect } from "react";
import OtpInput from "../components/OtpInput.jsx";
import { post, put } from "../api.js";

export default function OtpVerify() {
  const params = new URLSearchParams(window.location.search);
  const phone = params.get("phone");
  const email = params.get("email");
  const nonceFromUrl = params.get("nonce");
  
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [timer, setTimer] = useState(30);
  const [currentNonce, setCurrentNonce] = useState(nonceFromUrl);
  const [resending, setResending] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Functional Resend Logic
  async function resendOtp() {
    setResending(true);
    setError("");
    try {
      const endpoint = "/otp/send-email"; 
      // Ensure context is passed, as some APIs fail without it
      const payload = { 
        email, 
        context: "signup", 
        nonce: currentNonce // Add this if your API requires the previous nonce to resend
      };
      
      const res = await post(endpoint, payload);

      if (res?.ok) {
        // IMPORTANT: Update the nonce because the new email has a new valid nonce
        if (res.nonce) {
          setCurrentNonce(res.nonce);
        }
        setTimer(30); 
        alert("A new code has been sent to your email.");
      } else {
        // Surface the actual error message from the server if available
        setError(res?.error?.message || "Failed to resend code.");
      }
    } catch (e) {
      setError("Check your internet connection.");
    } finally {
      setResending(false);
    }
  }

  async function persistPendingProfileIfAny() {
    try {
      const raw = localStorage.getItem("pendingProfile");
      if (!raw) return;
      const data = JSON.parse(raw);
      const body = {};
      if (data?.name) body.name = data.name;
      if (data?.company) body.company = data.company;
      if (data?.role) body.role = data.role;
      if (Object.keys(body).length > 0) {
        await put("/me/profile", body);
      }
      localStorage.removeItem("pendingProfile");
    } catch {
      // ignore
    }
  }

  async function verify() {
    setVerifying(true);
    setError("");

    try {
      const endpoint = phone ? "/otp/verify" : "/otp/verify-email";
      const payload = phone 
        ? { phone, code, nonce: currentNonce } 
        : { email, code, nonce: currentNonce };
        
      const res = await post(endpoint, payload);

      if (res?.ok) {
        await persistPendingProfileIfAny();
        window.location.href = "/";
      } else {
        setError(res?.error?.message || "Verification failed");
      }
    } catch (e) {
      setError("Verification failed");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white flex items-center justify-center pt-10 px-4 relative overflow-hidden">
      
      {/* ✨ Ambient Background Glow - Subtle depth adjustment */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-black/50 p-8 sm:p-12 text-center">
          
          {/* 🔒 Lock Icon Badge */}
          <div className="mx-auto w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-inner">
            <svg 
              className="w-8 h-8 text-violet-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
              Check your email
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              We've sent a 6-digit verification code to <br />
              <span className="text-cyan-400 font-medium bg-white/5 px-2 py-0.5 rounded border border-white/5">
                {phone || email}
              </span>
            </p>
          </div>

          {/* OTP Input Component */}
          <div className="my-8 flex justify-center">
            <OtpInput value={code} onChange={setCode} />
          </div>

          {/* Verify Button */}
          <button
            disabled={code.length !== 6 || verifying}
            onClick={verify}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-xl ${
              code.length === 6 && !verifying
                ? "bg-violet-600 hover:bg-violet-500 shadow-violet-500/25 text-white ring-1 ring-white/20"
                : "bg-white/5 text-gray-600 cursor-not-allowed border border-white/5"
            }`}
          >
            {verifying ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify Code"
            )}
          </button>

          {/* Resend Link - Now Functional */}
         

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm text-left animate-pulse">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>
        
        {/* Footer Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Wrong email?{" "}
            <a href="/login" className="text-gray-400 hover:text-white transition-colors">
              Log in with a different account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}