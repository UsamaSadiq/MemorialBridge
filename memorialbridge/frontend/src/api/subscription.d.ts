/**
 * Subscription API Endpoints
 */
import { Subscription } from '../types/index';
export declare const subscriptionAPI: {
    getStatus: () => Promise<Subscription>;
    upgrade: () => Promise<Subscription>;
    downgrade: () => Promise<Subscription>;
    getBillingHistory: (page?: number, pageSize?: number) => Promise<any>;
};
//# sourceMappingURL=subscription.d.ts.map