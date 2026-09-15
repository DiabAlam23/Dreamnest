import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Navigate } from 'react-router-dom';

const SmartDashboardRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/dashboard' }} replace />;
  }

  // Redirect to role-specific dashboard
  switch (user?.role) {
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'OWNER':
      return <Navigate to="/dashboard/owner" replace />;
    case 'SERVICE_PROVIDER':
      return <Navigate to="/dashboard/provider" replace />;
    case 'RENTER':
    default:
      console.log('[SmartDashboardRedirect] Redirecting to /dashboard/renter');
      // For renter role or fallback, show the main dashboard
      return <Navigate to="/dashboard/renter" replace />;
  }
};

export default SmartDashboardRedirect;