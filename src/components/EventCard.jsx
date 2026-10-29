import { useContext, useState } from 'react';
import { MapPin, ArrowRight, Calendar, X, Info } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { getBuildingById } from '../data';

// Category → accent color
const CATEGORY_ACCENT = {
  TECH_FEST:    '#007AFF',
  HACKATHON:    '#7C3AED',
  LECTURE:      '#00C7BE',
  CULTURAL_FEST:'#FF9500',
  WORKSHOP:     '#F4B400',
  SPORTS:       '#34C759',
  COMPETITION:  '#7C3AED',
};

// Status badge styles
const STATUS_STYLE = {
  UPCOMING:  'bg-[var(--gold)]/15 text-[var(--gold)] border-[var(--gold)]/30',
  COMPLETED: 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)] border-[var(--glass-border)]',
};

export default function EventCard({ event, spanClass }) {
  const { setRegisterModal, setToNode, navigateTo, locationStatus = {}, theme } = useContext(AppContext);
  const [venueModal, setVenueModal] = useState(false);
  const isLarge  = spanClass === 'bento-large';
  const accent   = CATEGORY_ACCENT[event.category] || '#007AFF';
  const venueBuilding = getBuildingById(event.venue);
  const isVenueClosed = locationStatus[event.venue] === 'closed';
  const isDark = theme === 'dark';

  const handleRouteToVenue = () => {
    setToNode(event.venue);
    setVenueModal(false);
    navigateTo('route');
  };

  return (
    <>
      <div className={`card-brutal flex flex-col overflow-hidden rounded-xl glass-card border border-[var(--glass-border)] hover:border-[var(--glass-border-strong)] transition-all ${spanClass}`}>
        {/* Top accent strip */}
        <div className="h-[4px] w-full shrink-0" style={{ background: accent }} />

        <div className={`flex flex-col flex-1 ${isLarge ? 'p-6' : 'p-5'}`}>
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            {/* Category tag */}
            <span
              className="font-mono text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md border shrink-0"
              style={{ color: accent, borderColor: accent + '40', background: accent + '15' }}
            >
              [{event.category}]
            </span>
            {/* Status badge */}
            <span className={`font-mono text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-md border ${STATUS_STYLE[event.status] || STATUS_STYLE.UPCOMING}`}>
              {event.status}
            </span>
          </div>

          {/* Title */}
          <h3 className={`font-display font-bold uppercase leading-tight mb-2 text-[var(--text-primary)] ${isLarge ? 'text-2xl' : 'text-base'}`}>
            {event.title}
          </h3>

          {/* Description */}
          <p className={`text-[var(--text-secondary)] mb-4 flex-1 ${isLarge ? 'text-sm' : 'text-xs'} line-clamp-3 leading-relaxed`}>
            {event.description}
          </p>

          {/* Closed Venue Alert if deactivated */}
          {isVenueClosed && (
            <div className="mb-3 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 font-mono text-[10px] font-bold">
              ⚠ NOTICE: {event.venueName} is temporarily closed for maintenance.
            </div>
          )}

          {/* Meta */}
          <div className="space-y-1.5 mb-4 pt-3 border-t border-[var(--glass-border)]">
            {/* Date & time */}
            <div className="flex items-center gap-2">
              <Calendar size={11} style={{ color: accent }} className="shrink-0" />
              <span className="font-mono text-[10px] text-[var(--text-muted)] font-medium">
                {event.date} · {event.time}
              </span>
            </div>

            {/* Venue — clickable */}
            <button
              className="flex items-center gap-1.5 font-mono text-[10px] group w-full text-left transition-colors"
              onClick={() => setVenueModal(true)}
              aria-label={`View venue details for ${event.venueName}`}
            >
              <MapPin size={11} className="shrink-0" style={{ color: isVenueClosed ? 'var(--red)' : accent }} />
              <span className="underline group-hover:no-underline font-semibold" style={{ color: isVenueClosed ? 'var(--red)' : accent }}>
                [VENUE: {event.venueName}] {isVenueClosed ? '(CLOSED)' : ''}
              </span>
              <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto" style={{ color: accent }} />
            </button>

            {/* Organizer */}
            <p className="font-mono text-[9px] text-[var(--text-subtle)] uppercase tracking-wider">
              Organized by {event.organizer}
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-2 flex-wrap">
            {event.status === 'UPCOMING' ? (
              <button
                className="glass-btn glass-btn-primary rounded-full text-xs py-2 px-4 flex-1 font-bold shadow-sm"
                onClick={() => setRegisterModal(event)}
                aria-label={`Register for ${event.title}`}
              >
                Register →
              </button>
            ) : (
              <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase py-2 px-3 rounded-full border border-[var(--glass-border)] flex-1 text-center font-medium">
                Completed
              </span>
            )}
            <button
              className="glass-btn glass-btn-ghost rounded-full px-3 py-2 text-xs flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
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
            className="rounded-xl p-6 sm:p-7 max-w-md w-full border backdrop-blur-2xl shadow-2xl relative"
            style={{
              background: isDark ? 'rgba(20, 20, 26, 0.96)' : 'rgba(255, 255, 255, 0.96)',
              borderColor: 'var(--glass-border-strong)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="font-mono text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md inline-block mb-1 glass-1 border border-[var(--glass-border)] text-[var(--gold)]">
                  Event Venue · {venueBuilding.code}
                </span>
                <h3 className="font-display font-bold text-2xl text-[var(--text-primary)]">
                  {venueBuilding.label}
                </h3>
                <p className="font-mono text-xs text-amber-500 font-semibold mt-0.5">
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
              <div className="p-3.5 rounded-lg mb-5 text-left border flex items-start gap-2 text-xs font-mono bg-amber-500/10 border-amber-500/30 text-[var(--text-secondary)]">
                <Info size={15} className="text-amber-500 shrink-0 mt-0.5" />
                <span>Spatial coordinates pending campus ground survey. Route simulation is available for demonstration.</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setVenueModal(false)}
                className="flex-1 glass-btn rounded-lg py-2.5 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={handleRouteToVenue}
                className="flex-1 glass-btn glass-btn-primary rounded-lg py-2.5 text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
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
