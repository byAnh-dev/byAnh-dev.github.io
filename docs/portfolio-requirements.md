# Anh Hoang portfolio requirements

Updated: October 4, 2026

Status: living requirements draft; clarification interview in progress. The user requested this document now. It records established direction without treating unresolved assumptions as final requirements or approval to implement.

## 1. Purpose

A visitor should understand Anh and form a memorable impression through one continuous pass down the homepage. Each section provides a brief introduction to one aspect of him, with optional deeper exploration.

"One scroll" means a coherent scrolling journey through the homepage, not fitting the entire portfolio into one viewport or one wheel gesture.

The primary audience is recruiters. The experience should feel like meeting Anh rather than reading his résumé. The intended impression is high agency, AI native, and capable of solving hard problems. Projects and writing should provide evidence for those traits.

## 2. Source of truth and decision status

- Current user instructions and interview answers govern the requirements.
- [pixel-style.md](../pixel-style.md) records the reference, art direction, and proposed recreation settings.
- Visual reference: [craft.wild.as](https://craft.wild.as/).
- The earlier paper-workshop document and Blender assets are historical context, not the current design brief.
- Anh explicitly identified the existing page content as a source for most personal information and supplied `C:\Users\Anh\Downloads\newGradSWE (2).pdf` as an additional source. Use both before asking for information already provided. Current answers take precedence; surface specific conflicts between sources rather than asking Anh to repeat his biography.
- Résumé claims are user-supplied content, not independently verified measurements. Placeholder links in the repository remain unsuitable for publication. See section 16 for the content inventory and discrepancies.

Status labels:

- **Established:** directly requested by the user or part of the section direction they accepted.
- **Proposed:** a concrete recommendation still open to refinement during the interview.
- **Open:** information or a decision still needed.

The user accepted the overall section direction and asked to rename Notes to Writing. That acceptance does not settle every interaction, content detail, route, or technology choice in this draft.

## 3. Established direction

| ID | Requirement |
| --- | --- |
| DIR-01 | Use a scrolling homepage with concise sections that collectively introduce Anh. |
| DIR-02 | Follow the selected pixel/editorial visual direction. |
| DIR-03 | Introduce identity and basic information near the top. A portrait is a candidate, not a supplied asset. |
| DIR-04 | Present selected work briefly on the homepage and offer deeper technical write-ups. |
| DIR-05 | Present the problems Anh loves working on, with prominent tools in a pixel marquee. This replaces Capabilities. |
| DIR-06 | Summarize Anh's journey on the homepage and provide a deeper interactive experience. |
| DIR-07 | Include a current rabbit-hole section about a topic Anh is actively learning or writing about. |
| DIR-08 | Record the current topic as "Cursor pstack," using the user's correction. Anh will write and publish its content himself through the owner editor; a source link is not a required planning input. |
| DIR-09 | End the homepage with contact information. |
| DIR-10 | Use "Writing" as the navigation/collection label, replacing "Notes." Individual articles may still be build notes or technical notes. |
| DIR-11 | Continue planning and clarification before further website implementation. |
| DIR-12 | Position Anh for Software Engineer and AI Engineer roles. |
| DIR-13 | Primary navigation scrolls to homepage sections. Separate detail pages remain available through content links. |

## 4. Homepage narrative

Working sequence: identity, evidence, interests, personal journey, current curiosity, contact.

| Order | Section | Visitor takeaway | Homepage content | Deeper destination |
| --- | --- | --- | --- | --- |
| 1 | Introduction | Who Anh is and what motivates his work | Name, specific positioning, basic context, optional portrait, pixel field | Work; About; résumé |
| 2 | Selected work | What he builds and what his contribution looks like | Two or three strong project previews; optional small workbench preview | Project case studies; full work collection |
| 3 | My interests | Which problems draw his attention | Problems he loves working on, followed by prominent tool names moving through pixelated edges | Relevant projects |
| 4 | Journey | What places and experiences shaped him | Short narrative and route preview | Interactive journey within About |
| 5 | Current rabbit hole | What he is actively trying to understand | Current topic, motivating question, brief progress, related writing | Writing or a topic page |
| 6 | Contact | How and why to reach him | Short invitation, email, relevant professional links | Direct contact channels |

Established navigation behavior: scroll to homepage sections. Proposed labels remain Work, About, Writing, Contact, with a résumé link where appropriate. Proposed mapping: Work → selected work; About → journey; Writing → current rabbit hole and related writing; Contact → contact. From detail pages, these links should return to the corresponding homepage anchor. Exact labels, anchor mapping, and sticky positioning remain proposals.

Writing is a full collection reachable through a link in the rabbit-hole section; primary navigation scrolls to that section under the proposed mapping above. A separate homepage Writing section is not required by the accepted six-section sequence; decide whether article previews add enough value before adding another section.

## 5. Introduction requirements

Established:

- Convey Anh's identity early, rather than requiring several sections to understand what he does.
- Make a strong visual first impression consistent with the reference.

Proposed:

- Merge basic information into the introduction instead of repeating it in a separate biography block.
- Prefer specific language about building over a generic list such as "design, craft, code."
- Keep the face recognizable if a portrait is used. Pixel treatment can surround the image or briefly reveal it.
- Keep critical identity text readable without waiting for animation.

Draft copy for discussion, not approved final copy:

October 4 prototype revision: Anh rejected the large “I build the tools I wish I had” headline. Place the pixel animation in that position and remove the “Explore my work” CTA; ordinary scrolling should reveal selected work. Use “Hi, I’m Anh” as the identity heading.

Updated draft copy following Anh’s suggested tone:

> I build automated solutions for all the problems I’ve had in my life, and I chase questions that ruin my sleep.

Latest introduction revision: remove the “ANH HOANG / SOFTWARE & APPLIED AI” label above the artwork.

Established target roles: Software Engineer and AI Engineer. The supplied résumé identifies Anh as a University of Kansas Computer Science student with a Business minor, expected graduation May 2027, and a Software Engineer Intern at Pinnacle Technology during May–December 2026. December is a future end date as of this document; do not describe that internship as already completed.

Open: portrait choice, personal details to disclose beyond the supplied content, and final headline. Audience and intended impression are established in section 1; the role titles describe target positioning, not a replacement for accurate employment titles.

## 6. Work, side projects, and technical depth

Established: Anh has multiple ongoing side projects and builds tools for his own use. The site needs room for that practice as well as polished work.

Proposed organization:

| Collection | Purpose | Appropriate detail |
| --- | --- | --- |
| Selected work | A curated set demonstrating ability and judgment | Full case studies |
| Workbench | Personal tools, prototypes, and ongoing experiments | Short descriptions, current status, build logs, screenshots, and available links |

Use one underlying project collection with featured and status fields. Do not duplicate records just because a project appears in multiple views. A project may be both active and featured.

Homepage previews should include title, purpose, contribution, image, and a clear detail link. The workbench preview should be smaller so visitors are not faced with two indistinguishable project grids.

Case-study structure:

1. Problem and intended users.
2. Anh's role and collaborators where relevant.
3. Constraints and goals.
4. Decisions, alternatives, and implementation.
5. Evidence and results.
6. Limitations, lessons, and current status.
7. Verified public links, where sharing is allowed.

Featured-work direction: Anh's current project at Pinnacle Tech, including a watchdog and a layer of experimental dashboards. Anh states that experiments previously could not recover after a device disconnected; the watchdog now enables recovery. Anh also states that the code is open source. Obtain the actual repository URL and use its public scope when preparing the case study; do not invent implementation details or performance metrics.

Additional content candidates from the page and résumé: DueGooder's AI-powered Syllabus Extractor, PanAIAccount (called PanAIcount on the existing site), Monarch Watch's OCR/data collection platform, Doc2Contract, and the automated midnight study-room booking tool. The résumé supplies descriptions and outcome claims; final selection, screenshots, public project links, and any disclosure limits remain open. Do not publish placeholder repository or demo addresses.

Open: project selection, current projects missing from the repo, individual contributions, evidence supporting outcomes, public/private boundaries, and whether "Workbench" is the preferred label.

## 7. My interests and tools

October 4 revision: Anh requested replacing Capabilities with an interests section titled "Problems I love to work on." This supersedes the earlier capability groups and résumé-style examples.

Latest user grouping: high-ownership products and features, agentic workflows, and automating repetitive workflows. Each interest has its heading and description together in the left column, with its tool marquee in the right column. At 900px and below, the marquee stacks beneath the text. This placement follows the October 4 browser annotations and supersedes the earlier full-width rows. The first contains full-stack engineering tools, the second AI tools, and the third workflow tools including the user-supplied n8n, Hermes Agent, and Grokbot names. Descriptions remain editorial drafts; listing an interest or tool does not establish professional experience with it.

Anh requested more prominent tools in a running marquee that emerges from pixels at both sides. The supplied GooeyMarquee React example is inspiration for the edge transition, not a request to copy its blur or visual style. Preserve Malinton, white space, thin rules, crisp square cells, and the existing solid palette.

The local prototype uses three independent rows, one per interest, with alternating directions. Tool glyphs become colored 8px cells at either edge and stay clear in the center. Hovering or keyboard focus pauses that row. Mouse-wheel and trackpad input over the line scroll its tools; arrow keys move through the same row. Leaving the line resumes automatic motion unless it remains focused or explicitly paused. Keep ordinary page scrolling outside the line and browser zoom shortcuts. Each row has a pause control, stops when offscreen or hidden, and shows a wrapping HTML tool list for reduced motion or unavailable JavaScript/canvas. Keep those lists available to assistive technology during animation.

## 8. Journey experience

Established route supplied by Anh:

Vietnam → United States → Hong Kong → Japan → United States → What's next

The user wants a pixel world map, an animated route between locations, and selectable places revealing photographs. The homepage should offer a brief introduction and a way to see more, likely within About. The user explicitly requires this experience for the first launch.

Proposed behavior:

- Present a route overview and an optional "Play my journey" control.
- Allow direct selection of any stop without completing the animation.
- Distinguish repeated locations as separate chapters, including both U.S. stops.
- Pair the map with a numbered timeline. On mobile, prioritize the readable timeline and chapter content.
- Each chapter contains place, date or period, reason for being there, a personal story, and a small captioned gallery.
- Treat "What's next" as an open chapter, not a fabricated future destination.
- Keep controls keyboard-accessible and provide the same narrative without animation.

Open: cities or regions, chronology and dates, why each place matters, photo selection, privacy preferences, initial animation behavior, and whether the map is embedded in About or gets a dedicated route.

Do not infer that a stop represents residence, education, employment, or tourism until Anh supplies that context.

## 9. Current rabbit hole and Writing

Established: the section describes an actual topic Anh is learning or writing about. The current topic is Cursor pstack. The visual idea combines falling pixels with rolling or slot-like topic text.

Proposed behavior:

- Use a brief falling-pixel introduction followed by a short rolling reveal of the selected topic.
- Resolve to one intentionally chosen current topic; do not choose a random interest on each visit.
- Reveal once per visit or page entry rather than continuously restarting while the visitor reads.
- Show a question, current progress, and related writing after the reveal.
- Preserve old topics and their writing in an archive when the current topic changes.
- Keep ordinary scrolling available throughout. Reduced-motion mode shows the final text immediately.

Writing should focus on Anh's current AI usage. It may take the form of practical explanations, experiments, and build logs demonstrating how he works with AI. Other categories are not assumed necessary for launch.

Proposed content fields: title, slug, summary, publication date, updated date if useful, topic, draft/published status, body, related projects, and images with alt text.

Established authorship: Anh will write and publish the Cursor pstack content himself through the owner editor. Its framing and any supporting links belong to his future article; do not require a source link or draft as a prerequisite for planning the site, and do not invent article copy. Update frequency is owner-controlled rather than a launch requirement.

Proposed unpublished state: keep the rabbit-hole/Writing area ready for owner-authored content, using a brief neutral empty state until content is published. Do not create a public article link or imply that an article is available while it remains unwritten or in draft.

### Owner editor

Established through the interview:

- Provide a private owner login entry, omitted from public navigation. `/admin` is the proposed route.
- Require real authentication and authorization. An unlisted URL alone does not protect administrative actions.
- Anh can add and edit text and images, save drafts, preview, and publish without changing website code.
- The editor covers Writing, projects, journey chapters/photos, and the current rabbit hole.
- Draft content must stay out of public collections and pages until published.

Additional editor scope: Anh indicated that only the résumé file matters among the proposed additions. Plan for replacing the downloadable résumé through the owner editor. Introduction text, capabilities, and contact-link editing are not required for now. This does not remove the already established editing of Writing, projects, journey chapters/photos, and the current rabbit hole; the tentative wording leaves these additional fields open to later reconsideration.

Agreed content stack: Payload CMS with its authentication and owner editor, SQLite for content, and a persistent local uploads directory, hosted with Next.js on Anh's Oracle Cloud Ubuntu Ampere machine. PostgreSQL, Neon, Vercel hosting, and Vercel Blob are no longer the proposed deployment stack. Remaining deployment decisions include process/container management, reverse-proxy integration, backups, account setup, and preview configuration. Replace the existing static-export configuration during authorized implementation so the application can support authenticated editing and preview.

## 10. Contact

Established: contact closes the homepage.

Proposed: a specific invitation, email, GitHub, LinkedIn, and résumé. A form is unnecessary unless Anh prefers one. Do not build a backend solely for a contact form without a concrete need.

The page and supplied résumé agree on email `hpa2309@gmail.com`, GitHub `https://github.com/byAnh-dev`, and LinkedIn `https://www.linkedin.com/in/anh-hoang-ku/`. Use these as supplied contact channels; external link functionality has not been checked in this documentation pass. Proposed invitation: Software Engineer / AI Engineer opportunities, with collaboration and technical conversation as secondary options. Phone publication is not established merely because a number appears in the résumé.

## 11. Proposed information architecture

| Route | Content |
| --- | --- |
| `/` | Six-section homepage overview |
| `/projects/` | Selected work and workbench collection |
| `/projects/[slug]/` | Case study or lighter project record |
| `/about/` | Biography and journey experience |
| `/writing/` | Writing collection and topic discovery |
| `/writing/[slug]/` | Article |
| `/contact/` | Direct contact destination, if retaining the existing route is useful |

These routes are proposals. Preserve existing working project URLs where possible. Do not introduce a separate rabbit-hole route unless its content needs more than a Writing topic view.

Primary navigation uses homepage section anchors. Collection and detail routes are deeper destinations reached from section content, and do not override the confirmed scrolling navigation behavior.

## 12. Art, motion, and usability

Follow the visual configuration in [pixel-style.md](../pixel-style.md).

Proposed requirements:

- Concentrate larger motion in the introduction, journey, and rabbit-hole reveal. Keep intervening text and work sections visually quieter.
- No scroll locking, compulsory animation sequence, or hover-only access to essential content.
- Critical copy and links remain available if decorative graphics fail.
- Support reduced motion, keyboard navigation, visible focus, and touch input.
- Make the portrait, screenshots, and travel photos serve the story rather than filling generic cards.
- Review narrow and wide layouts with real content, including 320px mobile width.
- Defer heavier map/gallery assets until needed, and stop animation when offscreen or in a hidden tab.
- The approach must work with the current Next.js project; rendering and publishing changes remain design decisions, not approved infrastructure work.

## 13. Proposed acceptance criteria

| ID | Observable outcome |
| --- | --- |
| ACC-01 | A visitor completing the homepage can describe Anh's focus, name one project, and find contact information. |
| ACC-02 | The first screen identifies Anh and gives a concrete reason to explore his work. |
| ACC-03 | Project previews link to meaningful detail pages; no placeholder links are published. |
| ACC-04 | The journey supports direct selection of every chapter, including repeated locations, without mandatory playback. |
| ACC-05 | Each published journey chapter has user-approved facts and images. |
| ACC-06 | The rabbit-hole animation resolves to the selected current topic and provides useful content afterward. |
| ACC-07 | Writing is labeled consistently and only published records appear publicly. |
| ACC-08 | Mobile, keyboard, reduced-motion, and graphics-failure paths preserve access to essential content. |
| ACC-09 | Updating projects, journey chapters, or the current topic does not require modifying animation logic. |

Additional established quality requirements: apply the pixel design guideline from the first implementation; target a polished result at launch. The user rejected a proposal to lower animation/design ambition simply to fit the deadline.

These are acceptance targets, not completed tests. Verify the finished visual output against the art guideline as well as functional behavior, including secure owner editing, draft preview, image upload, and publication.

## 14. Boundaries and current state

Authorized now: create and maintain this requirements document, refine the art document to reflect planning decisions, and interview Anh one question at a time.

Website implementation, rollback of earlier edits, commits, and deployment require subsequent user confirmation. The earlier incomplete code changes remain untouched by this documentation task.

Proposed exclusions from this redesign: the old 3D workshop, a compulsory game experience, invented biographical content, and a backend/CMS chosen before understanding the publishing needs.

## 15. Clarification interview

Method: the user explicitly requested the interview-me skill. Ask one focused question at a time, attach a best guess, then update this document as answers arrive. Do not treat a provisional hypothesis as a confirmed requirement.

Interview findings:

1. Audience: recruiters first, while preserving the feeling of meeting Anh.
2. Intended impression: high agency, AI native, solving hard problems.
3. Featured evidence: Pinnacle Tech watchdog and experimental dashboards; watchdog recovery after device disconnection; code described by Anh as open source.
4. Writing: current AI usage.
5. Authoring: secure private owner editor for text, images, drafts, preview, and publication, covering all major content collections.
6. Launch scope: the interactive pixel journey map belongs in the first launch.
7. Target date: today, October 4, 2026, in America/Chicago. This is a requested target, not a verified delivery estimate.
8. Quality: use the design guideline immediately and deliver high quality. Do not silently substitute a simplified visual design to meet the date.
9. Interview pacing: Anh asked to focus on site-level decisions rather than drilling into case-study implementation details at this stage.
10. Content sources: use existing page content for most personal information and the supplied `newGradSWE (2).pdf` for additional facts before asking for missing information.
11. Target roles: Software Engineer and AI Engineer.
12. Navigation: scroll to homepage sections; precise label-to-section mapping is still proposed.
13. Additional editor fields: prioritize résumé-file replacement; introduction, capabilities, and contact-link editing are not required for now. Existing content-collection editing remains in scope.
14. Cursor pstack: Anh will write and publish the content himself. No source link or article draft is required from him during this planning interview; support later publication through the editor.
13. Hosting and content stack: the user accepted Next.js + Payload CMS + SQLite and persistent local image storage on the existing Oracle Cloud Ubuntu Ampere server. Prefer this simple single-server setup over adding a separate database service.

Current confidence in product intent: approximately 95%. A concise final restatement is ready for confirmation. Content readiness and technical feasibility remain production questions, not reasons to keep interviewing about the established direction.

Remaining production inputs include the portrait, journey photos and captions, public project repository URLs, resolution of specific source discrepancies, hosting access, and editor infrastructure. Initial Writing content will be authored and published by Anh and is not a prerequisite for building the site; use the proposed unpublished state until it is available. The résumé and matching primary contact channels have now been supplied. The public résumé asset has not been compared or replaced. Report concrete blockers when identified; do not claim they are ready or guarantee same-day completion before checking them.

Final intent confirmation: pending. Website implementation remains paused under the user's earlier instruction to confirm before proceeding.

## 16. Supplied content inventory

Reviewed October 4, 2026: existing homepage, About, Contact, project data, and shared contact/footer content, plus all of the one-page résumé at `C:\Users\Anh\Downloads\newGradSWE (2).pdf`. This section records source material for future copy; it does not approve every item for homepage inclusion or authorize publication.

### Biography and experience

- Education: University of Kansas, BSc Computer Science with Business minor, May 2027; University of Hong Kong exchange semester in Applied AI. The résumé lists GPA 3.8/4.0, but its attribution should be clarified only if used in public copy.
- Pinnacle Technology: Software Engineer Intern, Lawrence, Kansas, May–December 2026. Morelia experiment dashboard, device control and failure recovery, high-rate visualization, parallel device discovery, and acquisition reliability. The résumé heading spells the employer “Pinnancle Technology”; earlier discussion and its own body use “Pinnacle.” Confirm exact public naming when preparing the case study.
- Monarch Watch: Solution Engineer Intern, Lawrence, Kansas, January–May 2026. Web data collection and Google Cloud Vision OCR for butterfly measurement records. Reported outcomes include 80% less processing time and an estimated 53+ hours saved across 400+ pages.
- DueGooder: Software Engineer Intern (AI Systems), remote, May–August 2025. Syllabus-to-JSON extraction with LLMs, spaCy, and regex; containerized FastAPI endpoint and open-source model benchmarking. Reported outcomes include 90% accuracy, 4.5× pipeline speed, and 30% lower token usage.
- PanAIAccount: Founding Engineer, remote, December 2024–December 2025. React, Flask, MongoDB Atlas, and AWS EC2 financial dashboard; asynchronous analytics and cached aggregates; Recharts visualizations. Reported dashboard load time changed from 3 seconds to 1 second.
- Leadership: résumé lists ChatGPT Lab Member at OpenAI, January 2026–Present, describing a 50-person cohort and a six-week program. It also lists Google Dev Club presidency, Break Through Tech at Cornell Tech, Kode with Klossy, and KU AI Club affiliations. Preserve the distinction between the listed membership period and the six-week program.
- Personal interests from existing About content: hiking, travel, gym, League of Legends, Valorant, and Don't Starve Together.

### Additional project candidates

- Doc2Contract: résumé reports first prize at the VPBank & AWS Hackathon. Vietnamese document OCR and banking contract generation using S3, Lambda, and Bedrock correction; reported processing under two minutes and 98% field-level extraction accuracy.
- Automated midnight study-room booking: Playwright and GitHub Actions workflow with timezone-aware scheduling, secret-managed credentials, retries, and failure signals. Candidate for the Workbench and evidence of building tools for personal use.

### Technology inventory from the résumé

- Languages: Python, Java, JavaScript, SQL, C/C++.
- Frameworks: LangChain, React, Django, Flask, FastAPI, Node.js.
- Tools/infrastructure: Git/GitHub, Docker, GitHub Actions, webhooks, AWS Lambda/EC2/S3, GCP.
- AI/data: prompt engineering, RAG, LLM APIs, spaCy, PyTorch, scikit-learn, Pandas, NumPy.

### Specific reconciliation work

- Existing project data uses “PanAIcount,” an ongoing status, Chart.js, and a query-speed claim; the résumé uses “PanAIAccount,” an employment end date of December 2025, Recharts, and dashboard-load/session-duration claims. Do not assume employment end date proves project completion or combine these metrics as equivalent measurements. Resolve only the facts needed for the chosen presentation.
- The existing Syllabus Extractor entry gives a generic project title; the résumé identifies the DueGooder internship context. Preserve employer, role, and individual contribution when adapting it into a case study.
- Existing project repository links use `github.com/example/...` and remain placeholders. The résumé provides a personal GitHub profile, not the individual project repositories.
- Existing `/resume.pdf` has not been established as identical to the supplied résumé. Updating the public asset belongs to later implementation/publication work.
- The supplied sources do not fill in the full journey chronology, photographs, or owner-editor infrastructure. Cursor pstack framing and initial Writing articles are intentionally left to Anh's later authoring and publication, rather than treated as missing interview inputs.
