# ADR-0023: Node.js 24 and pnpm 11, enforced with engines

- **Status:** Accepted
- **Date:** 2026-11-02

## Context

GitHub Actions deprecated the Node.js 20 runtime for actions, and the workflows used action versions that still targeted it (`checkout@v4`, `setup-node@v4`, `upload-artifact@v4`, `pnpm/action-setup@v4`). The projects themselves also ran on Node.js 20. pnpm 11 requires Node.js 22 or later and replaces the build-script settings used in ADR-0019.

## Decision

- **Node.js 24** for development and CI: `.nvmrc` contains `24`.
- **pnpm 11.10.0**: `packageManager: pnpm@11.10.0` in the root `package.json`.
- **Enforced on install:** the root `package.json` declares `engines` (`node >=24`, `pnpm >=11.10.0`) and `pnpm-workspace.yaml` sets `engineStrict: true`, so `pnpm install` fails instead of warning when either is older.
- **Build scripts:** pnpm 11 removed `onlyBuiltDependencies`; `pnpm-workspace.yaml` uses `allowBuilds` (`electron`, `esbuild`, `sharp`: `true`). pnpm 11 fails the install when a dependency with install scripts isn't listed, so new ones must be added as `true` or `false`.
- **Workflows:**
  - `pnpm/setup@v3` (successor of `pnpm/action-setup` for pnpm 11) installs pnpm from `packageManager` and Node.js from `.nvmrc` (passed explicitly as `node-version-file`, so a job never falls back to the runner's own Node.js, which is 22 on `macos-15`), and caches the pnpm store; dependencies are still installed with `pnpm install --frozen-lockfile`.
  - Actions on the Node.js 24 runtime: `actions/checkout@v7`, `actions/upload-artifact@v7`, `actions/download-artifact@v8`, `actions/upload-pages-artifact@v5`, `actions/deploy-pages@v5`.
  - `ci.yml` is renamed `lint-typecheck-build.yml` ("Lint, type check and build"), which describes what it does, and runs only on pull requests (not again on pushes to `main`).

## Consequences

- One place for each version: `.nvmrc` (Node.js) and `packageManager` (pnpm); CI and local installs read the same values.
- Contributors on Node.js 20 or 22 get a clear error on `pnpm install`.
- If the branch protection rule requires the old check name (`checks` job of *CI*), it has to be updated to the renamed workflow.
