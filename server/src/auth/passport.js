// C:\Users\Asus\code\Koset Console\server\src\auth\passport.js

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { OAuthAccount } from '../models/OAuthAccount.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.google.clientId,
      clientSecret: env.google.clientSecret,
      callbackURL: env.google.callbackUrl || `${env.apiBaseUrl}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase() || null;

        // ✅ ENFORCE **GMAIL ONLY**, but gracefully (no server crash)
        if (!email) {
          return done(null, false, {
            message: "Google account must have a public email.",
          });
        }
          // Check for Allow List
        if (process.env.ALLOWED_EMAILS) {
          const allowedList = process.env.ALLOWED_EMAILS.split(',').map(e => e.trim().toLowerCase());
          
          if (!allowedList.includes(email)) {
            console.log(`[AUTH BLOCK] Blocked login attempt from: ${email}`);
            // Passing a specific message for failure
            return done(null, false, { message: "Access Restricted" });
          }
        }

        const providerId = profile.id;

        let account = await OAuthAccount.findOne({
          provider: "google",
          providerId,
        });

        let user;

        if (!account) {
          user =
            (email && (await User.findOne({ email }))) ||
            new User({
              email,
              name: profile.displayName,
              avatarUrl: profile.photos?.[0]?.value,
            });

          await user.save();

          account = await OAuthAccount.create({
            userId: user._id,
            provider: "google",
            providerId,
          });

          user.providers.google = { id: providerId };
          await user.save();
        } else {
          user = await User.findById(account.userId);
        }

        return done(null, user);
      } catch (e) {
        return done(e);
      }
    }
  )
);

export default passport;
