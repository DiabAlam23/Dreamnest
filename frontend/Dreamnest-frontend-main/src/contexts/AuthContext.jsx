import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export { AuthContext };

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // API base URL
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  // Helper function to make API calls
  const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('dreamnest-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  };

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('dreamnest-user');
        const storedToken = localStorage.getItem('dreamnest-token');

        if (storedUser && storedToken) {
          // Validate token with API
          try {
            const response = await apiCall('/auth/profile');
            if (response.status === 'success') {
              setUser(response.data.user);
            } else {
              // Token invalid, clear storage
              localStorage.removeItem('dreamnest-user');
              localStorage.removeItem('dreamnest-token');
            }
          } catch (error) {
            console.error('Token validation failed:', error);
            // Token invalid, clear storage
            localStorage.removeItem('dreamnest-user');
            localStorage.removeItem('dreamnest-token');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid stored data
        localStorage.removeItem('dreamnest-user');
        localStorage.removeItem('dreamnest-token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    setIsLoading(true);

    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.status === 'success') {
        const { user, token } = response.data;

        // Store user and token
        localStorage.setItem('dreamnest-user', JSON.stringify(user));
        localStorage.setItem('dreamnest-token', token);

        setUser(user);
        return user;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setIsLoading(true);

    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.status === 'success') {
        const { user, token } = response.data;

        // Store user and token
        localStorage.setItem('dreamnest-user', JSON.stringify(user));
        localStorage.setItem('dreamnest-token', token);

        setUser(user);
        return user;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('dreamnest-user');
    localStorage.removeItem('dreamnest-token');
    setUser(null);
  };

  // Get user profile
  const getProfile = async () => {
    try {
      const response = await apiCall('/auth/profile');
      if (response.status === 'success') {
        return response.data.user;
      } else {
        throw new Error(response.message || 'Failed to get profile');
      }
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await apiCall('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (response.status === 'success') {
        const updatedUser = response.data.user;
        localStorage.setItem('dreamnest-user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return updatedUser;
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return user && roles.includes(user.role);
  };

  // Get user display name
  const getDisplayName = () => {
    if (!user) return '';
    return user.name || user.email.split('@')[0];
  };

  const value = {
    // User state
    user,
    isAuthenticated: !!user,
    isLoading,

    // Authentication methods
    login,
    logout,
    register,
    getProfile,
    updateProfile,

    // Helper methods
    hasRole,
    hasAnyRole,
    getDisplayName
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Export apiCall for use in other components
export function useApiCall() {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('dreamnest-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  };

  return apiCall;
}

// Helper hook for role-based conditional rendering
export function useAuthRole(requiredRole) {
  const { user, isAuthenticated } = useAuth();
  return {
    hasAccess: isAuthenticated && user?.role === requiredRole,
    isAuthenticated,
    userRole: user?.role
  };
}

// Helper hook for multi-role access
export function useAuthRoles(requiredRoles) {
  const { user, isAuthenticated } = useAuth();
  return {
    hasAccess: isAuthenticated && requiredRoles.includes(user?.role),
    isAuthenticated,
    userRole: user?.role
  };
}