// HeroSection — ALTS cinematic hero
// CSS animation with video infrastructure for external production asset

import { useEffect, useRef, useState } from 'react';

const REDUCED_MOTION = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function ALTSLetters() {
  const letters = ['A', 'L', 'T', 'S'];
  return (
    <div className="flex items-end gap-1 md:gap-2" aria-label="ALTS">
      {letters.map((letter, i) => (
        <span
          key={letter}
          className="font-display font-black text-white select-none leading-none"
          style={{
            fontSize: 'clamp(56px, 10vw, 120px)',
            opacity: REDUCED_MOTION ? 1 : 0,
            animation: REDUCED_MOTION
              ? 'none'
              : `alts-letter 600ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 100}ms forwards`,
          }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}

export default function HeroSection({ onEnter }) {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showContent, setShowContent] = useState(REDUCED_MOTION);
  const [skipped, setSkipped] = useState(false);

  // Trigger content reveal after letters animate in
  useEffect(() => {
    if (REDUCED_MOTION) return;
    const timer = setTimeout(() => setShowContent(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    setSkipped(true);
    setShowContent(true);
    if (onEnter) onEnter();
  };

  return (
    <div
      className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Background ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(244, 180, 0, 0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Optional video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000"
        style={{ opacity: videoLoaded ? 0.15 : 0 }}
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setVideoLoaded(true)}
        onError={() => setVideoLoaded(false)}
        aria-hidden="true"
      >
        {/* Drop your exported video files here when ready */}
        <source src="/video/alts-intro.webm" type="video/webm" onError={() => setVideoLoaded(false)} />
        <source src="/video/alts-intro.mp4" type="video/mp4" onError={() => setVideoLoaded(false)} />
      </video>

      {/* Main hero content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        {/* ALTS wordmark */}
        <div className="flex justify-center mb-6">
          <ALTSLetters />
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 500ms ease, transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
            transitionDelay: '100ms',
          }}
        >
          <p
            className="text-base md:text-lg font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Campus Navigation & Student Platform
          </p>
          <p
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: 'var(--gold)' }}
          >
            Navigate · Learn · Explore
          </p>
        </div>

        {/* Quick action buttons */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 mt-10"
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 500ms ease, transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
            transitionDelay: '250ms',
          }}
        >
          <button
            onClick={onEnter}
            className="glass-btn glass-btn-primary glass-btn-lg"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
            Explore Campus
          </button>
          <button
            onClick={() => { window.dispatchEvent(new CustomEvent('alts-navigate', { detail: 'seating' })); }}
            className="glass-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            Exam Seating
          </button>
        </div>

        {/* Stats strip */}
        <div
          className="flex flex-wrap justify-center gap-6 mt-12"
          style={{
            opacity: showContent ? 1 : 0,
            transition: 'opacity 500ms ease',
            transitionDelay: '400ms',
          }}
        >
          {[
            { label: 'Buildings', value: '11' },
            { label: 'Departments', value: '8' },
            { label: 'Students', value: '2000+' },
            { label: 'Campus Area', value: '10 acres' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="font-display font-black text-2xl leading-none"
                style={{ color: 'var(--text-primary)' }}
              >
                {stat.value}
              </p>
              <p
                className="font-mono text-[10px] uppercase tracking-widest mt-1"
                style={{ color: 'var(--text-muted)' }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Skip animation button */}
      {!showContent && !skipped && (
        <button
          onClick={handleSkip}
          className="absolute bottom-8 right-6 glass-btn glass-btn-ghost glass-btn-sm text-xs"
          aria-label="Skip animation"
        >
          Skip
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
          </svg>
        </button>
      )}

      {/* Scroll indicator */}
      {showContent && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: 0.5 }}
          aria-hidden="true"
        >
          <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Scroll
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--text-muted)', animation: 'float 2s ease-in-out infinite' }}>
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      )}
    </div>
  );
}

