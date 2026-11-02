# ADR-0002: pnpm and a controlled Electron install

- **Status:** Accepted
- **Date:** 2026-10-31

## Context

pnpm was requested as the package manager. With pnpm, the Electron binary downloaded by its postinstall ended up incomplete on macOS (missing `path.txt` and `_CodeSignature`), and macOS blocked it as “malware” when running `pnpm dev`.

## Decision

- **pnpm 9** (`packageManager` in `package.json`) with `node-linker=hoisted` (`.npmrc`) so electron-builder can find dependencies.
- `pnpm.onlyBuiltDependencies`: only `electron` and `esbuild` run install scripts.
- `scripts/instalar-electron.mjs` (postinstall and `pnpm reparar:electron`) downloads Electron with `@electron/get`, unzips it with `ditto`, clears quarantine attributes (`xattr -cr`), writes `path.txt` and re-signs it ad-hoc (`codesign --force --deep --sign -`), then verifies the signature.
- `pnpm dev` (`scripts/dev.mjs`) ensures that install, starts Vite and launches Electron.

## Consequences

- `pnpm install` leaves an Electron build that macOS accepts with no manual steps.
- If an Electron update changes the zip layout, that script is the single place to review.
