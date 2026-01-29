/**
 * Memorial API Endpoints
 */

import apiClient from './client';
import { Memorial, MemorialImage, PaginatedResponse, MemorialCreateRequest } from '../types/index';

export const memorialAPI = {
  listMemorials: async (
    page = 1,
    pageSize = 20,
    options?: { featured?: boolean }
  ): Promise<PaginatedResponse<Memorial>> => {
    const params: Record<string, number | boolean> = { page, page_size: pageSize };
    if (options?.featured) params.featured = true;
    const response = await apiClient.get<PaginatedResponse<Memorial>>('/memorials', {
      params,
    });
    return response.data;
  },

  getMemorial: async (id: string): Promise<Memorial> => {
    const response = await apiClient.get<Memorial>(`/memorials/${id}`);
    return response.data;
  },

  createMemorial: async (data: MemorialCreateRequest): Promise<Memorial> => {
    const response = await apiClient.post<Memorial>('/memorials', data);
    return response.data;
  },

  updateMemorial: async (id: string, data: Partial<MemorialCreateRequest>): Promise<Memorial> => {
    const response = await apiClient.put<Memorial>(`/memorials/${id}`, data);
    return response.data;
  },

  deleteMemorial: async (id: string): Promise<void> => {
    await apiClient.delete(`/memorials/${id}`);
  },

  getMyMemorials: async (page = 1, pageSize = 20): Promise<PaginatedResponse<Memorial>> => {
    const response = await apiClient.get<PaginatedResponse<Memorial>>('/memorials/my', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  uploadImage: async (memorialId: string, file: File): Promise<MemorialImage> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<MemorialImage>(
      `/memorials/${memorialId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  deleteImage: async (imageId: string): Promise<void> => {
    await apiClient.delete(`/images/${imageId}`);
  },
};
