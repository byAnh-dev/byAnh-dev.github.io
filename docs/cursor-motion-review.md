# Cursor motion review, October 4, 2026

## Completion contract

The brush must draw a connected stroke through rapid pointer movements and scrolling, with a narrower stroke at higher speed. It must preserve the white cutout on colored cells, color on whitespace, and reduced-motion behavior.

- ORACLE_SOURCE: Anh's requested continuity and speed-dependent width; live observation of https://craft.wild.as/ for connected strokes and tapering decay.
- REAL_COMPONENTS: prototype DOM event handlers, animation frames, scrolling, and rendered Canvas 2D pixels.
- ALLOWED_MOCKS: none. Verification may synthesize pointer inputs into the real handlers.
- NEGATIVE_CONTROL: the pre-change prototype must fail scroll continuity and fast-versus-slow width checks.
- REQUIRED_EVIDENCE_GRADE: LIVE_VERIFIED for these bounded behavior checks, not a claim of identical reference motion.

## Plan and ownership

1. Root observes the reference. A separate read-only worker diagnoses the prototype.
2. Root owns the cursor implementation. The worker writes independent requirement-based checks without inspecting the changes.
3. Root runs those checks on the unchanged, already-loaded prototype and the new version, then visually reviews the new stroke.

No release or merge gate applies to this local prototype request. Native touch hardware testing is unavailable in the current browser tool.

## Reference findings

Slow movement produces a fuller head. A fast swipe produces a connected band with a narrowing, fading tail. During scrolling the brush stays at the pointer rather than leaving detached circles down the document.

The reference's current inline implementation interpolates positions along each movement segment and accumulates a soft influence in the pixel grid. That influence decays, so lower-intensity edge cells disappear first. Its nominal brush size is fixed within a section, with a smaller brush below the hero. It does not explicitly map pointer speed to brush radius. The requested fast-to-thin mapping is an intentional addition in this prototype.

## Prototype diagnosis

Before this change, the scroll handler reset the previous position on every event. That prevented interpolation over the scroll displacement. Pointer motion already interpolated positions, but event handlers and animation frames both stamped and repainted the canvas. The radius was always 48 px.

The change retains path history during scrolling, queues timestamped pointer and scroll samples, and paints once per animation frame. It preserves coalesced input samples for curves. Brush radius varies smoothly from 48 px toward 16 px with speed, and position and radius are interpolated together. After movement stops, the head expands gradually instead of changing size between input events.

Baseline script SHA-256: `AE3E9836782768029DE51EF76A263B3E1C888B19A224B75726EA0021A1878352`.

## Evidence ledger

- REVISION: cursor script SHA-256 `6E0492736EA2CB517FFE156C268AA6272A2E87CB9623F8523B88528B20F3EECE`.
- EVIDENCE_GRADE: LIVE_VERIFIED for the bounded motion checks below.
- CHECKS_RUN: independent `cursor-motion-oracle.js` against the baseline still loaded in a browser tab and the updated page at 1280 x 720. JavaScript syntax and targeted ESLint passed.
- REAL_COMPONENTS_EXECUTED: actual DOM pointer handlers, scrolling, animation frames, and canvas rendering. Browser warnings/errors were empty.
- MOCKS_AND_LOST_COVERAGE: no rendering mocks. Inputs were synthetic pointer events and real browser scrolling; physical mouse hardware and native touch gestures were not measured.
- NEGATIVE_CONTROL_RESULT: baseline scroll had 11 empty grid bins and an 88 px gap. Its fast/slow width ratio was 0.991, correctly failing the thinner-fast requirement.
- CANDIDATE_RESULT: no empty bins in the fast stroke or 180 px scroll bridge. Slow stroke alpha cross-section was 76.07 px; fast stroke was 42 px, a ratio of 0.552. These are rendered-pixel measurements at the check's opacity threshold, not nominal brush diameters.
- REGRESSION_CHECKS: reduced-motion brush left zero alpha at the previous position, and the colored-field cutout sampled pure white.
- CONTRADICTORY_EVIDENCE: reference source does not explicitly narrow its nominal radius with velocity. The speed-dependent radius here follows Anh's requested behavior rather than claiming an exact copy.
- RESIDUAL_RISKS: visual timing depends on frame rate and input device. The bounded tests do not certify every possible gesture or prove identical reference motion.
- VERDICT: PASS.

Raw measurements: [cursor-motion-results.json](cursor-motion-results.json). The oracle's reporting label was clarified after execution; its scenarios, thresholds, and measurements were unchanged.
