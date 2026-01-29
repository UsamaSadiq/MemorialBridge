/**
 * Comment API Endpoints
 */
import apiClient from './client';
export const commentAPI = {
    getComments: async (memorialId, page = 1, pageSize = 20) => {
        const response = await apiClient.get(`/memorials/${memorialId}/comments`, {
            params: { page, page_size: pageSize },
        });
        return response.data;
    },
    createComment: async (memorialId, data) => {
        const response = await apiClient.post(`/memorials/${memorialId}/comments`, data);
        return response.data;
    },
    deleteComment: async (commentId) => {
        await apiClient.delete(`/comments/${commentId}`);
    },
    flagComment: async (commentId, reason) => {
        await apiClient.post(`/admin/comments/${commentId}/flag`, { reason });
    },
};
