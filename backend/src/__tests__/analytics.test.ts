import request from 'supertest';
import app from '../app';
import pool from '../config/db';
import jwt from 'jsonwebtoken';

jest.mock('../config/db', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
    getConnection: jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue([]),
      release: jest.fn(),
    }),
  },
  initializeDatabase: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../ai/gemini.service', () => ({
  __esModule: true,
  analyzeJournalEntry: jest.fn(),
  analyzeMultipleJournalsForTriggers: jest.fn().mockResolvedValue([
    { trigger: 'Physics mechanics', percentage: 70 }
  ])
}));

const JWT_SECRET = 'mindmate_super_secret_key_123';
const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
const mockToken = jwt.sign(mockUser, JWT_SECRET);

describe('Analytics & Dashboard API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /dashboard', () => {
    it('should aggregate and return dashboard metrics successfully', async () => {
      // 1. Mock total journals count
      (pool.query as jest.Mock).mockResolvedValueOnce([[{ count: 5 }]]);
      // 2. Mock latest mood check-in
      (pool.query as jest.Mock).mockResolvedValueOnce([[{ mood: '😟 Anxious' }]]);
      // 3. Mock average stress score
      (pool.query as jest.Mock).mockResolvedValueOnce([[{ avgStress: 65, analyzedCount: 5 }]]);
      // 4. Mock latest AI analysis details
      (pool.query as jest.Mock).mockResolvedValueOnce([[{
        emotion: 'Anxiety',
        stress_score: 75,
        stress_trigger: 'JEE Math',
        summary: 'Mock summary',
        coping_strategy: 'Mock coping',
        motivation: 'Mock motivation'
      }]]);
      // 5. Mock retrieve recent journals for trigger calculation
      (pool.query as jest.Mock).mockResolvedValueOnce([[{
        content: 'Physics pressure today.',
        stress_trigger: 'Physics mechanics'
      }]]);

      const response = await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('metrics');
      expect(response.body).toHaveProperty('topStressTriggers');
      expect(response.body.metrics.currentMood).toBe('😟 Anxious');
      expect(response.body.metrics.averageStressScore).toBe(65);
      expect(response.body.topStressTriggers[0].trigger).toBe('Physics mechanics');
    });
  });

  describe('GET /analytics', () => {
    it('should calculate and return stress and mood trends successfully', async () => {
      // 1. Mock stress score trend
      (pool.query as jest.Mock).mockResolvedValueOnce([[{
        dateLabel: 'Jun 13',
        stressScore: 70,
        emotion: 'Anxiety'
      }]]);
      // 2. Mock mood check-in trend
      (pool.query as jest.Mock).mockResolvedValueOnce([[{
        dateLabel: 'Jun 13',
        mood: '🙂 Good'
      }]]);
      // 3. Mock emotion distribution count
      (pool.query as jest.Mock).mockResolvedValueOnce([[{
        emotion: 'Calm',
        count: 3
      }]]);

      const response = await request(app)
        .get('/analytics')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('stressTrend');
      expect(response.body).toHaveProperty('moodTrend');
      expect(response.body).toHaveProperty('emotionDistribution');
      expect(response.body.stressTrend[0].stressScore).toBe(70);
      expect(response.body.moodTrend[0].mood).toBe('🙂 Good');
      expect(response.body.emotionDistribution[0].name).toBe('Calm');
    });
  });
});
