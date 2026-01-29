/**
 * Comment API Endpoints
 */
import { Comment, CommentCreateRequest, PaginatedResponse } from '../types/index';
export declare const commentAPI: {
    getComments: (memorialId: string, page?: number, pageSize?: number) => Promise<PaginatedResponse<Comment>>;
    createComment: (memorialId: string, data: CommentCreateRequest) => Promise<Comment>;
    deleteComment: (commentId: string) => Promise<void>;
    flagComment: (commentId: string, reason: string) => Promise<void>;
};
//# sourceMappingURL=comment.d.ts.map