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

describe('Moods API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /moods', () => {
    it('should record a mood check-in successfully', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce([{ insertId: 5 }]);

      const response = await request(app)
        .post('/moods')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ mood: '🙂 Good' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.mood).toBe('🙂 Good');
    });

    it('should fail if mood is missing', async () => {
      const response = await request(app)
        .post('/moods')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ mood: '' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('required');
    });
  });

  describe('GET /moods', () => {
    it('should retrieve mood check-in history', async () => {
      const mockMoodsList = [
        { id: 1, mood: '🙂 Good', created_at: '2026-06-13T00:00:00.000Z' }
      ];

      (pool.query as jest.Mock).mockResolvedValueOnce([mockMoodsList]);

      const response = await request(app)
        .get('/moods')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0].mood).toBe('🙂 Good');
    });
  });
});
