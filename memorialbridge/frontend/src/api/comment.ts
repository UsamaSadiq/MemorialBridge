/**
 * Comment API Endpoints
 */

import apiClient from './client';
import { Comment, CommentCreateRequest, PaginatedResponse } from '../types/index';

export const commentAPI = {
  getComments: async (
    memorialId: string,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Comment>> => {
    const response = await apiClient.get<PaginatedResponse<Comment>>(
      `/memorials/${memorialId}/comments`,
      {
        params: { page, page_size: pageSize },
      }
    );
    return response.data;
  },

  createComment: async (memorialId: string, data: CommentCreateRequest): Promise<Comment> => {
    const response = await apiClient.post<Comment>(`/memorials/${memorialId}/comments`, data);
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await apiClient.delete(`/comments/${commentId}`);
  },

  flagComment: async (commentId: string, reason: string): Promise<void> => {
    await apiClient.post(`/admin/comments/${commentId}/flag`, { reason });
  },
};
