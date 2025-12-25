import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { env } from './config/env.js';
import { connectMongo } from './config/mongo.js';
import './auth/passport.js';
 import mongoose from "mongoose"; // add this if not present

import authRoutes from './routes/auth.routes.js';
import otpRoutes from './routes/otp.routes.js';
import userRoutes from './routes/user.routes.js';
import gpuRoutes from "./routes/gpu.routes.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: env.frontendOrigin,
  credentials: true
}));
app.use(passport.initialize());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/otp', otpRoutes);
app.use('/me', userRoutes);
app.use("/gpu", gpuRoutes);

connectMongo().then(() => {
  

  app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`);
  });
});

