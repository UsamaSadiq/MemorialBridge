/**
 * Charity API Endpoints
 */
import apiClient from './client';
export const charityAPI = {
    listCharities: async (page = 1, pageSize = 20) => {
        const response = await apiClient.get('/charities', {
            params: { page, page_size: pageSize },
        });
        return response.data;
    },
    getCharity: async (id) => {
        const response = await apiClient.get(`/charities/${id}`);
        return response.data;
    },
};
