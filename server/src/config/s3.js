import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env.js";

// Initialize S3 Client with validated env vars
export const s3Client = new S3Client({
  region: env.aws.region,
  credentials: {
    accessKeyId: env.aws.accessKeyId,
    secretAccessKey: env.aws.secretAccessKey,
  },
});

export const BUCKET_NAME = env.aws.bucketName;

// ✅ Startup Log: Verify this matches your AWS Console info
console.log("------------------------------------------------");
console.log("✅ AWS S3 Client Initialized");
console.log(`📍 Region:      ${env.aws.region}`);
console.log(`🪣  Bucket:      ${BUCKET_NAME}`);
console.log("------------------------------------------------");