import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import MarqueeTicker from './MarqueeTicker';
import EventCard from './EventCard';
import { RotateCcw, Check, Plus, Calendar, X, Sparkles } from 'lucide-react';

const STATUSES = ['UPCOMING', 'COMPLETED'];

const SPAN_CLASS = {
  large:  'bento-large',
  medium: 'bento-medium',
  small:  'bento-small',
};

export default function EventsSection() {
  const { events, addEvent, resetEventsToDefault, hasCustomEvents } = useContext(AppContext);
  const [activeCat,    setActiveCat]    = useState('ALL');
  const [activeStatus, setActiveStatus] = useState('ALL');
  const [csvStatus, setCsvStatus] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Quick form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'COMPETITION',
    date: '2026.10.31',
    time: '09:30 AM',
    venueName: 'Auditorium & CSE Labs',
    venue: 'auditorium',
    description: '',
    organizer: 'CSE & CSM Departments',
    tag: 'TOMORROW',
  });

  const categories = ['ALL', ...new Set(events.map((e) => e.category))];

  const filtered = events.filter((e) => {
    const catOk    = activeCat    === 'ALL' || e.category === activeCat;
    const statusOk = activeStatus === 'ALL' || e.status   === activeStatus;
    return catOk && statusOk;
  });

  const upcomingCount  = events.filter((e) => e.status === 'UPCOMING').length;
  const completedCount = events.filter((e) => e.status === 'COMPLETED').length;

  const handleReset = () => {
    if (resetEventsToDefault) {
      resetEventsToDefault();
      setCsvStatus({
        type: 'success',
        message: 'Events reset to college default schedule.'
      });
      setTimeout(() => setCsvStatus(null), 4000);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (addEvent) {
      addEvent({
        ...formData,
        tag: formData.date === '2026.10.31' ? 'TOMORROW' : formData.tag
      });
      setCsvStatus({
        type: 'success',
        message: `Event "${formData.title}" published successfully!`
      });
      setTimeout(() => setCsvStatus(null), 4000);
      setFormData({
        title: '',
        category: 'COMPETITION',
        date: '2026.10.31',
        time: '09:30 AM',
        venueName: 'Auditorium & CSE Labs',
        venue: 'auditorium',
        description: '',
        organizer: 'CSE & CSM Departments',
        tag: 'TOMORROW',
      });
      setAddModalOpen(false);
    }
  };

  return (
    <div className="w-full">
      {/* Section header */}
      <div className="px-4 md:px-8 py-6 sm:py-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-violet-500/10 dark:bg-violet-500/15 border border-violet-500/30 text-violet-700 dark:text-[#DDD6FE] font-mono text-[10px] uppercase tracking-widest mb-2 font-bold">
          <Sparkles size={11} className="text-emerald-600 dark:text-[#6EE7B7]" />
          <span>EVENTS_BULLETIN</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)]">
              Campus Events.
            </h1>
            <p className="text-[var(--text-secondary)] text-xs sm:text-sm mt-1">
              {upcomingCount} upcoming · {completedCount} completed
            </p>
          </div>

          {/* Stats row */}
          <div className="flex gap-5 sm:gap-6">
            {[
              { label: 'Total', value: events.length },
              { label: 'Upcoming', value: upcomingCount },
              { label: 'Open Reg.', value: upcomingCount },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider">{stat.label}</p>
                <p className="font-display text-2xl font-black text-emerald-600 dark:text-[#6EE7B7]">
                  {String(stat.value).padStart(2, '0')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee Ticker */}
      <MarqueeTicker />

      {/* CSV Status Alert Banner */}
      {csvStatus && (
        <div className="px-4 md:px-8 mt-3">
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
        </div>
      )}

      {/* CSV & Event Quick Upload Management Bar */}
      <div className="px-4 md:px-8 mt-4">
        <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-violet-500/25 bg-[var(--bg-surface)] dark:bg-[#12141F]/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-violet-500/10 dark:bg-violet-500/15 border border-violet-500/30 text-violet-700 dark:text-[#DDD6FE] shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-xs sm:text-sm text-[var(--text-primary)]">
                  Campus Events &amp; Bulletin
                </h3>
                {hasCustomEvents && (
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-[#6EE7B7] border border-emerald-500/30 font-bold">
                    Custom Active
                  </span>
                )}
              </div>
              <p className="font-mono text-[10px] text-[var(--text-secondary)]">
                Post new campus events, expos, and competitions instantly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* ONLY "+ Post Event Update" button */}
            <button
              onClick={() => setAddModalOpen(true)}
              className="bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 text-neutral-950 rounded-lg px-4 py-2 text-xs font-display font-bold flex items-center gap-1.5 shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <Plus size={15} />
              <span>Post Event Update</span>
            </button>

            {/* Reset button if custom events active */}
            {hasCustomEvents && (
              <button
                onClick={handleReset}
                className="glass-btn glass-btn-ghost rounded-lg px-2 py-1.5 text-xs font-mono text-red-400 hover:bg-red-500/10 flex items-center gap-1"
                title="Reset to default events"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters — Curved Pills with Crisp Typography */}
      <div className="px-4 md:px-8 py-4 border-b border-[var(--glass-border)] flex flex-nowrap items-center gap-3 overflow-x-auto scrollbar-hide overscroll-x-contain snap-x snap-mandatory mt-3">
        {/* Category filters */}
        <div className="flex flex-nowrap gap-2 items-center">
          {categories.map((cat) => {
            const isActive = activeCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`font-mono text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all duration-300 select-none whitespace-nowrap snap-start ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-300 text-neutral-950 font-black shadow-md scale-105'
                    : 'glass-btn glass-btn-ghost rounded-full text-[var(--text-primary)] hover:bg-violet-500/10 dark:hover:bg-violet-500/15 hover:text-violet-700 dark:hover:text-[#DDD6FE]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="w-px h-6 bg-[var(--glass-border)] hidden sm:block" />

        {/* Status filters */}
        <div className="flex gap-2 items-center">
          {STATUSES.map((s) => {
            const isActive = activeStatus === s;
            return (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                className={`font-mono text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all duration-300 select-none whitespace-nowrap snap-start ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-300 text-neutral-950 font-black shadow-md scale-105'
                    : 'glass-btn glass-btn-ghost rounded-full text-[var(--text-primary)] hover:bg-violet-500/10 dark:hover:bg-violet-500/15 hover:text-violet-700 dark:hover:text-[#DDD6FE]'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events grid — Compact & Proportional (fixes the 1st image red area) */}
      <div className="px-4 md:px-8 py-6">
        {filtered.length === 0 ? (
          <div className="border border-dashed border-[var(--glass-border)] rounded-2xl p-10 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
              NO EVENTS MATCH CURRENT FILTERS
            </p>
            <button
              onClick={() => { setActiveCat('ALL'); setActiveStatus('ALL'); }}
              className="mt-3 glass-btn rounded-xl text-xs py-2 px-5 text-emerald-700 dark:text-[#6EE7B7]"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                spanClass={SPAN_CLASS[event.span] || 'bento-small'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom stats bar */}
      <div className="border-t border-[var(--glass-border)] px-4 md:px-8 py-3.5 flex flex-wrap gap-4 bg-black/10 dark:bg-black/20 text-xs">
        <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">BULLETIN_SYS v2.0 // LIVE</span>
        <span className="font-mono text-[10px] text-emerald-700 dark:text-[#6EE7B7] uppercase ml-auto font-bold">{filtered.length} of {events.length} events active</span>
      </div>

      {/* Quick Add Event Modal */}
      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in"
          onClick={() => setAddModalOpen(false)}
        >
          <div
            className="rounded-2xl p-5 sm:p-6 max-w-lg w-full border border-violet-500/30 bg-[#12141F] backdrop-blur-2xl shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--glass-border)] mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6EE7B7]" />
                <h3 className="font-display font-black text-lg text-[var(--text-primary)] uppercase tracking-tight">
                  Post New Event Update
                </h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="glass-btn glass-btn-ghost rounded-lg w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-[var(--text-muted)] text-[10px] uppercase tracking-wider mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MINI PROJECT EXPO 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-violet-500/30 text-[var(--text-primary)] focus:outline-none focus:border-emerald-400 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-muted)] text-[10px] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1A1C29] border border-violet-500/30 text-[var(--text-primary)] focus:outline-none focus:border-emerald-400"
                  >
                    <option value="COMPETITION">COMPETITION</option>
                    <option value="TECH_FEST">TECH_FEST</option>
                    <option value="HACKATHON">HACKATHON</option>
                    <option value="WORKSHOP">WORKSHOP</option>
                    <option value="LECTURE">LECTURE</option>
                    <option value="CULTURAL_FEST">CULTURAL_FEST</option>
                    <option value="SPORTS">SPORTS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-muted)] text-[10px] uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    placeholder="2026.10.31"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-violet-500/30 text-[var(--text-primary)] focus:outline-none focus:border-emerald-400 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-muted)] text-[10px] uppercase tracking-wider mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    placeholder="09:30 AM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-violet-500/30 text-[var(--text-primary)] focus:outline-none focus:border-emerald-400 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-muted)] text-[10px] uppercase tracking-wider mb-1">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    placeholder="Auditorium & CSE Labs"
                    value={formData.venueName}
                    onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-violet-500/30 text-[var(--text-primary)] focus:outline-none focus:border-emerald-400 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-muted)] text-[10px] uppercase tracking-wider mb-1">
                  Organizer Department
                </label>
                <input
                  type="text"
                  placeholder="CSE & CSM Departments"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-violet-500/30 text-[var(--text-primary)] focus:outline-none focus:border-emerald-400 font-sans"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] text-[10px] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the event, competitions, evaluation, etc."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-violet-500/30 text-[var(--text-primary)] focus:outline-none focus:border-emerald-400 font-sans resize-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 glass-btn rounded-xl py-2.5 text-xs font-semibold text-[var(--text-muted)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 text-neutral-950 font-display font-bold rounded-xl py-2.5 text-xs shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
