import { Router } from 'express';
import passport from 'passport';
import { env } from '../config/env.js';
import { signSession, cookieOptions } from '../auth/jwt.js';
import { sendEmailOtp } from '../otp/emailOtp.service.js';

const router = Router();

// --- GOOGLE AUTH ROUTES ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
      if (err) {
        console.error("❌ [Auth Route] Google Error:", err);
        return res.redirect(`${env.frontendOrigin}/login?err=server_error`);
      }
      
      if (!user) {
        const reason = info?.message || "Unknown reason";
        console.warn(`⚠️ [Auth Route] Login rejected. Reason: ${reason}`);
        
        if (reason === "Restricted") {
          return res.redirect(`${env.frontendOrigin}/login?err=access_restricted`);
        }
        return res.redirect(`${env.frontendOrigin}/login?err=google_failed`);
      }
      
      req.user = user;
      next();
    })(req, res, next);
  },
  async (req, res) => {
    const user = req.user;

    const token = signSession({
      sub: String(user._id),
      email: user.email,
      otpVerifiedAt: null
    }, 60 * 60 * 6);

    const options = cookieOptions(1000 * 60 * 60 * 6);
    res.cookie(env.cookieName, token, options);

    try {
      console.log(`📧 [Auth Route] Sending OTP to ${user.email}...`);
      const { nonce } = await sendEmailOtp({ email: user.email, purpose: "signin" });
      return res.redirect(
        `${env.frontendOrigin}/otp?email=${encodeURIComponent(user.email)}&nonce=${nonce}`
      );
    } catch (e) {
      console.error("❌ [Auth Route] Failed to send OTP:", e);
      return res.redirect(`${env.frontendOrigin}/login?err=otp_send_failed`);
    }
  }
);

// ✅ FIX: Aggressive Logout Logic
router.post('/logout', (req, res) => {
  console.log("👋 [Logout] Attempting aggressive cookie clear...");

  // 1. Clear with Environment settings
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    path: '/',
    domain: env.cookieDomain || undefined
  });

  // 2. Clear Host-Only (Default fallback)
  res.clearCookie(env.cookieName, { path: '/' });

  // 3. Clear with specific request hostname
  res.clearCookie(env.cookieName, { path: '/', domain: req.hostname });

  return res.json({ ok: true });
});

export default router;