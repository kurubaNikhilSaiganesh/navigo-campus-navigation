import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { getClassById } from '../data';
import {
  Search, Mail, Phone, MapPin, ArrowLeft,
  ChevronRight, BookOpen, AlertCircle, Building2
} from 'lucide-react';

const GRAD_PALETTE = [
  'from-violet-500 to-indigo-600',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-600',
  'from-pink-400 to-rose-600',
  'from-sky-400 to-blue-600',
  'from-lime-400 to-emerald-500',
];

export default function FacultyView() {
  const {
    facultyList = [],
    activeFacultyDetailId,
    setActiveFacultyDetailId,
    locateOnMap,
  } = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeDept, setActiveDept] = useState('all');

  const departments = ['all', ...new Set(facultyList.map((f) => f.department))];

  // If a specific faculty member is selected for profile inspection
  const selectedFaculty = activeFacultyDetailId
    ? facultyList.find((f) => f.id === activeFacultyDetailId) || null
    : null;

  // Filtered list for directory
  const filtered = facultyList.filter((f) => {
    const matchesDept = activeDept === 'all' || f.department === activeDept;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      f.name.toLowerCase().includes(q) ||
      f.designation.toLowerCase().includes(q) ||
      f.department.toLowerCase().includes(q) ||
      (f.subjects && f.subjects.some((s) => s.toLowerCase().includes(q))) ||
      (f.office && f.office.toLowerCase().includes(q));
    return matchesDept && matchesSearch;
  });

  // ──────────────────────────────────────────────────────────
  // VIEW: SINGLE FACULTY MEMBER PROFILE (Opened from directory)
  // ──────────────────────────────────────────────────────────
  if (activeFacultyDetailId) {
    if (!selectedFaculty) {
      return (
        <div className="px-4 md:px-8 pt-6 pb-12 max-w-4xl mx-auto page-enter">
          <button
            onClick={() => setActiveFacultyDetailId(null)}
            className="glass-btn glass-btn-ghost rounded-full px-4 py-2 text-xs font-bold mb-6 flex items-center gap-2 hover:scale-102 transition-all"
          >
            <ArrowLeft size={14} />
            <span>Back to Faculty Directory</span>
          </button>

          <div className="glass-card rounded-xl p-10 text-center border border-dashed border-amber-500/30 max-w-md mx-auto shadow-xl">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} />
            </div>
            <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2">
              Faculty Record Not Found
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-mono mb-6 leading-relaxed">
              No faculty member matches identifier <code className="text-amber-500 font-bold">{activeFacultyDetailId}</code>.
            </p>
            <button
              onClick={() => setActiveFacultyDetailId(null)}
              className="glass-btn glass-btn-primary rounded-lg px-6 py-2.5 text-xs font-bold shadow-md"
            >
              Return to Faculty Directory
            </button>
          </div>
        </div>
      );
    }

    const initials = selectedFaculty.name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const assignedClasses = (selectedFaculty.classIds || [])
      .map((cid) => getClassById(cid))
      .filter(Boolean);

    return (
      <div className="px-4 md:px-8 pt-4 pb-12 max-w-4xl mx-auto page-enter space-y-6">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveFacultyDetailId(null)}
            className="glass-btn glass-btn-ghost rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all text-[var(--text-primary)]"
            id="back-to-directory-btn"
          >
            <ArrowLeft size={14} />
            <span>Back to Faculty Directory</span>
          </button>
          <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
            ID: {selectedFaculty.id}
          </span>
        </div>

        {/* Dedicated Single Profile Card */}
        <div className="glass-card rounded-xl border border-[var(--glass-border)] shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 border-b border-[var(--glass-border)] bg-[var(--glass-2)]">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-2xl font-black text-white shrink-0 shadow-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-600"
              >
                {initials}
              </div>

              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight">
                    {selectedFaculty.name}
                  </h1>
                  <span className="font-mono text-[9px] px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 font-bold uppercase tracking-wider">
                    {selectedFaculty.department}
                  </span>
                </div>

                <p className="font-mono text-xs text-[var(--gold)] font-bold tracking-wide">
                  {selectedFaculty.designation} · {selectedFaculty.department}
                </p>

                {/* Bio */}
                <div className="mt-4 p-4 rounded-2xl glass-1 border border-[var(--glass-border)] text-xs text-[var(--text-secondary)] leading-relaxed">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-bold mb-1">
                    About Faculty Member
                  </p>
                  <p>{selectedFaculty.bio || 'Faculty profile in Meridian Campus Guide Academic Registry.'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Email */}
              <div className="p-4 rounded-2xl glass-1 border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1">
                  <Mail size={13} className="text-violet-400" />
                  <p className="font-mono text-[9px] uppercase tracking-wider font-bold">Email</p>
                </div>
                <a
                  href={`mailto:${selectedFaculty.email}`}
                  className="font-mono text-xs font-semibold text-[var(--text-primary)] hover:text-violet-400 hover:underline break-all"
                >
                  {selectedFaculty.email}
                </a>
              </div>

              {/* Phone */}
              <div className="p-4 rounded-2xl glass-1 border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1">
                  <Phone size={13} className="text-emerald-400" />
                  <p className="font-mono text-[9px] uppercase tracking-wider font-bold">Phone</p>
                </div>
                <p className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                  {selectedFaculty.phone || 'Ext. Pending'}
                </p>
              </div>

              {/* Office */}
              <div className="p-4 rounded-2xl glass-1 border border-[var(--glass-border)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1">
                    <MapPin size={13} className="text-[var(--gold)]" />
                    <p className="font-mono text-[9px] uppercase tracking-wider font-bold">Office Location</p>
                  </div>
                  <p className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                    {selectedFaculty.office || 'Main Academic Block'}
                  </p>
                </div>
                <button
                  onClick={() => locateOnMap(selectedFaculty.buildingId || 'academic_a')}
                  className="mt-2 text-[10px] font-mono text-[var(--gold)] hover:underline flex items-center gap-1 font-bold"
                >
                  <Building2 size={11} />
                  <span>Locate Building on Map</span>
                </button>
              </div>
            </div>

            {/* Subjects */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={14} className="text-amber-400" />
                <h3 className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">
                  Subjects Taught &amp; Areas of Expertise
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(selectedFaculty.subjects || []).map((subject) => (
                  <span
                    key={subject}
                    className="font-mono text-xs px-3.5 py-1.5 rounded-full glass-1 border border-[var(--glass-border)] text-[var(--text-primary)] font-medium shadow-xs"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {/* Teaching Assignments */}
            {assignedClasses.length > 0 && (
              <div>
                <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold mb-2">
                  Assigned Classes
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {assignedClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="p-3.5 rounded-2xl glass-1 border border-[var(--glass-border)] flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-sm text-[var(--text-primary)]">{cls.name}</p>
                        <p className="font-mono text-[10px] text-[var(--text-muted)]">
                          {cls.department} · {cls.strength} Students
                        </p>
                      </div>
                      <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-500 font-bold">
                        {cls.shortName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────
  // VIEW: FACULTY DIRECTORY LIST VIEW
  // ──────────────────────────────────────────────────────────
  return (
    <div className="px-4 md:px-8 pt-4 pb-12 max-w-6xl mx-auto page-enter space-y-6">
      {/* Header with safe top spacing to prevent clipping */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-1 border border-[var(--glass-border)] mb-2">
          <span className="w-2 h-2 rounded-full bg-violet-400" />
          <span className="font-mono text-[10px] text-violet-400 uppercase tracking-widest font-bold">
            Public Faculty Directory
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)]">
          Faculty Directory.
        </h1>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Browse {facultyList.length} faculty members across {departments.length - 1} academic departments.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search faculty by name, department, designation, or subject..."
          className="glass-input pl-11 pr-5 py-3 rounded-lg text-xs sm:text-sm font-medium w-full shadow-xs"
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

      {/* Department Filter Pills */}
      <div className="flex flex-nowrap items-center gap-2 overflow-x-auto scrollbar-hide py-2 px-1 max-w-full w-full snap-x snap-mandatory overscroll-x-contain [-webkit-overflow-scrolling:touch]">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setActiveDept(dept)}
            className={`text-xs font-bold px-4 py-1.5 rounded-md border transition-all duration-300 capitalize shrink-0 snap-start ${
              activeDept === dept
                ? 'bg-[var(--gold)] border-[var(--gold)] text-white shadow-sm scale-102'
                : 'glass-1 border-[var(--glass-border)] text-[var(--text-muted)] hover:border-[var(--glass-border-strong)] hover:text-[var(--text-primary)]'
            }`}
          >
            {dept === 'all' ? 'All Departments' : dept}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-xs font-mono text-[var(--text-muted)] px-1">
        Showing {filtered.length} of {facultyList.length} faculty members
      </p>

      {/* Faculty Cards Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center border border-dashed border-[var(--glass-border-strong)]">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
            No faculty members match your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((faculty, idx) => {
            const grad = GRAD_PALETTE[idx % GRAD_PALETTE.length];
            const initials = faculty.name
              .split(' ')
              .filter(Boolean)
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={faculty.id}
                className="glass-card rounded-xl border border-[var(--glass-border)] hover:border-[var(--glass-border-strong)] hover:shadow-lg transition-all duration-200 p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  {/* Card Header: Avatar & Names */}
                  <div className="flex items-start gap-4 mb-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-extrabold text-white shrink-0 bg-gradient-to-br ${grad} shadow-md`}
                    >
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-base leading-tight text-[var(--text-primary)] truncate">
                            {faculty.name}
                          </h3>
                          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-0.5 truncate">
                            {faculty.designation}
                          </p>
                        </div>
                        <span className="font-mono text-[9px] px-2.5 py-0.5 rounded-md shrink-0 font-bold bg-violet-500/15 border border-violet-500/30 text-violet-400">
                          {faculty.department.split(' ')[0].toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Office & Email info */}
                  <div className="space-y-1 mb-3 text-xs font-mono">
                    <p className="text-[var(--text-secondary)] truncate">
                      <span className="text-[var(--text-muted)] mr-1">Office:</span>
                      {faculty.office}
                    </p>
                    <p className="text-[var(--text-secondary)] truncate">
                      <span className="text-[var(--text-muted)] mr-1">Email:</span>
                      <a href={`mailto:${faculty.email}`} className="text-violet-400 hover:underline">
                        {faculty.email}
                      </a>
                    </p>
                  </div>

                  {/* Subjects */}
                  <div className="flex flex-wrap gap-1.5">
                    {(faculty.subjects || []).slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-[9px] font-mono px-2 py-0.5 rounded-md glass-1 border border-[var(--glass-border)] text-[var(--text-muted)]"
                      >
                        {s}
                      </span>
                    ))}
                    {(faculty.subjects || []).length > 3 && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-md glass-1 text-[var(--text-subtle)]">
                        +{faculty.subjects.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions: View Profile & Find Office */}
                <div className="pt-3 border-t border-[var(--glass-border)] flex items-center justify-between gap-2">
                  <button
                    onClick={() => locateOnMap(faculty.buildingId || 'academic_a')}
                    className="glass-btn glass-btn-ghost rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--gold)]"
                    title="Locate building on campus map"
                  >
                    <MapPin size={12} />
                    <span>Locate</span>
                  </button>

                  <button
                    onClick={() => setActiveFacultyDetailId(faculty.id)}
                    className="glass-btn glass-btn-primary rounded-lg px-4 py-1.5 text-xs font-bold shadow-sm flex items-center gap-1 hover:scale-105 transition-all"
                    id={`view-profile-${faculty.id}`}
                  >
                    <span>View Profile</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
