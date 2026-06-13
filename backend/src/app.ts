import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';

import { initializeDatabase } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // For development, allow all origins. Can be restricted in production.
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Register routes
app.use('/', router);

// Initialize DB and Start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 MindMate Server is running on port ${PORT}`);
  });
});

export default app;
