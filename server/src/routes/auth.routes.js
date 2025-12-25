import { Router } from 'express';
import passport from 'passport';
import { env } from '../config/env.js';
import { signSession, cookieOptions } from '../auth/jwt.js';
import { sendEmailOtp } from '../otp/emailOtp.service.js';

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${env.frontendOrigin}/login?err=google_failed` }),
  async (req, res) => {
    const user = req.user;

    // Create unverified session
    const token = signSession({
      sub: String(user._id),
      email: user.email,
      otpVerifiedAt: null
    }, 60 * 60 * 6);

    res.cookie(env.cookieName, token, cookieOptions(1000 * 60 * 60 * 6));

    // ALWAYS send OTP to email for Google login
    const { nonce } = await sendEmailOtp({ email: user.email, purpose: "signin" });

    return res.redirect(
      `${env.frontendOrigin}/otp?email=${encodeURIComponent(user.email)}&nonce=${nonce}`
    );
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
