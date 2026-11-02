import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { MARQUEE_ITEMS } from '../data';
import { Zap } from 'lucide-react';

export default function MarqueeTicker() {
  const ctx = useContext(AppContext);
  const adminAnns = ctx?.announcements ?? [];
  const baseItems = ctx?.marqueeItems || MARQUEE_ITEMS;

  const expoTag = '[EVENT] TOMORROW (2026.10.31): MINI PROJECT EXPO — AUDITORIUM & CSE LABS';

  const dedupedBase = baseItems.filter((i) => !i.includes('MINI PROJECT EXPO'));
  const allItems = [
    expoTag,
    ...adminAnns.map((a) => `[${a.severity}] ${a.text}`),
    ...dedupedBase,
  ];

  // Duplicate for seamless infinite loop
  const items = [...allItems, ...allItems];

  return (
    <div className="px-3 md:px-5 py-2">
      <div className="overflow-hidden py-2 bg-[var(--bg-surface)] dark:bg-[#12141F]/80 backdrop-blur-md rounded-full border border-violet-500/25 dark:border-violet-500/30 shadow-sm">
        <div className="ticker-track flex items-center">
          {items.map((item, i) => {
            const isTomorrowExpo = item.includes('MINI PROJECT EXPO') || item.includes('TOMORROW');
            const isAlert = item.startsWith('[ALERT]') || item.startsWith('[EMERGENCY]');

            return (
              <span
                key={i}
                className="font-mono text-[11px] font-bold tracking-wider flex-shrink-0 px-3 whitespace-nowrap uppercase inline-flex items-center"
              >
                {isTomorrowExpo ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-[#6EE7B7] border border-emerald-500/40 dark:border-emerald-400/40 shadow-sm font-black">
                    <Zap size={11} className="fill-emerald-600 dark:fill-[#6EE7B7] text-emerald-600 dark:text-[#6EE7B7] animate-pulse" />
                    <span>{item}</span>
                  </span>
                ) : (
                  <span className={isAlert ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-800 dark:text-[#DDD6FE]'}>
                    {item}
                  </span>
                )}
                <span className="mx-3 text-slate-400 dark:text-violet-400/30">│</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
