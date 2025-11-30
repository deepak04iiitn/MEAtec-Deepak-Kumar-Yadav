import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import prisma from '../utils/prisma.js';

// Mock Prisma
jest.mock('../utils/prisma.js', () => ({
  __esModule: true,
  default: {
    task: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('Task Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      userId: 'user123',
      body: {},
      params: {},
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

  describe('getTasks', () => {
    it('should get all tasks for the authenticated user', async () => {
      const mockTasks = [
        {
          id: 'task1',
          title: 'Test Task 1',
          description: 'Description 1',
          status: 'pending',
          userId: 'user123',
        },
        {
          id: 'task2',
          title: 'Test Task 2',
          description: 'Description 2',
          status: 'completed',
          userId: 'user123',
        },
      ];

      prisma.task.findMany.mockResolvedValue(mockTasks);

      await getTasks(req, res, next);

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { userId: 'user123' },
        orderBy: { createdAt: 'desc' },
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Tasks retrieved successfully',
        data: mockTasks,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors and call next', async () => {
      const error = new Error('Database error');
      prisma.task.findMany.mockRejectedValue(error);

      await getTasks(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      req.body = {
        title: 'New Task',
        description: 'Task description',
        status: 'pending',
      };

      const mockTask = {
        id: 'task123',
        title: 'New Task',
        description: 'Task description',
        status: 'pending',
        userId: 'user123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.task.create.mockResolvedValue(mockTask);

      await createTask(req, res, next);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          title: 'New Task',
          description: 'Task description',
          status: 'pending',
          userId: 'user123',
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Task created successfully',
        data: mockTask,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should create task with default status if not provided', async () => {
      req.body = {
        title: 'New Task',
        description: null,
      };

      const mockTask = {
        id: 'task123',
        title: 'New Task',
        description: null,
        status: 'pending',
        userId: 'user123',
      };

      prisma.task.create.mockResolvedValue(mockTask);

      await createTask(req, res, next);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          title: 'New Task',
          description: null,
          status: 'pending',
          userId: 'user123',
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle errors and call next', async () => {
      req.body = {
        title: 'New Task',
        description: 'Task description',
      };

      const error = new Error('Database error');
      prisma.task.create.mockRejectedValue(error);

      await createTask(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      req.params.id = 'task123';
      req.body = {
        title: 'Updated Task',
        description: 'Updated description',
        status: 'completed',
      };

      const existingTask = {
        id: 'task123',
        title: 'Original Task',
        description: 'Original description',
        status: 'pending',
        userId: 'user123',
      };

      const updatedTask = {
        ...existingTask,
        title: 'Updated Task',
        description: 'Updated description',
        status: 'completed',
      };

      prisma.task.findUnique.mockResolvedValue(existingTask);
      prisma.task.update.mockResolvedValue(updatedTask);

      await updateTask(req, res, next);

      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 'task123' },
      });
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: 'task123' },
        data: {
          title: 'Updated Task',
          description: 'Updated description',
          status: 'completed',
        },
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Task updated successfully',
        data: updatedTask,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 404 if task does not exist', async () => {
      req.params.id = 'nonexistent';
      req.body = {
        title: 'Updated Task',
      };

      prisma.task.findUnique.mockResolvedValue(null);

      await updateTask(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Task not found',
      });
      expect(prisma.task.update).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user does not own the task', async () => {
      req.params.id = 'task123';
      req.body = {
        title: 'Updated Task',
      };

      const existingTask = {
        id: 'task123',
        title: 'Original Task',
        userId: 'otheruser',
      };

      prisma.task.findUnique.mockResolvedValue(existingTask);

      await updateTask(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'You do not have permission to update this task',
      });
      expect(prisma.task.update).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle partial updates', async () => {
      req.params.id = 'task123';
      req.body = {
        status: 'completed',
      };

      const existingTask = {
        id: 'task123',
        title: 'Original Task',
        description: 'Original description',
        status: 'pending',
        userId: 'user123',
      };

      const updatedTask = {
        ...existingTask,
        status: 'completed',
      };

      prisma.task.findUnique.mockResolvedValue(existingTask);
      prisma.task.update.mockResolvedValue(updatedTask);

      await updateTask(req, res, next);

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: 'task123' },
        data: {
          status: 'completed',
        },
      });
    });

    it('should handle errors and call next', async () => {
      req.params.id = 'task123';
      req.body = {
        title: 'Updated Task',
      };

      const error = new Error('Database error');
      prisma.task.findUnique.mockRejectedValue(error);

      await updateTask(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      req.params.id = 'task123';

      const existingTask = {
        id: 'task123',
        title: 'Task to Delete',
        userId: 'user123',
      };

      prisma.task.findUnique.mockResolvedValue(existingTask);
      prisma.task.delete.mockResolvedValue(existingTask);

      await deleteTask(req, res, next);

      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 'task123' },
      });
      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: 'task123' },
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Task deleted successfully',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 404 if task does not exist', async () => {
      req.params.id = 'nonexistent';

      prisma.task.findUnique.mockResolvedValue(null);

      await deleteTask(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Task not found',
      });
      expect(prisma.task.delete).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user does not own the task', async () => {
      req.params.id = 'task123';

      const existingTask = {
        id: 'task123',
        title: 'Task to Delete',
        userId: 'otheruser',
      };

      prisma.task.findUnique.mockResolvedValue(existingTask);

      await deleteTask(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'You do not have permission to delete this task',
      });
      expect(prisma.task.delete).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors and call next', async () => {
      req.params.id = 'task123';

      const error = new Error('Database error');
      prisma.task.findUnique.mockRejectedValue(error);

      await deleteTask(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

