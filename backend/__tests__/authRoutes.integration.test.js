import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/authRoutes.js';
import { register, login } from '../controllers/authController.js';

// Mock controllers
jest.mock('../controllers/authController.js', () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

describe('Auth Routes Integration', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should call register controller', async () => {
      const mockRegister = (req, res) => {
        res.status(201).json({
          success: true,
          message: 'User registered successfully',
          data: { user: { id: '123', username: 'testuser' }, token: 'token123' },
        });
      };
      register.mockImplementation(mockRegister);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(register).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should call login controller', async () => {
      const mockLogin = (req, res) => {
        res.json({
          success: true,
          message: 'Login successful',
          data: { user: { id: '123', username: 'testuser' }, token: 'token123' },
        });
      };
      login.mockImplementation(mockLogin);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(login).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});

