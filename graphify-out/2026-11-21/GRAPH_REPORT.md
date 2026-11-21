# Graph Report - hris  (2026-11-21)

## Corpus Check
- 89 files · ~62,520 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 10, .example 1, .css 1)

## Summary
- 430 nodes · 965 edges · 41 communities (13 shown, 28 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `359cec0a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Inertia React UI & Layout Components
- Frontend Dependencies & Manifest
- Backend Composer Dependencies
- HCGA HRIS Enterprise Design System (DESIGN.md)
- Inertia React UI & Layout Components
- lucide-react
- PengaturanSistem.jsx
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
3. `lucide-react` - 31 edges
4. `@inertiajs/react` - 21 edges
5. `Card()` - 18 edges
6. `CardContent()` - 18 edges
7. `CardDescription()` - 18 edges
8. `CardHeader()` - 18 edges
9. `CardTitle()` - 18 edges
10. `PageHeader()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `renderAdminLayout()` --calls--> `LayoutUtama()`  [EXTRACTED]
  resources/js/app.jsx → resources/js/Layouts/LayoutUtama.jsx
- `Card()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/card.jsx → resources/js/lib/utils.js
- `CardContent()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/card.jsx → resources/js/lib/utils.js
- `CardDescription()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/card.jsx → resources/js/lib/utils.js
- `CardHeader()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/card.jsx → resources/js/lib/utils.js

## Import Cycles
- None detected.

## Communities (41 total, 28 thin omitted)

### Community 0 - "Inertia React UI & Layout Components"
Cohesion: 0.41
Nodes (16): @inertiajs/react, Card(), CardContent(), CardDescription(), CardHeader(), CardTitle(), PageHeader(), LogAudit() (+8 more)

### Community 1 - "Frontend Dependencies & Manifest"
Cohesion: 0.07
Nodes (33): dependencies, class-variance-authority@^0.7.1, clsx@^2.1.1, @inertiajs/react@^2.0.0, lucide-react@^0.475.0, react@^18.3.1, react-dom@^18.3.1, recharts@^2.15.0 (+25 more)

### Community 2 - "Backend Composer Dependencies"
Cohesion: 0.05
Nodes (41): block, pestphp/pest-plugin, php-http/discovery, autoload, autoload-dev, psr-4, psr-4, config (+33 more)

### Community 3 - "HCGA HRIS Enterprise Design System (DESIGN.md)"
Cohesion: 0.06
Nodes (34): 1. Overview, 2. Colors, 3. Typography, 4. Layout, 5. Elevation & Depth, 6. Shapes & Form Controls, 7. Atomic UI Component Catalog, 8. Do's and Don'ts (+26 more)

### Community 4 - "Inertia React UI & Layout Components"
Cohesion: 0.07
Nodes (3): HandleInertiaRequests, MATCH /logout(), POST /login()

### Community 5 - "lucide-react"
Cohesion: 0.10
Nodes (17): lucide-react, renderAdminLayout(), renderUserLayout(), IMPLEMENTED_ROUTES, Sidebar(), Topbar(), getPageMetadata(), navigationConfig (+9 more)

### Community 6 - "PengaturanSistem.jsx"
Cohesion: 0.11
Nodes (39): JadwalShift(), getDynamicShift12HOptions(), ModalFormTukarShift(), SHIFT_12H_OPTIONS, PanelRotasiGrup(), DataKaryawan(), DIVISIONS, GROUPS (+31 more)

### Community 8 - "Module Group 8 (Illuminate\Foundation\Exceptions\Renderer\Renderer)"
Cohesion: 0.44
Nodes (7): d(), f(), g(), n(), p(), u(), v()

### Community 10 - "Frontend Build & Compiler Config"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 13 - "cn"
Cohesion: 0.10
Nodes (32): class-variance-authority, react, Badge(), badgeVariants, Button(), buttonVariants, CardFooter(), Input() (+24 more)

### Community 39 - "Anti-Slop (Full Specification)"
Cohesion: 0.18
Nodes (10): 1. Anti-Slop Code Hygiene, 2. Anti-Slop UI & Design, 3. Anti-Slop Communication & Copywriting, 4. Delivery Gate (Pre-Flight Self-Audit), Anti-Slop (Full Specification), Clean Code Standards, Direct, Natural Phrasing, Pragmatic Architecture (No Pretentious Over-Abstraction) (+2 more)

### Community 40 - "Ponytail (Companion Pragmatism Skill)"
Cohesion: 0.40
Nodes (4): Non-Negotiable Boundaries (Never Cut Corners Here), Output Standard, Ponytail (Companion Pragmatism Skill), The Decision Ladder

### Community 41 - "CatatanKehadiran.jsx"
Cohesion: 0.15
Nodes (15): recharts, xlsx, masterRecentAttendance, weeklyTrendData, EMPLOYEES_SCHEDULE, WEEKS, INITIAL_EMPLOYEES, DEFAULT_DATE (+7 more)

## Knowledge Gaps
- **1 isolated node(s):** `Aturan Antislop & Ponytail`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 175 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `cn` to `Inertia React UI & Layout Components`, `Frontend Dependencies & Manifest`, `lucide-react`, `PengaturanSistem.jsx`, `CatatanKehadiran.jsx`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **What connects `Aturan Antislop & Ponytail` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Dependencies & Manifest` be split into smaller, more focused modules?**
  _Cohesion score 0.07301587301587302 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `Inertia React UI & Layout Components`, `Frontend Dependencies & Manifest`, `PengaturanSistem.jsx`, `CatatanKehadiran.jsx`, `cn`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `Backend Composer Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Should `HCGA HRIS Enterprise Design System (DESIGN.md)` be split into smaller, more focused modules?**
  _Cohesion score 0.05547652916073969 - nodes in this community are weakly interconnected._
- **Should `Inertia React UI & Layout Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06554621848739496 - nodes in this community are weakly interconnected._