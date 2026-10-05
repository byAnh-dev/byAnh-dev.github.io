/* Scroll opens the dark chapter. Time only drives the finite topic reel. */
(() => {
  const section = document.querySelector('.rabbit-hole');
  if (!section) return;
  const stage = section.querySelector('.rabbit-stage');
  const canvas = section.querySelector('.rabbit-collapse');
  const ink = canvas.getContext('2d');
  if (!ink) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const machine = section.querySelector('.rabbit-machine');
  const reel = section.querySelector('.rabbit-reel');
  const status = section.querySelector('.rabbit-status');
  const noise = section.querySelector('.rabbit-digital-noise');
  const finalTopic = section.querySelector('.rabbit-topic-name').textContent;
  const interests = document.querySelector('.interests');
  const donor = interests.querySelector('.interest:last-child .tool-lane canvas');
  const clamp = value => Math.max(0, Math.min(1, value));
  const hash = (x, y) => { const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return n - Math.floor(n); };
  const topics = ['Agent memory', 'Tool use', 'Context windows', 'LLM routing', 'Local models', 'Browser agents', 'Retrieval', 'Planning loops', 'AI workflows', 'Model evals', 'MCP servers', 'Code agents'];
  const steps = 64, duration = 4200;
  let width = 0, height = 0, top = 0, travel = 1, lineHeight = 1;
  let cells = [], frame = 0, previous = 0, elapsed = 0, complete = false;
  let lastPaint = -1, lastNoise = -1, progress = 0;
  let donorPixels = null, donorBounds = null;
  let writingElapsed = 0;
  const writingDuration = 800;
  const reveals = ['.rabbit-kicker', '#rabbit-heading', '.rabbit-exploring', '.rabbit-writing', '.rabbit-discovery'].map(selector => {
    const element = section.querySelector(selector);
    element.classList.add('rabbit-pixel-reveal');
    if (element.querySelector('a')) element.inert = true;
    return { element, width: 0, height: 0, cells: [], step: -1 };
  });

  function measureReveals() {
    for (const reveal of reveals) {
      reveal.width = reveal.element.offsetWidth;
      reveal.height = reveal.element.offsetHeight;
      reveal.cells = [];
      for (let y = 0; y < reveal.height; y += 8) {
        for (let x = 0; x < reveal.width; x += 8) {
          const distance = Math.abs((x + 4) / reveal.width - .5) * 2;
          reveal.cells.push({ x, y, delay: hash(x, y) * .8 + distance * .2 });
        }
      }
      reveal.step = -1;
    }
  }

  function revealPixels(reveal, value) {
    const step = preference.matches ? 32 : Math.round(clamp(value) * 32);
    if (step === reveal.step) return;
    reveal.step = step;
    if (reveal.element.querySelector('a')) reveal.element.inert = step < 32;
    reveal.element.dataset.pixelReveal = step === 32 ? 'complete' : step === 0 ? 'hidden' : 'assembling';
    let mask = 'none';
    if (step < 32) {
      // Reveal the real HTML glyphs through hard 8px tiles. No opacity tween,
      // blur, movement, or duplicated text; the final type stays fully crisp.
      const path = reveal.cells.filter(cell => cell.delay < step / 32)
        .map(cell => `M${cell.x} ${cell.y}h8v8h-8z`).join('');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${reveal.width}" height="${reveal.height}" viewBox="0 0 ${reveal.width} ${reveal.height}"><path fill="white" shape-rendering="crispEdges" d="${path}"/></svg>`;
      mask = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    }
    reveal.element.style.maskImage = mask;
    reveal.element.style.webkitMaskImage = mask;
  }

  for (let i = 0; i <= steps; i++) {
    const line = document.createElement('span');
    line.textContent = i === steps ? finalTopic : topics[(i * 7 + Math.floor(i / topics.length)) % topics.length];
    reel.append(line);
  }
  for (let i = 0; i < 12; i++) noise.append(document.createElement('i'));

  function sampleNeighbors() {
    // Copy the actual immediately adjacent tool pixels once, never a random palette.
    // White background fragments stay white; ink/accent fragments retain local RGB.
    if (!donor.width || !donor.height) return;
    try {
      donorPixels = donor.getContext('2d').getImageData(0, 0, donor.width, donor.height);
      donorBounds = donor.getBoundingClientRect();
    } catch { donorPixels = null; }
  }

  function neighborColor(x, y) {
    if (!donorPixels || !donorBounds.width || y >= donorBounds.height) return [255, 255, 255];
    const px = Math.floor((x - donorBounds.left) / donorBounds.width * donorPixels.width);
    const py = Math.floor(y / donorBounds.height * donorPixels.height);
    if (px < 0 || px >= donorPixels.width || py >= donorPixels.height) return [255, 255, 255];
    const index = (py * donorPixels.width + px) * 4;
    const rgba = donorPixels.data, alpha = rgba[index + 3] / 255;
    return [0, 1, 2].map(c => Math.round(rgba[index + c] * alpha + 255 * (1 - alpha)));
  }

  function buildCells() {
    cells = [];
    const centerX = width / 2, centerY = height / 2;
    const outerRadius = Math.hypot(centerX, centerY);
    for (let y = 0; y < height; y += 32) {
      for (let x = 0; x < width; x += 32) {
        const offsetX = x + 16 - centerX, offsetY = y + 16 - centerY;
        const radius = Math.hypot(offsetX, offsetY) / outerRadius;
        const angle = Math.atan2(offsetY, offsetX);
        // A jagged fracture spreads from the center to the edges and corners.
        // Angular variation keeps the opening from becoming a perfect circle.
        const fracture = Math.sin(angle * 7) * .035 + Math.sin(angle * 11) * .018;
        cells.push({ x, y, delay: clamp(radius * (.62 + fracture) + hash(x, y) * .04),
          drift: (hash(y, x) - .5) * 64, color: neighborColor(x + 16, y + 16) });
      }
    }
  }

  function paintCollapse(value) {
    const quantized = Math.round(value * 160);
    if (quantized === lastPaint) return;
    lastPaint = quantized;
    ink.clearRect(0, 0, width, height);
    if (value >= 1) return;
    if (value <= 0) { ink.fillStyle = '#fff'; ink.fillRect(0, 0, width, height); return; }
    // Accent trails follow earlier positions on the same falling paths. Paint
    // them first so the original page fragments remain the leading surface.
    const trailColors = ['#fa593e', '#f6ce25', '#3049d9'];
    for (const cell of cells) {
      const fall = (value - cell.delay) / .28;
      if (fall < .08 || fall >= 1) continue;
      for (let part = 0; part < 4; part++) {
        if (hash(cell.x + part * 8, cell.y) > .35) continue;
        for (let tail = 6; tail >= 1; tail--) {
          const earlier = Math.max(0, fall - tail * .012);
          const point = fragmentPosition(cell, part, earlier);
          const size = tail > 3 ? 4 : 8;
          ink.fillStyle = trailColors[Math.floor((tail - 1) / 2)];
          ink.fillRect(point.x, point.y, size, size);
        }
      }
    }
    for (const cell of cells) {
      const fall = clamp((value - cell.delay) / .28);
      if (fall >= 1) continue;
      if (fall === 0) {
        ink.fillStyle = '#fff';
        ink.fillRect(cell.x, cell.y, 32, 32);
        continue;
      }
      // Four crisp fragments fall along neighboring paths. Each shade is derived
      // from that fragment's own source color and the black destination beneath it.
      const shade = Math.floor(fall * 5) / 7;
      ink.fillStyle = `rgb(${cell.color.map(c => Math.round(c + (8 - c) * shade)).join(',')})`;
      const size = fall < .32 ? 16 : fall < .72 ? 8 : 4;
      for (let part = 0; part < 4; part++) {
        const { x, y } = fragmentPosition(cell, part, fall);
        ink.fillRect(x, y, size, size);
      }
    }
  }

  function fragmentPosition(cell, part, fall) {
    const dx = (part % 2) * 16, dy = Math.floor(part / 2) * 16;
    const sourceX = cell.x + dx, sourceY = cell.y + dy;
    // Broken ground slips into the central opening, then falls beneath it.
    const inward = fall * .32;
    const drop = fall * fall * (height * .55 + part * 24);
    return {
      x: Math.round((sourceX + (width / 2 - sourceX) * inward + cell.drift * fall * .5) / 4) * 4,
      y: Math.round((sourceY + (height / 2 - sourceY) * inward + drop) / 4) * 4,
    };
  }

  function finishSlot() {
    complete = true;
    elapsed = duration;
    machine.classList.remove('is-spinning');
    noise.replaceChildren();
    status.textContent = 'CURRENT THREAD / 01';
    section.dataset.slot = 'settled';
  }

  function paintSlot(now, dt) {
    if (complete || progress < .68) return;
    elapsed = Math.min(duration, elapsed + dt);
    if (elapsed >= duration) { finishSlot(); return; }
    machine.classList.add('is-spinning');
    section.dataset.slot = 'spinning';
    status.textContent = 'FOLLOWING THE THREAD…';
    // Continuous vertical motion: many options rush by, then individual rows settle.
    const t = elapsed / duration;
    const position = steps * (1 - Math.pow(1 - t, 3));
    reel.style.transform = `translateY(${-position * lineHeight}px)`;
    const noiseStep = Math.floor(now / 90);
    if (noiseStep !== lastNoise) {
      lastNoise = noiseStep;
      [...noise.children].forEach((pixel, i) => {
        pixel.style.left = `${hash(noiseStep, i) * 100}%`;
        pixel.style.top = `${hash(i, noiseStep) * 100}%`;
        pixel.style.opacity = String(t > .8 ? 0 : .08 + hash(i + 1, noiseStep) * .16);
        pixel.style.color = i % 2 ? '#bcbcbc' : '#f5f5f3';
      });
    }
  }

  function tick(now) {
    frame = 0;
    if (document.hidden) { previous = 0; return; }
    progress = preference.matches || section.classList.contains('is-locked') ? 1 : clamp((scrollY - top) / travel);
    const inView = stage.getBoundingClientRect().bottom > 0 && section.getBoundingClientRect().top < innerHeight;
    // Finish entering before pinning the room. The reel and wand keep revealing in place.
    const atEntrance = preference.matches ? section.getBoundingClientRect().top <= 0 : progress >= .82;
    if (inView && atEntrance) window.dispatchEvent(new Event('rabbit:entered'));
    const dt = previous ? Math.min(now - previous, 64) : 0;
    previous = now;
    paintCollapse(clamp(progress / .58));
    revealPixels(reveals[0], (progress - .5) / .14);
    revealPixels(reveals[1], (progress - .5) / .14);
    revealPixels(reveals[2], (progress - .61) / .09);
    section.dataset.collapse = progress === 0 ? 'intact' : progress < .58 ? 'falling' : 'gone';
    if (preference.matches) finishSlot();
    if (inView) paintSlot(now, dt);
    const showWriting = complete && progress >= .82;
    if (preference.matches) writingElapsed = writingDuration;
    else if (inView && showWriting) writingElapsed = Math.min(writingDuration, writingElapsed + dt);
    revealPixels(reveals[3], showWriting ? writingElapsed / writingDuration : 0);
    revealPixels(reveals[4], showWriting ? writingElapsed / writingDuration : 0);
    const assemblingWriting = showWriting && writingElapsed < writingDuration;
    if (inView && ((progress >= .68 && !complete) || assemblingWriting)) frame = requestAnimationFrame(tick);
    else previous = 0;
  }

  function requestTick() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
  }

  function measure() {
    width = stage.clientWidth;
    height = stage.offsetHeight;
    section.style.setProperty('--rabbit-stage-height', `${height}px`);
    top = section.getBoundingClientRect().top + scrollY;
    travel = Math.max(1, section.offsetHeight - height);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ink.setTransform(dpr, 0, 0, dpr, 0, 0);
    lineHeight = parseFloat(getComputedStyle(reel).lineHeight);
    sampleNeighbors();
    buildCells();
    measureReveals();
    lastPaint = -1;
    requestTick();
  }

  section.classList.add('is-enhanced');
  section.dataset.slot = 'waiting';
  const resize = new ResizeObserver(measure);
  resize.observe(stage);
  resize.observe(interests);
  window.addEventListener('resize', measure);
  window.addEventListener('scroll', requestTick, { passive: true });
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(frame); frame = 0; previous = 0; requestTick();
  });
  preference.addEventListener('change', measure);
  document.fonts.ready.then(measure);
  measure();

  // Navigation goes directly to the readable chapter; ordinary scrolling sees the fall.
  window.addEventListener('rabbit:request-entry', () => {
    measure();
    window.scrollTo({ top: top + travel * .86, behavior: 'instant' });
    requestTick();
  });
  document.querySelectorAll('a[href="#rabbit-hole"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      history.replaceState(null, '', '#rabbit-hole');
      window.scrollTo({ top: top + travel * .86, behavior: preference.matches ? 'instant' : 'smooth' });
    });
  });
  if (location.hash === '#rabbit-hole') {
    // Run after native fragment/scroll restoration, which otherwise jumps back
    // to the white entrance after the reel has already started on a reload.
    window.addEventListener('pageshow', () => {
      document.fonts.ready.then(() => requestAnimationFrame(() => {
        measure();
        window.scrollTo({ top: top + travel * .86, behavior: 'instant' });
      }));
    });
  }
})();
