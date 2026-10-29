import { MapPin, CheckCircle2, Layers } from 'lucide-react';

export default function RouteTimeline({ activeRoute }) {
  if (!activeRoute || !activeRoute.steps || activeRoute.steps.length === 0) {
    return null;
  }

  const { steps, fromRoom, toRoom, floorSummary } = activeRoute;

  return (
    <div className="w-full space-y-6">
      {/* ── Route Header ── */}
      <div className="p-4 md:p-5 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-elevated)]/80 backdrop-blur-md shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] block mb-1">
              YOUR ROUTE
            </span>
            <div className="flex items-center gap-2 flex-wrap font-display font-black text-lg md:text-xl text-[var(--text-primary)]">
              <span className="text-blue-400">{fromRoom?.name || 'Start'}</span>
              <span className="text-[var(--text-muted)] font-normal text-sm">↓</span>
              <span className="text-emerald-400">{toRoom?.name || 'Destination'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md font-mono text-[11px] font-bold border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              {steps.length} steps · {floorSummary}
            </span>
          </div>
        </div>
      </div>

      {/* ── Vertical Connected Route Timeline ── */}
      <div className="relative pl-6 md:pl-8 py-2">
        {/* Continuous Vertical Connection Line */}
        <div
          className="absolute left-[19px] md:left-[27px] top-6 bottom-6 w-[2px] pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, #3b82f6 0%, #f59e0b 50%, #10b981 100%)',
            opacity: 0.7,
          }}
        />

        <div className="space-y-6 relative">
          {steps.map((st, idx) => {
            const isStart = st.state === 'start';
            const isTransition = st.state === 'transition';
            const isArrive = st.state === 'arrive';
            const isNeutral = st.state === 'neutral';

            return (
              <div key={idx} className="relative flex items-start gap-4 md:gap-5 group">
                {/* Node Indicator Icon */}
                <div className="relative z-10 shrink-0">
                  {isStart && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 border-2 border-[var(--bg-elevated)] ring-2 ring-blue-500/30">
                      <MapPin size={15} strokeWidth={2.5} />
                    </div>
                  )}

                  {isNeutral && (
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] flex items-center justify-center border border-[var(--glass-border-strong)] shadow-sm group-hover:border-blue-400/50 transition-colors">
                      <span className="font-mono text-xs font-bold">{st.stepNumber}</span>
                    </div>
                  )}

                  {isTransition && (
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 border-2 border-[var(--bg-elevated)] ring-2 ring-amber-500/30 animate-pulse">
                      <Layers size={15} strokeWidth={2.5} />
                    </div>
                  )}

                  {isArrive && (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-[var(--bg-elevated)] ring-2 ring-emerald-500/30">
                      <CheckCircle2 size={16} strokeWidth={2.5} />
                    </div>
                  )}
                </div>

                {/* Step Content Card */}
                <div
                  className={`flex-1 rounded-xl p-4 transition-all duration-200 border ${
                    isStart
                      ? 'border-blue-500/30 bg-blue-500/5 shadow-sm'
                      : isTransition
                      ? 'border-amber-500/40 bg-amber-500/5 shadow-md'
                      : isArrive
                      ? 'border-emerald-500/30 bg-emerald-500/5 shadow-sm'
                      : 'border-[var(--glass-border)] bg-[var(--bg-surface)] hover:border-[var(--glass-border-strong)]'
                  }`}
                >
                  {/* Step Stage Badge */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`font-mono text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md ${
                        isStart
                          ? 'bg-blue-500/15 text-blue-400'
                          : isTransition
                          ? 'bg-amber-500/15 text-amber-400'
                          : isArrive
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-black/5 dark:bg-white/10 text-[var(--text-muted)]'
                      }`}
                    >
                      {st.label}
                    </span>

                    {st.floor && (
                      <span className="font-mono text-[10px] text-[var(--text-muted)] font-semibold">
                        {st.floor === 'G' ? 'Ground Floor' : `Floor ${st.floor}`}
                      </span>
                    )}
                  </div>

                  {/* Action Title */}
                  <h4 className="font-display font-bold text-sm md:text-base text-[var(--text-primary)] leading-snug">
                    {st.title}
                  </h4>

                  {/* Concise Description */}
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                    {st.desc}
                  </p>

                  {/* Distinct Visual Floor Transition Pill */}
                  {isTransition && (
                    <div className="mt-3 p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center gap-2 text-amber-400 font-bold">
                        <span>{st.fromFloor === 'G' ? 'GROUND FLOOR' : `FLOOR ${st.fromFloor}`}</span>
                        <span>↓</span>
                        <span>{st.stairName?.toUpperCase() || 'STAIRCASE'}</span>
                        <span>↓</span>
                        <span>{st.toFloor === 'G' ? 'GROUND FLOOR' : `FLOOR ${st.toFloor}`}</span>
                      </div>
                      <span className="text-[10px] text-amber-500/80 uppercase font-semibold hidden sm:inline">
                        Vertical Ascent/Descent
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
