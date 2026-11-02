# CV Manager — website

`apps/website` in the monorepo. The public site that presents CV Manager and links to the macOS
download. Built with [Astro](https://astro.build) as a static site (see ADR-0018).

Status: placeholder landing page; the real design comes in a later iteration.

## Scripts

From the repository root (`pnpm dev:website`) or from this folder:

| Script | What it does |
| --- | --- |
| `pnpm dev` | Dev server at http://localhost:4321 |
| `pnpm build` | Static build in `dist/` |
| `pnpm preview` | Serves the build locally |
| `pnpm typecheck` | `astro check` |
| `pnpm lint` | ESLint (`eslint-plugin-astro`, `typescript-eslint`) |

## Structure

- `src/pages/` — routes (`index.astro` is the landing page).
- `src/layouts/` — page layouts.
- `public/` — static files served as-is (the favicon is the app icon).
- `astro.config.mjs` — set `site` to the final domain when it is deployed.

The download button points to the latest GitHub release:
`https://github.com/juanmsl/cv-manager/releases/latest`.
