import mongoose from 'mongoose';

const NotWhitelistedSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  name: { type: String },
  provider: { type: String, default: 'google' },
  attemptedAt: { type: Date, default: Date.now }
});

export const NotWhitelisted = mongoose.model('not_whitelisted', NotWhitelistedSchema);