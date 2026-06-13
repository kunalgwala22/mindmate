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
  analyzeJournalEntry: jest.fn().mockResolvedValue({
    emotion: 'Anxiety',
    sentiment: 'Negative',
    stressScore: 75,
    stressTrigger: 'Physics exam',
    summary: 'Feeling anxious about upcoming Physics test.',
    copingStrategy: 'Review formulas in short blocks.',
    motivation: 'Keep trying.'
  }),
  analyzeMultipleJournalsForTriggers: jest.fn().mockResolvedValue([])
}));

const JWT_SECRET = 'mindmate_super_secret_key_123';
const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
const mockToken = jwt.sign(mockUser, JWT_SECRET);

describe('Journals API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /journals', () => {
    it('should create a new journal entry and return AI analysis', async () => {
      // 1. Mock latest mood query
      (pool.query as jest.Mock).mockResolvedValueOnce([[{ mood: '🙂 Good' }]]);
      // 2. Mock journal insertion
      (pool.query as jest.Mock).mockResolvedValueOnce([{ insertId: 10 }]);
      // 3. Mock AI analysis insertion
      (pool.query as jest.Mock).mockResolvedValueOnce([{ insertId: 100 }]);

      const response = await request(app)
        .post('/journals')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ content: 'I am stressed about my Physics derivation test.' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('journal');
      expect(response.body).toHaveProperty('analysis');
      expect(response.body.journal.id).toBe(10);
      expect(response.body.analysis.emotion).toBe('Anxiety');
    });

    it('should fail if content is missing', async () => {
      const response = await request(app)
        .post('/journals')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ content: '' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('required');
    });

    it('should fail if unauthorized', async () => {
      const response = await request(app)
        .post('/journals')
        .send({ content: 'Valid content' });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /journals', () => {
    it('should fetch all journal entries for the user', async () => {
      const mockLogs = [
        {
          id: 1,
          content: 'First entry',
          created_at: '2026-06-13T00:00:00.000Z',
          emotion: 'Calm',
          sentiment: 'Positive',
          stress_score: 20,
          stress_trigger: 'General',
          mood: '😀 Happy'
        }
      ];

      (pool.query as jest.Mock).mockResolvedValueOnce([mockLogs]);

      const response = await request(app)
        .get('/journals')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0].content).toBe('First entry');
    });
  });
});
