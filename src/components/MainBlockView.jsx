import { useState, useContext, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Compass,
  ArrowRight,
  X,
  RefreshCcw,
  Building2,
  ChevronRight
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import {
  MAIN_BLOCK_FLOORS,
  MAIN_BLOCK_ROOMS,
  ROOM_TYPE_CONFIG,
  getRoomsByFloor,
  getMainBlockRoomById,
  searchMainBlockRooms,
  getInternalDirections,
} from '../data/mainBlockData';
import MainBlockFloorPlan from './MainBlockFloorPlan';
import RouteTimeline from './RouteTimeline';

export default function MainBlockView() {
  const { theme, selectedMainBlockRoomId, setSelectedMainBlockRoomId } = useContext(AppContext) || {};

  // View Mode: 'blueprint' | 'directions'
  const [viewMode, setViewMode] = useState('blueprint');

  // Floor Selection: G, 1, 2, 3
  const [selectedFloor, setSelectedFloor] = useState('G');

  // Selected Room in Information Panel
  const [activeRoom, setActiveRoom] = useState(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  // Simple Internal Directions State
  const [startPointId, setStartPointId] = useState('entrance');
  const [destPointId, setDestPointId] = useState('mb-2-room-204');
  const [activeRoute, setActiveRoute] = useState(() =>
    getInternalDirections('entrance', 'mb-2-room-204')
  );

  // Sync external selection if provided via AppContext
  useEffect(() => {
    if (selectedMainBlockRoomId) {
      const target = getMainBlockRoomById(selectedMainBlockRoomId);
      if (target) {
        setSelectedFloor(target.floor);
        setActiveRoom(target);
      }
    }
  }, [selectedMainBlockRoomId]);

  // Current floor metadata & rooms
  const currentFloorMeta = useMemo(() => {
    return MAIN_BLOCK_FLOORS.find((f) => f.id === selectedFloor) || MAIN_BLOCK_FLOORS[0];
  }, [selectedFloor]);

  const currentFloorRooms = useMemo(() => {
    return getRoomsByFloor(selectedFloor);
  }, [selectedFloor]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() && activeCategoryFilter === 'all') return [];
    let list = searchMainBlockRooms(searchQuery);
    if (activeCategoryFilter !== 'all') {
      list = list.filter((r) => r.type === activeCategoryFilter);
    }
    return list.slice(0, 8);
  }, [searchQuery, activeCategoryFilter]);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // When room is selected from search or list
  const handleSelectRoom = (room) => {
    if (!room) return;
    if (room.floor !== selectedFloor) {
      setSelectedFloor(room.floor);
    }
    setActiveRoom(room);
    setIsSearchFocused(false);
    if (setSelectedMainBlockRoomId) setSelectedMainBlockRoomId(room.id);
  };

  // Launch Internal Directions to room
  const handleStartDirectionsTo = (room) => {
    setDestPointId(room.id);
    const result = getInternalDirections(startPointId || 'entrance', room.id);
    setActiveRoute(result);
    setViewMode('directions');
  };

  // Calculate or clear directions
  const handleCalculateRoute = () => {
    if (!startPointId || !destPointId) return;
    const result = getInternalDirections(startPointId, destPointId);
    setActiveRoute(result);
  };

  const handleClearRoute = () => {
    setActiveRoute(null);
    setDestPointId('');
  };

  const handleSwapDirections = () => {
    const temp = startPointId;
    setStartPointId(destPointId);
    setDestPointId(temp);
    if (temp && destPointId) {
      const result = getInternalDirections(destPointId, temp);
      setActiveRoute(result);
    }
  };

  const handleJumpToBlueprintFromRoute = (roomId) => {
    const r = getMainBlockRoomById(roomId);
    if (r) {
      setSelectedFloor(r.floor);
      setActiveRoom(r);
    }
    setViewMode('blueprint');
  };

  return (
    <div className="flex flex-col w-full h-full min-h-[calc(100vh-140px)] select-none page-enter pb-10">
      {/* ── Top Header Section ── */}
      <div className="px-4 md:px-8 pt-6 pb-4 border-b border-[var(--glass-border)] bg-[var(--bg-surface)]/70 backdrop-blur-xl relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Title & Subtitle */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                Main Academic & Administrative Block
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight text-[var(--text-primary)]">
              Main Block
            </h1>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-1 font-medium">
              4-level academic and administrative block · Ground, First, Second & Third Floors
            </p>
          </div>

          {/* Right Header Area: View Mode Switcher + Floor Selector */}
          <div className="flex flex-col sm:items-end gap-3">
            {/* View Mode Toggle: Blueprint vs Directions */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-elevated)] shadow-sm">
              <button
                onClick={() => setViewMode('blueprint')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'blueprint'
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Building2 size={14} />
                <span>Floor Blueprint</span>
              </button>

              <button
                onClick={() => setViewMode('directions')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'directions'
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Compass size={14} />
                <span>Route Journey</span>
              </button>
            </div>

            {/* Floor Selector Bar: G | 1 | 2 | 3 (Visible in Blueprint view) */}
            {viewMode === 'blueprint' && (
              <div className="flex items-center gap-1.5 p-1.5 rounded-2xl border border-[var(--glass-border-strong)] bg-[var(--bg-elevated)]/90 backdrop-blur-md shadow-lg">
                {MAIN_BLOCK_FLOORS.map((fl) => {
                  const isSelected = selectedFloor === fl.id;
                  return (
                    <button
                      key={fl.id}
                      onClick={() => {
                        setSelectedFloor(fl.id);
                        if (activeRoom && activeRoom.floor !== fl.id) {
                          setActiveRoom(null);
                        }
                      }}
                      className={`relative px-5 md:px-7 py-2.5 rounded-xl font-display text-base md:text-lg font-black transition-all duration-200 flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/25 scale-[1.02]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                      title={fl.label}
                      aria-label={`Select ${fl.label}`}
                    >
                      <span>{fl.shortLabel}</span>
                      <span className="font-mono text-[10px] font-normal uppercase opacity-80 hidden sm:inline">
                        {fl.id === 'G' ? 'Ground' : `Floor ${fl.id}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Search & Filter Ribbon (Only in Blueprint mode) ── */}
      {viewMode === 'blueprint' && (
        <div className="px-4 md:px-8 py-3.5 bg-[var(--bg-surface)]/40 border-b border-[var(--glass-border)] relative z-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1 max-w-xl" ref={searchContainerRef}>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search classrooms, labs, seminar hall, Chairman's room, washrooms, branches, years..."
                  className="w-full glass-input rounded-lg pl-11 pr-10 py-2.5 text-xs md:text-sm text-[var(--text-primary)] border border-[var(--glass-border)] shadow-xs focus:border-cyan-500/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Live Search Results Popup */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-[var(--glass-border-strong)] bg-[var(--bg-elevated)]/95 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden divide-y divide-[var(--glass-border)] max-h-80 overflow-y-auto">
                  <div className="px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] bg-[var(--glass-1)]">
                    Found {searchResults.length} Main Block matches
                  </div>
                  {searchResults.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => handleSelectRoom(r)}
                      className="p-3 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400">
                            Floor {r.floor} · {r.number}
                          </span>
                          <h4 className="font-semibold text-xs text-[var(--text-primary)] truncate">
                            {r.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate">
                          {r.department} {r.year ? `· Year ${r.year}` : ''} · {r.category}
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-[var(--text-muted)] shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Category Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'All Spaces' },
                { id: 'classroom', label: 'Classrooms' },
                { id: 'laboratory', label: 'Labs' },
                { id: 'administrative', label: 'Admin' },
                { id: 'seminar', label: 'Seminar Halls' },
                { id: 'facility', label: 'Facilities' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveCategoryFilter(f.id)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all ${
                    activeCategoryFilter === f.id
                      ? 'bg-[var(--text-primary)] text-[var(--bg-base)] shadow-sm'
                      : 'glass-btn glass-btn-ghost text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main View Content Area ── */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-5 flex-1">
        {viewMode === 'directions' ? (
          /* ========================================================== */
          /* 🧭 ROUTE DIRECTIONS JOURNEY VIEW (VERTICAL TIMELINE + OVERVIEW) */
          /* ========================================================== */
          <div className="space-y-6">
            {/* Horizontal Controls Form */}
            <div className="glass-card rounded-xl p-5 md:p-6 border border-[var(--glass-border)] bg-[var(--bg-elevated)] shadow-lg">
              <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3 w-full">
                {/* Starting Point */}
                <div className="flex-1 min-w-0">
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 block font-semibold">
                    Starting Location:
                  </label>
                  <select
                    value={startPointId}
                    onChange={(e) => setStartPointId(e.target.value)}
                    className="w-full glass-select rounded-2xl px-4 py-3 text-xs md:text-sm font-semibold border border-[var(--glass-border)] bg-[var(--bg-surface)] text-[var(--text-primary)] cursor-pointer truncate shadow-xs focus:border-cyan-500/50"
                  >
                    <option value="entrance">Main Entrance (Ground Floor Atrium)</option>
                    {MAIN_BLOCK_ROOMS.map((r) => (
                      <option key={`start-${r.id}`} value={r.id}>
                        Floor {r.floor} · {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <button
                  onClick={handleSwapDirections}
                  className="glass-btn rounded-2xl w-11 h-11 p-0 flex items-center justify-center shrink-0 mb-0.5 self-center md:self-end hover:rotate-180 transition-transform duration-300 shadow-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  title="Swap Points"
                >
                  <RefreshCcw size={15} />
                </button>

                {/* Destination Point */}
                <div className="flex-1 min-w-0">
                  <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 block font-semibold">
                    Destination Room:
                  </label>
                  <select
                    value={destPointId}
                    onChange={(e) => setDestPointId(e.target.value)}
                    className="w-full glass-select rounded-2xl px-4 py-3 text-xs md:text-sm font-semibold border border-[var(--glass-border)] bg-[var(--bg-surface)] text-[var(--text-primary)] cursor-pointer truncate shadow-xs focus:border-cyan-500/50"
                  >
                    <option value="">Select destination room...</option>
                    {MAIN_BLOCK_ROOMS.map((r) => (
                      <option key={`dest-${r.id}`} value={r.id}>
                        Floor {r.floor} · {r.name} ({r.number})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-stretch md:self-end">
                  <button
                    onClick={handleCalculateRoute}
                    disabled={!startPointId || !destPointId || startPointId === destPointId}
                    className="flex-1 md:flex-none glass-btn glass-btn-primary rounded-2xl py-3 px-6 whitespace-nowrap h-[46px] font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none transition-all"
                  >
                    <span>Get Directions</span>
                    <ArrowRight size={15} />
                  </button>

                  {activeRoute && (
                    <button
                      onClick={handleClearRoute}
                      className="glass-btn glass-btn-ghost rounded-2xl px-3.5 h-[46px] text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      title="Clear"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Journey Grid: Vertical Timeline (Left) + Route Overview (Right) */}
            {activeRoute ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Connected Vertical Route Timeline */}
                <div className="lg:col-span-8 w-full min-w-0">
                  <RouteTimeline
                    activeRoute={activeRoute}
                    onOpenOnBlueprint={handleJumpToBlueprintFromRoute}
                  />
                </div>

                {/* Right: Route Overview & Context Panel */}
                <div className="lg:col-span-4 w-full flex flex-col gap-4">
                  <div className="glass-card rounded-xl p-5 border border-[var(--glass-border)] bg-[var(--bg-elevated)] shadow-lg space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-3">
                      <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">
                        ROUTE OVERVIEW
                      </span>
                      <span className="font-mono text-[10px] text-cyan-400 font-bold px-2 py-0.5 rounded-md bg-cyan-500/10">
                        {activeRoute.floorSummary}
                      </span>
                    </div>

                    {/* Flow chain */}
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

                    {/* Destination details */}
                    {activeRoute.toRoom && (
                      <div className="pt-3 border-t border-[var(--glass-border)] space-y-2">
                        <span className="font-mono text-[9px] uppercase font-bold tracking-wider text-[var(--text-muted)] block">
                          DESTINATION:
                        </span>
                        <div>
                          <h4 className="font-display font-bold text-sm text-[var(--text-primary)] leading-tight">
                            {activeRoute.toRoom.name}
                          </h4>
                          <p className="font-mono text-[11px] text-cyan-400 font-bold mt-0.5">
                            Floor {activeRoute.toRoom.floor} · {activeRoute.toRoom.number}
                          </p>
                          {activeRoute.toRoom.department && (
                            <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                              {activeRoute.toRoom.department} {activeRoute.toRoom.year ? `· Year ${activeRoute.toRoom.year}` : ''}
                            </p>
                          )}
                        </div>

                        {activeRoute.toRoom.status && (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>{activeRoute.toRoom.status}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* View on Blueprint Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleJumpToBlueprintFromRoute(activeRoute.toRoom.id)}
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
              /* Quick Suggestions */
              <div className="p-8 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-elevated)] text-center space-y-3">
                <Compass size={28} className="text-cyan-400 mx-auto" />
                <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                  Pick Origin & Destination
                </h3>
                <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                  Select a starting point and destination room to generate a single connected step-by-step route journey.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================== */
          /* 🏛️ FLOOR BLUEPRINT VIEW (SVG + RIGHT CONTEXT / ROOM CARD)  */
          /* ========================================================== */
          <div className="flex flex-col lg:flex-row items-stretch gap-6">
            {/* Left: The Architectural Floor Plan */}
            <div className="flex-1 min-w-0 flex flex-col rounded-xl border border-[var(--glass-border)] bg-[var(--bg-elevated)] overflow-hidden shadow-xl">
              {/* Subheader info pill */}
              <div className="px-5 py-3 border-b border-[var(--glass-border)] flex items-center justify-between text-xs bg-[var(--bg-surface)]/50">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-sm text-[var(--text-primary)]">
                    Level {currentFloorMeta.shortLabel}
                  </span>
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="text-[var(--text-secondary)] truncate">
                    {currentFloorMeta.subtitle}
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-[var(--text-muted)]">
                  <span>{currentFloorRooms.length} Units</span>
                </div>
              </div>

              {/* Interactive SVG Blueprint */}
              <div className="flex-1 w-full relative">
                <MainBlockFloorPlan
                  floor={selectedFloor}
                  rooms={currentFloorRooms}
                  selectedRoomId={activeRoom?.id}
                  highlightedRoomId={destPointId || activeRoom?.id}
                  activeRoute={activeRoute}
                  onSelectRoom={handleSelectRoom}
                  theme={theme}
                />
              </div>
            </div>

            {/* Right: Room Information Panel / Level Quick Context */}
            <div className="w-full lg:w-96 shrink-0 flex flex-col gap-4">
              {activeRoom ? (
                /* Selected Room Details Card */
                <div className="glass-card rounded-xl p-6 border border-[var(--glass-border-strong)] bg-[var(--bg-elevated)] shadow-xl space-y-5">
                  {/* Header with Type & Status */}
                  <div className="flex items-start justify-between gap-3 border-b border-[var(--glass-border)] pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            background: ROOM_TYPE_CONFIG[activeRoom.type]?.bgColor || 'rgba(59, 130, 246, 0.15)',
                            color: ROOM_TYPE_CONFIG[activeRoom.type]?.color || '#3b82f6',
                            border: `1px solid ${ROOM_TYPE_CONFIG[activeRoom.type]?.borderColor || 'rgba(59, 130, 246, 0.3)'}`,
                          }}
                        >
                          {activeRoom.category}
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[var(--text-muted)] font-bold">
                          Floor {activeRoom.floor}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-[var(--text-primary)] leading-tight">
                        {activeRoom.name}
                      </h3>
                      <p className="font-mono text-xs text-cyan-400 font-bold mt-1">
                        Room Code: {activeRoom.code} · Number: {activeRoom.number}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveRoom(null)}
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Status & Attributes */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-lg border border-[var(--glass-border)] bg-[var(--bg-surface)]">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] block">
                        Operational Status
                      </span>
                      <div className="flex items-center gap-1.5 mt-1 font-semibold text-[var(--text-primary)]">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            background:
                              activeRoom.status === 'Available'
                                ? '#10b981'
                                : activeRoom.status === 'In Session'
                                ? '#f59e0b'
                                : '#06b6d4',
                          }}
                        />
                        <span>{activeRoom.status || 'Active'}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-[var(--glass-border)] bg-[var(--bg-surface)]">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] block">
                        Capacity
                      </span>
                      <span className="text-sm font-bold text-[var(--text-primary)] mt-1 block">
                        {activeRoom.capacity ? `${activeRoom.capacity} People` : 'Building Amenity'}
                      </span>
                    </div>

                    {activeRoom.year && (
                      <div className="p-3 rounded-lg border border-[var(--glass-border)] bg-[var(--bg-surface)] col-span-2">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] block">
                          Academic Cohort
                        </span>
                        <span className="text-xs font-bold text-blue-400 mt-1 block">
                          {activeRoom.year}nd / {activeRoom.year}rd / {activeRoom.year}th Year Students
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Department */}
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-1">
                      Department / Branch:
                    </span>
                    <p className="text-xs font-medium text-[var(--text-secondary)]">
                      {activeRoom.department}
                    </p>
                  </div>

                  {/* Directions Call-To-Action */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleStartDirectionsTo(activeRoom)}
                      className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01]"
                    >
                      <Compass size={15} />
                      <span>Get Directions To This Room</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Compact Level Directory & Quick Jump Card (NEVER a giant blank empty card) */
                <div className="glass-card rounded-xl p-5 border border-[var(--glass-border)] bg-[var(--bg-elevated)] shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-2.5">
                    <div>
                      <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-[var(--text-muted)] block">
                        LEVEL {selectedFloor} DIRECTORY
                      </span>
                      <h4 className="font-display font-bold text-sm text-[var(--text-primary)]">
                        {currentFloorMeta.label} Spaces
                      </h4>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold">
                      {currentFloorRooms.length} Spaces
                    </span>
                  </div>

                  {/* Quick Clickable Room Chips */}
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {currentFloorRooms.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => handleSelectRoom(r)}
                        className="p-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-surface)] hover:border-cyan-500/40 cursor-pointer transition-colors flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-[var(--text-primary)] truncate">
                            {r.name}
                          </p>
                          <p className="font-mono text-[10px] text-[var(--text-muted)] truncate">
                            {r.number} · {r.category}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400">View →</span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Journey Shortcut */}
                  <div className="pt-2 border-t border-[var(--glass-border)]">
                    <button
                      onClick={() => setViewMode('directions')}
                      className="w-full py-2 px-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Compass size={13} />
                      <span>Open Route Directions</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
