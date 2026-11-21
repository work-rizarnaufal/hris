# Graph Report - hris  (2026-11-21)

## Corpus Check
- 87 files · ~53,888 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 10, .example 1, .css 1)

## Summary
- 371 nodes · 1023 edges · 44 communities (14 shown, 30 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a5be24c5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Inertia React UI & Layout Components
- Frontend Dependencies & Manifest
- Backend Composer Dependencies
- Atomic Table & Spreadsheet Export
- Inertia React UI & Layout Components
- Atomic Modals & Form UI
- System Settings & Configuration
- app.jsx
- Module Group 8 (Illuminate\Foundation\Exceptions\Renderer\Renderer)
- Laravel Application Bootstrap
- Frontend Build & Compiler Config
- Project Documentation & Agent Standards
- Brand Tokens & Theme Config
- Anti-Slop (Full Specification)
- Ponytail (Companion Pragmatism Skill)
- Beranda.jsx
- dependencies
- scripts

## God Nodes (most connected - your core abstractions)
1. `react` - 40 edges
2. `cn()` - 36 edges
3. `PengaturanSistem()` - 34 edges
4. `Card()` - 32 edges
5. `CardContent()` - 32 edges
6. `CardDescription()` - 30 edges
7. `CardHeader()` - 30 edges
8. `CardTitle()` - 30 edges
9. `lucide-react` - 30 edges
10. `PageHeader()` - 29 edges

## Surprising Connections (you probably didn't know these)
- `renderAdminLayout()` --calls--> `LayoutUtama()`  [EXTRACTED]
  resources/js/app.jsx → resources/js/Layouts/LayoutUtama.jsx
- `Card()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/card.jsx → resources/js/lib/utils.js
- `JadwalShift()` --calls--> `Card()`  [EXTRACTED]
  resources/js/Pages/Admin/Jadwal/JadwalShift.jsx → resources/js/components/ui/card.jsx
- `PanelRotasiGrup()` --calls--> `Card()`  [EXTRACTED]
  resources/js/Pages/Admin/Jadwal/Partials/PanelRotasiGrup.jsx → resources/js/components/ui/card.jsx
- `DataKaryawan()` --calls--> `Card()`  [EXTRACTED]
  resources/js/Pages/Admin/Karyawan/DataKaryawan.jsx → resources/js/components/ui/card.jsx

## Import Cycles
- None detected.

## Communities (44 total, 30 thin omitted)

### Community 0 - "Inertia React UI & Layout Components"
Cohesion: 0.17
Nodes (29): @inertiajs/react, lucide-react, react, Card(), CardContent(), CardDescription(), CardHeader(), CardTitle() (+21 more)

### Community 1 - "Frontend Dependencies & Manifest"
Cohesion: 0.14
Nodes (17): devDependencies, autoprefixer@^10.4.20, laravel-vite-plugin@^1.2.0, postcss@^8.4.49, tailwindcss@^3.4.17, vite@^6.0.3, @vitejs/plugin-react@^4.3.4, name (+9 more)

### Community 2 - "Backend Composer Dependencies"
Cohesion: 0.05
Nodes (41): block, pestphp/pest-plugin, php-http/discovery, autoload, autoload-dev, psr-4, psr-4, config (+33 more)

### Community 3 - "Atomic Table & Spreadsheet Export"
Cohesion: 0.27
Nodes (28): xlsx, Badge(), Table, TableBody, TableCell, TableEmpty, TableFilterGroup, TableHead (+20 more)

### Community 4 - "Inertia React UI & Layout Components"
Cohesion: 0.07
Nodes (3): HandleInertiaRequests, MATCH /logout(), POST /login()

### Community 5 - "Atomic Modals & Form UI"
Cohesion: 0.12
Nodes (32): class-variance-authority, badgeVariants, Button(), buttonVariants, CardFooter(), Input(), Modal(), ModalBody() (+24 more)

### Community 6 - "System Settings & Configuration"
Cohesion: 0.23
Nodes (20): PengaturanSistem(), DEFAULT_ATTENDANCE_SETTINGS, DEFAULT_COMPANY_PROFILE, DEFAULT_SHIFT_SETTINGS, dispatchSyncEvent(), formatDateDMY(), getAttendanceSettings(), getCompanyProfile() (+12 more)

### Community 7 - "app.jsx"
Cohesion: 0.24
Nodes (5): react-dom@^18.3.1, react-dom, renderAdminLayout(), renderUserLayout(), LayoutPublik()

### Community 8 - "Module Group 8 (Illuminate\Foundation\Exceptions\Renderer\Renderer)"
Cohesion: 0.44
Nodes (7): d(), f(), g(), n(), p(), u(), v()

### Community 10 - "Frontend Build & Compiler Config"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 39 - "Anti-Slop (Full Specification)"
Cohesion: 0.18
Nodes (10): 1. Anti-Slop Code Hygiene, 2. Anti-Slop UI & Design, 3. Anti-Slop Communication & Copywriting, 4. Delivery Gate (Pre-Flight Self-Audit), Anti-Slop (Full Specification), Clean Code Standards, Direct, Natural Phrasing, Pragmatic Architecture (No Pretentious Over-Abstraction) (+2 more)

### Community 40 - "Ponytail (Companion Pragmatism Skill)"
Cohesion: 0.40
Nodes (4): Non-Negotiable Boundaries (Never Cut Corners Here), Output Standard, Ponytail (Companion Pragmatism Skill), The Decision Ladder

### Community 42 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, class-variance-authority@^0.7.1, clsx@^2.1.1, @inertiajs/react@^2.0.0, lucide-react@^0.475.0, react@^18.3.1, recharts@^2.15.0, tailwind-merge@^2.5.5 (+4 more)

### Community 43 - "scripts"
Cohesion: 0.67
Nodes (3): scripts, build, dev

## Knowledge Gaps
- **1 isolated node(s):** `Aturan Antislop & Ponytail`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 158 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Inertia React UI & Layout Components` to `Frontend Dependencies & Manifest`, `Atomic Table & Spreadsheet Export`, `Atomic Modals & Form UI`, `System Settings & Configuration`, `app.jsx`, `Beranda.jsx`, `dependencies`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **What connects `Aturan Antislop & Ponytail` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Dependencies & Manifest` be split into smaller, more focused modules?**
  _Cohesion score 0.14210526315789473 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Inertia React UI & Layout Components` to `Frontend Dependencies & Manifest`, `Atomic Table & Spreadsheet Export`, `Atomic Modals & Form UI`, `System Settings & Configuration`, `Beranda.jsx`, `dependencies`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `Backend Composer Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Why does `@inertiajs/react` connect `Inertia React UI & Layout Components` to `Frontend Dependencies & Manifest`, `Atomic Table & Spreadsheet Export`, `System Settings & Configuration`, `app.jsx`, `Beranda.jsx`, `dependencies`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `Inertia React UI & Layout Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06554621848739496 - nodes in this community are weakly interconnected._