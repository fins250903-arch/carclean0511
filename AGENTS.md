# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **static Astro 6 site** (`output: 'static'`) — a set of Japanese landing pages (LP) for a car interior cleaning business, plus an MDX blog and a Decap CMS admin. There is no long-running backend. Production hosting is Cloudflare Workers (`wrangler.jsonc` + static `dist/`). `workers/github-oauth.js` handles Decap CMS GitHub OAuth. `api/*.js` are kept as a Vercel rollback path only.

### Services / how to run

- **Dev server**: `npm run dev` (Astro dev, defaults to port 4321). Use `npm run dev -- --host 0.0.0.0 --port 4321` when it must be reachable from outside localhost. In dev, `/` returns a 301 redirect to `/regions/osaka/`; browse region pages directly, e.g. `/regions/osaka/`.
- **Build**: `npm run build` (runs image-sync scripts + blog admin index, then `astro build`). Outputs ~900 static pages to `dist/`.
- **Preview built site**: `npm run preview`.
- There is **no lint script**. OAuth Worker unit tests: `npm run test:oauth`. Type/content validation happens as part of `astro build`. `astro check` is not installed (`npx astro check` will try to interactively install `@astrojs/check` and hang — avoid it).

### Non-obvious gotchas

- `npm run dev`/`build` first run `sync:images` (`sync:513` + `sync:kw`). These copy assets from a sibling `../../513images` directory that does **not** exist in the cloud VM; the scripts detect this and **skip gracefully** (`Source not found ... (skip)`). This is expected and not an error.
- `sync:blog-admin-index` regenerates `public/admin/blog-index.json` from `src/content/blog` on every dev/build — expected output like `Generated blog-index.json with N posts`.
- `.env` is git-ignored; copy `.env.example` to `.env`. The only local-relevant var is `PUBLIC_GTM_ID` (Google Tag Manager). Decap CMS OAuth secrets (`GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`) belong in Cloudflare Worker secrets (or `.dev.vars` for `npm run cf:dev`), not in `.env`.
- Node version is pinned to `22` via `.nvmrc`.
- **Cloudflare Workers**: this is a **static** site (`output: 'static'`). Deploy with `wrangler.jsonc` (`assets.directory: ./dist`). Do **not** run `npx astro add cloudflare` / install `@astrojs/cloudflare` — that adapter is for SSR only. Path redirects live in `public/_redirects`. Decap CMS GitHub OAuth runs in `workers/github-oauth.js` on `/api/*`. Beginner deploy steps: `docs/cloudflare-deploy.md`. Local Worker preview: `npm run build` then `npm run cf:dev` (port 8787).
