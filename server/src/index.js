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

import path from "path";
import { fileURLToPath } from "url";

// ESM dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1); // Add this!
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// correct build path
const buildpath = path.join(__dirname, "../client/dist");

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);


app.use(passport.initialize());

app.use((req, res, next) => {
  console.log(`📡 [${req.method}] ${req.path}`);
  next();
});

app.get('/', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/otp', otpRoutes);
app.use('/me', userRoutes);
app.use('/gpu', gpuRoutes);
app.use('/upload', uploadRoutes);

connectMongo().then(() => {
  app.listen(env.port, () => {
    console.log(`🚀 API running on http://localhost:${env.port}`);
  });
});
