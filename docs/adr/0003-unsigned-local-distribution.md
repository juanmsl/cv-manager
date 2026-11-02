# ADR-0003: Local distribution with ad-hoc signing

- **Status:** Accepted
- **Date:** 2026-10-31

## Context

The app is for personal use and there is no Apple Developer account. An unsigned `.app`, or one with a broken signature, is reported as damaged or malicious.

## Decision

- `electron-builder` produces a macOS `.dmg` (`pnpm dist`) with `mac.identity: null`.
- An `afterPack` hook (`scripts/adhoc-sign.cjs`) signs the `.app` ad-hoc before the dmg is created.
- No notarization.

## Consequences

- It runs on the Mac where it is built, and on other Macs after allowing it in Privacy & Security.
- If the app is ever distributed publicly, this ADR is superseded by one with Apple signing and notarization.
