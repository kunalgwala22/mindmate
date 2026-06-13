import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

export const getAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // 1. Get recent stress score trend (up to last 10 journal entries with their analyses)
    const [stressTrendResult] = await pool.query<RowDataPacket[]>(
      `SELECT DATE_FORMAT(j.created_at, '%b %d') as dateLabel, a.stress_score as stressScore, a.emotion, j.created_at
       FROM journals j
       JOIN ai_analysis a ON j.id = a.journal_id
       WHERE j.user_id = ?
       ORDER BY j.created_at ASC
       LIMIT 10`,
      [user.id]
    );

    // 2. Get mood trend (last 10 check-ins)
    const [moodTrendResult] = await pool.query<RowDataPacket[]>(
      `SELECT DATE_FORMAT(created_at, '%b %d') as dateLabel, mood, created_at
       FROM moods
       WHERE user_id = ?
       ORDER BY created_at ASC
       LIMIT 10`,
      [user.id]
    );

    // Map moods to stress values for dual charts or simplified trends
    // 😀 Happy: 20, 🙂 Good: 40, 😐 Neutral: 50, 😟 Anxious: 70, 😢 Sad: 80, 😫 Burned Out: 95
    const moodToValue = (mood: string): number => {
      const cleanMood = mood.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim().toLowerCase();
      if (cleanMood.includes('happy')) return 90;
      if (cleanMood.includes('good')) return 75;
      if (cleanMood.includes('neutral')) return 50;
      if (cleanMood.includes('anxious')) return 35;
      if (cleanMood.includes('sad')) return 20;
      if (cleanMood.includes('burned out') || cleanMood.includes('burnout')) return 10;
      return 50;
    };

    const moodTrend = moodTrendResult.map(row => ({
      date: row.dateLabel,
      mood: row.mood,
      value: moodToValue(row.mood)
    }));

    // 3. Get emotion distribution (all journals or last 30 entries)
    const [emotionDistResult] = await pool.query<RowDataPacket[]>(
      `SELECT a.emotion, COUNT(a.id) as count
       FROM ai_analysis a
       JOIN journals j ON a.journal_id = j.id
       WHERE j.user_id = ?
       GROUP BY a.emotion
       ORDER BY count DESC`,
      [user.id]
    );

    // Format for PieChart / BarChart
    const emotionDistribution = emotionDistResult.map(row => ({
      name: row.emotion,
      value: Number(row.count)
    }));

    return res.json({
      stressTrend: stressTrendResult.map(row => ({
        date: row.dateLabel,
        stressScore: row.stressScore,
        emotion: row.emotion
      })),
      moodTrend,
      emotionDistribution
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
