// Regenerate the static design preview: node public/prototype/generate-writing.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { articles } from './writing-data.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const time = article => `${Math.max(1, Math.ceil(JSON.stringify(article.sections).split(/\s+/).length / 200))} min read`;
const tag = article => `<span class="topic-tag" data-topic="${escape(article.topic)}">${escape(article.topic)}</span>`;
const head = (title, prefix = '') => `<!doctype html>
<!-- Generated design preview. Edit writing-data.mjs and run generate-writing.mjs. -->
<html lang="en"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow"><title>${escape(title)} · Anh Hoang</title>
  <link rel="preload" href="${prefix}fonts/MalintonTrialVersion-Regular.otf" as="font" type="font/otf" crossorigin>
  <link rel="stylesheet" href="${prefix}style.css"><link rel="stylesheet" href="${prefix}writing.css">
</head><body class="writing-gallery-page">
  <a class="skip" href="#writing-content">Skip to writing</a>
  <header class="header">
    <a class="wordmark" href="${prefix}screen.html" aria-label="Anh Hoang home">anh hoang<span class="mark" aria-hidden="true"></span></a>
    <nav aria-label="Main navigation"><a href="${prefix}screen.html#work">Work</a><a href="${prefix}journey.html">My journey</a><a href="${prefix}writing.html" aria-current="${prefix ? 'location' : 'page'}">Writing</a><a href="${prefix}screen.html#contact">Contact ↗</a></nav>
  </header>`;
const footer = (prefix = '') => `<footer class="writing-footer"><a href="${prefix}screen.html#rabbit-hole"><span aria-hidden="true">←</span> Back to the rabbit hole</a><p>Design preview · Sample articles</p></footer>`;

// Original geometric cover illustrations, kept local and deliberately quiet.
const rect = (x,y,w,h,fill,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
const svg = (background,content) => `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="500" viewBox="0 0 900 500"><rect width="900" height="500" fill="${background}"/>${content}</svg>`;
const covers = {
  prompt: svg('#e8edf6', `${rect(214,96,408,280,'#c4cce0')}${rect(238,72,408,280,'#f9fafc','stroke="#9aa7c3" stroke-width="2"')}<path d="m280 126 22 18-22 18m42 0h28" stroke="#3049d9" stroke-width="5" fill="none"/>${[0,1,2].map((n)=>rect(280,202+n*36,270-n*44,8,'#c5cddd')).join('')}${rect(524,286,104,100,'#3049d9')}<path d="M552 336h48m-24-24v48" stroke="#fff" stroke-width="8"/>`),
  finish: svg('#efece4', `<path d="M0 338h260V230h140V122h204" fill="none" stroke="#c7c2b4" stroke-width="2"/>${rect(272,280,72,72,'#db7150')}${rect(368,210,72,142,'#dfb45d')}${rect(464,140,72,212,'#3049d9')}<path d="M592 90v272" stroke="#242424" stroke-width="5"/>${Array.from({length:24},(_,i)=>rect(594+(i%6)*16,90+Math.floor(i/6)*16,16,16,(i+Math.floor(i/6))%2?'#fdfbf5':'#242424')).join('')}<path d="M224 378h480" stroke="#b3ad9d" stroke-width="2"/>`),
  steps: svg('#e9ede5', `<path d="M200 314h130V230h148V146h150" fill="none" stroke="#7f9477" stroke-width="3" stroke-dasharray="7 8"/>${rect(196,276,80,80,'#8ea17d')}${rect(368,192,80,80,'#5a7453')}${rect(548,108,80,80,'#3049d9')}<path d="m568 148 13 13 28-29" stroke="white" stroke-width="5" fill="none"/>${rect(628,292,12,12,'#aaba9f')}${rect(652,316,12,12,'#aaba9f')}${rect(676,292,12,12,'#aaba9f')}`),
  experiment: svg('#eee9e2', `<g stroke="#b4aaa0" stroke-width="2" fill="none"><path d="M270 90v308m180-308v308m180-308v308M218 152h466M218 250h466M218 348h466"/></g><circle cx="360" cy="202" r="51" fill="#ce7557"/><circle cx="540" cy="300" r="51" fill="#e6be58"/>${rect(486,150,106,106,'#3049d9')}<path d="m314 305 32-32m0 32-32-32" stroke="#83776c" stroke-width="4"/>`),
  attempts: svg('#f1e6e1', `<g transform="rotate(-9 340 250)">${rect(230,90,220,280,'#dcae9b')}${rect(254,114,172,232,'#f9f5ef')}<path d="m284 172 90 100m0-100-90 100" stroke="#c47256" stroke-width="5"/></g><g transform="rotate(8 544 248)">${rect(428,120,228,284,'#d6c9bc')}${rect(428,108,228,284,'#fffaf1')}<path d="m480 210 32 34 80-82" stroke="#3049d9" stroke-width="6" fill="none"/>${rect(470,294,136,7,'#d6c9bc')}${rect(470,316,98,7,'#d6c9bc')}</g>`),
  context: svg('#e7e9f1', `${rect(222,110,108,108,'#a5adc8')}${rect(342,110,108,108,'#c3c9da')}${rect(462,110,108,108,'#3049d9')}${rect(342,230,108,108,'#a5adc8')}${rect(462,230,108,108,'#c3c9da')}${rect(582,230,108,108,'#8b98c1')}<path d="M198 88h-24v272h24m516-272h24v272h-24" stroke="#697795" stroke-width="3" fill="none"/>${rect(222,230,108,108,'none','stroke="#a5adc8" stroke-width="2" stroke-dasharray="6 6"')}`)
};

// The homepage palette gathers into a pencil, a small mark for thinking through writing.
const pencilSprite = ['........RRR.', '.......RrrR.', '......BYYR..', '.....BYYB...', '....BYYB....', '...BYYB.....', '..BYYB......', '.BYYB.......', '.WWB........', '.KW.........', '.K..........'];
const pencilColors = { R: '#fa593e', r: '#ff9986', B: '#3049d9', Y: '#f6ce25', W: '#ddd4c2', K: '#101010' };
const pencilPixels = pencilSprite.flatMap((row, y) => [...row].flatMap((color, x) => color === '.' ? [] : [rect(216 + x * 8, 8 + y * 8, 7, 7, pencilColors[color], 'class="pencil-pixel"')])).join('');
const loosePixels = [[16,48,'B'],[40,24,'Y'],[56,72,'K'],[88,40,'R'],[112,16,'B'],[128,64,'Y'],[152,40,'K'],[176,80,'R'],[192,24,'B']].map(([x,y,color])=>rect(x,y,7,7,pencilColors[color], 'class="loose-pixel"')).join('');
const pencil = `<svg class="writing-pixel-note" viewBox="0 0 336 104" width="336" height="104" aria-hidden="true" focusable="false">${loosePixels}${pencilPixels}</svg>`;

await mkdir(path.join(root,'writing','covers'), { recursive: true });
for (const [name,content] of Object.entries(covers)) await writeFile(path.join(root,'writing','covers',`${name}.svg`), content + '\n');

const cards = articles.map(article => `<li data-topic="${escape(article.topic)}"><a class="writing-card" href="writing/${article.slug}.html">
  <div class="writing-cover"><img src="writing/covers/${article.cover}.svg" alt="" width="900" height="500"></div>
  <div class="writing-card-body"><div class="writing-card-title"><h2>${escape(article.title)}</h2><span class="card-arrow" aria-hidden="true">↗</span></div><div class="card-details">${tag(article)}<span class="reading-time">${time(article)}</span></div></div>
</a></li>`).join('\n');
await writeFile(path.join(root,'writing.html'), `${head('Writing')}
  <main class="writing-shell" id="writing-content" tabindex="-1">
    <section class="writing-intro" aria-labelledby="writing-title"><h1 id="writing-title">my opinion<br>on things</h1><div class="writing-intent">${pencil}<p>AI makes it easy to consume more than I create. Writing is how I slow down, question what I take in, and connect it into an opinion of my own.</p></div></section>
    <div class="gallery-toolbar"><div class="topic-filters" role="group" aria-label="Filter writing by topic" hidden>${['All','AI workflows','Build logs','Experiments'].map(topic=>`<button type="button" data-topic="${topic}" aria-pressed="${topic==='All'}">${topic}</button>`).join('')}</div><p class="gallery-count" role="status" aria-live="polite">06 sample articles</p></div>
    <ul class="writing-grid" aria-label="Sample articles">${cards}</ul>
    ${footer()}
  </main><script src="writing.js" defer></script><script src="writing-effects.js" defer></script>
</body></html>\n`);

for (const [index,article] of articles.entries()) {
  const next = articles[(index+1)%articles.length];
  const body = article.sections.map(section => `${section.heading?`<h2>${escape(section.heading)}</h2>`:''}${section.quote?`<blockquote>${escape(section.quote)}</blockquote>`:''}${(section.paragraphs||[]).map(text=>`<p>${escape(text)}</p>`).join('\n')}`).join('\n');
  await writeFile(path.join(root,'writing',`${article.slug}.html`), `${head(article.title,'../')}
    <main class="article-shell" id="writing-content" tabindex="-1">
      <a class="article-breadcrumb" href="../writing.html"><span aria-hidden="true">←</span> All writing</a>
      <article><header class="article-heading"><div class="article-meta">${tag(article)}<span class="reading-time">${time(article)} · Sample article</span></div><h1>${escape(article.title)}</h1><p class="article-deck">${escape(article.summary)}</p></header>
      <figure class="article-cover"><img src="covers/${article.cover}.svg" width="900" height="500" alt=""></figure>
      <div class="article-copy"><p class="preview-note">Sample text for the reading-page design. This is not a published article by Anh.</p>${body}</div></article>
      <aside class="article-next" aria-label="Next sample article"><span class="eyebrow">KEEP READING</span><a href="${next.slug}.html">${escape(next.title)}<span aria-hidden="true">↗</span></a></aside>
      ${footer('../')}
    </main><script src="../writing-effects.js" defer></script></body></html>\n`);
}
console.log(`Generated writing gallery, ${articles.length} sample reading pages, and ${Object.keys(covers).length} covers.`);
