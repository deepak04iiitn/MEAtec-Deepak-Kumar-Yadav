import api from '../utils/api';

export const getTasks = async () => {
  const response = await api.get('/tasks/list');
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/tasks/create', taskData);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await api.put(`/tasks/update/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/delete/${taskId}`);
  return response.data;
};

