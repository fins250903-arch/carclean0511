# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **static Astro 6 site** (`output: 'static'`) — a set of Japanese landing pages (LP) for a car interior cleaning business, plus an MDX blog and a Decap CMS admin. There is no long-running backend. Decap CMS GitHub OAuth is served by the Cloudflare Worker in `workers/cms-auth.js` (`/api/auth`, `/api/callback`). `api/*.js` are the previous Vercel functions and are not what production calls.

### Services / how to run

- **Dev server**: `npm run dev` (Astro dev, defaults to port 4321). Use `npm run dev -- --host 0.0.0.0 --port 4321` when it must be reachable from outside localhost. In dev, `/` returns a 301 redirect to `/regions/osaka/`; browse region pages directly, e.g. `/regions/osaka/`.
- Shared multi-repo Cloud Agent (this repo plus INS, express1, and autorepair): boot starts this site on port **4322** (`http://127.0.0.1:4322/regions/osaka/`) so it does not collide with INS on 4321. express1 is `http://127.0.0.1:4323/deadning/` and autorepair is `http://127.0.0.1:4324/aichi/`. `npm run dev` with no port flag still uses 4321 when this repo is run alone. carclean2026blog is archived; dependencies are installed and its dev server is not started.
- **Build**: `npm run build` (runs image-sync scripts + blog admin index, then `astro build`). Outputs ~900 static pages to `dist/`.
- **Preview built site**: `npm run preview`.
- There is **no lint or test script** defined in `package.json`. Type/content validation happens as part of `astro build`. `astro check` is not installed (`npx astro check` will try to interactively install `@astrojs/check` and hang — avoid it).

### Non-obvious gotchas

- `npm run dev`/`build` first run `sync:images` (`sync:513` + `sync:kw`). These copy assets from a sibling `../../513images` directory that does **not** exist in the cloud VM; the scripts detect this and **skip gracefully** (`Source not found ... (skip)`). This is expected and not an error.
- `sync:blog-admin-index` regenerates `public/admin/blog-index.json` from `src/content/blog` on every dev/build — expected output like `Generated blog-index.json with N posts`.
- `.env` is git-ignored; copy `.env.example` to `.env`. The only local-relevant var is `PUBLIC_GTM_ID` (Google Tag Manager). `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET` are production Cloudflare Worker secrets, not local dev vars.
- Node version is pinned to `22` via `.nvmrc`.
- **Cloudflare Workers**: this is a **static** site plus a tiny OAuth Worker. Deploy with `wrangler.jsonc` (`assets.directory: ./dist`, `main: ./workers/cms-auth.js`). Do **not** run `npx astro add cloudflare` / install `@astrojs/cloudflare` — that adapter is for SSR only. Path redirects live in `public/_redirects` (copied to `dist/` at build). The Worker handles only `/api/*` (`run_worker_first`). Blog login secrets `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` go in the dashboard under **Workers & Pages → carclean0511 → Settings → ランタイム変数とシークレット** (Secret type, then **Deploy** on that section). The other Settings block labeled 「変数とシークレット」 does not reach the login.
