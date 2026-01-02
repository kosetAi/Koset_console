// === C:\Users\Asus\code\Koset Console\server\src\routes\otp.routes.js ===

import { Router } from 'express';
import { strictLimiter } from '../middleware/rateLimit.js';
import { sendOtp, verifyOtp } from '../otp/otp.service.js';
import { sendEmailOtp, verifyEmailOtp } from '../otp/emailOtp.service.js';
import { sendOtpBody, verifyOtpBody, sendEmailOtpBody, verifyEmailOtpBody } from '../utils/validators.js';
import { toErrorResponse } from '../utils/errors.js';
import { env } from '../config/env.js';
import { signSession, cookieOptions, verifySession } from '../auth/jwt.js';
import { User } from '../models/User.js';

const router = Router();

// PHONE OTP - SEND
router.post('/send', strictLimiter, async (req, res) => {
  try {
    const { phone, context } = sendOtpBody.parse(req.body);
    
    // Logic to prevent signup if user exists, and vice-versa
    const userExists = await User.findOne({ phone });
    if (context === 'signup' && userExists) throw { code: 'USER_EXISTS', message: 'An account with this phone number already exists.' };
    if (context === 'signin' && !userExists) throw { code: 'USER_NOT_FOUND', message: 'No account found with this phone number.' };
    
    const { nonce, resendAt, expiresAt } = await sendOtp({ phone, purpose: context });
    return res.json({ ok: true, nonce, resendAt, expiresAt });
  } catch (err) {
    return res.status(400).json(toErrorResponse(err));
  }
});

// PHONE OTP - VERIFY
router.post('/verify', strictLimiter, async (req, res) => {
  try {
    const { phone, code, nonce } = verifyOtpBody.parse(req.body);
    await verifyOtp({ phone, code, nonce });

    const token = req.cookies[env.cookieName];
    let payload = null;
    if (token) {
      try { payload = verifySession(token); } catch {}
    }

    let user;
    if (payload?.sub) {
      user = await User.findById(payload.sub);
      if (user && !user.phone) {
        user.phone = phone;
        user.phoneVerifiedAt = new Date();
        await user.save();
      }
    } else {
      user = await User.findOne({ phone });
      if (!user) {
        user = await User.create({ phone, phoneVerifiedAt: new Date() });
      }
    }
    
    user.lastLoginAt = new Date();
    await user.save();

    const sessionToken = signSession({
      sub: String(user._id),
      email: user.email || null,
      otpVerifiedAt: new Date().toISOString()
    }, 60 * 60 * 24 * 7); 

    res.cookie(env.cookieName, sessionToken, cookieOptions(1000 * 60 * 60 * 24 * 7));
    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json(toErrorResponse(err));
  }
});

// EMAIL OTP - SEND
router.post('/send-email', strictLimiter, async (req, res) => {
  try {
    const { email, context } = sendEmailOtpBody.parse(req.body);

    // ⛔ Strict Allow List Check
    const allowListVar = process.env.ALLOWED_EMAILS;
    if (allowListVar && allowListVar.trim().length > 0) {
      const allowedList = allowListVar.split(',').map(e => e.trim().toLowerCase());
      if (!allowedList.includes(email.toLowerCase())) {
         throw { code: 'ACCESS_DENIED', message: 'Access Restricted: This email is not on the allowed list.' };
      }
    }

    const userExists = await User.findOne({ email });
    if (context === 'signup' && userExists) throw { code: 'USER_EXISTS', message: 'An account with this email already exists.' };
    if (context === 'signin' && !userExists) throw { code: 'USER_NOT_FOUND', message: 'No account found with this email.' };

    const { nonce, expiresAt } = await sendEmailOtp({ email, purpose: context });
    return res.json({ ok: true, nonce, expiresAt });
  } catch(err) {
    return res.status(400).json(toErrorResponse(err));
  }
});

// EMAIL OTP - VERIFY
router.post('/verify-email', strictLimiter, async (req, res) => {
  try {
    const { email, code, nonce } = verifyEmailOtpBody.parse(req.body);
    await verifyEmailOtp({ email, code, nonce });
    
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({ email });
    }
    
    user.lastLoginAt = new Date();
    await user.save();

    const sessionToken = signSession({
      sub: String(user._id),
      email,
      otpVerifiedAt: new Date().toISOString()
    }, 60 * 60 * 24 * 7);

    res.cookie(env.cookieName, sessionToken, cookieOptions(1000 * 60 * 60 * 24 * 7));
    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json(toErrorResponse(err));
  }
});

export default router;