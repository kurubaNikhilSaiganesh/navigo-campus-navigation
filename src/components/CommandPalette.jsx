import { useContext, useState, useRef, useEffect } from 'react';
import { Search, Building2, ArrowRight } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { BUILDINGS, ROOMS, FACULTY, MAIN_BLOCK_ROOMS } from '../data';

// Build searchable items from all data sources
const SEARCH_ITEMS = [
  ...MAIN_BLOCK_ROOMS.map((r) => ({
    id: r.id,
    title: r.name,
    subtitle: `Main Block · Level ${r.floor} · ${r.category} · ${r.department}`,
    tag: r.category.toUpperCase(),
    type: 'main_block',
    action: 'main_block',
    roomId: r.id,
  })),
  ...BUILDINGS.map((b) => ({
    id: b.id,
    title: b.label,
    subtitle: `${b.code} // ${b.department}`,
    tag: b.type.toUpperCase(),
    type: 'building',
    action: 'locate',
  })),
  ...ROOMS.map((r) => ({
    id: r.id,
    title: `Room ${r.number}`,
    subtitle: `${r.building} · ${r.floor} Floor · ${r.type}`,
    tag: 'ROOM',
    type: 'room',
    action: 'room',
    buildingId: r.buildingId,
  })),
  ...FACULTY.map((f) => ({
    id: f.id,
    title: f.name,
    subtitle: `${f.designation} · ${f.department}`,
    tag: 'FACULTY',
    type: 'faculty',
    action: 'faculty',
    buildingId: f.buildingId,
  })),
];

export default function CommandPalette() {
  const { setCmdOpen, locateOnMap } = useContext(AppContext);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = query.trim()
    ? SEARCH_ITEMS.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.tag.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 12)
    : BUILDINGS.slice(0, 8).map((b) => ({
        id: b.id,
        title: b.label,
        subtitle: `${b.code} // ${b.department}`,
        tag: b.type.toUpperCase(),
        type: 'building',
        action: 'locate',
      }));

  // Reset cursor when results change
  useEffect(() => {
    setCursor(0);
  }, [query]);

  // Scroll cursor item into view
  useEffect(() => {
    const el = listRef.current?.children[cursor];
    el?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  const handleSelect = (item) => {
    if (item.action === 'main_block' || item.roomId) {
      locateOnMap(item.roomId || item.id);
    } else if (item.action === 'locate' || item.action === 'room' || item.action === 'faculty') {
      const bid = item.buildingId || item.id;
      locateOnMap(bid);
    }
    setCmdOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[cursor]) handleSelect(filtered[cursor]);
    } else if (e.key === 'Escape') {
      setCmdOpen(false);
    }
  };

  const TAG_COLORS = {
    BUILDING: '#3157FF', ACADEMIC: '#3157FF', ADMIN: '#FF4757',
    LIBRARY: '#747DFF', LAB: '#F4B400', HOSTEL: '#00D9FF',
    CANTEEN: '#FF6B1A', AUDITORIUM: '#9333EA', SPORTS: '#087F45',
    GATE: '#9CA3AF', ROOM: '#087F45', FACULTY: '#F4B400',
  };

  return (
    <div
      className="cmd-overlay"
      onClick={() => setCmdOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Campus search"
    >
      <div
        className="w-full max-w-lg mx-4 rounded-xl glass-modal border border-[var(--glass-border-strong)] p-4 shadow-2xl overflow-hidden backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input row */}
        <div
          className="flex items-center rounded-lg bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.06)] border border-[var(--glass-border)] px-3.5 py-1.5 mb-3 shadow-inner"
          role="searchbox"
        >
          <div className="pl-1 shrink-0">
            <img
              src="/logo.png"
              alt="NaviGO"
              style={{ height: 22, width: 'auto', objectFit: 'contain' }}
            />
          </div>
          <div className="w-px h-5 bg-[var(--glass-border)] mx-2.5" />
          <Search size={15} className="text-[var(--text-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search campus — buildings, rooms, faculty..."
            className="flex-1 px-3 py-2 text-xs bg-transparent outline-none placeholder:text-[var(--text-muted)] text-[var(--text-primary)] rounded-lg"
            aria-autocomplete="list"
            aria-controls="cmd-results"
            aria-activedescendant={`cmd-item-${cursor}`}
          />
          <button
            className="mr-1 font-mono text-[10px] px-2.5 py-1 rounded-md glass-btn glass-btn-ghost hover:scale-105 transition-all text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            onClick={() => setCmdOpen(false)}
            aria-label="Close palette"
          >
            ESC
          </button>
        </div>

        {/* Section label */}
        {!query && (
          <div className="px-3 pt-2 pb-1.5">
            <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-semibold">Quick Access</p>
          </div>
        )}
        {query && filtered.length > 0 && (
          <div className="px-3 pt-2 pb-1.5">
            <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-semibold">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &quot;{query}&quot;
            </p>
          </div>
        )}

        {/* Results */}
        <div
          id="cmd-results"
          ref={listRef}
          className="max-h-72 overflow-y-auto space-y-1.5 px-1 scrollbar-hide"
          role="listbox"
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-8 font-mono text-xs text-center text-[var(--text-muted)] uppercase tracking-wider">
              [NO RESULTS] &mdash; Try &quot;library&quot;, &quot;lab&quot;, or a faculty name
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isActive = cursor === idx;
              const tagColor = TAG_COLORS[item.tag] || '#9CA3AF';
              return (
                <div
                  id={`cmd-item-${idx}`}
                  key={`${item.type}-${item.id}`}
                  role="option"
                  aria-selected={isActive}
                  tabIndex={-1}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setCursor(idx)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-[var(--gold)]/15 border-[var(--gold)]/45 text-[var(--text-primary)] shadow-sm scale-[1.01]'
                      : 'border-transparent hover:bg-[var(--glass-2)] text-[var(--text-primary)]'
                  }`}
                >
                  {/* Icon box */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                    style={{
                      borderColor: isActive ? 'var(--gold)' : tagColor,
                      color: isActive ? 'var(--gold)' : tagColor,
                      background: isActive ? 'rgba(244, 180, 0, 0.14)' : tagColor + '18',
                    }}
                  >
                    <Building2 size={13} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.title}</p>
                    <p className="font-mono text-[9px] truncate text-[var(--text-muted)]">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Tag */}
                  <span
                    className="font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-md border shrink-0"
                    style={{
                      color: isActive ? 'var(--gold)' : tagColor,
                      borderColor: isActive ? 'rgba(244, 180, 0, 0.40)' : tagColor,
                      background: isActive ? 'rgba(244, 180, 0, 0.12)' : tagColor + '18',
                    }}
                  >
                    {item.tag}
                  </span>

                  <ArrowRight size={13} className={isActive ? 'text-[var(--gold)] translate-x-0.5 transition-transform' : 'text-[var(--text-subtle)]'} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer hint bar */}
        <div className="mt-3 px-4 py-2.5 rounded-2xl flex gap-4 items-center bg-[var(--glass-1)] border border-[var(--glass-border)]">
          <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase">↑↓ Navigate</span>
          <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase">↵ Select</span>
          <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase">ESC Close</span>
          <span className="font-mono text-[9px] ml-auto font-bold" style={{ color: 'var(--gold)' }}>
            {SEARCH_ITEMS.length} items indexed
          </span>
        </div>
      </div>

    </div>
  );
}

