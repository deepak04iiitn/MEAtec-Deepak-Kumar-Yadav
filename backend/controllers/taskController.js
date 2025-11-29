import prisma from '../utils/prisma.js';

export const getTasks = async (req, res, next) => {
  try {
    const userId = req.userId;

    const tasks = await prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { title, description, status } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: status || 'pending',
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;
    const { title, description, status } = req.body;

    // First, verifying that the task belongs to the user
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if(!existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if(existingTask.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this task',
      });
    }

    // Updating the task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description: description || null }),
        ...(status && { status }),
      },
    });

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;

    // First, verifying that the task belongs to the user
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if(!existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if(existingTask.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this task',
      });
    }

    // Deleting the task
    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
    
  } catch (error) {
    next(error);
  }
};

