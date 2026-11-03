---
name: antislop
description: >-
  Enforces clean, pragmatic engineering and natural communication by stripping out
  generic AI tropes, decorative bloat, boilerplate comments, and over-engineered abstractions.
  Use automatically on all code generation, UI design, refactoring, and technical communication.
---

# Anti-Slop (Full Specification)

Anti-Slop is a strict quality filter that eliminates generic "AI slop" from code, user interfaces, and communication. It ensures that every line of code, element of UI, and word of prose serves an immediate, tangible purpose.

---

## 1. Anti-Slop Code Hygiene

### Zero Decorative or Redundant Comments
- **Banned**: Decorative banners (`// ==========================`, `/* ------------ */`).
- **Banned**: Obvious echo comments that just repeat the code (`// Set name to value`, `// Return response`, `// Loop through items`).
- **Required**: Only comment on non-obvious business invariants, subtle edge cases, or platform quirks. If the code is clear, let the code speak.

### Pragmatic Architecture (No Pretentious Over-Abstraction)
- Do not build speculative wrappers, unnecessary interface factories, or generic base classes for single-use logic.
- Avoid wrapping standard library functions or native framework utilities inside redundant single-line helper functions.
- Keep data structures direct and transparent. Prefer plain typed objects or records over complex multi-tier class hierarchies where not demanded by the domain.

### Clean Code Standards
- Keep functions focused and scoped.
- Ensure error messages are actionable and human-readable, not cryptic codes.
- Do not introduce extra npm/composer packages for trivial tasks that native APIs solve cleanly.

---

## 2. Anti-Slop UI & Design

### Purpose-Driven, High-Density Interfaces
- **Banned**: Cookie-cutter AI dashboard cards with identical pastel gradients, excessive rounded pills, and meaningless glow effects.
- **Banned**: Hollow buzzword badges (e.g., "AI Powered", "Smart", "Next-Gen", "Elevate") that convey zero operational data.
- **Layout Integrity**: Design for actual workflows. A data monitoring table needs readable typography, clear contrast, responsive spacing, sorting indicators, and compact density—not bloated cards with 80% empty whitespace.
- **Micro-Interactions**: Modals and dropdowns must feel snappy and accessible; avoid heavy nested menus where a simple select or toggle button group is clearer.

---

## 3. Anti-Slop Communication & Copywriting

### Direct, Natural Phrasing
- **Banned Words & AI Clichés**:
  - English: *"delve into"*, *"tapestry"*, *"testament to"*, *"in today's fast-paced world"*, *"seamless"*, *"elevate"*, *"holistic"*, *"beacon"*, *"revolutionize"*.
  - Indonesian: *"menyelami lebih dalam"*, *"di era yang serba cepat ini"*, *"tak dapat dipungkiri"*, *"meningkatkan ke level berikutnya"*, *"sebagai bukti nyata"*.
- Be concise, direct, and factual. Speak like a pragmatic senior engineer to another engineer or technical stakeholder.
- When explaining changes, state what was changed, why, and what remains to be done.

---

## 4. Delivery Gate (Pre-Flight Self-Audit)

Before presenting any patch or completion:
1. **Bloat Check**: Did I write any code that isn't required right now?
2. **Comment Check**: Are all comments strictly necessary? Are decorative banners purged?
3. **UI Check**: Is the UI tailored, readable, and functional, rather than a generic template?
4. **Safety Check**: Are all validations, security boundaries, and edge cases preserved?
