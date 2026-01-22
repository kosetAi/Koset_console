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
app.set('trust proxy', 1);

// Adjust Helmet to allow images/scripts from your sources
app.use(helmet({
  contentSecurityPolicy: false, 
  crossOriginResourcePolicy: false 
}));

app.use(express.json());
app.use(cookieParser());

// Allow requests from itself
app.use(cors({
  origin: env.frontendOrigin, 
  credentials: true,
}));

app.use(passport.initialize());

// API Routes
app.use('/auth', authRoutes);
app.use('/otp', otpRoutes);
app.use('/me', userRoutes);
app.use('/gpu', gpuRoutes);
app.use('/upload', uploadRoutes);

// --- SERVE FRONTEND (THE FIX) ---
// 1. Resolve path to client/dist (Go up 2 levels from src: src -> server -> client)
const buildPath = path.join(__dirname, "../../client/dist");

// 2. Serve static files
app.use(express.static(buildPath));

// 3. Catch-all handler: Send index.html for any request not matching an API route
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});
// --------------------------------

connectMongo().then(() => {
  app.listen(env.port, () => {
    console.log(`🚀 API running on http://localhost:${env.port}`);
    console.log(`fqdn: Serving frontend from ${buildPath}`);
  });
});