/**
 * Subscription API Endpoints
 */
import apiClient from './client';
export const subscriptionAPI = {
    getStatus: async () => {
        const response = await apiClient.get('/subscription/status');
        return response.data;
    },
    upgrade: async () => {
        const response = await apiClient.post('/subscription/upgrade');
        return response.data;
    },
    downgrade: async () => {
        const response = await apiClient.post('/subscription/downgrade');
        return response.data;
    },
    getBillingHistory: async (page = 1, pageSize = 20) => {
        const response = await apiClient.get('/subscription/billing-history', {
            params: { page, page_size: pageSize },
        });
        return response.data;
    },
};
