# Pixel portfolio: art direction and recreation guide

Date: October 4, 2026

Status: design specification for discussion. The user selected https://craft.wild.as/ as the visual reference. Page structure, copy, and implementation details below are proposals unless explicitly described as observations. Confirm the section and content plan with Anh before further website implementation.

This file records the new pixel direction. The earlier paper-workshop specification and Blender assets remain historical material and are not part of this proposed design.

## 1. Reference and scope

Reference: [Craft, engineered · wild](https://craft.wild.as/), inspected in a browser on October 4, 2026.

Observed characteristics:

- White background, near-black text, and a restrained editorial layout.
- A large, regular-weight, uppercase headline broken across two lines.
- A split desktop introduction: headline on the left; compact positioning and supporting copy on the right, separated by a thin vertical rule.
- A full-width, animated field of small square cells beneath the introduction.
- Color regions that resemble moving contours, with irregular edges and scattered cells.
- Navy, blue, yellow, orange/red, and yellow-green in the artwork. White gutters keep individual cells visible.
- Large, sentence-case statements further down the page, supported by smaller text.
- Project imagery, horizontal project browsing, and simple directional controls.
- Additional interactive graphics throughout a long scrolling page.

Computed styles observed on the reference used Sneak with Helvetica Neue, Helvetica, Arial, and sans-serif fallbacks. The headings inspected used font-weight 400. Observed font sizes varied with viewport; they are not universal design tokens.

The following palette, dimensions, timings, and mathematical recipe are an original implementation proposal. They are not extracted settings or verified descriptions of wild's rendering algorithm. Recreate the visual language with Anh's content and original procedural artwork; do not reuse the reference's branding, project assets, copy, or font files.

## 2. Overall visual rules

1. Typography and alignment establish the layout. Color is concentrated in artwork and project imagery.
2. Use flat surfaces, square corners, thin rules, and deliberate whitespace.
3. Keep essential content as selectable HTML text. The canvas is decorative.
4. Preserve the contrast between the orderly page grid and the irregular pixel field.
5. Use a small number of prominent graphics. Do not place an animated background behind every section.
6. Keep projects, contact information, and the résumé available through ordinary links.

Avoid pill-shaped navigation, floating glass panels, gradients behind text, decorative drop shadows, rounded card grids, fake terminal windows, and gamified obstacles to reading the portfolio. The pixel field supplies the visual character.

## 3. Color configuration

Proposed semantic tokens:

| Token | Value | Purpose |
| --- | --- | --- |
| `--paper` | `#FFFFFF` | Page and canvas background |
| `--ink` | `#101010` | Main text and icons |
| `--muted-ink` | `#595959` | Secondary copy |
| `--rule` | `#DEDEDE` | Section and column dividers |
| `--cell-empty` | `#F3F4F5` | Very faint unoccupied cells |
| `--pixel-navy` | `#161E34` | Dark contour boundary |
| `--pixel-blue` | `#3049D9` | Strong blue band and focus indication |
| `--pixel-periwinkle` | `#536BFA` | Lighter blue band |
| `--pixel-yellow` | `#F6CE25` | Broad warm band |
| `--pixel-orange` | `#FA593E` | Smaller hot areas |
| `--pixel-lime` | `#D8EE40` | Sparse brightest areas |

Use the bright colors primarily as artwork, not small text on white. Color must not be the only indicator of a selected control. Validate final text and focus contrast in the browser.

## 4. Typography

Update, October 4: Anh selected **Malinton** as the default font. The local prototype uses its regular and semibold trial files; see `docs/prototype-review.md` for source, license limits, and adjusted sizing. This supersedes the initial font-stack proposal below.

Use a neutral grotesk sans-serif. Start with `"Helvetica Neue", Helvetica, Arial, sans-serif` to avoid a font download during design review. Sneak is the observed reference font, not an approved dependency. Any later custom font needs an appropriate license and a documented source.

| Role | Proposed desktop treatment | Proposed narrow-screen treatment |
| --- | --- | --- |
| Hero headline | `clamp(72px, 8vw, 132px)`, weight 400, line-height 0.92, letter-spacing -0.065em | `clamp(52px, 13vw, 80px)`, line-height 0.95 |
| Section statement | `clamp(36px, 4.5vw, 72px)`, weight 400, line-height 1.05, letter-spacing -0.045em | 30–40px, line-height 1.1 |
| Section heading | 32–48px, weight 400, line-height 1.1 | 28–36px |
| Project title | 24–30px, weight 400–500, line-height 1.15 | 22–26px |
| Intro/body copy | 18–22px, line-height 1.45–1.6 | 16–18px, line-height 1.5 |
| Labels/metadata | 11–12px, uppercase, letter-spacing 0.06em | 11–12px; do not shrink further |

Keep paragraphs roughly 45–70 characters wide. Reserve uppercase for the main display title and short labels. Use sentence case for project and section headings. Adjust line breaks to actual copy; do not insert desktop-only breaks that leave isolated words on mobile.

Use one `h1` per page, `h2` for sections, and `h3` for items within a section. Choose heading levels for meaning rather than visual size.

## 5. Layout and spacing

Proposed spacing scale in CSS pixels: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.

- Desktop page gutters: `clamp(24px, 4.5vw, 80px)`.
- Tablet gutters: 32px; small-screen gutters: 20px, reducing to 16px at 320px.
- Separate major sections with a 1px rule and 64–128px of vertical space, depending on content density.
- Hero desktop columns: approximately 60% headline and 40% supporting content. A 1px vertical divider marks the split.
- Hero mobile: stack the headline and supporting content; replace the vertical divider with a horizontal one.
- Keep the hero typography compact enough that some of the artwork is visible in the first viewport.
- Let the artwork span the viewport. Align its caption and controls with the main page gutters.
- Proposed canvas height: `clamp(280px, 32vw, 460px)` on desktop; 220–280px on mobile.
- Use a two-column project layout for the existing two projects. A carousel is optional if the collection grows; do not require horizontal navigation to discover the only two projects.
- Reading pages should use a narrower text measure than the homepage artwork.

The exact header height, hero copy, section order, and navigation labels remain subject to the content plan.

## 6. Pixel field: reproducible drawing recipe

### Rendering model

Use a Canvas 2D grid for the first implementation. One canvas is sufficient for this effect; a 3D scene or shader library is not required. Draw flat square cells with no blur, rounded corners, glow, or per-cell shadows.

Configuration from the current unverified prototype in `src/components/PixelField.tsx`:

```ts
const config = {
  cells: { S: 6, M: 10, L: 16 }, // CSS pixel pitch
  defaultCell: 'M',
  gutter: 1,                     // CSS pixels between cells
  dprCap: 2,
  frameIntervalMs: 48,           // upper target about 21 draws/sec
  maxDeltaMs: 100,
  timeScale: 0.00013,
  pointerRadius: 150,            // CSS pixels
  pointerStrength: 0.35,
  seed: 0,
  palette: [
    '#161E34', '#3049D9', '#536BFA',
    '#F6CE25', '#F6CE25', '#FA593E', '#D8EE40',
  ],
}
```

The repeated yellow entry deliberately makes that band wider. Values are tunable starting points, not approved final settings.

### Deterministic noise

Use the fractional part of a sine hash to assign a repeatable value to each integer lattice point:

```text
fract(v) = v - floor(v)
hash(x, y, seed) = fract(sin(x*127.1 + y*311.7 + seed*53.9)*43758.5453)
```

To evaluate `noise(x,y)`, take the four hashes around the containing integer lattice square. Interpolate horizontally and then vertically with the smooth interpolation weight `f*f*(3-2*f)`, where `f` is the fractional coordinate on that axis. This produces continuous value noise. Keep the same seed for every sample in a frame and across frames.

Do not generate independent random values every frame. That creates flicker rather than coherent motion.

### Field calculation

For each cell origin `(x,y)` measured in CSS pixels:

```text
nx = x / canvasCssWidth
ny = y / canvasCssHeight
t = activeElapsedMilliseconds * 0.00013

wave = sin(nx*7.5 + t)*0.13
     + sin(nx*15 - t*0.8)*0.05

grain = noise(nx*11 + t, ny*7)*0.22
      + noise(nx*37, ny*23 + t)*0.09

distance = hypot(x-pointerX, y-pointerY)
pointerInfluence = max(0, 1-distance/150)*0.35

field = 0.57 + wave + grain - ny + pointerInfluence
```

Draw an empty cell when `field < 0.035`, or when both `field < 0.1` and `hash(x,y,seed) > field*9`. This creates a broken lower edge rather than a perfectly smooth boundary.

Otherwise select a discrete color:

```text
index = clamp(floor((field + noise(nx*6-t, ny*6)*0.22)*8), 0, 6)
color = palette[index]
```

Fill each cell at `(x,y)` with dimensions `(cellPitch-1, cellPitch-1)`. Clear the whole canvas to white before drawing. Empty cells can use `--cell-empty`, or white if the background grid becomes too prominent.

### Composition target and adjustment

The recipe above is a starting field, not a visually accepted recreation. Tune it against the reference after the content plan is approved.

- Maintain broad, connected blue and yellow regions. Avoid a uniform confetti pattern.
- Break the lower boundary into scattered pixels that transition into white space.
- Preserve irregular shapes across the width; avoid a single straight rainbow stripe.
- If lime dominates, reduce the top-end field values or raise the threshold for the last palette entry.
- If bands look too horizontal, introduce a small `nx` slope or a second low-frequency warp before increasing high-frequency noise.
- If edges look noisy, lower the fine-noise amplitude before changing cell size.
- If the artwork dominates the first screen, reduce its height before shrinking the identity text.

Review a fixed seed and paused frame when comparing changes. Do not judge two iterations using different random seeds or animation times.

## 7. Animation and interaction

October 4 prototype revision: Anh requested continuous animation with cursor interaction and **no pause button**. This supersedes the proposed pause/play control below. Latest correction: the colored pixel brush follows the cursor across the whole page, including outside the main artwork, while retaining the normal pointer. This replaces the local pixel-displacement experiment; remaining control ideas are historical proposals, not requirements.

- Advance time only during active animation. Use `requestAnimationFrame` with a draw-rate cap.
- Start with slow, continuous contour movement. No flashing, strobing, rapid palette cycling, or scroll hijacking.
- Pointer movement locally displaces the field using the formula above. On pointer exit, clear the influence. Smoothing the influence in and out is a proposed refinement.
- The canvas must not capture touch gestures or prevent vertical scrolling.
- Provide pause/play, cell-size selection, and an optional regenerate control. These are proposed portfolio controls, not a claim that all exist on the reference.
- A new seed changes composition. Changing cell size changes resolution while preserving the general field.
- When paused, freeze animation and pointer-driven drawing. Explicit cell-size or regenerate actions may redraw the static frame.
- Honor `prefers-reduced-motion` with a static initial frame. An explicit play action may enable motion for that visit.
- Stop animation when the canvas is outside the viewport or the document is hidden. Resume without a large time jump.
- Keep content readable immediately. Do not fade the whole page from invisible or gate navigation behind a loading animation.
- Use brief 120–200ms transitions for link and button feedback. Keep them subtle and remove unnecessary transitions under reduced motion.

## 8. Responsive behavior, accessibility, and fallback

- Render the field at its CSS size multiplied by `min(devicePixelRatio, 2)`, then scale the context so the drawing algorithm still uses CSS pixels.
- Recompute the canvas backing dimensions through `ResizeObserver`. This avoids stretching or blurring a stale bitmap.
- Keep controls in the document flow. Wrap the toolbar on narrow screens.
- Use real buttons with accessible names, visible focus, and a selected state such as `aria-pressed` for cell-size choices.
- Provide touch targets at least 44px square where practical, even if the icon itself is small.
- Hide decorative canvas content from assistive technology; keep its description and controls accessible in HTML.
- All routes, contact links, and projects must work without the canvas.
- If the canvas context is unavailable or JavaScript is disabled, show a locally generated static poster or a CSS grid fallback. Generate the poster from original artwork, not a screenshot of wild's site.
- Check 320, 390, 768, 1024, and 1440px widths. The page must not overflow horizontally or require hover to reveal essential information.
- Do not infer accessibility compliance or performance from a successful build. Verify these in the finished browser implementation.

## 9. Project and reading-page treatment

Use the same white background, typography, gutter alignment, and thin rules throughout.

Project previews:

- Real project screenshot or an explicitly labeled illustration.
- Project name, one-sentence purpose, contribution, and a link to the full story.
- Optional year and a compact technology summary.
- A simple arrow and image movement on hover/focus; no information hidden behind hover.
- Preserve image aspect ratio. Do not stretch screenshots to match a layout.

Project details:

- The problem and who needed it solved.
- Anh's role, collaborators where relevant, and project status.
- Technical constraints and important decisions.
- Implementation evidence such as screenshots, diagrams, or allowed code.
- Results with enough context to assess them, plus limitations.
- Only verified and shareable repository/demo links. The existing `github.com/example/...` and demo addresses are placeholders, not publication-ready links.

An image viewer should support keyboard operation, Escape, focus containment, a labeled close control, and focus return to its trigger.

## 10. Content direction and requirements

The section direction has been accepted for continued planning. Detailed requirements and clarification answers are maintained in [docs/portfolio-requirements.md](docs/portfolio-requirements.md). This is not approval to resume website implementation or publish draft wording.

| Order | Section | What it should answer | Content to prepare |
| --- | --- | --- | --- |
| 1 | Introduction + pixel field | Who is Anh, and what does he build? | Name; one positioning sentence; short supporting sentence; Work and résumé links |
| 2 | Selected work | What has he actually built? | Two or three strongest projects; concise purpose; contribution; image; case-study link |
| 3 | My interests | What problems does he love working on? | Personal problem interests, with prominent tools in a marquee emerging from pixels at both sides |
| 4 | Journey | What experiences shaped him? | Brief story and preview of the pixel world map; deeper chapters in About |
| 5 | Current rabbit hole | What is he actively trying to understand? | Cursor pstack; motivating question, progress, and related Writing |
| 6 | Contact | How can someone start a conversation? | Email; verified GitHub/LinkedIn; current opportunity or collaboration interests |

Established navigation behavior: primary navigation scrolls to homepage sections. Proposed labels remain Work, About, Writing, Contact, with a résumé link. Proposed targets are selected work, journey, current rabbit hole/related writing, and contact respectively; the exact mapping remains open. From detail pages, return to the corresponding homepage anchor. Writing is also a collection linked from the rabbit-hole section; an additional standalone homepage section is not required. A smaller Workbench area may distinguish active tools and experiments from selected case studies.

Keep the homepage concise and let case studies carry technical depth. Do not add a generic process section solely to imitate an agency site. If a working approach matters, demonstrate it through a real project decision or build note.

Existing content candidates, not yet confirmed current:

Update from the October 4 clarification: target roles are **Software Engineer** and **AI Engineer**. Anh identified existing page content and the supplied `newGradSWE (2).pdf` as biography/content sources. The résumé adds education, experience, technologies, Doc2Contract, and a personal study-room booking tool. Use the inventory and specific discrepancies in section 16 of `docs/portfolio-requirements.md` before repeating questions already answered by those sources. The older candidate list below is historical input, not a substitute for that inventory.

- AI-powered Syllabus Extractor: NLP and PDF extraction.
- PanAIcount: accounting and business insights for SMEs.
- Backend systems, NLP, AI/LLMs, and agents as potential positioning topics.
- The résumé supports Computer Science student at the University of Kansas, with a Business minor and expected graduation May 2027. Lead positioning should support the confirmed Software Engineer / AI Engineer target roles.
- Existing project content contains numerical outcomes and an NDA statement. Confirm the evidence, individual contribution, and disclosure boundaries before final copy.
- Current explorations, writing, school details, employment history, and dates need input rather than invented filler.

Earlier discussion prompts (resolved where noted):

1. Target positioning is resolved: Software Engineer and AI Engineer. Final headline wording remains open.
2. Which projects should lead, including any newer work missing from this repository?
3. Which current experiments and writing are ready to share, and how should they be maintained?
4. Audience is resolved: recruiters first, while preserving the feeling of meeting Anh.

## 11. Recreation and review sequence

1. Agree on the audience, section order, project selection, and factual content.
2. Review a static desktop/mobile layout with real text and a fixed pixel-field frame.
3. Confirm typography, palette distribution, whitespace, and image treatment.
4. Implement and review the motion, controls, and responsive behavior.
5. Check navigation, direct project links, keyboard access, reduced motion, fallbacks, and image loading.
6. Review production build and actual browser screenshots before considering deployment.

Visual checks should include the entire first screen, the artwork-to-content transition, a project preview, a reading page, and the contact section. Look for balanced color bands, crisp cells, legible typography, consistent rules, and good mobile line wrapping.

## 12. Implementation state at the time of this document

The assistant made preliminary edits to the homepage, shared navigation/footer, about/contact/project pages, project data, and an original `PixelField.tsx` before the user requested confirmation first. Work then stopped.

Those edits are incomplete and unverified. The new layout classes do not yet have their full stylesheet. The pixel field has not passed visual or performance review, and a no-canvas poster fallback has not been delivered. Do not interpret the current working tree as an accepted design or a finished site.

This request authorizes saving the art specification and planning sections/content. It does not authorize resuming implementation, reverting prior edits, committing, or deploying. Obtain the user's confirmation before those next actions.

## 13. Interests revision, October 4, 2026

Anh replaced Capabilities with "Problems I love to work on." Each interest has a heading with its description below on the left, and a prominent tool marquee on the right, with alternating directions and mouse-wheel control on hover. At 900px and below, the marquee stacks beneath the text. The supplied gooey example informs the idea of text emerging at the edges; the implementation uses sharp 8px cells and opaque palette colors. No blur, gooey filters, gradients, or stock imagery are added. See section 7 of the requirements for current behavior and content.
