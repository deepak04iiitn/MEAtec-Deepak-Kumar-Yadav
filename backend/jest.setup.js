// Jest setup file for backend tests
// This file runs before each test file

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-jwt-token-generation';
process.env.JWT_EXPIRES_IN = '1h';
process.env.DATABASE_URL = 'mongodb://localhost:27017/test-db';

