import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';
import { analyzeMultipleJournalsForTriggers } from '../ai/gemini.service';

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // 1. Get total journals count
    const [journalCountResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM journals WHERE user_id = ?',
      [user.id]
    );
    const journalCount = journalCountResult[0]?.count || 0;

    // 2. Get latest mood
    const [latestMoodResult] = await pool.query<RowDataPacket[]>(
      'SELECT mood, created_at FROM moods WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user.id]
    );
    const currentMood = latestMoodResult[0]?.mood || 'No check-in';

    // 3. Get average stress score and latest emotion from AI analysis
    const [stressScoreResult] = await pool.query<RowDataPacket[]>(
      `SELECT AVG(a.stress_score) as avgStress, COUNT(a.id) as analyzedCount
       FROM ai_analysis a
       JOIN journals j ON a.journal_id = j.id
       WHERE j.user_id = ?`,
      [user.id]
    );
    const avgStress = stressScoreResult[0]?.avgStress !== null 
      ? Math.round(Number(stressScoreResult[0].avgStress)) 
      : null;

    const [latestAnalysisResult] = await pool.query<RowDataPacket[]>(
      `SELECT a.emotion, a.stress_score, a.stress_trigger, a.summary, a.coping_strategy, a.motivation
       FROM ai_analysis a
       JOIN journals j ON a.journal_id = j.id
       WHERE j.user_id = ?
       ORDER BY j.created_at DESC LIMIT 1`,
      [user.id]
    );
    const latestAnalysis = latestAnalysisResult[0] || null;

    // 4. Retrieve recent journals with triggers to run Gemini hidden stress trigger detection
    const [recentJournals] = await pool.query<RowDataPacket[]>(
      `SELECT j.content, a.stress_trigger, 
              COALESCE((SELECT m.mood FROM moods m WHERE m.user_id = j.user_id AND m.created_at <= j.created_at ORDER BY m.created_at DESC LIMIT 1), 'Neutral') as mood
       FROM journals j
       JOIN ai_analysis a ON j.id = a.journal_id
       WHERE j.user_id = ?
       ORDER BY j.created_at DESC LIMIT 15`,
      [user.id]
    );

    // Call Gemini helper to aggregate and find recurring patterns (Feature 5)
    const formattedJournals = recentJournals.map(rj => ({
      content: rj.content,
      mood: rj.mood,
      stress_trigger: rj.stress_trigger
    }));

    const topStressTriggers = await analyzeMultipleJournalsForTriggers(formattedJournals);

    // 5. Determine wellness status message based on average stress score
    let wellnessStatus = 'Optimal';
    let wellnessColor = 'green';
    if (avgStress !== null) {
      if (avgStress >= 80) {
        wellnessStatus = 'Critical Burnout Risk';
        wellnessColor = 'red';
      } else if (avgStress >= 50) {
        wellnessStatus = 'Elevated Stress';
        wellnessColor = 'yellow';
      } else if (avgStress >= 30) {
        wellnessStatus = 'Mild Anxiety';
        wellnessColor = 'blue';
      }
    } else {
      wellnessStatus = 'Awaiting analysis';
      wellnessColor = 'gray';
    }

    return res.json({
      metrics: {
        currentMood,
        journalCount,
        averageStressScore: avgStress,
        latestEmotion: latestAnalysis?.emotion || 'N/A',
        topTrigger: topStressTriggers[0]?.trigger || latestAnalysis?.stress_trigger || 'None detected yet',
        wellnessStatus,
        wellnessColor
      },
      topStressTriggers,
      latestInsight: latestAnalysis ? {
        summary: latestAnalysis.summary,
        copingStrategy: latestAnalysis.coping_strategy,
        motivation: latestAnalysis.motivation,
        stressScore: latestAnalysis.stress_score,
        emotion: latestAnalysis.emotion
      } : null
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
