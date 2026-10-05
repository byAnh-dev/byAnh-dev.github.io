import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = new URL(process.argv[2] || 'http://localhost:3100');
const routes = JSON.parse(await readFile(new URL('../src/site/routes.json', import.meta.url), 'utf8'));
const documents = new Map();
const requests = new Map();
async function get(pathname) {
  if (!requests.has(pathname)) requests.set(pathname, fetch(new URL(pathname, base), { redirect: 'manual' }));
  return requests.get(pathname);
}

for (const [pathname, route] of Object.entries(routes)) {
  const response = await get(pathname);
  if (route.redirect) {
    assert.equal(response.status, 308, pathname);
    assert.equal(new URL(response.headers.get('location'), base).href, new URL(route.redirect, base).href, pathname);
  } else {
    assert.equal(response.status, 200, pathname);
    assert.match(response.headers.get('content-type'), /text\/html/, pathname);
    documents.set(pathname, await response.text());
  }
}

for (const pathname of ['/archive/', '/archive/about/', '/archive/contact/', '/archive/projects/', '/archive/projects/fintech-app/', '/archive/projects/ai-syllabus-extractor/', '/archive/reserve/', '/archive/thoughts/']) {
  const response = await get(pathname);
  assert.equal(response.status, 200, pathname);
  const html = await response.text();
  assert.match(html, /noindex/, pathname);
  assert.match(html, /Visit the current portfolio/, pathname);
  documents.set(pathname, html);
}

assert.match(documents.get('/'), /Hi, I’m Anh/);
assert.doesNotMatch(documents.get('/'), /Portfolio study|NAVIGATION PREVIEW|<iframe/);
assert.match(documents.get('/writing/a-task-is-more-than-a-prompt/'), /not a published article by Anh/);

for (const [pathname, html] of documents) {
  for (const [, reference] of html.matchAll(/\b(?:href|src)="([^"\s]+)"/g)) {
    const target = new URL(reference.replaceAll('&amp;', '&'), new URL(pathname, base));
    if (target.origin !== base.origin) continue;
    const response = await get(target.pathname + target.search);
    assert.ok([200, 307, 308].includes(response.status), `${pathname} → ${target.pathname}: ${response.status}`);
    if (target.hash && documents.has(target.pathname)) {
      const id = decodeURIComponent(target.hash.slice(1));
      assert.ok(documents.get(target.pathname).includes(`id="${id}"`), `${pathname}: missing fragment ${target.hash}`);
    }
    if (target.pathname.endsWith('.css') && response.status === 200) {
      const css = await response.clone().text();
      for (const [, asset] of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
        if (/^(data:|#)/.test(asset)) continue;
        const assetUrl = new URL(asset, target);
        if (assetUrl.origin === base.origin) assert.equal((await get(assetUrl.pathname)).status, 200, assetUrl.pathname);
      }
    }
  }
}
assert.equal((await get('/this-page-does-not-exist/')).status, 404);
assert.equal((await get('/writing/not-an-article/')).status, 404);
console.log(`Passed: ${documents.size} pages, compatibility redirects, fragment links, and ${requests.size} local URLs; unknown pages return 404.`);
