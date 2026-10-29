// TopBar — persistent glassy top navigation bar with blur
// Always renders as a frosted glass surface; deepens on scroll

import { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, Sun, Moon, Menu, X, ArrowRight, Building2 } from 'lucide-react';
import { BUILDINGS, ROOMS, FACULTY, MAIN_BLOCK_ROOMS } from '../data';

const VIEW_LABELS = {
  today: 'Home', route: 'Main Block', mainblock: 'Main Block', 'main-block': 'Main Block', directory: 'Campus Directory',
  events: 'Events', notices: 'Notices', timetable: 'Timetable',
  classes: 'Classes', faculty: 'Faculty Directory', rooms: 'Rooms',
  exams: 'Examinations', seating: 'Exam Seating',
  admin: 'Admin Panel', profile: 'My Profile', search: 'Search',
};

const VIEW_ICONS = {
  today:     '🏠', route:    '🏛️', mainblock: '🏛️', directory: '🏛️',
  events:    '🎟️', notices: '📢', timetable: '🕐',
  classes:   '📚', faculty: '👥', rooms:      '🚪',
  exams:     '📝', seating: '📍',
  admin:     '🛡️', profile:  '👤',
};

// Compact index for TopBar quick search
const QUICK_ITEMS = [
  ...MAIN_BLOCK_ROOMS.map((r) => ({
    id: r.id,
    title: r.name,
    subtitle: `Main Block · Floor ${r.floor} · ${r.category}`,
    type: 'main_block_room',
    tag: r.category.toUpperCase(),
    roomId: r.id,
  })),
  ...BUILDINGS.map((b) => ({
    id: b.id,
    title: b.label,
    subtitle: `${b.code} · ${b.department}`,
    type: 'building',
    tag: b.type.toUpperCase(),
    buildingId: b.id,
  })),
  ...ROOMS.slice(0, 10).map((r) => ({
    id: r.id,
    title: `Room ${r.number}`,
    subtitle: `${r.building} · ${r.type}`,
    type: 'room',
    tag: 'ROOM',
    buildingId: r.buildingId,
  })),
  ...FACULTY.slice(0, 10).map((f) => ({
    id: f.id,
    title: f.name,
    subtitle: `${f.designation} · ${f.department}`,
    type: 'faculty',
    tag: 'FACULTY',
    buildingId: f.buildingId,
  })),
];

export default function TopBar({
  activeView,
  theme,
  toggleTheme,
  onMenuOpen,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [topSearch, setTopSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileSearchExpanded, setMobileSearchExpanded] = useState(false);
  const { setActiveView, locateOnMap } = useContext(AppContext);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const container = document.getElementById('main-scroll');
    if (!container) return;
    const handler = () => setScrolled(container.scrollTop > 10);
    container.addEventListener('scroll', handler, { passive: true });
    return () => container.removeEventListener('scroll', handler);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const label = VIEW_LABELS[activeView] || activeView;
  const icon  = VIEW_ICONS[activeView]  || '';

  // Filter items for quick dropdown
  const filteredQuick = topSearch.trim()
    ? QUICK_ITEMS.filter((item) =>
        item.title.toLowerCase().includes(topSearch.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(topSearch.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (topSearch.trim()) {
      setActiveView('search');
      setShowDropdown(false);
    }
  };

  const handleSelectItem = (item) => {
    if (item.roomId) {
      locateOnMap(item.roomId);
    } else if (item.buildingId) {
      locateOnMap(item.buildingId);
    } else {
      setActiveView('directory');
    }
    setTopSearch('');
    setShowDropdown(false);
    setMobileSearchExpanded(false);
  };

  return (
    <header className="sticky top-0 z-20 px-3 md:px-5 pt-3 pb-1.5 shrink-0 pointer-events-none">
      <div
        id="top-bar"
        className="pointer-events-auto flex items-center justify-between px-4 md:px-5 h-12 md:h-13 rounded-xl transition-all duration-300"
        style={{
          background: scrolled ? 'var(--glass-4)' : 'var(--glass-2)',
          backdropFilter: scrolled ? 'blur(12px)' : 'blur(8px)',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'blur(8px)',
          border: `1px solid ${scrolled ? 'var(--glass-border-strong)' : 'var(--glass-border)'}`,
          boxShadow: scrolled ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        }}
      >
        {/* Left — Mobile hamburger + breadcrumb (Hide button removed from here) */}
        <div className="flex items-center gap-2.5">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-btn glass-btn-ghost text-xs font-semibold"
            onClick={onMenuOpen}
            aria-label="Open navigation menu"
          >
            <Menu size={16} />
            <span className="text-[11px] font-semibold">Menu</span>
          </button>

          {/* Clean Breadcrumb */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('today')}
              className="flex items-center gap-1.5 font-display font-black text-sm tracking-tight transition-all hover:opacity-80 hover:scale-105"
              style={{ color: 'var(--gold)' }}
              aria-label="Go to NaviGO Home"
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[11px] font-black shadow-sm" style={{ background: 'linear-gradient(135deg, #007AFF 0%, #34C759 100%)' }}>N</span>
              NaviGO
            </button>

            {activeView !== 'today' && (
              <>
                <span style={{ color: 'var(--text-subtle)' }} className="text-xs select-none">/</span>
                <div className="flex items-center gap-1.5">
                  {icon && (
                    <span className="text-sm leading-none" aria-hidden="true">{icon}</span>
                  )}
                  <span
                    className="text-sm font-semibold tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {label}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right — Live interactive search box + theme toggle */}
        <div className="flex items-center gap-2" ref={searchContainerRef}>
          {/* Desktop live interactive search box */}
          <div className="relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search
                size={14}
                className="absolute left-3.5 text-[var(--text-muted)] pointer-events-none select-none transition-colors"
              />
              <input
                type="text"
                value={topSearch}
                onChange={(e) => {
                  setTopSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => {
                  if (topSearch.trim()) setShowDropdown(true);
                }}
                placeholder="Search campus, rooms, faculty…"
                className="rounded-lg pl-9 pr-4 py-1.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,255,255,0.06)] border border-[var(--glass-border)] outline-none w-52 focus:w-72 transition-all duration-300 focus:border-[var(--gold)]/60 focus:bg-[var(--glass-3)] shadow-inner"
                aria-label="Search campus data"
              />
              {topSearch ? (
                <button
                  type="button"
                  onClick={() => { setTopSearch(''); setShowDropdown(false); }}
                  className="absolute right-2.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-0.5"
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              ) : null}
            </form>

            {/* Instant live results dropdown under right-side search box */}
            {showDropdown && filteredQuick.length > 0 && (
              <div
                className="absolute right-0 top-full mt-2 w-80 rounded-xl glass-modal border border-[var(--glass-border-strong)] p-2 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in duration-150"
                style={{ background: 'var(--glass-4)' }}
              >
                <div className="px-2.5 py-1 flex items-center justify-between border-b border-[var(--glass-border)] pb-1.5 mb-1">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                    Live Matches
                  </span>
                  <span className="font-mono text-[9px] text-[var(--gold)]">
                    {filteredQuick.length} found
                  </span>
                </div>
                <div className="space-y-1">
                  {filteredQuick.map((item) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleSelectItem(item)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left hover:bg-[var(--glass-2)] transition-colors group"
                    >
                      <div className="w-6 h-6 rounded-md flex items-center justify-center bg-[var(--glass-2)] border border-[var(--glass-border)] text-[var(--gold)] shrink-0">
                        <Building2 size={11} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--gold)] transition-colors">
                          {item.title}
                        </p>
                        <p className="font-mono text-[9px] text-[var(--text-muted)] truncate">
                          {item.subtitle}
                        </p>
                      </div>
                      <ArrowRight size={11} className="text-[var(--text-subtle)] group-hover:text-[var(--text-primary)] shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSearchSubmit}
                  className="w-full mt-1.5 pt-1.5 border-t border-[var(--glass-border)] text-center text-[10.5px] font-semibold text-[var(--gold)] hover:underline block"
                >
                  View all results in Search page →
                </button>
              </div>
            )}
          </div>

          {/* Mobile search toggle */}
          <button
            onClick={() => setMobileSearchExpanded(!mobileSearchExpanded)}
            className="md:hidden glass-btn glass-btn-ghost glass-btn-icon rounded-lg"
            aria-label="Toggle mobile search"
          >
            <Search size={16} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="glass-btn glass-btn-ghost glass-btn-icon rounded-lg transition-transform hover:rotate-12"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'dark'
              ? <Sun size={16} style={{ color: 'var(--gold)' }} />
              : <Moon size={16} style={{ color: 'var(--text-secondary)' }} />
            }
          </button>
        </div>
      </div>

      {/* Mobile expanded search input drawer */}
      {mobileSearchExpanded && (
        <div className="md:hidden pointer-events-auto mt-2 px-1">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 p-1.5 rounded-xl glass-modal border border-[var(--glass-border-strong)] shadow-lg"
          >
            <Search size={15} className="ml-3 text-[var(--text-muted)] shrink-0" />
            <input
              type="text"
              autoFocus
              value={topSearch}
              onChange={(e) => setTopSearch(e.target.value)}
              placeholder="Search campus, rooms, faculty…"
              className="flex-1 text-xs bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none py-1.5"
            />
            {topSearch && (
              <button
                type="button"
                onClick={() => setTopSearch('')}
                className="p-1 text-[var(--text-muted)]"
              >
                <X size={13} />
              </button>
            )}
            <button
              type="submit"
              className="px-3 py-1 rounded-lg text-xs font-bold bg-[var(--gold)] text-[#111]"
            >
              Go
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
