// SearchView — global search across all campus data

import { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { BUILDINGS } from '../data/buildings';
import { EXAMS } from '../data/exams';
import { FACULTY, ROOMS, EVENTS, MAIN_BLOCK_ROOMS } from '../data';
import { GlassBadge } from './ui/GlassBadge';
import { GlassSkeleton } from './ui/GlassSkeleton';

function buildSearchIndex() {
  return [
    ...MAIN_BLOCK_ROOMS.map((r) => ({
      id: r.id, type: 'main_block', category: 'Main Block',
      title: r.name, subtitle: `Level ${r.floor} · ${r.number} · ${r.category}`,
      tags: [r.category, r.department, `Floor ${r.floor}`, r.number, r.year ? `Year ${r.year}` : '', r.type],
      action: 'route', payload: r.id,
    })),
    ...BUILDINGS.filter((b) => b.type !== 'gate').map((b) => ({
      id: b.id, type: 'place', category: 'Campus Place',
      title: b.label, subtitle: `${b.code} · ${b.department}`, tags: b.tags,
      action: 'directory', payload: b.id,
    })),
    ...EXAMS.map((e) => ({
      id: e.id, type: 'exam', category: 'Examination',
      title: e.name, subtitle: `${e.type} · Semester ${e.semester} · ${e.startDate}`,
      tags: [...e.branches],
      action: 'exams', payload: e.id,
    })),
    ...FACULTY.map((f) => ({
      id: f.id, type: 'faculty', category: 'Faculty',
      title: f.name, subtitle: `${f.designation} · ${f.department}`,
      tags: [f.department],
      action: 'faculty', payload: f.id,
    })),
    ...ROOMS.map((r) => ({
      id: r.id, type: 'room', category: 'Room',
      title: `Room ${r.number}`, subtitle: `${r.building} · ${r.floor} Floor`,
      tags: [r.type, r.building],
      action: 'rooms', payload: r.id,
    })),
    ...EVENTS.map((ev) => ({
      id: ev.id, type: 'event', category: 'Event',
      title: ev.title, subtitle: `${ev.category} · ${ev.date}`,
      tags: [ev.category],
      action: 'events', payload: ev.id,
    })),
  ];
}

const SEARCH_INDEX = buildSearchIndex();

const TYPE_ICON = {
  place: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    </svg>
  ),
  exam: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  faculty: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    </svg>
  ),
  room: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><line x1="9" y1="22" x2="9" y2="12"/><line x1="15" y1="22" x2="15" y2="12"/><line x1="9" y1="12" x2="15" y2="12"/>
    </svg>
  ),
  event: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  main_block: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18"/>
      <path d="M9 21V9"/>
      <path d="M15 21V9"/>
    </svg>
  ),
};

const TYPE_BADGE = {
  main_block: 'blue',
  place:   'blue',
  exam:    'gold',
  faculty: 'green',
  room:    'gray',
  event:   'gold',
};

function ResultItem({ item, onNavigate }) {
  return (
    <button
      className="w-full text-left glass-card rounded-xl p-4 flex items-start gap-3 hover:border-[color:var(--glass-border-strong)] transition-all select-none"
      onClick={() => onNavigate(item.action, item.payload)}
      aria-label={`Go to ${item.title}`}
    >
      <div
        className="w-8 h-8 flex items-center justify-center rounded-full shrink-0 mt-0.5"
        style={{ background: 'var(--glass-2)', color: 'var(--text-muted)' }}
      >
        {TYPE_ICON[item.type]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
            {item.title}
          </p>
          <GlassBadge variant={TYPE_BADGE[item.type]}>{item.category}</GlassBadge>
        </div>
        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{item.subtitle}</p>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ color: 'var(--text-subtle)', shrink: 0, marginTop: 4 }}>
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  );
}

const QUICK_ACTIONS = [
  { label: 'Exam Seating', view: 'seating', icon: '🎯' },
  { label: 'Timetable',    view: 'timetable', icon: '🕐' },
  { label: 'Main Block',   view: 'route', icon: '🏛️' },
  { label: 'Faculty',      view: 'faculty', icon: '🎓' },
  { label: 'Events',       view: 'events', icon: '⚡' },
  { label: 'Rooms',        view: 'rooms', icon: '🏗️' },
];

export default function SearchView() {
  const { navigateTo, locateOnMap } = useContext(AppContext);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounce search
  const [results, setResults] = useState([]);
  useEffect(() => {
    if (!query.trim()) { setResults([]); setSearching(false); return; }
    setSearching(true);
    const t = setTimeout(() => {
      const q = query.toLowerCase();
      const found = SEARCH_INDEX.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.tags?.some((tag) => tag?.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q)
      ).slice(0, 20);
      setResults(found);
      setSearching(false);
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  // Group results by type
  const groups = results.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="px-4 md:px-8 py-8 max-w-3xl mx-auto page-enter">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--gold)' }}>
          [SEARCH_SYS]
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
          Search.
        </h1>
      </div>

      {/* Search input */}
      <div className="relative mb-6">
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--text-muted)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </span>
        <input
          ref={inputRef}
          type="search"
          className="glass-input pl-12 text-base md:text-lg rounded-lg"
          style={{ borderRadius: '8px', padding: '15px 20px 15px 48px' }}
          placeholder="Search places, faculty, rooms, events, exams..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search campus"
        />
        {searching && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                strokeDasharray="40" strokeDashoffset="10" style={{ color: 'var(--text-muted)' }}/>
            </svg>
          </span>
        )}
      </div>

      {/* Results */}
      {query.trim() && !searching ? (
        results.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groups).map(([category, items]) => (
              <div key={category}>
                <p
                  className="font-mono text-[10px] uppercase tracking-widest mb-3"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {category} ({items.length})
                </p>
                <div className="space-y-2">
                  {items.map((item) => (
                    <ResultItem
                      key={item.id}
                      item={item}
                      onNavigate={(action, payload) => {
                        if (action === 'route' && payload) {
                          locateOnMap(payload);
                        } else {
                          navigateTo(action);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-10 text-center">
            <p className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
              No results for &ldquo;{query}&rdquo;
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-subtle)' }}>
              Try searching for a building name, faculty, or subject code
            </p>
          </div>
        )
      ) : (
        /* Quick access — Refined Rounded Cards */
        <div>
          <p
            className="font-mono text-[10px] uppercase tracking-widest mb-4 font-semibold"
            style={{ color: 'var(--text-muted)' }}
          >
            Quick Access
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((qa) => (
              <button
                key={qa.view}
                onClick={() => navigateTo(qa.view)}
                className="glass-card rounded-xl px-5 py-3.5 text-left flex items-center gap-3 hover:border-[color:var(--glass-border-strong)] transition-all hover:scale-[1.02] shadow-xs select-none"
              >
                <span className="text-xl shrink-0">{qa.icon}</span>
                <span className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                  {qa.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading skeletons */}
      {searching && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <GlassSkeleton key={i} className="h-16" />
          ))}
        </div>
      )}
    </div>
  );
}

