import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import syncRouter from './routes/sync.js';
import casasRouter from './routes/casas.js';

import { db } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routers
app.use('/api/auth', authRouter);
app.use('/api/sync', syncRouter);
app.use('/api/casas-maternas', casasRouter);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Blooma Backend API is running' });
});

// Initialize DB and start server
db.init().then(() => {
  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
}).catch(err => {
  console.error('Failed to initialize database:', err);
  if (!process.env.VERCEL) {
    process.exit(1);
  }
});

export default app;
