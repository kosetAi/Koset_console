import { Router } from "express";
import { GPU } from "../models/GPU.js";

const router = Router();

// Get all GPUs (with optional VRAM filter)
router.get("/", async (req, res) => {
  try {
    const minVram = Number(req.query.minVram) || 0;

    const gpus = await GPU.find({
      vram: { $gte: minVram }
    }).sort({ vram: 1 });

    return res.json({ ok: true, gpus });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Get featured GPUs
router.get("/featured", async (req, res) => {
  try {
    const gpus = await GPU.find({ isFeatured: true });
    return res.json({ ok: true, gpus });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Create dummy GPUs (for Seeding)
router.post("/seed", async (req, res) => {
  try {
    const dummy = [
      {
        name: "RTX 5090",
        price: 0.89,
        vram: 32,
        ram: 92,
        cpu: 14,
        max: 8,
        status: "High",
        isFeatured: true
      },
      {
        name: "A40",
        price: 0.40,
        vram: 48,
        ram: 48,
        cpu: 9,
        max: 10,
        status: "High",
        isFeatured: true
      },
      {
        name: "H200 SXM",
        price: 3.59,
        vram: 141,
        ram: 221,
        cpu: 12,
        max: 8,
        status: "High",
        isFeatured: true
      },
      {
        name: "B200",
        price: 5.69,
        vram: 180,
        ram: 180,
        cpu: 24,
        max: 8,
        status: "Medium",
        isFeatured: true
      }
    ];

    await GPU.deleteMany({});
    await GPU.insertMany(dummy);

    return res.json({ ok: true, message: "Dummy GPUs inserted!" });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
