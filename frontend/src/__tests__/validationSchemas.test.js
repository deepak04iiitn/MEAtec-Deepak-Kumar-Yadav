import { describe, it, expect } from '@jest/globals';
import { registerSchema, loginSchema, taskSchema } from '../utils/validationSchemas';

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        username: 'testuser',
        password: 'password123',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject username shorter than 3 characters', () => {
      const invalidData = {
        username: 'ab',
        password: 'password123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at least 3 characters');
      }
    });

    it('should reject username longer than 30 characters', () => {
      const invalidData = {
        username: 'a'.repeat(31),
        password: 'password123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject username with invalid characters', () => {
      const invalidData = {
        username: 'user@name',
        password: 'password123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('letters, numbers, and underscores');
      }
    });

    it('should reject password shorter than 6 characters', () => {
      const invalidData = {
        username: 'testuser',
        password: 'pass',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at least 6 characters');
      }
    });

    it('should reject password longer than 100 characters', () => {
      const invalidData = {
        username: 'testuser',
        password: 'a'.repeat(101),
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        username: 'testuser',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty username', () => {
      const invalidData = {
        username: '',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('required');
      }
    });

    it('should reject empty password', () => {
      const invalidData = {
        username: 'testuser',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('required');
      }
    });
  });

  describe('taskSchema', () => {
    it('should validate correct task data', () => {
      const validData = {
        title: 'Test Task',
        description: 'Task description',
        status: 'pending',
      };

      const result = taskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate task with only title', () => {
      const validData = {
        title: 'Test Task',
      };

      const result = taskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const invalidData = {
        title: '',
        description: 'Task description',
      };

      const result = taskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('required');
      }
    });

    it('should reject title longer than 200 characters', () => {
      const invalidData = {
        title: 'a'.repeat(201),
        description: 'Task description',
      };

      const result = taskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at most 200 characters');
      }
    });

    it('should reject description longer than 1000 characters', () => {
      const invalidData = {
        title: 'Test Task',
        description: 'a'.repeat(1001),
      };

      const result = taskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at most 1000 characters');
      }
    });

    it('should reject invalid status', () => {
      const invalidData = {
        title: 'Test Task',
        status: 'invalid',
      };

      const result = taskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept completed status', () => {
      const validData = {
        title: 'Test Task',
        status: 'completed',
      };

      const result = taskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should default to pending status if not provided', () => {
      const data = {
        title: 'Test Task',
      };

      const result = taskSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('pending');
      }
    });
  });
});

