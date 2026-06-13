import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';
import { generateWeeklyForecastAndSuggestions } from './insights.service';

export const getWeeklyForecast = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Retrieve past journal contents, mood, and stress scores
    const [journals] = await pool.query<RowDataPacket[]>(
      `SELECT j.content, a.stress_score as stressScore, 
              COALESCE((SELECT m.mood FROM moods m WHERE m.user_id = j.user_id AND m.created_at <= j.created_at ORDER BY m.created_at DESC LIMIT 1), 'Neutral') as mood,
              DATE_FORMAT(j.created_at, '%Y-%m-%d') as date
       FROM journals j
       JOIN ai_analysis a ON j.id = a.journal_id
       WHERE j.user_id = ?
       ORDER BY j.created_at DESC
       LIMIT 10`,
      [user.id]
    );

    // Format logs
    const formattedLogs = journals.map((j) => ({
      content: j.content,
      mood: j.mood,
      stressScore: Number(j.stressScore),
      date: j.date,
    }));

    // Generate forecast and study suggestions
    const forecastResult = await generateWeeklyForecastAndSuggestions(formattedLogs, user.name);

    return res.json(forecastResult);
  } catch (error: any) {
    console.error('Error generating weekly AI forecast:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
