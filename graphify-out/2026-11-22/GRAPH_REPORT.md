# Graph Report - hris  (2026-11-22)

## Corpus Check
- 130 files · ~94,848 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 8, .example 1, .xml 1)

## Summary
- 637 nodes · 1406 edges · 54 communities (16 shown, 38 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c2468bd1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- @inertiajs/react
- Frontend Dependencies & Manifest
- Backend Composer Dependencies
- HCGA HRIS Enterprise Design System (DESIGN.md)
- Inertia\Response
- Illuminate\Database\Eloquent\Factories\HasFactory
- Employee
- Illuminate\Database\Schema\Blueprint
- Module Group 8 (Illuminate\Foundation\Exceptions\Renderer\Renderer)
- Laravel Application Bootstrap
- Frontend Build & Compiler Config
- Project Documentation & Agent Standards
- cn
- Anti-Slop (Full Specification)
- Ponytail (Companion Pragmatism Skill)
- PengaturanSistem.jsx
- App\Models\Employee
- Illuminate\Database\Seeder
- KehadiranController.php
- Illuminate\Http\RedirectResponse
- sidebar.jsx
- Location
- HandleInertiaRequests.php
- Illuminate\Http\Request
- User
- App\Models\Shift
- SystemSetting

## God Nodes (most connected - your core abstractions)
1. `react` - 41 edges
2. `cn()` - 37 edges
3. `lucide-react` - 32 edges
4. `@inertiajs/react` - 21 edges
5. `Employee` - 18 edges
6. `Card()` - 18 edges
7. `CardContent()` - 18 edges
8. `CardDescription()` - 18 edges
9. `CardHeader()` - 18 edges
10. `CardTitle()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `AuthController` --inherits--> `Controller`  [EXTRACTED]
  app/Http/Controllers/Auth/AuthController.php → app/Http/Controllers/Controller.php
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

## Communities (54 total, 38 thin omitted)

### Community 0 - "@inertiajs/react"
Cohesion: 0.34
Nodes (17): Badge(), badgeVariants, Card(), CardContent(), CardDescription(), CardHeader(), CardTitle(), PageHeader() (+9 more)

### Community 1 - "Frontend Dependencies & Manifest"
Cohesion: 0.08
Nodes (32): dependencies, clsx@^2.1.1, @inertiajs/react@^2.0.0, lucide-react@^0.475.0, react@^18.3.1, react-dom@^18.3.1, recharts@^2.15.0, tailwind-merge@^2.5.5 (+24 more)

### Community 2 - "Backend Composer Dependencies"
Cohesion: 0.05
Nodes (41): block, pestphp/pest-plugin, php-http/discovery, autoload, autoload-dev, psr-4, psr-4, config (+33 more)

### Community 3 - "HCGA HRIS Enterprise Design System (DESIGN.md)"
Cohesion: 0.06
Nodes (33): 1. Overview, 2. Colors, 3. Typography, 4. Layout, 5. Elevation & Depth, 6. Shapes & Form Controls, 7. Atomic UI Component Catalog, 8. Do's and Don'ts (+25 more)

### Community 4 - "Inertia\Response"
Cohesion: 0.19
Nodes (3): BerandaController, PengaturanController, Controller

### Community 5 - "Illuminate\Database\Eloquent\Factories\HasFactory"
Cohesion: 0.17
Nodes (4): Attendance, Holiday, ShiftSchedule, ShiftSwap

### Community 7 - "Illuminate\Database\Schema\Blueprint"
Cohesion: 0.08
Nodes (11): {closure#1}(), {closure#1}(), {closure#1}(), {closure#1}(), {closure#1}(), {closure#1}(), {closure#1}(), {closure#1}() (+3 more)

### Community 8 - "Module Group 8 (Illuminate\Foundation\Exceptions\Renderer\Renderer)"
Cohesion: 0.44
Nodes (7): d(), f(), g(), n(), p(), u(), v()

### Community 10 - "Frontend Build & Compiler Config"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 13 - "cn"
Cohesion: 0.10
Nodes (31): class-variance-authority@^0.7.1, class-variance-authority, Button(), buttonVariants, CardFooter(), Input(), Modal(), ModalBody() (+23 more)

### Community 39 - "Anti-Slop (Full Specification)"
Cohesion: 0.18
Nodes (10): 1. Anti-Slop Code Hygiene, 2. Anti-Slop UI & Design, 3. Anti-Slop Communication & Copywriting, 4. Delivery Gate (Pre-Flight Self-Audit), Anti-Slop (Full Specification), Clean Code Standards, Direct, Natural Phrasing, Pragmatic Architecture (No Pretentious Over-Abstraction) (+2 more)

### Community 40 - "Ponytail (Companion Pragmatism Skill)"
Cohesion: 0.40
Nodes (4): Non-Negotiable Boundaries (Never Cut Corners Here), Output Standard, Ponytail (Companion Pragmatism Skill), The Decision Ladder

### Community 41 - "PengaturanSistem.jsx"
Cohesion: 0.07
Nodes (57): lucide-react, react, recharts, xlsx, masterRecentAttendance, weeklyTrendData, JadwalShift(), WEEKS (+49 more)

### Community 43 - "Illuminate\Database\Seeder"
Cohesion: 0.15
Nodes (5): AttendanceSeeder, DatabaseSeeder, EmployeeSeeder, HolidaySeeder, LocationSeeder

### Community 47 - "sidebar.jsx"
Cohesion: 0.09
Nodes (18): @inertiajs/react, renderAdminLayout(), renderUserLayout(), IMPLEMENTED_ROUTES, Sidebar(), Topbar(), getPageMetadata(), navigationConfig (+10 more)

### Community 48 - "Location"
Cohesion: 0.12
Nodes (3): FingerprintAndManualAttendanceTest, KaryawanBackendTest, TestCase

## Knowledge Gaps
- **1 isolated node(s):** `Aturan Antislop & Ponytail`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 234 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **38 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `PengaturanSistem.jsx` to `@inertiajs/react`, `Frontend Dependencies & Manifest`, `cn`, `sidebar.jsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `Aturan Antislop & Ponytail` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Dependencies & Manifest` be split into smaller, more focused modules?**
  _Cohesion score 0.07563025210084033 - nodes in this community are weakly interconnected._
- **Why does `HCGA HRIS Enterprise Design System (DESIGN.md)` connect `HCGA HRIS Enterprise Design System (DESIGN.md)` to `sidebar.jsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `Backend Composer Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `PengaturanSistem.jsx` to `@inertiajs/react`, `Frontend Dependencies & Manifest`, `cn`, `sidebar.jsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Should `HCGA HRIS Enterprise Design System (DESIGN.md)` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._