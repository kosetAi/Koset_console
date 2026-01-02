import 'dotenv/config';

function required(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`❌ FATAL: Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return v;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: required('MONGO_URI'),
  jwtSecret: required('JWT_SECRET'),
  cookieName: process.env.COOKIE_NAME || 'app_session',
  cookieDomain: process.env.COOKIE_DOMAIN || 'localhost',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  cookieSameSite: process.env.COOKIE_SAMESITE || 'Lax',
  frontendOrigin: required('FRONTEND_ORIGIN'),
  apiBaseUrl: required('API_BASE_URL'),

  // ✅ ADDED STRICT AWS CONFIGURATION
  aws: {
    accessKeyId: required('AWS_ACCESS_KEY_ID'),
    secretAccessKey: required('AWS_SECRET_ACCESS_KEY'),
    bucketName: required('AWS_BUCKET_NAME'),
    region: required('AWS_REGION'), // Must match AWS Console exactly
  },

  google: {
    clientId: required('GOOGLE_CLIENT_ID'),
    clientSecret: required('GOOGLE_CLIENT_SECRET'),
    callbackUrl: required('OAUTH_CALLBACK_URL')
  },
  twilio: {
    sid: required('TWILIO_ACCOUNT_SID'),
    token: required('TWILIO_AUTH_TOKEN'),
    from: required('TWILIO_FROM_NUMBER')
  },
  emailUser: required('EMAIL_USER'),
  emailPass: required('EMAIL_PASS'),
  otp: {
    length: Number(process.env.OTP_LENGTH || 6),
    ttlSec: Number(process.env.OTP_TTL_SECONDS || 300),
    resendWindowSec: Number(process.env.OTP_RESEND_WINDOW_SECONDS || 30),
    sendMax15m: Number(process.env.OTP_SEND_MAX_PER_15_MIN || 3),
    verifyMax15m: Number(process.env.OTP_VERIFY_MAX_PER_15_MIN || 5),
  }
};