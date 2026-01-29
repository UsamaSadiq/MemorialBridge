/**
 * Admin API Endpoints
 */
import apiClient from './client';
export const adminAPI = {
    // Memorial moderation
    getPendingMemorials: async (page = 1, pageSize = 20) => {
        const response = await apiClient.get('/admin/pending-memorials', {
            params: { page, page_size: pageSize },
        });
        return response.data;
    },
    approveMemorial: async (id, message) => {
        const response = await apiClient.post(`/admin/memorials/${id}/approve`, { message });
        return response.data;
    },
    rejectMemorial: async (id, reason) => {
        const response = await apiClient.post(`/admin/memorials/${id}/reject`, { reason });
        return response.data;
    },
    // Comment moderation
    getFlaggedComments: async (page = 1, pageSize = 20) => {
        const response = await apiClient.get('/admin/flagged-comments', {
            params: { page, page_size: pageSize },
        });
        return response.data;
    },
    removeComment: async (id) => {
        await apiClient.post(`/admin/comments/${id}/remove`);
    },
    // User management
    listUsers: async (page = 1, pageSize = 20) => {
        const response = await apiClient.get('/admin/users', {
            params: { page, page_size: pageSize },
        });
        return response.data;
    },
    getUser: async (id) => {
        const response = await apiClient.get(`/admin/users/${id}`);
        return response.data;
    },
    updateUser: async (id, data) => {
        const response = await apiClient.put(`/admin/users/${id}`, data);
        return response.data;
    },
    // Activity logs
    getActivityLogs: async (page = 1, pageSize = 20, startDate, endDate) => {
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
        const response = await apiClient.get('/admin/charities', {
            params: { page, limit: pageSize },
        });
        return response.data;
    },
    createCharity: async (data) => {
        const response = await apiClient.post('/admin/charities', data);
        return response.data;
    },
};
