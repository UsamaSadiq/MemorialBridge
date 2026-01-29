import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store/index';
import { useAuth } from '../../hooks/index';

// Mock the API
vi.mock('../../api/auth', () => ({
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  function wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  it('returns auth state from Redux store', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('token');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('isAuthenticated');
  });

  it('provides login function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(typeof result.current.login).toBe('function');
  });

  it('provides logout function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(typeof result.current.logout).toBe('function');
  });

  it('initializes with null user when not authenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
  });

  it('provides dispatch function for Redux actions', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(typeof result.current.dispatch).toBe('function');
  });

  it('error is initially null', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.error).toBeNull();
  });

  it('isLoading is initially false', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isLoading).toBe(false);
  });

  it('login is callable and returns a promise', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    const loginPromise = result.current.login('test@example.com', 'Password123');

    expect(loginPromise).toBeInstanceOf(Promise);
  });

  it('logout is callable and returns a promise', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    const logoutPromise = result.current.logout();

    expect(logoutPromise).toBeInstanceOf(Promise);
  });
});
