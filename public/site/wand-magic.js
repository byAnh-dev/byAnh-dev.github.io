/* The shockwave removes the old scene to expose the real closing section beneath it. */
(() => {
  const wand = document.querySelector('.rabbit-wand');
  if (!wand) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let casting = false;

  wand.addEventListener('wand:activate', event => {
    if (casting) { event.preventDefault(); return; }
    if (preference.matches) return;
    const canvas = document.createElement('canvas');
    const ink = canvas.getContext('2d');
    if (!ink) return;
    event.preventDefault();
    casting = true;
    document.dispatchEvent(new Event('pixelcursor:absorb'));
    wand.classList.add('is-casting');
    wand.setAttribute('aria-busy', 'true');
    canvas.className = 'wand-magic';
    canvas.setAttribute('aria-hidden', 'true');

    const tip = wand.querySelector('svg').getBoundingClientRect();
    const origin = { x: (tip.left + tip.width * .7) / innerWidth, y: (tip.top + tip.height * .25) / innerHeight };
    // Preserve the visible room while the actual page moves to the closing section.
    const stage = wand.closest('.rabbit-stage');
    const departure = document.createElement('div');
    departure.className = 'wand-departure';
    departure.setAttribute('aria-hidden', 'true');
    departure.inert = true;
    const snapshot = stage.cloneNode(true);
    snapshot.removeAttribute('role');
    snapshot.removeAttribute('aria-modal');
    snapshot.removeAttribute('aria-labelledby');
    snapshot.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
    snapshot.querySelectorAll('canvas, .rabbit-stuck-hint').forEach(element => element.remove());
    departure.append(snapshot);
    document.body.append(departure, canvas);
    snapshot.scrollTop = stage.scrollTop;
    document.documentElement.classList.add('wand-revealing');
    const colors = ['#161e34', '#3049d9', '#536bfa', '#fa593e', '#f6ce25', '#fff2a0'];
    let frame = 0, fallback = 0, finished = false, width = 0, height = 0;
    let cells = [], cell = 8, reach = 0, band = 0;
    let elapsed = 0, previous = 0;
    const duration = 560;
    const clamp = value => Math.max(0, Math.min(1, value));

    function cleanUp() {
      canvas.remove();
      departure.remove();
      document.documentElement.classList.remove('wand-revealing');
      wand.classList.remove('is-casting');
      wand.removeAttribute('aria-busy');
      casting = false;
    }

    function finish() {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(frame);
      clearTimeout(fallback);
      document.removeEventListener('visibilitychange', onVisibility);
      preference.removeEventListener('change', onPreference);
      cleanUp();
    }

    function onVisibility() { if (document.hidden) finish(); }
    function onPreference() { if (preference.matches) finish(); }

    function paint(now) {
      if (innerWidth !== width || innerHeight !== height) {
        width = innerWidth; height = innerHeight;
        const dpr = Math.min(devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
        ink.setTransform(dpr, 0, 0, dpr, 0, 0);
        const x = origin.x * width, y = origin.y * height;
        reach = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
        // Bound the grid on large displays while keeping each pixel visibly square.
        cell = Math.max(8, Math.ceil(Math.sqrt(width * height / 20000)));
        band = Math.max(48, Math.min(112, reach * .085));
        cells = [];
        for (let py = 0; py < height; py += cell) {
          for (let px = 0; px < width; px += cell) {
            const noise = Math.sin(px * 12.9898 + py * 78.233) * 43758.5453;
            const seed = noise - Math.floor(noise);
            cells.push({ x: px, y: py, distance: Math.hypot(px + cell / 2 - x, py + cell / 2 - y), seed });
          }
        }
      }
      // A delayed first frame must not skip straight to the all-white ending.
      elapsed += previous ? Math.min(now - previous, 48) : 0;
      previous = now;
      const t = clamp(elapsed / duration);
      const radius = (reach + band * 2) * (1 - Math.pow(1 - t, 1.25));
      ink.clearRect(0, 0, width, height);
      const holes = [];
      let rowY = 0, runX = -1, runWidth = 0;
      const flush = () => {
        if (runX < 0) return;
        holes.push(`M${runX} ${rowY}h${runWidth}v${cell}h-${runWidth}z`);
        runX = -1; runWidth = 0;
      };
      for (const pixel of cells) {
        if (pixel.y !== rowY) { flush(); rowY = pixel.y; }
        const distance = pixel.distance + (pixel.seed - .5) * cell * 3;
        const behind = radius - distance;
        if (behind > band) {
          // Cut through to live content instead of painting an empty white layer.
          if (runX < 0) runX = pixel.x;
          runWidth += cell;
        } else {
          flush();
          const strength = Math.exp(-Math.pow((distance - radius) / (band * .55), 2));
          if (strength < .07 || pixel.seed > Math.min(1, strength * 2.4)) continue;
          ink.fillStyle = colors[Math.min(colors.length - 1, Math.floor(strength * colors.length))];
          ink.fillRect(pixel.x, pixel.y, cell - 1, cell - 1);
        }
      }
      flush();
      // Merge cleared cells into row spans to keep the mask small on large displays.
      const mask = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><path fill="white" fill-rule="evenodd" d="M0 0H${width}V${height}H0z ${holes.join(' ')}"/></svg>`;
      departure.style.maskImage = `url("data:image/svg+xml,${encodeURIComponent(mask)}")`;
      if (t >= 1) finish();
      else frame = requestAnimationFrame(paint);
    }

    document.addEventListener('visibilitychange', onVisibility);
    preference.addEventListener('change', onPreference);
    // Always release the visitor if animation frames are throttled.
    fallback = setTimeout(finish, duration + 1000);
    // Reveal and position “Like it here?” now, while the old scene still covers it.
    event.detail.complete();
    frame = requestAnimationFrame(paint);
  });
})();
