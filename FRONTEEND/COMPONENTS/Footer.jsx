import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  const linkGroups = [
    {
      title: 'Explore',
      links: [
        { label: 'Properties', to: '/properties' },
        { label: 'Services', to: '/services' },
        { label: 'Reviews', to: '/properties/placeholder-reviews' },
        { label: 'Pricing (Mock)', to: '/pricing' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', to: '/about' },
        { label: 'Careers (Mock)', to: '/careers' },
        { label: 'Cookie Policy', to: '/cookies' },
        { label: 'Contact', to: '/contact' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'FAQ', to: '/faq' },
        { label: 'Guides (Mock)', to: '/guides' },
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms', to: '/terms' }
      ]
    }
  ];

  return (
    <footer className="mt-20 border-t border-border/70 dark:border-[#334155] bg-gradient-to-br from-gray-50 via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-800/80 relative overflow-hidden">
      {/* Decorative gradient ring */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-primary-500/5 via-accent-400/5 to-primary-500/5 blur-3xl" />
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-14 relative">
        {/* Symmetric Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 text-sm">
          
          {/* Brand + Legal - Takes 4 columns */}
          <div className="lg:col-span-4 flex flex-col">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <span className="relative inline-grid place-items-center w-9 h-9 rounded-lg bg-gradient-to-tr from-primary-600 to-accent-500 text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">D</span>
              <span className="text-lg font-semibold tracking-tight text-text-primary dark:text-white">DreamNest</span>
            </Link>
            <p className="text-text-secondary dark:text-slate-300 leading-relaxed mb-4 max-w-sm">
              Mock real estate & services experience. We prototype discovery, trust signals & future AI hooks before connecting real data sources.
            </p>
            <div className="flex items-center gap-3 text-xs text-text-secondary/80 dark:text-slate-400 mb-6">
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.56 2 2.08 6.48 2.08 11.96c0 2.09.68 4.02 1.84 5.6L2 22l4.62-1.88a9.86 9.86 0 0 0 5.42 1.59c5.48 0 9.96-4.48 9.96-9.96S17.52 2 12.04 2Zm0 18.08c-1.84 0-3.54-.58-4.94-1.56l-.35-.25-2.74 1.12.94-2.66-.26-.38a8.13 8.13 0 0 1-1.4-4.52 8.16 8.16 0 0 1 8.19-8.2 8.16 8.16 0 0 1 8.2 8.2 8.16 8.16 0 0 1-8.2 8.25Zm4.47-6.1c-.24-.12-1.4-.68-1.62-.76-.22-.08-.38-.12-.54.12-.16.24-.62.76-.76.92-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.18-1.38-1.32-1.62-.14-.24-.02-.36.1-.48.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.42-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.86.84-.86 2.04 0 1.2.88 2.36 1 .5 1.12.14.14 2.2 1.54 3.08.84.54 1.5.86 2.02 1.1.84.34 1.6.3 2.2.18.68-.1 1.4-.62 1.6-1.22.2-.6.2-1.12.14-1.22-.06-.1-.22-.16-.46-.28Z"/></svg>
                WhatsApp
              </a>
              <a href="mailto:contact@dreamnest.mock" className="hover:text-primary-600 dark:hover:text-primary-300 transition-colors">contact@dreamnest.mock</a>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-medium text-text-secondary/70 dark:text-slate-500">
              <span className="text-text-secondary/60 dark:text-slate-500">© {year} DreamNest</span>
              <Link to="/privacy" className="hover:text-primary-600 dark:hover:text-primary-300 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-primary-600 dark:hover:text-primary-300 transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-primary-600 dark:hover:text-primary-300 transition-colors">Contact</Link>
            </div>
          </div>

          {/* Link Groups - Each takes 2 columns (6 total) */}
          {linkGroups.map(group => (
            <div key={group.title} className="lg:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary/70 dark:text-slate-400 mb-4">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map(l => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="inline-flex items-center gap-1 text-text-secondary dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-300 text-sm transition-colors group"
                    >
                      <span>{l.label}</span>
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"><path fill="currentColor" d="m13.6 17-1.4-1.4 3.6-3.6-3.6-3.6L13.6 7 19 12.4Z"/></svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary/70 dark:text-slate-400 mb-4">Updates</h3>
            <p className="text-text-secondary dark:text-slate-300 text-sm mb-3 leading-relaxed">Get notified when AI valuation or secure payments land (mock form).</p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email address" className="h-10 px-3 rounded-md bg-surface-alt dark:bg-[#1e293b] border border-border/70 dark:border-[#334155] text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/60" />
              <button type="submit" className="h-10 rounded-md bg-gradient-to-r from-primary-600 to-accent-500 text-white text-sm font-medium hover:from-primary-500 hover:to-accent-500 transition-colors">Notify Me</button>
              <span className="text-[11px] text-text-secondary/70 dark:text-slate-400">No spam. Just milestone pings.</span>
            </form>
          </div>
          
        </div>
        {/* Single-row footer achieved by integrating legal links above; removed secondary bar */}
      </div>
    </footer>
  );
}
