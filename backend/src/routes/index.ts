import { Router } from 'express';
import { register, login } from '../auth/auth.controller';
import { createMood, getMoods } from '../moods/moods.controller';
import { createJournal, getJournals } from '../journals/journals.controller';
import { getDashboardStats } from '../dashboard/dashboard.controller';
import { getAnalytics } from '../analytics/analytics.controller';
import { handleAIChat } from '../ai/chat.controller';
import { getWeeklyForecast } from '../ai/forecast.controller';
import { getAdminStats } from '../admin/admin.controller';
import { populateDemoData } from '../demo/demo.controller';
import { authenticateToken } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Strict rate limiters for auth and AI endpoints
const authRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 15,
  message: 'Too many login or registration attempts. Please try again after 1 minute.'
});

const aiRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: 'Too many AI requests. Please slow down and try again after a minute.'
});

// Auth routes (public)
router.post('/auth/register', authRateLimiter, register);
router.post('/auth/login', authRateLimiter, login);

// Moods routes (protected)
router.post('/moods', authenticateToken as any, createMood as any);
router.get('/moods', authenticateToken as any, getMoods as any);

// Journals routes (protected)
router.post('/journals', authenticateToken as any, createJournal as any);
router.get('/journals', authenticateToken as any, getJournals as any);

// AI Chat routes (protected)
router.post('/ai/chat', authenticateToken as any, aiRateLimiter, handleAIChat as any);

// AI Forecast routes (protected)
router.get('/ai/forecast', authenticateToken as any, aiRateLimiter, getWeeklyForecast as any);

// Dashboard routes (protected)
router.get('/dashboard', authenticateToken as any, getDashboardStats as any);

// Analytics routes (protected)
router.get('/analytics', authenticateToken as any, getAnalytics as any);

// Administrative Statistics (protected)
router.get('/admin/stats', authenticateToken as any, getAdminStats as any);

// Demo Data populator (protected)
router.post('/demo/populate', authenticateToken as any, populateDemoData as any);

export default router;
