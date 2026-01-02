import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireOtpVerified } from '../middleware/requireOtpVerified.js';
import { setPhoneBody, profileBody } from '../utils/validators.js';
import { User } from '../models/User.js';
import { sendOtp } from '../otp/otp.service.js';
import { File } from "../models/File.js";

const router = Router();

router.get('/', requireAuth, requireOtpVerified, async (req, res) => {
  const user = await User.findById(req.session.sub);
  return res.json({
    user: {
      id: user._id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      avatarUrl: user.avatarUrl,
      company: user.company || null,
      role: user.role || null
    }
  });
});

router.get('/files', requireAuth, async (req, res) => {
  try {
    const files = await File.find({ userId: req.session.sub })
      .sort({ createdAt: -1 }) // Newest first
      .limit(20); // Limit to last 20 for performance
    
    return res.json({ ok: true, files });
  } catch (err) {
    return res.status(500).json({ error: { message: "Could not fetch files" } });
  }
});

router.put('/phone', requireAuth, async (req, res) => {
  const { phone } = setPhoneBody.parse(req.body);
  const user = await User.findById(req.session.sub);
  user.phone = phone;
  user.phoneVerifiedAt = null; // must reverify
  await user.save();
  const { nonce, resendAt } = await sendOtp({ phone, purpose: 'signup' });
  return res.json({ ok: true, nonce, resendAt, message: 'Phone updated. Verify OTP to complete.' });
});

// 🔹 NEW: Save profile details after OTP verification
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
