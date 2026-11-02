# ADR-0022: Website hosted on GitHub Pages with a custom domain

- **Status:** Accepted
- **Date:** 2026-11-02

## Context

The website (ADR-0018) is fully static: one `index.html` plus assets. It needs free hosting with HTTPS, ideally next to the code and the releases it links to. Donations, when they arrive, are planned as links to an external service, which a static host can serve.

## Decision

- The site is published on **GitHub Pages** at **https://cv-manager.juanmsl.com**.
- `.github/workflows/deploy-website.yml` builds `apps/website` with pnpm and Turborepo and deploys `apps/website/dist` with the official Pages actions (`upload-pages-artifact`, `deploy-pages`). It runs on pushes to `main` that change the website, the lockfile or the workflow, and by hand.
- `site` in `astro.config.mjs` is the custom domain, so the canonical URL is absolute. The site is served from the root, so no `base` path is needed.
- The custom domain is set in the repository's Pages settings. A `CNAME` file is not needed: Pages ignores it when deploying from a workflow.
- DNS: a `CNAME` record `cv-manager` → `juanmsl.github.io` in the `juanmsl.com` zone.

## Consequences

- No extra account or service: code, releases and website live in the same repository.
- No server-side code. If donations ever need it (for example, creating payment sessions or receiving webhooks), move to a host with serverless functions; the site itself doesn't depend on anything specific to Pages.
- No preview deployments for pull requests; CI still builds the site on every pull request (ADR-0016).
