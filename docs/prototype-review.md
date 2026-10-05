# Portfolio prototype review

October 4, 2026 · Step 1 ready for visual review; direction not yet approved.

## Review locally

With the existing Next.js development server running (`npm run dev`):

- Review shell: http://localhost:3000/prototype/index.html
- Mobile composition: http://localhost:3000/prototype/index.html?view=mobile
- Full-size responsive page: http://localhost:3000/prototype/screen.html

The standalone files live in `public/prototype/`. They introduce no package dependencies and do not change the existing application pages. The prototype is a design study, not the production homepage or CMS implementation. Navigation opens labeled destination previews; it does not yet scroll to completed sections.

## Combined requirements and design decisions

This review connects [portfolio requirements](portfolio-requirements.md) with [pixel art direction](../pixel-style.md). Those documents retain the detailed product and visual specifications. The user's latest instruction authorizes a local browser prototype in three stages, superseding the earlier implementation pause for this prototype scope.

| Requirement | Step 1 design proposal | Status |
| --- | --- | --- |
| Introduce Anh immediately; position software and AI work | Name in navigation and introduction label; KU context; current Pinnacle role | Implemented using supplied content; copy remains draft |
| Specific, personal headline | “I build the tools I wish I had.” in three display lines | Draft from requirements |
| Editorial/pixel direction | White, near-black grotesk type, thin rules, blue accents, broad procedural pixel field | Ready for review |
| Portrait placement | Compact portrait next to identity on desktop; beside biography on mobile | Clearly labeled abstract placeholder; real photo still needed |
| Homepage section navigation | Work, About, Writing, Contact; preview explains each future anchor | Destinations specified; full sections in step 2 |
| Responsive first screen | Split desktop composition; stacked mobile with horizontal divider | Implemented |
| Readable without motion | Static local SVG, ordinary HTML text, no entrance animation | Implemented |

## Three-stage agreement

1. **First screen:** review typography, navigation, portrait placement, artwork, and spacing in desktop and mobile layouts. Current deliverable.
2. **Full homepage:** after the direction is approved, extend through Work → Capabilities → Journey → Current rabbit hole → Contact. Label sample content. Use the confirmed journey route and current topic, Cursor pstack. Do not invent journey stories, project metrics, or unpublished writing.
3. **Interactive preview:** test pixel-field motion, journey selection/playback, rabbit-hole reveal, and transitions in the local browser, including touch, keyboard access, reduced motion, and static fallbacks.

Approval of a visual stage does not establish placeholder content as factual or authorize deployment. No production CMS, authentication, uploads, or hosting changes are included in the first-screen study.

## Artwork reproduction

Run `node public/prototype/generate-field.mjs` to recreate `field.svg`. The seed is fixed. The field uses coherent noise, curved color bands, an 8 px grid, and 1 px gutters. These are review settings, not approved final motion parameters. The mobile layout crops the same field rather than shrinking every cell.

## Verification

- HTML, stylesheet, and SVG return HTTP 200 from the existing local server.
- Desktop and 390 px mobile compositions were visually inspected in Chrome.
- Browser automation timed out on interaction and viewport-control operations. Keyboard behavior, navigation dialog interaction, console inspection, and the full breakpoint matrix are not yet verified; do not treat these as passed checks.
- Existing application files already have unrelated whitespace warnings. This study leaves those files untouched.

## Typography revision - October 4, 2026

Anh selected Malinton as the default font. The prototype now self-hosts its regular and semibold trial OTF files and inherits the family for headings, body copy, and navigation. The review toolbar keeps its neutral system font. Display size and tracking were adjusted for Malinton's proportions.

Source: https://www.dafont.com/malinton.font. The bundled Readme in `public/prototype/fonts/` states personal use only. These trial assets are for the local study; obtain the appropriate web/commercial rights and files before publishing the portfolio.

The existing palette is unchanged. Proposed next color direction: warm ivory `#F6F3EA`, charcoal `#222820`, forest `#315748`, moss `#93A27B`, and apricot `#E49B73`. Keep most color in the pixel field. This palette is a recommendation, not an approved selection.

## Pixel-led introduction revision - October 4, 2026

Latest user direction supersedes the earlier headline proposal: remove “I build the tools I wish I had,” put animated pixel artwork in that position, remove “Explore my work,” and let ordinary scrolling reveal selected work. “Hi, I’m Anh” is now the page heading beside the portrait. The existing palette and Malinton remain.

New draft copy: “I chase questions that keep me up at night—and build tools to find the answers.” This follows the user's suggested tone; exact wording remains open to review.

A small selected-work section with labeled sample copy now follows the introduction to demonstrate the transition. Work navigation links directly to that section. About, Writing, and Contact remain destination previews until the full-homepage stage.

The hero now uses Canvas 2D with a local SVG fallback, a pause/play control, reduced-motion handling, and suspension when offscreen or hidden. This early motion study was explicitly requested as part of the first-screen revision; it does not mark the full interaction stage complete. The browser confirmed visible motion, pause/play state changes, and the Work anchor.

## Cursor interaction revision - October 4, 2026

Anh requested removing the pause button, continuous animation, and cursor interaction. The prototype now removes the control and displaces nearby pixel cells around the pointer, with smoothed movement and recovery on pointer exit. Touch input does not capture or prevent scrolling. Ambient motion continues while visible; offscreen/hidden suspension and the system reduced-motion preference remain supported.

Browser verification: the pause button is absent, animation reports playing, pointer entry activates displacement, and pointer exit starts settling. The pointer effect was visually inspected. A click-triggered ripple and a hidden pixel creature are discussion ideas only; neither is implemented.

## Page-wide colored cursor correction - October 4, 2026

Anh clarified that the colored cursor should remain visible outside the main animation, as on https://craft.wild.as/. Browser inspection confirmed a colored pixel brush in the reference's white space below the main field.

The prototype now uses an original transparent, fixed-position pixel brush across the page. This replaces the local repulsion effect. The brush shares the field palette, preserves the normal pointer, follows viewport coordinates during scrolling, and does not intercept links, clicks, selection, or scrolling. It hides when the pointer leaves the document or the window loses focus; touch does not create a persistent hover cursor. System reduced motion keeps the brush responsive to direct pointer movement without ambient morphing.

Verified in the browser: brush active beyond the hero's right edge, Work anchor remains clickable, brush remains active after scrolling, and no horizontal overflow at the viewport edge.

## Introduction copy revision - October 4, 2026

Removed the “ANH HOANG / SOFTWARE & APPLIED AI” label at Anh's request. Current introduction copy, lightly edited for grammar: “I build automated solutions for all the problems I’ve had in my life, and I chase questions that ruin my sleep.” This supersedes the earlier question-and-answers copy.

## Background-reactive cursor and two-line copy, October 4, 2026

The approved introduction now reads on two lines: "I automate the problems life throws at me." and "I chase the questions that keep me up."

The cursor shares the artwork's 8 px grid. It clears colored field cells to white and paints the existing palette into empty cells and page whitespace. An interpolated path fills gaps between pointer events, including quick swipes. Each touched cell decays independently, restoring the original background over roughly half a second. The original field is cached separately so previous cursor marks never affect background classification. Marks remain aligned with the document during scrolling.

Reduced motion keeps the direct brush but removes the trail and ambient animation. The overlay preserves the normal cursor and passes clicks through. Touch pointer events release the brush, and leaving the document lets the remaining trail fade.

Verified in the local browser: white cutout pixels, original colors returning after movement, colored pixels on white space, a continuous fast-swipe trail, Work navigation, reduced motion without lingering pixels, and two-line copy without horizontal overflow at 320, 390, 768, 1024, and 1440 px. Touch handling passed a synthetic PointerEvent check; native touch gesture automation was unavailable in the in-app browser. JavaScript syntax and targeted ESLint checks passed. No browser warnings or errors were reported during the initial interaction checks.

Review image: [Cursor preview](pixel-cursor-preview.jpg).

## Fluid brush revision, October 4, 2026

Pointer and scroll samples now share a continuous path and render once per animation frame. The brush narrows smoothly at higher speed and widens when motion slows. See [cursor motion review](cursor-motion-review.md) for the reference findings, independent before/after canvas checks, and remaining test limits.

## Solid black and shorter trail, October 4, 2026

Reinspection of the reference confirmed that its main cursor field draws opaque palette colors and removes cells below an intensity threshold. The prior prototype instead reduced alpha, producing a gray fringe.

The darkest pixel band is now pure black. Cursor cells render at full opacity, step through the palette, and disappear at a cutoff. The decay constant is 55 ms and removal threshold is 0.08, limiting an untouched full-strength mark to approximately 139 ms, down from approximately 664 ms. The gray-fringe request is applied to the cursor and darkest artwork band; the faint empty-background grid is unchanged.

Browser checks found opaque black cell centers, no partially transparent sampled cell centers, and no trail remaining 200 ms after release. The existing fast-stroke and scroll-continuity checks still pass, as does speed-dependent narrowing. JavaScript syntax and targeted ESLint pass. Results: [solid brush checks](solid-brush-results.json). Preview: [solid brush](solid-brush-preview.jpg).

## Selected work cards, October 4, 2026

The two project summaries in the standalone preview now use a horizontal card deck inspired by the supplied CardStack component. The active card sits flat; the next project peeks out at a slight angle. Square corners, Malinton, thin rules, and original blue/yellow pixel illustrations follow the current editorial direction. Existing sample project copy remains labeled as a study.

The preview uses native horizontal scrolling with snap points, mouse dragging, arrow buttons, square selectors, and Left/Right/Home/End keyboard navigation. Vertical page scrolling remains native. Reduced motion removes animation. The decorative transforms live inside the scroll targets so they do not shift snap positions. Project content remains readable if JavaScript is unavailable; scripted controls are hidden until initialized.

This change targets `public/prototype/screen.html`, also embedded in the design review shell. It adapts the supplied React example's interaction to this standalone HTML preview; it does not install a React component or alter the separate React homepage. Next.js, TypeScript, Tailwind, Framer Motion, and Lucide are already installed for a later application integration.

Verified: arrow buttons, square selectors, End/Home keyboard navigation, mouse drag, reduced-motion transitions, and no page or card-copy overflow at 320, 768, 1024, and 1440 CSS pixels. Desktop and 320px mobile layouts were visually inspected. Browser logs contained no warnings or errors during these checks. JavaScript syntax and targeted ESLint pass. Native touch scrolling is implemented through browser overflow behavior but was not tested on a physical touch device.

Review image: [Selected work cards](selected-work-cards-preview.png).

## Pixel ribbon and card feedback, October 4, 2026

Following Anh's direction, an animated pixel ribbon now sits to the left of “From questions to working software.” It uses the hero/cursor palette and 8px grid, with diagonal running bands between thin rules. Scrolling reveals the ribbon and advances its pattern; gentle movement continues while it is visible. The decoration is independent of project content.

Changing cards emits a brief pixel pop in the gutter above the cards. Clicking an arrow emits a small radial burst around that control. Both effects use opaque square particles that shrink and disappear, with no pointer interception. Reduced motion keeps a static ribbon and suppresses particles. Animation suspends offscreen and when the tab is hidden; particle counts are bounded.

Browser verification found changing ribbon pixels, visible burst pixels during navigation and none remaining after one second, working card navigation, and zero burst pixels with reduced motion. Responsive checks found no page or heading overflow across narrow mobile through desktop sizes (291–1309 CSS pixels under the browser's current zoom). Mobile and desktop were visually inspected. Browser logs were clear; JavaScript syntax and targeted ESLint passed. These checks do not substitute for physical touch-device testing.

Review image: [Pixel ribbon and selected work](selected-work-pixels-preview.png).

## Card-wide pixel motion revision, October 4, 2026

The heading is now left of the ribbon. The ribbon has no top/bottom rules and uses straight diagonal bands with consistent widths, spacing, and height.

Horizontal card movement now draws transient pixel contours over the entire card surface, including imagery and copy. The effect reuses the cursor's 8px grid, solid palette steps, and short decay; it clears within 180ms of the last scroll input. It replaces the former gutter pop and works with mouse dragging, native horizontal scrolling, and button/keyboard navigation. Each overlay travels and clips with its card and ignores pointer input.

Arrow clicks now produce a compact expanding pixel ring with a solid white interior. The ring lasts 460ms and uses a viewport overlay to avoid clipping at the section edge. It follows the button's document position if the page scrolls. Both feedback effects are suppressed with reduced motion and cleared when hidden/offscreen.

Verification: real canvas sampling found effect pixels in all four card quadrants, white center pixels and colored ring pixels, and no remaining effect pixels after settling. Reduced motion produced zero effect pixels while navigation still worked. Heading order and no page/heading overflow passed at 320, 768, 1024, and 1440 CSS pixels. Desktop/mobile visually inspected; browser logs clear; JavaScript syntax and targeted ESLint passed.

Updated review: [Revised selected work](selected-work-revised-preview.png).

## Separate heading blocks and hero connection, October 4, 2026

The complete “From questions to working software.” heading is again one block on the left, with a separate ribbon filling the right block. A 24px desktop / 16px mobile gap replaces the earlier large separation; the ribbon no longer sits inside the final line of text.

A decorative stream now connects the hero artwork to the Selected Work ribbon. Its head follows page-scroll progress. The route passes through desktop whitespace or the outer gutter on narrow layouts; on arrival, the remaining tail clears into the ribbon in 260ms. It does not intercept input. Reduced motion and hidden-tab handling suppress rendering. The connection is isolated in `pixel-connection.js`, with geometry updated when the introduction or heading row changes size.

Verified real canvas pixels during the desktop transition, no connection pixels after arrival, zero pixels under reduced motion, and a mobile stream confined to the outer gutter. Separate heading/ribbon blocks and no horizontal overflow passed at 320, 768, 1024, and 1440 CSS pixels. Browser logs, JavaScript syntax, and targeted ESLint were clear. Desktop transition image: [Hero to work connection](hero-work-connection-preview.png).

## Hourglass transfer, October 4, 2026

Anh clarified that the hero field should itself pour into Selected Work. This replaces the independent connecting trail. The transfer snapshots the hero renderer's actual colored cells, drains them bottom-first into a narrow throat, and fans them into matching color cells in the destination ribbon. The original hero rendering is hidden while its cells are transferred; it does not keep drawing a duplicate field. Scroll progress controls the pour with brief smoothing, and scrolling upward restores the field.

The destination canvas starts empty and reports `waiting`. Its running pattern starts only after the transfer finishes. During transfer, the overlay shows arriving cells without starting the destination animation. Reduced motion shows static artwork at both ends and suppresses the pour. The narrow-screen neck travels along the outer gutter between the stacked introduction and Selected Work.

Verified in the browser: zero destination pixels before transfer, a visible funnel using hero colors during transfer, `waiting` during filling, `playing` with changing pixels only after completion, an empty transfer overlay after arrival, and restoration of the visible hero / empty waiting destination on reverse scrolling. Reduced motion leaves the hero visible and draws no transfer pixels. No horizontal overflow at 320, 768, 1024, or 1440 CSS pixels; no browser warnings/errors; targeted ESLint and JavaScript syntax checks passed. Physical touch testing remains unperformed.

Review image: [Hourglass pour](hourglass-pour-preview.png).

## Capabilities section, October 4, 2026

The prototype now continues from Selected Work into Capabilities. Three readable rows cover backend systems, applied AI, and practical automation, with relevant tools and examples drawn from the supplied content inventory. The section uses Malinton, thin rules, blue square markers, and an original static pixel illustration. Copy remains part of the local design study.

The section stacks on mobile and requires no additional JavaScript. A keyboard-accessible link returns to Selected Work. The review shell now names all three implemented sections. This update changes the standalone prototype, not the separate React homepage.

Browser checks passed at 320, 768, 1024, and 1440 CSS pixels with no horizontal overflow in the section. Desktop and narrow mobile layouts were visually inspected. The Work link responds to Enter and has a visible keyboard focus outline. Heading levels and tool lists are exposed in the accessibility tree. Browser logs contained no warnings or errors. No new motion or dependencies were introduced.

Preview: [Capabilities](capabilities-preview.jpg).

## Interests and pixel tool marquee, October 4, 2026

Anh replaced Capabilities with "Problems I love to work on." The section now introduces interests in repetitive tasks, messy information, and systems that fail. The former illustration, repeated project evidence, and small technology bullets have been replaced by two prominent tool-name rows moving in opposite directions.

The supplied GooeyMarquee example inspired the entry and exit effect. This version uses the actual text raster to assemble and dissolve glyphs into solid 8px cells at both edges. The center remains clear Malinton text. It follows the portfolio palette without blur, gradients, or stock assets. The standalone prototype has no React runtime, so this interaction is implemented in `public/prototype/tool-marquee.js`, with layout in `style.css`. No dependencies or unused React demo files were added. The existing React app already has TypeScript, Tailwind, and `src/components`; its eventual reusable UI destination is `src/components/ui` under the existing `@/` alias.

The motion pauses on mouse hover or with a keyboard-accessible Pause/Play control, and suspends while hidden or outside the viewport. Reduced motion displays all 12 tools in wrapping HTML lists. Those lists are also the no-JavaScript/canvas fallback and remain available to assistive technology while animation runs. The old `#capabilities` anchor still resolves to the renamed section; the new address is `#interests`.

Verified in the browser: actual canvas pixels moved in opposite directions, and remained unchanged after pausing. Enter toggled playback with a visible focus outline. The section had no horizontal overflow at 320, 768, 1024, and 1440 CSS pixels. Reduced-motion emulation hid the canvases and control and showed all tool names. JavaScript syntax and targeted ESLint passed.

Offscreen suspension and clean browser logs were also verified. On narrow screens the pixel edges shrink to preserve reading space for longer tool names. Preview: [Interests and tool marquee](interests-marquee-preview.jpg).

## Tool marquees per interest, October 4, 2026

The interests now follow Anh's requested order: high-ownership products and features, agentic workflows, and automating repetitive workflows. Each has its own full-width tool marquee below its description. The full-stack row contains 14 technologies, the AI row contains nine, and the automation row contains seven, including the user-supplied n8n, Hermes Agent, and Grokbot names.

Each marquee initializes independently. Hovering its tool line or focusing it by keyboard pauses only that row. Wheel and trackpad input over the line move the tools horizontally; Left/Right keys do the same, and Home returns to the beginning. Explicit Pause/Play still works. Scrolling outside a line moves the page normally, and browser zoom modifiers are not intercepted. Reduced motion retains wrapping HTML lists without animation or scroll interception.

Verified with actual canvas samples and UI input: mouse-wheel scrolling changed the first row's pixels while page scroll position stayed fixed; arrow keys changed the same row; hovering the second row paused it while the first continued. Scrolling in the page gutter changed page position normally. No horizontal overflow at 320, 768, 1024, or 1440 CSS pixels. JavaScript syntax and targeted ESLint passed.

All three reduced-motion fallbacks show their HTML lists, remove animation-only focus targets, and keep all 30 tool names available. Browser logs were clear. Preview: [Grouped tool marquees](interests-grouped-marquees.jpg).

## Cards dissolve into pixels, October 4, 2026

Scrolling past the project deck now breaks its actual artwork, copy, and controls into square fragments before they disappear as My Interests enters view. A deterministic SVG mask reduces 24px tiles into 16px and 8px fragments, preserving the original colors and content instead of adding unrelated particles. The transition begins only after the deck's top passes the viewport and preserves its layout height. Reverse scrolling reconstructs the cards. The hero hourglass and horizontal carousel effects remain independent.

Reduced motion and keyboard focus restore the complete deck. The animation schedules frames only while scroll progress is settling; the mask updates in bounded steps. Verified intact, intermediate, fully dissolved, and restored states in the browser; carousel navigation still switches projects. No horizontal overflow at 320, 768, 1024, or 1440 CSS pixels, no browser warnings/errors, and JavaScript syntax validation passed.

Preview: [Card pixel dissolution](card-dissolve-preview.png).

## Current rabbit hole, October 4, 2026

Added the next prototype section after Interests: “Down the rabbit hole.” The current topic is the owner-selected Cursor pstack. Writing now links to this section. The section pairs large Malinton type with an original static pixel tunnel and a brief falling-pixel / rolling-topic entrance, resolving once per page load. Motion suspends offscreen and in hidden tabs; reduced motion shows the final topic immediately. The article area uses a neutral unpublished state without invented article content or a dead article link.

Verified no horizontal overflow at 320, 768, 1024, and 1440 CSS pixels, desktop and narrow mobile composition, a running entrance resolving to zero animations, reduced motion with no generated particles or reel, and readable HTML without JavaScript. Browser warning/error logs were clear; JavaScript syntax and targeted ESLint passed. This remains the standalone design prototype; no production CMS or publication is included.

Preview: [Rabbit hole](rabbit-hole-preview.png).

## Scroll into the rabbit hole, October 4, 2026

This revision supersedes the illustrated two-column Rabbit Hole panel. After Interests, scrolling breaks a full-width white surface into falling square fragments and exposes black beneath. The fragments use the adjoining surface colors: white for the page, actual RGB samples from the last tool canvas at the seam, and stepped shades toward the black destination. There is no independent random particle palette. Reverse scrolling rebuilds the surface.

The dark chapter centers “Down the rabbit hole.” and “I’m currently exploring:”. A 65-row digital reel cycles through AI topics over 4.2 seconds, decelerates, and resolves to the owner-selected Cursor pstack. Upcoming writing appears after the reel settles and the visitor reaches that part of the scroll. The topic reel pauses when offscreen or hidden and does not restart after completion. The intermediate options are decorative, hidden from assistive technology, and do not represent published articles.

Verified in the browser: the white-to-black intermediate pixel state, scrolling reversal, reel movement slowing from large to progressively smaller half-second distances, final Cursor pstack, and writing hidden until settlement. Fixed native fragment restoration overriding the direct chapter link on reload. No horizontal overflow at 320, 768, 1024, and 1440 CSS pixels. Reduced motion skips the long transition and shows final content immediately; no JavaScript leaves the complete black section readable. Browser warning/error logs were clear; targeted ESLint and JavaScript syntax checks passed.

Previews: [Pixel collapse](rabbit-hole-collapse-preview.png), [Dark chapter](rabbit-hole-dark-preview.png), [Mobile](rabbit-hole-mobile-preview.png).

## Colored falling trails and cursor on black, October 4, 2026

Added short red, yellow, and blue pixel trails behind a deterministic subset of the falling page fragments. Each trail follows earlier positions along its fragment's fall path, uses crisp 4px/8px squares, and is painted behind the original surface. The trails remain scroll-controlled and clear with the collapse; reduced motion continues to skip the transition.

Changed the page-wide cursor canvas from multiply to normal compositing. Multiply suppressed its colors over the black Rabbit Hole background; normal compositing retains the solid brush palette on both white and black while keeping the overlay non-interactive.

Verified actual red, blue, and yellow pixels in the collapse canvas, visually checked colored trails and cursor visibility over black, and passed JavaScript syntax and targeted ESLint checks.

## Center-out ground fracture, October 4, 2026

Changed the break order from top-to-bottom to an expanding central fracture. Each cell's delay follows its distance from the viewport center, with deterministic angular irregularity to form a jagged opening. Broken pieces slip toward the opening before falling downward; their existing red, yellow, and blue trails follow the same updated paths. The cursor compositing and subsequent topic/writing sequence remain intact.

Verified the intermediate render in an isolated browser preview: the center was transparent to the black backdrop while all four sampled corners remained opaque white. Visually checked the outward fracture and colored debris; browser logs were clear. JavaScript syntax and targeted ESLint passed.

Preview: [Center-out fracture](rabbit-hole-center-fracture-preview.png).

## Pixel text reveal, October 4, 2026

Replaced Rabbit Hole opacity fades and vertical entrance movement with deterministic 8px tile masks on the kicker, heading, exploring/slot group, and Upcoming writing. The masks expose the actual HTML text in discrete steps, preserving its normal typography when complete. Heading and exploring reveals follow scroll progress; writing assembles over 800ms after the slot settles. Reverse scrolling hides the earlier groups through the same tile pattern. Reduced motion immediately exposes all text, and no-JavaScript rendering remains readable.

Verified an intermediate heading with visible missing square blocks, computed opacity 1 / no transform / zero transition duration, and writing's hidden → assembling → complete sequence after slot settlement. Finished masks are removed. At 320px there was no horizontal overflow, and reduced motion applied no masks. Browser warnings/errors were clear; JavaScript syntax and targeted ESLint passed.

Preview: [Pixel text reveal](rabbit-hole-pixel-text-preview.png).

## Writing collection link, October 4, 2026

Replaced Upcoming writing and its placeholder paragraph with “See my writing here”, linking to the new standalone prototype Writing page at `writing.html`. The destination uses the dark chapter styling and an honest no-published-posts state, plus a return link. The CTA retains its pixel reveal and remains inert until fully visible to prevent invisible keyboard focus.

Verified Enter follows the CTA to Writing, the destination returns HTTP 200, the new page fits at 320px, and browser logs are clear. JavaScript syntax and targeted ESLint passed. Preview: [Writing link](rabbit-hole-writing-link-preview.png).

## Magic wand and closing invitation — October 4, 2026

The rabbit hole now ends with a discoverable pixel wand and a small hint. It appears with the writing link after the topic settles. Activating it reveals the final section and moves keyboard focus to its heading. Contact navigation and a direct #contact URL also reveal that section. Without JavaScript the section remains available through ordinary anchor links; reduced motion skips the animated reveal and smooth scrolling.

The closing section says “Like it here? Leave me a doodle on my board.” Both its call to action and illustrated board link to doodle-board.html, a coming-soon page. Drawing and persistence remain future work. Email, GitHub, and LinkedIn reuse the existing application’s contact destinations.

Verification: JavaScript syntax checks passed; all new/changed page assets return HTTP 200. Chrome’s accessibility tree confirmed the wand appears, the closing section is initially absent, and direct #contact navigation exposes the closing copy and links and focuses the heading. Browser screenshot capture and click automation timed out, so visual breakpoint checks and pointer/keyboard activation remain unverified.

## Floating pixel stars and wand-only exit — October 4, 2026

The rabbit hole now contains 96 small colored pixel stars that drift slowly at different speeds. Stars pause offscreen and when the tab is hidden; reduced motion keeps them static.

After the entrance reaches the readable chapter, it becomes a fixed, scroll-contained room. Outside sections become inert, keyboard navigation stays inside, and the partially hidden wand releases the room and opens the closing invitation. On short screens, internal scrolling keeps the wand reachable. Writing opens a separate tab so the current room stays in place. Contact navigation now leads through the rabbit hole until the wand has been found; returning from the doodle-board placeholder preserves that discovery for the current tab. Explicitly re-entering the rabbit hole starts discovery again. This supersedes the earlier unrestricted Contact shortcut.

Verified in Chrome: 96 stars, live star animation, document scroll containment under wheel input, Tab navigation to the wand, Enter activation, focus transfer to the closing heading, restored scrolling, and cleared inert sections. Mobile DOM at 390 × 700 has no horizontal overflow and an onscreen wand. Desktop screenshot inspected. Reduced-motion stars report animation:none. No browser console warnings/errors. Syntax and targeted ESLint checks pass.

## First-visit stuck hint — October 4, 2026

The old always-visible wand clue is now a small status box: “Are you stuck? A little magic can get you out.” It appears after a downward wheel, upward touch swipe, or downward keyboard-scroll attempt while the rabbit hole is locked and its internal scroll area is already at the bottom. It does not appear automatically on entry or while the visitor can still scroll within a short screen. The message clears on wand exit. A localStorage flag remembers that the hint has been shown, with an in-memory fallback when storage is unavailable. The box is announced politely without moving focus.

JavaScript syntax and whitespace checks passed. Browser verification was attempted, but browser initialization timed out.

## Wand discovery and magical exit — October 4, 2026

Hovering or focusing the partly hidden wand now starts a ring of colored pixel sparks. Activating it gathers and bursts 80 square particles from its tip while a white circle expands to cover the screen. The closing section is positioned underneath, then the overlay fades away. The main effect lasts 1.15 seconds. Repeat activation is ignored during the effect; a timeout and visibility-change fallback ensure the visitor is released if frames are throttled. Reduced motion skips the burst and uses a stationary discovery ring.

Verified in Chrome: keyboard focus starts the visible orbit; Enter reaches #contact, focuses “Like it here?”, restores page scrolling, and leaves no animation overlay or busy state. No console warnings/errors. The orbit screenshot is saved as wand-orbit-preview.png. Syntax and targeted ESLint checks passed. The timed DOM observer did not capture the intermediate burst, so its visual timing has not been independently verified.

## Interest column swap, October 4, 2026

Applied all six browser annotations: each description now sits below its heading in the left column, and its tool marquee occupies the right column. At 900px and below, the marquee stacks after the description. Existing tool content, motion, and scroll handlers are unchanged. Browser geometry checks at 320, 768, 1024, 1130, and 1440 CSS pixels confirmed the requested order and no horizontal overflow. The 1130px desktop arrangement was visually inspected. Preview: [Interest columns](interests-columns-preview.jpg).

## Reference-style pixel shockwave — October 4, 2026

Following the user's confirmation, the wand now sends a dense wave through a square pixel grid. Solid color bands sweep outward from its tip and leave solid white behind. The intended duration is 560ms, followed directly by the closing invitation: no charge-up, smooth circular portal, or overlay fade. The grid is bounded on large displays, delayed frames are clamped, and the existing timeout releases visitors if rendering stalls. Cursor pixels remain suppressed throughout casting. The closing section is positioned synchronously before removing the overlay to avoid exposing the dark chapter between frames.

Syntax, targeted ESLint, and whitespace checks pass. Chrome verified activation reaches #contact with focus on closing-heading, no remaining overlay, restored scrolling, and no console errors/warnings. Animation frame sampling was inconclusive under the browser automation timing, so intermediate visual timing remains unverified. Screenshot capture returned a blank image; visual playback remains unverified.


## Reveal the actual closing content beneath the wave — October 4, 2026

Corrected the white interstitial: the transition now preserves an inert, decorative copy of the visible rabbit-hole scene, opens and positions the actual closing section immediately underneath, and removes old-scene pixels with a grid-aligned mask following the shockwave. The effect canvas only draws the colorful wave; it never paints white over the destination. The old scene and effect canvas are removed together at completion. The existing reduced-motion and timeout paths remain.

Browser verification exercised the real navigation and wand click handlers: at the start of the effect, the closing section is visible and positioned at viewport top (0px), with the old-scene overlay still present. The reveal mask updates during animation. Completion removes both overlays, restores scrolling, and leaves focus on closing-heading. Console is clear. Targeted ESLint, JavaScript syntax, and whitespace checks pass.

## Fix suppressed stuck hint — October 4, 2026

Reproduced the missing message in Chrome: the stage was locked and at its bottom (scrollTop 0, clientHeight/scrollHeight 989), but a persisted portfolio-rabbit-stuck-hint-seen=yes flag suppressed the hint after a real wheel event. Removed the permanent localStorage gate. Hint state now resets with each rabbit-hole discovery entry; repeated blocked-scroll attempts during that entry keep the existing message. This supersedes the earlier once-per-browser behavior.

Verified with real wheel events while retaining the old stored yes flag: no message before scrolling, visible exact copy after the first downward attempt, one message after repeated scrolling, and a fresh hidden-then-visible sequence after wand exit and re-entry. JavaScript syntax, targeted ESLint, and whitespace checks pass.

## Internship timeline and smoother cards, October 4, 2026

The work section now has dated internship selectors above the cards, newest first: Pinnacle Technology, Monarch Watch, and DueGooder. Each card includes the role and dates. Monarch Watch's web collection and OCR description comes from the existing resume inventory in portfolio-requirements.md, with no unverified outcome metrics added. Pinnacle remains marked current because its supplied end date is December 2026.

Card rotation and scale now track horizontal scroll progress continuously. Programmatic settling temporarily disables scroll snapping so a drag release does not trigger a competing snap. Timeline selection, count, arrow controls, and keyboard navigation share the selected card. Moving pixel accents are restricted to the artwork and ease in and out, keeping the copy readable.

Browser checks: a transition to Monarch Watch produced 29 distinct intermediate transforms, no backward scroll steps, exact final alignment at 832 px, and matching timeline/count state. End selects DueGooder; reduced-motion Home returns instantly to Pinnacle without transforms. A real mouse drag returns from DueGooder to Monarch Watch and clears drag state. There is no document or timeline-button horizontal overflow at 320, 390, 768, or 1130 CSS pixels. Browser warnings/errors were empty. JavaScript syntax and targeted ESLint passed.

Preview: [Internship timeline](internship-timeline-preview.jpg).

### Introduction and question-led internship cards — October 4, 2026
- Updated education to CS + Business at the University of Kansas and the intro sentence to 'I chase the questions that ruin my sleep.'
- Rewrote all three internship card headings as questions grounded in the existing project descriptions.
- Verified the live prototype at desktop and 390px mobile width; the revised copy fits without horizontal overflow.
- Portrait treatment awaits the user's preferred direction and source photo. The existing placeholder remains; a portrait appears in public/CardContent.png, but its intended use is unconfirmed.
- Preview: docs/intro-questions-preview.jpg.


### Aquarium portrait trial — October 4, 2026
- Replaced the introduction silhouette with the user-supplied IMG_8012.jpg, copied unchanged to public/prototype/anh-aquarium.jpg. The page applies a tighter head-and-shoulders crop with aquarium detail.
- Enlarged the portrait to 112px on desktop, 96px on smaller layouts, and 80px at the narrowest breakpoint. Removed the placeholder caption.
- Added a 420ms pixel-to-photo reveal on hover or keyboard focus; the photo links to the journey page. Reduced motion keeps the sharp photo static.
- Verified 320/768/1024/1440px layouts without overflow, image loading, reveal completion, reduced-motion behavior, and no browser warnings/errors. JS syntax and ESLint passed.
- Preview: docs/aquarium-portrait-preview.jpg.


## Writing gallery and reading pages, October 4, 2026

Replaced the standalone Writing placeholder with the requested image-and-title gallery. Cards include a topic tag beneath the title and open separate static reading pages. The preview uses the existing Malinton typography, white background, thin borders, and blue accent, with six original local SVG covers. The grid has three columns on desktop, two on tablet, and one on phones. Optional topic filters support URL state and browser history.

The six articles are explicitly labeled design samples, including on the collection and each reading page. They do not represent owner-authored or published posts. Cursor pstack content remains unwritten and untouched. CMS integration and production publishing are outside this design preview. Content lives in `public/prototype/writing-data.mjs`; regenerate the static gallery, articles, and covers with `node public/prototype/generate-writing.mjs`.

Verified in Chromium at 320, 768, 1024, and 1440 CSS pixels with no horizontal overflow. Checked all article destinations and cover loads, topic filtering and reload/history restoration, keyboard navigation and visible focus, return/next links, unknown-topic fallback, reduced motion, and reading without JavaScript. No browser warnings, errors, or failed requests were observed. Targeted ESLint passed. Screenshots: [desktop gallery](writing-gallery-desktop.png), [mobile gallery](writing-gallery-mobile.png), [desktop article](writing-article-desktop.png), [mobile article](writing-article-mobile.png).
