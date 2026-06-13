import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { analyzeJournalEntry } from '../ai/gemini.service';

export const createJournal = async (req: AuthenticatedRequest, res: Response) => {
  const { content } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ message: 'Journal content is required' });
  }

  try {
    // 1. Get user's latest mood (within last 24 hours if possible, or just latest)
    const [latestMoods] = await pool.query<RowDataPacket[]>(
      'SELECT mood FROM moods WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user.id]
    );

    const moodText = latestMoods.length > 0 ? latestMoods[0].mood : 'Neutral';

    // 2. Insert journal entry
    const [journalResult] = await pool.query<ResultSetHeader>(
      'INSERT INTO journals (user_id, content) VALUES (?, ?)',
      [user.id, content]
    );

    const journalId = journalResult.insertId;

    // 3. Analyze journal content using Gemini (sending latest mood for context)
    const analysis = await analyzeJournalEntry(content, moodText);

    // 4. Save analysis details in ai_analysis table
    await pool.query<ResultSetHeader>(
      `INSERT INTO ai_analysis 
       (journal_id, emotion, sentiment, stress_score, stress_trigger, summary, coping_strategy, motivation) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        journalId,
        analysis.emotion,
        analysis.sentiment,
        analysis.stressScore,
        analysis.stressTrigger,
        analysis.summary,
        analysis.copingStrategy,
        analysis.motivation,
      ]
    );

    return res.status(201).json({
      journal: {
        id: journalId,
        content,
        created_at: new Date(),
      },
      analysis: {
        emotion: analysis.emotion,
        sentiment: analysis.sentiment,
        stressScore: analysis.stressScore,
        stressTrigger: analysis.stressTrigger,
        summary: analysis.summary,
        copingStrategy: analysis.copingStrategy,
        motivation: analysis.motivation,
      },
    });
  } catch (error: any) {
    console.error('Error creating journal entry:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getJournals = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const [journals] = await pool.query<RowDataPacket[]>(
      `SELECT j.id, j.content, j.created_at, 
              a.emotion, a.sentiment, a.stress_score, a.stress_trigger, 
              a.summary, a.coping_strategy, a.motivation
       FROM journals j
       LEFT JOIN ai_analysis a ON j.id = a.journal_id
       WHERE j.user_id = ?
       ORDER BY j.created_at DESC`,
      [user.id]
    );

    return res.json(journals);
  } catch (error: any) {
    console.error('Error fetching journals:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
