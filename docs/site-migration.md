# Prototype promoted to main website

October 4, 2026

The main homepage now uses the completed pixel prototype, with its existing artwork and interactions. Journey, writing, and the doodle board have clean URLs. The previous Next.js pages and their working-tree changes were moved into `/archive/`, with their components and project data in `src/archive/`. Existing public assets were retained.

The homepage links to archived projects and the previous website. Archive navigation stays within the archive; its notice returns to the main site through a full document load. The former side-project preview dialog is now a working link to previous projects. Sample writing retains its labels and noindex metadata, and the doodle board remains a coming-soon page.

Main-site files are maintained in `public/site/`. The original `public/prototype/` study remains available for reference. The Next.js HTML route handlers prerender the main documents without React hydration, preserving script ordering and canvas behavior. Normal Next.js hosting replaces static export so clean URLs and permanent redirects work without a custom export conversion step. Do not deploy the old `out/` directory.

## Verification

- `npm run build`: passed, including TypeScript and build-time lint.
- `npm run lint`: passed.
- `node scripts/check-site.mjs http://localhost:3100`: passed for 18 pages and 80 local URLs, including redirects, fragment targets, CSS assets, archived projects, and unknown-route 404s.
- Chrome rendered the new homepage at both the development root and the production root. Desktop appearance matched the prototype; captured browser warnings/errors were empty.
- Responsive viewport and click automation timed out. Mobile layout, keyboard navigation, and interactive behavior have not been reverified for this migration. Temporary viewport overrides were reset.

No deployment or commit was made. Publication work still includes replacing sample writing as desired, implementing the doodle board, and resolving the bundled trial font's usage rights.
