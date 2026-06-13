import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    // 1. Get total users count
    const [userCountResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM users'
    );
    const totalUsers = userCountResult[0]?.count || 0;

    // 2. Get total journals count
    const [journalCountResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM journals'
    );
    const totalJournals = journalCountResult[0]?.count || 0;

    // 3. Get total mood entries
    const [moodCountResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM moods'
    );
    const totalMoods = moodCountResult[0]?.count || 0;

    // 4. Get global average stress score
    const [avgStressResult] = await pool.query<RowDataPacket[]>(
      'SELECT AVG(stress_score) as avgStress FROM ai_analysis'
    );
    const globalAvgStress = avgStressResult[0]?.avgStress !== null 
      ? Math.round(Number(avgStressResult[0].avgStress)) 
      : 0;

    // 5. Get top stress triggers globally
    const [triggersResult] = await pool.query<RowDataPacket[]>(
      `SELECT stress_trigger as trigger, COUNT(*) as count 
       FROM ai_analysis 
       GROUP BY stress_trigger 
       ORDER BY count DESC 
       LIMIT 5`
    );

    // 6. Get emotion distribution globally
    const [emotionsResult] = await pool.query<RowDataPacket[]>(
      `SELECT emotion, COUNT(*) as count 
       FROM ai_analysis 
       GROUP BY emotion 
       ORDER BY count DESC`
    );

    return res.json({
      totalUsers,
      totalJournals,
      totalMoods,
      globalAvgStress,
      topTriggers: triggersResult.map(row => ({
        trigger: row.trigger,
        count: Number(row.count)
      })),
      emotionDistribution: emotionsResult.map(row => ({
        emotion: row.emotion,
        count: Number(row.count)
      }))
    });
  } catch (error: any) {
    console.error('Error fetching admin statistics:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
