// === C:\Users\Asus\code\Koset Console\server\src\routes\auth.routes.js ===

import { Router } from 'express';
import passport from 'passport';
import { env } from '../config/env.js';
import { signSession, cookieOptions } from '../auth/jwt.js';
import { sendEmailOtp } from '../otp/emailOtp.service.js';

const router = Router();

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
      
      // Success
      req.user = user;
      next();
    })(req, res, next);
  },
  async (req, res) => {
    const user = req.user;

    // Create a temporary session cookie
    const token = signSession({
      sub: String(user._id),
      email: user.email,
      otpVerifiedAt: null
    }, 60 * 60 * 6); // 6 hours

    res.cookie(env.cookieName, token, cookieOptions(1000 * 60 * 60 * 6));

    try {
      console.log(`📧 [Auth Route] Sending OTP to ${user.email}...`);
      const { nonce } = await sendEmailOtp({ email: user.email, purpose: "signin" });
      
      // Redirect to OTP page
      return res.redirect(
        `${env.frontendOrigin}/otp?email=${encodeURIComponent(user.email)}&nonce=${nonce}`
      );
    } catch (e) {
      console.error("❌ [Auth Route] Failed to send OTP:", e);
      return res.redirect(`${env.frontendOrigin}/login?err=otp_send_failed`);
    }
  }
);

router.post('/logout', (req, res) => {
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    domain: env.cookieDomain,
    path: '/',
  });
  return res.json({ ok: true });
});

export default router;