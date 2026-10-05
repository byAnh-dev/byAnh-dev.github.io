(() => {
  const configElement = document.getElementById('portfolio-analytics-config');
  if (!configElement || /^(localhost|127\.|\[::1\])/.test(location.hostname)) return;
  const config = JSON.parse(configElement.textContent);

  // The HTML pages do not execute Next's client instrumentation.
  const posthog = config.posthog && window.posthog;
  if (posthog) {
    posthog.init(config.posthog.token, {
      api_host: config.posthog.host,
      defaults: '2026-01-30',
      autocapture: false,
      capture_pageview: true,
      capture_pageleave: true,
      capture_exceptions: false,
      capture_dead_clicks: false,
      disable_session_recording: true,
      disable_surveys: true,
      advanced_disable_feature_flags: true,
      person_profiles: 'never',
      loaded: client => client.register({ site_version: 'main' }),
    });
  }

  // Vercel supports this collection route for HTML sites as well as Next pages.
  window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
  const speed = document.createElement('script');
  speed.src = '/_vercel/speed-insights/script.js';
  speed.defer = true;
  document.head.append(speed);

  if (!posthog) return;
  const capture = (event, properties = {}) => posthog.capture(event, {
    ...properties, site_version: 'main', page_path: location.pathname,
  });
  const once = new Set();
  function captureOnce(event, properties = {}) {
    const key = event + JSON.stringify(properties);
    if (once.has(key)) return;
    once.add(key);
    capture(event, properties);
  }

  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.protocol === 'mailto:') capture('contact_started', { source: 'main_site' });
    else if (url.pathname === '/resume.pdf') capture('resume_opened', { source: 'main_site' });
    else if (['github.com', 'www.linkedin.com'].includes(url.hostname)) {
      capture('social_link_clicked', { destination: url.hostname });
    } else if (url.origin === location.origin && url.pathname.startsWith('/archive/')) {
      capture('archive_opened', { destination: url.pathname });
    }
  });

  const wand = document.querySelector('.rabbit-wand');
  wand?.addEventListener('wand:activate', () => capture('wand_used'));
  // The animation emits this every frame while inside the room.
  window.addEventListener('rabbit:entered', () => captureOnce('rabbit_hole_entered'));
  const hint = document.querySelector('.rabbit-stuck-hint');
  if (hint) new MutationObserver(() => {
    if (hint.textContent.trim()) captureOnce('rabbit_hint_shown');
  }).observe(hint, { childList: true, subtree: true });

  const deck = document.querySelector('.deck-dots');
  if (deck) {
    let last = deck.querySelector('[aria-pressed="true"]')?.getAttribute('aria-label');
    new MutationObserver(() => {
      const button = deck.querySelector('[aria-pressed="true"]');
      const selected = button?.getAttribute('aria-label');
      if (!selected || selected === last) return;
      last = selected;
      capture('internship_selected', { internship: button.querySelector('strong')?.textContent });
    }).observe(deck, { subtree: true, attributes: true, attributeFilter: ['aria-pressed'] });
  }

  document.querySelector('.topic-filters')?.addEventListener('click', event => {
    const button = event.target.closest('button[data-topic]');
    if (button) capture('writing_topic_selected', { topic: button.dataset.topic });
  });

  // Observe headings, since entire sections can be taller than the viewport.
  const sectionNames = new Map();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const section = sectionNames.get(entry.target);
      captureOnce('section_viewed', { section });
      if (section === 'contact') captureOnce('contact_section_reached');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.5 });
  for (const id of ['work', 'interests', 'rabbit-hole', 'contact']) {
    const section = document.getElementById(id);
    if (!section) continue;
    const heading = section.querySelector('h2');
    if (!heading) continue;
    sectionNames.set(heading, id);
    observer.observe(heading);
  }

  const article = document.querySelector('.article-copy');
  if (article) {
    const slug = location.pathname.split('/').filter(Boolean).pop();
    capture('article_opened', { article: slug, content_status: 'sample' });
    let pending = false;
    const measure = () => {
      pending = false;
      if (document.visibilityState !== 'visible') return;
      const rect = article.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (innerHeight - rect.top) / rect.height));
      for (const percent of [25, 50, 75, 100]) {
        if (progress * 100 >= percent) captureOnce('article_reading_progress', { article: slug, percent });
      }
    };
    window.addEventListener('scroll', () => {
      if (!pending) { pending = true; requestAnimationFrame(measure); }
    }, { passive: true });
    measure();
  }
})();
