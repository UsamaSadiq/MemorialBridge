/**
 * Subscription API Endpoints
 */

import apiClient from './client';
import { Subscription } from '../types/index';

export const subscriptionAPI = {
  getStatus: async (): Promise<Subscription> => {
    const response = await apiClient.get<Subscription>('/subscription/status');
    return response.data;
  },

  upgrade: async (): Promise<Subscription> => {
    const response = await apiClient.post<Subscription>('/subscription/upgrade');
    return response.data;
  },

  downgrade: async (): Promise<Subscription> => {
    const response = await apiClient.post<Subscription>('/subscription/downgrade');
    return response.data;
  },

  getBillingHistory: async (page = 1, pageSize = 20) => {
    const response = await apiClient.get('/subscription/billing-history', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },
};
