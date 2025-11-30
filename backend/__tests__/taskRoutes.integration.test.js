import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import taskRoutes from '../routes/taskRoutes.js';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { authenticate } from '../middlewares/auth.js';

// Mock middleware and controllers
jest.mock('../middlewares/auth.js', () => ({
  authenticate: jest.fn((req, res, next) => {
    req.userId = 'user123';
    next();
  }),
}));

jest.mock('../controllers/taskController.js', () => ({
  getTasks: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
}));

describe('Task Routes Integration', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/tasks', taskRoutes);
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('should call getTasks controller with authentication', async () => {
      getTasks.mockImplementation((req, res) => {
        res.json({
          success: true,
          message: 'Tasks retrieved successfully',
          data: [],
        });
      });

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', 'Bearer token123');

      expect(authenticate).toHaveBeenCalled();
      expect(getTasks).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/tasks', () => {
    it('should call createTask controller with authentication', async () => {
      createTask.mockImplementation((req, res) => {
        res.status(201).json({
          success: true,
          message: 'Task created successfully',
          data: { id: 'task123', title: 'New Task' },
        });
      });

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', 'Bearer token123')
        .send({
          title: 'New Task',
          description: 'Task description',
          status: 'pending',
        });

      expect(authenticate).toHaveBeenCalled();
      expect(createTask).toHaveBeenCalled();
      expect(response.status).toBe(201);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should call updateTask controller with authentication', async () => {
      updateTask.mockImplementation((req, res) => {
        res.json({
          success: true,
          message: 'Task updated successfully',
          data: { id: 'task123', title: 'Updated Task' },
        });
      });

      const response = await request(app)
        .put('/api/tasks/task123')
        .set('Authorization', 'Bearer token123')
        .send({
          title: 'Updated Task',
        });

      expect(authenticate).toHaveBeenCalled();
      expect(updateTask).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should call deleteTask controller with authentication', async () => {
      deleteTask.mockImplementation((req, res) => {
        res.json({
          success: true,
          message: 'Task deleted successfully',
        });
      });

      const response = await request(app)
        .delete('/api/tasks/task123')
        .set('Authorization', 'Bearer token123');

      expect(authenticate).toHaveBeenCalled();
      expect(deleteTask).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });
});

