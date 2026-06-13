import request from 'supertest';
import app from '../app';
import pool from '../config/db';
import jwt from 'jsonwebtoken';

jest.mock('../config/db', () => {
  const mockConnection = {
    beginTransaction: jest.fn().mockResolvedValue(undefined),
    query: jest.fn().mockResolvedValue([{ insertId: 100 }]),
    commit: jest.fn().mockResolvedValue(undefined),
    rollback: jest.fn().mockResolvedValue(undefined),
    release: jest.fn().mockResolvedValue(undefined),
  };

  return {
    __esModule: true,
    default: {
      query: jest.fn(),
      getConnection: jest.fn().mockResolvedValue(mockConnection),
    },
    initializeDatabase: jest.fn().mockResolvedValue(undefined),
  };
});

const JWT_SECRET = 'mindmate_super_secret_key_123';
const mockUser = { id: 1, email: 'admin@example.com', name: 'Admin User' };
const mockToken = jwt.sign(mockUser, JWT_SECRET);

describe('Admin & Demo API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /admin/stats', () => {
    it('should fail if unauthorized', async () => {
      const response = await request(app).get('/admin/stats');
      expect(response.status).toBe(401);
    });

    it('should return aggregated admin statistics successfully', async () => {
      // Mock the 6 queries inside getAdminStats
      (pool.query as jest.Mock)
        .mockResolvedValueOnce([[{ count: 10 }]]) // total users
        .mockResolvedValueOnce([[{ count: 25 }]]) // total journals
        .mockResolvedValueOnce([[{ count: 30 }]]) // total moods
        .mockResolvedValueOnce([[{ avgStress: 55 }]]) // global avg stress
        .mockResolvedValueOnce([[{ trigger: 'Physics anxiety', count: 12 }]]) // top triggers
        .mockResolvedValueOnce([[{ emotion: 'Calm', count: 15 }]]); // emotion distribution

      const response = await request(app)
        .get('/admin/stats')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.totalUsers).toBe(10);
      expect(response.body.totalJournals).toBe(25);
      expect(response.body.totalMoods).toBe(30);
      expect(response.body.globalAvgStress).toBe(55);
      expect(response.body.topTriggers[0].trigger).toBe('Physics anxiety');
      expect(response.body.emotionDistribution[0].emotion).toBe('Calm');
    });
  });

  describe('POST /demo/populate', () => {
    it('should fail if unauthorized', async () => {
      const response = await request(app).post('/demo/populate');
      expect(response.status).toBe(401);
    });

    it('should populate 7 days of demo logs successfully', async () => {
      const response = await request(app)
        .post('/demo/populate')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('loaded successfully');
    });
  });
});
