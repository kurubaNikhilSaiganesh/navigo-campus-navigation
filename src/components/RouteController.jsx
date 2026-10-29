import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import {
  MAIN_BLOCK_ROOMS,
  getInternalDirections,
} from '../data/mainBlockData';
import { RefreshCcw, Compass, ArrowRight, X, ExternalLink } from 'lucide-react';
import RouteTimeline from './RouteTimeline';

export default function RouteController() {
  const { navigateTo, setSelectedMainBlockRoomId } = useContext(AppContext);

  const [fromRoomId, setFromRoomId] = useState('entrance');
  const [toRoomId, setToRoomId] = useState('mb-2-room-204');
  const [activeRoute, setActiveRoute] = useState(() =>
    getInternalDirections('entrance', 'mb-2-room-204')
  );

  const swapNodes = () => {
    const temp = fromRoomId;
    setFromRoomId(toRoomId);
    setToRoomId(temp);
    if (temp && toRoomId) {
      setActiveRoute(getInternalDirections(toRoomId, temp));
    }
  };

  const handleCalculateRoute = () => {
    if (!fromRoomId || !toRoomId) return;
    const res = getInternalDirections(fromRoomId, toRoomId);
    setActiveRoute(res);
  };

  const handleClearRoute = () => {
    setActiveRoute(null);
    setToRoomId('');
  };

  const handleOpenOnFloorPlan = (roomId) => {
    if (setSelectedMainBlockRoomId) {
      setSelectedMainBlockRoomId(roomId);
    }
    navigateTo('route');
  };

  const toRoomObj = activeRoute?.toRoom;

  return (
    <div className="glass-card glass-2 rounded-xl p-5 md:p-8 border border-[var(--glass-border-strong)] shadow-xl relative w-full overflow-hidden">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 mb-1.5 px-3 py-1 rounded-md border border-cyan-500/30 bg-cyan-500/10">
            <Compass size={13} className="text-cyan-400" />
            <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest font-bold">
              Main Block Indoor Navigation
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Indoor Directions
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-1 font-medium">
            Step-by-step route journey across 4 levels (G, 1, 2, 3) · Start → Move → Change Floor → Arrive.
          </p>
        </div>

        {activeRoute && (
          <button
            onClick={() => handleOpenOnFloorPlan(activeRoute.toRoom.id)}
            className="self-start px-4 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>View on Blueprint</span>
            <ExternalLink size={13} />
          </button>
        )}
      </div>

      {/* ── Form Controls (Horizontal on desktop, stacked on mobile) ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3 relative z-20 w-full mb-8 pb-6 border-b border-[var(--glass-border)]">
        {/* Origin Selector */}
        <div className="flex-1 min-w-0">
          <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 block font-semibold">
            Starting Location:
          </label>
          <div className="relative">
            <select
              value={fromRoomId}
              onChange={(e) => setFromRoomId(e.target.value)}
              className="w-full glass-select rounded-lg px-4 py-3 text-xs md:text-sm font-semibold border border-[var(--glass-border)] bg-[var(--bg-elevated)] text-[var(--text-primary)] cursor-pointer truncate shadow-xs focus:border-cyan-500/50"
            >
              <option value="entrance">Main Entrance (Ground Floor Atrium)</option>
              {MAIN_BLOCK_ROOMS.map((r) => (
                <option key={`from-${r.id}`} value={r.id}>
                  Floor {r.floor} · {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <button
          onClick={swapNodes}
          className="glass-btn rounded-lg w-11 h-11 p-0 flex items-center justify-center shrink-0 mb-0.5 self-center md:self-end hover:rotate-180 transition-transform duration-300 shadow-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          title="Swap starting point and destination"
          aria-label="Swap starting point and destination"
        >
          <RefreshCcw size={15} />
        </button>

        {/* Destination Selector */}
        <div className="flex-1 min-w-0">
          <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 block font-semibold">
            Destination Space:
          </label>
          <div className="relative">
            <select
              value={toRoomId}
              onChange={(e) => setToRoomId(e.target.value)}
              className="w-full glass-select rounded-lg px-4 py-3 text-xs md:text-sm font-semibold border border-[var(--glass-border)] bg-[var(--bg-elevated)] text-[var(--text-primary)] cursor-pointer truncate shadow-xs focus:border-cyan-500/50"
            >
              <option value="">Select destination room...</option>
              {MAIN_BLOCK_ROOMS.map((r) => (
                <option key={`to-${r.id}`} value={r.id}>
                  Floor {r.floor} · {r.name} ({r.number})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-stretch md:self-end">
          <button
            onClick={handleCalculateRoute}
            disabled={!fromRoomId || !toRoomId || fromRoomId === toRoomId}
            className="flex-1 md:flex-none glass-btn glass-btn-primary rounded-lg py-3 px-6 whitespace-nowrap h-[46px] font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none transition-all"
            aria-label="Get Directions"
          >
            <span>Get Directions</span>
            <ArrowRight size={15} />
          </button>

          {activeRoute && (
            <button
              onClick={handleClearRoute}
              className="glass-btn glass-btn-ghost rounded-lg px-3.5 h-[46px] text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center"
              title="Clear Route"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ── Journey Content: Timeline (Left) + Route Overview Panel (Right) ── */}
      {activeRoute ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Left: Single Connected Vertical Timeline */}
          <div className="lg:col-span-8 w-full min-w-0">
            <RouteTimeline
              activeRoute={activeRoute}
              onOpenOnBlueprint={handleOpenOnFloorPlan}
            />
          </div>

          {/* Compact Right: Route Overview / Floor Context Panel */}
          <div className="lg:col-span-4 w-full flex flex-col gap-4">
            <div className="glass-card rounded-xl p-5 border border-[var(--glass-border)] bg-[var(--bg-surface)]/80 shadow-md space-y-4">
              {/* Overview Header */}
              <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-3">
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">
                  ROUTE OVERVIEW
                </span>
                <span className="font-mono text-[10px] text-cyan-400 font-bold px-2 py-0.5 rounded-md bg-cyan-500/10">
                  {activeRoute.floorSummary}
                </span>
              </div>

              {/* Vertical Mini Breadcrumb Chain */}
              <div className="space-y-1.5 py-1">
                {activeRoute.overviewPath?.map((item, idx, arr) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                      <span className="font-mono text-xs font-semibold text-[var(--text-primary)] truncate">
                        {item}
                      </span>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="pl-1 py-1">
                        <span className="text-[11px] text-[var(--text-muted)] font-mono leading-none">↓</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Destination Card */}
              {toRoomObj && (
                <div className="pt-3 border-t border-[var(--glass-border)] space-y-2">
                  <span className="font-mono text-[9px] uppercase font-bold tracking-wider text-[var(--text-muted)] block">
                    DESTINATION SPACE:
                  </span>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[var(--text-primary)] leading-tight">
                      {toRoomObj.name}
                    </h4>
                    <p className="font-mono text-[11px] text-cyan-400 font-bold mt-0.5">
                      Floor {toRoomObj.floor} · {toRoomObj.number}
                    </p>
                    {toRoomObj.department && (
                      <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                        {toRoomObj.department} {toRoomObj.year ? `· Year ${toRoomObj.year}` : ''}
                      </p>
                    )}
                  </div>

                  {toRoomObj.status && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{toRoomObj.status}</span>
                    </div>
                  )}
                </div>
              )}

              {/* View on Blueprint CTA */}
              <div className="pt-2">
                <button
                  onClick={() => handleOpenOnFloorPlan(activeRoute.toRoom.id)}
                  className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.01]"
                >
                  <span>View on Blueprint</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty / Initial State with Quick Popular Destinations */
        <div className="p-8 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-surface)] text-center space-y-4">
          <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
            <Compass size={24} />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
              Choose a Starting Location & Destination
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto mt-1 leading-relaxed">
              Select any origin and destination across the Main Block to preview a connected vertical indoor navigation journey.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: 'mb-g-chairman', label: "Chairman's Office (Floor G)" },
              { id: 'mb-g-seminar', label: "Main Seminar Hall (Floor G)" },
              { id: 'mb-1-room-101', label: "Room 101 - 2nd Yr CSE (Floor 1)" },
              { id: 'mb-2-room-204', label: "Room 204 - 3rd Yr ECE (Floor 2)" },
              { id: 'mb-3-room-301', label: "Room 301 - Capstone (Floor 3)" },
            ].map((shortcut) => (
              <button
                key={shortcut.id}
                onClick={() => {
                  setToRoomId(shortcut.id);
                  const res = getInternalDirections(fromRoomId || 'entrance', shortcut.id);
                  setActiveRoute(res);
                }}
                className="px-3 py-1.5 rounded-md text-[11px] font-semibold border border-[var(--glass-border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-cyan-500/40 transition-colors"
              >
                + {shortcut.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
