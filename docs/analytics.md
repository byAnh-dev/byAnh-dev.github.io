# Portfolio analytics

PostHog tracks visits and explicit interactions. Vercel Speed Insights measures loading and responsiveness. Both are included only when Vercel builds with `VERCEL_ENV=production`; local development and preview builds omit them.

## Deploy on Vercel

1. In the Vercel project's **Settings → Environment Variables**, add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` for **Production**. Copy the values from your local `.env`. The token is the browser-safe PostHog project token (`phc_…`), not a personal API key.
2. Keep the Next.js framework preset and default output directory. Redeploy after adding or changing these variables, because the HTML and client bundle are generated during the build.
3. Open the deployed domain, browse the internship cards, and use the rabbit-hole wand. Look for `$pageview`, `internship_selected`, and `wand_used` in PostHog's activity feed.
4. Check Vercel's **Speed Insights** tab. The SDK is installed and both the HTML and React pages load its collection script on production deployments. Local servers do not provide Vercel's collection endpoint.

The wizard created an [archive analytics dashboard](https://us.posthog.com/project/646220/dashboard/2170902) and an [integration report](https://us.posthog.com/project/646220/notebooks/Gm0rqO8W). Main-site events can be used to create additional insights after the first production visits arrive.

## Events

| Event | Meaning |
| --- | --- |
| `$pageview`, `$pageleave` | Visits and departures; PostHog's standard source/referrer properties apply. |
| `section_viewed` | A main-site section heading becomes visible, once per page. |
| `internship_selected` | The active internship changes, including by swipe or keyboard. The initial default card is not counted as a selection. |
| `rabbit_hole_entered` | The visitor reaches the rabbit-hole entrance, once per page. |
| `rabbit_hint_shown` | The help hint appears, once per page. |
| `wand_used` | The visitor activates the wand. |
| `contact_section_reached` | The contact heading becomes visible, once per page. |
| `contact_started` | A mail link is clicked. This does not confirm an email was sent. |
| `resume_opened`, `social_link_clicked`, `archive_opened` | A corresponding link is clicked. |
| `writing_topic_selected` | A writing topic filter is clicked. |
| `article_opened` | A writing page opens. Current articles are labeled `content_status: sample`. |
| `article_reading_progress` | The viewport reaches 25/50/75/100% of article content, once per milestone. This measures scroll exposure, not confirmed reading. |
| `project_opened`, `project_image_expanded`, `next_project_opened` | Interactions in the archived React site. |

Main-site custom events carry `site_version: main` and `page_path`. Archive events carry `site_version: archive`. Session replay, autocapture, exception capture, surveys, and person profiles are disabled. Link tracking does not send mail addresses or message bodies as custom properties. PostHog still collects its standard browser, page URL, and attribution data.

## Implementation and checks

The main pages are HTML route handlers, so they do not run Next's client instrumentation. `src/site/serve-page.ts` injects production configuration and loads `public/site/analytics.js`. `/analytics/posthog.js/` serves the SDK installed in the lockfile. The archived React pages use `src/instrumentation-client.ts` and the Speed Insights React component.

```sh
node --test scripts/check-analytics.mjs
npm run lint
npm run build
```

The tests cover environment gating, safe configuration serialization, disabled replay, event deduplication, article milestones, and exclusion of mailto contents. Verify live event delivery after deployment; local checks do not prove delivery to PostHog or Vercel.
