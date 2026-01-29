/**
 * Protected Route Component
 * Wraps routes that require authentication
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen bg-warmgray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-400 mx-auto mb-4" />
      <p className="text-warmgray-700 text-sm">Loading...</p>
    </div>
  </div>
);

export const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading, token } = useAuth();
  const loggedIn = isAuthenticated || !!token;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Token exists but user not loaded yet (e.g. fetchCurrentUser in progress or about to run)
  if (token && !user) {
    return <LoadingSpinner />;
  }

  if (adminOnly && !user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
