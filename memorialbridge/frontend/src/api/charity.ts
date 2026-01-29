/**
 * Charity API Endpoints
 */

import apiClient from './client';
import { Charity, PaginatedResponse } from '../types/index';

export const charityAPI = {
  listCharities: async (page = 1, pageSize = 20): Promise<PaginatedResponse<Charity>> => {
    const response = await apiClient.get<PaginatedResponse<Charity>>('/charities', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  getCharity: async (id: string): Promise<Charity> => {
    const response = await apiClient.get<Charity>(`/charities/${id}`);
    return response.data;
  },
};
