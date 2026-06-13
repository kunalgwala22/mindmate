import request from 'supertest';
import app from '../app';
import pool from '../config/db';

jest.mock('../config/db', () => {
  return {
    __esModule: true,
    default: {
      query: jest.fn(),
      getConnection: jest.fn().mockResolvedValue({
        query: jest.fn().mockResolvedValue([]),
        release: jest.fn(),
      }),
    },
    initializeDatabase: jest.fn().mockResolvedValue(undefined),
  };
});

describe('Authentication API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      // Mock no existing user
      (pool.query as jest.Mock).mockResolvedValueOnce([[]]);
      // Mock successful insert
      (pool.query as jest.Mock).mockResolvedValueOnce([{ insertId: 42 }]);

      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'securePassword123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toEqual({
        id: 42,
        name: 'Jane Doe',
        email: 'jane@example.com',
      });
    });

    it('should fail if email is already registered', async () => {
      // Mock existing user found
      (pool.query as jest.Mock).mockResolvedValueOnce([[{ id: 1 }]]);

      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'securePassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already exists');
    });

    it('should validate required inputs', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: '',
          email: '',
          password: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('required');
    });

    it('should sanitize HTML input to prevent XSS attacks', async () => {
      // Mock no existing user
      (pool.query as jest.Mock).mockResolvedValueOnce([[]]);
      // Mock successful insert
      (pool.query as jest.Mock).mockResolvedValueOnce([{ insertId: 42 }]);

      const response = await request(app)
        .post('/auth/register')
        .send({
          name: '<script>alert("hack")</script> Jane',
          email: 'jane_xss@example.com',
          password: 'securePassword123',
        });

      expect(response.status).toBe(201);
      expect(response.body.user.name).toBe('&lt;script&gt;alert(&quot;hack&quot;)&lt;&#x2F;script&gt; Jane');
    });
  });

  describe('POST /auth/login', () => {
    it('should validate inputs', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: '',
          password: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('required');
    });
  });
});
