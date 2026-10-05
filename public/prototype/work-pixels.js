(() => {
  const section = document.querySelector('.work-preview');
  const ribbon = section?.querySelector('.work-ribbon');
  const canvas = ribbon?.querySelector('canvas');
  const context = canvas?.getContext('2d');
  if (!context) return;
  const effects = document.createElement('canvas');
  const ink = effects.getContext('2d');
  if (!ink) return;
  effects.className = 'work-pixel-effects';
  effects.setAttribute('aria-hidden', 'true');
  section.append(effects);

  // Match the hero and cursor: 8px cells, 1px gutters, opaque palette steps.
  const palette = ['#000000', '#3049d9', '#536bfa', '#f6ce25', '#fa593e', '#d8ee40'];
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const deck = section.querySelector('.work-deck');
  const track = deck.querySelector('.deck-track');
  const cardLayers = [...deck.querySelectorAll('.card-art')].map(surface => {
    const layer = document.createElement('canvas');
    layer.className = 'card-pixel-effect';
    layer.setAttribute('aria-hidden', 'true');
    const ctx = layer.getContext('2d');
    surface.append(layer);
    return { surface, layer, ctx, width: 0, height: 0 };
  }).filter(card => card.ctx);
  let bursts = [];
  let scrollTime = -Infinity, scrollPosition = track.scrollLeft, direction = 1;
  let width = 0, height = 0, effectWidth = 0, effectHeight = 0;
  let visible = false, ribbonVisible = false, frame = 0, last = 0, age = 0, elapsed = 0;
  let filled = false;
  let cardStrength = 0;
  const ribbonRunning = () => ribbonVisible && filled;

  function drawRibbon() {
    context.clearRect(0, 0, width, height);
    if (!filled && !preference.matches) return;
    const phase = preference.matches ? 0 : elapsed * .045;
    const limit = width;
    for (let x = 0; x < limit; x += 8) {
      for (let y = 8; y < height - 8; y += 8) {
        // Identical straight diagonal bands, with equal gaps and a level silhouette.
        const band = ((Math.floor((x - y * .8 + phase) / 8) % 12) + 12) % 12;
        if (band > 7) continue;
        context.fillStyle = palette[Math.min(5, band)];
        context.fillRect(x, y, 7, 7);
      }
    }
  }

  function paintBursts(now) {
    ink.clearRect(0, 0, effectWidth, effectHeight);
    bursts = bursts.filter(burst => now - burst.birth < 460);
    for (const burst of bursts) {
      const t = (now - burst.birth) / 460;
      const radius = 12 + 44 * (1 - (1 - t) ** 3);
      const thickness = 22 * (1 - t) + 4;
      for (let y = -64; y <= 64; y += 6) {
        for (let x = -64; x <= 64; x += 6) {
          const distance = Math.hypot(x, y);
          if (distance > radius) continue;
          const band = (radius - distance) / thickness;
          // The center is white, surrounded by expanding, solid-color pixel rings.
          ink.fillStyle = band >= 1 ? '#fff' : palette[Math.min(5, Math.floor(band * 6))];
          ink.fillRect(Math.round((burst.x + x - scrollX) / 6) * 6, Math.round((burst.y + y - scrollY) / 6) * 6, band >= 1 ? 6 : 5, band >= 1 ? 6 : 5);
        }
      }
    }
  }

  function paintCards(now, delta) {
    const target = now - scrollTime < 70 ? .32 : 0;
    cardStrength += (target - cardStrength) * (1 - Math.exp(-delta / 90));
    const strength = cardStrength;
    for (const card of cardLayers) {
      card.ctx.clearRect(0, 0, card.width, card.height);
      if (strength < .08) continue;
      const phase = scrollPosition / Math.max(1, card.width) * 6 * direction;
      for (let y = 0; y < card.height; y += 8) {
        for (let x = 0; x < card.width; x += 8) {
          // Keep the moving contour in the artwork, clear of readable copy.
          const wave = .48 + Math.sin(x / card.width * 9 + phase) * .22
            + Math.cos(y / card.height * 8 - phase * .7) * .18;
          const value = wave * strength;
          if (value < .12) continue;
          card.ctx.fillStyle = value < .23 ? palette[0] : value < .33 ? palette[1]
            : value < .43 ? palette[2] : value < .55 ? palette[3]
              : value < .69 ? palette[4] : palette[5];
          card.ctx.fillRect(x, y, 7, 7);
        }
      }
    }
  }

  function clearCards() {
    scrollTime = -Infinity;
    cardStrength = 0;
    cardLayers.forEach(card => card.ctx.clearRect(0, 0, card.width, card.height));
  }

  function tick(now) {
    frame = 0;
    const delta = last ? Math.min(64, now - last) : 0;
    last = now;
    if (ribbonRunning()) {
      elapsed += delta;
      age += delta;
      if (age >= 40) { drawRibbon(); age = 0; }
    }
    if (bursts.length) paintBursts(now);
    if (Number.isFinite(scrollTime)) {
      paintCards(now, delta);
      if (now - scrollTime > 70 && cardStrength < .015) clearCards();
    }
    if (!preference.matches && !document.hidden && (ribbonRunning() || bursts.length || Number.isFinite(scrollTime))) {
      frame = requestAnimationFrame(tick);
    } else last = 0;
  }

  function sync() {
    if (preference.matches || document.hidden || !visible) {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      bursts = [];
      clearCards();
      ink.clearRect(0, 0, effectWidth, effectHeight);
    } else if (!frame && (ribbonRunning() || bursts.length || Number.isFinite(scrollTime))) frame = requestAnimationFrame(tick);
    canvas.dataset.motion = preference.matches ? 'reduced' : !filled ? 'waiting' : ribbonVisible && !document.hidden ? 'playing' : 'suspended';
  }

  function burst(clientX, clientY) {
    if (preference.matches || document.hidden || !visible) return;
    bursts.push({ x: clientX + scrollX, y: clientY + scrollY, birth: performance.now() });
    bursts = bursts.slice(-4);
    sync();
  }

  deck.querySelectorAll('.deck-arrows button').forEach(button => {
    button.addEventListener('click', () => {
      const bounds = button.getBoundingClientRect();
      burst(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
    });
  });
  track.addEventListener('scroll', () => {
    const nextPosition = track.scrollLeft;
    const distance = nextPosition - scrollPosition;
    scrollPosition = nextPosition;
    if (preference.matches || !visible || Math.abs(distance) < .5) return;
    direction = Math.sign(distance);
    scrollTime = performance.now();
    sync();
  }, { passive: true });

  ribbon.addEventListener('pixelpour:state', event => {
    filled = event.detail.complete;
    elapsed = 0;
    drawRibbon();
    sync();
  });
  function resize() {
    width = ribbon.clientWidth; height = ribbon.clientHeight;
    effectWidth = innerWidth; effectHeight = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    for (const [surface, ctx, w, h] of [[canvas, context, width, height], [effects, ink, effectWidth, effectHeight]]) {
      surface.width = Math.round(w * dpr); surface.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    for (const card of cardLayers) {
      card.width = card.surface.clientWidth; card.height = card.surface.clientHeight;
      card.layer.width = Math.round(card.width * dpr); card.layer.height = Math.round(card.height * dpr);
      card.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    bursts = [];
    clearCards();
    drawRibbon();
    ribbon.classList.add('is-ready');
  }
  new ResizeObserver(resize).observe(section);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(section);
  new IntersectionObserver(([entry]) => { ribbonVisible = entry.isIntersecting; sync(); }).observe(ribbon);
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', sync);
  preference.addEventListener('change', () => { drawRibbon(); sync(); });
})();
