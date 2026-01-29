/**
 * Memorial API Endpoints
 */
import { Memorial, MemorialImage, PaginatedResponse, MemorialCreateRequest } from '../types/index';
export declare const memorialAPI: {
    listMemorials: (page?: number, pageSize?: number) => Promise<PaginatedResponse<Memorial>>;
    getMemorial: (id: string) => Promise<Memorial>;
    createMemorial: (data: MemorialCreateRequest) => Promise<Memorial>;
    updateMemorial: (id: string, data: Partial<MemorialCreateRequest>) => Promise<Memorial>;
    deleteMemorial: (id: string) => Promise<void>;
    getMyMemorials: (page?: number, pageSize?: number) => Promise<PaginatedResponse<Memorial>>;
    uploadImage: (memorialId: string, file: File) => Promise<MemorialImage>;
    deleteImage: (imageId: string) => Promise<void>;
};
//# sourceMappingURL=memorial.d.ts.map