# CV Manager

Monorepo for **CV Manager**, a macOS app that builds a designed CV from templates and exports it as a
single-page PDF, and the website that promotes it and lets people download it.

Managed with [Turborepo](https://turbo.build) and [pnpm workspaces](https://pnpm.io/workspaces).

## Apps

| App | Path | Stack | Description |
| --- | --- | --- | --- |
| Desktop | [`apps/desktop`](apps/desktop) | Electron, React, Vite, TypeScript | The macOS app. See its [README](apps/desktop/README.md). |
| Website | [`apps/website`](apps/website) | Astro | Promotional site with the download link. See its [README](apps/website/README.md). |

## Requirements

- Node.js 20 or later
- pnpm (`corepack enable` activates the version pinned in `package.json`)
- macOS to run or package the desktop app

## Getting started

```bash
pnpm install         # installs every app
pnpm dev:desktop     # desktop app in development mode
pnpm dev:website     # website at http://localhost:4321
```

## Scripts (run from the root)

| Script | What it does |
| --- | --- |
| `pnpm dev` | Runs every app in development mode |
| `pnpm dev:desktop` / `pnpm dev:website` | Runs one app |
| `pnpm build` | Builds every app (`apps/*/dist`) |
| `pnpm lint` | ESLint in every app |
| `pnpm typecheck` | TypeScript (`tsc`, `astro check`) in every app |
| `pnpm dist:desktop` | Builds the macOS `.dmg` (`apps/desktop/release/`) |

Any app script can also be run with `pnpm --filter <package> <script>`, e.g.
`pnpm --filter @cv-manager/desktop reparar:electron`.

## Continuous integration

`.github/workflows/ci.yml` runs on every pull request and on pushes to `main`: it installs dependencies
with pnpm (skipping the Electron binary) and runs lint, type check and build for every app through
Turborepo. All must pass before merging.

## Releasing the desktop app

Two workflows publish a new version (ADR-0021):

1. **Actions → Prepare release → Run workflow** (on `main`) and choose `patch`, `minor` or `major`.
   It bumps `apps/desktop/package.json`, adds the changes since the last release to `CHANGELOG.md`
   and opens the pull request `release: vX.Y.Z`.
2. Review the pull request (you can edit the changelog there) and merge it. `release.yml` then
   builds the `.dmg` on an Apple Silicon runner, tags the merge commit `vX.Y.Z` and publishes the
   GitHub release with the installer and the changelog.

Running **Release** by hand only builds the `.dmg` and attaches it to the run, without publishing.

The first time, enable **Settings → Actions → General → Workflow permissions → Allow GitHub Actions
to create and approve pull requests**. CI doesn't run on pull requests opened by the default
token; to have it run on the release pull request, add a `RELEASE_TOKEN` secret (fine-grained
personal access token for this repository with *Contents* and *Pull requests*: read and write).

## Repository layout

```
apps/
  desktop/     Electron app (src, electron, scripts, build icons, cv-templates mockups, docs)
  website/     Astro website
docs/
  adr/         Architecture Decision Records (project-wide)
.github/       CI workflow
turbo.json     Turborepo tasks
```

Decisions that shape the project are recorded in [`docs/adr/`](docs/adr/README.md). Read them before
changing something they cover; a new decision goes in a new ADR. Repository documentation is written
in English; the desktop app UI is localized.
