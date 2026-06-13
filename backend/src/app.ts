import express from 'express';
import cors from 'cors';
import router from './routes';

const app = express();

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

export default app;
