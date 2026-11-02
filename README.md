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

- Node.js 24 or later (`.nvmrc` pins 24: `nvm use` or `fnm use`)
- pnpm 11.10 or later (`corepack enable` activates the version pinned in `package.json`)

Both are checked on install: `engines` in `package.json` with `engineStrict` in
`pnpm-workspace.yaml`, so `pnpm install` fails with an older Node.js or pnpm.
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

`.github/workflows/lint-typecheck-build.yml` runs on every pull request (not on pushes to `main`, which only receives merged pull requests): it installs dependencies
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

## Website deployment

The website is published at **https://cv-manager.juanmsl.com** with GitHub Pages (ADR-0022).
`.github/workflows/deploy-website.yml` builds and deploys it on every push to `main` that changes
`apps/website`, and can also be run by hand from the Actions tab.

One-time setup:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. DNS of `juanmsl.com`: a `CNAME` record `cv-manager` pointing to `juanmsl.github.io`.
3. **Settings → Pages → Custom domain:** `cv-manager.juanmsl.com`, then enable **Enforce HTTPS**
   once the certificate is issued.

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
