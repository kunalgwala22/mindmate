import { Request, Response, NextFunction } from 'express';

interface RateLimitRule {
  windowMs: number;
  max: number;
  message: string;
}

const ipRequestHistory = new Map<string, number[]>();

export const rateLimiter = (options: Partial<RateLimitRule> = {}) => {
  const windowMs = options.windowMs || 60 * 1000; // 1 minute default
  const max = options.max || 30; // 30 requests per minute default
  const message = options.message || 'Too many requests from this IP, please try again later.';

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();

    let timestamps = ipRequestHistory.get(ip) || [];
    
    // Filter out timestamps outside the sliding window
    timestamps = timestamps.filter((timestamp) => now - timestamp < windowMs);
    
    if (timestamps.length >= max) {
      return res.status(429).json({
        message,
        retryAfterMs: Math.max(0, windowMs - (now - timestamps[0]))
      });
    }

    timestamps.push(now);
    ipRequestHistory.set(ip, timestamps);
    
    // Set headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', max - timestamps.length);

    next();
  };
};
