// === C:\Users\Asus\code\Koset Console\server\src\auth\passport.js ===

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { OAuthAccount } from '../models/OAuthAccount.js';
import { ensureUserUID } from '../utils/uid.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.google.clientId,
      clientSecret: env.google.clientSecret,
      callbackURL: env.google.callbackUrl || `${env.apiBaseUrl}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("🔹 [Google Auth] Profile received for:", profile.displayName);
        
        const email = profile.emails?.[0]?.value?.toLowerCase() || null;

        // 1. Safety Check: Google must return an email
        if (!email) {
          console.error("❌ [Google Auth] No email found in Google profile.");
          return done(null, false, {
            message: "Google account must have a public email.",
          });
        }

        // 2. Allow List Check
        const allowListVar = process.env.ALLOWED_EMAILS;
        
        if (allowListVar && allowListVar.trim().length > 0) {
          // Clean up the list: split by comma, trim whitespace, lowercase
          const allowedList = allowListVar.split(',').map(e => e.trim().toLowerCase());
          
          if (!allowedList.includes(email)) {
  console.warn(`⛔ [Google Auth] BLOCKED: ${email} is not in ALLOWED_EMAILS. Recording attempt...`);
  
  // Requirement 1: Capture non-whitelisted details
  try {
    const { NotWhitelisted } = await import('../models/NotWhitelisted.js');
    await NotWhitelisted.findOneAndUpdate(
      { email }, 
      { name: profile.displayName, provider: 'google', attemptedAt: new Date() }, 
      { upsert: true }
    );
  } catch (dbErr) {
    console.error("⚠️ Failed to record restricted attempt:", dbErr.message);
  }

  return done(null, false, { message: "Restricted" });
}
        }

        console.log(`✅ [Google Auth] Email authorized: ${email}`);

        const providerId = profile.id;
        
        // Find existing link
        let account = await OAuthAccount.findOne({
          provider: "google",
          providerId,
        });

        let user = null;

        if (account) {
          // Account exists, try to find user
          user = await User.findById(account.userId);
          
          // FIX: Handle "Orphan" accounts (OAuthAccount exists, but User was deleted)
          if (!user) {
            console.warn(`⚠️ [Google Auth] Orphan OAuth account found for ${email}. Cleaning up...`);
            await OAuthAccount.deleteOne({ _id: account._id });
            account = null; // Reset so we create a new one below
          }
        }

        // If no account (or it was just cleaned up), create/link user
        if (!account) {
          // Check if user exists by email to prevent duplicates
          user = await User.findOne({ email });
          
          if (!user) {
  user = new User({
    email,
    name: profile.displayName,
    avatarUrl: profile.photos?.[0]?.value,
    // Requirement 2: Capture Auth Provider and Timestamp
    createdAt: new Date(), 
    providers: { google: { id: providerId } }
  });
  await user.save();
  console.log(`🆕 [Google Auth] Created new user: ${user._id}`);
} else {
  // Update image if it changed on Google
  user.avatarUrl = profile.photos?.[0]?.value;
  await user.save();
  console.log(`🔗 [Google Auth] Linking existing user: ${user._id}`);
}
          await ensureUserUID(user); 
          
          // Create new OAuth link
          account = await OAuthAccount.create({
            userId: user._id,
            provider: "google",
            providerId,
          });

          // Update user provider linkage safely
          if (!user.providers) user.providers = {};
          user.providers.google = { id: providerId };
          await user.save();
        }

        if (!user) {
          // Should never happen, but just in case
          return done(new Error("Failed to resolve user"));
        }

        return done(null, user);
      } catch (e) {
        console.error("💥 [Google Auth] Strategy Error:", e);
        return done(e);
      }
    }
  )
);

export default passport;