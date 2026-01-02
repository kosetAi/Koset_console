import { env } from '../config/env.js';
import { verifySession } from '../auth/jwt.js';

export function requireAuth(req, res, next) {
  const token = req.cookies[env.cookieName];

  // Log Auth Status
  if (!token) {
    console.warn(`⚠️ [Auth Fail] No token found in cookies.`);
    return res.status(401).json({ error: { code: 'NO_AUTH', message: 'Not authenticated' } });
  }

  try {
    const payload = verifySession(token);
    req.session = payload;
    return next();
  } catch (err) {
    console.error(`⚠️ [Auth Fail] Invalid Token:`, err.message);
    return res.status(401).json({ error: { code: 'BAD_TOKEN', message: 'Invalid session' } });
  }
}