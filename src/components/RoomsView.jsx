import { useState, useContext } from 'react';
import { ROOMS, getClassById } from '../data';
import { AppContext } from '../context/AppContext';
import { X, Info, ArrowRight } from 'lucide-react';

const ROOM_TYPES = [...new Set(ROOMS.map((r) => r.type))];
const BUILDINGS_LIST = [...new Set(ROOMS.map((r) => r.building))];

export default function RoomsView() {
  const { navigateTo, setToNode, theme } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [activeBuilding, setActiveBuilding] = useState('all');
  const [inspectedRoom, setInspectedRoom] = useState(null);

  const filtered = ROOMS.filter((r) => {
    const matchesType = activeType === 'all' || r.type === activeType;
    const matchesBuilding = activeBuilding === 'all' || r.building === activeBuilding;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.number.toLowerCase().includes(q) ||
      r.building.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q) ||
      (r.assignedClassId && r.assignedClassId.toLowerCase().includes(q));
    return matchesType && matchesBuilding && matchesSearch;
  });

  const typeColors = {
    'Lecture Hall':    '#3157FF',
    'Computer Lab':    '#087F45',
    'AI/ML Lab':       '#F4B400',
    'Research Lab':    '#747DFF',
    'Seminar Hall':    '#FF4757',
    'Conference Room': '#00D9FF',
    'Drawing Hall':    '#FF6B1A',
    'Workshop':        '#2ED573',
    'IoT Lab':         '#FFA502',
  };

  const handleRouteToRoom = (buildingId) => {
    setToNode(buildingId);
    setInspectedRoom(null);
    navigateTo('route');
  };

  const isDark = theme === 'dark';

  return (
    <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto page-enter">
      {/* Centered Hero Header */}
      <div className="mb-10 text-center flex flex-col items-center">
        <p className="font-mono text-[10px] text-[var(--gold)] uppercase tracking-widest mb-3 px-3 py-1 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 inline-block font-semibold">
          Campus Directory · Independent Registry
        </p>
        <h1 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight mb-3 text-[var(--text-primary)]">
          Rooms.
        </h1>
        <p className="text-[var(--text-secondary)] text-sm md:text-base max-w-lg mx-auto">
          Explore {ROOMS.length} rooms across {BUILDINGS_LIST.length} buildings. Find lecture halls, labs, and seminar spaces.
        </p>
      </div>

      {/* Centered Search */}
      <div className="relative mb-8 max-w-2xl mx-auto">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by number, building, or type..."
          className="w-full rounded-full glass-input pl-14 pr-6 py-4 text-sm md:text-base text-[var(--text-primary)] shadow-lg transition-all focus:scale-[1.01]"
        />
      </div>

      {/* Centered Filters */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <div className="flex flex-wrap justify-center gap-2 items-center py-1 max-w-full w-full">
          <button
            onClick={() => setActiveBuilding('all')}
            className={`text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 select-none whitespace-nowrap snap-start ${
              activeBuilding === 'all'
                ? 'bg-[var(--gold)] text-white shadow-[var(--shadow-gold)] scale-105'
                : 'glass-btn glass-btn-ghost rounded-full text-[var(--text-primary)] hover:bg-[var(--glass-2)] hover:scale-105 hover:shadow-lg'
            }`}
          >
            All Buildings
          </button>
          {BUILDINGS_LIST.map((b) => (
            <button
              key={b}
              onClick={() => setActiveBuilding(b)}
              className={`text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 select-none whitespace-nowrap snap-start ${
                activeBuilding === b
                  ? 'bg-[var(--gold)] text-white shadow-[var(--shadow-gold)] scale-105'
                  : 'glass-btn glass-btn-ghost rounded-full text-[var(--text-primary)] hover:bg-[var(--glass-2)] hover:scale-105 hover:shadow-lg'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 items-center py-1 max-w-full w-full">
          <button
            onClick={() => setActiveType('all')}
            className={`text-xs font-semibold px-4 py-2 rounded-full transition-all duration-300 select-none whitespace-nowrap snap-start ${
              activeType === 'all'
                ? 'bg-[var(--gold)] text-white font-bold shadow-[var(--shadow-gold)] scale-105'
                : 'glass-btn glass-btn-ghost rounded-full text-[var(--text-primary)] hover:bg-[var(--glass-2)] hover:scale-105 hover:shadow-lg'
            }`}
          >
            All Types
          </button>
          {ROOM_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`text-xs font-semibold px-4 py-2 rounded-full transition-all duration-300 select-none whitespace-nowrap snap-start ${
                activeType === type
                  ? 'bg-[var(--gold)] text-white font-bold shadow-[var(--shadow-gold)] scale-105'
                  : 'glass-btn glass-btn-ghost rounded-full text-[var(--text-primary)] hover:bg-[var(--glass-2)] hover:scale-105 hover:shadow-lg'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms table */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center border border-dashed border-[var(--glass-border-strong)]">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">NO ROOMS MATCH YOUR FILTERS</p>
        </div>
      ) : (
        <>
          {/* Desktop table — Curved Glass Container */}
          <div className="hidden md:block overflow-x-auto rounded-xl glass-card border border-[var(--glass-border)] shadow-md">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--glass-2)] border-b border-[var(--glass-border)] text-[var(--text-muted)]">
                  <th className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-wider font-semibold">Room</th>
                  <th className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-wider font-semibold">Building</th>
                  <th className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-wider font-semibold">Floor</th>
                  <th className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-wider font-semibold">Type</th>
                  <th className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-wider font-semibold">Capacity</th>
                  <th className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-wider font-semibold">Assigned Class</th>
                  <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-wider font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((room) => {
                  const cls = room.assignedClassId ? getClassById(room.assignedClassId) : null;
                  const color = typeColors[room.type] || '#9CA3AF';
                  return (
                    <tr
                      key={room.id}
                      className="border-t border-[var(--glass-border)] hover:bg-[var(--glass-2)] transition-colors cursor-pointer"
                      onClick={() => setInspectedRoom(room)}
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-bold text-sm text-[var(--text-primary)]">{room.number}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-[var(--text-primary)]">{room.building}</td>
                      <td className="px-5 py-3.5 text-sm text-[var(--text-muted)]">{room.floor}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-md border inline-block"
                          style={{ background: color + '18', color, borderColor: color + '40' }}
                        >
                          {room.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-mono text-[var(--text-muted)]">{room.capacity}</td>
                      <td className="px-5 py-3.5 text-sm">
                        {cls ? (
                          <span className="font-mono text-[10.5px] font-semibold bg-[var(--gold)]/15 border border-[var(--gold)]/30 px-2.5 py-0.5 rounded-md text-[var(--text-primary)] inline-block">
                            {cls.shortName}
                          </span>
                        ) : (
                          <span className="text-[var(--text-subtle)] text-xs font-mono">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setInspectedRoom(room)}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg glass-btn glass-btn-ghost text-[var(--gold)] hover:bg-[var(--gold-light)] transition-all"
                        >
                          Details →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards — Rounded Glass */}
          <div className="md:hidden space-y-3">
            {filtered.map((room) => {
              const cls = room.assignedClassId ? getClassById(room.assignedClassId) : null;
              const color = typeColors[room.type] || '#9CA3AF';
              return (
                <div
                  key={room.id}
                  className="rounded-xl glass-card p-5 border border-[var(--glass-border)] shadow-sm space-y-3 cursor-pointer"
                  onClick={() => setInspectedRoom(room)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-lg text-[var(--text-primary)]">{room.number}</span>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{room.building} · {room.floor} Floor</p>
                    </div>
                    <span
                      className="font-mono text-[9.5px] font-bold px-2.5 py-0.5 rounded-md border shrink-0"
                      style={{ background: color + '18', color, borderColor: color + '40' }}
                    >
                      {room.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[var(--glass-border)]" onClick={(e) => e.stopPropagation()}>
                    <div className="space-y-0.5">
                      <p className="text-xs text-[var(--text-muted)]">Capacity: <span className="font-mono font-bold text-[var(--text-primary)]">{room.capacity}</span></p>
                      {cls && (
                        <p className="text-xs text-[var(--text-muted)]">Class: <span className="font-mono font-bold text-[var(--text-primary)]">{cls.shortName}</span></p>
                      )}
                    </div>
                    <button
                      onClick={() => setInspectedRoom(room)}
                      className="glass-btn glass-btn-primary rounded-lg text-xs font-bold py-1.5 px-4"
                    >
                      Details →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ─── Room Details Modal ─── */}
      {inspectedRoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setInspectedRoom(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="room-modal-title"
        >
          <div
            className="rounded-xl p-6 sm:p-8 max-w-md w-full border backdrop-blur-2xl shadow-2xl relative overflow-hidden"
            style={{
              background: isDark ? 'rgba(20, 20, 26, 0.96)' : 'rgba(255, 255, 255, 0.96)',
              borderColor: 'var(--glass-border-strong)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="font-mono text-[9.5px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block mb-1 glass-1 border border-[var(--glass-border)]" style={{ color: typeColors[inspectedRoom.type] || '#007AFF' }}>
                  {inspectedRoom.type}
                </span>
                <h3 id="room-modal-title" className="font-mono font-black text-2xl text-[var(--text-primary)]">
                  Room {inspectedRoom.number}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">
                  {inspectedRoom.building} · {inspectedRoom.floor} Floor
                </p>
              </div>

              <button
                onClick={() => setInspectedRoom(null)}
                className="glass-btn glass-btn-ghost rounded-full w-8 h-8 flex items-center justify-center text-sm"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <div className="rounded-2xl p-4 glass-1 border border-[var(--glass-border)] space-y-2.5 mb-5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Capacity:</span>
                <span className="font-bold text-[var(--text-primary)]">{inspectedRoom.capacity} seats</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Floor Level:</span>
                <span className="font-bold text-[var(--text-primary)]">{inspectedRoom.floor} Floor</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Assigned Class:</span>
                <span className="font-bold text-[var(--text-primary)]">
                  {inspectedRoom.assignedClassId ? getClassById(inspectedRoom.assignedClassId)?.name || inspectedRoom.assignedClassId : 'None (General Hall)'}
                </span>
              </div>
            </div>

            {/* Spatial Notice */}
            <div
              className="p-3.5 rounded-2xl mb-6 text-left border flex items-start gap-2.5 text-xs font-mono"
              style={{
                background: isDark ? 'rgba(244, 180, 0, 0.08)' : 'rgba(244, 180, 0, 0.06)',
                borderColor: 'rgba(244, 180, 0, 0.25)',
              }}
            >
              <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div className="text-[var(--text-secondary)] leading-relaxed text-[11px]">
                <strong className="text-[var(--text-primary)] font-semibold">Location Notice:</strong> Room {inspectedRoom.number} is located on {inspectedRoom.floor} Floor of {inspectedRoom.building}. Physical coordinate tracking is paused awaiting verified spatial campus survey.
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setInspectedRoom(null)}
                className="flex-1 glass-btn rounded-lg py-2.5 text-xs font-semibold text-[var(--text-primary)]"
              >
                Close
              </button>
              <button
                onClick={() => handleRouteToRoom(inspectedRoom.buildingId)}
                className="flex-1 glass-btn glass-btn-primary rounded-lg py-2.5 text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Simulate Route</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
