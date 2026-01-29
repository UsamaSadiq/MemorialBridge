/**
 * Admin API Endpoints
 */

import apiClient from './client';
import { Memorial, Comment, User, PaginatedResponse } from '../types/index';

export interface AdminCharityCreate {
  name: string;
  description?: string;
  url: string;
}

export interface AdminCharityResponse {
  id: string;
  name: string;
  description: string | null;
  url: string;
  is_active: boolean;
  created_at: string;
}

export const adminAPI = {
  // Memorial moderation
  getPendingMemorials: async (page = 1, pageSize = 20): Promise<PaginatedResponse<Memorial>> => {
    const response = await apiClient.get<PaginatedResponse<Memorial>>('/admin/pending-memorials', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  approveMemorial: async (id: string, message?: string): Promise<Memorial> => {
    const response = await apiClient.post<Memorial>(`/admin/memorials/${id}/approve`, { message });
    return response.data;
  },

  rejectMemorial: async (id: string, reason: string): Promise<Memorial> => {
    const response = await apiClient.post<Memorial>(`/admin/memorials/${id}/reject`, { reason });
    return response.data;
  },

  // Comment moderation
  getFlaggedComments: async (page = 1, pageSize = 20): Promise<PaginatedResponse<Comment>> => {
    const response = await apiClient.get<PaginatedResponse<Comment>>('/admin/flagged-comments', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  removeComment: async (id: string): Promise<void> => {
    await apiClient.post(`/admin/comments/${id}/remove`);
  },

  // User management
  listUsers: async (page = 1, pageSize = 20): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>('/admin/users', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>(`/admin/users/${id}`, data);
    return response.data;
  },

  // Activity logs
  getActivityLogs: async (page = 1, pageSize = 20, startDate?: string, endDate?: string) => {
    const response = await apiClient.get('/admin/activity-logs', {
      params: { page, page_size: pageSize, start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  // Statistics
  getStatistics: async () => {
    const response = await apiClient.get('/admin/statistics');
    return response.data;
  },

  // Charity management (admin only)
  listCharities: async (page = 1, pageSize = 100) => {
    const response = await apiClient.get<PaginatedResponse<AdminCharityResponse>>('/admin/charities', {
      params: { page, limit: pageSize },
    });
    return response.data;
  },

  createCharity: async (data: AdminCharityCreate): Promise<AdminCharityResponse> => {
    const response = await apiClient.post<AdminCharityResponse>('/admin/charities', data);
    return response.data;
  },
};
