import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import RouteController from './RouteController';
import { TIMETABLE, getCurrentDay, getRoomById, EVENTS as INITIAL_EVENTS } from '../data';
import { ArrowRight, Sparkles, Navigation, BookOpen, Building, Users, Clock, Trophy, Calendar, Bell, MapPin, Zap } from 'lucide-react';

// ── Staff slot helpers ────────────────────────────────────────
function getCurrentStaffSlot(facultyId) {
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const today = getCurrentDay();
  return TIMETABLE.find(
    (t) => t.facultyId === facultyId && t.day === today && hhmm >= t.startTime && hhmm < t.endTime
  );
}

function getNextStaffSlot(facultyId) {
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const today = getCurrentDay();
  return TIMETABLE.filter(
    (t) => t.facultyId === facultyId && t.day === today && t.startTime > hhmm
  ).sort((a, b) => a.startTime.localeCompare(b.startTime))[0] || null;
}

function getStaffScheduleForToday(facultyId) {
  const today = getCurrentDay();
  return TIMETABLE.filter(
    (t) => t.facultyId === facultyId && t.day === today
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));
}

// ── Static data ───────────────────────────────────────────────
const CORE_SYSTEMS = [
  {
    id: 'route',
    label: 'Navigation',
    code: 'SYS-01',
    desc: 'Campus wayfinding with interactive BFS routing',
    color: '#007AFF',
    icon: <Navigation size={26} className="text-white drop-shadow-md" />,
    bgClass: 'bg-vibrant-blue'
  },
  {
    id: 'classes',
    label: 'Classes',
    code: 'SYS-02',
    desc: 'Departments, academic sections & schedules',
    color: '#FF0055',
    icon: <BookOpen size={26} className="text-white drop-shadow-md" />,
    bgClass: 'bg-vibrant-red'
  },
  {
    id: 'rooms',
    label: 'Rooms',
    code: 'SYS-03',
    desc: 'Building, floor status, capacity & room types',
    color: '#34C759',
    icon: <Building size={26} className="text-white drop-shadow-md" />,
    bgClass: 'bg-vibrant-green'
  },
  {
    id: 'faculty',
    label: 'Faculty',
    code: 'SYS-04',
    desc: 'Staff directory, office cabins & subject leads',
    color: '#FF9500',
    icon: <Users size={26} className="text-white drop-shadow-md" />,
    bgClass: 'bg-vibrant-orange'
  },
  {
    id: 'timetable',
    label: 'Timetable',
    code: 'SYS-05',
    desc: 'Today & weekly period calendar view',
    color: '#5E5CE6',
    icon: <Clock size={26} className="text-white drop-shadow-md" />,
    bgClass: 'bg-vibrant-purple'
  },
  {
    id: 'events',
    label: 'Events',
    code: 'SYS-06',
    desc: 'Campus bulletin, hackathons, fests & workshops',
    color: '#00C7BE',
    icon: <Trophy size={26} className="text-white drop-shadow-md" />,
    bgClass: 'bg-vibrant-teal'
  },
];

const WHAT_IT_SOLVES = [
  {
    q: 'Where is my class?',
    a: 'Real-time room numbers, building coordinates & floor levels linked live to the map.',
    icon: '🎯',
  },
  {
    q: 'How do I get there?',
    a: 'Instant BFS pathfinding with turn-by-turn waypoints, walking distance, ETA, and ramp access.',
    icon: '🧭',
  },
  {
    q: "What's on campus today?",
    a: 'Live events bulletin, interactive timetables, exam seating, and broadcast notices.',
    icon: '⚡',
  },
];

const DEFAULT_NOTICES = [
  { id: 'dn_1', text: 'Library timings extended to 9 PM on weekdays.', severity: 'INFO' },
  { id: 'dn_2', text: 'Semester exam schedule published — check the Exams section.', severity: 'INFO' },
];

// ── Main export ───────────────────────────────────────────────
export default function DashboardView() {
  const { userRole } = useContext(AppContext);
  return userRole === 'staff' || userRole === 'admin'
    ? <StaffDashboard />
    : <PublicDashboard />;
}

// ─────────────────────────────────────────────────────────────
// PUBLIC DASHBOARD  (students + unauthenticated visitors)
// ─────────────────────────────────────────────────────────────
function PublicDashboard() {
  const { navigateTo, announcements, removeAnnouncement, events } = useContext(AppContext);

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  // Live clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const timeString = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });

  // Campus Highlights data
  const displayEvents  = (events && events.length ? events : INITIAL_EVENTS).slice(0, 3);
  
  // Sync deleted notice IDs from localStorage
  const deletedNoticeIds = (() => {
    try {
      const saved = localStorage.getItem('alts_deleted_notice_ids_2026');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();
  const visibleDefaultNotices = DEFAULT_NOTICES.filter((n) => !deletedNoticeIds.includes(n.id));
  const allNotices = [...(announcements || []), ...visibleDefaultNotices];
  const displayNotices = allNotices.slice(0, 2);

  // New updates detection (Tomorrow's Mini Project Expo or uploaded notices)
  const tomorrowEvents = (events || []).filter(e => e.tag === 'TOMORROW' || e.date === '2026.10.31');
  const hasNewUpdates = (announcements && announcements.length > 0) || tomorrowEvents.length > 0;

  const rawFlowItems = [
    ...tomorrowEvents.map(e => ({
      id: e.id,
      text: `[EVENT] TOMORROW (2026.10.31): ${e.title} — ${e.venueName || e.venue} (${e.time})`,
      target: 'events',
      isTomorrow: true
    })),
    ...(announcements || []).map(a => ({
      id: a.id,
      text: `[${a.severity}] ${a.text}`,
      target: 'notices',
      isTomorrow: false
    }))
  ];
  // Duplicate for smooth continuous marquee flow
  const flowItems = rawFlowItems.length > 0 ? [...rawFlowItems, ...rawFlowItems] : [];

  const quickLinks = [
    { label: 'Main Block',        id: 'main-block', icon: <Building size={16} /> },
    { label: 'Campus Directory',  id: 'directory',  icon: <MapPin size={16} /> },
    { label: 'Faculty Directory', id: 'faculty',    icon: <Users size={16} /> },
    { label: 'Timetable',         id: 'timetable',  icon: <Clock size={16} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6 page-enter">

      {/* ── Flowing Live Updates (Only renders if new update exists, otherwise normal application) ── */}
      {hasNewUpdates && (
        <div className="overflow-hidden rounded-2xl border border-violet-500/25 dark:border-violet-500/30 bg-[var(--bg-surface)] dark:bg-[#12141F]/90 backdrop-blur-md shadow-md py-2.5 px-3 flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/40 dark:border-emerald-400/40 text-emerald-800 dark:text-[#6EE7B7] shrink-0 font-mono text-[10px] font-black uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <Zap size={11} className="fill-emerald-600 dark:fill-[#6EE7B7] text-emerald-600 dark:text-[#6EE7B7]" />
            <span>LIVE UPDATE</span>
          </div>

          <div className="overflow-hidden relative flex-1">
            <div className="ticker-track flex items-center">
              {flowItems.map((item, idx) => (
                <span
                  key={`${item.id}-${idx}`}
                  onClick={() => navigateTo(item.target)}
                  className="cursor-pointer font-mono text-xs font-bold text-[var(--text-primary)] dark:text-[#DDD6FE] hover:text-emerald-700 dark:hover:text-[#6EE7B7] transition-colors whitespace-nowrap flex items-center gap-3 shrink-0 px-4"
                  title="Click to view update details"
                >
                  {item.isTomorrow ? (
                    <span className="text-emerald-700 dark:text-[#6EE7B7] font-black">
                      ⚡ {item.text}
                    </span>
                  ) : (
                    <span>{item.text}</span>
                  )}
                  <span className="text-slate-400 dark:text-violet-400/30">│</span>
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigateTo(tomorrowEvents.length > 0 ? 'events' : 'notices')}
            className="shrink-0 font-mono text-[10px] font-bold uppercase text-emerald-700 dark:text-[#6EE7B7] hover:text-emerald-900 dark:hover:text-white px-2.5 py-1 rounded-lg hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 transition-all flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight size={11} />
          </button>
        </div>
      )}

      {/* ── Admin announcement banner ── */}
      {announcements.length > 0 && (
        <div
          className="glass-card p-4 md:p-5 flex flex-col gap-2 rounded-xl"
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            borderColor: 'rgba(239, 68, 68, 0.25)',
          }}
        >
          {announcements.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="font-mono text-xs font-semibold text-red-500">
                  <span className="font-bold uppercase tracking-wider">[{a.severity}]</span> {a.text}
                </p>
              </div>
              <button
                onClick={() => removeAnnouncement(a.id)}
                className="glass-btn glass-btn-ghost glass-btn-sm text-[10px] text-red-500 hover:text-red-600 rounded-md shrink-0"
                aria-label="Dismiss announcement"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Hero Glass Showcase ──
          CRITICAL: Do NOT add backdrop-filter here. The Hero card must use a
          solid background. If backdrop-filter is active on the Hero, the GPU
          compositing layer will sample scrolled content (RouteController, etc.)
          from behind and bleed it through as a white glow around the buttons.
          The --bg-surface color is already textured enough to look premium
          without needing blur-through from lower layers.
      */}
      <div
        className="rounded-xl p-6 md:p-10 relative overflow-hidden"
        style={{
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-sm), inset 0 1px 1px rgba(255,255,255,0.5)',
          background: 'var(--bg-elevated)',
          isolation: 'isolate',
        }}
      >
        {/* Ambient background removed to prevent WebKit scroll bleed and glare artifacts */}

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-xl">
            {/* Live date pill — no backdrop-filter (already inside Hero which is isolated) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md mb-4 border border-[var(--glass-border)] transition-all duration-300 cursor-default" style={{ background: 'rgba(0,0,0,0.04)' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-[var(--text-muted)]">
                {date} · MERIDIAN CAMPUS
              </span>
            </div>

            {/* NaviGO Logo */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 shrink-0 navigo-sphere-icon shadow-lg">
                <span className="navigo-sphere-letter text-[17px]">N</span>
              </div>
              <span className="font-display font-black text-2xl tracking-tight text-[var(--text-primary)]">
                NaviGO
              </span>
            </div>

            {/* Giant Liquid Clock */}
            <div className="mb-4">
              <h1
                className="liquid-text font-display font-black leading-none tracking-tighter"
                style={{ fontSize: 'clamp(5rem, 12vw, 9rem)', marginLeft: '-0.05em' }}
              >
                {timeString}
              </h1>
            </div>

            <p className="mt-4 text-[var(--text-secondary)] font-mono text-sm uppercase tracking-widest leading-relaxed">
              &quot;Find your campus. Find your room. Find what&apos;s on today.&quot;
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col gap-3 sm:items-end w-full sm:w-auto">
            <button
              onClick={() => navigateTo('route')}
              className="glass-btn glass-btn-primary glass-btn-lg rounded-lg shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Navigation size={18} />
              <span>Explore Campus</span>
              <ArrowRight size={16} />
            </button>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => navigateTo('rooms')}
                className="glass-btn flex-1 sm:flex-none text-xs rounded-full py-2.5 px-5"
              >
                Find a Room
              </button>
              <button
                onClick={() => navigateTo('timetable')}
                className="glass-btn flex-1 sm:flex-none text-xs rounded-full py-2.5 px-5"
              >
                Timetable
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Campus Highlights ── */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <h2 className="font-display font-bold text-lg uppercase tracking-tight text-[var(--text-primary)]">
              Campus Highlights
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            Live Updates
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left: Upcoming Events */}
          <div className="glass-card rounded-xl p-6 border border-[var(--glass-border)] space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-blue-500" />
              <h3 className="font-display font-bold text-sm uppercase tracking-tight text-[var(--text-primary)]">
                Upcoming Events
              </h3>
            </div>

            {displayEvents.length > 0 ? (
              <div className="space-y-3">
                {displayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-[var(--glass-border)] bg-black/[0.02] dark:bg-white/[0.02] hover:border-emerald-400/50 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${ev.tag === 'TOMORROW' || ev.date === '2026.10.31' ? 'bg-emerald-500 dark:bg-[#6EE7B7] animate-pulse' : 'bg-blue-500'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-[var(--text-primary)] truncate">{ev.title}</p>
                        {(ev.tag === 'TOMORROW' || ev.date === '2026.10.31') && (
                          <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-[#6EE7B7] border border-emerald-500/30 dark:border-emerald-400/40 font-bold shrink-0">
                            ⚡ TOMORROW
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[11px] text-[var(--text-muted)] mt-0.5">
                        {ev.date} · {ev.venueName || ev.venue}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)] italic">No upcoming events.</p>
            )}

            <button
              onClick={() => navigateTo('events')}
              className="font-mono text-xs text-amber-500 hover:text-amber-600 font-semibold flex items-center gap-1 transition-colors mt-2"
            >
              <span>View All Events</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Right: Notices + Quick Access */}
          <div className="space-y-4">

            {/* Important Notices (disappears if no active notices) */}
            {displayNotices.length > 0 && (
              <div className="glass-card rounded-xl p-5 border border-[var(--glass-border)] space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Bell size={16} className="text-amber-500" />
                  <h3 className="font-display font-bold text-sm uppercase tracking-tight text-[var(--text-primary)]">
                    Notices
                  </h3>
                </div>
                {displayNotices.map((n) => (
                  <div key={n.id} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{n.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Access */}
            <div className="glass-card rounded-xl p-5 border border-[var(--glass-border)]">
              <h3 className="font-display font-bold text-sm uppercase tracking-tight text-[var(--text-primary)] mb-3">
                Popular Destinations
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {quickLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => navigateTo(link.id)}
                    className="glass-btn text-xs rounded-lg py-2.5 px-3 flex items-center gap-2 hover:shadow-md transition-all"
                  >
                    <span className="text-[var(--text-muted)]">{link.icon}</span>
                    <span className="text-left leading-tight">{link.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Route Finder Section ── */}
      <div className="space-y-4 relative z-30">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <h2 className="font-display font-bold text-lg uppercase tracking-tight text-[var(--text-primary)]">
              Instant Wayfinding
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            BFS Route Engine
          </span>
        </div>

        <div className="relative z-40">
          <RouteController />
        </div>
      </div>

      {/* ── What NaviGO Solves ── */}
      <div className="space-y-4 relative z-10">
        <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest px-1">
          Designed for Meridian Students &amp; Visitors
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {WHAT_IT_SOLVES.map((item) => (
            <div
              key={item.q}
              className="glass-card rounded-xl p-6 border border-[var(--glass-border)] hover:border-[var(--glass-border-strong)] transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl mb-4 block" role="img" aria-label="Feature icon">{item.icon}</span>
                <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-1.5">{item.q}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Core Systems Grid ── */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between px-1">
          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
            Core University Systems
          </p>
          <span className="font-mono text-[10px] text-[var(--text-subtle)]">6 Active Modules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CORE_SYSTEMS.map((sys) => (
            <button
              key={sys.id}
              onClick={() => navigateTo(sys.id)}
              className="glass-card rounded-xl p-6 text-left flex flex-col justify-between group border border-[var(--glass-border)] hover:border-[var(--glass-border-strong)] hover:shadow-lg transition-all duration-200 relative overflow-hidden"
            >
              {/* Ambient accent corner glow removed to prevent WebKit scroll bleed */}

              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-lg liquid-glass-icon ${sys.bgClass} shadow-lg`}>
                    <div className="w-[38px] h-[38px] rounded-full inner-glass-symbol flex items-center justify-center">
                      {sys.icon}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-2.5 py-1 rounded-md glass-1 border border-[var(--glass-border)] text-[var(--text-muted)] font-semibold">
                    {sys.code}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base uppercase tracking-tight text-[var(--text-primary)] group-hover:text-amber-500 transition-colors">
                  {sys.label}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                  {sys.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] group-hover:text-[var(--text-primary)]">
                <span>Access Module</span>
                <ArrowRight size={14} className="transform transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Campus Status Strip ── */}
      <div className="glass-card rounded-xl px-6 py-3.5 flex flex-col sm:flex-row items-center gap-3 justify-between border border-[var(--glass-border)] shadow-xs">
        <div className="flex items-center gap-3">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{
              background: announcements.length > 0 ? '#EF4444' : 'var(--green)',
              boxShadow: `0 0 12px ${announcements.length > 0 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(8, 127, 69, 0.6)'}`,
            }}
          />
          <p className="font-mono text-xs text-[var(--text-secondary)] tracking-wide">
            {announcements.length > 0 ? `${announcements.length} broadcast update(s) active` : 'Campus Status: Normal Operations · All Venues Open'}
          </p>
        </div>
        <button
          onClick={() => navigateTo('events')}
          className="font-mono text-xs text-amber-500 hover:text-amber-600 font-semibold flex items-center gap-1 transition-colors"
        >
          <span>View Campus Events</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STAFF DASHBOARD  (authenticated staff + admin fallback)
// ─────────────────────────────────────────────────────────────
function StaffDashboard() {
  const { navigateTo, announcements, removeAnnouncement, authUser } = useContext(AppContext);

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Resolve faculty identity from authUser
  const staffName        = authUser?.name        || 'Dr. Priya Sharma';
  const staffDesignation = authUser?.designation || 'Professor';
  const staffDepartment  = authUser?.department  || 'Computer Science Engineering';
  const staffLabel       = `${staffDesignation} · ${staffDepartment}`;

  // Resolve the faculty ID — use the one stored in authUser or fall back to a known demo ID
  const facultyId = authUser?.facultyId || 'fac_002';

  const currentSlot   = getCurrentStaffSlot(facultyId);
  const nextSlot      = getNextStaffSlot(facultyId);
  const displaySlot   = currentSlot || nextSlot;
  const nextRoom      = displaySlot ? getRoomById(displaySlot.roomId) : null;
  const todaySchedule = getStaffScheduleForToday(facultyId);

  // Time remaining until a target time string (HH:MM)
  const getTimeRemaining = (targetTimeStr) => {
    if (!targetTimeStr) return '';
    const now = new Date();
    const [hours, minutes] = targetTimeStr.split(':').map(Number);
    const targetDate = new Date();
    targetDate.setHours(hours, minutes, 0, 0);
    const diffMs = targetDate - now;
    if (diffMs <= 0) return 'Started';
    const diffMins = Math.floor(diffMs / 60000);
    const h = Math.floor(diffMins / 60);
    const m = diffMins % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m} min`;
  };

  const isLab = displaySlot?.subject?.toLowerCase().includes('lab');

  // Standard breaks
  const breaks = [
    { type: 'Tea Break',   start: '11:00', end: '11:15' },
    { type: 'Lunch Break', start: '13:00', end: '14:00' },
  ];

  const nowHhmm  = `${String(time.getHours()).padStart(2,'0')}:${String(time.getMinutes()).padStart(2,'0')}`;
  const nextBreak = breaks.find((b) => b.start > nowHhmm) || null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-8 page-enter">

      {/* ── Admin announcement banner ── */}
      {announcements.length > 0 && (
        <div
          className="glass-card p-4 md:p-5 flex flex-col gap-2 rounded-xl"
          style={{ background: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.25)' }}
        >
          {announcements.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="font-mono text-xs font-semibold text-red-500">
                  <span className="font-bold uppercase tracking-wider">[{a.severity}]</span> {a.text}
                </p>
              </div>
              <button
                onClick={() => removeAnnouncement(a.id)}
                className="glass-btn glass-btn-ghost glass-btn-sm text-[10px] text-red-500 hover:text-red-600 rounded-md shrink-0"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Staff Hero / Welcome ── */}
      <div
        className="rounded-xl p-6 md:p-10 relative overflow-hidden"
        style={{
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-sm), inset 0 1px 1px rgba(255,255,255,0.5)',
          background: 'var(--bg-elevated)',
          isolation: 'isolate',
        }}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md mb-4 border border-[var(--glass-border)] transition-all duration-300 cursor-default" style={{ background: 'rgba(0,0,0,0.04)' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-[var(--text-muted)]">
                {date} · MERIDIAN CAMPUS
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 shrink-0 navigo-sphere-icon shadow-lg">
                <span className="navigo-sphere-letter text-[17px]">N</span>
              </div>
              <span className="font-display font-black text-2xl tracking-tight text-[var(--text-primary)]">
                NaviGO Staff
              </span>
            </div>

            <div className="mb-4">
              <h1
                className="liquid-text font-display font-black leading-none tracking-tighter"
                style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', marginLeft: '-0.05em' }}
              >
                {staffName}
              </h1>
            </div>

            <p className="mt-4 text-[var(--text-secondary)] font-mono text-sm uppercase tracking-widest leading-relaxed">
              {staffLabel}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end w-full sm:w-auto">
            <button
              onClick={() => navigateTo('timetable')}
              className="glass-btn glass-btn-primary glass-btn-lg rounded-lg shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Clock size={18} />
              <span>My Timetable</span>
              <ArrowRight size={16} />
            </button>
            <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider text-right mt-2">
              Current Status: {todaySchedule.length ? 'Teaching Day' : 'No Classes Today'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-30">

        {/* Next Class / Lab Session Widget */}
        <div className="lg:col-span-2 relative z-40">
          <div className="glass-card glass-2 rounded-xl p-6 md:p-8 flex flex-col justify-between border border-[var(--glass-border-strong)] shadow-lg h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg uppercase tracking-tight text-[var(--text-primary)] flex items-center gap-2">
                <BookOpen size={20} className={isLab ? 'text-amber-500' : 'text-blue-500'} />
                {currentSlot ? 'Ongoing Session' : nextSlot ? 'Next Session' : 'Schedule Finished'}
              </h2>
              {isLab && (
                <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-md font-mono text-[10px] uppercase font-bold tracking-widest">
                  Lab Session
                </span>
              )}
            </div>

            {displaySlot ? (
              <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                <div>
                  <h3 className="font-display text-4xl font-black text-[var(--text-primary)] tracking-tight mb-2">
                    {displaySlot.subject}
                  </h3>
                  <p className="text-[var(--text-secondary)] font-mono text-sm uppercase tracking-widest mb-4">
                    Class: {displaySlot.classId.replace('_', '-').toUpperCase()}
                  </p>

                  <div className="flex items-center gap-4 text-sm font-medium text-[var(--text-secondary)]">
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-[var(--text-muted)]" />
                      <span>{displaySlot.startTime} – {displaySlot.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building size={16} className="text-[var(--text-muted)]" />
                      <span>{nextRoom?.code || displaySlot.roomId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto">
                  {!currentSlot && (
                    <div className="text-center p-4 bg-black/5 dark:bg-white/5 rounded-lg border border-[var(--glass-border)]">
                      <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">Starts in</p>
                      <p className="font-mono text-2xl font-bold text-[var(--gold)]">{getTimeRemaining(displaySlot.startTime)}</p>
                    </div>
                  )}
                  <button
                    onClick={() => navigateTo('route')}
                    className="glass-btn glass-btn-primary flex items-center justify-center gap-2 rounded-lg py-3 px-6"
                  >
                    <Navigation size={16} />
                    <span>Route to Room</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center h-full opacity-60">
                <Trophy size={48} className="mb-4 text-[var(--text-muted)]" />
                <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">No more classes scheduled for today.</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-2">Enjoy your free time.</p>
              </div>
            )}
          </div>
        </div>

        {/* Side: Next Break + Today's Schedule */}
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-xl p-6 border border-[var(--glass-border)] shadow-sm">
            <h2 className="font-display font-bold text-sm uppercase tracking-tight text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Clock size={16} className="text-emerald-500" />
              Next Break
            </h2>
            {nextBreak ? (
              <div>
                <p className="font-display text-2xl font-bold text-[var(--text-primary)] mb-1">
                  {nextBreak.type}
                </p>
                <p className="font-mono text-sm text-[var(--text-secondary)] mb-4">
                  {nextBreak.start} – {nextBreak.end}
                </p>
                <div className="text-xs font-mono px-3 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md inline-block">
                  Starts in {getTimeRemaining(nextBreak.start)}
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)] italic">No more breaks scheduled.</p>
            )}
          </div>

          <div className="glass-card rounded-xl p-6 border border-[var(--glass-border)] shadow-sm flex-1">
            <h2 className="font-display font-bold text-sm uppercase tracking-tight text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <BookOpen size={16} className="text-purple-500" />
              Today&apos;s Schedule
            </h2>

            {todaySchedule.length > 0 ? (
              <div className="space-y-4">
                {todaySchedule.map((slot) => {
                  const isPast    = nowHhmm >= slot.endTime;
                  const isCurrent = nowHhmm >= slot.startTime && nowHhmm < slot.endTime;
                  return (
                    <div key={slot.id} className={`flex gap-3 items-start ${isPast ? 'opacity-40' : ''}`}>
                      <div className="font-mono text-xs text-[var(--text-muted)] w-12 pt-0.5">
                        {slot.startTime}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${isCurrent ? 'text-[var(--gold)]' : 'text-[var(--text-primary)]'}`}>
                          {slot.subject}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {slot.classId.replace('_', '-').toUpperCase()} · Room {getRoomById(slot.roomId)?.code || slot.roomId}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)] italic">No classes today.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
