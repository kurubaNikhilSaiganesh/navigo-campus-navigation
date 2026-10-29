// ExamsView — MID and SEM exam schedules with responsive layout
import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { EXAMS, getDaysUntilExam, SESSIONS } from '../data/exams';
import { GlassTabs } from './ui/GlassTabs';
import { GlassBadge } from './ui/GlassBadge';
import { MapPin, ChevronDown } from 'lucide-react';

const TABS = [
  { id: 'all',  label: 'All Exams' },
  { id: 'MID',  label: 'Mid Term' },
  { id: 'SEM',  label: 'Semester' },
];

function SessionBadge({ session }) {
  const s = SESSIONS[session];
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase shrink-0"
      style={{
        background: session === 'FN' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
        color: session === 'FN' ? 'var(--blue)' : '#D97706',
        border: `1px solid ${session === 'FN' ? 'rgba(59,130,246,0.3)' : 'rgba(245,158,11,0.3)'}`,
      }}
    >
      {session} · {s?.label || session}
    </span>
  );
}

function ExamScheduleRow({ item }) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 px-4 transition-colors border-b border-[var(--glass-border)] last:border-b-0"
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div
          className="text-center shrink-0 w-12 h-12 flex flex-col items-center justify-center rounded-lg shadow-xs"
          style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)' }}
        >
          <p className="font-mono font-black text-base leading-none text-amber-500">
            {new Date(item.date).getDate()}
          </p>
          <p className="font-mono text-[8px] uppercase tracking-wider font-bold text-amber-500 mt-0.5">
            {new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}
          </p>
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm leading-snug text-[var(--text-primary)] truncate">
            {item.subjectName}
          </p>
          <p className="font-mono text-[10.5px] mt-0.5 text-[var(--text-muted)] truncate">
            {item.subjectCode} · {item.branch} {item.section && `· Sec ${item.section}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
        <SessionBadge session={item.session} />
        <span
          className="text-xs px-2.5 py-1 rounded-md font-mono font-bold glass-1 border border-[var(--glass-border)] text-[var(--text-secondary)]"
        >
          {item.examHall}
        </span>
      </div>
    </div>
  );
}

function ExamCard({ exam, onFindSeat }) {
  const daysUntil = getDaysUntilExam(exam);
  const isUpcoming = daysUntil > 0;
  const isOngoing  = exam.status === 'ONGOING' || (daysUntil <= 0 && exam.status !== 'COMPLETED');
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300 glass-card border shadow-lg"
      style={{
        border: isOngoing ? '1px solid rgba(8, 127, 69, 0.4)' : '1px solid var(--glass-border)',
      }}
    >
      {/* Exam Header */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <GlassBadge variant="gold">{exam.type}</GlassBadge>
              <GlassBadge variant={isOngoing ? 'green' : isUpcoming ? 'gold' : 'gray'}>
                {isOngoing ? 'Ongoing Exam' : isUpcoming ? `In ${daysUntil}d` : 'Completed'}
              </GlassBadge>
            </div>
            <h3
              className="font-display font-bold text-xl sm:text-2xl leading-tight text-[var(--text-primary)]"
            >
              {exam.name}
            </h3>
            <p className="text-xs sm:text-sm mt-1 text-[var(--text-muted)] font-mono">
              {exam.startDate} — {exam.endDate} · Semester {exam.semester}
            </p>
          </div>

          {/* Countdown badge */}
          {isUpcoming && (
            <div
              className="text-center px-4 py-2.5 rounded-lg shrink-0 self-start sm:self-auto"
              style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)' }}
            >
              <p className="font-display font-black text-2xl sm:text-3xl leading-none text-amber-500">
                {daysUntil}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-wider font-bold text-amber-500 mt-0.5">
                days left
              </p>
            </div>
          )}
        </div>

        <p className="text-xs sm:text-sm leading-relaxed mb-4 text-[var(--text-secondary)]">
          {exam.description}
        </p>

        {/* Participating Branches */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {exam.branches.map((b) => (
            <span
              key={b}
              className="font-mono text-[10px] px-2.5 py-1 rounded-md glass-1 border border-[var(--glass-border)] text-[var(--text-muted)] uppercase font-semibold"
            >
              {b}
            </span>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onFindSeat}
            className="glass-btn glass-btn-primary rounded-lg px-5 py-2 text-xs font-bold shadow-md flex items-center gap-2 hover:scale-105 transition-all"
            id={`find-seat-${exam.id}`}
          >
            <MapPin size={14} />
            <span>Find My Seat</span>
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="glass-btn glass-btn-ghost rounded-lg px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
          >
            <span>{expanded ? 'Hide' : 'View'} Schedule</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Expandable schedule list */}
      {expanded && (
        <div className="border-t border-[var(--glass-border)] bg-[var(--glass-2)]">
          <div className="px-5 py-2.5 border-b border-[var(--glass-border)] flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">
              Examination Paper Timetable ({exam.schedule.length} Papers)
            </span>
            <span className="font-mono text-[9px] text-[var(--text-subtle)]">
              Authorized Schedule
            </span>
          </div>
          <div className="divide-y divide-[var(--glass-border)]">
            {exam.schedule.map((item, idx) => (
              <ExamScheduleRow key={idx} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExamsView() {
  const { navigateTo } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all'
    ? EXAMS
    : EXAMS.filter((e) => e.type === activeTab);

  return (
    <div className="px-4 md:px-8 pt-4 pb-12 max-w-4xl mx-auto page-enter w-full space-y-6">
      {/* Header with safe top spacing */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest mb-1.5 font-bold text-[var(--gold)]">
          [EXAMINATION_SERVICES · VERIFIED CONTROLLER]
        </p>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)]">
          Examinations.
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          <span className="font-mono ml-2 text-xs text-amber-500 font-bold">· Fall 2026 Assessment Series</span>
        </p>
      </div>

      {/* Tabs */}
      <div>
        <GlassTabs
          tabs={TABS.map((t) => ({
            ...t,
            count: t.id === 'all' ? EXAMS.length : EXAMS.filter((e) => e.type === t.id).length,
          }))}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Quick Seating Shortcut Banner */}
      <div
        className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border backdrop-blur-md shadow-md"
        style={{
          background: 'rgba(245, 158, 11, 0.08)',
          borderColor: 'rgba(245, 158, 11, 0.25)',
        }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="w-11 h-11 flex items-center justify-center rounded-lg shrink-0 shadow-md"
            style={{ background: 'linear-gradient(135deg, var(--gold) 0%, #D97706 100%)' }}
          >
            <MapPin size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm sm:text-base text-[var(--text-primary)]">
              Exam Seating &amp; Hall Lookup
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              Enter roll number or register number to pinpoint your allocated desk and hall
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('seating')}
          className="glass-btn glass-btn-primary rounded-lg px-5 py-2.5 text-xs font-bold shadow-md shrink-0 w-full sm:w-auto text-center"
          id="btn-goto-seating"
        >
          Open Seating Matrix
        </button>
      </div>

      {/* Exam Cards List */}
      <div className="space-y-5">
        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-xl border border-dashed border-[var(--glass-border)]">
            <p className="font-mono text-sm text-[var(--text-muted)]">
              No {activeTab === 'all' ? '' : activeTab} exams scheduled at this time.
            </p>
          </div>
        ) : (
          filtered.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onFindSeat={() => navigateTo('seating')}
            />
          ))
        )}
      </div>
    </div>
  );
}
