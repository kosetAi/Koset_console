import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signSession(payload, ttlSec = 60 * 60 * 24 * 7) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: ttlSec });
}

export function verifySession(token) {
  return jwt.verify(token, env.jwtSecret);
}

export function cookieOptions(maxAgeMs) {
  const options = {
    httpOnly: true,
    secure: env.cookieSecure, // Controlled by .env
    sameSite: env.cookieSameSite,
    path: '/',
    maxAge: maxAgeMs
  };

  // ✅ FIX: Only set domain if it is explicitly defined and NOT localhost.
  // This allows the cookie to default to "Host Only" on AWS EC2 IPs.
  if (env.cookieDomain && env.cookieDomain !== 'localhost') {
    options.domain = env.cookieDomain;
  }

  return options;
}