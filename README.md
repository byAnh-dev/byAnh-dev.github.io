# Anh Hoang's portfolio

The pixel portfolio is the main website. The previous React site is preserved at `/archive/`, including its project pages and the local edits that existed before this migration.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000/. Journey, writing, and the doodle board are at `/journey/`, `/writing/`, and `/doodle-board/`.

```sh
npm run lint
npm run build
npm start
```

This now uses the Next.js runtime, including prerendered HTML route handlers and permanent redirects. The former `output: 'export'` setting has been removed: deploy with the Next.js preset or `next start`, rather than uploading the old `out/` directory. The existing `out/` folder may contain stale pages from an earlier build.

## Where to edit

- `public/site/index.html`: main homepage.
- `public/site/journey.html`, `writing.html`, `doodle-board.html`, and `writing/*.html`: main-site pages.
- `public/site/*.css`, `*.js`, images, and fonts: main-site styles, interactions, and assets.
- `src/site/routes.json`: clean URLs and compatibility redirects.
- `src/site/serve-page.ts`: serves complete HTML documents, preserving the existing deferred scripts without adding React hydration to their canvas effects.
- `src/app/archive/` and `src/archive/`: previous website routes, styles, components, and project data. Archive pages are marked `noindex` and provide a return link to the current site.
- `public/prototype/`: preserved design study and generation tools. This is a historical reference; edit `public/site/` for current website changes. Running the prototype generators does not overwrite the main site.

Old `/projects/` URLs redirect to archived project pages. `/about/` opens Journey, `/contact/` opens the closing invitation, and `/thoughts/` opens Writing. Existing prototype review URLs remain available.

## Migration checks

With a production server running, verify routes, redirects, local assets, and fragment links:

```sh
npm start -- --port 3100
node scripts/check-site.mjs http://localhost:3100
```

The writing pages still contain explicitly labeled sample articles and remain excluded from indexing. The doodle board is still a coming-soon page. The bundled Malinton fonts retain the prototype's personal-use license; review the supplied `public/site/fonts/Readme.txt` before publishing. This migration does not deploy the website or add a CMS.

The previous README is preserved in `docs/archive/previous-site-README.md`.

## Analytics

PostHog and Vercel Speed Insights are configured for production Vercel builds. Add the two PostHog values from `.env` to Vercel's Production environment variables, then redeploy. Local and preview builds do not track visits; session replay is disabled. See [analytics setup and event definitions](docs/analytics.md).
