# My journey preview

Open [My journey](http://localhost:3000/prototype/journey.html) with the local development server running. The homepage prototype's navigation and closing invitation both link to it.

## Behavior

- The first visit in a browser tab plays a roughly 13-second introduction: an egg drops onto Haiphong, cracks on impact, and splits into two jagged shell halves with small scattered fragments. The shells fade before Haiphong → Kansas → Hong Kong → Japan → Kansas. All egg motion uses the same playback clock as the flights, so pause freezes the fragments and replay starts with an intact egg. Pause, continue, skip, and replay are available. Completed or skipped introductions are remembered for that tab's session when session storage is available.
- The land uses a single fixed gray. Sparse colored ocean cells drift left to right on the pixel grid, fading in and out. Blue route dots move from each departure toward its destination; a separate SVG mask reveals them behind the plane during the intro. Pause motion freezes both ambient effects; offscreen/hidden pages suspend them, and reduced motion keeps them static.
- Map-marker hover or keyboard focus previews a story; clicking or pressing Enter pins it. X and Escape close it. Previous/next controls browse four places; Kansas combines the first arrival and return. The panel also links to the matching photo collection.
- Four numbered headings sit directly above four independent swipeable photo cards: Haiphong, Kansas, Hong Kong, and Japan. Each card shows one slide at a time and contains three clearly labeled placeholders until real photos are supplied. They form four columns on desktop, two on tablets, and one on small phones. The earlier large gallery sections were removed.
- Each card supports native horizontal scrolling/touch swiping, mouse dragging, previous/next buttons, and Left/Right/Home/End keys. Counters and button boundaries update independently. No autoplay. The round cursor is suppressed over cards so it does not cover photos or gestures. The numbered headings and sidebar links target the corresponding card. There is no separate Kansas return card.
- The map remains in the opening viewport, with the photo cards below it. On small screens, the story panel sits below the map. The animated route still includes Japan → Kansas, and the four destination links remain available during playback.
- Inside the map, the cursor is a directional pixel plane with a 33 px base sprite (25% smaller than the original 44 px). Outside the map, the homepage's round brush uses its 48 px resting radius, 8 px grid, speed taper, and soft pixel edge. Both interpolate pointer samples and use the homepage trail's 55 ms decay and solid palette steps, with white plane pixels over land. Crossing the map boundary clears the previous shape. Trails are suppressed over links/buttons, on touch, and for reduced motion.
- Reduced motion shows the complete map immediately, including on replay. The story is also available in a no-JavaScript fallback.

## Content and map

Copy uses only the supplied journey facts. Dates, exchange length, specific Japanese cities, and additional anecdotes have not been supplied. Japan and Kansas pins represent the country/state, not airports; arcs are illustrative. The pixel land geometry is generated from the public-domain [Natural Earth land dataset](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson). See `public/prototype/data/README.md` and `generate-journey-map.mjs` for reproduction.

## Validation

Checked in the Codex browser:

- The egg drop, all four flight captions in order, and the completed map.
- Pause holds the egg transform unchanged; continue completes the sequence; skip immediately reveals the map; replay restarts it.
- Hover preview and delayed dismissal, click pinning, X closing, keyboard Enter and Escape, and the combined Kansas story.
- Separate label targets for the adjacent Haiphong and Hong Kong pins.
- Visible plane cursor with palette pixels; the trail clears when leaving the map.
- Reduced-motion emulation skips playback. Emulation was reset afterward.
- Layouts at 320×568, 390×844, 768×1024, 1024×768, and 1440×900; no horizontal overflow in the measured 320, 768, 1024, and 1440 layouts. The closed map/controls fit the viewport at those sizes. Open phone stories extend the page normally.
- No browser console warnings or errors were captured on the journey page.
- `node --check` and ESLint pass for the journey scripts and map generator.

This is implemented in the standalone portfolio prototype, not yet migrated into the Next.js application pages. No deployment or commit was made. `journey-preview.png` records the desktop page with Haiphong pinned.

## Swipe-card revision verification

- Four photo cards align directly beneath their four numbered headings. Exactly one slide per card is exposed to accessibility tools at rest.
- Advancing Haiphong leaves the other three cards unchanged. Keyboard End selects the final Kansas slide and disables its next button. Mouse dragging advances Hong Kong.
- Desktop and 390 px phone layouts were visually inspected. Native touch-event injection is not supported by the in-app browser; the touch path uses the browser's native horizontal scroll and CSS snap behavior.
- The existing four flight paths and combined Kansas story remain unchanged.
- `journey-swipe-cards.png` captures the corrected four-card layout. Earlier gallery screenshots describe the superseded layout.
