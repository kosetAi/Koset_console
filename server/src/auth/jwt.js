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
    path: '/',
    maxAge: maxAgeMs,
    // Dynamic logic to handle AWS environments without custom domains
    sameSite: env.nodeEnv === 'production' ? 'Lax' : 'Lax', 
    secure: env.cookieSecure,
  };

  // Only set domain if it's not localhost and not an AWS default endpoint
  if (env.cookieDomain && env.cookieDomain.trim() !== "") {
    options.domain = env.cookieDomain;
  }
  
  return options;
}