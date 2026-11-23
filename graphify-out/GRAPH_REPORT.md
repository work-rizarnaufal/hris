# Graph Report - hris  (2026-11-23)

## Corpus Check
- 159 files · ~101,926 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 8, .example 1, .xml 1)

## Summary
- 743 nodes · 1775 edges · 53 communities (21 shown, 32 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1924eacf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- @inertiajs/react
- package.json
- Backend Composer Dependencies
- HCGA HRIS Enterprise Design System (DESIGN.md)
- Illuminate\Http\Request
- Illuminate\Database\Eloquent\Factories\HasFactory
- Employee
- Illuminate\Database\Schema\Blueprint
- Module Group 8 (Illuminate\Foundation\Exceptions\Renderer\Renderer)
- App\Http\Middleware\HandleInertiaRequests
- Frontend Build & Compiler Config
- Project Documentation & Agent Standards
- cn
- Anti-Slop (Full Specification)
- Ponytail (Companion Pragmatism Skill)
- PengaturanSistem.jsx
- App\Models\Employee
- Illuminate\Database\Seeder
- App\Models\Employee
- sidebar.jsx
- LaporanBackendTest.php
- Inertia\Response
- AuthTest
- LaporanController.php
- PengaturanSistem.jsx
- User

## God Nodes (most connected - your core abstractions)
1. `react` - 62 edges
2. `lucide-react` - 53 edges
3. `cn()` - 37 edges
4. `@inertiajs/react` - 21 edges
5. `PengaturanSistem()` - 19 edges
6. `Card()` - 18 edges
7. `CardContent()` - 18 edges
8. `CardDescription()` - 18 edges
9. `CardHeader()` - 18 edges
10. `CardTitle()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `AuthTest` --inherits--> `TestCase`  [EXTRACTED]
  tests/Feature/AuthTest.php → tests/TestCase.php
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

## Communities (53 total, 32 thin omitted)

### Community 0 - "@inertiajs/react"
Cohesion: 0.39
Nodes (16): @inertiajs/react, Card(), CardContent(), CardDescription(), CardHeader(), CardTitle(), PageHeader(), LogAudit() (+8 more)

### Community 1 - "package.json"
Cohesion: 0.08
Nodes (32): dependencies, clsx@^2.1.1, @inertiajs/react@^2.0.0, lucide-react@^0.475.0, react@^18.3.1, react-dom@^18.3.1, recharts@^2.15.0, tailwind-merge@^2.5.5 (+24 more)

### Community 2 - "Backend Composer Dependencies"
Cohesion: 0.05
Nodes (41): block, pestphp/pest-plugin, php-http/discovery, autoload, autoload-dev, psr-4, psr-4, config (+33 more)

### Community 3 - "HCGA HRIS Enterprise Design System (DESIGN.md)"
Cohesion: 0.06
Nodes (33): 1. Overview, 2. Colors, 3. Typography, 4. Layout, 5. Elevation & Depth, 6. Shapes & Form Controls, 7. Atomic UI Component Catalog, 8. Do's and Don'ts (+25 more)

### Community 4 - "Illuminate\Http\Request"
Cohesion: 0.15
Nodes (4): JadwalController, KehadiranController, AuthController, FingerprintImportService

### Community 5 - "Illuminate\Database\Eloquent\Factories\HasFactory"
Cohesion: 0.18
Nodes (4): Holiday, Location, Shift, SystemSetting

### Community 6 - "Employee"
Cohesion: 0.07
Nodes (4): Attendance, Employee, ShiftSchedule, ShiftSwap

### Community 7 - "Illuminate\Database\Schema\Blueprint"
Cohesion: 0.07
Nodes (13): {closure#1}(), {closure#1}(), {closure#1}(), {closure#1}(), {closure#1}(), {closure#1}(), {closure#1}(), {closure#1}() (+5 more)

### Community 8 - "Module Group 8 (Illuminate\Foundation\Exceptions\Renderer\Renderer)"
Cohesion: 0.44
Nodes (7): d(), f(), g(), n(), p(), u(), v()

### Community 9 - "App\Http\Middleware\HandleInertiaRequests"
Cohesion: 0.19
Nodes (3): HandleInertiaRequests, {closure#1}(), {closure#2}()

### Community 10 - "Frontend Build & Compiler Config"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, jsx, paths, include

### Community 13 - "cn"
Cohesion: 0.10
Nodes (33): class-variance-authority@^0.7.1, class-variance-authority, Badge(), badgeVariants, Button(), buttonVariants, CardFooter(), Input() (+25 more)

### Community 39 - "Anti-Slop (Full Specification)"
Cohesion: 0.18
Nodes (10): 1. Anti-Slop Code Hygiene, 2. Anti-Slop UI & Design, 3. Anti-Slop Communication & Copywriting, 4. Delivery Gate (Pre-Flight Self-Audit), Anti-Slop (Full Specification), Clean Code Standards, Direct, Natural Phrasing, Pragmatic Architecture (No Pretentious Over-Abstraction) (+2 more)

### Community 40 - "Ponytail (Companion Pragmatism Skill)"
Cohesion: 0.40
Nodes (4): Non-Negotiable Boundaries (Never Cut Corners Here), Output Standard, Ponytail (Companion Pragmatism Skill), The Decision Ladder

### Community 41 - "PengaturanSistem.jsx"
Cohesion: 0.10
Nodes (26): lucide-react, react, recharts, xlsx, DIVISIONS, GROUPS, CatatanKehadiran(), DEFAULT_DATE (+18 more)

### Community 43 - "Illuminate\Database\Seeder"
Cohesion: 0.12
Nodes (7): AttendanceSeeder, DatabaseSeeder, EmployeeSeeder, HolidaySeeder, LocationSeeder, ShiftSeeder, SystemSettingSeeder

### Community 45 - "App\Models\Employee"
Cohesion: 0.20
Nodes (4): {closure#1}(), {closure#2}(), {closure#1}(), {closure#5}()

### Community 47 - "sidebar.jsx"
Cohesion: 0.09
Nodes (17): renderAdminLayout(), renderUserLayout(), IMPLEMENTED_ROUTES, Sidebar(), Topbar(), getPageMetadata(), navigationConfig, siteConfig (+9 more)

### Community 48 - "LaporanBackendTest.php"
Cohesion: 0.07
Nodes (7): BerandaBackendTest, FingerprintAndManualAttendanceTest, {closure#1}(), JadwalBackendTest, KaryawanBackendTest, LaporanBackendTest, TestCase

### Community 49 - "Inertia\Response"
Cohesion: 0.14
Nodes (3): BerandaController, PengaturanController, Controller

### Community 52 - "PengaturanSistem.jsx"
Cohesion: 0.08
Nodes (50): JadwalShift(), JadwalExceptionsTab(), JadwalKpiCards(), JadwalRosterTab(), getDynamicShift12HOptions(), ModalFormTukarShift(), PanelJadwalManual(), PanelRotasiGrup() (+42 more)

## Knowledge Gaps
- **1 isolated node(s):** `Aturan Antislop & Ponytail`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 268 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `PengaturanSistem.jsx` to `@inertiajs/react`, `package.json`, `cn`, `sidebar.jsx`, `PengaturanSistem.jsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `Aturan Antislop & Ponytail` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07563025210084033 - nodes in this community are weakly interconnected._
- **Why does `HCGA HRIS Enterprise Design System (DESIGN.md)` connect `HCGA HRIS Enterprise Design System (DESIGN.md)` to `sidebar.jsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `Backend Composer Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `PengaturanSistem.jsx` to `@inertiajs/react`, `package.json`, `cn`, `sidebar.jsx`, `PengaturanSistem.jsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `HCGA HRIS Enterprise Design System (DESIGN.md)` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._