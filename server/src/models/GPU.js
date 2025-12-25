import mongoose from "mongoose";

const GPUSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },        // $/hr
  vram: { type: Number, required: true },         // GB VRAM
  ram: { type: Number, required: true },          // GB RAM
  cpu: { type: Number, required: true },          // vCPU count
  max: { type: Number, required: true },          // max instances
  status: { type: String, default: "Medium" },    // High, Medium, Low
  isFeatured: { type: Boolean, default: false }   // Featured GPUs like Vast.ai
}, { timestamps: true });

export const GPU = mongoose.model("GPU", GPUSchema);
