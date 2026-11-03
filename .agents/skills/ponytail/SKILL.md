---
name: ponytail
description: >-
  Companion rule that enforces extreme pragmatism ("laziest senior developer in the room").
  Follows the YAGNI decision ladder: never write code that isn't strictly necessary, reuse
  existing utilities, and produce the smallest correct patch without compromising safety.
---

# Ponytail (Companion Pragmatism Skill)

> *"The best code is the code you never wrote."*

Ponytail acts as a companion to Anti-Slop, keeping patches compact, readable, and free of speculative engineering. It emulates the experienced senior developer who values simplicity, maintainability, and zero bloat over clever complexity.

---

## The Decision Ladder

Before writing any new function, file, or abstraction, climb down this ladder in order and stop at the highest rung that solves the requirement:

1. **YAGNI (You Aren't Gonna Need It)**:
   - Does this code, configuration, or feature need to exist right now to solve the stated task?
   - If no: **Do not write it.** Defer it until it is actually requested.

2. **Codebase Reuse**:
   - Does a similar function, helper, or component already exist in this repository?
   - If yes: **Reuse or extend it.** Do not duplicate or reimplement it under a new name.

3. **Standard Library**:
   - Can PHP 8.2+ or ECMAScript / modern browser APIs do this natively (e.g., `array_map`, `Intl.DateTimeFormat`, `crypto.randomUUID()`, native FormData)?
   - If yes: **Use the standard library.**

4. **Native Platform Features**:
   - Can HTML5 or CSS handle the behavior (e.g., `<dialog>`, `<input type="date">`, `accent-color`, Flexbox/Grid)?
   - If yes: **Let the platform do the work.**

5. **Already-Installed Dependencies**:
   - Is there a package already listed in `composer.json` or `package.json` that provides this?
   - If yes: **Use the installed tool.** Do not add another npm or packagist dependency.

6. **Single Expression**:
   - Can the logic be written cleanly in a single expression or return statement?
   - If yes: **Keep it as a single line.** Avoid unnecessary temporary variables or nested branches.

7. **Minimum Viable Implementation**:
   - Only when steps 1–6 are exhausted, write the absolute minimum amount of code required to solve the problem cleanly.

---

## Non-Negotiable Boundaries (Never Cut Corners Here)

Minimalism never means sloppy or insecure. The following are **always preserved**:
- Input validation and schema assertions at boundary edges.
- Security constraints (authorization checks, CSRF, escaping, parameterization).
- Error handling that provides clear feedback when failures occur.
- Data integrity, transactions, and race-condition protections.

---

## Output Standard

When completing a task, briefly highlight:
- What was kept lean or omitted according to YAGNI.
- Any critical edge cases explicitly safeguarded.
