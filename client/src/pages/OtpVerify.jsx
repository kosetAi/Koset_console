// C:\Users\Asus\code\Koset Console\client\src\pages\OtpVerify.jsx

import React, { useState } from "react";
import OtpInput from "../components/OtpInput.jsx";
import { post, put } from "../api.js";

export default function OtpVerify() {
  const params = new URLSearchParams(window.location.search);
  const phone = params.get("phone");
  const email = params.get("email");
  const nonce = params.get("nonce");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  async function persistPendingProfileIfAny() {
    try {
      const raw = localStorage.getItem("pendingProfile");
      if (!raw) return;
      const data = JSON.parse(raw);
      // only send name/company/role if present
      const body = {};
      if (data?.name) body.name = data.name;
      if (data?.company) body.company = data.company;
      if (data?.role) body.role = data.role;
      if (Object.keys(body).length > 0) {
        await put("/me/profile", body);
      }
      // clear it after attempt (success or fail silently)
      localStorage.removeItem("pendingProfile");
    } catch {
      // ignore; not fatal for login
    }
  }

  async function verify() {
    setVerifying(true);
    setError("");

    try {
      const endpoint = phone ? "/otp/verify" : "/otp/verify-email";
      const payload = phone ? { phone, code, nonce } : { email, code, nonce };
      const res = await post(endpoint, payload);

      if (res?.ok) {
        // This is the critical addition
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
    <div className="min-h-screen bg-gradient-to-br from-[#0B1020] via-[#1B1540] to-[#0E1324] pt-16 px-4">
      <div className="w-full max-w-md mx-auto py-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-extrabold text-white">Verify OTP</h2>
          <p className="text-white/80 mt-2">
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-cyan-300">
              {phone || email}
            </span>
          </p>

          <div className="my-8">
            <OtpInput value={code} onChange={setCode} />
          </div>

          <button
            disabled={code.length !== 6 || verifying}
            onClick={verify}
            className={`w-full py-3 rounded-xl font-semibold text-white transition shadow-lg ${
              code.length === 6 && !verifying
                ? "bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#22D3EE] hover:opacity-95"
                : "bg-white/30 cursor-not-allowed"
            }`}
          >
            {verifying ? "Verifying..." : "Verify"}
          </button>

          {error && (
            <div className="text-red-200 text-sm mt-4 text-center bg-red-500/20 p-3 rounded-lg border border-red-400/30">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
