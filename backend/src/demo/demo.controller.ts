import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import pool from '../config/db';
import { ResultSetHeader } from 'mysql2';

export const populateDemoData = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Clear existing moods, journals, and analysis records for this user to ensure clean timeline visual
    await connection.query('DELETE FROM moods WHERE user_id = ?', [user.id]);
    await connection.query(
      'DELETE FROM journals WHERE user_id IN (SELECT id FROM (SELECT id FROM journals WHERE user_id = ?) as t)',
      [user.id]
    );

    // 2. Define historical days data (Day -6 to Day 0)
    const demoData = [
      {
        daysAgo: 6,
        mood: '🙂 Good',
        content: 'Finished my study goals today. Had a good revision session for Chemistry. Felt quite confident about thermodynamics.',
        emotion: 'Calm',
        sentiment: 'Positive',
        stressScore: 35,
        stressTrigger: 'General Prep',
        summary: 'The student feels confident and calm after completing Chemistry revision goals.',
        copingStrategy: 'Maintain this positive momentum. Take regular 5-minute visual breaks.',
        motivation: 'Small daily steps add up to massive achievements.'
      },
      {
        daysAgo: 5,
        mood: '😐 Neutral',
        content: 'A bit tired today. Math class was dry and we did a mock test. Got average scores, need to improve integration chapters.',
        emotion: 'Neutral',
        sentiment: 'Neutral',
        stressScore: 50,
        stressTrigger: 'Mock test performance',
        summary: 'The student feels average after math mock test results and identifies integration weakness.',
        copingStrategy: 'Focus on practicing 5 integration problems before doing another mock.',
        motivation: 'Mistakes are proof that you are actively trying.'
      },
      {
        daysAgo: 4,
        mood: '😟 Anxious',
        content: 'Anxious about Physics mechanics test tomorrow. Mechanics is going over my head. Having trouble focusing.',
        emotion: 'Anxiety',
        sentiment: 'Negative',
        stressScore: 68,
        stressTrigger: 'Physics anxiety',
        summary: 'Student is anxious about mechanics concepts and is struggling to concentrate on the test.',
        copingStrategy: 'Solve 3 basic mechanics problems to rebuild focus and confidence.',
        motivation: 'Focus on your effort, which is the only thing under your control.'
      },
      {
        daysAgo: 3,
        mood: '😫 Burned Out',
        content: 'Woke up with a bad headache. Did not sleep well last night thinking about JEE syllabus completion. Too much pressure.',
        emotion: 'Burnout',
        sentiment: 'Negative',
        stressScore: 85,
        stressTrigger: 'Lack of sleep',
        summary: 'Student is struggling with exam pressure and headache from sleep deprivation.',
        copingStrategy: 'Take a screen-free break for 30 minutes, drink water, and sleep early tonight.',
        motivation: 'Rest is not a sign of weakness; it is a critical part of preparation.'
      },
      {
        daysAgo: 2,
        mood: '😢 Sad',
        content: 'Saw friends mock scores. They got 92% and I am stuck in 60s. Feeling down and questioning if I can clear NEET.',
        emotion: 'Self-doubt',
        sentiment: 'Negative',
        stressScore: 78,
        stressTrigger: 'Comparison with peers',
        summary: 'Student is feeling discouraged and doubting their potential after comparing mock test results.',
        copingStrategy: 'Mute score groups temporarily and focus purely on your personal study checklist.',
        motivation: 'Your only true competition is who you were yesterday.'
      },
      {
        daysAgo: 1,
        mood: '😫 Burned Out',
        content: 'Slept only 4 hours. Feel completely exhausted but forcing myself to study. I cannot keep up with this schedule anymore.',
        emotion: 'Exhaustion',
        sentiment: 'Negative',
        stressScore: 92,
        stressTrigger: 'Lack of sleep',
        summary: 'Student is suffering from sleep deprivation and severe exam exhaustion.',
        copingStrategy: 'Take a complete study break today, get at least 8 hours of sleep tonight.',
        motivation: 'Your mental health is the foundation of your exam success.'
      },
      {
        daysAgo: 0,
        mood: '😟 Anxious',
        content: 'Trying to recover from yesterdays burnout. Did a breathing exercise today. Still nervous about the upcoming exam season.',
        emotion: 'Anxiety',
        sentiment: 'Neutral',
        stressScore: 65,
        stressTrigger: 'Exam anxiety',
        summary: 'Student is recovering from severe exhaustion and attempting to pace themselves.',
        copingStrategy: 'Use the 4-7-8 breathing coach cycle when feeling exam jitters.',
        motivation: 'One day at a time, one page at a time. You can handle this.'
      }
    ];

    for (const item of demoData) {
      const dateOffsetExpr = `DATE_SUB(NOW(), INTERVAL ${item.daysAgo} DAY)`;

      // Insert Mood
      await connection.query(
        `INSERT INTO moods (user_id, mood, created_at) 
         VALUES (?, ?, ${dateOffsetExpr})`,
        [user.id, item.mood]
      );

      // Insert Journal
      const [journalResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO journals (user_id, content, created_at) 
         VALUES (?, ?, ${dateOffsetExpr})`,
        [user.id, item.content]
      );

      const journalId = journalResult.insertId;

      // Insert AI Analysis
      await connection.query(
        `INSERT INTO ai_analysis 
         (journal_id, emotion, sentiment, stress_score, stress_trigger, summary, coping_strategy, motivation, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ${dateOffsetExpr})`,
        [
          journalId,
          item.emotion,
          item.sentiment,
          item.stressScore,
          item.stressTrigger,
          item.summary,
          item.copingStrategy,
          item.motivation
        ]
      );
    }

    await connection.commit();
    connection.release();

    return res.status(201).json({ message: 'Demo data loaded successfully for 7 days.' });
  } catch (error: any) {
    await connection.rollback();
    connection.release();
    console.error('Error populating demo data:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
