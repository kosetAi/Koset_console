// C:\Users\Asus\code\Koset Console\server\src\auth\jwt.js

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
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    path: '/',
    maxAge: maxAgeMs
  };

  // FIX: Only set domain if it is explicitly defined and not localhost
  // If undefined, the browser defaults to the current host (EC2 address), which fixes the mismatch.
  if (env.cookieDomain && env.cookieDomain !== 'localhost') {
    options.domain = env.cookieDomain;
  }

  return options;
}