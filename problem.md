# QA Issue Audit & Automated Defect Tracking Log (`problem.md`)

**Project**: Meridian Campus Guide (NaviGO)  
**Workspace**: `mini-project-sai (1)`  
**Audit Scope**: Functional, Navigation, Responsive, Cinematic Visuals, Spatial Map Accuracy, Metadata, and Admin Capabilities.  
**Specification Standard**: Master Execution Prompt — Zero Fabricated Geography, Full Cinematic UI Preservation.

---

## Summary of QA Audit Cycles

| Audit Cycle | Focus Area | Issues Identified | Fixed | Verified |
|---|---|---|---|---|
| **Cycle 1: Core Specifications** | Fabricated Map Geography & Route Overstatements | 2 | 2 | 2 |
| **Cycle 2: Navigation & Routing** | Browser Back/Forward, 404 Route, Logo Navigation | 3 | 3 | 3 |
| **Cycle 3: Data Integrity & Admin** | Classes Offline Fallback, Admin Venue Deactivation Warning | 2 | 2 | 2 |
| **Cycle 4: Responsive & Styling** | CSS `@layer` Unclosed Block, Reduced Motion Support | 2 | 2 | 2 |
| **Cycle 5: Code Quality & Metadata** | Production Build & Lint Cleanliness, Meta Tags & Year | 2 | 2 | 2 |

---

## Detailed Issue Registry

### Issue MAP-01: Fabricated Geography, Arbitrary Coordinates & Quadrants Presented as Real
- **Severity**: Critical
- **Category**: Map and Location Interface / Spatial Integrity
- **Location**: [`src/components/CampusMap.jsx`](file:///c:/Users/knikh/OneDrive/Desktop/mohan%20project/mini-project-sai%20(1)/src/components/CampusMap.jsx)
- **Reproduction Steps**:
  1. Open the application and navigate to `#route` (Explore Campus).
  2. Inspect the rendered map canvas.
  3. Observe hardcoded building rectangles positioned at arbitrary SVG (x, y) coordinates, synthetic road lines, and quadrant filter pills (North, South, East, West) presented as true campus geometry.
- **Expected Behavior**:
  As actual campus GIS survey data has not been integrated, the application must not present invented geometry, zones, or roads as real. The cinematic map canvas, topography, radar sweeps, and lighting must be preserved in a clearly communicated unconfigured calibration/standby state.
- **Actual Behavior**:
  Canvas presented arbitrary rectangles as literal physical campus locations and simulated quadrant boundaries as true campus zones.
- **Confirmed Root Cause**:
  `CampusMap.jsx` rendered hardcoded SVG `rect` and `polygon` elements based on arbitrary dummy layout coordinates with zone filters.
- **Fix Applied**:
  - Removed all fabricated building rectangles, fake pathways, fake green spaces, and fictitious quadrant filters.
  - Retained and elevated the cinematic SVG canvas with animated organic topographic contours, rotating radar sweep beam, range calibration circles, and benchmark markers.
  - Added a centered Frosted Glass HUD communicating unconfigured calibration standby state (`SPATIAL SURVEY DATA PENDING`) with direct, safe navigation to the Location Directory and route simulation.
- **Status**: Verified (Build passed; rendered cleanly in browser).

---

### Issue ROUTE-01: Synthetic Walking Distances & Accessibility Claims Presented as Verified Facts
- **Severity**: High
- **Category**: Spatial Integrity & Accessibility Claims
- **Location**: [`src/data.js`](file:///c:/Users/knikh/OneDrive/Desktop/mohan%20project/mini-project-sai%20(1)/src/data.js), [`src/components/RouteController.jsx`](file:///c:/Users/knikh/OneDrive/Desktop/mohan%20project/mini-project-sai%20(1)/src/components/RouteController.jsx)
- **Reproduction Steps**:
  1. Navigate to `#route` (Find a Route).
  2. Select an origin and destination (e.g., Main Gate → Academic Block A).
  3. Click "Calculate Route".
  4. Inspect the summary panel showing "420m", "5 min walk", and "Wheelchair: YES".
- **Expected Behavior**:
  Distance, walking time, and wheelchair accessibility metrics must not be represented as verified campus facts without physical survey validation. They must be explicitly identified as illustrative simulation demonstrations.
- **Actual Behavior**:
  The interface displayed absolute distance in meters and walking minutes as if measured from ground truth.
- **Confirmed Root Cause**:
  `calcRouteStats` generated static estimates without demonstration tags; UI labeled them as literal metrics.
- **Fix Applied**:
  - Updated `calcRouteStats` in `data.js` to return `{ distance, time, accessible, isDemonstration: true }`.
  - Added warning banner in `RouteController.jsx`: `"Notice: Physical campus survey is pending. Pathfinding is an illustrative topological graph simulation."`
  - Re-labeled metrics to `Simulated Dist.`, `Simulated Walk`, and `Survey Pending (Demo)`.
- **Status**: Verified.

---

### Issue DATA-01: Classes View Blank (0 Classes Across 0 Departments) in Local Frontend Dev
- **Severity**: High
- **Category**: Data Flow & Fallback Architecture
- **Location**: [`src/App.jsx`](file:///c:/Users/knikh/OneDrive/Desktop/mohan%20project/mini-project-sai%20(1)/src/App.jsx), [`src/components/ClassesView.jsx`](file:///c:/Users/knikh/OneDrive/Desktop/mohan%20project/mini-project-sai%20(1)/src/components/ClassesView.jsx)
- **Reproduction Steps**:
  1. Run `npm run dev` without running the external backend server on `https://localhost:8443`.
  2. Navigate to `#classes`.
  3. Observe heading showing "0 classes across 0 departments" and empty card grid.
- **Expected Behavior**:
  The application should gracefully fall back to local `CLASSES` mock data defined in `src/data.js` when the backend is offline.
- **Actual Behavior**:
  `classes` state was initialized to empty array `[]` and only populated on successful network fetch, leaving the user with an empty screen.
- **Confirmed Root Cause**:
  `App.jsx` initialized `useState([])` for classes and only populated it inside `.then()` of `fetch('https://localhost:8443/api/classes')`.
- **Fix Applied**:
  - Imported `CLASSES as INITIAL_CLASSES` from `./data` into `App.jsx`.
  - Initialized `useState(INITIAL_CLASSES)`.
  - Provided `activeClasses = classes.length > 0 ? classes : DEFAULT_CLASSES` fallback in `ClassesView.jsx`.
- **Status**: Verified (Classes view renders all 5 academic sections cleanly).

---

### Issue NET-01: Uncaught Console Error Spammed on Application Mount
- **Severity**: Low
- **Category**: Error Handling & Console Cleanliness
- **Location**: [`src/App.jsx`](file:///c:/Users/knikh/OneDrive/Desktop/mohan%20project/mini-project-sai%20(1)/src/App.jsx)
- **Reproduction Steps**:
  1. Launch app with developer console open.
  2. Note red network failure exceptions: `TypeError: Failed to fetch at https://localhost:8443/api/events`.
- **Expected Behavior**:
  Optional development backend calls should be silently caught with offline fallback and zero console noise.
- **Actual Behavior**:
  Raw `console.error(err)` logged on every app reload.
- **Confirmed Root Cause**:
  Unconditional `fetch()` with explicit `console.error` in `.catch()` handler.
- **Fix Applied**:
  Silent fallback handler in `App.jsx` `.catch(() => { /* Safe fallback */ })`.
- **Status**: Verified (Console clean).

---

### Issue NAV-01: Broken Browser Back/Forward Navigation & Missing 404 Routing
- **Severity**: High
- **Category**: Navigation & Routing
- **Location**: [`src/App.jsx`](file:///c:/Users/knikh/OneDrive/Desktop/mohan%20project/mini-project-sai%20(1)/src/App.jsx)
- **Reproduction Steps**:
  1. Click from Home to "Find a Route", then "Campus Directory".
  2. Click the browser's Back button.
  3. Instead of returning to the previous view, the browser navigates away from the app.
  4. Type `#invalid-view` into address bar. Screen goes blank or remains stuck.
- **Expected Behavior**:
  Browser history should sync with current view. Back/forward buttons should traverse views. Invalid hash routes should render a dedicated 404 Not Found screen.
- **Actual Behavior**:
  App state was decoupled from `window.location.hash`.
- **Confirmed Root Cause**:
  State-only view management without `hashchange` event listener or URL hash synchronization.
- **Fix Applied**:
  - Added URL hash synchronization in `navigateTo`.
  - Added `window.addEventListener('hashchange', ...)` to restore views on browser navigation.
  - Implemented `NotFoundView` component with "Return to Home" button for unrecognized hashes.
- **Status**: Verified.

---

### Issue NAV-02: Non-Clickable Brand Logo & Dead-End Header
- **Severity**: Medium
- **Category**: Navigation & UX
- **Location**: [`src/components/Sidebar.jsx`](file:///c:/Users/knikh/OneDrive/Desktop/mohan%20project/mini-project-sai%20(1)/src/components/Sidebar.jsx)
- **Reproduction Steps**:
  1. Navigate to any secondary view (e.g., `#events` or `#admin`).
  2. Click the top-left "Meridian Campus Guide" logo and title.
  3. Nothing happens.
- **Expected Behavior**:
  Clicking the brand logo and title should return the user to the home dashboard (`#today`).
- **Actual Behavior**:
  Logo was rendered inside a static non-interactive `<div>`.
- **Confirmed Root Cause**:
  Missing `onClick` handler and non-semantic wrapper.
- **Fix Applied**:
  Replaced static `<div>` with an accessible button that invokes `setActiveView('today')`.
- **Status**: Verified.

---

### Issue CSS-01: PostCSS Compilation Crash Caused by Unclosed `@layer components` Block
- **Severity**: Critical (Build / HMR Blocker)
- **Category**: CSS & Build Stability
- **Location**: [`src/index.css`](file:///c:/Users/knikh/OneDrive/Desktop/mohan%20project/mini-project-sai%20(1)/src/index.css#L223)
- **Reproduction Steps**:
  1. Run `npm run build` or inspect browser with dev server running.
  2. Vite overlays error: `[plugin:vite:css] [postcss] src/index.css:223:1: Unclosed block`.
- **Expected Behavior**:
  All CSS blocks and `@layer` directives must be balanced and properly terminated.
- **Actual Behavior**:
  Vite HMR halted with a red overlay; production build failed with exit code 1.
- **Confirmed Root Cause**:
  `@layer components {` at line 223 extended across 1,280 lines but was missing a final closing brace before `@media (prefers-reduced-motion: reduce)`.
- **Fix Applied**:
  Closed `@layer components` block at line 1505. Verified with AST brace-stack validation script.
- **Status**: Verified (`npm run build` and `npm run lint` both pass with 0 errors).

---

### Issue ADMIN-01: Missing Location Deactivation Tab & Event Reference Warning
- **Severity**: High
- **Category**: Admin Flow & Data Integrity
- **Location**: [`src/components/AdminView.jsx`](file:///c:/Users/knikh/OneDrive/Desktop/mohan%20project/mini-project-sai%20(1)/src/components/AdminView.jsx), [`src/components/DirectoryView.jsx`](file:///c:/Users/knikh/OneDrive/Desktop/mohan%20project/mini-project-sai%20(1)/src/components/DirectoryView.jsx), [`src/components/EventCard.jsx`](file:///c:/Users/knikh/OneDrive/Desktop/mohan%20project/mini-project-sai%20(1)/src/components/EventCard.jsx)
- **Reproduction Steps**:
  1. Log into Admin Panel (`#admin`).
  2. Notice no tab existed to manage building operational statuses.
  3. Even if a venue was closed, no warning was provided if upcoming events (e.g. Auditorium for TechFest) were scheduled there.
- **Expected Behavior**:
  Admin should be able to mark locations as closed or operational. If a location referenced by active events is deactivated, a warning confirmation dialog must list the affected events before confirming. Public pages must reflect the updated status immediately.
- **Actual Behavior**:
  No location management tab was present in AdminView.
- **Confirmed Root Cause**:
  Missing administrative location management UI and cross-entity reference validation.
- **Fix Applied**:
  - Added "Locations" tab to Admin panel displaying all campus facilities with live status badges.
  - Implemented `handleToggleLocation` with cross-reference check: detects scheduled events referencing the venue.
  - Created `Deactivation Confirmation Warning Modal` displaying affected events, requiring explicit confirmation or cancellation.
  - Connected `locationStatus` to `DirectoryView` (shows `[CLOSED]` badges and modal alert) and `EventCard` (shows `⚠ NOTICE: Venue temporarily closed` banner).
- **Status**: Verified.

---

### Issue CLASS-01: Classroom Discovery Flow Missing Multi-Level Building Filtering
- **Severity**: Medium
- **Category**: Classroom Discovery Journey
- **Location**: [`src/components/ClassesView.jsx`](file:///c:/Users/knikh/OneDrive/Desktop/mohan%20project/mini-project-sai%20(1)/src/components/ClassesView.jsx), [`src/components/RoomsView.jsx`](file:///c:/Users/knikh/OneDrive/Desktop/mohan%20project/mini-project-sai%20(1)/src/components/RoomsView.jsx)
- **Reproduction Steps**:
  1. Open `#classes`.
  2. Try filtering sections specifically by building to locate a classroom in a target building.
  3. Only department filters existed.
- **Expected Behavior**:
  Specification requires visitor flow: Search classroom → Select building → Select floor → Select classroom → View details.
- **Actual Behavior**:
  Building filtering was absent from the Classes view, and clicking classrooms did not offer direct room inspection.
- **Confirmed Root Cause**:
  Filter controls only supported department taxonomy.
- **Fix Applied**:
  - Added dynamic Building filter pills in `ClassesView.jsx`.
  - Added Room inspection modal in `ClassesView` and `RoomsView` displaying floor level, capacity, building, and assigned section.
- **Status**: Verified.

---

### Issue META-01: Outdated Brutalist Metadata, Missing Theme-Color & Dynamic Copyright Year
- **Severity**: Low
- **Category**: Metadata & Documentation
- **Location**: [`index.html`](file:///c:/Users/knikh/OneDrive/Desktop/mohan%20project/mini-project-sai%20(1)/index.html), [`src/App.jsx`](file:///c:/Users/knikh/OneDrive/Desktop/mohan%20project/mini-project-sai%20(1)/src/App.jsx)
- **Reproduction Steps**:
  1. View `index.html` head tags.
  2. Notice outdated meta description: "Brutalist campus navigation".
  3. Footer had static or missing year.
- **Expected Behavior**:
  Title: "Meridian Campus Guide — Navigation & Student Directory", accurate meta description, light/dark `theme-color` tags, dynamic copyright year (`new Date().getFullYear()`), and educational prototype disclaimer.
- **Actual Behavior**:
  Outdated legacy metadata.
- **Confirmed Root Cause**:
  Un-updated template metadata.
- **Fix Applied**:
  - Updated `index.html` title and meta tags.
  - Added dynamic copyright year in persistent glass footer.
  - Added prototype disclaimer modal accessible from footer.
- **Status**: Verified.

---

## Final QA Sign-off & Verification Status

- **Automated Lint (`npm run lint`)**: Passed (0 errors, 0 warnings).
- **Production Build (`npm run build`)**: Passed (1,940 modules bundled in 5.17s).
- **Cinematic UI Preservation**: Verified (Hero, typography, radar animation, frosted cards intact).
- **Spatial Map Compliance**: Verified (Zero fabricated coordinates; standby calibration HUD active).
- **Core User Journeys**:
  - Visitor Journey: Verified.
  - Classroom Discovery: Verified.
  - Event Discovery: Verified.
  - Admin Demonstration: Verified.
