# Meridian Campus Guide (NaviGO) — Campus Navigation & Student Platform

> **PROTOTYPE & DEMONSTRATION NOTICE**  
> Meridian Campus Guide is an independent student-led design demonstration and technical prototype. It is **not** an official college service or endorsed institution portal. Real physical campus GIS coordinates and survey maps have not yet been integrated; spatial map radar canvas, pathfinding BFS routes, walking distances, and time estimates are synthetic topological demonstrations.

---

## Overview

Meridian Campus Guide (NaviGO) delivers a cinematic, liquid-glass digital campus experience designed for desktop, tablet, and mobile browsers. It pairs rich visual design (frosted glassmorphism, animated radar sweep calibration, fluid typography) with functional student information modules including classroom discovery, exam seating lookup, timetable schedules, faculty directories, and session-local admin management.

---

## Core Demonstration Journeys

### 1. Visitor Wayfinding Journey
- **Home Page**: Live digital clock, daily timetable highlights, and marquee announcements.
- **Search & Quick Links**: Global search (⌘K / Ctrl+K) across places, classrooms, faculty, and events.
- **Location Details**: Interactive Location Directory with complete facility breakdowns, floor levels, department affiliations, and spatial status indicators.
- **Simulated Route Finding**: Topological BFS pathfinder demonstrating node-to-node routing across campus benchmarks with simulated walking times and accessibility indicators.

### 2. Classroom Discovery Flow
- **Academic Directory (`#classes`)**: Instant search by course title, course code (e.g. `CS-2A`), or room.
- **Multi-Level Filtering**: Filter academic sections by Department or Building.
- **Room Inspection (`#rooms`)**: Dedicated Room Details Modal showing capacity, building, floor level, assigned sections, and direct links to simulate navigation.

### 3. Event & Venue Discovery Flow
- **Bento Event Showcase (`#events`)**: Categorized campus events (TechFest, Workshops, Hackathons, Cultural).
- **Venue Inspection**: Click any event venue to view the Venue Details Modal explaining facility specifications.
- **Closure Alerts**: Immediate warning banners if the event venue has been marked as temporarily closed by administration.

### 4. Admin Demonstration Flow
- **Admin Panel (`#admin`)**: Session-local administration dashboard with real-time public propagation:
  - **Events Management**: Add new events or delete obsolete listings.
  - **Location & Venue Management**: Toggle campus buildings between Operational and Closed. When deactivating a location with scheduled events (e.g., Auditorium), the system displays a confirmation dialog warning that scheduled events will be impacted.
  - **Room Overrides**: Reassign classes to alternate classrooms with immediate synchronization to Classes and Rooms views.
  - **Timetable Reschedule**: Adjust slot times or rooms with live schedule updates.
  - **Live Announcements**: Broadcast critical alerts directly to the dashboard and global marquee ticker.

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Core Framework** | React 18 | Declarative component architecture |
| **Build & Tooling** | Vite 5.4 | Fast HMR dev server & optimized Rollup production bundling |
| **Styling & Design System** | Tailwind CSS + Vanilla CSS | Curated HSL color palette, liquid-glass tokens, radar sweep animations |
| **Icons** | Lucide React | Clean, accessible SVG iconography |
| **QR Code Scanner** | jsQR | Camera-based student exam seating lookup |
| **QR Code Generator** | qrcode | On-demand seating slip QR generation |
| **Data Architecture** | React Context (`AppContext`) | Single source of truth with offline fallback resilience |

---

## Local Development & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- npm v9.0.0 or higher

### Installation & Launch

```bash
# 1. Clone repository
git clone https://github.com/your-username/mini-project.git
cd mini-project

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

The application will start on `http://localhost:5173`.

### Quality Assurance & Build Commands

```bash
# Run ESLint validation
npm run lint

# Compile production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Spatial Map Calibration Notice

The campus map currently operates in **Calibration Standby Mode**:
- Physical building coordinates, quadrant zoning, and real walking times are pending formal institutional survey integration.
- The map canvas features organic topographic contours, calibration benchmark markers, radar sweep effects, and interactive pan/zoom controls.
- To discover campus buildings and classrooms without spatial distortion, use the independent **Campus Directory (`#directory`)** and **Classrooms (`#classes`)** modules.

---

## Browser Support & Accessibility

- **Responsive Viewports**: Fully responsive across mobile (375px+), tablet (768px+), and desktop (1024px - 4K).
- **Reduced Motion**: Full support for `prefers-reduced-motion: reduce`, disabling continuous radar sweeps, infinite loops, and heavy transition springs for sensitive users.
- **Theme Modes**: Liquid-glass dark mode and high-contrast light mode with automatic system theme synchronization.
