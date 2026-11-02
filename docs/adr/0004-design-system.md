# ADR-0004: Figma-first design in a Boutique Minimalist style

- **Status:** Accepted
- **Date:** 2026-10-31

## Context

Before writing code, a modern and intuitive design had to be approved. Several color and typeface variants were explored.

## Decision

- The design is defined and approved in Figma first; code implements it (and Figma is updated when the UI changes in a meaningful way).
- **Boutique Minimalist** style: warm light surfaces, generous whitespace, hairline borders, soft shadows.
- **Plum `#5B3F73`** accent (red was rejected).
- Typography: **Josefin Sans Light** (sans-serif, bundled via `@fontsource`) for titles; **SF Pro** (system) for the UI.
- UI icons: **react-icons / Phosphor** (`react-icons/pi`), regular weight.
- Details live in `docs/DESIGN.md`; product context in `docs/PRODUCT.md`.

## Consequences

- The UI has a consistent identity; any new screen must follow `docs/DESIGN.md`.
- CV templates do **not** inherit this style: each one reproduces its mockup (ADR-0014).
