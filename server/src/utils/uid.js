import { User } from '../models/User.js';

/**
 * Generates an 18-digit numeric string.
 * Ensures the first digit is non-zero to maintain exactly 18 digits.
 */
const generate18DigitUID = () => {
  let uid = '';
  for (let i = 0; i < 18; i++) {
    uid += Math.floor(Math.random() * (i === 0 ? 9 : 10) + (i === 0 ? 1 : 0)).toString();
  }
  return uid;
};

/**
 * Ensures a user has a UID. If already present, it returns the user.
 * If not, it generates a unique 18-digit UID and saves it.
 */
export async function ensureUserUID(user) {
  if (user.uid) {
    console.log(`[UID] Existing UID found for email: ${user.email} → ${user.uid}`);
    return user;
  }

  let isUnique = false;
  let newUid = '';

  // Retry logic to handle rare collisions
  while (!isUnique) {
    newUid = generate18DigitUID();
    const collision = await User.findOne({ uid: newUid });
    if (!collision) isUnique = true;
  }

  user.uid = newUid;
  await user.save();
  
  console.log(`[UID] New UID generated and assigned for email: ${user.email} → ${newUid}`);
  return user;
}