import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { ROOM_TYPE_CONFIG } from '../data/mainBlockData';

const VIEW_W = 960;
const VIEW_H = 520;

export default function MainBlockFloorPlan({
  floor,
  rooms = [],
  selectedRoomId = null,
  highlightedRoomId = null,
  activeRoute = null,
  onSelectRoom,
  theme = 'dark',
}) {
  const containerRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [hoveredRoom, setHoveredRoom] = useState(null);

  const isDark = theme === 'dark';

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
        // Softly center if zoomed
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

  // Handle Zoom
  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.4, +(z + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.8, +(z - 0.25).toFixed(2)));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Pan interactions
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Left mouse only
    // Don't drag if clicking directly on a clickable room
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
  const gridColor = isDark ? 'rgba(56, 189, 248, 0.05)' : 'rgba(15, 23, 42, 0.04)';
  const majorGridColor = isDark ? 'rgba(56, 189, 248, 0.10)' : 'rgba(15, 23, 42, 0.08)';
  const wallStroke = isDark ? '#38bdf8' : '#0284c7';
  const innerWallStroke = isDark ? 'rgba(148, 163, 184, 0.45)' : 'rgba(71, 85, 105, 0.4)';
  const corridorFill = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.6)';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[460px] md:min-h-[520px] rounded-2xl overflow-hidden select-none flex flex-col justify-between"
      style={{
        backgroundColor: blueprintBg,
        boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.25)',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Blueprint Header Watermark */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-3">
        <div className="px-3 py-1.5 rounded-lg border border-[var(--glass-border)] bg-[var(--bg-elevated)]/90 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
              LEVEL {floor} ARCHITECTURAL BLUEPRINT
            </span>
            <span className="font-mono text-[9px] text-[var(--text-muted)] border-l border-[var(--glass-border)] pl-2">
              SCALE 1:100 · 2D VECTOR
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
          title="Reset View"
          aria-label="Reset View"
        >
          <Maximize2 size={14} />
        </button>
        <span className="font-mono text-[10px] px-2 py-0.5 text-[var(--text-muted)] border-l border-[var(--glass-border)] font-semibold">
          {Math.round(zoomLevel * 100)}%
        </span>
      </div>

      {/* Main Interactive SVG Blueprint Canvas */}
      <div className="flex-1 w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing p-2 md:p-4">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full h-full max-h-[640px] transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            {/* Fine Blueprint Grid */}
            <pattern id="bp-small-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke={gridColor} strokeWidth="0.8" />
            </pattern>
            <pattern id="bp-large-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#bp-small-grid)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke={majorGridColor} strokeWidth="1.2" />
            </pattern>

            {/* Staircase Hatching Pattern */}
            <pattern id="bp-stair-hatch" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="12" stroke={isDark ? 'rgba(245, 158, 11, 0.25)' : 'rgba(217, 119, 6, 0.25)'} strokeWidth="1.5" />
            </pattern>

            {/* Selected Pulse Glow Filter */}
            <filter id="bp-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Blueprint Grid Layer */}
          <rect width={VIEW_W} height={VIEW_H} fill="url(#bp-large-grid)" />

          {/* Outer Building Footprint Walls (Crisp Architectural Double Line) */}
          <rect
            x="30"
            y="30"
            width="900"
            height="460"
            rx="12"
            fill="none"
            stroke={wallStroke}
            strokeWidth="3"
            strokeOpacity="0.85"
          />
          <rect
            x="34"
            y="34"
            width="892"
            height="452"
            rx="10"
            fill="none"
            stroke={wallStroke}
            strokeWidth="1"
            strokeOpacity="0.45"
            strokeDasharray="4 2"
          />

          {/* Central Corridor Spanning from West to East */}
          <rect
            x="110"
            y="210"
            width="740"
            height="100"
            fill={corridorFill}
            stroke={innerWallStroke}
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />

          {/* Corridor Wayfinding Label in Blueprint Typography */}
          <g transform="translate(130, 264)" opacity="0.45" pointerEvents="none">
            <text
              fill={textMuted}
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
              letterSpacing="4"
            >
              WEST CONCOURSE ◄──────────────── MAIN CENTRAL CORRIDOR ────────────────► EAST CONCOURSE
            </text>
          </g>

          {/* Entrance Marker at South Center */}
          {floor === 'G' && (
            <g transform="translate(480, 485)" pointerEvents="none">
              <path d="M -40 0 L 40 0" stroke="#10b981" strokeWidth="3" />
              <polygon points="0,-6 -6,0 6,0" fill="#10b981" />
              <text
                x="0"
                y="-10"
                textAnchor="middle"
                fill="#10b981"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="1.5"
              >
                ▲ MAIN ENTRANCE
              </text>
            </g>
          )}

          {/* Render Rooms */}
          {rooms.map((room) => {
            const { x, y, w, h } = room.rect;
            const isSelected = selectedRoomId === room.id;
            const isHighlighted = highlightedRoomId === room.id;
            const isHovered = hoveredRoom === room.id;
            const typeCfg = ROOM_TYPE_CONFIG[room.type] || ROOM_TYPE_CONFIG.classroom;

            // Room background and border styling
            let roomFill = typeCfg.bgColor;
            let roomStroke = typeCfg.borderColor;
            let strokeW = 1.5;

            if (isSelected) {
              roomFill = typeCfg.accentBg;
              roomStroke = '#38bdf8';
              strokeW = 3;
            } else if (isHighlighted) {
              roomFill = typeCfg.accentBg;
              roomStroke = '#f59e0b';
              strokeW = 2.5;
            } else if (isHovered) {
              roomFill = typeCfg.accentBg;
              roomStroke = typeCfg.color;
              strokeW = 2;
            }

            const isTransit = room.type === 'transit';
            const isStairs = room.code.includes('STAIR');

            return (
              <g
                key={room.id}
                className="room-clickable cursor-pointer transition-all duration-150"
                onClick={() => onSelectRoom && onSelectRoom(room)}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                {/* Room Boundary Box */}
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx="6"
                  fill={isStairs ? 'url(#bp-stair-hatch)' : roomFill}
                  stroke={roomStroke}
                  strokeWidth={strokeW}
                  filter={isSelected ? 'url(#bp-glow)' : undefined}
                />

                {/* Architectural Corner Notches */}
                <path
                  d={`M ${x} ${y + 8} L ${x} ${y} L ${x + 8} ${y}`}
                  fill="none"
                  stroke={roomStroke}
                  strokeWidth="2"
                  opacity="0.8"
                />
                <path
                  d={`M ${x + w - 8} ${y} L ${x + w} ${y} L ${x + w} ${y + 8}`}
                  fill="none"
                  stroke={roomStroke}
                  strokeWidth="2"
                  opacity="0.8"
                />
                <path
                  d={`M ${x} ${y + h - 8} L ${x} ${y + h} L ${x + 8} ${y + h}`}
                  fill="none"
                  stroke={roomStroke}
                  strokeWidth="2"
                  opacity="0.8"
                />
                <path
                  d={`M ${x + w - 8} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - 8}`}
                  fill="none"
                  stroke={roomStroke}
                  strokeWidth="2"
                  opacity="0.8"
                />

                {/* Door Opening Notch onto Corridor */}
                {y < 210 ? (
                  // Top row room: Door at bottom center opening onto corridor
                  <g opacity="0.75">
                    <line x1={x + w / 2 - 12} y1={y + h} x2={x + w / 2 + 12} y2={y + h} stroke={blueprintBg} strokeWidth="3" />
                    <path
                      d={`M ${x + w / 2 - 12} ${y + h} A 14 14 0 0 1 ${x + w / 2} ${y + h - 12}`}
                      fill="none"
                      stroke={roomStroke}
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  </g>
                ) : y > 260 && !isTransit ? (
                  // Bottom row room: Door at top center opening onto corridor
                  <g opacity="0.75">
                    <line x1={x + w / 2 - 12} y1={y} x2={x + w / 2 + 12} y2={y} stroke={blueprintBg} strokeWidth="3" />
                    <path
                      d={`M ${x + w / 2 - 12} ${y} A 14 14 0 0 0 ${x + w / 2} ${y + 12}`}
                      fill="none"
                      stroke={roomStroke}
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  </g>
                ) : null}

                {/* Room Content & Typography */}
                <g pointerEvents="none">
                  {/* Room Number / Identifier Badge */}
                  <text
                    x={x + 12}
                    y={y + 24}
                    fill={isSelected ? '#38bdf8' : typeCfg.color}
                    fontSize={w < 80 ? '11' : '13'}
                    fontFamily="monospace"
                    fontWeight="bold"
                    letterSpacing="0.5"
                  >
                    {room.number}
                  </text>

                  {/* Room Status Indicator Dot */}
                  {room.status && (
                    <circle
                      cx={x + w - 14}
                      cy={y + 18}
                      r="4"
                      fill={
                        room.status === 'Available'
                          ? '#10b981'
                          : room.status === 'In Session'
                          ? '#f59e0b'
                          : room.status === 'Reserved'
                          ? '#a855f7'
                          : '#06b6d4'
                      }
                    />
                  )}

                  {/* Room Title / Name */}
                  {w >= 100 && (
                    <text
                      x={x + 12}
                      y={y + 44}
                      fill={textPrimary}
                      fontSize={w < 150 ? '11' : '12'}
                      fontFamily="system-ui, -apple-system, sans-serif"
                      fontWeight="600"
                    >
                      {/* Truncate for clean architectural legibility */}
                      {room.shortName.length > 20 ? `${room.shortName.substring(0, 18)}…` : room.shortName}
                    </text>
                  )}

                  {/* Category / Department subtitle if space permits */}
                  {w >= 130 && h >= 120 && (
                    <text
                      x={x + 12}
                      y={y + 62}
                      fill={textMuted}
                      fontSize="9.5"
                      fontFamily="system-ui, -apple-system, sans-serif"
                    >
                      {room.year
                        ? `${room.year}nd/rd Year · ${room.category}`
                        : room.department.length > 24
                        ? `${room.department.substring(0, 22)}…`
                        : room.department}
                    </text>
                  )}

                  {/* Capacity Tag at bottom */}
                  {room.capacity && w >= 110 && h >= 140 && (
                    <g transform={`translate(${x + 12}, ${y + h - 16})`}>
                      <text fill={textMuted} fontSize="9" fontFamily="monospace">
                        CAP: {room.capacity}
                      </text>
                    </g>
                  )}

                  {/* Iconography for specialized rooms */}
                  {isStairs && (
                    <g transform={`translate(${x + w / 2 - 8}, ${y + h / 2 - 10})`}>
                      <text fill="#f59e0b" fontSize="16">⇅</text>
                    </g>
                  )}
                  {room.id.includes('lift') && (
                    <g transform={`translate(${x + w / 2 - 14}, ${y + h / 2 - 4})`}>
                      <text fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">LIFT</text>
                    </g>
                  )}
                  {room.name.toLowerCase().includes('water') && (
                    <g transform={`translate(${x + w / 2 - 6}, ${y + h / 2 + 4})`}>
                      <text fill="#06b6d4" fontSize="13">💧</text>
                    </g>
                  )}
                  {room.name.toLowerCase().includes('washroom') && (
                    <g transform={`translate(${x + w / 2 - 10}, ${y + h / 2 + 4})`}>
                      <text fill="#06b6d4" fontSize="12">{room.name.includes('Gents') ? '🚹' : '🚺'}</text>
                    </g>
                  )}
                </g>

                {/* Selected Room Beacon / Pin */}
                {isSelected && (
                  <g transform={`translate(${x + w / 2}, ${y - 10})`} pointerEvents="none">
                    <circle r="6" fill="#38bdf8" />
                    <circle r="12" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6">
                      <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </g>
                )}
              </g>
            );
          })}

          {/* Active Internal Direction Trajectory Path (if route active) */}
          {activeRoute && activeRoute.steps && (
            <g pointerEvents="none">
              {activeRoute.fromRoom?.rect && activeRoute.fromRoom.floor === floor && (
                <circle
                  cx={activeRoute.fromRoom.rect.x + activeRoute.fromRoom.rect.w / 2}
                  cy={activeRoute.fromRoom.rect.y + activeRoute.fromRoom.rect.h / 2}
                  r="8"
                  fill="#ef4444"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              )}
              {activeRoute.toRoom?.rect && activeRoute.toRoom.floor === floor && (
                <circle
                  cx={activeRoute.toRoom.rect.x + activeRoute.toRoom.rect.w / 2}
                  cy={activeRoute.toRoom.rect.y + activeRoute.toRoom.rect.h / 2}
                  r="8"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              )}
            </g>
          )}
        </svg>
      </div>

      {/* Blueprint Footer / Legend Ribbon */}
      <div className="px-4 py-2.5 border-t border-[var(--glass-border)] bg-[var(--bg-elevated)]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs select-none">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
            SPACE TYPES:
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: ROOM_TYPE_CONFIG.classroom.color }} />
              Classroom (2nd-4th Yr)
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: ROOM_TYPE_CONFIG.laboratory.color }} />
              Laboratory
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: ROOM_TYPE_CONFIG.administrative.color }} />
              Administrative
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: ROOM_TYPE_CONFIG.seminar.color }} />
              Seminar Hall
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: ROOM_TYPE_CONFIG.facility.color }} />
              Facility
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--text-muted)]">
          <span>Click any space to inspect & navigate</span>
        </div>
      </div>
    </div>
  );
}
