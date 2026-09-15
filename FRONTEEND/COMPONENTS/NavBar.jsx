import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Button from './Button.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const linkBase = 'text-sm font-medium px-3 py-2 rounded-md transition-colors';
const navLinkClass = ({ isActive }) =>
  `${linkBase} ${isActive ? 'text-primary-600 dark:text-primary-300 bg-primary-50/70 dark:bg-[#334155]' : 'text-text-secondary dark:text-[#cbd5e1] hover:bg-primary-50 dark:hover:bg-[#334155]'}`;

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
      setOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    
    switch (user.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'OWNER':
        return '/dashboard/owner';
      case 'SERVICE_PROVIDER':
        return '/dashboard/provider';
      case 'RENTER':
      default:
        return '/dashboard/renter';
    }
  };

  const getProfilePath = () => {
    if (!user) return '/profile';
    
    switch (user.role) {
      case 'OWNER':
        return '/profile/owner';
      case 'SERVICE_PROVIDER':
        return '/profile/provider';
      case 'RENTER':
        return '/profile/renter';
      default:
        return '/profile';
    }
  };

  const renderAuthenticatedNav = () => (
    <>
      <NavLink to="/properties" className={navLinkClass}>Properties</NavLink>
      <NavLink to="/services" className={navLinkClass}>Services</NavLink>
      <NavLink to="/reviews" className={navLinkClass}>Reviews</NavLink>
      {(user?.role === 'OWNER' || user?.role === 'SERVICE_PROVIDER') && (
        <NavLink to={getDashboardPath()} className={navLinkClass}>Dashboard</NavLink>
      )}
      {user?.role === 'ADMIN' && (
        <NavLink to="/admin/dashboard" className={navLinkClass}>Admin</NavLink>
      )}
    </>
  );

  const renderGuestNav = () => (
    <>
      <NavLink to="/properties" className={navLinkClass}>Properties</NavLink>
      <NavLink to="/services" className={navLinkClass}>Services</NavLink>
      <NavLink to="/reviews" className={navLinkClass}>Reviews</NavLink>
      <NavLink to="/login" className={navLinkClass}>Login</NavLink>
      <NavLink to="/register" className={navLinkClass}>Register</NavLink>
    </>
  );

  const UserMenu = () => (
    <div className="relative">
      <button
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-text-secondary dark:text-[#cbd5e1] hover:bg-primary-50 dark:hover:bg-[#334155] transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center text-white text-sm font-semibold">
          {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="hidden lg:block">{user?.name || user?.email?.split('@')[0] || 'User'}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {userMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setUserMenuOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-gray-200 dark:border-slate-700 z-20">
            <div className="p-3 border-b border-gray-100 dark:border-slate-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
              <p className="text-xs text-primary-600 dark:text-primary-400 capitalize">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
            <div className="py-1">
              <Link
                to={getDashboardPath()}
                onClick={() => setUserMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to={getProfilePath()}
                onClick={() => setUserMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                Profile Settings
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Admin Panel
                </Link>
              )}
            </div>
            <div className="py-1 border-t border-gray-100 dark:border-slate-700">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 dark:border-white/10 backdrop-blur-xl bg-white/80 dark:bg-slate-900/85 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 flex items-center h-16 gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-primary-600 dark:text-primary-300 tracking-tight">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 shadow-md" aria-hidden="true">
            <svg viewBox="0 0 32 32" className="w-6 h-6 text-white" fill="none">
              <path d="M5 15.5 16 6l11 9.5v10a1.5 1.5 0 0 1-1.5 1.5h-19A1.5 1.5 0 0 1 5 25.5v-10Z" fill="currentColor" opacity=".95"/>
              <path d="M12 27V17h8v10M9.5 13.5 16 8l6.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span>DreamNest</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1 ml-auto">
          {isAuthenticated ? renderAuthenticatedNav() : renderGuestNav()}
        </nav>

        <div className="hidden md:flex items-center gap-2 ml-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
          )}
        </div>
        
        {/* Enhanced Mobile Menu Button */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(o => !o)}
          className="md:hidden ml-auto inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-gray-200/60 dark:border-slate-600/60 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all shadow-sm"
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            {open ? (
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </div>
        </button>
      </div>
      
      {/* Enhanced Mobile Menu with Authentication State */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        open 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0'
      }`}>
        <div className="border-t border-white/20 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 pb-4 flex flex-col gap-2 shadow-lg transform transition-transform duration-300 ease-in-out">
          <div className={`flex flex-col gap-2 transition-all duration-300 delay-75 ${
            open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}>
            {/* Mobile Navigation Links */}
            {isAuthenticated ? (
              <>
                <NavLink onClick={() => setOpen(false)} to="/properties" className={navLinkClass}>Properties</NavLink>
                <NavLink onClick={() => setOpen(false)} to="/services" className={navLinkClass}>Services</NavLink>
                <NavLink onClick={() => setOpen(false)} to="/reviews" className={navLinkClass}>Reviews</NavLink>
                <NavLink onClick={() => setOpen(false)} to={getDashboardPath()} className={navLinkClass}>Dashboard</NavLink>
                <NavLink onClick={() => setOpen(false)} to={getProfilePath()} className={navLinkClass}>Profile</NavLink>
                {user?.role === 'ADMIN' && (
                  <NavLink onClick={() => setOpen(false)} to="/admin/dashboard" className={navLinkClass}>Admin Panel</NavLink>
                )}
                
                {/* Mobile User Info */}
                <div className="border-t border-gray-200 dark:border-slate-700 pt-3 mt-2">
                  <div className="flex items-center gap-3 px-3 py-2 text-sm">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-white font-medium truncate">
                        {user?.name || user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs truncate">
                        {user?.email}
                      </p>
                      <p className="text-primary-600 dark:text-primary-400 text-xs capitalize">
                        {user?.role?.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink onClick={() => setOpen(false)} to="/properties" className={navLinkClass}>Properties</NavLink>
                <NavLink onClick={() => setOpen(false)} to="/services" className={navLinkClass}>Services</NavLink>
                <NavLink onClick={() => setOpen(false)} to="/reviews" className={navLinkClass}>Reviews</NavLink>
                <NavLink onClick={() => setOpen(false)} to="/login" className={navLinkClass}>Login</NavLink>
                <NavLink onClick={() => setOpen(false)} to="/register" className={navLinkClass}>Register</NavLink>
              </>
            )}
            
            {/* Mobile Theme Toggle */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-slate-700">
              <ThemeToggle />
              {!isAuthenticated && (
                <Button
                  size="sm"
                  variant="primary"
                  className="flex-1"
                  onClick={() => { setOpen(false); navigate('/register'); }}
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
