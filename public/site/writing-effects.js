(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer: fine)');
  const art = document.querySelector('.writing-pixel-note');
  let animations = [];

  // One short assembly, then a static illustration. No looping while reading.
  function settle() {
    animations.forEach(animation => animation.cancel());
    animations = [];
  }
  if (art && !reduced.matches) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (reduced.matches) return;
      animations = [...art.querySelectorAll('.pencil-pixel')].map((pixel, index) => {
        const x = Number(pixel.getAttribute('x')), y = Number(pixel.getAttribute('y'));
        const startX = 16 + (index * 37 % 23) * 8;
        const startY = 8 + (index * 13 % 11) * 8;
        return pixel.animate([
          { transform: `translate(${startX - x}px, ${startY - y}px)` },
          { transform: 'translate(0, 0)' }
        ], { duration: 1200, delay: index % 8 * 48, easing: 'cubic-bezier(.22,.8,.25,1)', fill: 'backwards' });
      });
    });
    observer.observe(art);
  }

  // Same 8px cells, solid palette, speed taper, and decay as the homepage brush.
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;
  canvas.className = 'pixel-cursor';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const cell = 8, cutoff = .08, decayMs = 55;
  const trail = new Map(), samples = [];
  const quietTargets = 'a[href], button, input, textarea, select, [role="link"]';
  const colorAt = value => value < .12 ? '#000000' : value < .23 ? '#3049d9'
    : value < .33 ? '#536bfa' : value < .55 ? '#f6ce25' : value < .69 ? '#fa593e' : '#d8ee40';
  let width = 0, height = 0, pointer = null, previous = null, radius = 48;
  let frame = 0, last = 0, lastInput = 0;

  function stamp(x, y, size) {
    for (let row = Math.floor((y - size) / cell); row <= (y + size) / cell; row++) {
      for (let column = Math.floor((x - size) / cell); column <= (x + size) / cell; column++) {
        const noise = Math.sin(column * 127.1 + row * 311.7) * 43758.5453;
        const edge = size + (noise - Math.floor(noise) - .5) * cell;
        const distance = Math.hypot((column + .5) * cell - x, (row + .5) * cell - y);
        const strength = Math.max(0, 1 - (distance / edge) ** 2);
        if (strength < cutoff) continue;
        const key = `${column},${row}`;
        if (!trail.has(key) || trail.get(key).strength < strength) trail.set(key, { column, row, strength });
      }
    }
  }
  function tick(now) {
    frame = 0;
    const dt = last ? Math.min(now - last, 100) : 0;
    last = now;
    for (const [key, mark] of trail) {
      mark.strength *= Math.exp(-dt / decayMs);
      if (mark.strength < cutoff) trail.delete(key);
    }
    for (const point of samples) {
      if (previous) {
        const dx = point.x - previous.x, dy = point.y - previous.y, distance = Math.hypot(dx, dy);
        const interval = Math.max(1, Math.min(point.time - previous.time, 64));
        const target = 16 + 32 / (1 + (distance / interval / .8) ** 2);
        const startRadius = radius;
        radius += (target - radius) * (1 - Math.exp(-interval / 40));
        const steps = Math.max(1, Math.ceil(distance / (cell / 2)));
        for (let i = 1; i <= steps; i++) {
          stamp(previous.x + dx * i / steps, previous.y + dy * i / steps, startRadius + (radius - startRadius) * i / steps);
        }
      } else stamp(point.x, point.y, radius);
      previous = point;
    }
    samples.length = 0;
    if (pointer) {
      if (now - lastInput > 60) radius += (48 - radius) * (1 - Math.exp(-dt / 120));
      stamp(pointer.x, pointer.y, radius);
    }
    context.clearRect(0, 0, width, height);
    for (const { column, row, strength } of trail.values()) {
      context.fillStyle = colorAt(strength * .78);
      context.fillRect(column * cell, row * cell, cell - 1, cell - 1);
    }
    if (pointer || trail.size) frame = requestAnimationFrame(tick);
    else last = 0;
  }
  function clear() {
    cancelAnimationFrame(frame);
    frame = last = 0;
    pointer = previous = null;
    radius = 48;
    samples.length = 0;
    trail.clear();
    context.clearRect(0, 0, width, height);
  }
  document.addEventListener('pointermove', event => {
    if (reduced.matches || !fine.matches || document.hidden || event.pointerType === 'touch' || event.target.closest?.(quietTargets)) { clear(); return; }
    const coalesced = event.getCoalescedEvents?.() || [];
    for (const point of coalesced.length ? coalesced : [event]) {
      pointer = { x: point.clientX, y: point.clientY, time: point.timeStamp };
      samples.push(pointer);
    }
    lastInput = performance.now();
    if (!frame) frame = requestAnimationFrame(tick);
  }, { passive: true });
  document.addEventListener('pointerover', event => { if (event.target.closest?.(quietTargets)) clear(); }, { passive: true });
  document.addEventListener('pointerout', event => { if (!event.relatedTarget) clear(); });
  document.addEventListener('pointercancel', clear);
  window.addEventListener('blur', clear);
  window.addEventListener('scroll', clear, { passive: true });
  document.addEventListener('visibilitychange', () => { clear(); if (document.hidden) settle(); });
  reduced.addEventListener('change', () => { clear(); if (reduced.matches) settle(); });
  fine.addEventListener('change', clear);
  function resize() {
    clear(); width = innerWidth; height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();
})();
