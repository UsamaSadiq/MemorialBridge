/**
 * Custom React Hooks
 * Shared hooks for common functionality
 */
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import apiClient from '../api/client';
import { loginAsync, logoutAsync, fetchCurrentUser } from '../store/slices/authSlice';
// Auth hook
export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, token, isLoading, error, isAuthenticated } = useSelector((state) => state.auth);
    // When we have a token but no user (e.g. login returned only token, or page refresh), fetch user so profile and other features work.
    useEffect(() => {
        if (token && !user) {
            dispatch(fetchCurrentUser());
        }
    }, [token, user, dispatch]);
    const login = useCallback(async (email, password) => {
        try {
            const result = await dispatch(loginAsync({ email, password }));
            return result.payload !== undefined;
        }
        catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }, [dispatch]);
    const logout = useCallback(async () => {
        try {
            await dispatch(logoutAsync());
        }
        catch (error) {
            console.error('Logout error:', error);
        }
    }, [dispatch]);
    return {
        user,
        token,
        isLoading,
        error,
        isAuthenticated,
        login,
        logout,
        dispatch,
    };
};
// API hook for data fetching
export const useApi = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(url);
                setData(response.data);
                setError(null);
            }
            catch (err) {
                setError(err.response?.data?.detail || 'Failed to fetch data');
                setData(null);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [url]);
    const refetch = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(url);
            setData(response.data);
            setError(null);
        }
        catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch data');
        }
        finally {
            setLoading(false);
        }
    }, [url]);
    return { data, loading, error, refetch };
};
// Local storage hook
export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        }
        catch (error) {
            console.error('Error reading from localStorage:', error);
            return initialValue;
        }
    });
    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    }, [key, storedValue]);
    return [storedValue, setValue];
};
// Debounce hook
export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};
