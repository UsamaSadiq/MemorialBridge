/**
 * Auth Slice
 * Redux state management for authentication
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';
const initialState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null,
    token: localStorage.getItem('access_token') || null,
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('access_token'),
};
// Async thunks
export const register = createAsyncThunk('auth/register', async (credentials, { rejectWithValue }) => {
    try {
        const response = await apiClient.post('/auth/register', credentials);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.detail || 'Registration failed');
    }
});
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.detail || 'Login failed');
    }
});
export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
    try {
        const response = await apiClient.get('/auth/me');
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.detail || 'Failed to fetch user');
    }
});
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await apiClient.post('/auth/logout', {});
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.detail || 'Logout failed');
    }
});
// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            if (action.payload) {
                localStorage.setItem('user', JSON.stringify(action.payload));
            }
            else {
                localStorage.removeItem('user');
            }
        },
    },
    extraReducers: (builder) => {
        // Register
        builder
            .addCase(register.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.token = action.payload.access_token;
            state.isAuthenticated = true;
            localStorage.setItem('access_token', action.payload.access_token);
        })
            .addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
        // Login
        builder
            .addCase(login.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.token = action.payload.access_token;
            state.isAuthenticated = true;
            if (action.payload.user) {
                state.user = action.payload.user;
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            }
            localStorage.setItem('access_token', action.payload.access_token);
        })
            .addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
        // Fetch current user
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        });
        // Logout
        builder
            .addCase(logout.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(logout.fulfilled, (state) => {
            state.isLoading = false;
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
        })
            .addCase(logout.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            // Still clear local state even if logout API fails
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
        });
    },
});
export const { clearError, setIsAuthenticated, setUser } = authSlice.actions;
export default authSlice.reducer;
// Export thunks with aliases for use in hooks
export const loginAsync = login;
export const logoutAsync = logout;
