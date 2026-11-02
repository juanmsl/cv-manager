# ADR-0019: pnpm 10 with settings in pnpm-workspace.yaml

- **Status:** Accepted
- **Date:** 2026-11-02

## Context

The workspace settings were split between `.npmrc` (`node-linker=hoisted`) and the root `package.json` (`pnpm.onlyBuiltDependencies`). Moving them to `pnpm-workspace.yaml` keeps all pnpm configuration in one place, but pnpm 9 ignores settings in that file: with pnpm 9.15 the workspace silently fell back to the default isolated linker, which breaks electron-builder (ADR-0017).

## Decision

- Upgrade to **pnpm 10** (`packageManager: pnpm@10.34.9` in the root `package.json`).
- All pnpm settings live in `pnpm-workspace.yaml`:
  - `packages: [apps/*]`
  - `nodeLinker: hoisted` (flat `node_modules` for electron-builder)
  - `onlyBuiltDependencies: [electron, esbuild, sharp]` (pnpm 10 blocks install scripts of any other dependency)
- `.npmrc` and the `pnpm` field in `package.json` are removed.
- This updates the tooling details of ADR-0002 (pnpm 9, `.npmrc`, `package.json` field) and ADR-0017; their other decisions still apply.

## Consequences

- One file for workspace configuration.
- Everyone needs pnpm 10: `corepack enable` picks the pinned version, and CI reads it from `packageManager`.
- A new dependency that needs an install script must be added to `onlyBuiltDependencies`.
