import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { env } from './config/env.js';
import { connectMongo } from './config/mongo.js';
import './auth/passport.js';
import mongoose from "mongoose";

import authRoutes from './routes/auth.routes.js';
import otpRoutes from './routes/otp.routes.js';
import userRoutes from './routes/user.routes.js';
import gpuRoutes from "./routes/gpu.routes.js";
import uploadRoutes from './routes/upload.routes.js'; 

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// ✅ 1. SETUP CORS CORRECTLY
app.use(cors({
  origin: env.frontendOrigin, // "http://localhost:5173"
  credentials: true, // Allow cookies
}));

app.use(passport.initialize());

// ✅ 2. ADD GLOBAL LOGGER (Put this BEFORE routes)
app.use((req, res, next) => {
  console.log(`📡 [${req.method}] ${req.path}`);
  next();
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/otp', otpRoutes);
app.use('/me', userRoutes);
app.use("/gpu", gpuRoutes);
app.use('/upload', uploadRoutes); 

connectMongo().then(() => {
  app.listen(env.port, () => {
    console.log(`🚀 API running on http://localhost:${env.port}`);
  });
});