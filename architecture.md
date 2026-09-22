# ALTS — System Architecture

## Overview

ALTS is a client-side React application backed by Supabase (PostgreSQL). In development, the app runs entirely with local demo data — no backend required.

```
┌─────────────────────────────────────────────────────────────────┐
│                        ALTS Frontend                             │
│                                                                   │
│   React + Vite + Tailwind CSS                                    │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Sidebar    │  │   TopBar     │  │   MobileNav          │   │
│  │  Navigation  │  │   + Search   │  │   Bottom Tab Bar     │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Views (Pages)                           │   │
│  │  Dashboard · Map · Directory · Events · Timetable         │   │
│  │  Exams · Seating (QR) · Search · Notices · Admin         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Glass UI Component System                │   │
│  │  GlassCard · GlassButton · GlassInput · GlassTabs        │   │
│  │  GlassBadge · GlassModal · GlassSkeleton                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────┐  ┌─────────────────────────────────────┐  │
│  │   AppContext      │  │           Data Layer                │  │
│  │   (React Context) │  │   src/lib/db.js  (abstraction)     │  │
│  │   Shared state    │  │   ├── Local data (default)         │  │
│  │   Theme · Routes  │  │   └── Supabase (when configured)   │  │
│  └──────────────────┘  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │  HTTPS (anon key only)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Supabase                                   │
│                                                                   │
│  ┌─────────────┐  ┌────────────┐  ┌──────────────────────────┐  │
│  │ PostgreSQL  │  │  Auth      │  │  Storage                 │  │
│  │  Database   │  │ (optional) │  │  (campus images/video)   │  │
│  └─────────────┘  └────────────┘  └──────────────────────────┘  │
│                                                                   │
│  Tables:                                                          │
│  places · faculty · rooms · exams · exam_subjects                │
│  exam_seating · room_layouts · announcements                     │
│                                                                   │
│  Row Level Security (RLS):                                        │
│  · Public can read places, faculty, exams, announcements         │
│  · Seating: public lookup by registration number                  │
│  · Write operations: service-role key only (never in frontend)   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Local Development (no Supabase)
```
Component → src/lib/db.js → src/data/*.js → Local demo data
```

### Production (with Supabase)
```
Component → src/lib/db.js → src/lib/supabase.js → Supabase REST API → PostgreSQL
```

The switch is automatic: if `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present in the environment, the app uses Supabase. Otherwise it falls back to local data.

## Key Modules

| Module | Purpose |
|---|---|
| `src/context/AppContext.jsx` | Global React context — shared state |
| `src/hooks/useTheme.js` | Dark/light mode with localStorage |
| `src/lib/db.js` | Data abstraction layer |
| `src/lib/supabase.js` | Conditional Supabase client |
| `src/lib/qr.js` | QR code generation and parsing |
| `src/data/buildings.js` | Campus places data |
| `src/data/exams.js` | Exam schedules |
| `src/data/seating.js` | Demo seating data |

## CI/CD Flow

```
Developer
    │
    ├── git push / pull request
    │
    ▼
GitHub
    │
    ▼
GitHub Actions
    │
    ├── npm ci           (clean dependency install)
    ├── npm run lint     (ESLint — fail on errors)
    ├── npm audit        (dependency security check)
    └── npm run build    (Vite production build)
         │
         ▼
    [On main branch only]
         │
         ▼
    GitHub Pages Deployment
         │
         ▼
    Live ALTS Application
```

## Security Architecture

| Concern | Approach |
|---|---|
| Supabase URL/Key | `VITE_` prefix — safe to expose (anon key only) |
| Service-role key | NEVER in frontend — server-side only |
| Admin access | PIN via `VITE_ADMIN_PIN` env var |
| Student data | No real data in repo — demo only |
| RLS | All Supabase tables protected by Row Level Security |
| Secrets | GitHub Secrets → Actions → Build env vars |

## Frontend Routing

This is a Single Page Application (SPA) — routing is managed by React state (`activeView`), not URLs. No React Router is used.

For GitHub Pages, a `public/404.html` redirect script handles direct URL access to deep routes.

## Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Backdrop-filter (glass effects) requires Chrome/Edge — degrades gracefully in Firefox
- QR scanning requires HTTPS + camera permission
