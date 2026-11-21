# Graph Report - hris  (2026-11-21)

## Corpus Check
- 87 files · ~53,201 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 9, .example 1, .css 1)

## Summary
- 357 nodes · 1035 edges · 41 communities (12 shown, 29 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `794ef627`
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
- LayoutUtama.jsx
- Module Group 8 (Illuminate\Foundation\Exceptions\Renderer\Renderer)
- Laravel Application Bootstrap
- Frontend Build & Compiler Config
- Project Documentation & Agent Standards
- Brand Tokens & Theme Config
- Anti-Slop (Full Specification)
- Ponytail (Companion Pragmatism Skill)

## God Nodes (most connected - your core abstractions)
1. `react` - 40 edges
2. `cn()` - 36 edges
3. `PengaturanSistem()` - 34 edges
4. `Card()` - 34 edges
5. `CardContent()` - 34 edges
6. `CardHeader()` - 32 edges
7. `CardTitle()` - 32 edges
8. `CardDescription()` - 32 edges
9. `PageHeader()` - 31 edges
10. `lucide-react` - 30 edges

## Surprising Connections (you probably didn't know these)
- `renderAdminLayout()` --calls--> `LayoutUtama()`  [EXTRACTED]
  resources/js/app.jsx → resources/js/Layouts/LayoutUtama.jsx
- `LayoutUtama()` --calls--> `PageHeader()`  [EXTRACTED]
  resources/js/Layouts/LayoutUtama.jsx → resources/js/components/ui/page-header.jsx
- `LayoutUtama()` --calls--> `Toast()`  [EXTRACTED]
  resources/js/Layouts/LayoutUtama.jsx → resources/js/components/ui/toast.jsx
- `Beranda()` --calls--> `Table`  [EXTRACTED]
  resources/js/Pages/Admin/Beranda/Beranda.jsx → resources/js/components/ui/table.jsx
- `Beranda()` --calls--> `TableBody`  [EXTRACTED]
  resources/js/Pages/Admin/Beranda/Beranda.jsx → resources/js/components/ui/table.jsx

## Import Cycles
- None detected.

## Communities (41 total, 29 thin omitted)

### Community 0 - "Inertia React UI & Layout Components"
Cohesion: 0.25
Nodes (24): @inertiajs/react, lucide-react, react, Card(), CardContent(), CardDescription(), CardHeader(), CardTitle() (+16 more)

### Community 1 - "Frontend Dependencies & Manifest"
Cohesion: 0.08
Nodes (32): dependencies, class-variance-authority@^0.7.1, clsx@^2.1.1, @inertiajs/react@^2.0.0, lucide-react@^0.475.0, react@^18.3.1, recharts@^2.15.0, tailwind-merge@^2.5.5 (+24 more)

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

### Community 7 - "LayoutUtama.jsx"
Cohesion: 0.13
Nodes (14): react-dom@^18.3.1, react-dom, renderAdminLayout(), renderUserLayout(), Footer(), PageContainer(), IMPLEMENTED_ROUTES, Sidebar() (+6 more)

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

## Knowledge Gaps
- **1 isolated node(s):** `Aturan Antislop & Ponytail`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 143 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Inertia React UI & Layout Components` to `Frontend Dependencies & Manifest`, `Atomic Table & Spreadsheet Export`, `Atomic Modals & Form UI`, `System Settings & Configuration`, `LayoutUtama.jsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `Aturan Antislop & Ponytail` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Dependencies & Manifest` be split into smaller, more focused modules?**
  _Cohesion score 0.07563025210084033 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Inertia React UI & Layout Components` to `Frontend Dependencies & Manifest`, `Atomic Table & Spreadsheet Export`, `Atomic Modals & Form UI`, `System Settings & Configuration`, `LayoutUtama.jsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `Backend Composer Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Why does `@inertiajs/react` connect `Inertia React UI & Layout Components` to `Frontend Dependencies & Manifest`, `Atomic Table & Spreadsheet Export`, `System Settings & Configuration`, `LayoutUtama.jsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `Inertia React UI & Layout Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06554621848739496 - nodes in this community are weakly interconnected._