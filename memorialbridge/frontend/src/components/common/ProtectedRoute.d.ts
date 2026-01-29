/**
 * Protected Route Component
 * Wraps routes that require authentication
 */
interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
}
export declare const ProtectedRoute: ({ children, adminOnly }: ProtectedRouteProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=ProtectedRoute.d.ts.map