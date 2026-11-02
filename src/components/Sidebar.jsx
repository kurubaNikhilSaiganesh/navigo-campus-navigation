import { useContext } from 'react';
import { PanelLeftClose, PanelLeftOpen, X, RefreshCw } from 'lucide-react';
import { AppContext } from '../context/AppContext';

// ── Unique Futuristic High-Craft Icons ─────────────────────────────

const ICONS = {
  // Home: Isometric Campus Command Beacon / Hex Portal with Core
  today: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),
  // Main Block: Architectural Multi-Level Floor Plan
  route: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
      <path d="M15 21V9" />
    </svg>
  ),
  // Campus Directory: Architectural Spatial Blueprint Grid
  directory: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <circle cx="6.5" cy="6.5" r="1" fill="currentColor" />
      <circle cx="17.5" cy="17.5" r="1" fill="currentColor" />
    </svg>
  ),
  // Events: Celestial Supernova Crystalline Flare
  events: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <path d="M12 2l2.2 6.3L20 9l-5 4.2 1.5 6.8L12 16.5l-4.5 3.5 1.5-6.8L4 9l5.8-.7L12 2z" />
      <circle cx="12" cy="11.5" r="1.5" fill="currentColor" />
    </svg>
  ),
  // Notices: Ultrasonic Broadcasting Beacon Tower
  notices: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <path d="M4 11a8 8 0 0 1 16 0c0 4.5 1.5 6 2 7H2c.5-1 2-2.5 2-7z" />
      <path d="M10 21h4" />
      <path d="M12 2v2" />
      <circle cx="12" cy="11" r="1.5" fill="currentColor" />
    </svg>
  ),
  // Timetable: Dual-Orbital Chronometer Dial with Tick Arcs
  timetable: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 6.5v5.5l3.5 2" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M12 2.5v1.5M12 20v1.5M2.5 12H4M20 12h1.5" />
    </svg>
  ),
  // Classes: Cybernetic Holo-Deck Learning Prism
  classes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8M8 11h5" />
    </svg>
  ),
  // Profile: Biometric personal user badge
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  // Faculty: Biometric Leadership Crest with Geometric Shield
  faculty: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  // Rooms: Isometric 3D Architectural Smart Chamber
  rooms: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" />
      <path d="M12 3v18" />
      <path d="M12 12l9-4M12 12l-9-4" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),
  // Exam Schedule: Official Quantum Encrypted Certificate Seal
  exams: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7l-5-5z" />
      <path d="M14 2v5h5" />
      <circle cx="11" cy="14" r="3" />
      <path d="M13 16l3 3" />
    </svg>
  ),
  // Exam Seating: Amphitheater Perspective Seating Matrix
  seating: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <path d="M5 20v-5a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v5" />
      <circle cx="12" cy="6" r="3" />
      <path d="M2 20h20" />
      <circle cx="12" cy="14" r="1.5" fill="currentColor" />
    </svg>
  ),
  // Search: Quantum Lidar Reticle Crosshair Scanner
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
      <path d="M11 7v2M11 13v2M7 11h2M13 11h2" />
    </svg>
  ),
  // Admin Panel: Cyber Master Security Shield & Matrix
  admin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
      <path d="M12 2l8 4v6c0 5.5-3.5 10-8 11-4.5-1-8-5.5-8-11V6l8-4z" />
      <circle cx="12" cy="11" r="2.5" />
      <path d="M12 13.5V17" />
    </svg>
  ),
};

// ── Navigation items (strictly grouped per role requirements) ─────

const getNavGroups = (role) => {
  if (role === 'staff' || role === 'faculty') {
    return [
      {
        label: 'Campus',
        items: [
          { id: 'today', label: 'Home', icon: ICONS.today },
          { id: 'route', label: 'Main Block', icon: ICONS.route },
          { id: 'directory', label: 'Campus Directory', icon: ICONS.directory },
          { id: 'notices', label: 'Notices', icon: ICONS.notices },
        ],
      },
      {
        label: 'Academic Duties',
        items: [
          { id: 'timetable', label: 'My Timetable', icon: ICONS.timetable },
          { id: 'classes', label: 'Classes', icon: ICONS.classes },
          { id: 'rooms', label: 'Assigned Rooms', icon: ICONS.rooms },
        ],
      },
      {
        label: 'Faculty & Account',
        items: [
          { id: 'faculty', label: 'Faculty Directory', icon: ICONS.faculty },
          { id: 'profile', label: 'My Profile', icon: ICONS.profile },
        ],
      },
    ];
  }

  if (role === 'admin') {
    return [
      {
        label: 'Campus',
        items: [
          { id: 'today', label: 'Dashboard', icon: ICONS.today },
          { id: 'route', label: 'Main Block', icon: ICONS.route },
          { id: 'directory', label: 'Campus Directory', icon: ICONS.directory },
          { id: 'events', label: 'Events', icon: ICONS.events },
          { id: 'notices', label: 'Notices', icon: ICONS.notices },
        ],
      },
      {
        label: 'Management',
        items: [
          { id: 'timetable', label: 'Timetables', icon: ICONS.timetable },
          { id: 'classes', label: 'Classes', icon: ICONS.classes },
          { id: 'faculty', label: 'Faculty', icon: ICONS.faculty },
          { id: 'rooms', label: 'Rooms', icon: ICONS.rooms },
        ],
      },
      {
        label: 'Examinations',
        items: [
          { id: 'exams', label: 'Exam Schedule', icon: ICONS.exams },
          { id: 'seating', label: 'Exam Seating', icon: ICONS.seating },
        ],
      },
      {
        label: 'Administration',
        items: [
          { id: 'admin', label: 'Admin Settings', icon: ICONS.admin },
        ],
      },
    ];
  }

  // default: public visitor
  return [
    {
      label: 'Explore',
      items: [
        { id: 'today', label: 'Home', icon: ICONS.today },
        { id: 'route', label: 'Main Block', icon: ICONS.route },
        { id: 'directory', label: 'Campus Directory', icon: ICONS.directory },
        { id: 'events', label: 'Events', icon: ICONS.events },
        { id: 'notices', label: 'Notices', icon: ICONS.notices },
      ],
    },
    {
      label: 'Campus Info',
      items: [
        { id: 'timetable', label: 'Timetable', icon: ICONS.timetable },
        { id: 'classes', label: 'Classes', icon: ICONS.classes },
        { id: 'faculty', label: 'Faculty Directory', icon: ICONS.faculty },
        { id: 'rooms', label: 'Rooms', icon: ICONS.rooms },
      ],
    },
  ];
};

// ── SidebarContent ───────────────────────────────────────────────

function SidebarContent({
  activeView,
  setActiveView,
  isMobile,
  onClose,
  onCollapse,
  role,
}) {
  const {
    loginDemo,
    logoutDemo,
    setLoginModalOpen,
    authUser,
  } = useContext(AppContext);

  const displayName = authUser?.name || (role === 'staff' || role === 'faculty' ? 'Dr. Priya Sharma' : role === 'admin' ? 'Administrator' : 'Campus Visitor');
  const displayRole = authUser ? (authUser.role === 'staff' ? 'Faculty / Staff' : 'System Admin') : (role === 'staff' || role === 'faculty' ? 'Faculty · CSE' : role === 'admin' ? 'System Administrator' : 'Public Access');
  const userInitials = authUser?.initials || (role === 'staff' || role === 'faculty' ? 'PS' : role === 'admin' ? 'AD' : 'CV');

  return (
    <div className="flex flex-col h-full select-none">
      {/* Header — Logo + Hide / Close Controls */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-[var(--sidebar-border)]">
        <button
          onClick={() => {
            setActiveView('today');
            if (isMobile && onClose) onClose();
          }}
          className="flex items-center gap-3 text-left group transition-transform hover:scale-102 focus:outline-none"
          aria-label="Go to Meridian Campus Guide Homepage"
        >
          <div className="w-9 h-9 shrink-0 navigo-sphere-icon group-hover:scale-105 transition-all">
            <span className="navigo-sphere-letter text-[15px]">N</span>
          </div>
          <div>
            <p className="font-mono text-[9px] font-bold leading-tight text-[var(--sidebar-text)] tracking-widest uppercase group-hover:text-[var(--gold)] transition-colors">
              NaviGO
            </p>
            <p className="font-mono text-[8px] font-semibold leading-tight text-[var(--sidebar-text)] tracking-wider opacity-60">
              CAMPUS GUIDE
            </p>
          </div>
        </button>

        {/* Hide control panel button (Desktop collapse / Mobile close) */}
        <div className="flex items-center gap-1">
          {isMobile ? (
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-full glass-btn glass-btn-ghost transition-all hover:scale-105"
              onClick={onClose}
              aria-label="Close navigation panel"
              title="Close panel"
            >
              <X size={15} />
              <span className="text-[11px] font-semibold">Close</span>
            </button>
          ) : (
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-btn glass-btn-ghost transition-all duration-200 hover:scale-105 hover:bg-[var(--sidebar-surface)] text-[var(--sidebar-text-active)] hover:text-[var(--gold)]"
              onClick={onCollapse}
              aria-label="Hide control panel"
              title="Hide control panel"
            >
              <PanelLeftClose size={15} />
              <span className="text-[11px] font-bold tracking-wide">Hide</span>
            </button>
          )}
        </div>
      </div>

      {/* Nav groups — Clean, Gap-Free, Smooth Scrollable Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-3.5 pt-2 pb-6 space-y-4 scrollbar-thin select-none relative"
        aria-label="Primary navigation"
        onKeyDown={(e) => {
          if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;
          e.preventDefault();
          const allBtns = Array.from(e.currentTarget.querySelectorAll('button[data-id]'));
          const idx = allBtns.indexOf(document.activeElement);
          if (idx === -1) { allBtns[0]?.focus(); return; }
          const next = e.key === 'ArrowDown' ? allBtns[idx + 1] : allBtns[idx - 1];
          next?.focus();
        }}
      >
        {getNavGroups(role).map((group) => (
          <div key={group.label}>
            <p className="nav-section-label select-none">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = activeView === item.id;

                return (
                  <button
                    key={item.id}
                    data-id={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      if (isMobile && onClose) onClose();
                    }}
                    className={`w-full group flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-200 text-left relative ${
                      isActive
                        ? 'bg-[var(--gold)]/15 dark:bg-[var(--gold)]/20 border border-[var(--gold)]/35 text-[var(--sidebar-text-active)] font-bold shadow-xs'
                        : 'border border-transparent text-[var(--sidebar-text)] hover:text-[var(--sidebar-text-active)] hover:bg-black/5 dark:hover:bg-white/5 font-medium'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span
                      className="nav-icon transition-transform duration-200 group-hover:scale-110 shrink-0"
                      style={{
                        color: isActive ? 'var(--gold)' : 'currentColor',
                        filter: isActive ? 'drop-shadow(0 0 6px var(--gold))' : 'none',
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="text-[13px] tracking-tight">{item.label}</span>
                    {isActive && (
                      <span
                        className="ml-auto w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px_var(--gold)]"
                        style={{ background: 'var(--gold)' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User profile pill with live authentication display & demo triggers */}
      <div className="px-4 py-3.5 border-t border-[var(--sidebar-border)]">
        <div className="flex items-center justify-between p-1.5 rounded-xl bg-[rgba(255,255,255,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[var(--sidebar-border)]">
          <button
            onClick={() => {
              if (authUser) {
                setActiveView('profile');
              } else {
                setLoginModalOpen(true);
              }
              if (isMobile && onClose) onClose();
            }}
            className="flex items-center gap-2.5 min-w-0 flex-1 text-left hover:opacity-85 transition-opacity"
            title={authUser ? 'Open My Profile' : 'Sign in to Portal'}
          >
            <div
              className="w-8 h-8 flex items-center justify-center text-[11px] font-bold font-mono shrink-0 rounded-full shadow-sm"
              style={{
                background: (authUser?.role === 'staff' || role === 'staff' || role === 'faculty')
                  ? 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)'
                  : (authUser?.role === 'admin' || role === 'admin')
                    ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                    : 'var(--gold)',
                color: '#ffffff',
              }}
            >
              {userInitials}
            </div>
            <div className="overflow-hidden min-w-0 pr-1">
              <p className="text-[12px] font-semibold text-[var(--sidebar-text-active)] truncate leading-tight">
                {displayName}
              </p>
              <p className="font-mono text-[8.5px] truncate uppercase tracking-wider text-[var(--sidebar-text)]">
                {displayRole}
              </p>
            </div>
          </button>

          {/* Role cycle switch — compact icon-only button */}
          <div className="shrink-0 pl-1">
            <button
              onClick={() => {
                if (!authUser) {
                  loginDemo('faculty@meridian.demo', 'faculty123');
                } else if (authUser.role === 'staff') {
                  loginDemo('admin@meridian.demo', 'admin123');
                } else {
                  logoutDemo();
                }
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                background: !authUser
                  ? 'rgba(0,122,255,0.12)'
                  : authUser.role === 'admin'
                    ? 'rgba(239,68,68,0.15)'
                    : 'rgba(139,92,246,0.15)',
                border: `1.5px solid ${!authUser ? 'rgba(0,122,255,0.35)' : authUser.role === 'admin' ? 'rgba(239,68,68,0.4)' : 'rgba(139,92,246,0.4)'}`,
                color: !authUser ? 'var(--gold)' : authUser.role === 'admin' ? '#EF4444' : '#8B5CF6',
              }}
              title={!authUser ? 'Switch to Faculty Demo' : authUser.role === 'staff' ? 'Switch to Admin Demo' : 'Sign Out to Visitor Mode'}
              aria-label="Switch account role"
            >
              <RefreshCw size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar (export) ──────────────────────────────────────────────

export default function Sidebar({
  activeView,
  setActiveView,
  mobileMenuOpen,
  setMobileMenuOpen,
  collapsed = false,
  setCollapsed = () => {},
}) {
  const { userRole: role } = useContext(AppContext);

  return (
    <>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden transition-opacity duration-300"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer — floating curved glass sheet */}
      {mobileMenuOpen && (
        <aside
          className="fixed top-3 left-3 bottom-3 w-[min(290px,calc(100vw-24px))] flex flex-col z-50 curved-control-panel sidebar-mobile lg:hidden shadow-2xl overflow-hidden"
          aria-label="Mobile navigation"
        >
          <SidebarContent
            activeView={activeView}
            setActiveView={(v) => { setActiveView(v); setMobileMenuOpen(false); }}
            isMobile={true}
            onClose={() => setMobileMenuOpen(false)}
            onCollapse={null}
            role={role}
          />
        </aside>
      )}

      {/* Desktop sidebar — floating curved glass control panel */}
      {!collapsed && (
        <aside
          className="hidden lg:flex flex-col w-[264px] my-3 ml-3 h-[calc(100vh-24px)] shrink-0 z-30 curved-control-panel overflow-hidden"
          aria-label="Primary navigation"
        >
          <SidebarContent
            activeView={activeView}
            setActiveView={setActiveView}
            isMobile={false}
            onClose={null}
            onCollapse={() => setCollapsed(true)}
            role={role}
          />
        </aside>
      )}

      {/* Desktop sidebar — when collapsed, show floating button at same top weight */}
      {collapsed && (
        <div className="hidden lg:block my-3 ml-3 shrink-0 z-30 select-none">
          <button
            onClick={() => setCollapsed(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl curved-control-panel hover:scale-105 transition-all text-xs font-bold text-[var(--sidebar-text-active)] hover:text-[var(--gold)] shadow-xl cursor-pointer group"
            title="Open control panel"
            aria-label="Open control panel"
          >
            <PanelLeftOpen size={16} className="text-[var(--gold)] group-hover:scale-110 transition-transform" />
            <span className="font-display font-black text-sm tracking-tight">NaviGO</span>
            <span className="font-mono text-[9px] text-[var(--sidebar-text)] font-semibold tracking-wider uppercase">Menu</span>
          </button>
        </div>
      )}
    </>
  );
}
