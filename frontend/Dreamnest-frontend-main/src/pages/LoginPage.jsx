import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Container from '../components/Container';
import Button from '../components/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  // Check for registration success message
  const searchParams = new URLSearchParams(location.search);
  const isRegistered = searchParams.get('registered') === 'true';

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      // Use AuthContext login method
      const user = await login({
        email: formData.email,
        password: formData.password
      });

      // Role-based dashboard redirection
      switch (user.role) {
        case 'RENTER':
          navigate('/dashboard');
          break;
        case 'OWNER':
          navigate('/dashboard/owner');
          break;
        case 'SERVICE_PROVIDER':
          navigate('/dashboard/provider');
          break;
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({
        general: error.message || 'Login failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail.trim()) return;

    // Simulate password reset email
    await new Promise(resolve => setTimeout(resolve, 1000));
    setForgotPasswordSent(true);
  };

  const handleSocialLogin = (provider) => {
    // Placeholder for social login
    alert(`${provider} login will be implemented with backend integration`);
  };

  const renderDemoCredentials = () => {
    // Demo accounts from AuthContext
    const demoUsers = [
      { role: 'renter', email: 'renter@dreamnest.com', password: 'Renter123' },
      { role: 'owner', email: 'owner@dreamnest.com', password: 'Owner123' },
      { role: 'service_provider', email: 'provider@dreamnest.com', password: 'Provider123' },
      { role: 'admin', email: 'admin@dreamnest.com', password: 'Admin123' }
    ];

    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
          Demo Accounts (for testing):
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {demoUsers.map((user) => (
            <div key={user.role} className="bg-white dark:bg-blue-900/30 rounded p-2">
              <div className="font-medium text-blue-900 dark:text-blue-100 capitalize">
                {user.role.replace('_', ' ')}
              </div>
              <div className="text-blue-700 dark:text-blue-200 mt-1">
                {user.email}
              </div>
              <div className="text-blue-600 dark:text-blue-300">
                {user.password}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Enter your email address and we&apos;ll send you a reset link
              </p>
            </div>

            {forgotPasswordSent ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Check your email
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    We&apos;ve sent a password reset link to {forgotPasswordEmail}
                  </p>
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordSent(false);
                      setForgotPasswordEmail('');
                    }}
                    className="w-full"
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button 
                      variant="secondary" 
                      onClick={() => setShowForgotPassword(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Send Reset Link
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-primary-600 dark:text-primary-300 text-xl mb-6">
              <span className="inline-block w-8 h-8 rounded-md bg-gradient-to-tr from-primary-500 to-accent-400 shadow-inner" />
              DreamNest
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Registration Success Message */}
          {isRegistered && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                    Registration Successful!
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Your account has been created. You can now sign in to access your dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Demo Credentials */}
          {renderDemoCredentials()}

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800 dark:text-red-200">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-200 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.password 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-200 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" loading={loading} className="w-full">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Social Login Options */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('Facebook')}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;