import { Router } from "express";
import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "../config/s3.js";
import { File } from "../models/File.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

// In-memory storage for Multer (Buffer access)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB Limit
});

async function uploadToS3(file, userId, category) {
  const timestamp = Date.now();
  // Sanitize filename
  const sanitizedName = file.originalname.replace(/\s+/g, "_");
  const key = `users/${userId}/${category}/${timestamp}-${sanitizedName}`;

  console.log(`[S3 Upload Start] ${file.originalname} -> Key: ${key}`);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    // 1. Send to AWS
    await s3Client.send(command);
    console.log(`[S3 Upload Success] ${key}`);

    // 2. Save to Database
    const newFile = await File.create({
      userId,
      originalName: file.originalname,
      s3Key: key,
      size: file.size,
      mimeType: file.mimetype,
      category
    });
    
    console.log(`[DB Save Success] File ID: ${newFile._id}`);
    return newFile;

  } catch (error) {
    console.error(`[Upload Error] Failed for ${file.originalname}`);
    console.error(`Error Details:`, error);
    throw error; // Re-throw to route handler
  }
}

router.post(
  "/",
  requireAuth,
  upload.fields([
    { name: "training_files", maxCount: 5 },
    { name: "dataset_files", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: { message: "No files provided" } });
      }

      const userId = req.session.sub;
      const trainingFiles = req.files["training_files"] || [];
      const datasetFiles = req.files["dataset_files"] || [];

      console.log(`[Upload Request] User: ${userId} | Training: ${trainingFiles.length} | Dataset: ${datasetFiles.length}`);

      const savedTraining = [];
      const savedDataset = [];

      // Upload in parallel
      await Promise.all([
        ...trainingFiles.map(f => uploadToS3(f, userId, "training").then(dbFile => savedTraining.push(dbFile))),
        ...datasetFiles.map(f => uploadToS3(f, userId, "dataset").then(dbFile => savedDataset.push(dbFile)))
      ]);

      return res.json({
        ok: true,
        training: {
          saved_files: savedTraining.map(f => f.originalName),
          meta: savedTraining
        },
        dataset: {
          saved_files: savedDataset.map(f => f.originalName),
          meta: savedDataset
        },
        // Helpers for Home.jsx logic
        training_primary_file: savedTraining[0]?.s3Key || null, 
        dataset_primary_file: savedDataset[0]?.s3Key || null,
      });

    } catch (error) {
      console.error("[Route Fatal Error]", error);
      return res.status(500).json({ error: { message: "Upload failed", details: error.message } });
    }
  }
);

export default router;