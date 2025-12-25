// C:\Users\Asus\code\Koset Console\server\src\otp\sms.provider.js

import twilio from 'twilio';
import { env } from '../config/env.js';

const client = twilio(env.twilio.sid, env.twilio.token);

export async function sendSms(to, body) {
  // In development (Twilio free, your case) we log the OTP
  if (env.nodeEnv !== 'production') {
    console.log('[DEV SMS] To:', to, 'Body:', body);

    try {
      const msg = await client.messages.create({
        to,
        from: env.twilio.from,
        body,
      });
      return msg.sid;
    } catch (err) {
      console.warn('[DEV SMS ERROR from Twilio]', err.message);
      // Don't break the flow in dev; OTP is visible in console anyway
      return 'dev-sid';
    }
  }

  // In production, fail hard if Twilio fails
  const msg = await client.messages.create({
    to,
    from: env.twilio.from,
    body,
  });
  return msg.sid;
}
