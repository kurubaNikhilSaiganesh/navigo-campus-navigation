import { useState, useContext, useRef } from 'react';
import { CLASSES, TIMETABLE, DAYS, getCurrentDay, getRoomById } from '../data';
import { AppContext } from '../context/AppContext';
import { Clock, MapPin, CheckCircle2, Circle, ChevronDown, UploadCloud, Download, RotateCcw, FileSpreadsheet, Check } from 'lucide-react';
import { exportTimetableCSV, downloadCSV } from '../lib/csvHelper';

function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function isCurrentPeriod(startTime, endTime) {
  const now = getCurrentTime();
  return now >= startTime && now < endTime;
}

function isUpcoming(startTime) {
  return getCurrentTime() < startTime;
}

export default function TimetableView() {
  const {
    locateOnMap,
    timetableData,
    updateTimetableFromCSV,
    resetTimetableToDefault,
    hasCustomCSV
  } = useContext(AppContext);

  const fileInputRef = useRef(null);
  const [csvStatus, setCsvStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [selectedClassId, setSelectedClassId] = useState('cse_a');
  const [viewMode, setViewMode] = useState('today'); // 'today' | 'week'
  const today = getCurrentDay();
  const [mobileSelectedDay, setMobileSelectedDay] = useState(today === 'SUN' ? 'MON' : today);

  const selectedClass = CLASSES.find((c) => c.id === selectedClassId);
  const activeTimetable = timetableData || TIMETABLE;

  const todaySlots = activeTimetable
    .filter((t) => t.classId === selectedClassId && t.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const allSlots = activeTimetable.filter((t) => t.classId === selectedClassId)
    .sort((a, b) => {
      const dayOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      if (dayOrder.indexOf(a.day) !== dayOrder.indexOf(b.day)) {
        return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      }
      return a.startTime.localeCompare(b.startTime);
    });

  const slotsByDay = DAYS.reduce((acc, day) => {
    acc[day] = allSlots.filter((s) => s.day === day);
    return acc;
  }, {});

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        const result = updateTimetableFromCSV ? updateTimetableFromCSV(text) : { success: false };
        if (result.success) {
          setCsvStatus({
            type: 'success',
            message: `Timetable updated successfully from CSV! (${result.count} slots loaded across all sections)`
          });
        } else {
          setCsvStatus({
            type: 'error',
            message: result.error || 'Failed to parse CSV file. Please check file columns.'
          });
        }
        setTimeout(() => setCsvStatus(null), 6000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = () => {
    const csvContent = exportTimetableCSV(activeTimetable);
    downloadCSV('alts_college_timetable.csv', csvContent);
  };

  const handleReset = () => {
    if (resetTimetableToDefault) {
      resetTimetableToDefault();
      setCsvStatus({
        type: 'success',
        message: 'Timetable restored to college default schedule.'
      });
      setTimeout(() => setCsvStatus(null), 4000);
    }
  };

  const statusOf = (slot) => {
    if (slot.day !== today) return 'other';
    if (isCurrentPeriod(slot.startTime, slot.endTime)) return 'current';
    if (isUpcoming(slot.startTime)) return 'upcoming';
    return 'done';
  };

  return (
    <div className="px-4 md:px-8 pt-4 pb-12 max-w-5xl mx-auto page-enter space-y-6">
      {/* Header with safe top spacing to prevent clipping */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-1 border border-[var(--glass-border)] mb-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-mono text-[10px] text-amber-500 uppercase tracking-widest font-bold">
            Timetable System
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)]">
          Schedule.
        </h1>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          <span className="font-mono ml-2 text-xs text-amber-500 font-bold">· Today: {today}</span>
        </p>
      </div>

      {/* CSV Status Alert Banner */}
      {csvStatus && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-xl border font-mono text-xs animate-in fade-in ${
            csvStatus.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
              : 'bg-red-500/15 border-red-500/40 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {csvStatus.type === 'success' ? <Check size={16} /> : null}
            <span>{csvStatus.message}</span>
          </div>
          <button
            onClick={() => setCsvStatus(null)}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* CSV Quick Management Bar (for non-technical users) */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-[var(--glass-border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
            <FileSpreadsheet size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
                Timetable CSV &amp; Excel Hub
              </h3>
              {hasCustomCSV && (
                <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  Custom CSV Active
                </span>
              )}
            </div>
            <p className="font-mono text-[10.5px] text-[var(--text-muted)] mt-0.5">
              Edit timetable in Excel or Google Sheets anytime. Download the template, edit, and upload.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Download CSV button */}
          <button
            onClick={handleDownload}
            className="glass-btn glass-btn-ghost rounded-lg px-3 py-2 text-xs font-mono font-semibold flex items-center gap-1.5 hover:text-[var(--gold)]"
            title="Download CSV file to edit in Excel"
          >
            <Download size={14} />
            <span>Download CSV</span>
          </button>

          {/* Upload CSV button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,text/csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="glass-btn glass-btn-primary rounded-lg px-3.5 py-2 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95"
            title="Upload CSV file directly"
          >
            <UploadCloud size={14} />
            <span>Upload CSV</span>
          </button>

          {/* Reset button if custom CSV active */}
          {hasCustomCSV && (
            <button
              onClick={handleReset}
              className="glass-btn glass-btn-ghost rounded-lg px-2.5 py-2 text-xs font-mono text-red-400 hover:bg-red-500/10 flex items-center gap-1"
              title="Reset to default college timetable"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Controls row — cleanly aligned on both mobile and desktop */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 justify-between">
        {/* Class selector */}
        <div className="flex-1 w-full sm:max-w-md">
          <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5 font-semibold">
            Select Class
          </label>
          <div className="relative">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="glass-select rounded-lg py-2.5 pr-10 pl-4 text-xs sm:text-sm font-semibold appearance-none cursor-pointer w-full shadow-xs"
              id="class-selector"
            >
              {CLASSES.map((c) => (
                <option key={c.id} value={c.id} className="dark:bg-[#141414]">
                  {c.name} — {c.shortName}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
              <ChevronDown size={14} strokeWidth={2.5} />
            </div>
          </div>
          <p className="font-mono text-[9.5px] text-[var(--text-muted)] mt-1.5 tracking-wide">
            Public campus timetable · Select any class to view schedules and room assignments
          </p>
        </div>

        {/* View mode pills */}
        <div className="w-full sm:w-auto">
          <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5 font-semibold sm:invisible">
            View Range
          </label>
          <div className="flex p-1 rounded-lg glass-1 border border-[var(--glass-border)] gap-1 w-full sm:w-auto justify-center">
            {['today', 'week'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex-1 sm:flex-initial px-5 py-2 rounded-md text-xs sm:text-sm font-bold transition-all capitalize ${
                  viewMode === mode
                    ? 'bg-[var(--gold)] text-white shadow-sm scale-[1.02]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                id={`btn-mode-${mode}`}
              >
                {mode === 'today' ? 'Today' : 'This Week'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Class info strip */}
      {selectedClass && (
        <div className="glass-card rounded-xl p-5 border border-[var(--glass-border)] flex flex-wrap gap-4 sm:gap-6 shadow-sm">
          {[
            { label: 'Class', value: selectedClass.name },
            { label: 'Department', value: selectedClass.department },
            { label: 'Strength', value: `${selectedClass.strength} students` },
            { label: 'Year / Section', value: `Year ${selectedClass.year} — Section ${selectedClass.section}` },
          ].map((item) => (
            <div key={item.label} className="min-w-[120px]">
              <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider mb-0.5">{item.label}</p>
              <p className="font-semibold text-xs sm:text-sm text-[var(--text-primary)]">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* TODAY VIEW */}
      {viewMode === 'today' && (
        <div className="space-y-3">
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold px-1">
            {today === 'SUN' || today === 'SAT' ? 'Weekend — No regular lectures' : `Periods for Today (${today})`}
          </h2>

          {todaySlots.length === 0 ? (
            <div className="glass-card rounded-xl p-10 text-center border border-dashed border-[var(--glass-border-strong)]">
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                No classes scheduled for today.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySlots.map((slot) => {
                const status = statusOf(slot);
                const isCurrent = status === 'current';
                const isDone = status === 'done';

                return (
                  <div
                    key={slot.id}
                    className={`glass-card rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 border transition-all ${
                      isCurrent
                        ? 'border-emerald-500/40 bg-emerald-500/5 shadow-md'
                        : isDone
                          ? 'border-[var(--glass-border)] opacity-50'
                          : 'border-[var(--glass-border)] hover:border-[var(--glass-border-strong)] hover:shadow-md'
                    }`}
                  >
                    {/* Time column */}
                    <div className="shrink-0 text-left min-w-[90px]">
                      <div className="flex items-center gap-2">
                        {isCurrent ? (
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        ) : isDone ? (
                          <Circle size={16} className="text-[var(--text-subtle)] shrink-0" />
                        ) : (
                          <Clock size={16} className="text-amber-400 shrink-0" />
                        )}
                        <div>
                          <p className="font-mono text-lg sm:text-xl font-extrabold text-[var(--text-primary)] leading-none">
                            {slot.startTime}
                          </p>
                          <p className="font-mono text-xs text-[var(--text-muted)]">–{slot.endTime}</p>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div
                      className={`hidden sm:block w-px h-10 ${isCurrent ? 'bg-emerald-500/40' : 'bg-[var(--glass-border)]'}`}
                    />

                    {/* Content */}
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-display font-bold text-base sm:text-lg leading-tight text-[var(--text-primary)]">
                          {slot.subject}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)] font-mono mt-1">
                          <span>ROOM: <strong className="text-[var(--gold)]">{slot.room || slot.roomId?.replace('room_', '').toUpperCase()}</strong></span>
                          {slot.facultyName && (
                            <>
                              <span>·</span>
                              <span className="text-[var(--text-primary)] font-semibold">Faculty: {slot.facultyName}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {isCurrent && (
                          <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-emerald-500 text-white shadow-sm">
                            ● NOW ACTIVE
                          </span>
                        )}
                        <button
                          onClick={() => {
                            const targetRoom = getRoomById(slot.roomId);
                            locateOnMap(targetRoom?.buildingId || 'academic_a');
                          }}
                          className="glass-btn glass-btn-sm rounded-full text-xs flex items-center gap-1.5 shrink-0"
                          aria-label={`Locate room for ${slot.subject}`}
                        >
                          <MapPin size={12} />
                          <span>Locate Room</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setViewMode('week')}
              className="glass-btn glass-btn-ghost text-xs font-mono font-semibold text-[var(--gold)] hover:underline inline-flex items-center gap-1.5 py-2 px-4 rounded-lg border border-[var(--glass-border)] hover:border-[var(--gold)]/40 transition-all"
            >
              <span>View Full Week Schedule</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="space-y-6">
          {/* MOBILE RESPONSIVE SCHEDULE (Stack view with day selector for screens < 768px) */}
          <div className="block md:hidden space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                Select Day Schedule
              </span>
              <span className="font-mono text-[10px] text-[var(--gold)] font-bold">
                Today: {today}
              </span>
            </div>

            {/* Mobile Day Selector Tabs */}
            <div className="grid grid-cols-6 gap-1 p-1 rounded-xl glass-1 border border-[var(--glass-border)]">
              {DAYS.map((day) => {
                const isSelected = mobileSelectedDay === day;
                const isCurrentDay = day === today;
                return (
                  <button
                    key={day}
                    onClick={() => setMobileSelectedDay(day)}
                    className={`py-2 px-1 rounded-lg text-center font-mono text-xs font-bold transition-all relative ${
                      isSelected
                        ? 'bg-[var(--gold)] text-white shadow-sm'
                        : isCurrentDay
                          ? 'border border-[var(--gold)]/40 text-[var(--gold)]'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{day}</span>
                    {isCurrentDay && !isSelected && (
                      <span className="block w-1 h-1 rounded-full bg-[var(--gold)] mx-auto mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Stacked Schedule for Selected Day */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-mono text-xs font-bold uppercase text-[var(--text-primary)]">
                  {mobileSelectedDay} Schedule ({slotsByDay[mobileSelectedDay]?.length || 0} Periods)
                </h3>
                {mobileSelectedDay === today && (
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                    CURRENT DAY
                  </span>
                )}
              </div>

              {(!slotsByDay[mobileSelectedDay] || slotsByDay[mobileSelectedDay].length === 0) ? (
                <div className="glass-card rounded-xl p-8 text-center border border-dashed border-[var(--glass-border)]">
                  <p className="font-mono text-xs text-[var(--text-muted)] uppercase">
                    No classes scheduled for {mobileSelectedDay}
                  </p>
                </div>
              ) : (
                slotsByDay[mobileSelectedDay].map((slot) => {
                  const isNow = mobileSelectedDay === today && isCurrentPeriod(slot.startTime, slot.endTime);
                  return (
                    <div
                      key={slot.id}
                      className={`glass-card rounded-xl p-4 border transition-all ${
                        isNow
                          ? 'border-emerald-500/40 bg-emerald-500/10 shadow-sm'
                          : 'border-[var(--glass-border)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="font-mono text-xs font-bold text-[var(--gold)]">
                          {slot.startTime} – {slot.endTime}
                        </span>
                        {isNow && (
                          <span className="font-mono text-[8px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold">
                            ● NOW ACTIVE
                          </span>
                        )}
                      </div>
                      <h4 className="font-display font-bold text-base text-[var(--text-primary)]">
                        {slot.subject}
                      </h4>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--glass-border)]">
                        <span className="font-mono text-xs text-[var(--text-muted)]">
                          Room: {slot.roomId?.replace('room_', '').toUpperCase()}
                        </span>
                        <button
                          onClick={() => {
                            const targetRoom = getRoomById(slot.roomId);
                            locateOnMap(targetRoom?.buildingId || 'academic_a');
                          }}
                          className="text-[10px] font-mono text-[var(--gold)] hover:underline flex items-center gap-1 font-bold"
                        >
                          <MapPin size={11} />
                          <span>Locate</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* DESKTOP WEEK GRID — flat 3×2 layout, no heavy pill cards */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-0 border border-[var(--glass-border)] rounded-xl overflow-hidden">
            {DAYS.map((day, dayIdx) => {
              const isToday = day === today;
              const daySlots = slotsByDay[day] || [];
              return (
                <div
                  key={day}
                  className={`flex flex-col ${dayIdx < 5 ? 'border-r border-[var(--glass-border)]' : ''} ${
                    isToday ? 'bg-amber-500/5' : ''
                  }`}
                >
                  {/* Day label — thin strip, no pill */}
                  <div
                    className={`px-3 py-2 text-center border-b ${
                      isToday
                        ? 'border-amber-400/40 bg-amber-500/15'
                        : 'border-[var(--glass-border)] bg-[var(--glass-1)]'
                    }`}
                  >
                    <span
                      className={`font-mono text-[10px] font-extrabold uppercase tracking-widest ${
                        isToday ? 'text-amber-400' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {day}
                    </span>
                    {isToday && (
                      <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-amber-400 align-middle" />
                    )}
                  </div>

                  {/* Slots — flat list, just a thin line between them */}
                  <div className="flex-1 divide-y divide-[var(--glass-border)]">
                    {daySlots.length === 0 ? (
                      <div className="py-8 text-center">
                        <span className="font-mono text-[9px] text-[var(--text-subtle)] uppercase">—</span>
                      </div>
                    ) : (
                      daySlots.map((slot) => {
                        const isCurrent = isCurrentPeriod(slot.startTime, slot.endTime) && day === today;
                        return (
                          <div
                            key={slot.id}
                            className={`px-3 py-2.5 text-left transition-colors ${
                              isCurrent
                                ? 'bg-emerald-500/10 border-l-2 border-l-emerald-500'
                                : 'hover:bg-[var(--glass-1)]'
                            }`}
                          >
                            <p className={`font-mono text-[9px] font-bold mb-0.5 ${isCurrent ? 'text-emerald-400' : 'text-[var(--gold)]'}`}>
                              {slot.startTime}–{slot.endTime}
                            </p>
                            <p className="text-[11px] font-semibold leading-snug text-[var(--text-primary)]">
                              {slot.subject}
                            </p>
                            <p className="font-mono text-[8.5px] text-[var(--text-muted)] mt-0.5">
                              Room: {slot.room || slot.roomId?.replace('room_', '').toUpperCase()}
                            </p>
                            {slot.facultyName && (
                              <p className="text-[8.5px] text-[var(--text-subtle)] truncate mt-0.5">
                                {slot.facultyName}
                              </p>
                            )}
                            {isCurrent && (
                              <span className="inline-block mt-1 text-[8px] font-mono text-emerald-400 font-bold">● NOW</span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
