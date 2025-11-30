import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import userReducer from '../redux/user/userSlice';

// Mock the auth service
jest.mock('../services/authService', () => ({
  register: jest.fn(),
}));

describe('SignUp Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
      },
    });
  });

  const renderSignUp = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      </Provider>
    );
  };

  it('should render sign up form', () => {
    renderSignUp();

    // Use getByRole for heading to avoid multiple matches
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/choose a username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/create a strong password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should show validation error for empty username', async () => {
    const user = userEvent.setup();
    renderSignUp();

    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for username too short', async () => {
    const user = userEvent.setup();
    renderSignUp();

    const usernameInput = screen.getByPlaceholderText(/choose a username/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(usernameInput, 'ab');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for username too long', async () => {
    const user = userEvent.setup();
    renderSignUp();

    const usernameInput = screen.getByPlaceholderText(/choose a username/i);
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/create a strong password/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(usernameInput, 'a'.repeat(31));
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username must be at most 30 characters/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid username characters', async () => {
    const user = userEvent.setup();
    renderSignUp();

    const usernameInput = screen.getByPlaceholderText(/choose a username/i);
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/create a strong password/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(usernameInput, 'user@name');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username can only contain letters, numbers, and underscores/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for password too short', async () => {
    const user = userEvent.setup();
    renderSignUp();

    const usernameInput = screen.getByPlaceholderText(/choose a username/i);
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/create a strong password/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'pass');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('should allow user to type in all form fields', async () => {
    const user = userEvent.setup();
    renderSignUp();

    const usernameInput = screen.getByPlaceholderText(/choose a username/i);
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/create a strong password/i);

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(usernameInput).toHaveValue('testuser');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should show link to sign in page', () => {
    renderSignUp();

    const signInLink = screen.getByRole('link', { name: /sign in/i });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/sign-in');
  });

  it('should disable submit button when loading', () => {
    // Set loading state in store before rendering
    store = configureStore({
      reducer: {
        user: userReducer,
      },
      preloadedState: {
        user: {
          currentUser: null,
          token: null,
          error: null,
          loading: true,
        },
      },
    });

    renderSignUp();

    // The button text changes to "Creating Account..." when loading
    const submitButton = screen.getByRole('button', { name: /creating account/i });
    expect(submitButton).toBeDisabled();
  });
});

