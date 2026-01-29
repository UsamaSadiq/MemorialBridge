/**
 * Memorial API Endpoints
 */
import apiClient from './client';
export const memorialAPI = {
    listMemorials: async (page = 1, pageSize = 20, options) => {
        const params = { page, page_size: pageSize };
        if (options?.featured)
            params.featured = true;
        const response = await apiClient.get('/memorials', {
            params,
        });
        return response.data;
    },
    getMemorial: async (id) => {
        const response = await apiClient.get(`/memorials/${id}`);
        return response.data;
    },
    createMemorial: async (data) => {
        const response = await apiClient.post('/memorials', data);
        return response.data;
    },
    updateMemorial: async (id, data) => {
        const response = await apiClient.put(`/memorials/${id}`, data);
        return response.data;
    },
    deleteMemorial: async (id) => {
        await apiClient.delete(`/memorials/${id}`);
    },
    getMyMemorials: async (page = 1, pageSize = 20) => {
        const response = await apiClient.get('/memorials/my', {
            params: { page, page_size: pageSize },
        });
        return response.data;
    },
    uploadImage: async (memorialId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post(`/memorials/${memorialId}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    deleteImage: async (imageId) => {
        await apiClient.delete(`/images/${imageId}`);
    },
};
