import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../utils/validation.js';
import { createTaskSchema, updateTaskSchema } from '../utils/validation.js';

const router = express.Router();

// All task routes should require authentication
router.use(authenticate);

router.get('/', getTasks);
router.post('/', validate(createTaskSchema), createTask);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;

