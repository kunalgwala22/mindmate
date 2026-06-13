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

const JWT_SECRET = 'mindmate_super_secret_key_123';
const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
const mockToken = jwt.sign(mockUser, JWT_SECRET);

describe('AI API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /ai/chat', () => {
    it('should fail if unauthorized', async () => {
      const response = await request(app)
        .post('/ai/chat')
        .send({ message: 'I feel stressed' });

      expect(response.status).toBe(401);
    });

    it('should fail if message is missing', async () => {
      const response = await request(app)
        .post('/ai/chat')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ message: '', mood: 'Anxious' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('required');
    });

    it('should respond with AI companion chat answer (mock fallback)', async () => {
      const response = await request(app)
        .post('/ai/chat')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ message: 'I am extremely tired and sleep deprived', mood: 'Burned Out' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('response');
      expect(response.body.response).toContain('empty');
    });
  });

  describe('GET /ai/forecast', () => {
    it('should fail if unauthorized', async () => {
      const response = await request(app).get('/ai/forecast');
      expect(response.status).toBe(401);
    });

    it('should generate weekly stress forecast and adjustments successfully', async () => {
      // Mock past journals query
      const mockPastJournals = [
        {
          content: 'Exhausted from physics exam preparation.',
          stressScore: 85,
          mood: '😫 Burned Out',
          date: '2026-06-13'
        }
      ];
      (pool.query as jest.Mock).mockResolvedValueOnce([mockPastJournals]);

      const response = await request(app)
        .get('/ai/forecast')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('burnoutRisk');
      expect(response.body).toHaveProperty('forecastSummary');
      expect(response.body).toHaveProperty('predictedTrend');
      expect(response.body).toHaveProperty('studyAdjustments');
      expect(response.body.burnoutRisk).toBe('Critical');
    });
  });
});
