/**
 * Root layout component that handles authentication guards
 * 
 * This component wraps all routes and enforces authentication rules:
 * - Shows loading state while auth status is being determined
 * - Redirects unauthenticated users to login (except for auth pages)
 * - Redirects authenticated users away from login page to home
 * - Renders child routes via Outlet when authenticated
 * 
 * Public Routes (no auth required):
 * - /login - User login page
 * - /forgot-password - Password recovery request
 * - /reset-password - Password reset form
 * 
 * Protected Routes (auth required):
 * - All other routes
 * 
 * TODO: Add a proper loading spinner component instead of plain text
 * TODO: Consider adding route-specific loading states
 * TODO: Add error handling for auth failures
 */

import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './utils/AuthContext';

export default function Root() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">Loading...</div>;
  }

  // Redirect to login if not authenticated and not on a public auth page
  if (!user && !['/login', '/forgot-password', '/reset-password'].includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if authenticated user tries to access login page
  if (user && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  // Render child routes when authentication checks pass
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Outlet />
    </div>
  );
}
