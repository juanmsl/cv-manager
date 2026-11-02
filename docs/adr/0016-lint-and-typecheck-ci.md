# ADR-0016: Lint and type checks in CI

- **Status:** Accepted
- **Date:** 2026-11-02

## Context

The project only had `tsc` as a local check, run by hand. With pull requests on GitHub, every change should be checked automatically and consistently before it reaches `main`.

## Decision

- **ESLint 9** with flat config (`eslint.config.mjs`):
  - `src/**/*.{ts,tsx}`: `@eslint/js` recommended, `typescript-eslint` recommended and `eslint-plugin-react-hooks` recommended (browser globals). Unused variables are errors unless prefixed with `_`.
  - `electron/**/*.cjs`, `scripts/**`: `@eslint/js` recommended with Node globals (CommonJS or ESM as appropriate).
  - `eslint-plugin-react-refresh` is not used: context providers intentionally export hooks and helpers next to components.
- `pnpm lint` runs `eslint . --max-warnings 0`: warnings fail too.
- `pnpm typecheck` runs `tsc --noEmit` (strict mode, no unused locals/parameters).
- **GitHub Actions** (`.github/workflows/lint-typecheck-build.yml`, originally `ci.yml`) runs on every pull request (only; not again after merging into `main`), on `ubuntu-latest` with the Node.js version from `.nvmrc` and the pnpm version from `packageManager` (see ADR-0023):
  - `pnpm install --frozen-lockfile` with `ELECTRON_SKIP_BINARY_DOWNLOAD=1` (the Electron binary isn't needed for these checks; `scripts/instalar-electron.mjs` only runs on macOS).
  - `pnpm lint` and `pnpm typecheck`; the type check runs even if lint fails, so both results are visible.
- Both checks must pass before merging.

## Consequences

- Style and type errors are caught on every PR without depending on anyone's machine.
- The lockfile must be committed and up to date (`--frozen-lockfile`).
- Building the macOS app (`pnpm dist`) is not part of CI; it stays a local step (ADR-0003).
