import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredRoles = [], 
  redirectTo = '/login',
  fallback = null,
  requireAuth = true 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('[ProtectedRoute]', { 
    path: location.pathname,
    isLoading, 
    isAuthenticated, 
    userRole: user?.role,
    requiredRole,
    requiredRoles,
    passCheck: !isLoading && (requiredRole ? user?.role === requiredRole : true)
  });

  // Show loading state while checking authentication
  if (isLoading) {
    console.log('[ProtectedRoute] Showing fallback/loading...');
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    // Store the intended destination for redirect after login
    return <Navigate 
      to={redirectTo} 
      state={{ from: location.pathname }} 
      replace 
    />;
  }

  // Check specific role requirement
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on user's actual role or to unauthorized page
    if (user?.role) {
      // User is authenticated but doesn't have required role
      return <Navigate to="/unauthorized" replace />;
    } else {
      // User not authenticated
      return <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />;
    }
  }

  // Check multiple roles requirement
  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
    if (user?.role) {
      // User is authenticated but doesn't have any of the required roles
      return <Navigate to="/unauthorized" replace />;
    } else {
      // User not authenticated
      return <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />;
    }
  }

  // All checks passed, render the protected content
  return children;
};

// Higher-order component for role-based protection
export const withRoleProtection = (Component, requiredRole) => {
  const WrappedComponent = (props) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  );
  
  WrappedComponent.displayName = `withRoleProtection(${Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent;
};

// Specialized components for common use cases
export const AdminOnlyRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRole="ADMIN" {...props}>
    {children}
  </ProtectedRoute>
);

export const OwnerOnlyRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRole="OWNER" {...props}>
    {children}
  </ProtectedRoute>
);

export const ProviderOnlyRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRole="SERVICE_PROVIDER" {...props}>
    {children}
  </ProtectedRoute>
);

export const RenterOnlyRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRole="RENTER" {...props}>
    {children}
  </ProtectedRoute>
);

// Route that requires any authenticated user (any role)
export const AuthenticatedRoute = ({ children, ...props }) => (
  <ProtectedRoute requireAuth={true} {...props}>
    {children}
  </ProtectedRoute>
);

// Route for business users (owners and service providers)
export const BusinessRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRoles={['OWNER', 'SERVICE_PROVIDER']} {...props}>
    {children}
  </ProtectedRoute>
);

// Route for staff (admins and business users)
export const StaffRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRoles={['ADMIN', 'OWNER', 'SERVICE_PROVIDER']} {...props}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;