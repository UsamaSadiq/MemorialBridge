/**
 * Auth API Endpoints
 */
import apiClient from './client';
export const authAPI = {
    register: async (credentials) => {
        const response = await apiClient.post('/auth/register', credentials);
        return response.data;
    },
    login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    },
    logout: async () => {
        await apiClient.post('/auth/logout');
    },
    getCurrentUser: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },
    updateProfile: async (data) => {
        const response = await apiClient.put('/auth/me', data);
        return response.data;
    },
    changePassword: async (currentPassword, newPassword) => {
        await apiClient.post('/auth/change-password', { currentPassword, newPassword });
    },
    forgotPassword: async (email) => {
        await apiClient.post('/auth/forgot-password', { email });
    },
    resetPassword: async (token, newPassword) => {
        await apiClient.post('/auth/reset-password', { token, newPassword });
    },
};
// Export individual functions for direct imports
export const registerUser = async (credentials) => {
    return authAPI.register(credentials);
};
export const loginUser = async (credentials) => {
    return authAPI.login(credentials);
};
export const logoutUser = async () => {
    return authAPI.logout();
};
export const getCurrentUser = async () => {
    return authAPI.getCurrentUser();
};
export const updateProfile = async (data) => {
    return authAPI.updateProfile(data);
};
export const changePassword = async (data) => {
    return authAPI.changePassword(data.current_password, data.new_password);
};
export const forgotPassword = async (email) => {
    return authAPI.forgotPassword(email);
};
export const resetPassword = async (token, newPassword) => {
    return authAPI.resetPassword(token, newPassword);
};
