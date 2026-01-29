/**
 * Admin API Endpoints
 */
import { Memorial, Comment, User, PaginatedResponse } from '../types/index';
export declare const adminAPI: {
    getPendingMemorials: (page?: number, pageSize?: number) => Promise<PaginatedResponse<Memorial>>;
    approveMemorial: (id: string, message?: string) => Promise<Memorial>;
    rejectMemorial: (id: string, reason: string) => Promise<Memorial>;
    getFlaggedComments: (page?: number, pageSize?: number) => Promise<PaginatedResponse<Comment>>;
    removeComment: (id: string) => Promise<void>;
    listUsers: (page?: number, pageSize?: number) => Promise<PaginatedResponse<User>>;
    getUser: (id: string) => Promise<User>;
    updateUser: (id: string, data: Partial<User>) => Promise<User>;
    getActivityLogs: (page?: number, pageSize?: number, startDate?: string, endDate?: string) => Promise<any>;
    getStatistics: () => Promise<any>;
};
//# sourceMappingURL=admin.d.ts.map