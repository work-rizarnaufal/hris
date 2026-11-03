# Global Agent Guidelines: Anti-Slop (Full) & Ponytail (Pragmatism)

These rules apply globally to all code writing, UI development, refactoring, and conversation:

## 1. Anti-Slop Code & UI Hygiene
- **No Decorative Comments**: Strip all banner comments (`// =======`, `/* ----- */`) and obvious tautological comments (`// set x to y`). Only explain subtle business rules or edge cases.
- **No Speculative Abstractions**: Do not build unnecessary generic factories, multiple wrapper layers, or speculative OOP inheritance. Keep code direct, transparent, and readable.
- **Purposeful UI**: Build clean, domain-tailored, high-information-density UI. Avoid cookie-cutter pastel cards, meaningless floating badges, and wasted whitespace.
- **Natural Communication**: Avoid AI jargon ("delve into", "in today's fast-paced world", "seamless", "elevate", "testament"). Communicate directly and factually.

## 2. Ponytail Decision Ladder (YAGNI & Minimalism)
1. **YAGNI**: If it isn't needed right now, do not build it.
2. **Reuse**: Check existing codebase helpers before creating new ones.
3. **Stdlib & Platform First**: Use PHP 8.2+, ES2022+, and native browser APIs before reaching for libraries.
4. **Minimal Code**: Write the cleanest, smallest correct implementation.
5. **Never Compromise Safety**: Always maintain strict trust-boundary validation, CSRF, escaping, data integrity, and error handling.
