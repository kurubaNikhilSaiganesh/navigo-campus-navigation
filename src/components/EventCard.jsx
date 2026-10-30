import { useContext, useState } from 'react';
import { MapPin, ArrowRight, Calendar, X, Info, Zap } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { getBuildingById } from '../data';

export default function EventCard({ event, spanClass }) {
  const { setRegisterModal, setToNode, navigateTo, locationStatus = {}, theme } = useContext(AppContext);
  const [venueModal, setVenueModal] = useState(false);
  const venueBuilding = getBuildingById(event.venue);
  const isVenueClosed = locationStatus[event.venue] === 'closed';
  const isDark = theme === 'dark';
  const isTomorrow = event.tag === 'TOMORROW' || event.date === '2026.10.31';

  const handleRouteToVenue = () => {
    setToNode(event.venue);
    setVenueModal(false);
    navigateTo('route');
  };

  return (
    <>
      <div className={`card-brutal flex flex-col overflow-hidden rounded-2xl glass-card border border-violet-500/25 hover:border-emerald-400/50 transition-all duration-300 shadow-sm hover:shadow-[0_8px_30px_rgba(110,231,183,0.12)] ${spanClass || ''}`}>
        {/* Top accent gradient: Pale Lavender to Pale Green */}
        <div className="h-[3.5px] w-full shrink-0 bg-gradient-to-r from-[#C4B5FD] via-[#DDD6FE] to-[#6EE7B7]" />

        <div className="flex flex-col flex-1 p-4 sm:p-5">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            {/* Category tag — Pale Lavender */}
            <span className="font-mono text-[9.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-700 dark:text-[#DDD6FE] border border-violet-400/40 dark:border-violet-400/30 shrink-0">
              {event.category || 'EVENT'}
            </span>

            <div className="flex items-center gap-1.5">
              {/* Tomorrow Badge if applicable */}
              {isTomorrow && (
                <span className="inline-flex items-center gap-1 font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-[#6EE7B7] border border-emerald-500/40 dark:border-emerald-400/40 animate-pulse">
                  <Zap size={10} className="fill-current" />
                  <span>TOMORROW</span>
                </span>
              )}

              {/* Status badge — Pale Green */}
              <span className={`font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                event.status === 'UPCOMING'
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-800 dark:text-[#6EE7B7] border-emerald-600/30 dark:border-emerald-500/30'
                  : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)] border-[var(--glass-border)]'
              }`}>
                {event.status}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-base sm:text-lg uppercase leading-snug text-[var(--text-primary)] line-clamp-1 mb-1">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-[var(--text-secondary)] text-xs line-clamp-2 leading-relaxed mb-3">
            {event.description}
          </p>

          {/* Closed Venue Alert if deactivated */}
          {isVenueClosed && (
            <div className="mb-2.5 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[10px] font-bold">
              ⚠ NOTICE: {event.venueName} is temporarily closed.
            </div>
          )}

          {/* Meta Information */}
          <div className="space-y-1.5 mb-3.5 pt-2.5 border-t border-[var(--glass-border)]">
            {/* Date & time — Pale Lavender accent */}
            <div className="flex items-center gap-2">
              <Calendar size={12} className="text-violet-600 dark:text-[#C4B5FD] shrink-0" />
              <span className="font-mono text-[10.5px] text-[var(--text-secondary)] font-medium">
                {event.date} · {event.time}
              </span>
            </div>

            {/* Venue — Pale Green accent */}
            <button
              className="flex items-center gap-1.5 font-mono text-[10.5px] group w-full text-left transition-colors"
              onClick={() => setVenueModal(true)}
              aria-label={`View venue details for ${event.venueName}`}
            >
              <MapPin size={12} className="shrink-0 text-emerald-600 dark:text-[#6EE7B7]" />
              <span className="underline group-hover:no-underline font-semibold text-emerald-700 dark:text-[#6EE7B7]">
                [VENUE: {event.venueName}] {isVenueClosed ? '(CLOSED)' : ''}
              </span>
              <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-emerald-700 dark:text-[#6EE7B7]" />
            </button>

            {/* Organizer */}
            <p className="font-mono text-[9px] text-[var(--text-subtle)] uppercase tracking-wider truncate">
              By {event.organizer}
            </p>
          </div>

          {/* CTA buttons — Attractive Pale Green Register CTA */}
          <div className="flex gap-2 items-center mt-auto">
            {event.status === 'UPCOMING' ? (
              <button
                className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-300 hover:from-emerald-300 hover:to-teal-200 text-neutral-950 font-display font-bold text-xs py-2 px-4 rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex-1 text-center"
                onClick={() => setRegisterModal(event)}
                aria-label={`Register for ${event.title}`}
              >
                Register →
              </button>
            ) : (
              <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase py-2 px-3 rounded-xl border border-[var(--glass-border)] flex-1 text-center font-medium">
                Completed
              </span>
            )}
            <button
              className="glass-btn rounded-xl px-3 py-2 text-xs flex items-center justify-center text-violet-700 dark:text-[#C4B5FD] hover:text-violet-900 dark:hover:text-white hover:bg-violet-500/15 dark:hover:bg-violet-500/20 border border-violet-400/40 dark:border-violet-500/30 transition-colors"
              onClick={() => setVenueModal(true)}
              aria-label={`View ${event.venueName} location details`}
              title="Venue Details"
            >
              <MapPin size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Venue Location Details Modal */}
      {venueModal && venueBuilding && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={() => setVenueModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="rounded-2xl p-6 sm:p-7 max-w-md w-full border backdrop-blur-2xl shadow-2xl relative border-violet-500/30"
            style={{
              background: isDark ? 'rgba(18, 20, 30, 0.96)' : 'rgba(255, 255, 255, 0.96)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="font-mono text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block mb-1 bg-violet-500/10 dark:bg-violet-500/15 border border-violet-500/30 text-violet-700 dark:text-[#DDD6FE]">
                  Event Venue · {venueBuilding.code}
                </span>
                <h3 className="font-display font-bold text-2xl text-[var(--text-primary)]">
                  {venueBuilding.label}
                </h3>
                <p className="font-mono text-xs text-emerald-700 dark:text-[#6EE7B7] font-semibold mt-0.5">
                  {venueBuilding.department}
                </p>
              </div>

              <button
                onClick={() => setVenueModal(false)}
                className="glass-btn glass-btn-ghost rounded-lg w-8 h-8 flex items-center justify-center"
              >
                <X size={15} />
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              {venueBuilding.description}
            </p>

            <div className="mb-4">
              <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 font-semibold">
                Facilities:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {venueBuilding.facilities.map((f) => (
                  <span key={f} className="text-xs font-mono px-3 py-1 rounded-md glass-1 border border-[var(--glass-border)] text-[var(--text-primary)]">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {isVenueClosed ? (
              <div className="p-3.5 rounded-lg mb-5 text-left border flex items-start gap-2 text-xs font-mono bg-red-500/10 border-red-500/30 text-red-500">
                <Info size={15} className="shrink-0 mt-0.5" />
                <span>Venue is temporarily marked closed in administrative records. Directions and physical access may be restricted.</span>
              </div>
            ) : (
              <div className="p-3.5 rounded-lg mb-5 text-left border flex items-start gap-2 text-xs font-mono bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-[#6EE7B7]">
                <Info size={15} className="shrink-0 mt-0.5" />
                <span>Spatial coordinates pending campus ground survey. Route simulation is available for demonstration.</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setVenueModal(false)}
                className="flex-1 glass-btn rounded-xl py-2.5 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={handleRouteToVenue}
                className="flex-1 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 text-neutral-950 font-display font-bold rounded-xl py-2.5 text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Simulate Route</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
