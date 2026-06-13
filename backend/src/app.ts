import express from 'express';
import cors from 'cors';
import router from './routes';
import { securityHeaders, sanitizeInput } from './middleware/security';
import { rateLimiter } from './middleware/rateLimiter';
import { auditLogger } from './middleware/auditLogger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Set trust proxy (important for getting correct client IPs when behind a proxy/load balancer)
app.set('trust proxy', 1);

// Global Security headers
app.use(securityHeaders);

// CORS Config
app.use(cors({
  origin: '*', // Allow all origins for dev/mock environment
  credentials: true
}));

// Body Parsers & Sanitization
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput);

// Global Audit Logger
app.use(auditLogger as any);

// Global Rate Limiter: max 100 requests per minute
app.use(rateLimiter({ max: 100 }));

// Test route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Register routes
app.use('/', router);

// Global Error Handler (must be registered last)
app.use(errorHandler);

export default app;
