/**
 * Charity API Endpoints
 */
import { Charity, PaginatedResponse } from '../types/index';
export declare const charityAPI: {
    listCharities: (page?: number, pageSize?: number) => Promise<PaginatedResponse<Charity>>;
    getCharity: (id: string) => Promise<Charity>;
};
//# sourceMappingURL=charity.d.ts.map