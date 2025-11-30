import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { authenticate } from '../middlewares/auth.js';
import { verifyToken } from '../utils/jwt.js';

// Mock JWT utility
jest.mock('../utils/jwt.js', () => ({
  verifyToken: jest.fn(),
}));

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should authenticate user with valid token', async () => {
    req.headers.authorization = 'Bearer validToken123';
    verifyToken.mockReturnValue({ userId: 'user123' });

    await authenticate(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith('validToken123');
    expect(req.userId).toBe('user123');
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 401 if no authorization header', async () => {
    req.headers.authorization = undefined;

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'No token provided. Authorization header must be in format: Bearer <token>',
    });
    expect(next).not.toHaveBeenCalled();
    expect(req.userId).toBeUndefined();
  });

  it('should return 401 if authorization header does not start with Bearer', async () => {
    req.headers.authorization = 'InvalidToken123';

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'No token provided. Authorization header must be in format: Bearer <token>',
    });
    expect(verifyToken).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', async () => {
    req.headers.authorization = 'Bearer invalidToken';
    const error = new Error('Invalid or expired token');
    verifyToken.mockImplementation(() => {
      throw error;
    });

    await authenticate(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith('invalidToken');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid or expired token',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is expired', async () => {
    req.headers.authorization = 'Bearer expiredToken';
    const error = new Error('Token expired');
    verifyToken.mockImplementation(() => {
      throw error;
    });

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token expired',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should extract token correctly from Bearer string', async () => {
    req.headers.authorization = 'Bearer token123456';
    verifyToken.mockReturnValue({ userId: 'user123' });

    await authenticate(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith('token123456');
    expect(req.userId).toBe('user123');
    expect(next).toHaveBeenCalled();
  });
});

