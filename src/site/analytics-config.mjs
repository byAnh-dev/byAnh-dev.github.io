// Only browser-safe configuration is returned. No personal API keys are exposed.
export function analyticsConfig(env = process.env) {
  if (env.VERCEL_ENV !== 'production') return null;
  const token = env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = env.NEXT_PUBLIC_POSTHOG_HOST;
  const posthog = token?.startsWith('phc_') && /^https:\/\/(us|eu)\.i\.posthog\.com$/.test(host || '')
    ? { token, host } : null;
  return { posthog };
}

export function analyticsMarkup(env = process.env) {
  const config = analyticsConfig(env);
  if (!config) return '';
  const json = JSON.stringify(config).replaceAll('<', '\\u003c');
  return `<script type="application/json" id="portfolio-analytics-config">${json}</script>
${config.posthog ? '<script defer src="/analytics/posthog.js"></script>' : ''}
<script defer src="/site/analytics.js"></script>`;
}
