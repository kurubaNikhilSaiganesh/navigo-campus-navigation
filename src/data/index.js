// ================================================================
// ALTS — DATA INDEX (barrel export + Supabase-ready stubs)
// This is the single entry point for all app data.
// When Supabase is configured, db.js takes over the data fetching.
// ================================================================

// ── Re-export all local data modules ──────────────────────────
export * from './buildings.js';
export * from './exams.js';
export * from './seating.js';
export * from './mainBlockData.js';

// ── Re-export from legacy data.js for backward compatibility ──
export {
  GRAPH,
  findPath,
  calcRouteStats,
  euclidean,
  EVENTS,
  MARQUEE_ITEMS,
  TYPE_ICONS_MAP,
  FACULTY,
  INITIAL_FACULTY,
  getFacultyById,
  ROOMS,
  getRoomById,
  getRoomByClassId,
  CLASSES,
  getClassById,
  TIMETABLE,
  getTimetableByClass,
  getTimetableForDay,
  DAYS,
  getCurrentDay,
} from '../data.js';
