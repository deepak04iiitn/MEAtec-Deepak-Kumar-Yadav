import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TaskModal from '../components/TaskModal';
import taskReducer from '../redux/task/taskSlice';

// Mock task service
jest.mock('../services/taskService', () => ({
  createTask: jest.fn(() => Promise.resolve({ data: { id: 'task123', title: 'New Task' } })),
  updateTask: jest.fn(() => Promise.resolve({ data: { id: 'task123', title: 'Updated Task' } })),
}));

describe('TaskModal Component', () => {
  let store;
  let mockOnClose;
  let mockOnSuccess;

  beforeEach(() => {
    mockOnClose = jest.fn();
    mockOnSuccess = jest.fn();
    store = configureStore({
      reducer: {
        task: taskReducer,
      },
    });
  });

  const renderTaskModal = (task = null) => {
    return render(
      <Provider store={store}>
        <TaskModal task={task} onClose={mockOnClose} onSuccess={mockOnSuccess} />
      </Provider>
    );
  };

  it('should render create task modal', () => {
    renderTaskModal();

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter task title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/add more details/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  it('should render edit task modal when task is provided', () => {
    const task = {
      id: 'task123',
      title: 'Existing Task',
      description: 'Task description',
      status: 'pending',
    };

    renderTaskModal(task);

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Task description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('should show validation error for empty title', async () => {
    const user = userEvent.setup();
    renderTaskModal();

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for title too long', async () => {
    const user = userEvent.setup();
    renderTaskModal();

    const titleInput = screen.getByPlaceholderText(/enter task title/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, 'a'.repeat(201));
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title must be at most 200 characters/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for description too long', async () => {
    const user = userEvent.setup();
    renderTaskModal();

    const titleInput = screen.getByPlaceholderText(/enter task title/i);
    const descriptionInput = screen.getByPlaceholderText(/add more details/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, 'Valid Title');
    // Use fireEvent for long strings to avoid timeout and clipboard issues
    fireEvent.change(descriptionInput, { target: { value: 'a'.repeat(1001) } });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/description must be at most 1000 characters/i)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('should allow user to type in title field', async () => {
    const user = userEvent.setup();
    renderTaskModal();

    const titleInput = screen.getByPlaceholderText(/enter task title/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'New Task Title');

    expect(titleInput).toHaveValue('New Task Title');
  });

  it('should allow user to type in description field', async () => {
    const user = userEvent.setup();
    renderTaskModal();

    const descriptionInput = screen.getByPlaceholderText(/add more details/i);
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Task description');

    expect(descriptionInput).toHaveValue('Task description');
  });

  it('should allow user to select status', async () => {
    const user = userEvent.setup();
    renderTaskModal();

    const statusSelect = screen.getByRole('combobox');
    await user.selectOptions(statusSelect, 'completed');

    expect(statusSelect).toHaveValue('completed');
  });

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderTaskModal();

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when close button (X) is clicked', async () => {
    const user = userEvent.setup();
    renderTaskModal();

    const closeButton = screen.getByRole('button', { name: '' });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should have default status as pending', () => {
    renderTaskModal();

    const statusSelect = screen.getByRole('combobox');
    expect(statusSelect).toHaveValue('pending');
  });

  it('should populate form fields when editing', () => {
    const task = {
      id: 'task123',
      title: 'Task to Edit',
      description: 'Description to edit',
      status: 'completed',
    };

    renderTaskModal(task);

    expect(screen.getByDisplayValue('Task to Edit')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Description to edit')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('completed');
  });
});

