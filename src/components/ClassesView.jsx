import { useState, useContext } from 'react';
import { getFacultyById, getRoomById, CLASSES as DEFAULT_CLASSES } from '../data';
import { AppContext } from '../context/AppContext';
import { Search, X, Info, ArrowRight, BookOpen, Users, MapPin } from 'lucide-react';

export default function ClassesView() {
  const { classes = [], setToNode, navigateTo, theme } = useContext(AppContext);
  const activeClasses = classes.length > 0 ? classes : DEFAULT_CLASSES;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedBuilding, setSelectedBuilding] = useState('ALL');
  const [selectedClassId, setSelectedClassId] = useState(activeClasses[0]?.id || 'cs_2a');
  const [roomModal, setRoomModal] = useState(null);

  // Single department button instead of duplicates
  const departments = ['ALL', 'Computer Science'];

  // Derive buildings where classes are held
  const buildingIds = [...new Set(activeClasses.map((c) => {
    const r = getRoomById(c.roomId);
    return r?.building;
  }).filter(Boolean))];
  const buildings = ['ALL', ...buildingIds];

  const filtered = activeClasses.filter((cls) => {
    const deptOk = selectedDept === 'ALL' || cls.department === selectedDept || cls.department.toLowerCase().includes(selectedDept.toLowerCase());
    const room = getRoomById(cls.roomId);
    const buildingOk = selectedBuilding === 'ALL' || (room && room.building === selectedBuilding);
    const q = searchQuery.toLowerCase().trim();
    const searchOk =
      !q ||
      cls.name.toLowerCase().includes(q) ||
      cls.shortName.toLowerCase().includes(q) ||
      cls.department.toLowerCase().includes(q) ||
      (room && room.number.toLowerCase().includes(q));

    return deptOk && buildingOk && searchOk;
  });

  // Selected class is derived from filtered classes, updating whenever selection or filter changes
  const selectedClass = filtered.find((c) => c.id === selectedClassId) || filtered[0] || null;
  const isDark = theme === 'dark';

  const handleSimulateRoute = (buildingId) => {
    setToNode(buildingId);
    setRoomModal(null);
    navigateTo('route');
  };

  return (
    <div className="px-4 md:px-8 pt-4 pb-12 max-w-6xl mx-auto page-enter space-y-6">
      {/* Header */}
      <div>
        <p className="font-mono text-[10px] text-[var(--gold)] uppercase tracking-widest mb-1.5 font-bold">
          [CLASS_DIRECTORY · ACADEMIC REGISTRY]
        </p>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)]">
          Classes.
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          {activeClasses.length} academic cohorts across {departments.length - 1} departments with assigned lecture rooms.
        </p>
      </div>

      {/* Classroom Discovery Filters: Search + Building + Department */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search classes by name, section (e.g. CS-2A), department, or room number..."
            className="w-full glass-input pl-11 pr-5 py-3 rounded-full text-xs sm:text-sm font-medium shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Department pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 max-w-full">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mr-1 shrink-0">
              Dept:
            </span>
            {departments.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDept(d)}
                className={`font-mono text-[10px] px-3.5 py-1.5 rounded-full border transition-all shrink-0 ${
                  selectedDept === d
                    ? 'bg-[var(--gold)] text-white font-bold border-[var(--gold)] shadow-xs scale-102'
                    : 'glass-1 border-[var(--glass-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {d === 'ALL' ? 'ALL DEPTS' : d}
              </button>
            ))}
          </div>

          {/* Building pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 max-w-full">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mr-1 shrink-0">
              Building:
            </span>
            {buildings.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBuilding(b)}
                className={`font-mono text-[10px] px-3.5 py-1.5 rounded-full border transition-all shrink-0 ${
                  selectedBuilding === b
                    ? 'bg-blue-500 text-white font-bold border-blue-500 shadow-xs scale-102'
                    : 'glass-1 border-[var(--glass-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {b === 'ALL' ? 'ALL BUILDINGS' : b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT ON WIDE SCREENS (50/50 or 5/7 split), SINGLE COLUMN ON MOBILE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Class List Column (5 cols on wide screens) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">
              Class Cohorts ({filtered.length})
            </span>
            <span className="font-mono text-[9px] text-[var(--text-subtle)]">
              Select class to view details
            </span>
          </div>

          <div className="space-y-3 max-h-[720px] overflow-y-auto scrollbar-thin pr-1">
            {filtered.length === 0 ? (
              <div className="p-8 text-center glass-card rounded-xl border border-dashed border-[var(--glass-border)]">
                <p className="font-mono text-xs text-[var(--text-muted)]">No classes match your filter criteria.</p>
              </div>
            ) : (
              filtered.map((cls) => {
                const isSelected = selectedClass?.id === cls.id;
                const room = getRoomById(cls.roomId);

                return (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`w-full text-left p-4 sm:p-5 rounded-xl glass-card border transition-all duration-200 select-none group relative ${
                      isSelected
                        ? 'border-[var(--gold)] bg-[var(--gold)]/10 shadow-md scale-[1.01]'
                        : 'border-[var(--glass-border)] hover:border-[var(--glass-border-strong)] hover:bg-[var(--glass-2)] hover:shadow-sm'
                    }`}
                    id={`class-card-${cls.id}`}
                  >
                    {/* Top Row: Section Code & Year Tag */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`font-mono text-[11px] font-bold px-3 py-1 rounded-md border shadow-xs ${
                          isSelected
                            ? 'bg-[var(--gold)] text-white border-[var(--gold)]'
                            : 'bg-[var(--glass-2)] text-[var(--text-primary)] border-[var(--glass-border)] group-hover:border-[var(--gold)]/50'
                        }`}
                      >
                        {cls.shortName}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--text-muted)] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md glass-1">
                        Year {cls.year} · Sec {cls.section}
                      </span>
                    </div>

                    {/* Class Name */}
                    <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] leading-snug">
                      {cls.name}
                    </h3>
                    <p className="font-mono text-[10.5px] text-[var(--text-muted)] mt-1">
                      {cls.department}
                    </p>

                    {/* Bottom Row: Strength & Room ID */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[var(--glass-border)] text-xs font-mono">
                      <span className="text-[var(--text-secondary)] flex items-center gap-1">
                        <Users size={12} className="text-[var(--text-muted)]" />
                        <span>{cls.strength} students</span>
                      </span>

                      {room ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[var(--gold)]/15 border border-[var(--gold)]/30 text-[var(--gold)] font-bold text-[11px]">
                          <MapPin size={11} />
                          <span>Room {room.number}</span>
                        </span>
                      ) : (
                        <span className="text-[var(--text-subtle)] text-[10px]">Room Pending</span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Selected-Class Detail Panel Column (7 cols on wide screens) */}
        <div className="lg:col-span-7">
          {!selectedClass ? (
            <div className="rounded-xl glass-card border border-dashed border-[var(--glass-border-strong)] min-h-[350px] flex items-center justify-center p-8">
              <div className="text-center">
                <BookOpen size={32} className="text-[var(--text-muted)] mx-auto mb-2 opacity-60" />
                <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                  SELECT A CLASS FROM THE LIST TO VIEW COMPLETE DETAILS
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl glass-card overflow-hidden border border-[var(--glass-border)] shadow-xl sticky top-4">
              {/* Class Header */}
              <div className="p-6 sm:p-7 border-b border-[var(--glass-border)] bg-[var(--glass-2)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[9px] px-2.5 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-400 font-bold uppercase tracking-wider mb-2 inline-block">
                      {selectedClass.department}
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[var(--text-primary)] leading-tight">
                      {selectedClass.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                      {selectedClass.description}
                    </p>
                  </div>
                  <span className="font-mono text-sm bg-[var(--gold)] text-white font-bold px-3.5 py-1.5 rounded-lg shrink-0 shadow-md">
                    {selectedClass.shortName}
                  </span>
                </div>
              </div>

              {/* Class Attributes Grid */}
              <div className="p-6 sm:p-7 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Year / Section Detail */}
                  <div className="rounded-lg glass-1 p-4 border border-[var(--glass-border)]">
                    <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider mb-1 font-bold">
                      Academic Standing
                    </p>
                    <p className="font-bold text-sm text-[var(--text-primary)]">
                      Year {selectedClass.year} — Section {selectedClass.section}
                    </p>
                    <p className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5">
                      Cohort ID: {selectedClass.id}
                    </p>
                  </div>

                  {/* Class Strength */}
                  <div className="rounded-lg glass-1 p-4 border border-[var(--glass-border)]">
                    <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider mb-1 font-bold">
                      Enrolled Roster
                    </p>
                    <p className="font-bold text-sm text-[var(--text-primary)]">
                      {selectedClass.strength} Enrolled Students
                    </p>
                    <p className="font-mono text-[10px] text-emerald-400 mt-0.5 font-bold">
                      ● Active Semester Attendance
                    </p>
                  </div>
                </div>

                {/* Assigned Room Region */}
                {selectedClass.roomId && (() => {
                  const room = getRoomById(selectedClass.roomId);
                  if (!room) return null;
                  return (
                    <div className="rounded-lg glass-1 p-4 sm:p-5 border border-[var(--glass-border)]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-[var(--gold)]" />
                          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">
                            Assigned Lecture Chamber
                          </p>
                        </div>
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 font-bold">
                          {room.capacity} SEATS
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
                        <div>
                          <p className="font-bold font-mono text-lg text-[var(--text-primary)]">
                            Room {room.number}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">
                            {room.building} · {room.floor} Floor · {room.type}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setRoomModal(room)}
                            className="glass-btn glass-btn-primary rounded-lg text-xs py-2 px-4 font-bold shadow-sm"
                            id="view-room-details-btn"
                          >
                            Room Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Faculty Leads Region */}
                <div>
                  <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2.5 font-bold">
                    Assigned Course Faculty
                  </p>
                  <div className="space-y-2.5">
                    {selectedClass.facultyIds?.map((fid) => {
                      const faculty = getFacultyById(fid);
                      if (!faculty) return null;
                      return (
                        <div
                          key={fid}
                          className="flex items-center justify-between rounded-lg glass-1 p-3.5 border border-[var(--glass-border)]"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0 shadow-sm"
                              style={{ background: 'linear-gradient(135deg, #087F45 0%, #34C759 100%)' }}
                            >
                              {faculty.name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-[var(--text-primary)] truncate">{faculty.name}</p>
                              <p className="font-mono text-[10px] text-[var(--text-muted)] truncate">
                                {faculty.designation} · {faculty.department}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                navigateTo('faculty');
                              }}
                              className="text-[10px] font-mono text-[var(--gold)] hover:underline font-bold"
                            >
                              View in Faculty
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {(!selectedClass.facultyIds || selectedClass.facultyIds.length === 0) && (
                      <p className="font-mono text-xs text-[var(--text-muted)]">No faculty assigned to this section.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Room Modal */}
      {roomModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md page-enter"
          onClick={() => setRoomModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="rounded-xl p-6 sm:p-7 max-w-md w-full border backdrop-blur-2xl shadow-2xl relative"
            style={{
              background: isDark ? 'rgba(18, 18, 24, 0.97)' : 'rgba(255, 255, 255, 0.97)',
              borderColor: 'var(--glass-border-strong)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="font-mono text-[10px] text-amber-500 font-bold uppercase">{roomModal.type}</p>
                <h3 className="font-mono font-bold text-2xl text-[var(--text-primary)]">Room {roomModal.number}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{roomModal.building} · {roomModal.floor} Floor</p>
              </div>
              <button
                onClick={() => setRoomModal(null)}
                className="glass-btn glass-btn-ghost rounded-lg w-8 h-8 flex items-center justify-center"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-3.5 rounded-lg glass-1 border border-[var(--glass-border)] text-xs font-mono space-y-1.5 mb-5 text-[var(--text-secondary)]">
              <div className="flex justify-between"><span>Building:</span><span className="font-bold text-[var(--text-primary)]">{roomModal.building}</span></div>
              <div className="flex justify-between"><span>Floor Level:</span><span className="font-bold text-[var(--text-primary)]">{roomModal.floor} Floor</span></div>
              <div className="flex justify-between"><span>Seating Capacity:</span><span className="font-bold text-[var(--text-primary)]">{roomModal.capacity} Seats</span></div>
              {roomModal.facilities && (
                <div className="pt-1.5 border-t border-[var(--glass-border)]">
                  <span className="text-[var(--text-muted)] block mb-1">Facilities:</span>
                  <div className="flex flex-wrap gap-1">
                    {roomModal.facilities.map((fac) => (
                      <span key={fac} className="px-2 py-0.5 rounded-md glass-2 text-[10px] font-semibold text-[var(--text-primary)]">
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 rounded-lg mb-5 text-left border flex items-start gap-2 text-xs font-mono bg-amber-500/10 border-amber-500/30 text-[var(--text-secondary)]">
              <Info size={15} className="text-amber-500 shrink-0 mt-0.5" />
              <span>Spatial tracking for this chamber is active. Waypoint pathfinding available via Main Block route simulation.</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setRoomModal(null)}
                className="flex-1 glass-btn rounded-lg py-2.5 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => handleSimulateRoute(roomModal.buildingId)}
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
