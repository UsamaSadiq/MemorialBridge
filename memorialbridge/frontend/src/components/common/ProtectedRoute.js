import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Protected Route Component
 * Wraps routes that require authentication
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
const LoadingSpinner = () => (_jsx("div", { className: "flex justify-center items-center min-h-screen bg-warmgray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-400 mx-auto mb-4" }), _jsx("p", { className: "text-warmgray-700 text-sm", children: "Loading..." })] }) }));
export const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, user, isLoading, token } = useAuth();
    const loggedIn = isAuthenticated || !!token;
    if (isLoading) {
        return _jsx(LoadingSpinner, {});
    }
    if (!loggedIn) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // Token exists but user not loaded yet (e.g. fetchCurrentUser in progress or about to run)
    if (token && !user) {
        return _jsx(LoadingSpinner, {});
    }
    if (adminOnly && !user?.is_admin) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
