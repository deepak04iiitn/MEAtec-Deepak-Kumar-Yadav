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

router.get('/list', getTasks);
router.post('/create', validate(createTaskSchema), createTask);
router.put('/update/:id', validate(updateTaskSchema), updateTask);
router.delete('/delete/:id', deleteTask);

export default router;

