(() => {
  const hero = document.querySelector('.pixel-stage');
  const ribbon = document.querySelector('.work-ribbon');
  if (!hero || !ribbon) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.className = 'pixel-connection';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const colors = ['#000000', '#3049d9', '#536bfa', '#f6ce25', '#fa593e', '#d8ee40'];
  const clamp = value => Math.max(0, Math.min(1, value));
  const mix = (a, b, t) => a + (b - a) * t;
  const curve = (a, b, c, d, t) => {
    const u = 1 - t;
    return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
  };
  let cells = [], geometry, target = 0, progress = 0, start = 0, finish = 1;
  let frame = 0, last = 0, draining = false, complete = false;

  function publish() {
    const nextDraining = !preference.matches && progress > 0;
    const nextComplete = preference.matches || progress === 1;
    if (nextDraining !== draining) {
      draining = nextDraining;
      hero.dispatchEvent(new CustomEvent('pixelpour:state', { detail: { draining } }));
    }
    if (nextComplete !== complete) {
      complete = nextComplete;
      ribbon.dispatchEvent(new CustomEvent('pixelpour:state', { detail: { complete } }));
    }
    canvas.dataset.phase = preference.matches ? 'reduced' : progress === 0 ? 'hero' : complete ? 'complete' : 'pouring';
  }

  function capture() {
    let snapshot;
    hero.dispatchEvent(new CustomEvent('pixelpour:capture', { detail: { receive: value => { snapshot = value; } } }));
    if (!snapshot?.cells.length || !geometry) return;
    const { source, destination } = geometry;
    // Match the resting ribbon's cells and colors so the handoff does not flash.
    const targets = new Map(colors.map(color => [color, []]));
    for (let x = 0; x < destination.width; x += 8) {
      for (let y = 8; y < destination.height - 8; y += 8) {
        const band = ((Math.floor((x - y * .8) / 8) % 12) + 12) % 12;
        if (band <= 7) targets.get(colors[Math.min(5, band)]).push({ x: destination.x + x, y: destination.y + y });
      }
    }
    const used = new Map();
    cells = snapshot.cells.map(cell => {
      const options = targets.get(cell.color) || [];
      const index = used.get(cell.color) || 0;
      used.set(cell.color, index + 1);
      const end = options[index % options.length] || { x: destination.x, y: destination.y + destination.height / 2 };
      return { x: source.x + cell.x, y: source.y + cell.y, color: cell.color, end,
        order: 1 - cell.y / snapshot.height + Math.sin(cell.x * .7 + cell.y) * .035 };
    }).sort((a, b) => a.order - b.order);
    cells.forEach((cell, index) => {
      cell.delay = index / Math.max(1, cells.length - 1) * .56;
      cell.lane = (index % geometry.lanes - (geometry.lanes - 1) / 2) * 8;
    });
  }

  function paint() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if (!geometry || preference.matches || document.hidden || progress === 0 || progress === 1) return;
    const { neckX, neckTop, neckBottom } = geometry;
    for (const cell of cells) {
      const t = clamp((progress - cell.delay) / .44);
      let x = cell.x, y = cell.y;
      const laneX = neckX + cell.lane;
      if (t > 0 && t < .42) {
        const f = t / .42;
        const drop = neckTop - cell.y;
        // Curved shoulders meet the straight throat with a vertical tangent.
        x = curve(cell.x, cell.x, laneX, laneX, f);
        y = curve(cell.y, cell.y + drop * .35, neckTop - Math.min(72, drop * .35), neckTop, f);
      } else if (t >= .42 && t < .62) {
        x = laneX;
        y = mix(neckTop, neckBottom, (t - .42) / .2);
      } else if (t >= .62) {
        const f = (t - .62) / .38;
        const drop = cell.end.y - neckBottom;
        // Leave vertically, then bend outward into a gently flared lower cup.
        x = curve(laneX, laneX, cell.end.x, cell.end.x, f);
        y = curve(neckBottom, neckBottom + drop * .55, cell.end.y - drop * .2, cell.end.y, f);
      }
      // Preserve exact endpoint alignment with each canvas's local grid.
      x = (t === 0 || t === 1 ? x : Math.round(x / 8) * 8) - scrollX;
      y = (t === 0 || t === 1 ? y : Math.round(y / 8) * 8) - scrollY;
      if (x < -8 || x > innerWidth || y < -8 || y > innerHeight) continue;
      ctx.fillStyle = cell.color;
      ctx.fillRect(x, y, 7, 7);
    }
  }

  function tick(now) {
    frame = 0;
    const dt = last ? Math.min(64, now - last) : 16;
    last = now;
    if (!cells.length) capture();
    if (preference.matches) progress = target;
    else if (cells.length) progress += (target - progress) * (1 - Math.exp(-dt / 100));
    if (Math.abs(target - progress) < .001) progress = target;
    publish();
    paint();
    if (!document.hidden && Math.abs(target - progress) > .001) frame = requestAnimationFrame(tick);
    else last = 0;
  }

  function update() {
    target = clamp((scrollY - start) / (finish - start));
    if (!draining) capture();
    if (document.hidden) {
      cancelAnimationFrame(frame); frame = 0; last = 0;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      return;
    }
    if (!frame) frame = requestAnimationFrame(tick);
  }

  function measure() {
    const h = hero.getBoundingClientRect(), r = ribbon.getBoundingClientRect();
    const narrow = innerWidth <= 700;
    const source = { x: h.left + scrollX, y: h.top + scrollY, width: h.width, height: h.height };
    const destination = { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
    const bottom = source.y + source.height;
    geometry = { source, destination, lanes: narrow ? 1 : 3,
      neckX: narrow ? innerWidth - 12 + scrollX : mix(source.x + source.width / 2, destination.x + destination.width / 2, .65),
      neckTop: narrow ? bottom + 8 : bottom + Math.max(32, (destination.y - bottom) * .35),
      neckBottom: destination.y - Math.min(80, Math.max(40, (destination.y - bottom) * .3)) };
    start = Math.max(0, source.y - innerHeight * .12);
    finish = Math.max(start + 240, destination.y - innerHeight * .25);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    capture();
    update();
  }
  const observer = new ResizeObserver(measure);
  observer.observe(hero);
  observer.observe(document.querySelector('.intro'));
  observer.observe(ribbon.parentElement);
  window.addEventListener('resize', measure);
  window.addEventListener('scroll', update, { passive: true });
  preference.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
})();
