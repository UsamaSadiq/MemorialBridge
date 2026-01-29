/**
 * Auth API Endpoints
 */

import apiClient from './client';
import { User, LoginRequest, RegistrationRequest, AuthResponse } from '../types/index';

export const authAPI = {
  register: async (credentials: RegistrationRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },

  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>('/auth/me', data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/change-password', { currentPassword, newPassword });
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', { token, newPassword });
  },
};

// Export individual functions for direct imports
export const registerUser = async (credentials: RegistrationRequest): Promise<AuthResponse> => {
  return authAPI.register(credentials);
};

export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  return authAPI.login(credentials);
};

export const logoutUser = async (): Promise<void> => {
  return authAPI.logout();
};

export const getCurrentUser = async (): Promise<User> => {
  return authAPI.getCurrentUser();
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  return authAPI.updateProfile(data);
};

export const changePassword = async (data: {
  current_password: string;
  new_password: string;
}): Promise<void> => {
  return authAPI.changePassword(data.current_password, data.new_password);
};

export const forgotPassword = async (email: string): Promise<void> => {
  return authAPI.forgotPassword(email);
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  return authAPI.resetPassword(token, newPassword);
};
