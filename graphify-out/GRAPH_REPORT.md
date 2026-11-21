# Graph Report - hris  (2026-11-21)

## Corpus Check
- 87 files · ~56,163 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 10, .example 1, .css 1)

## Summary
- 384 nodes · 905 edges · 40 communities (12 shown, 28 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f15ec0b6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Inertia React UI & Layout Components
- Frontend Dependencies & Manifest
- Backend Composer Dependencies
- Inertia React UI & Layout Components
- react
- System Settings & Configuration
- Module Group 8 (Illuminate\Foundation\Exceptions\Renderer\Renderer)
- Laravel Application Bootstrap
- Frontend Build & Compiler Config
- Project Documentation & Agent Standards
- cn
- Anti-Slop (Full Specification)
- Ponytail (Companion Pragmatism Skill)
- CatatanKehadiran.jsx

## God Nodes (most connected - your core abstractions)
1. `react` - 40 edges
2. `cn()` - 36 edges
3. `lucide-react` - 30 edges
4. `Card()` - 22 edges
5. `CardContent()` - 22 edges
6. `CardDescription()` - 22 edges
7. `CardHeader()` - 22 edges
8. `CardTitle()` - 22 edges
9. `PageHeader()` - 21 edges
10. `LaporanRekap()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Input()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/input.jsx → resources/js/lib/utils.js
- `JadwalShift()` --calls--> `ModalFormTukarShift()`  [EXTRACTED]
  resources/js/Pages/Admin/Jadwal/JadwalShift.jsx → resources/js/Pages/Admin/Jadwal/Partials/ModalFormTukarShift.jsx
- `RaporIndividu()` --calls--> `Badge()`  [EXTRACTED]
  resources/js/Pages/Admin/Laporan/Partials/RaporIndividu.jsx → resources/js/components/ui/badge.jsx
- `RaporIndividu()` --calls--> `Button()`  [EXTRACTED]
  resources/js/Pages/Admin/Laporan/Partials/RaporIndividu.jsx → resources/js/components/ui/button.jsx
- `Card()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/card.jsx → resources/js/lib/utils.js

## Import Cycles
- None detected.

## Communities (40 total, 28 thin omitted)

### Community 0 - "Inertia React UI & Layout Components"
Cohesion: 0.34
Nodes (19): @inertiajs/react, lucide-react, Card(), CardContent(), CardDescription(), CardHeader(), CardTitle(), PageHeader() (+11 more)

### Community 1 - "Frontend Dependencies & Manifest"
Cohesion: 0.07
Nodes (33): dependencies, clsx@^2.1.1, @inertiajs/react@^2.0.0, lucide-react@^0.475.0, react@^18.3.1, react-dom@^18.3.1, recharts@^2.15.0, tailwind-merge@^2.5.5 (+25 more)

### Community 2 - "Backend Composer Dependencies"
Cohesion: 0.05
Nodes (41): block, pestphp/pest-plugin, php-http/discovery, autoload, autoload-dev, psr-4, psr-4, config (+33 more)

### Community 4 - "Inertia React UI & Layout Components"
Cohesion: 0.07
Nodes (3): HandleInertiaRequests, MATCH /logout(), POST /login()

### Community 5 - "react"
Cohesion: 0.12
Nodes (16): react, renderAdminLayout(), renderUserLayout(), badgeVariants, Footer(), Input(), PageContainer(), IMPLEMENTED_ROUTES (+8 more)

### Community 6 - "System Settings & Configuration"
Cohesion: 0.20
Nodes (17): PengaturanSistem(), DEFAULT_ATTENDANCE_SETTINGS, DEFAULT_COMPANY_PROFILE, DEFAULT_SHIFT_SETTINGS, dispatchSyncEvent(), getAttendanceSettings(), getCompanyProfile(), getLocations() (+9 more)

### Community 8 - "Module Group 8 (Illuminate\Foundation\Exceptions\Renderer\Renderer)"
Cohesion: 0.44
Nodes (7): d(), f(), g(), n(), p(), u(), v()

### Community 10 - "Frontend Build & Compiler Config"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 13 - "cn"
Cohesion: 0.11
Nodes (34): class-variance-authority@^0.7.1, class-variance-authority, Badge(), Button(), buttonVariants, CardFooter(), Modal(), ModalBody() (+26 more)

### Community 39 - "Anti-Slop (Full Specification)"
Cohesion: 0.18
Nodes (10): 1. Anti-Slop Code Hygiene, 2. Anti-Slop UI & Design, 3. Anti-Slop Communication & Copywriting, 4. Delivery Gate (Pre-Flight Self-Audit), Anti-Slop (Full Specification), Clean Code Standards, Direct, Natural Phrasing, Pragmatic Architecture (No Pretentious Over-Abstraction) (+2 more)

### Community 40 - "Ponytail (Companion Pragmatism Skill)"
Cohesion: 0.40
Nodes (4): Non-Negotiable Boundaries (Never Cut Corners Here), Output Standard, Ponytail (Companion Pragmatism Skill), The Decision Ladder

### Community 41 - "CatatanKehadiran.jsx"
Cohesion: 0.09
Nodes (32): xlsx, masterRecentAttendance, weeklyTrendData, EMPLOYEES_SCHEDULE, JadwalShift(), WEEKS, ModalFormTukarShift(), SHIFT_12H_OPTIONS (+24 more)

## Knowledge Gaps
- **1 isolated node(s):** `Aturan Antislop & Ponytail`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 143 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Inertia React UI & Layout Components`, `Frontend Dependencies & Manifest`, `cn`, `CatatanKehadiran.jsx`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **What connects `Aturan Antislop & Ponytail` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Dependencies & Manifest` be split into smaller, more focused modules?**
  _Cohesion score 0.0746031746031746 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Inertia React UI & Layout Components` to `Frontend Dependencies & Manifest`, `react`, `cn`, `CatatanKehadiran.jsx`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Should `Backend Composer Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Why does `@inertiajs/react` connect `Inertia React UI & Layout Components` to `Frontend Dependencies & Manifest`, `cn`, `react`, `CatatanKehadiran.jsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `Inertia React UI & Layout Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06554621848739496 - nodes in this community are weakly interconnected._