import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { compatRouter } from '../../../backend/src/modules/compat/router.js';

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/compat', compatRouter);

// Export Vercel serverless function
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}




