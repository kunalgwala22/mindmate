import { Router } from 'express';
import { register, login } from '../auth/auth.controller';
import { createMood, getMoods } from '../moods/moods.controller';
import { createJournal, getJournals } from '../journals/journals.controller';
import { getDashboardStats } from '../dashboard/dashboard.controller';
import { getAnalytics } from '../analytics/analytics.controller';
import { handleAIChat } from '../ai/chat.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Auth routes (public)
router.post('/auth/register', register);
router.post('/auth/login', login);

// Moods routes (protected)
router.post('/moods', authenticateToken as any, createMood as any);
router.get('/moods', authenticateToken as any, getMoods as any);

// Journals routes (protected)
router.post('/journals', authenticateToken as any, createJournal as any);
router.get('/journals', authenticateToken as any, getJournals as any);

// AI Chat routes (protected)
router.post('/ai/chat', authenticateToken as any, handleAIChat as any);

// Dashboard routes (protected)
router.get('/dashboard', authenticateToken as any, getDashboardStats as any);

// Analytics routes (protected)
router.get('/analytics', authenticateToken as any, getAnalytics as any);

export default router;
