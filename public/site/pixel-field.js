(() => {
  const stage = document.querySelector('.pixel-stage');
  const canvas = stage?.querySelector('canvas');
  const context = canvas?.getContext('2d', { alpha: false });
  if (!context) return;

  // Cache the untouched field so the brush never samples its own marks.
  const field = document.createElement('canvas');
  const fieldContext = field.getContext('2d', { alpha: false });
  const brush = document.createElement('canvas');
  const brushContext = brush.getContext('2d');
  if (!fieldContext || !brushContext) return;
  brush.className = 'pixel-cursor';
  brush.setAttribute('aria-hidden', 'true');
  document.body.append(brush);

  const cell = 8, maxRadius = 48, minRadius = 16, decayMs = 55, cutoff = .08;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const trail = new Map();
  const ripples = [];
  const rippleDuration = 560, rippleRadius = maxRadius + cell * 2;
  let reducedMotion = preference.matches, visible = true, pouring = false;
  let fieldCells = [];
  let width = 0, height = 0, columns = 0, colored = [];
  let viewportWidth = 0, viewportHeight = 0;
  let originX = 0, originY = 0;
  let frame = 0, last = 0, fieldAge = 0, elapsed = 0;
  let pointer = null, previous = null;
  const quietTargets = 'a[href], [role="link"], .doodle-board, .side-projects-button.is-pixel-ready, .rabbit-wand';
  // Samples use document-local coordinates and monotonic timestamps, in ms.
  /** @type {Array<{x: number, y: number, time: number}>} */
  const samples = [];
  let brushRadius = maxRadius, lastInput = 0;

  const hash = (x, y) => {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return n - Math.floor(n);
  };
  const noise = (x, y) => {
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
    return (hash(ix, iy) * (1 - u) + hash(ix + 1, iy) * u) * (1 - v)
      + (hash(ix, iy + 1) * (1 - u) + hash(ix + 1, iy + 1) * u) * v;
  };
  const colorAt = value => value < .12 ? '#000000' : value < .23 ? '#3049d9'
    : value < .33 ? '#536bfa' : value < .55 ? '#f6ce25'
    : value < .69 ? '#fa593e' : '#d8ee40';

  function drawField() {
    fieldCells = [];
    fieldContext.fillStyle = '#fff';
    fieldContext.fillRect(0, 0, width, height);
    const t = elapsed * .0001;
    for (let y = 0; y < height; y += cell) {
      for (let x = 0; x < width; x += cell) {
        const nx = x / width, ny = y / height;
        const value = .52 + Math.sin(nx * 9 - .7 + t) * .13
          + Math.sin(nx * 19 + .5 - t * .6) * .065
          + noise(nx * 13 + t * .35, ny * 5) * .19
          + noise(nx * 43, ny * 17 + t * .25) * .07 - ny * .9;
        const occupied = value > .03 && !(value < .12 && hash(x, y) > value * 8);
        colored[(y / cell) * columns + x / cell] = occupied;
        if (!occupied && hash(x, y) < .58) continue;
        fieldContext.fillStyle = occupied ? colorAt(value) : '#f3f4f5';
        if (occupied) fieldCells.push({ x, y, color: fieldContext.fillStyle });
        fieldContext.fillRect(x, y, cell - 1, cell - 1);
      }
    }
  }

  function stamp(x, y, radius) {
    const minColumn = Math.floor((x - radius) / cell);
    const maxColumn = Math.floor((x + radius) / cell);
    const minRow = Math.floor((y - radius) / cell);
    const maxRow = Math.floor((y + radius) / cell);
    for (let row = minRow; row <= maxRow; row++) {
      for (let column = minColumn; column <= maxColumn; column++) {
        const distance = Math.hypot((column + .5) * cell - x, (row + .5) * cell - y);
        const edge = radius + (hash(column, row) - .5) * cell;
        const strength = Math.max(0, 1 - (distance / edge) ** 2);
        if (strength < cutoff) continue;
        const key = `${column},${row}`;
        const old = trail.get(key);
        if (!old || strength > old.strength) trail.set(key, { column, row, strength });
      }
    }
  }

  function capture(time = performance.now()) {
    if (!pointer) return;
    const x = pointer.x + scrollX - originX, y = pointer.y + scrollY - originY;
    lastInput = time;
    if (reducedMotion) {
      trail.clear();
      stamp(x, y, maxRadius);
      paint();
    } else {
      samples.push({ x, y, time });
    }
  }

  function follow(now, delta) {
    for (const point of samples) {
      if (previous) {
        const dx = point.x - previous.x, dy = point.y - previous.y;
        const distance = Math.hypot(dx, dy);
        // Bound the time after a pause so the first flick also narrows the brush.
        const dt = Math.max(1, Math.min(point.time - previous.time, 64));
        const speed = distance / dt;
        const targetRadius = minRadius + (maxRadius - minRadius) / (1 + (speed / .8) ** 2);
        const startRadius = brushRadius;
        brushRadius += (targetRadius - brushRadius) * (1 - Math.exp(-dt / 40));
        const steps = Math.max(1, Math.ceil(distance / (cell / 2)));
        for (let i = 1; i <= steps; i++) {
          const fraction = i / steps;
          stamp(previous.x + dx * fraction, previous.y + dy * fraction,
            startRadius + (brushRadius - startRadius) * fraction);
        }
      } else {
        stamp(point.x, point.y, brushRadius);
      }
      previous = point;
    }
    samples.length = 0;
    if (pointer && previous) {
      // A short quiet period prevents the head pulsing between input events.
      if (now - lastInput > 60) {
        brushRadius += (maxRadius - brushRadius) * (1 - Math.exp(-delta / 120));
      }
      stamp(previous.x, previous.y, brushRadius);
    }
  }

  function paint(now = performance.now()) {
    if (visible && !pouring) context.drawImage(field, 0, 0, width, height);
    brushContext.clearRect(0, 0, viewportWidth, viewportHeight);
    const rings = ripples.map(ripple => ({
      ...ripple,
      radius: rippleRadius * Math.min(1, (now - ripple.started) / rippleDuration)
    }));
    for (const { column, row, strength } of trail.values()) {
      const x = column * cell, y = row * cell;
      const inField = x >= 0 && y >= 0 && x < width && y < height;
      const target = inField ? context : brushContext;
      if (inField && !visible) continue;
      const drawX = inField ? x : x + originX - scrollX;
      const drawY = inField ? y : y + originY - scrollY;
      if (!inField && (drawX < -cell || drawY < -cell || drawX > viewportWidth || drawY > viewportHeight)) continue;
      const inRing = rings.some(ring => Math.abs(
        Math.hypot(x + cell / 2 - ring.x, y + cell / 2 - ring.y) - ring.radius
      ) < cell);
      // Cut a white ring through the existing pixels without changing their strength.
      // Each frame redraws the original trail behind the expanding ring.
      // Solid palette steps, then removal. Never fade the pixels toward gray.
      target.fillStyle = inRing || (inField && colored[row * columns + column]) ? '#fff' : colorAt(strength * .78);
      target.fillRect(drawX, drawY, inField ? Math.min(cell - 1, width - x) : cell - 1,
        inField ? Math.min(cell - 1, height - y) : cell - 1);
    }
    brush.dataset.active = String(Boolean(pointer));
  }

  function tick(now) {
    frame = 0;
    const delta = last ? Math.min(now - last, 100) : 0;
    last = now;
    while (ripples.length && now - ripples[0].started >= rippleDuration) ripples.shift();
    const decay = Math.exp(-delta / decayMs);
    for (const [key, mark] of trail) {
      mark.strength *= decay;
      if (mark.strength < cutoff) trail.delete(key);
    }
    follow(now, delta);
    if (visible && !pouring) {
      elapsed += delta;
      fieldAge += delta;
      if (fieldAge >= 40) { drawField(); fieldAge = 0; }
    }
    paint(now);
    if ((visible && !pouring) || pointer || trail.size || ripples.length) frame = requestAnimationFrame(tick);
    else last = 0;
  }

  function sync() {
    canvas.dataset.motion = reducedMotion ? 'reduced' : pouring ? 'pouring' : visible && !document.hidden ? 'playing' : 'suspended';
    if (reducedMotion || document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    } else if (!frame && ((visible && !pouring) || pointer || trail.size || ripples.length)) {
      frame = requestAnimationFrame(tick);
    }
  }

  function releasePointer() {
    pointer = previous = null;
    samples.length = 0;
    brushRadius = maxRadius;
    brush.dataset.active = 'false';
    if (reducedMotion || document.hidden) { trail.clear(); ripples.length = 0; paint(); }
    sync();
  }

  // Transfer the real field cells, excluding the independent cursor brush.
  stage.addEventListener('pixelpour:capture', event => {
    event.detail.receive({ width, height, cells: fieldCells });
  });
  stage.addEventListener('pixelpour:state', event => {
    pouring = event.detail.draining && !reducedMotion;
    stage.classList.toggle('is-pouring', pouring);
    if (!pouring) { drawField(); paint(); }
    sync();
  });

  document.addEventListener('pointermove', event => {
    if (document.querySelector('.rabbit-wand.is-casting')) { absorbPointer(); return; }
    if (event.target.closest?.(quietTargets)) { absorbPointer(); return; }
    if (event.pointerType === 'touch') { releasePointer(); return; }
    const coalesced = event.getCoalescedEvents?.() || [];
    for (const point of coalesced.length ? coalesced : [event]) {
      pointer = { x: point.clientX, y: point.clientY };
      capture(point.timeStamp);
    }
    sync();
  }, { passive: true });
  document.addEventListener('click', event => {
    if (event.button !== 0 || event.detail === 0 || reducedMotion || document.hidden) return;
    if (document.querySelector('.rabbit-wand.is-casting')) return;
    if (event.target.closest?.(quietTargets)) return;
    // Bound overlapping waves when clicking rapidly; keep their document position on scroll.
    if (ripples.length >= 8) ripples.shift();
    ripples.push({
      x: event.clientX + scrollX - originX,
      y: event.clientY + scrollY - originY,
      started: performance.now()
    });
    sync();
  }, { passive: true });
  function absorbPointer() {
    releasePointer();
    trail.clear();
    ripples.length = 0;
    paint();
  }
  document.addEventListener('pixelcursor:absorb', absorbPointer);
  document.addEventListener('pointerover', event => {
    if (event.target.closest?.(quietTargets)) absorbPointer();
  }, { passive: true });
  // Clear existing pixels immediately, including when entering a stationary wand.
  const wand = document.querySelector('.rabbit-wand');
  wand?.addEventListener('pointerenter', absorbPointer);
  wand?.addEventListener('focus', absorbPointer);
  document.addEventListener('pointerout', event => {
    if (!event.relatedTarget) releasePointer();
  });
  document.addEventListener('pointercancel', releasePointer);
  window.addEventListener('blur', releasePointer);
  window.addEventListener('scroll', () => {
    if (pointer && document.elementFromPoint(pointer.x, pointer.y)?.closest(quietTargets)) {
      absorbPointer();
      return;
    }
    // Scrolling moves the document under the brush; sweep that whole segment.
    capture();
    sync();
  }, { passive: true });

  function resize() {
    const bounds = stage.getBoundingClientRect();
    width = stage.clientWidth;
    height = stage.clientHeight;
    originX = bounds.left + scrollX;
    originY = bounds.top + scrollY;
    columns = Math.ceil(width / cell);
    colored = new Uint8Array(columns * Math.ceil(height / cell));
    viewportWidth = innerWidth;
    viewportHeight = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    for (const [surface, ctx, w, h] of [[canvas, context, width, height], [field, fieldContext, width, height],
      [brush, brushContext, viewportWidth, viewportHeight]]) {
      surface.width = Math.round(w * dpr);
      surface.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    trail.clear();
    ripples.length = 0;
    previous = null;
    samples.length = 0;
    brushRadius = maxRadius;
    drawField();
    capture();
    paint();
    canvas.classList.add('ready');
    sync();
  }
  new ResizeObserver(resize).observe(stage);
  window.addEventListener('resize', resize);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) { drawField(); paint(); }
    sync();
  }).observe(stage);
  preference.addEventListener('change', () => {
    reducedMotion = preference.matches;
    trail.clear();
    ripples.length = 0;
    previous = null;
    samples.length = 0;
    brushRadius = maxRadius;
    capture();
    paint();
    sync();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) releasePointer();
    else sync();
  });
})();
