// MobileNav — floating bottom navigation bar for mobile (≤1024px)

import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const MOBILE_TABS = [
  {
    id: 'today',
    label: 'Home',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: 'route',
    label: 'Main Block',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18"/>
        <path d="M9 21V9"/>
        <path d="M15 21V9"/>
      </svg>
    ),
  },
  {
    id: 'directory',
    label: 'Directory',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'timetable',
    label: 'Schedule',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    id: 'search',
    label: 'Search',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
  },
];

export default function MobileNav() {
  const { activeView, navigateTo } = useContext(AppContext);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
      aria-label="Mobile navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div
        className="mx-3 mb-3 flex items-center justify-around py-2 px-1"
        style={{
          background: 'var(--glass-4)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid var(--glass-border-strong)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {MOBILE_TABS.map((tab) => {
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigateTo(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={tab.label}
              className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[56px]"
              style={{
                background: isActive ? 'var(--gold-light)' : 'transparent',
                color: isActive ? 'var(--gold)' : 'var(--text-muted)',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <span
                style={{ color: isActive ? 'var(--gold)' : 'var(--text-muted)' }}
              >
                {tab.icon}
              </span>
              <span
                className="text-[10px] font-semibold leading-none"
                style={{ color: isActive ? 'var(--gold)' : 'var(--text-muted)' }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

