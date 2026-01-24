// === C:\Users\Asus\code\Koset Console\server\src\routes\user.routes.js ===

import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireOtpVerified } from '../middleware/requireOtpVerified.js';
import { setPhoneBody, profileBody } from '../utils/validators.js';
import { User } from '../models/User.js';
import { sendOtp } from '../otp/otp.service.js';
import { File } from "../models/File.js";

const router = Router();

// GET /me - Used by frontend to check "Am I logged in?"
router.get('/', requireAuth, async (req, res) => {
  // âœ… FIX: If the user has a session but hasn't verified OTP yet, 
  // return user: null so the frontend treats them as a guest/pending.
  if (!req.session.otpVerifiedAt) {
    return res.json({ 
      user: null, 
      isPendingOtp: true 
    });
  }

  const user = await User.findById(req.session.sub);
  
  // Handle edge case where user is deleted
  if (!user) {
    return res.json({ user: null });
  }

  return res.json({
    user: {
      id: user._id,
      uid: user.uid,
      email: user.email,
      phone: user.phone,
      name: user.name,
      avatarUrl: user.avatarUrl,
      company: user.company || null,
      role: user.role || null
    }
  });
});

// GET /me/files - List user files
// âœ… FIX: Added requireOtpVerified to protect data
router.get('/files', requireAuth, requireOtpVerified, async (req, res) => {
  try {
    const files = await File.find({ userId: req.session.sub })
      .sort({ createdAt: -1 }) 
      .limit(20); 
    
    return res.json({ ok: true, files });
  } catch (err) {
    return res.status(500).json({ error: { message: "Could not fetch files" } });
  }
});

// PUT /me/phone - Update phone number
// We do NOT add requireOtpVerified here, so a user can fix a wrong number 
// if they are stuck on the OTP screen.
router.put('/phone', requireAuth, async (req, res) => {
  const { phone } = setPhoneBody.parse(req.body);
  const user = await User.findById(req.session.sub);
  
  user.phone = phone;
  user.phoneVerifiedAt = null; // Reset verification
  await user.save();
  
  const { nonce, resendAt } = await sendOtp({ phone, purpose: 'signup' });
  return res.json({ ok: true, nonce, resendAt, message: 'Phone updated. Verify OTP to complete.' });
});

// PUT /me/profile - Update profile details
router.put('/profile', requireAuth, requireOtpVerified, async (req, res) => {
  const { name, company, role } = profileBody.parse(req.body);
  const user = await User.findById(req.session.sub);
  
  if (typeof name !== 'undefined') user.name = name;
  if (typeof company !== 'undefined') user.company = company;
  if (typeof role !== 'undefined') user.role = role;
  
  await user.save();
  return res.json({ ok: true });
});

export default router;