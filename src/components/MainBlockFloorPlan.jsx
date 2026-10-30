import { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw, X } from 'lucide-react';
import { ROOM_TYPE_CONFIG, matchesCategory } from '../data/mainBlockData';

const VIEW_W = 960;
const VIEW_H = 540;

export default function MainBlockFloorPlan({
  floor,
  rooms = [],
  selectedRoomId = null,
  highlightedRoomId = null,
  activeRoute = null,
  activeCategoryFilter = 'all',
  onSelectCategory,
  onSelectRoom,
  onFloorChange,
  theme = 'dark',
}) {
  const containerRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isDark = theme === 'dark';
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const isCategoryFiltered = Boolean(activeCategoryFilter && activeCategoryFilter !== 'all');

  // Reset zoom & pan when floor changes
  useEffect(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }, [floor]);

  // Center on room if selected
  useEffect(() => {
    if (selectedRoomId) {
      const room = rooms.find((r) => r.id === selectedRoomId);
      if (room && room.rect) {
        if (zoomLevel > 1.2) {
          const cx = room.rect.x + room.rect.w / 2;
          const cy = room.rect.y + room.rect.h / 2;
          const targetPanX = (VIEW_W / 2 - cx) * 0.4;
          const targetPanY = (VIEW_H / 2 - cy) * 0.4;
          setPanOffset({ x: targetPanX, y: targetPanY });
        }
      }
    }
  }, [selectedRoomId, rooms, zoomLevel]);

  // Fullscreen toggle handler
  const handleToggleFullscreen = useCallback(async () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        if (containerRef.current && containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } catch {
        // Viewport CSS overlay handles fullscreen even if browser denies native fullscreen
      }
    } else {
      setIsFullscreen(false);
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
      } catch {
        // Handled
      }
    }
  }, [isFullscreen]);

  // Sync fullscreen state with native browser events and Esc key
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNative = Boolean(document.fullscreenElement);
      if (!isNative && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        handleToggleFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, handleToggleFullscreen]);

  // Handle Zoom
  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.4, +(z + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.8, +(z - 0.25).toFixed(2)));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Pan interactions
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('.room-clickable')) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  // Palette definitions
  const blueprintBg = isDark ? '#0c1017' : '#f5f7fb';
  const wallStroke = isDark ? '#38bdf8' : '#0284c7';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';

  // Green Corridor Colors (The user's drawn green path!)
  const greenCorridorFill = isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.16)';
  const greenCorridorStroke = '#10b981';

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? "fixed inset-0 z-[9999] w-screen h-screen overflow-hidden select-none flex flex-col justify-between p-3 sm:p-5 md:p-6 transition-all duration-200"
          : "relative w-full h-full min-h-[480px] md:min-h-[540px] rounded-2xl overflow-hidden select-none flex flex-col justify-between"
      }
      style={{
        backgroundColor: blueprintBg,
        boxShadow: isFullscreen ? 'none' : 'inset 0 0 60px rgba(0, 0, 0, 0.3)',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* ── Top Bar / Header Section ── */}
      {isFullscreen ? (
        /* Fullscreen Integrated Navigation Bar */
        <div className="z-20 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--glass-border)] bg-[var(--bg-elevated)]/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-xl">
          {/* Floor & Corridor Metadata */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                Level {floor} Architectural Blueprint (Fullscreen)
              </span>
              <span className="font-mono text-[10px] text-emerald-700 dark:text-[#6EE7B7] border-l border-[var(--glass-border)] pl-2 font-bold">
                Green Path = Corridor
              </span>
            </div>

            {/* Quick Floor Switcher inside Fullscreen */}
            {onFloorChange && (
              <div className="flex items-center gap-1 border-l border-[var(--glass-border)] pl-3">
                {['G', '1', '2', '3'].map((flId) => (
                  <button
                    key={flId}
                    onClick={() => onFloorChange(flId)}
                    className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all ${
                      String(floor) === flId
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/25'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    {flId === 'G' ? 'Ground' : `Floor ${flId}`}
                  </button>
                ))}
              </div>
            )}

            {/* Category Filter Pills in Fullscreen */}
            {onSelectCategory && (
              <div className="hidden lg:flex items-center gap-1 border-l border-[var(--glass-border)] pl-3">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'classroom', label: 'Classrooms' },
                  { id: 'laboratory', label: 'Labs' },
                  { id: 'administrative', label: 'Admin' },
                  { id: 'seminar', label: 'Seminars' },
                  { id: 'facility', label: 'Facilities' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      activeCategoryFilter === cat.id
                        ? 'bg-[var(--text-primary)] text-[var(--bg-base)] font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Toolbar: Zoom + Exit Fullscreen */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 border border-[var(--glass-border)] transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 border border-[var(--glass-border)] transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <button
              onClick={handleResetZoom}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 border border-[var(--glass-border)] transition-colors"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              <RotateCcw size={14} />
            </button>
            <span className="font-mono text-xs px-2 text-[var(--text-muted)] font-semibold">
              {Math.round(zoomLevel * 100)}%
            </span>

            <button
              onClick={handleToggleFullscreen}
              className="px-3.5 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm ml-2"
              title="Exit Fullscreen (Esc)"
              aria-label="Exit Fullscreen"
            >
              <Minimize2 size={14} />
              <span>Exit Fullscreen</span>
            </button>
          </div>
        </div>
      ) : (
        /* Normal Mode Watermark + Floating Controls */
        <>
          {/* Blueprint Header Watermark */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-[var(--bg-elevated)]/90 backdrop-blur-md shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[var(--text-primary)]">
                  LEVEL {floor} ARCHITECTURAL BLUEPRINT
                </span>
                <span className="font-mono text-[9px] text-emerald-700 dark:text-[#6EE7B7] border-l border-[var(--glass-border)] pl-2 font-bold">
                  GREEN PATH = CORRIDOR
                </span>
              </div>
            </div>
          </div>

          {/* Floating View Controls */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 p-1 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-elevated)]/90 backdrop-blur-md shadow-md">
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <button
              onClick={handleResetZoom}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Reset Zoom (100%)"
              aria-label="Reset Zoom"
            >
              <RotateCcw size={14} />
            </button>
            <span
              onClick={handleResetZoom}
              className="font-mono text-[10px] px-2 py-0.5 text-[var(--text-muted)] border-l border-[var(--glass-border)] font-semibold cursor-pointer hover:text-[var(--text-primary)]"
              title="Click to reset zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </span>
            <div className="h-4 w-px bg-[var(--glass-border)] my-auto" />
            <button
              onClick={handleToggleFullscreen}
              className="h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Open Blueprint in Fullscreen"
              aria-label="Fullscreen Blueprint"
            >
              <Maximize2 size={14} />
              <span className="hidden sm:inline text-[11px] font-semibold">Fullscreen</span>
            </button>
          </div>
        </>
      )}

      {/* Main Interactive SVG Blueprint Canvas */}
      <div className={`flex-1 w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing p-2 md:p-3 ${isFullscreen ? 'max-h-[calc(100vh-140px)]' : ''}`}>
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full h-full max-h-[640px] transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          <defs>
            {/* Selected Room Beacon Filter */}
            <filter id="bp-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Clean Outer Perimeter Wall */}
          <rect
            x="30"
            y="20"
            width="900"
            height="500"
            rx="12"
            fill="none"
            stroke={wallStroke}
            strokeWidth="2.5"
            strokeOpacity="0.8"
          />

          {/* ============================================================== */}
          {/* 🌿 THE GREEN CORRIDOR WALKWAY SYSTEM (Matches Blueprint)      */}
          {/* ============================================================== */}
          <g id="green-corridor-group">
            {/* Top Corridor (Horizontal) */}
            <rect
              x="35"
              y="110"
              width="890"
              height="45"
              fill={greenCorridorFill}
              stroke={greenCorridorStroke}
              strokeWidth="2"
            />
            {/* Bottom Corridor (Horizontal) */}
            <rect
              x="35"
              y="365"
              width="890"
              height="45"
              fill={greenCorridorFill}
              stroke={greenCorridorStroke}
              strokeWidth="2"
            />
            {/* Left Corridor (Vertical) */}
            <rect
              x="240"
              y="110"
              width="50"
              height="300"
              fill={greenCorridorFill}
              stroke={greenCorridorStroke}
              strokeWidth="2"
            />
            {/* Right Corridor (Vertical) */}
            <rect
              x="670"
              y="110"
              width="50"
              height="300"
              fill={greenCorridorFill}
              stroke={greenCorridorStroke}
              strokeWidth="2"
            />
            {/* South Main Entrance Concourse Corridor */}
            <rect
              x="445"
              y="410"
              width="70"
              height="105"
              fill={greenCorridorFill}
              stroke={greenCorridorStroke}
              strokeWidth="2"
            />

            {/* Clean Corridor Labels Without Arrows / Clutter */}
            <g opacity="0.6" pointerEvents="none">
              <text
                x="265"
                y="136"
                textAnchor="middle"
                fill="#10b981"
                fontSize="9.5"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="1"
              >
                NORTH CORRIDOR
              </text>
              <text
                x="695"
                y="136"
                textAnchor="middle"
                fill="#10b981"
                fontSize="9.5"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="1"
              >
                NORTH CORRIDOR
              </text>
              <text
                x="480"
                y="392"
                textAnchor="middle"
                fill="#10b981"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="2"
              >
                SOUTH CORRIDOR
              </text>
              <text
                x="265"
                y="265"
                textAnchor="middle"
                fill="#10b981"
                fontSize="9.5"
                fontFamily="monospace"
                fontWeight="bold"
                transform="rotate(-90 265 265)"
                letterSpacing="1.5"
              >
                WEST CORRIDOR
              </text>
              <text
                x="695"
                y="265"
                textAnchor="middle"
                fill="#10b981"
                fontSize="9.5"
                fontFamily="monospace"
                fontWeight="bold"
                transform="rotate(90 695 265)"
                letterSpacing="1.5"
              >
                EAST CORRIDOR
              </text>
            </g>
          </g>

          {/* ============================================================== */}
          {/* ☀️ CENTRAL "OPEN TOP" COURTYARD ATRIUM                          */}
          {/* ============================================================== */}
          <g id="central-open-top-courtyard" pointerEvents="none">
            {/* Courtyard Boundary with Clean Soft Tint */}
            <rect
              x="290"
              y="155"
              width="380"
              height="210"
              rx="10"
              fill="rgba(56, 189, 248, 0.05)"
              stroke="rgba(56, 189, 248, 0.45)"
              strokeWidth="2"
            />
            {/* Prominent Architectural Center Text */}
            <text
              x="480"
              y="250"
              textAnchor="middle"
              fill="#38bdf8"
              fontSize="24"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="900"
              letterSpacing="3"
            >
              Open top
            </text>
            <text
              x="480"
              y="275"
              textAnchor="middle"
              fill={textMuted}
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
              letterSpacing="1.5"
            >
              [CENTRAL COURTYARD · OPEN TO SKY]
            </text>
          </g>

          {/* Main Entrance Marker at South Center */}
          <g transform="translate(480, 515)" pointerEvents="none">
            <path d="M -25 0 L 25 0" stroke="#10b981" strokeWidth="3.5" />
            <polygon points="0,-7 -7,0 7,0" fill="#10b981" />
            <text
              x="0"
              y="-10"
              textAnchor="middle"
              fill="#10b981"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="black"
              letterSpacing="1.5"
            >
              ▲ MAIN ENTRANCE
            </text>
          </g>

          {/* ============================================================== */}
          {/* 🚪 RENDER ROOMS FROM ARCHITECTURAL BLUEPRINT                     */}
          {/* ============================================================== */}
          {rooms.map((room) => {
            const { x, y, w, h } = room.rect;
            const isSelected = selectedRoomId === room.id;
            const isHighlighted = highlightedRoomId === room.id;
            const isHovered = hoveredRoom === room.id;
            const typeCfg = ROOM_TYPE_CONFIG[room.type] || ROOM_TYPE_CONFIG.classroom;
            const isCategoryMatch = !isCategoryFiltered || matchesCategory(room, activeCategoryFilter);

            // Room background and border styling
            let roomFill = typeCfg.bgColor;
            let roomStroke = typeCfg.borderColor;
            let strokeW = 1.8;

            if (isSelected) {
              roomFill = typeCfg.accentBg;
              roomStroke = '#38bdf8';
              strokeW = 3.8;
            } else if (isHighlighted) {
              roomFill = typeCfg.accentBg;
              roomStroke = '#f59e0b';
              strokeW = 2.8;
            } else if (isHovered) {
              roomFill = typeCfg.accentBg;
              roomStroke = typeCfg.color;
              strokeW = 2.4;
            } else if (isCategoryFiltered && isCategoryMatch) {
              // High-visibility category highlight
              roomFill = typeCfg.accentBg;
              roomStroke = typeCfg.color || '#38bdf8';
              strokeW = 3.0;
            }

            const isTransit = room.type === 'transit';
            const isStairs = room.type === 'transit' || (room.id && room.id.includes('stairs')) || (room.code && room.code.startsWith('ST'));
            const isBoardRoom = room.name.toLowerCase().includes('board');
            const isNumbersOnlyFloor = String(floor) === '2' || String(floor) === '3';
            const cx = Math.round(x + w / 2);
            const cy = Math.round(y + h / 2);

            return (
              <g
                key={room.id}
                className="room-clickable cursor-pointer transition-all duration-200"
                onClick={() => onSelectRoom && onSelectRoom(room)}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                opacity={isCategoryMatch ? 1 : 0.22}
              >
                {/* Clean Noise-Free Room Box */}
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx="6"
                  fill={isStairs ? 'rgba(245, 158, 11, 0.16)' : roomFill}
                  stroke={isStairs ? '#f59e0b' : roomStroke}
                  strokeWidth={strokeW}
                  filter={isSelected || (isCategoryFiltered && isCategoryMatch) ? 'url(#bp-glow)' : undefined}
                />

                {/* Room Typography */}
                <g pointerEvents="none">
                  {isStairs ? (
                    <g>
                      <text
                        x={cx}
                        y={cy + 4}
                        textAnchor="middle"
                        fill={isSelected ? '#38bdf8' : '#f59e0b'}
                        fontSize="11.5"
                        fontFamily="system-ui, -apple-system, sans-serif"
                        fontWeight="800"
                        letterSpacing="0.5"
                      >
                        Staircase
                      </text>
                    </g>
                  ) : isNumbersOnlyFloor ? (
                    <g>
                      {/* Floors 2 & 3: ROOM NUMBERS ONLY */}
                      <text
                        x={cx}
                        y={cy + 7}
                        textAnchor="middle"
                        fill={isSelected ? '#38bdf8' : typeCfg.color}
                        fontSize={w < 110 ? '16' : '19'}
                        fontFamily="monospace"
                        fontWeight="900"
                        letterSpacing="1"
                      >
                        {room.number}
                      </text>

                      {/* Operational Status Dot */}
                      {room.status && (
                        <circle
                          cx={cx + (room.number ? String(room.number).length * 6 + 10 : 28)}
                          cy={cy - 4}
                          r="3.5"
                          fill={
                            room.status === 'Available'
                              ? '#10b981'
                              : room.status === 'In Session'
                              ? '#f59e0b'
                              : '#06b6d4'
                          }
                        />
                      )}
                    </g>
                  ) : (
                    <g>
                      {/* Room Number / Identifier Badge Centered */}
                      <text
                        x={cx}
                        y={h >= 80 ? cy - 12 : cy - 5}
                        textAnchor="middle"
                        fill={isSelected ? '#38bdf8' : typeCfg.color}
                        fontSize={w < 100 ? '10' : '11.5'}
                        fontFamily="monospace"
                        fontWeight="900"
                        letterSpacing="0.5"
                      >
                        {room.number}
                      </text>

                      {/* Operational Status Dot */}
                      {room.status && (
                        <circle
                          cx={w > 120 ? cx + (room.number ? String(room.number).length * 4.5 + 8 : 22) : x + w - 10}
                          cy={h >= 80 ? cy - 15 : cy - 8}
                          r="3"
                          fill={
                            room.status === 'Available'
                              ? '#10b981'
                              : room.status === 'In Session'
                              ? '#f59e0b'
                              : '#06b6d4'
                          }
                        />
                      )}

                      {/* Room Title Centered in Middle */}
                      <text
                        x={cx}
                        y={h >= 80 ? cy + 6 : cy + 9}
                        textAnchor="middle"
                        fill={textPrimary}
                        fontSize={w < 120 ? '10.5' : w > 300 ? '13' : '11.5'}
                        fontFamily="system-ui, -apple-system, sans-serif"
                        fontWeight="700"
                      >
                        {room.shortName.length > 32 ? `${room.shortName.substring(0, 30)}…` : room.shortName}
                      </text>

                      {/* Board Room Indicator on Ground Floor */}
                      {isBoardRoom && floor === 'G' && (
                        <text
                          x={cx}
                          y={cy + 22}
                          textAnchor="middle"
                          fill="#f59e0b"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          ★ GROUND ONLY
                        </text>
                      )}

                      {/* Department subtitle if space permits */}
                      {h >= 80 && !isTransit && !isBoardRoom && room.department && (
                        <text
                          x={cx}
                          y={cy + 22}
                          textAnchor="middle"
                          fill={textMuted}
                          fontSize="9"
                          fontFamily="system-ui, -apple-system, sans-serif"
                        >
                          {room.department.length > 28 ? `${room.department.substring(0, 26)}…` : room.department}
                        </text>
                      )}

                      {/* Capacity indicator */}
                      {room.capacity && h >= 95 && (
                        <text
                          x={cx}
                          y={y + h - 10}
                          textAnchor="middle"
                          fill={textMuted}
                          fontSize="8.5"
                          fontFamily="monospace"
                        >
                          CAP: {room.capacity}
                        </text>
                      )}
                    </g>
                  )}
                </g>

                {/* Selected Beacon */}
                {isSelected && (
                  <g transform={`translate(${x + w / 2}, ${y - 8})`} pointerEvents="none">
                    <circle r="5" fill="#38bdf8" />
                    <circle r="12" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6">
                      <animate attributeName="r" values="5;14;5" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </g>
                )}
              </g>
            );
          })}

          {/* ============================================================== */}
          {/* 🚀 ANIMATED ROUTE PATH ALONG THE GREEN CORRIDOR                 */}
          {/* ============================================================== */}
          {activeRoute && activeRoute.pathPoints && activeRoute.pathPoints.length > 1 && (
            <g pointerEvents="none">
              {/* Pulsing Corridor Glow */}
              <polyline
                points={activeRoute.pathPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#10B981"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.3"
              />
              {/* Crisp Animated High-Contrast Corridor Polyline */}
              <polyline
                points={activeRoute.pathPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#34D399"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8 5"
              >
                <animate attributeName="stroke-dashoffset" values="26;0" dur="1.2s" repeatCount="indefinite" />
              </polyline>

              {/* Start Point Marker (Emerald) */}
              <circle
                cx={activeRoute.pathPoints[0].x}
                cy={activeRoute.pathPoints[0].y}
                r="7"
                fill="#10B981"
                stroke="#ffffff"
                strokeWidth="2"
              />
              {/* Destination Point Marker (Red/Coral) */}
              <circle
                cx={activeRoute.pathPoints[activeRoute.pathPoints.length - 1].x}
                cy={activeRoute.pathPoints[activeRoute.pathPoints.length - 1].y}
                r="7"
                fill="#EF4444"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Blueprint Legend / Fullscreen Inspection Drawer */}
      {isFullscreen && selectedRoom ? (
        <div className="px-5 py-3 border-t border-[var(--glass-border)] bg-[var(--bg-elevated)]/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 rounded-xl shadow-2xl z-20">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider shrink-0"
              style={{
                background: ROOM_TYPE_CONFIG[selectedRoom.type]?.bgColor || 'rgba(56, 189, 248, 0.15)',
                color: ROOM_TYPE_CONFIG[selectedRoom.type]?.color || '#38bdf8',
                border: `1px solid ${ROOM_TYPE_CONFIG[selectedRoom.type]?.borderColor || 'rgba(56, 189, 248, 0.3)'}`,
              }}
            >
              {selectedRoom.category}
            </span>
            <div className="min-w-0">
              <h4 className="font-display font-bold text-sm text-[var(--text-primary)] truncate">
                {selectedRoom.name}
              </h4>
              <p className="font-mono text-xs text-cyan-400 font-bold">
                Floor {selectedRoom.floor} · Code: {selectedRoom.code} · Number: {selectedRoom.number}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                handleToggleFullscreen();
                onSelectRoom && onSelectRoom(selectedRoom);
              }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-transform hover:scale-105"
            >
              View Full Details →
            </button>
            <button
              onClick={() => onSelectRoom && onSelectRoom(null)}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10"
              title="Close inspection"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-2 border-t border-[var(--glass-border)] bg-[var(--bg-elevated)]/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs select-none z-20">
          <div className="flex items-center gap-3.5 flex-wrap">
            <span className="font-mono text-[10px] text-emerald-700 dark:text-[#6EE7B7] uppercase tracking-wider font-bold">
              ARCHITECTURAL KEY:
            </span>
            <div className="flex items-center gap-3 flex-wrap text-[11px] text-[var(--text-secondary)]">
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-[#6EE7B7]">
                <span className="w-3 h-2 rounded-sm bg-emerald-500 border border-emerald-400" />
                Green Path = Corridor
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: ROOM_TYPE_CONFIG.classroom.color }} />
                Classrooms
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: ROOM_TYPE_CONFIG.laboratory.color }} />
                Central Lab (Floor 1)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: ROOM_TYPE_CONFIG.seminar.color }} />
                Seminar Hall
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: ROOM_TYPE_CONFIG.administrative.color }} />
                Dept / Sections
              </span>
              <span className="inline-flex items-center gap-1.5 font-bold text-[#38bdf8]">
                <span className="w-2.5 h-2.5 rounded-sm border border-cyan-400 bg-cyan-500/20" />
                Open Top Courtyard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px] text-[var(--text-muted)]">
            <span>Click any room to inspect details &amp; route</span>
            {isFullscreen && (
              <button
                onClick={handleToggleFullscreen}
                className="text-cyan-400 hover:underline font-bold"
              >
                Exit Fullscreen (Esc)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
