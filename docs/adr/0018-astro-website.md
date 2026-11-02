# ADR-0018: Promotional website built with Astro

- **Status:** Accepted
- **Date:** 2026-11-02

## Context

The website's job is to present CV Manager, explain what it does and offer the macOS download. In the future it should also accept donations to support the project. The options considered were Vite + React (same stack as the desktop app), Astro and Next.js.

## Decision

- `apps/website` uses **Astro** (5.x), static output (`output: 'static'`).
  - Marketing pages are mostly content: Astro ships plain HTML with little or no JavaScript, which is fast and good for SEO.
  - React components can still be added where interactivity is needed (`@astrojs/react`), so the desktop app's React knowledge carries over.
  - Next.js was discarded as more than a landing page needs.
- Donations (future): start with a hosted option that needs no backend (a Stripe Payment Link, GitHub Sponsors, Ko-fi or Buy Me a Coffee) linked or embedded from the site. If a custom checkout is needed later, Astro can add server endpoints with a deployment adapter (Vercel, Netlify, Cloudflare) without changing framework. That choice gets its own ADR.
- Tooling: `astro check` for type checking and ESLint with `eslint-plugin-astro` and `typescript-eslint`, wired into Turborepo and CI like the desktop app.
- The site follows the app's brand (plum `#5B3F73`, warm stone background); the full design is a later iteration, done design-first like the app (ADR-0004).
- The download links to the latest GitHub release (`https://github.com/juanmsl/cv-manager/releases/latest`).

## Consequences

- The website builds to static files that can be hosted anywhere (GitHub Pages, Vercel, Netlify, Cloudflare Pages); hosting is decided when the site is ready.
- A second framework lives in the repo, isolated in its own app.
