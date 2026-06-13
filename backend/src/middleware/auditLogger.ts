import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import fs from 'fs';
import path from 'path';

const logFilePath = path.join(__dirname, '../../audit.log');

export const auditLogger = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userId = req.user ? req.user.id : 'anonymous';
    const email = req.user ? req.user.email : 'anonymous';
    const status = res.statusCode;
    const method = req.method;
    const url = req.originalUrl;

    const logEntry = `[${new Date().toISOString()}] IP:${ip} USER:${userId}(${email}) ACTION:${method} ${url} STATUS:${status} DURATION:${duration}ms\n`;

    // Write to console
    console.log(`📝 Audit Log: ${logEntry.trim()}`);

    // Append to audit.log file
    fs.appendFile(logFilePath, logEntry, (err) => {
      if (err) {
        console.error('⚠️ Failed to write to audit.log:', err);
      }
    });
  });

  next();
};
