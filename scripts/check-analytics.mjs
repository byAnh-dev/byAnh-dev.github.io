import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';
import { analyticsConfig, analyticsMarkup } from '../src/site/analytics-config.mjs';

const production = {
  VERCEL_ENV: 'production',
  NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: 'phc_test',
  NEXT_PUBLIC_POSTHOG_HOST: 'https://us.i.posthog.com',
};
const source = readFileSync(new URL('../public/site/analytics.js', import.meta.url), 'utf8');

test('local, preview, and ordinary next start builds emit no analytics', () => {
  for (const env of [{}, { NODE_ENV: 'production' }, { ...production, VERCEL_ENV: 'preview' }]) {
    assert.equal(analyticsConfig(env), null);
    assert.equal(analyticsMarkup(env), '');
  }
});

test('production emits only public configuration, escapes HTML, and orders scripts', () => {
  const markup = analyticsMarkup({ ...production, PRIVATE_TOKEN: 'secret-value' });
  assert(!markup.includes('secret-value'));
  assert(markup.indexOf('portfolio-analytics-config') < markup.indexOf('/analytics/posthog.js'));
  assert(markup.indexOf('/analytics/posthog.js') < markup.indexOf('/site/analytics.js'));
  assert(!analyticsMarkup({ ...production, NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: 'phc_</script>' }).includes('phc_</script>'));
  assert.equal(analyticsConfig({ ...production, NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: 'phx_private' }).posthog, null);
  assert.equal(analyticsConfig({ ...production, NEXT_PUBLIC_POSTHOG_HOST: 'https://untrusted.example' }).posthog, null);
  assert(analyticsMarkup({ VERCEL_ENV: 'production' }).includes('/site/analytics.js'));
});

function browser({ hostname = 'portfolio.example', config = analyticsConfig(production), article = false } = {}) {
  const events = [], appended = [], listeners = {}, mutations = [];
  let options;
  let selected = 'Pinnacle';
  const deck = { querySelector: () => ({ getAttribute: () => selected, querySelector: () => ({ textContent: selected }) }) };
  const hint = { textContent: '' };
  const heading = {};
  const articleElement = { getBoundingClientRect: () => ({ top: 0, height: 800 }) };
  const on = target => (name, fn) => { listeners[`${target}:${name}`] = fn; };
  const document = {
    visibilityState: 'visible',
    getElementById: id => id === 'portfolio-analytics-config'
      ? (config && { textContent: JSON.stringify(config) })
      : id === 'contact' ? { querySelector: () => heading } : null,
    querySelector: selector => ({ '.deck-dots': deck, '.rabbit-stuck-hint': hint,
      '.rabbit-wand': { addEventListener: on('wand') },
      '.article-copy': article ? articleElement : null }[selector] || null),
    createElement: () => ({}), head: { append: node => appended.push(node) },
    addEventListener: on('document'),
  };
  const posthog = { init: (_token, opts) => { options = opts; }, capture: (event, props) => events.push({ event, props }) };
  let intersection;
  runInNewContext(source, {
    window: { posthog, addEventListener: on('window') }, document,
    location: { hostname, pathname: article ? '/writing/example/' : '/', href: `https://${hostname}/`, origin: `https://${hostname}` },
    URL, innerHeight: 800, requestAnimationFrame: fn => fn(),
    MutationObserver: class { constructor(fn) { this.fn = fn; } observe(node) { mutations.push({ node, fn: this.fn }); } },
    IntersectionObserver: class { constructor(fn) { intersection = fn; } observe() {} unobserve() {} },
  });
  return { events, appended, listeners, options, hint,
    select: name => { selected = name; mutations.find(m => m.node === deck).fn(); },
    showHint: () => { hint.textContent = 'Help'; mutations.find(m => m.node === hint).fn(); },
    seeContact: () => intersection([{ isIntersecting: true, target: heading }]),
  };
}

test('browser gates localhost and missing configuration before loading trackers', () => {
  for (const args of [{ hostname: 'localhost' }, { hostname: '127.0.0.1' }, { hostname: '[::1]' }, { config: null }]) {
    const b = browser(args);
    assert.equal(b.options, undefined);
    assert.equal(b.appended.length, 0);
  }
});

test('explicit analytics disables replay and autocapture; animation frames do not flood events', () => {
  const b = browser();
  assert.equal(b.options.disable_session_recording, true);
  assert.equal(b.options.autocapture, false);
  assert.equal(b.options.person_profiles, 'never');
  assert.equal(b.appended[0].src, '/_vercel/speed-insights/script.js');
  for (let frame = 0; frame < 120; frame++) b.listeners['window:rabbit:entered']();
  b.select('Pinnacle'); b.select('Monarch'); b.select('Monarch');
  b.showHint(); b.showHint(); b.seeContact(); b.seeContact();
  for (const name of ['rabbit_hole_entered', 'internship_selected', 'rabbit_hint_shown', 'contact_section_reached']) {
    assert.equal(b.events.filter(e => e.event === name).length, 1, name);
  }
  assert(b.events.every(e => e.props.site_version === 'main'));
});

test('article milestones are emitted once and mailto contents are excluded', () => {
  const b = browser({ article: true });
  b.listeners['window:scroll'](); b.listeners['window:scroll']();
  assert.equal(b.events.filter(e => e.event === 'article_opened').length, 1);
  assert.equal(b.events.filter(e => e.event === 'article_reading_progress').length, 4);
  b.listeners['document:click']({ target: { closest: () => ({ href: 'mailto:private@example.com?body=private-text' }) } });
  assert.equal(b.events.at(-1).event, 'contact_started');
  assert(!JSON.stringify(b.events).includes('private'));
});
