import { describe, it, expect, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';
import userReducer, { setUser } from '../redux/user/userSlice';

describe('Header Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
      },
    });
  });

  const renderHeader = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );
  };

  it('should render header component with logo', () => {
    renderHeader();
    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
  });

  it('should show sign in and get started links when user is not logged in', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument();
  });

  it('should show dashboard and user info when user is logged in', () => {
    // Set user in store using the setUser action
    store.dispatch(setUser({
      user: { id: '123', username: 'testuser' },
      token: 'token123',
    }));

    renderHeader();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('should call signOut when sign out button is clicked', async () => {
    const user = userEvent.setup();
    
    // Set user in store using the setUser action
    store.dispatch(setUser({
      user: { id: '123', username: 'testuser' },
      token: 'token123',
    }));

    renderHeader();
    
    // Find the sign out button by its title
    const signOutButton = screen.getByTitle(/sign out/i);
    expect(signOutButton).toBeInTheDocument();
    
    await user.click(signOutButton);
    
    // Check if signOut action was dispatched - user should be null after sign out
    const state = store.getState();
    expect(state.user.currentUser).toBeNull();
  });
});

