import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    uid: { type: String, unique: true, sparse: true, index: true }, // Added UID field
  email: { type: String, index: true, sparse: true, lowercase: true, trim: true },
  phone: { type: String, index: true, unique: true, sparse: true }, // E.164
  name: { type: String },
  avatarUrl: { type: String },
  company: { type: String },
  role: { type: String },
  phoneVerifiedAt: { type: Date },
  lastLoginAt: { type: Date },
  providers: {
    google: {
      id: { type: String, index: true, sparse: true }
    }
  },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() }
});

UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const User = mongoose.model('User', UserSchema);
