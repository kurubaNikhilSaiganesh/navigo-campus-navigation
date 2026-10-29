import { useContext, useState } from 'react';
import { Search, Sun, Moon, Menu, X, Map, CalendarDays, Activity } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function Navbar() {
  const { theme, toggleTheme, setCmdOpen } = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const isDark = theme === 'dark';
  const navBg = isDark ? '#0F0F0F' : '#F4F1E8';
  const navBorder = isDark ? '#F4F1E8' : '#111111';

  return (
    <header className="sticky top-0 z-50" style={{ background: navBg, borderBottom: `4px solid ${navBorder}` }}>

      {/* ── Main bar ── */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-[60px] gap-2">

        {/* ── LEFT: NaviGO Logo Image (transparent PNG) ── */}
        <a
          href={import.meta.env.BASE_URL}
          className="flex items-center flex-shrink-0 group"
          aria-label="NaviGO Campus Navigation home"
          style={{ textDecoration: 'none' }}
        >
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="NaviGO — Navigation | Exploration | System"
            className="transition-transform group-hover:scale-95"
            style={{
              height: '52px',
              width: 'auto',
              maxWidth: '170px',
              objectFit: 'contain',
              display: 'block',
              filter: isDark ? 'brightness(1.1) drop-shadow(0 0 8px rgba(199,240,0,0.25))' : 'none',
            }}
          />
        </a>

        {/* ── CENTER: Status strip (xl screens only) ── */}
        <div className="hidden xl:flex items-center gap-2 font-mono text-xs flex-1 justify-center">
          <span className="status-dot inline-block w-1.5 h-1.5 flex-shrink-0" />
          <span className="tracking-[0.12em] whitespace-nowrap" style={{ color: isDark ? '#00D9FF' : '#3157FF', opacity: 0.8 }}>
            STATUS: ONLINE · 2D_SVG_ENGINE
          </span>
          <Activity size={10} style={{ color: isDark ? '#00D9FF' : '#3157FF', opacity: 0.5 }} />
        </div>

        {/* ── RIGHT: Action Buttons ── */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Search — always visible */}
          <button
            onClick={() => setCmdOpen(true)}
            aria-label="Search campus (Ctrl+K)"
            className="btn-brutal flex items-center gap-1.5 py-2 px-2.5 sm:px-3"
            style={{ background: '#3157FF', color: '#FFFFFF', borderColor: '#111111' }}
          >
            <Search size={14} strokeWidth={2.5} />
            <span className="font-mono text-[11px] tracking-wider hidden sm:block">SEARCH</span>
            <kbd className="font-mono px-1.5 py-0.5 text-[9px] leading-none hidden md:block" style={{ background: '#C7F000', color: '#111111' }}>
              CTRL+K
            </kbd>
          </button>

          {/* MAP link — md and above */}
          <NavDesktopLink href="#nav-engine" label="MAP" icon={<Map size={13} strokeWidth={2.5} />} />

          {/* EVENTS link — md and above */}
          <NavDesktopLink href="#events" label="EVENTS" icon={<CalendarDays size={13} strokeWidth={2.5} />} />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="btn-brutal flex items-center gap-1.5 py-2 px-2.5"
          >
            {isDark
              ? <><Sun size={14} strokeWidth={2.5} /><span className="font-mono text-[11px] tracking-wider hidden sm:block">LIGHT</span></>
              : <><Moon size={14} strokeWidth={2.5} /><span className="font-mono text-[11px] tracking-wider hidden sm:block">DARK</span></>
            }
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="btn-brutal flex items-center gap-1 py-2 px-2.5 md:hidden"
          >
            {menuOpen
              ? <X size={16} strokeWidth={2.5} />
              : <Menu size={16} strokeWidth={2.5} />
            }
          </button>
        </div>
      </div>

      {/* ── Mobile slide-down menu ── */}
      {menuOpen && (
        <div className="md:hidden border-t-4" style={{ borderColor: navBorder, background: isDark ? '#161616' : '#E8E5DC' }}>
          {/* Status strip */}
          <div className="flex items-center gap-2.5 px-5 py-3 border-b-2" style={{ borderColor: isDark ? '#2A2A2A' : '#D0CEC5' }}>
            <span className="status-dot inline-block w-1.5 h-1.5" />
            <span className="font-mono text-[11px] tracking-wider" style={{ color: isDark ? '#00D9FF' : '#3157FF', opacity: 0.8 }}>STATUS: ONLINE · 2D_SVG_ENGINE</span>
          </div>

          {/* Menu items */}
          <nav className="flex flex-col divide-y-2" style={{ '--tw-divide-opacity': 1 }}>
            <button
              onClick={() => { setCmdOpen(true); setMenuOpen(false); }}
              className="flex items-center gap-3 px-5 py-4 font-mono text-sm tracking-wider text-left transition-colors"
              style={{ color: 'var(--fg)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#3157FF'; e.currentTarget.style.color = '#FFF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg)'; }}
            >
              <Search size={15} strokeWidth={2} />
              <span>SEARCH CAMPUS</span>
              <kbd className="ml-auto font-mono text-xs border-2 px-1.5 py-0.5" style={{ borderColor: 'currentColor' }}>CTRL+K</kbd>
            </button>
            <a
              href="#nav-engine"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-5 py-4 font-mono text-sm tracking-wider transition-colors"
              style={{ color: 'var(--fg)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#C7F000'; e.currentTarget.style.color = '#111'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg)'; }}
            >
              <Map size={15} strokeWidth={2} />
              <span>CAMPUS MAP</span>
            </a>
            <a
              href="#events"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-5 py-4 font-mono text-sm tracking-wider transition-colors"
              style={{ color: 'var(--fg)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#C7F000'; e.currentTarget.style.color = '#111'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg)'; }}
            >
              <CalendarDays size={15} strokeWidth={2} />
              <span>EVENTS &amp; BULLETIN</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

// ── Desktop-only nav link (hidden below md via CSS class) ───
function NavDesktopLink({ href, label, icon }) {
  return (
    <a
      href={href}
      aria-label={`Go to ${label}`}
      className="nav-desktop-link btn-brutal gap-1.5 py-2 px-2.5 lg:px-3 text-xs"
    >
      {icon}
      <span className="font-mono text-[11px] tracking-wider hidden lg:block">{label}</span>
    </a>
  );
}

