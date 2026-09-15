import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Container from '../components/Container.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Button from '../components/Button.jsx';

export default function HomePage() {
  const { user } = useAuth();

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

  const features = [
  { title: 'Verified Listings', tone:'primary', accent:'from-primary-500/15 to-primary-500/0', icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary-600 dark:text-primary-400"><path fill="currentColor" d="M9.55 17.54 4.4 12.4l1.42-1.42 3.73 3.73 8.63-8.63 1.42 1.42Z"/></svg>
      ), desc: 'Trustworthy property information with transparency-first presentation.' },
  { title: 'Real Reviews', tone:'accent', accent:'from-accent-500/20 to-accent-500/0', icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-accent-500"><path fill="currentColor" d="M12 21q-.425 0-.713-.288Q11 20.425 11 20v-2h7q.825 0 1.413-.587Q20 16.825 20 16V6q0-.825-.587-1.412Q18.825 4 18 4H6q-.825 0-1.412.588Q4 5.175 4 6v10q0 .825.588 1.413Q5.175 18 6 18h3.5l2.15 2.15q.275.275.438.412.162.138.412.138Zm-6-7V6v10Zm2-1h10V6H8Zm-2 1V6v10Z"/></svg>
      ), desc: 'Read feedback from previous tenants & buyers (mock data stage).' },
  { title: 'Secure Payments (Soon)', tone:'primary', accent:'from-primary-600/15 to-primary-600/0', icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary-600 dark:text-primary-400"><path fill="currentColor" d="M3 19V8h18v11Zm2-2h14v-7H5Zm0-9V5h14v3Zm7 6q.825 0 1.413-.587Q14 12.825 14 12t-.587-1.412Q12.825 10 12 10t-1.412.588Q10 11.175 10 12q0 .825.588 1.413Q11.175 14 12 14Z"/></svg>
      ), desc: 'Future integration with Bkash & banking APIs.' },
  { title: 'Relocation Services', tone:'primary', accent:'from-primary-400/15 to-primary-400/0', icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary-500 dark:text-primary-300"><path fill="currentColor" d="m20 8-8-5-8 5v2h16ZM4 18h16v-8H4Zm8-2q-1.25 0-2.125-.875T9 13t.875-2.125T12 10t2.125.875T15 13t-.875 2.125T12 16Z"/></svg>
      ), desc: 'Plan movers, packers & renovators in one place (mock placeholder).' },
  { title: 'AI Valuation (Future)', tone:'accent', accent:'from-accent-400/20 to-accent-400/0', icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-accent-500"><path fill="currentColor" d="M12 21q-.825 0-1.412-.587Q10 19.825 10 19v-1H5q-.825 0-1.412-.587Q3 16.825 3 16v-3q0-.425.288-.712Q3.575 12 4 12t.712.288Q5 12.575 5 13v3h5v-2.1q-1.5-.35-2.475-1.6Q6.55 11.05 6.55 9.4q0-1.8 1.225-3.075Q9 5.05 10.8 5.025h2.4q1.8.025 3.025 1.3Q17.45 7.6 17.45 9.4q0 1.65-.975 2.9T14 13.9V16h5v-3q0-.425.288-.712Q19.575 12 20 12t.712.288Q21 12.575 21 13v3q0 .825-.587 1.413Q19.825 19 19 19h-5v1q0 .825-.587 1.413Q12.825 21 12 21Zm0-8q1.275 0 2.212-.862.938-.863.938-2.138t-.938-2.138Q13.275 7 12 7t-2.138.862Q9 8.725 9 10t.862 2.138Q10.725 13 12 13Z"/></svg>
      ), desc: 'Upcoming intelligent pricing and negotiation assist.' },
  { title: 'Smart Matching', tone:'accent', accent:'from-accent-300/20 to-accent-300/0', icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-accent-500"><path fill="currentColor" d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17C15.24 5.06 14.32 5 13.38 5C11.1 5 8.82 5.35 6.66 6.05L8.13 7.52C9.69 7.17 11.34 7 12.99 7C16.87 7 20.4 8.6 21 9ZM15 10.5V12.17L13.5 10.67C12.97 10.86 12.5 11.22 12.17 11.69L10.69 10.21C10.38 9.9 9.89 9.9 9.58 10.21L7.39 12.4C7.08 12.71 7.08 13.2 7.39 13.51L9.21 15.33C8.74 15.66 8.38 16.13 8.19 16.67L6.67 15.15C6.03 14.51 5 14.87 5 15.78V19C5 20.1 5.9 21 7 21H10.22C11.13 21 11.49 19.97 10.85 19.33L7 15.48V15.78H7C7 15.78 7 15.78 7 15.78L8.85 17.63C9.16 17.94 9.65 17.94 9.96 17.63L12.15 15.44C12.46 15.13 12.46 14.64 12.15 14.33L10.33 12.51C10.66 12.04 11.13 11.68 11.67 11.49L13.15 12.97C13.79 13.61 14.82 13.25 14.82 12.34V9.06C14.82 8.15 13.79 7.79 13.15 8.43L15 10.28V10.5ZM15 12C15 12.55 15.45 13 16 13H18C18.55 13 19 12.55 19 12C19 11.45 18.55 11 18 11H16C15.45 11 15 11.45 15 12Z"/></svg>
      ), desc: 'Advanced algorithms to connect you with perfect properties & services.' }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section - Mobile Optimized */}
      <div className="relative border-b border-border/60 dark:border-[#334155] overflow-hidden min-h-[75vh] sm:min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="/images/properties/properties_14.jpg"
            alt="City skyline"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/45 to-black/25 dark:from-black/70 dark:via-black/55 dark:to-black/35" />
        </div>
        <Container className="py-16 sm:py-20 md:py-32 text-center relative w-full">
          {/* Personalized Welcome Message */}
          {user && (
            <div className="mb-4 sm:mb-6">
              <p className="text-white/80 text-lg">
                Welcome back, <span className="font-semibold text-white">{user.name || user.email?.split('@')[0]}</span>!
              </p>
            </div>
          )}
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 text-white drop-shadow-lg leading-tight">
            {user 
              ? (user.role === 'OWNER' 
                  ? 'Manage Your Properties' 
                  : user.role === 'SERVICE_PROVIDER' 
                    ? 'Grow Your Business' 
                    : 'Find Your Next Home')
              : 'Find Your Next Home'
            }<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>with Confidence
          </h1>
          <p className="max-w-xl sm:max-w-2xl mx-auto mb-6 sm:mb-8 text-base sm:text-lg md:text-xl text-white/90 leading-relaxed px-4 sm:px-0">
            {user 
              ? (user.role === 'OWNER' 
                  ? 'Track your listings, manage tenant relationships, and grow your real estate portfolio with powerful tools.'
                  : user.role === 'SERVICE_PROVIDER' 
                    ? 'Connect with property owners and renters, showcase your services, and build your client base.'
                    : 'Search properties, explore reviews, plan services & prepare for future AI insights — all in one modern interface.')
              : 'Search properties, explore reviews, plan services & prepare for future AI insights — all in one modern interface.'
            }
          </p>
          
          {/* Modern Mobile-First Search Bar */}
          <div className="max-w-md sm:max-w-2xl mx-auto mb-8 sm:mb-6 px-4 sm:px-0">
            <div className="relative">
              {/* Search Input Container */}
              <div className="flex items-center bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 dark:border-white/10 overflow-hidden">
                <div className="flex-1 relative">
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by city, neighborhood..."
                    className="w-full h-14 pl-12 pr-4 text-sm sm:text-base placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-white bg-transparent focus:outline-none border-0"
                  />
                </div>
                <button 
                  className="h-14 px-6 sm:px-8 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold text-sm sm:text-base transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                  type="button"
                >
                  <span className="hidden sm:inline">Search</span>
                  <span className="sm:hidden">Go</span>
                </button>
              </div>
              
              {/* Popular searches - Both Mobile & Desktop */}
              <div className="mt-3">
                <p className="text-xs text-white/70 mb-2 px-2">Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button className="px-3 py-1.5 text-xs bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-colors">
                    Dhaka
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-colors">
                    Chittagong
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-colors">
                    Sylhet
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-colors">
                    Rajshahi
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-colors">
                    Khulna
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Role-Based Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            {user ? (
              // Authenticated user actions
              <>
                <Button 
                  as={Link} 
                  to={getDashboardPath()} 
                  variant="primary" 
                  size="lg"
                  className="w-full sm:w-auto shadow-xl bg-primary-600 hover:bg-primary-700 text-white border-0"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {user.role === 'ADMIN' ? 'Admin Dashboard' : 
                   user.role === 'OWNER' ? 'Manage Properties' :
                   user.role === 'SERVICE_PROVIDER' ? 'Provider Dashboard' : 
                   'My Dashboard'}
                </Button>
                
                <Button 
                  as={Link} 
                  to="/properties" 
                  variant="secondary" 
                  size="lg"
                  className="w-full sm:w-auto shadow-xl bg-white/95 hover:bg-white text-gray-800 hover:text-gray-900 border border-white/60"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {user.role === 'OWNER' ? 'View All Properties' : 'Browse Properties'}
                </Button>

                {user.role !== 'ADMIN' && (
                  <Button 
                    as={Link} 
                    to="/services" 
                    variant="outline" 
                    size="lg"
                    className="w-full sm:w-auto shadow-xl bg-transparent hover:bg-white/20 border-2 border-white/80 text-white hover:text-white hover:border-white"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    {user.role === 'SERVICE_PROVIDER' ? 'Manage Services' : 'Find Services'}
                  </Button>
                )}
              </>
            ) : (
              // Guest user actions
              <>
                <Button 
                  as={Link} 
                  to="/properties" 
                  variant="primary" 
                  size="lg"
                  className="w-full sm:w-auto shadow-xl bg-primary-600 hover:bg-primary-700 text-white border-0"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Explore Properties
                </Button>
                <Button 
                  as={Link} 
                  to="/services" 
                  variant="secondary" 
                  size="lg"
                  className="w-full sm:w-auto shadow-xl bg-white/95 hover:bg-white text-gray-800 hover:text-gray-900 border border-white/60"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  View Services
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto shadow-xl bg-transparent hover:bg-white/20 border-2 border-white/80 text-white hover:text-white hover:border-white"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Account
                </Button>
              </>
            )}
          </div>
        </Container>
      </div>

      {/* Feature Highlights */}
      <Container className="pt-28 pb-24 relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/70 to-transparent" />
        <SectionHeading
          title="Why DreamNest?"
          subtitle="A unified experience that blends discovery, trust, and future-ready tools. Everything you see here runs on mock content today—designed to set a high visual and UX bar before real data arrives."
          align="center"
          titleClassName="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 dark:from-primary-300 dark:via-primary-400 dark:to-accent-300 drop-shadow-sm"
          subtitleClassName="font-medium"
        />
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-10 mb-28">
          {features.map(f => (
            <div
              key={f.title}
              className={`group relative flex flex-col rounded-3xl overflow-hidden border shadow-[0_6px_18px_-8px_rgba(0,0,0,0.25)] hover:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.35)] transition-all duration-400 backdrop-blur-sm
               ${f.tone === 'primary' ? 'border-primary-200/70 dark:border-primary-300/20' : 'border-accent-200/70 dark:border-accent-300/20'}
              `}
            >
              {/* Persistent background image */}
              <div
                className="absolute inset-0 opacity-70 group-hover:opacity-80 transition-opacity duration-500"
                style={{
                  backgroundImage: f.tone === 'primary'
                    ? 'url(/images/properties/properties_10.jpg)'
                    : 'url(/images/properties/properties_11.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                aria-hidden="true"
              />
              {/* Gradient overlays for readability */}
              <div className={`absolute inset-0 bg-gradient-to-br ${f.tone === 'primary' ? 'from-primary-50/90 via-white/80 to-white/60 dark:from-[#0f172a]/95 dark:via-[#0f172a]/85 dark:to-[#0f172a]/70' : 'from-accent-50/90 via-white/75 to-white/55 dark:from-[#0f172a]/95 dark:via-[#0f172a]/85 dark:to-[#0f172a]/70'}`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.9),rgba(255,255,255,0)_65%)] dark:bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.05),rgba(255,255,255,0)_65%)]" />
              {/* Glow ring accent on hover */}
              <div className={`pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${f.tone === 'primary' ? 'from-primary-400/40 via-primary-300/30 to-primary-400/40' : 'from-accent-400/40 via-accent-300/30 to-accent-400/40'} blur-[2px]`} />
              <div className="relative p-7 flex flex-col flex-1">
                <div className={`w-14 h-14 rounded-2xl grid place-items-center mb-6 shadow-md ring-4 ring-white/60 dark:ring-white/10 backdrop-blur-sm transition-colors duration-300 group-hover:scale-105 group-hover:shadow-lg
                  ${f.tone === 'primary' ? 'bg-gradient-to-br from-white to-primary-50/60 text-primary-600 dark:from-[#1e293b] dark:to-[#334155] dark:text-primary-300' : 'bg-gradient-to-br from-white to-accent-50/60 text-accent-600 dark:from-[#1e293b] dark:to-[#334155] dark:text-accent-300'}`}
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold text-xl md:text-[1.35rem] leading-snug tracking-tight mb-3 text-slate-900 dark:text-slate-100">
                  <span className="relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 group-hover:after:w-full after:bg-gradient-to-r after:from-primary-500 after:to-accent-500 after:transition-all after:duration-500">{f.title}</span>
                </h3>
                <p className="text-sm md:text-[0.93rem] leading-relaxed text-slate-600 dark:text-slate-300 flex-1 font-medium/5">
                  {f.desc}
                </p>
                <div className="mt-7 pt-5 flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-200/70 dark:border-slate-700/60">
                  <span className="flex items-center gap-1 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">Coming Soon
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all"><path fill="currentColor" d="m13.6 17-1.4-1.4 3.6-3.6-3.6-3.6L13.6 7 19 12.4Z"/></svg>
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 font-normal normal-case">Preview</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Featured Properties (separate band) */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-alt/90 to-surface/0 dark:from-[#1e293b]/90 dark:to-transparent" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        <Container className="pt-24 pb-28 relative">
          <SectionHeading
            title="Featured Properties"
            subtitle="A quick look at polished card layouts we’ll reuse across listings and detail pages once mock data wiring (Phase 5) lands."
            align="center"
            variant="gradient"
            subtitleClassName="font-medium"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-9">
            {[1,2,3,4].map(i => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#1e293b] border-2 border-border dark:border-[#3a4a63] shadow-[0_5px_18px_-4px_rgba(0,0,0,0.22)] hover:shadow-[0_14px_38px_-8px_rgba(0,0,0,0.38)] transition-all duration-300 before:absolute before:inset-0 before:rounded-[1rem] before:p-[1.5px] before:bg-gradient-to-r before:from-primary-400/50 before:via-accent-400/40 before:to-primary-400/50 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity after:pointer-events-none"
              >
                <div className="relative h-full w-full rounded-[0.95rem] overflow-hidden">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={`/images/properties/properties_${4 + i}.jpg`}
                      alt={`Sample Property ${i}`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2 py-1 rounded-md text-[11px] font-medium bg-white/90 backdrop-blur-sm text-slate-800 dark:bg-white/10 dark:text-white border border-white/60 dark:border-white/15">For Rent</span>
                      <span className="px-2 py-1 rounded-md text-[11px] font-medium bg-primary-600 text-white shadow-sm">Featured</span>
                    </div>
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h3 className="font-semibold tracking-tight mb-1 text-sm md:text-base">Sample Property {i}</h3>
                      <p className="text-[11px] md:text-xs opacity-90">2 Bed • 1 Bath • 1200 sqft</p>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    <p className="text-sm text-text-secondary dark:text-[#cbd5e1] leading-relaxed">Short description placeholder for property highlights and location context.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">$1,250/mo</span>
                      <Button size="sm" variant="outline" className="group/btn relative overflow-hidden">
                        <span className="relative z-10">View</span>
                        <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity bg-gradient-to-r from-primary-600 to-accent-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Enhanced CTA Section with Background Image */}
      <section className="relative overflow-hidden mt-36">
        {/* Full-width background image */}
        <div className="absolute inset-0">
          <img
            src="/images/properties/properties_12.jpg"
            alt="Modern city architecture"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/85 via-primary-800/75 to-accent-800/80" />
        </div>
        
        <Container className="py-20 md:py-24 relative">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Ready to List Your Property?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
              Join thousands of property owners who trust DreamNest. Get started with our simple listing process and reach qualified tenants faster.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary-700 hover:bg-primary-50 shadow-xl font-semibold px-8"
              >
                Start Your Listing
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/60 text-white hover:bg-white/10 hover:border-white font-semibold px-8"
              >
                Learn How It Works
              </Button>
            </div>
            
            {/* Simple stats or features */}
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-white/80">Active Listings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">24hrs</div>
                <div className="text-sm text-white/80">Average Response</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">98%</div>
                <div className="text-sm text-white/80">Owner Satisfaction</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* AI Features Coming Soon - Minimal Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
        <Container className="py-12 md:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-accent-500 rounded-full mr-2 animate-pulse"></span>
              Coming Soon
            </div>
            
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              AI-Powered Property Intelligence
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6">
              Future updates will include smart property valuations and market insights.
            </p>
            
            <Button 
              size="sm" 
              variant="outline"
              className="text-accent-600 dark:text-accent-400 border-accent-300 dark:border-accent-600 hover:bg-accent-50 dark:hover:bg-accent-900/20"
            >
              Stay Updated
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
