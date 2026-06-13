import app from './app';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/db';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize DB and Start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 MindMate Server is running on port ${PORT}`);
  });
});
