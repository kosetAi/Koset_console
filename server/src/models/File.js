// server/src/models/File.js
import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  originalName: { type: String, required: true },
  s3Key: { type: String, required: true },
  s3Url: { type: String }, // Optional: Full URL if needed
  mimeType: { type: String },
  size: { type: Number },
  category: { type: String, enum: ["training", "dataset"], required: true },
  status: { type: String, default: "uploaded" }, // uploaded, processing, failed
}, { timestamps: true });

export const File = mongoose.model("File", FileSchema);