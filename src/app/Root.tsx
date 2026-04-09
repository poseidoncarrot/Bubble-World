import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './utils/AuthContext';
import { useUniverseStore } from './contexts/UniverseContext';

export default function Root() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">Loading...</div>;
  }

  if (!user && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  if (user && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Outlet />
    </div>
  );
}
