# ADR-0015: Repository layout and conventions

- **Status:** Superseded by ADR-0017
- **Date:** 2026-11-02

## Context

The repository should be tidy, with no working files at the root, standard for any developer, and ready for GitHub (`git@github.com:juanmsl/cv-manager.git`, branch `main`).

## Decision

- `src/` app code; `electron/` main process and preload; `scripts/` install and signing.
- `docs/` documentation: `PRODUCT.md`, `DESIGN.md` and `adr/`. (`docs/` is where design tooling such as Impeccable looks for PRODUCT.md and DESIGN.md.)
- `cv-templates/` reference mockups for the templates.
- `build/` packaging resources (source `.svg`, `.png` and `.icns` icons).
- `.impeccable/` design-tool configuration.
- `.gitignore` excludes dependencies, builds (`dist/`, `release/`), `Claude outputs/`, OS and editor files.
- **Repository documentation (README, `docs/`, ADRs) is written in English.** The app UI stays localized (ADR-0010).
- Commits are reviewed before they are made; the owner pushes from their own machine.

## Consequences

- The root holds only project configuration and the README.
