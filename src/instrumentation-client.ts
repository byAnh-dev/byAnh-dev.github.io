import posthog from 'posthog-js'

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

if (
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true' &&
  !/^(localhost|127\.|\[::1\])/.test(window.location.hostname) &&
  token?.startsWith('phc_') &&
  /^https:\/\/(us|eu)\.i\.posthog\.com$/.test(host || '')
) {
  posthog.init(token, {
    api_host: host,
    defaults: '2026-01-30',
    autocapture: false,
    capture_pageview: 'history_change',
    capture_pageleave: true,
    capture_exceptions: false,
    capture_dead_clicks: false,
    disable_session_recording: true,
    disable_surveys: true,
    advanced_disable_feature_flags: true,
    person_profiles: 'never',
    loaded: client => client.register({ site_version: 'archive' }),
  })
}
