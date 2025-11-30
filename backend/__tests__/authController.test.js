import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { register, login } from '../controllers/authController.js';
import prisma from '../utils/prisma.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';

// Mock dependencies
jest.mock('../utils/prisma.js', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('../utils/jwt.js', () => ({
  generateToken: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      req.body = {
        username: 'testuser',
        password: 'password123',
      };

      const mockUser = {
        id: 'user123',
        username: 'testuser',
        createdAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      prisma.user.create.mockResolvedValue(mockUser);
      generateToken.mockReturnValue('mockToken');

      await register(req, res, next);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prisma.user.create).toHaveBeenCalled();
      expect(generateToken).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
        data: {
          user: mockUser,
          token: 'mockToken',
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 409 if username already exists', async () => {
      req.body = {
        username: 'existinguser',
        password: 'password123',
      };

      prisma.user.findUnique.mockResolvedValue({
        id: 'existing123',
        username: 'existinguser',
      });

      await register(req, res, next);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'existinguser' },
      });
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Username already exists',
      });
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors and call next', async () => {
      req.body = {
        username: 'testuser',
        password: 'password123',
      };

      const error = new Error('Database error');
      prisma.user.findUnique.mockRejectedValue(error);

      await register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      req.body = {
        username: 'testuser',
        password: 'password123',
      };

      const mockUser = {
        id: 'user123',
        username: 'testuser',
        password: 'hashedPassword',
        createdAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockReturnValue('mockToken');

      await login(req, res, next);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(generateToken).toHaveBeenCalledWith('user123');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: 'user123',
            username: 'testuser',
            createdAt: mockUser.createdAt,
          },
          token: 'mockToken',
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if user does not exist', async () => {
      req.body = {
        username: 'nonexistent',
        password: 'password123',
      };

      prisma.user.findUnique.mockResolvedValue(null);

      await login(req, res, next);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'nonexistent' },
      });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid username or password',
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if password is invalid', async () => {
      req.body = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: 'user123',
        username: 'testuser',
        password: 'hashedPassword',
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res, next);

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid username or password',
      });
      expect(generateToken).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors and call next', async () => {
      req.body = {
        username: 'testuser',
        password: 'password123',
      };

      const error = new Error('Database error');
      prisma.user.findUnique.mockRejectedValue(error);

      await login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});

