import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { env } from './config/env.js';
import { connectMongo } from './config/mongo.js';
import './auth/passport.js';
import path from "path";
import { fileURLToPath } from "url";

// Route Imports
import authRoutes from './routes/auth.routes.js';
import otpRoutes from './routes/otp.routes.js';
import userRoutes from './routes/user.routes.js';
import gpuRoutes from "./routes/gpu.routes.js";
import uploadRoutes from './routes/upload.routes.js';

// ESM Directory Fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);

// 1. HELMET: Allow resources from same origin (Fixes blank screen issues)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false, // This stops the COOP error
  originAgentCluster: false,      // This stops the Agent-Cluster error
}));

app.use(express.json());
app.use(cookieParser());

// 2. CORS: Allow requests from itself and frontend origin
app.use(cors({
  origin: env.frontendOrigin,
  credentials: true,
}));

app.use(passport.initialize());

// Logging
app.use((req, res, next) => {
  console.log(`📡 [${req.method}] ${req.path}`);
  next();
});

// API Routes
app.use('/auth', authRoutes);
app.use('/otp', otpRoutes);
app.use('/me', userRoutes);
app.use('/gpu', gpuRoutes);
app.use('/upload', uploadRoutes);

// ==========================================
// ✅ NEW: SERVE REACT FRONTEND (Production Mode)
// ==========================================

// Point to the client/dist folder (Going up from server/src -> server -> root -> client -> dist)
const clientBuildPath = path.join(__dirname, "../../client/dist");

// Serve static files (JS, CSS, Images)
app.use(express.static(clientBuildPath));

// Catch-All Handler: Requests that don't match API routes return React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// ==========================================

connectMongo().then(() => {
  app.listen(env.port, () => {
    console.log(`🚀 Server running on http://localhost:${env.port}`);
    console.log(`📂 Serving Frontend from: ${clientBuildPath}`);
  });
});
