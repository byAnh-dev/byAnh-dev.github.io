(() => {
  const stage = document.querySelector('.map-sheet');
  const canvas = stage?.querySelector('.plane-cursor');
  const ctx = canvas?.getContext('2d');
  const image = stage?.querySelector('.world-map');
  if (!ctx || !image) return;
  const roundCanvas = document.createElement('canvas');
  const roundContext = roundCanvas.getContext('2d');
  if (!roundContext) return;
  roundCanvas.className = 'pixel-cursor journey-round-cursor';
  roundCanvas.setAttribute('aria-hidden', 'true');
  document.body.append(roundCanvas);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer: fine)');
  const decayMs = 55, cutoff = .08, planeUnit = 3;
  let cell = 3, mode = 'plane';
  const trail = new Map();
  const samples = [];
  // The same solid color steps, decay and interpolated stamps as pixel-field.js.
  // The smaller plane is map-local; the homepage's round brush follows elsewhere.
  const sprite = ['00000100000','00000100000','00000100000','00001110000','00011111000','00111111100','11111111111','00001110000','00000100000','00001110000','00011111000'];
  const colorAt = v => v < .12 ? '#000000' : v < .23 ? '#3049d9' : v < .33 ? '#536bfa' : v < .55 ? '#f6ce25' : v < .69 ? '#fa593e' : '#d8ee40';
  let width = 0, height = 0, frame = 0, last = 0, pointer = null, previous = null, angle = 0, scale = 1, lastInput = 0;
  let viewportWidth = 0, viewportHeight = 0;
  let land = null;
  function stamp(x, y, rotation, size) {
    const radius = mode === 'round' ? size : 25.5 * size, cos = Math.cos(rotation), sin = Math.sin(rotation);
    for (let row = Math.floor((y - radius) / cell); row <= (y + radius) / cell; row++) {
      for (let col = Math.floor((x - radius) / cell); col <= (x + radius) / cell; col++) {
        const dx = (col + .5) * cell - x, dy = (row + .5) * cell - y;
        let strength = 1;
        if (mode === 'round') {
          const noise = Math.sin(col * 127.1 + row * 311.7) * 43758.5453;
          const edge = radius + (noise - Math.floor(noise) - .5) * cell;
          strength = Math.max(0, 1 - (Math.hypot(dx, dy) / edge) ** 2);
          if (strength < cutoff) continue;
        } else {
          const sx = Math.floor((dx * cos + dy * sin) / (planeUnit * size) + 5.5);
          const sy = Math.floor((-dx * sin + dy * cos) / (planeUnit * size) + 5.5);
          if (sprite[sy]?.[sx] !== '1') continue;
        }
        const key = `${col},${row}`, old = trail.get(key);
        if (!old || strength > old.strength) trail.set(key, { col, row, strength });
      }
    }
  }
  function paint() {
    ctx.clearRect(0, 0, width, height);
    roundContext.clearRect(0, 0, viewportWidth, viewportHeight);
    const target = mode === 'round' ? roundContext : ctx;
    for (const { col, row, strength } of trail.values()) {
      const x = col * cell, y = row * cell;
      const lx = Math.floor((x + cell / 2) / width * 1200), ly = Math.floor((y + cell / 2) / height * 560);
      const onLand = mode === 'plane' && lx >= 0 && lx < 1200 && ly >= 0 && ly < 560 && land?.[(ly * 1200 + lx) * 4 + 3] > 0;
      target.fillStyle = onLand ? '#fff' : colorAt(strength * .78);
      target.fillRect(x, y, cell - 1, cell - 1);
    }
  }
  function tick(now) {
    frame = 0;
    const delta = last ? Math.min(now - last, 100) : 0; last = now;
    for (const [key, mark] of trail) { mark.strength *= Math.exp(-delta / decayMs); if (mark.strength < cutoff) trail.delete(key); }
    for (const point of samples) {
      if (previous) {
        const dx = point.x - previous.x, dy = point.y - previous.y, distance = Math.hypot(dx, dy);
        const dt = Math.max(1, Math.min(point.time - previous.time, 64));
        if (distance > 1) angle = Math.atan2(dy, dx) + Math.PI / 2;
        const taper = 1 / (1 + (distance / dt / .8) ** 2);
        const target = mode === 'round' ? 16 + 32 * taper : .55 + .45 * taper;
        scale += (target - scale) * (1 - Math.exp(-dt / 40));
        const steps = Math.max(1, Math.ceil(distance / (cell / 2)));
        for (let i = 1; i <= steps; i++) stamp(previous.x + dx * i / steps, previous.y + dy * i / steps, angle, scale);
      } else stamp(point.x, point.y, angle, scale);
      previous = point;
    }
    samples.length = 0;
    if (pointer) {
      if (now - lastInput > 60) scale += ((mode === 'round' ? 48 : 1) - scale) * (1 - Math.exp(-delta / 120));
      stamp(pointer.x, pointer.y, angle, scale);
    }
    paint();
    if (pointer || trail.size) frame = requestAnimationFrame(tick); else last = 0;
  }
  function clear() {
    pointer = previous = null; samples.length = 0; trail.clear(); scale = mode === 'round' ? 48 : 1;
    cancelAnimationFrame(frame); frame = 0; last = 0; paint(); stage.classList.remove('has-plane-cursor');
  }
  document.addEventListener('pointermove', event => {
    if (reduced.matches || !fine.matches || event.pointerType === 'touch' || event.target.closest('button, a[href], [role="link"], .location-gallery')) { clear(); return; }
    const nextMode = event.target.closest('.map-sheet') === stage ? 'plane' : 'round';
    if (nextMode !== mode) {
      clear(); mode = nextMode; cell = mode === 'plane' ? 3 : 8; scale = mode === 'plane' ? 1 : 48;
    }
    const bounds = stage.getBoundingClientRect();
    for (const point of event.getCoalescedEvents?.().length ? event.getCoalescedEvents() : [event]) {
      pointer = { x: point.clientX - (mode === 'plane' ? bounds.left : 0), y: point.clientY - (mode === 'plane' ? bounds.top : 0), time: point.timeStamp };
      samples.push(pointer);
    }
    lastInput = performance.now(); stage.classList.toggle('has-plane-cursor', mode === 'plane');
    if (!frame) frame = requestAnimationFrame(tick);
  }, { passive: true });
  document.addEventListener('pointerout', event => { if (!event.relatedTarget) clear(); });
  document.addEventListener('pointercancel', clear);
  window.addEventListener('blur', clear);
  window.addEventListener('scroll', clear, { passive: true });
  document.addEventListener('visibilitychange', clear);
  reduced.addEventListener('change', clear); fine.addEventListener('change', clear);
  function resize() {
    clear(); width = stage.clientWidth; height = stage.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    viewportWidth = innerWidth; viewportHeight = innerHeight;
    roundCanvas.width = Math.round(viewportWidth * dpr); roundCanvas.height = Math.round(viewportHeight * dpr);
    roundContext.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  new ResizeObserver(resize).observe(stage);
  window.addEventListener('resize', resize);
  function sampleLand() {
    const buffer = document.createElement('canvas'); buffer.width = 1200; buffer.height = 560;
    const source = buffer.getContext('2d', { willReadFrequently: true });
    source.drawImage(image, 0, 0, 1200, 560); land = source.getImageData(0, 0, 1200, 560).data;
  }
  if (image.complete && image.naturalWidth) sampleLand(); else image.addEventListener('load', sampleLand, { once: true });
})();
