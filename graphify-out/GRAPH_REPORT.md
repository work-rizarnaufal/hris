# Graph Report - hris  (2026-11-21)

## Corpus Check
- 87 files · ~54,399 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 10, .example 1, .css 1)

## Summary
- 384 nodes · 1000 edges · 41 communities (12 shown, 29 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `40055eea`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Inertia React UI & Layout Components
- Frontend Dependencies & Manifest
- Backend Composer Dependencies
- Atomic Table & Spreadsheet Export
- Inertia React UI & Layout Components
- react
- System Settings & Configuration
- Module Group 8 (Illuminate\Foundation\Exceptions\Renderer\Renderer)
- Laravel Application Bootstrap
- Frontend Build & Compiler Config
- Project Documentation & Agent Standards
- Brand Tokens & Theme Config
- Anti-Slop (Full Specification)
- Ponytail (Companion Pragmatism Skill)
- CatatanKehadiran.jsx

## God Nodes (most connected - your core abstractions)
1. `react` - 40 edges
2. `cn()` - 36 edges
3. `PengaturanSistem()` - 34 edges
4. `Card()` - 30 edges
5. `CardContent()` - 30 edges
6. `lucide-react` - 30 edges
7. `CardDescription()` - 29 edges
8. `CardHeader()` - 29 edges
9. `CardTitle()` - 29 edges
10. `PageHeader()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `CardFooter()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/card.jsx → resources/js/lib/utils.js
- `Modal()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/modal.jsx → resources/js/lib/utils.js
- `ModalImporKaryawan()` --calls--> `Modal()`  [EXTRACTED]
  resources/js/Pages/Admin/Karyawan/Partials/ModalImporKaryawan.jsx → resources/js/components/ui/modal.jsx
- `ModalHeader()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/modal.jsx → resources/js/lib/utils.js
- `ModalImporKaryawan()` --calls--> `ModalHeader()`  [EXTRACTED]
  resources/js/Pages/Admin/Karyawan/Partials/ModalImporKaryawan.jsx → resources/js/components/ui/modal.jsx

## Import Cycles
- None detected.

## Communities (41 total, 29 thin omitted)

### Community 0 - "Inertia React UI & Layout Components"
Cohesion: 0.32
Nodes (20): @inertiajs/react, lucide-react, Card(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle() (+12 more)

### Community 1 - "Frontend Dependencies & Manifest"
Cohesion: 0.07
Nodes (34): dependencies, class-variance-authority@^0.7.1, clsx@^2.1.1, @inertiajs/react@^2.0.0, lucide-react@^0.475.0, react@^18.3.1, react-dom@^18.3.1, recharts@^2.15.0 (+26 more)

### Community 2 - "Backend Composer Dependencies"
Cohesion: 0.05
Nodes (41): block, pestphp/pest-plugin, php-http/discovery, autoload, autoload-dev, psr-4, psr-4, config (+33 more)

### Community 3 - "Atomic Table & Spreadsheet Export"
Cohesion: 0.29
Nodes (28): xlsx, Badge(), Button(), Table, TableBody, TableCaption, TableCell, TableEmpty (+20 more)

### Community 4 - "Inertia React UI & Layout Components"
Cohesion: 0.07
Nodes (3): HandleInertiaRequests, MATCH /logout(), POST /login()

### Community 5 - "react"
Cohesion: 0.10
Nodes (22): class-variance-authority, react, renderAdminLayout(), renderUserLayout(), badgeVariants, buttonVariants, Footer(), PageContainer() (+14 more)

### Community 6 - "System Settings & Configuration"
Cohesion: 0.14
Nodes (32): Input(), Modal(), ModalBody(), ModalFooter(), ModalHeader(), sizeMap, ModalFormTukarShift(), SHIFT_OPTIONS (+24 more)

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

### Community 41 - "CatatanKehadiran.jsx"
Cohesion: 0.07
Nodes (14): masterRecentAttendance, weeklyTrendData, CatatanKehadiran(), DEFAULT_DATE, INITIAL_ATTENDANCES, MASTER_EMPLOYEES, calculateTardiness(), isValidTime() (+6 more)

## Knowledge Gaps
- **1 isolated node(s):** `Aturan Antislop & Ponytail`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 148 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Inertia React UI & Layout Components`, `Frontend Dependencies & Manifest`, `Atomic Table & Spreadsheet Export`, `System Settings & Configuration`, `CatatanKehadiran.jsx`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **What connects `Aturan Antislop & Ponytail` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Dependencies & Manifest` be split into smaller, more focused modules?**
  _Cohesion score 0.07207207207207207 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Inertia React UI & Layout Components` to `Frontend Dependencies & Manifest`, `Atomic Table & Spreadsheet Export`, `react`, `System Settings & Configuration`, `CatatanKehadiran.jsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `Backend Composer Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Why does `@inertiajs/react` connect `Inertia React UI & Layout Components` to `Frontend Dependencies & Manifest`, `Atomic Table & Spreadsheet Export`, `react`, `System Settings & Configuration`, `CatatanKehadiran.jsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `Inertia React UI & Layout Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06554621848739496 - nodes in this community are weakly interconnected._