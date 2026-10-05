(() => {
  const deck = document.querySelector('.work-deck');
  if (!deck || !CSS.supports('mask-image', 'linear-gradient(white, white)')) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const tile = 24, pixel = 8;
  let cells = [], width = 0, height = 0, start = 0, finish = 1;
  let target = 0, progress = 0, frame = 0, last = 0, rendered = -1;

  function paint() {
    // Quantize updates: the mask stays on the same crisp grid as the hero.
    const step = Math.round(progress * 80);
    if (step === rendered) return;
    rendered = step;
    deck.dataset.dissolve = step === 0 ? 'intact' : step === 80 ? 'gone' : 'dissolving';
    if (step === 0) {
      deck.style.removeProperty('mask-image');
      deck.style.removeProperty('-webkit-mask-image');
      return;
    }
    let path = '';
    for (const cell of cells) {
      const amount = clamp((step / 80 - cell.delay) / .4);
      const size = tile - Math.round(amount * (tile / pixel)) * pixel;
      if (!size) continue;
      const inset = (tile - size) / 2;
      path += `M${cell.x + inset} ${cell.y + inset}h${size}v${size}h-${size}z`;
    }
    // Mask the real artwork AND copy, so every fragment retains its own color
    // and detail. No screenshot, duplicate text, or replacement confetti layer.
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><path fill="white" shape-rendering="crispEdges" d="${path}"/></svg>`;
    const mask = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    deck.style.maskImage = mask;
    deck.style.webkitMaskImage = mask;
  }

  function tick(now) {
    frame = 0;
    const dt = last ? Math.min(64, now - last) : 16;
    last = now;
    progress += (target - progress) * (1 - Math.exp(-dt / 90));
    if (Math.abs(target - progress) < .001) progress = target;
    paint();
    if (Math.abs(target - progress) > .001) frame = requestAnimationFrame(tick);
    else last = 0;
  }

  function update() {
    const keepReadable = preference.matches || !!deck.querySelector(':focus-visible');
    target = keepReadable ? 0 : clamp((scrollY - start) / (finish - start));
    if (document.hidden || keepReadable) {
      cancelAnimationFrame(frame);
      frame = 0; last = 0;
      if (keepReadable) { progress = 0; paint(); }
      return;
    }
    if (!frame) frame = requestAnimationFrame(tick);
  }

  function measure() {
    const rect = deck.getBoundingClientRect();
    width = Math.ceil(rect.width); height = Math.ceil(rect.height);
    const top = rect.top + scrollY, bottom = rect.bottom + scrollY;
    // Start only after the top has passed, including on tall mobile cards.
    start = Math.max(top, bottom - innerHeight * .82);
    finish = Math.max(start + 160, bottom - innerHeight * .12);
    cells = [];
    for (let y = 0; y < height; y += tile) {
      for (let x = 0; x < width; x += tile) {
        const noise = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        cells.push({ x, y, delay: (noise - Math.floor(noise)) * .42 + y / height * .18 });
      }
    }
    rendered = -1;
    update();
  }

  const observer = new ResizeObserver(measure);
  observer.observe(deck);
  observer.observe(document.querySelector('.intro'));
  observer.observe(document.querySelector('.work-heading-row'));
  window.addEventListener('resize', measure);
  window.addEventListener('scroll', update, { passive: true });
  deck.addEventListener('focusin', update);
  deck.addEventListener('focusout', () => queueMicrotask(update));
  preference.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
})();
