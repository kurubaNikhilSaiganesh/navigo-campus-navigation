import { useState, useEffect, useCallback } from 'react';
import {
  findPath,
  getBuildingById,
  calcRouteStats,
  EVENTS as INITIAL_EVENTS,
  CLASSES as INITIAL_CLASSES,
  FACULTY as INITIAL_FACULTY,
  TIMETABLE as INITIAL_TIMETABLE,
  MARQUEE_ITEMS,
} from './data';
import { parseTimetableCSV, parseEventsCSV, parseNoticesCSV } from './lib/csvHelper';
import { useTheme } from './hooks/useTheme';
import { AppContext } from './context/AppContext';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MobileNav from './components/MobileNav';
import DashboardView from './components/DashboardView';
import DirectoryView from './components/DirectoryView';
import MainBlockView from './components/MainBlockView';
import CommandPalette from './components/CommandPalette';
import EventsSection from './components/EventsSection';
import TimetableView from './components/TimetableView';
import ClassesView from './components/ClassesView';
import FacultyView from './components/FacultyView';
import RoomsView from './components/RoomsView';
import AdminView from './components/AdminView';
import RegisterModal from './components/RegisterModal';
import ExamsView from './components/ExamsView';
import SeatingView from './components/SeatingView';
import SearchView from './components/SearchView';
import NoticesView from './components/NoticesView';
import ProfileView from './components/ProfileView';
import DemoLoginModal from './components/DemoLoginModal';
import { AlertTriangle, Home, ShieldAlert, X } from 'lucide-react';

const VALID_VIEWS = [
  'today', 'route', 'mainblock', 'main-block', 'directory', 'events', 'timetable',
  'classes', 'faculty', 'rooms', 'exams', 'seating',
  'notices', 'search', 'admin', 'profile'
];

function getInitialView() {
  if (typeof window === 'undefined') return 'today';
  const hash = window.location.hash.replace('#', '').trim().toLowerCase();
  if (!hash) return 'today';
  return VALID_VIEWS.includes(hash) ? hash : 'not-found';
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState(getInitialView);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState(() => {
    try {
      const saved = localStorage.getItem('alts_user_role');
      return saved || 'public';
    } catch {
      return 'public';
    }
  });
  const [authUser, setAuthUser] = useState(() => {
    try {
      const saved = localStorage.getItem('alts_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Faculty list with local persistence and sync with profile
  const [facultyList, setFacultyList] = useState(() => {
    try {
      const saved = localStorage.getItem('alts_faculty_list_2026');
      if (saved) return JSON.parse(saved);
      // Clean legacy cache to ensure latest faculty list loads
      localStorage.removeItem('alts_faculty_list');
      return INITIAL_FACULTY;
    } catch {
      return INITIAL_FACULTY;
    }
  });

  const loginDemo = useCallback((email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (cleanEmail === 'faculty@meridian.demo' && cleanPass === 'faculty123') {
      const user = {
        id: 'fac_demo',
        facultyId: 'fac_004',
        name: 'Dr. Priya Sharma',
        email: 'faculty@meridian.demo',
        role: 'staff',
        initials: 'PS',
        designation: 'Professor',
        department: 'Computer Science',
      };
      setAuthUser(user);
      setUserRole('staff');
      try {
        localStorage.setItem('alts_auth_user', JSON.stringify(user));
        localStorage.setItem('alts_user_role', 'staff');
      } catch { /* ignore */ }
      window.location.hash = 'profile';
      setActiveView('profile');
      return { success: true, user };
    }

    if (cleanEmail === 'admin@meridian.demo' && cleanPass === 'admin123') {
      const user = {
        id: 'admin_demo',
        name: 'Administrator',
        email: 'admin@meridian.demo',
        role: 'admin',
        initials: 'AD',
        designation: 'System Administrator',
        department: 'Administration',
      };
      setAuthUser(user);
      setUserRole('admin');
      try {
        localStorage.setItem('alts_auth_user', JSON.stringify(user));
        localStorage.setItem('alts_user_role', 'admin');
      } catch { /* ignore */ }
      window.location.hash = 'today';
      setActiveView('today');
      return { success: true, user };
    }

    return {
      success: false,
      error: 'Invalid credentials. Please use faculty@meridian.demo / faculty123 or admin@meridian.demo / admin123',
    };
  }, []);

  const logoutDemo = useCallback(() => {
    setAuthUser(null);
    setUserRole('public');
    try {
      localStorage.removeItem('alts_auth_user');
      localStorage.setItem('alts_user_role', 'public');
    } catch { /* ignore */ }
    window.location.hash = 'today';
    setActiveView('today');
  }, []);

  const updateFacultyProfile = useCallback((updatedData) => {
    setFacultyList((prev) => {
      const targetId = updatedData.id || authUser?.facultyId || 'fac_004';
      const next = prev.map((f) => (f.id === targetId ? { ...f, ...updatedData } : f));
      try {
        localStorage.setItem('alts_faculty_list', JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });

    if (authUser && updatedData.name) {
      setAuthUser((prev) => {
        if (!prev) return prev;
        const nextUser = {
          ...prev,
          name: updatedData.name,
          email: updatedData.email || prev.email,
          initials: updatedData.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
        };
        try {
          localStorage.setItem('alts_auth_user', JSON.stringify(nextUser));
        } catch { /* ignore */ }
        return nextUser;
      });
    }
  }, [authUser]);

  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedMainBlockRoomId, setSelectedMainBlockRoomId] = useState(null);
  const [fromNode, setFromNode] = useState('');
  const [toNode, setToNode] = useState('');
  const [activeRoute, setActiveRoute] = useState(null);
  const [routeStats, setRouteStats] = useState(null);
  const [activeZoneFilter, setActiveZoneFilter] = useState('all');
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 800, h: 600 });
  const [cmdOpen, setCmdOpen] = useState(false);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [registerModal, setRegisterModal] = useState(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  // Shared data state — with offline safety fallback & localStorage persistence
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('alts_custom_events_2026');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem('alts_custom_announcements_2026');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });
  const [roomOverrides, setRoomOverrides] = useState({});
  const [timetableOverrides, setTimetableOverrides] = useState({});
  const [locationStatus, setLocationStatus] = useState({}); // { [buildingId]: 'closed' | 'active' }

  // Standalone offline data mode (fetches local backend only if run locally in dev mode)
  useEffect(() => {
    if (typeof window === 'undefined' || window.location.hostname !== 'localhost') {
      return;
    }
    const controller = new AbortController();
    fetch('http://localhost:5000/api/events', { signal: controller.signal })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data && data.length) setEvents(data); })
      .catch(() => { /* Safe fallback to local data */ });

    fetch('http://localhost:5000/api/classes', { signal: controller.signal })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data && data.length) setClasses(data); })
      .catch(() => { /* Safe fallback to local data */ });

    return () => controller.abort();
  }, []);

  // Sync hash routing & browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim().toLowerCase();
      if (!hash) {
        setActiveView('today');
      } else if (VALID_VIEWS.includes(hash)) {
        setActiveView(hash);
      } else {
        setActiveView('not-found');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle ALTS custom navigation events
  useEffect(() => {
    const handler = (e) => {
      if (e.detail) navigateTo(e.detail);
    };
    window.addEventListener('alts-navigate', handler);
    return () => window.removeEventListener('alts-navigate', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // ⌘K / Ctrl+K and Escape
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (userRole !== 'staff') setCmdOpen(true);
      }
      if (e.key === 'Escape') {
        setCmdOpen(false);
        setRegisterModal(null);
        setMobileMenuOpen(false);
        setFeedbackModalOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [userRole]);

  const [hasCustomNotices, setHasCustomNotices] = useState(() => {
    try {
      return Boolean(localStorage.getItem('alts_custom_announcements_2026'));
    } catch {
      return false;
    }
  });

  const addAnnouncement = useCallback((text, severity = 'NOTICE') => {
    const id = `ann_${Date.now()}`;
    const newNotice = { id, text, severity, timestamp: new Date().toISOString() };
    setAnnouncements((prev) => {
      const next = [newNotice, ...prev];
      try { localStorage.setItem('alts_custom_announcements_2026', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
    setHasCustomNotices(true);
    return id;
  }, []);

  const removeAnnouncement = useCallback((id) => {
    setAnnouncements((prev) => {
      const next = prev.filter((a) => a.id !== id);
      try { localStorage.setItem('alts_custom_announcements_2026', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const updateNoticesFromCSV = useCallback((csvText) => {
    const parsed = parseNoticesCSV(csvText);
    if (parsed && parsed.length > 0) {
      setAnnouncements((prev) => {
        const next = [...parsed, ...prev];
        try { localStorage.setItem('alts_custom_announcements_2026', JSON.stringify(next)); } catch { /* ignore */ }
        return next;
      });
      setHasCustomNotices(true);
      return { success: true, count: parsed.length };
    }
    return { success: false, error: 'Invalid CSV format for notices. Columns: Notice Text, Severity, Date.' };
  }, []);

  const resetNoticesToDefault = useCallback(() => {
    setAnnouncements([]);
    setHasCustomNotices(false);
    try { localStorage.removeItem('alts_custom_announcements_2026'); } catch { /* ignore */ }
  }, []);

  // Dynamic Events support
  const [hasCustomEvents, setHasCustomEvents] = useState(() => {
    try {
      return Boolean(localStorage.getItem('alts_custom_events_2026'));
    } catch {
      return false;
    }
  });

  const addEvent = useCallback((eventData) => {
    const newEvent = {
      id: `ev_${Date.now()}`,
      title: (eventData.title || 'New Event').toUpperCase(),
      category: (eventData.category || 'COMPETITION').toUpperCase().replace(/\s+/g, '_'),
      date: eventData.date || '2026.10.31',
      time: eventData.time || '09:30 AM',
      venue: eventData.venue || 'auditorium',
      venueName: (eventData.venueName || 'AUDITORIUM & CSE LABS').toUpperCase(),
      description: eventData.description || 'Campus event announcement and showcase.',
      organizer: eventData.organizer || 'College Management',
      status: 'UPCOMING',
      tag: eventData.tag || (eventData.date === '2026.10.31' ? 'TOMORROW' : ''),
      span: 'medium',
    };
    setEvents((prev) => {
      const next = [newEvent, ...prev];
      try { localStorage.setItem('alts_custom_events_2026', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
    setHasCustomEvents(true);
    return newEvent;
  }, []);

  const updateEventsFromCSV = useCallback((csvText) => {
    const parsed = parseEventsCSV(csvText);
    if (parsed && parsed.length > 0) {
      setEvents((prev) => {
        const existingTitles = new Set(parsed.map((p) => p.title.toLowerCase()));
        const remaining = prev.filter((p) => !existingTitles.has(p.title.toLowerCase()));
        const next = [...parsed, ...remaining];
        try { localStorage.setItem('alts_custom_events_2026', JSON.stringify(next)); } catch { /* ignore */ }
        return next;
      });
      setHasCustomEvents(true);
      return { success: true, count: parsed.length };
    }
    return { success: false, error: 'Invalid CSV format for events. Columns: Title, Category, Date, Time, Venue, Description, Organizer.' };
  }, []);

  const resetEventsToDefault = useCallback(() => {
    setEvents(INITIAL_EVENTS);
    setHasCustomEvents(false);
    try { localStorage.removeItem('alts_custom_events_2026'); } catch { /* ignore */ }
  }, []);

  // Dynamic CSV Timetable support (allows non-programmers to edit and upload CSV)
  const [timetableData, setTimetableData] = useState(() => {
    try {
      const savedCsv = localStorage.getItem('alts_custom_timetable_csv');
      if (savedCsv) {
        const parsed = parseTimetableCSV(savedCsv);
        if (parsed && parsed.length > 0) return parsed;
      }
      return INITIAL_TIMETABLE;
    } catch {
      return INITIAL_TIMETABLE;
    }
  });

  const [hasCustomCSV, setHasCustomCSV] = useState(() => {
    try {
      return Boolean(localStorage.getItem('alts_custom_timetable_csv'));
    } catch {
      return false;
    }
  });

  const updateTimetableFromCSV = useCallback((csvText) => {
    const parsed = parseTimetableCSV(csvText);
    if (parsed && parsed.length > 0) {
      setTimetableData(parsed);
      setHasCustomCSV(true);
      try {
        localStorage.setItem('alts_custom_timetable_csv', csvText);
      } catch { /* ignore */ }
      return { success: true, count: parsed.length };
    }
    return { success: false, error: 'Invalid or empty CSV format. Please make sure columns match: Class, Day, Slot ID, Start Time, End Time, Subject, Room, Faculty.' };
  }, []);

  const resetTimetableToDefault = useCallback(() => {
    setTimetableData(INITIAL_TIMETABLE);
    setHasCustomCSV(false);
    try {
      localStorage.removeItem('alts_custom_timetable_csv');
    } catch { /* ignore */ }
  }, []);

  const applyRoomOverride = useCallback((classId, newRoomId) => {
    setRoomOverrides((prev) => ({ ...prev, [classId]: newRoomId }));
  }, []);

  const applyTimetableOverride = useCallback((slotId, changes) => {
    setTimetableOverrides((prev) => ({ ...prev, [slotId]: { ...(prev[slotId] || {}), ...changes } }));
  }, []);

  const toggleLocationStatus = useCallback((buildingId) => {
    setLocationStatus((prev) => {
      const current = prev[buildingId] || 'active';
      return { ...prev, [buildingId]: current === 'active' ? 'closed' : 'active' };
    });
  }, []);

  const calculateRoute = useCallback(() => {
    if (!fromNode || !toNode || fromNode === toNode) return;
    const path = findPath(fromNode, toNode);
    if (path) {
      setActiveRoute(path);
      setRouteStats(calcRouteStats(path));
    }
  }, [fromNode, toNode]);

  const clearRoute = useCallback(() => {
    setActiveRoute(null);
    setRouteStats(null);
    setFromNode('');
    setToNode('');
  }, []);

  const selectBuilding = useCallback((building, pos) => {
    setSelectedBuilding(building);
    if (pos) setPopupPos(pos);
  }, []);

  const navigateTo = useCallback((view) => {
    setActiveView(view);
    if (window.location.hash !== `#${view}`) {
      window.location.hash = view;
    }
    setMobileMenuOpen(false);
    // Scroll view to top smoothly
    const scrollContainer = document.getElementById('main-scroll');
    if (scrollContainer) scrollContainer.scrollTop = 0;
  }, []);

  const locateOnMap = useCallback((buildingOrRoomId) => {
    // If it's a room in the Main Block or building
    setSelectedMainBlockRoomId(buildingOrRoomId);
    const b = getBuildingById(buildingOrRoomId);
    if (b) {
      setSelectedBuilding(b);
      setViewBox({ x: b.x - 200, y: b.y - 150, w: 600, h: 450 });
    }
    navigateTo('route');
    setMobileMenuOpen(false);
  }, [navigateTo]);

  const ctx = {
    theme, toggleTheme,
    activeView, setActiveView: navigateTo,
    navigateTo,
    selectedBuilding, setSelectedBuilding: selectBuilding,
    selectedMainBlockRoomId, setSelectedMainBlockRoomId,
    fromNode, setFromNode,
    toNode, setToNode,
    activeRoute, setActiveRoute,
    routeStats, setRouteStats,
    activeZoneFilter, setActiveZoneFilter,
    viewBox, setViewBox,
    cmdOpen, setCmdOpen,
    popupPos, setPopupPos,
    calculateRoute, clearRoute,
    locateOnMap,
    registerModal, setRegisterModal,
    mobileMenuOpen, setMobileMenuOpen,
    userRole, setUserRole,
    authUser, setAuthUser,
    loginModalOpen, setLoginModalOpen,
    loginDemo, logoutDemo,
    facultyList, setFacultyList,
    updateFacultyProfile,
    // Shared data
    events, setEvents, addEvent, updateEventsFromCSV, resetEventsToDefault, hasCustomEvents,
    classes, setClasses,
    announcements, addAnnouncement, removeAnnouncement, updateNoticesFromCSV, resetNoticesToDefault, hasCustomNotices,
    roomOverrides, applyRoomOverride,
    timetableOverrides, applyTimetableOverride,
    timetableData, updateTimetableFromCSV, resetTimetableToDefault, hasCustomCSV,
    locationStatus, toggleLocationStatus,
    marqueeItems: MARQUEE_ITEMS,
  };

  return (
    <AppContext.Provider value={ctx}>
      <div
        className="flex h-screen overflow-hidden"
        style={{ background: 'var(--bg-base)' }}
      >
        {/* Desktop + Mobile Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={navigateTo}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden my-3 mr-3 ml-1 lg:ml-3 rounded-3xl border border-[var(--glass-border)] bg-[var(--bg-surface)] shadow-xl relative transition-all duration-300">

          {/* Glass top bar */}
          <TopBar
            activeView={activeView}
            theme={theme}
            toggleTheme={toggleTheme}
            onMenuOpen={() => setMobileMenuOpen(true)}
            setCmdOpen={setCmdOpen}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
          />

          {/* Scrollable view */}
          <main
            id="main-scroll"
            className="flex-1 overflow-y-auto relative flex flex-col justify-between"
            style={{ paddingBottom: '70px' }}
          >
            <div key={activeView} className="flex-1">

              {activeView === 'today'     && <DashboardView />}
              {activeView === 'directory' && <DirectoryView setSelectedBuilding={selectBuilding} />}
              {activeView === 'events'    && <EventsSection />}
              {activeView === 'timetable' && <TimetableView />}
              {activeView === 'classes'   && <ClassesView />}
              {activeView === 'faculty'   && <FacultyView />}
              {activeView === 'rooms'     && <RoomsView />}
              {activeView === 'notices'   && <NoticesView />}
              {activeView === 'search'    && <SearchView />}
              {activeView === 'exams'     && <ExamsView />}
              {activeView === 'seating'   && <SeatingView />}

              {/* Auth-protected routes */}
              {activeView === 'profile' && (
                authUser !== null ? <ProfileView /> : <UnauthorizedView onSignIn={() => setLoginModalOpen(true)} onGoHome={() => navigateTo('today')} />
              )}
              {activeView === 'admin' && (
                userRole === 'admin' ? <AdminView /> : <UnauthorizedView onSignIn={() => setLoginModalOpen(true)} onGoHome={() => navigateTo('today')} />
              )}

              {(activeView === 'route' || activeView === 'mainblock' || activeView === 'main-block') && (
                <MainBlockView />
              )}

              {activeView === 'not-found' && (
                <NotFoundView onGoHome={() => navigateTo('today')} />
              )}
            </div>
          </main>
        </div>

        {/* Mobile bottom nav */}
        <MobileNav />

        {/* Command Palette */}
        {cmdOpen && <CommandPalette />}

        {/* Register Modal */}
        {registerModal && (
          <RegisterModal
            event={registerModal}
            onClose={() => setRegisterModal(null)}
          />
        )}

        {/* Demo Login Modal */}
        <DemoLoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
        />

        {/* Feedback / Disclaimer Modal */}
        {feedbackModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setFeedbackModalOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="rounded-3xl p-6 sm:p-8 max-w-md w-full border backdrop-blur-2xl shadow-2xl relative"
              style={{
                background: theme === 'dark' ? 'rgba(20, 20, 26, 0.96)' : 'rgba(255, 255, 255, 0.96)',
                borderColor: 'var(--glass-border-strong)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="text-amber-500" size={20} />
                  <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                    Prototype Disclaimer
                  </h3>
                </div>
                <button
                  onClick={() => setFeedbackModalOpen(false)}
                  className="glass-btn glass-btn-ghost rounded-full w-8 h-8 flex items-center justify-center"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
                <p>
                  This application is a <strong>frontend design and navigation prototype</strong> created for architectural demonstration.
                </p>
                <p>
                  • Official campus spatial surveys, GPS coordinates, and certified wheelchair accessibility data have not yet been integrated.
                </p>
                <p>
                  • Demonstrations of pathfinding algorithms are illustrative and must not be relied upon for emergency egress or real-world routing.
                </p>
                <p className="font-mono text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--glass-border)]">
                  Contact developer demonstration team: <br />
                  <a href="mailto:campus-guide-demo@meridian.edu" className="text-[var(--gold)] font-bold hover:underline">
                    campus-guide-demo@meridian.edu
                  </a>
                </p>
              </div>

              <button
                onClick={() => setFeedbackModalOpen(false)}
                className="w-full glass-btn glass-btn-primary rounded-full py-2.5 text-xs font-bold shadow-md"
              >
                Close Notice
              </button>
            </div>
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
}

function UnauthorizedView({ onSignIn, onGoHome }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[460px] text-center p-8 page-enter">
      <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mb-5 border border-red-500/30 bg-red-500/10 text-red-500 shadow-xl">
        <ShieldAlert size={32} />
      </div>
      <span className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold mb-2">
        Restricted Section
      </span>
      <h2 className="font-display font-black text-2xl sm:text-3xl text-[var(--text-primary)] mb-3">
        Authentication Required
      </h2>
      <p className="text-[var(--text-secondary)] font-mono text-xs max-w-md mx-auto leading-relaxed mb-6">
        This area requires authenticated Staff or Administrator credentials. Sign in using demonstration accounts to inspect this module.
      </p>
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {onSignIn && (
          <button
            onClick={onSignIn}
            className="glass-btn glass-btn-primary rounded-xl px-5 py-2.5 text-xs font-bold shadow-lg flex items-center gap-2"
          >
            <span>Sign In to Portal</span>
          </button>
        )}
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="glass-btn rounded-xl px-5 py-2.5 text-xs font-semibold hover:bg-white/5 transition-colors"
          >
            <span>Campus Home</span>
          </button>
        )}
      </div>
    </div>
  );
}

function NotFoundView({ onGoHome }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[450px] text-center p-8 page-enter">
      <div className="w-20 h-20 rounded-3xl glass-card flex items-center justify-center mb-5 border border-amber-500/30 bg-amber-500/10 text-amber-500 shadow-xl">
        <AlertTriangle size={36} />
      </div>
      <span className="font-mono text-xs uppercase tracking-widest text-amber-500 font-bold mb-2">
        Error 404 · Destination Not Found
      </span>
      <h2 className="font-display font-black text-3xl md:text-4xl text-[var(--text-primary)] mb-3">
        Campus Waypoint Missing
      </h2>
      <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto mb-6 leading-relaxed">
        The section or route coordinate you requested does not exist in the Meridian Campus registry.
      </p>
      <button
        onClick={onGoHome}
        className="glass-btn glass-btn-primary rounded-full py-3 px-8 text-xs font-bold shadow-lg flex items-center gap-2"
      >
        <Home size={15} />
        <span>Return to Campus Home</span>
      </button>
    </div>
  );
}
