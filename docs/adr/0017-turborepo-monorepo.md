# ADR-0017: Turborepo monorepo with desktop and website apps

- **Status:** Accepted
- **Date:** 2026-11-02

## Context

Besides the desktop app, the project needs a public website to promote the app and let people download it. Keeping both in one repository makes it easy to share decisions, tooling and CI, while each app keeps its own stack.

## Decision

- The repository is a **pnpm workspace** (`pnpm-workspace.yaml`: `apps/*`) orchestrated with **Turborepo** (`turbo.json`).
- Apps:
  - `apps/desktop` — package `@cv-manager/desktop`: everything that used to be at the root (src, electron, scripts, build icons, `cv-templates/` mockups, `index.html`, Vite, TypeScript and ESLint config). Its `docs/DESIGN.md`, `docs/PRODUCT.md` and `.impeccable/` move with it, because they describe that app.
  - `apps/website` — package `@cv-manager/website` (ADR-0018).
- The root keeps only workspace files: `package.json` (`packageManager`, `pnpm.onlyBuiltDependencies`, Turborepo scripts), `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `turbo.json`, `.npmrc`, `.gitignore`, `.github/`, the README and `docs/adr/` (project-wide decisions).
- Turborepo tasks: `build` (cached, outputs `dist/**`), `lint`, `typecheck`, and `dev` / `dist` (not cached). Root scripts: `dev`, `dev:desktop`, `dev:website`, `build`, `lint`, `typecheck`, `dist:desktop`.
- `node-linker=hoisted` stays for the whole workspace (electron-builder needs a flat `node_modules`). Consequences for the desktop app:
  - `scripts/instalar-electron.mjs` locates Electron with Node resolution instead of `./node_modules`.
  - All desktop dependencies are `devDependencies`: Vite bundles them into `dist/`, so the packaged app ships no `node_modules`.
  - `electron` is pinned to an exact version, because electron-builder reads it from `package.json` when it isn't in the app's own `node_modules`.
- Paths in earlier ADRs (`src/`, `electron/`, `scripts/`, `build/`, `cv-templates/`, `docs/DESIGN.md`, `docs/PRODUCT.md`) are now relative to `apps/desktop`.
- CI (ADR-0016) runs `pnpm turbo run lint typecheck --continue` and `pnpm turbo run build` for every app.
- This ADR supersedes the layout in ADR-0015; its other conventions (English docs, `.gitignore`, review before commit) still apply.

## Consequences

- One install, one lockfile and one CI for both apps; each app can use the stack that suits it.
- Commands change: `pnpm dev:desktop` / `pnpm dist:desktop` from the root, or the usual scripts inside `apps/desktop`.
- Existing local checkouts must reinstall (`rm -rf node_modules && pnpm install`) after the move.
- Upgrading Electron means changing its exact version in `apps/desktop/package.json`.
