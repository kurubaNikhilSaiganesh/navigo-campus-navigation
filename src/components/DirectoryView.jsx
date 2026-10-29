import { useState, useContext } from 'react';
import { BUILDINGS } from '../data';
import { AppContext } from '../context/AppContext';
import { Search, RotateCcw, ArrowRight, X, Info } from 'lucide-react';

const FILTER_DEFS = [
  { key: 'all',        label: 'All Places' },
  { key: 'academic',   label: 'Academic' },
  { key: 'lab',        label: 'Labs & Research' },
  { key: 'admin',      label: 'Admin & Services' },
  { key: 'library',    label: 'Library' },
  { key: 'hostel',     label: 'Hostels' },
  { key: 'sports',     label: 'Sports' },
];

const TYPE_COLORS = {
  admin:      '#6B7280',
  academic:   '#3B82F6',
  library:    '#8B5CF6',
  lab:        '#087F45',
  hostel:     '#06B6D4',
  sports:     '#10B981',
  canteen:    '#F97316',
  auditorium: '#A855F7',
  gate:       '#9CA3AF',
};

const TYPE_ICONS = {
  admin:      'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  academic:   'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  library:    'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
  lab:        'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11l2 2-2 2V3m0 14H5a2 2 0 0 1-2-2v-4',
  hostel:     'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  canteen:    'M18 8h1a4 4 0 0 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z M6 1v3 M10 1v3 M14 1v3',
  auditorium: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  sports:     'M6.5 6.5a5 5 0 1 0 7 7 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  gate:       'M3 21V9l9-6 9 6v12 M9 21V9 M15 21V9',
};

export default function DirectoryView({ setSelectedBuilding }) {
  const { navigateTo, setFromNode, setToNode, locationStatus = {}, theme } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [inspectedBuilding, setInspectedBuilding] = useState(null);

  const buildings = BUILDINGS.filter((b) => b.type !== 'gate');

  const filtered = buildings.filter((b) => {
    const matchesFilter =
      activeFilter === 'all' ||
      b.type === activeFilter ||
      (activeFilter === 'admin' && ['admin', 'canteen', 'auditorium'].includes(b.type));

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      b.label.toLowerCase().includes(q) ||
      b.department.toLowerCase().includes(q) ||
      b.type.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.facilities.some((f) => f.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  const handleReset = () => {
    setSearchQuery('');
    setActiveFilter('all');
  };

  const handleViewDetails = (b) => {
    setInspectedBuilding(b);
    if (setSelectedBuilding) setSelectedBuilding(b);
  };

  const handleRouteFrom = (id) => {
    setFromNode(id);
    setInspectedBuilding(null);
    navigateTo('route');
  };

  const handleRouteTo = (id) => {
    setToNode(id);
    setInspectedBuilding(null);
    navigateTo('route');
  };

  const isDark = theme === 'dark';

  return (
    <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto page-enter space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-1 border border-[var(--glass-border)] mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-mono text-[10px] text-amber-500 uppercase tracking-widest font-bold">
              Campus Directory · Independent Registry
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)]">
            Campus Places.
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm md:text-base">
            Browse buildings, departments, auditoriums, and facilities across Meridian campus independently of the spatial map.
          </p>
        </div>

        {(searchQuery || activeFilter !== 'all') && (
          <button
            onClick={handleReset}
            className="glass-btn glass-btn-sm rounded-lg text-xs self-start sm:self-auto flex items-center gap-1.5"
          >
            <RotateCcw size={12} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search buildings, departments, facilities (e.g. Library, Tech Labs, Auditorium)..."
          className="glass-input pl-12 pr-10 py-3.5 rounded-lg text-sm font-medium shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono px-2 py-0.5 rounded-md glass-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            aria-label="Clear search"
          >
            ESC
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-nowrap items-center gap-2 overflow-x-auto scrollbar-hide py-2 px-1 w-full max-w-full snap-x snap-mandatory overscroll-x-contain [-webkit-overflow-scrolling:touch]">
        {FILTER_DEFS.map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`text-xs font-semibold px-4 py-2 rounded-md transition-all duration-300 whitespace-nowrap select-none snap-start ${
                isActive
                  ? 'bg-[var(--gold)] text-white shadow-[var(--shadow-gold)] font-bold scale-105'
                  : 'glass-1 border border-[var(--glass-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--glass-border-strong)] hover:scale-105 hover:shadow-lg'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between px-1">
        <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
          {filtered.length} {filtered.length === 1 ? 'place' : 'places'} found
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center border border-dashed border-[var(--glass-border-strong)]">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
            No places match your search query
          </p>
          <button
            onClick={handleReset}
            className="mt-4 glass-btn glass-btn-primary rounded-lg text-xs py-2 px-6"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((b) => {
            const color = TYPE_COLORS[b.type] || '#9CA3AF';
            const iconPath = TYPE_ICONS[b.type] || TYPE_ICONS.admin;
            const floorCount = Math.max(1, Math.floor(b.h / 25));

            return (
              <div
                key={b.id}
                className="glass-card rounded-xl p-6 flex flex-col justify-between cursor-pointer group border border-[var(--glass-border)] hover:border-[var(--glass-border-strong)] hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                onClick={() => handleViewDetails(b)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleViewDetails(b)}
                aria-label={`View details for ${b.label}`}
              >
                <div>
                  {/* Icon + Tag */}
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center glass-2 border border-[var(--glass-border)] shadow-xs transition-transform group-hover:scale-105"
                      style={{ color }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                        <path d={iconPath} />
                      </svg>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {locationStatus[b.id] === 'closed' && (
                        <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-red-500/15 text-red-500 border border-red-500/30">
                          CLOSED
                        </span>
                      )}
                      <span
                        className="font-mono text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider glass-1 border"
                        style={{ color, borderColor: `${color}40`, background: `${color}12` }}
                      >
                        {b.type} · {b.code}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4 relative z-10">
                    <h3 className="font-display font-bold text-lg leading-tight text-[var(--text-primary)] group-hover:text-amber-500 transition-colors">
                      {b.label}
                    </h3>
                    <p className="font-mono text-[10px] text-amber-500 uppercase tracking-wider mt-0.5 font-semibold">
                      {b.department}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-2 line-clamp-2 leading-relaxed">
                      {b.description}
                    </p>
                  </div>

                  {/* Facilities preview */}
                  <div className="flex flex-wrap gap-1.5 mb-5 relative z-10">
                    {b.facilities.slice(0, 3).map((f) => (
                      <span
                        key={f}
                        className="text-[10px] font-mono px-2.5 py-0.5 rounded-full glass-1 border border-[var(--glass-border)] text-[var(--text-muted)]"
                      >
                        {f}
                      </span>
                    ))}
                    {b.facilities.length > 3 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full text-[var(--text-subtle)]">
                        +{b.facilities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center border-t border-[var(--glass-border)] pt-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      {floorCount} floor{floorCount !== 1 ? 's' : ''}
                    </span>
                    {b.accessible && (
                      <span className="font-mono text-[10px] text-emerald-500 font-bold flex items-center gap-0.5" title="Architectural ramp indicated">
                        ♿
                      </span>
                    )}
                  </div>

                  <span className="font-mono text-xs font-semibold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
                    <span>Place Details</span>
                    <ArrowRight size={13} className="transform transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Location Details Modal ─── */}
      {inspectedBuilding && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setInspectedBuilding(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="location-modal-title"
        >
          <div
            className="rounded-xl p-6 sm:p-8 max-w-lg w-full border backdrop-blur-2xl shadow-2xl relative overflow-hidden"
            style={{
              background: isDark ? 'rgba(20, 20, 26, 0.96)' : 'rgba(255, 255, 255, 0.96)',
              borderColor: 'var(--glass-border-strong)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="font-mono text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md inline-block mb-1 glass-1 border border-[var(--glass-border)]" style={{ color: TYPE_COLORS[inspectedBuilding.type] || '#007AFF' }}>
                  {inspectedBuilding.type.toUpperCase()} · {inspectedBuilding.code}
                </span>
                <h3 id="location-modal-title" className="font-display font-bold text-2xl text-[var(--text-primary)]">
                  {inspectedBuilding.label}
                </h3>
                <p className="font-mono text-xs text-amber-500 font-semibold mt-0.5">
                  {inspectedBuilding.department}
                </p>
              </div>

              <button
                onClick={() => setInspectedBuilding(null)}
                className="glass-btn glass-btn-ghost rounded-lg w-8 h-8 flex items-center justify-center text-sm"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {locationStatus[inspectedBuilding.id] === 'closed' && (
              <div className="p-3.5 rounded-xl mb-4 text-left border border-red-500/30 bg-red-500/10 text-red-500 font-mono text-xs font-semibold flex items-center gap-2">
                <span>⚠ NOTICE: This location is currently marked as TEMPORARILY CLOSED for maintenance by administration.</span>
              </div>
            )}

            {/* Description */}
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
              {inspectedBuilding.description}
            </p>

            {/* Facilities */}
            <div className="mb-5">
              <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 font-semibold">
                Facilities & Key Points
              </p>
              <div className="flex flex-wrap gap-1.5">
                {inspectedBuilding.facilities.map((fac) => (
                  <span
                    key={fac}
                    className="text-xs font-mono px-3 py-1 rounded-md glass-1 border border-[var(--glass-border)] text-[var(--text-primary)]"
                  >
                    {fac}
                  </span>
                ))}
              </div>
            </div>

            {/* Geographic Status Notice */}
            <div
              className="p-3.5 rounded-xl mb-6 text-left border flex items-start gap-2.5 text-xs font-mono"
              style={{
                background: isDark ? 'rgba(244, 180, 0, 0.08)' : 'rgba(244, 180, 0, 0.06)',
                borderColor: 'rgba(244, 180, 0, 0.25)',
              }}
            >
              <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div className="text-[var(--text-secondary)] leading-relaxed text-[11px]">
                <strong className="text-[var(--text-primary)] font-semibold">Spatial Survey Notice:</strong> Building physical coordinates and outdoor pathways are pending ground survey. Physical wayfinding is paused; route calculation is available in simulation mode.
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={() => handleRouteFrom(inspectedBuilding.id)}
                className="w-full sm:w-1/2 glass-btn rounded-lg py-2.5 px-4 text-xs font-semibold text-[var(--text-primary)]"
              >
                Simulate Route From Here
              </button>
              <button
                onClick={() => handleRouteTo(inspectedBuilding.id)}
                className="w-full sm:w-1/2 glass-btn glass-btn-primary rounded-lg py-2.5 px-4 text-xs font-bold shadow-md"
              >
                Simulate Route To Here →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
