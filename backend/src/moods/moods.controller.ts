import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const createMood = async (req: AuthenticatedRequest, res: Response) => {
  const { mood } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!mood) {
    return res.status(400).json({ message: 'Mood is required' });
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO moods (user_id, mood) VALUES (?, ?)',
      [user.id, mood]
    );

    return res.status(201).json({
      id: result.insertId,
      user_id: user.id,
      mood,
      created_at: new Date(),
    });
  } catch (error: any) {
    console.error('Error creating mood check-in:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getMoods = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const [moods] = await pool.query<RowDataPacket[]>(
      'SELECT id, mood, created_at FROM moods WHERE user_id = ? ORDER BY created_at DESC',
      [user.id]
    );

    return res.json(moods);
  } catch (error: any) {
    console.error('Error fetching moods:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
