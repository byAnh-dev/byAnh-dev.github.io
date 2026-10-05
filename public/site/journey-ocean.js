(() => {
  const root = document.querySelector('.journey-page');
  const canvas = root?.querySelector('.ocean-pixels');
  const context = canvas?.getContext('2d');
  const map = root?.querySelector('.world-map');
  if (!context || !map) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const palette = ['#536bfa', '#3049d9', '#f6ce25', '#161e34'];
  const hash = n => { const value = Math.sin(n * 127.1 + 311.7) * 43758.5453; return value - Math.floor(value); };
  const particles = Array.from({ length: 180 }, (_, i) => ({
    x: hash(i + 1) * 1200, y: Math.floor(hash(i + 301) * 93) * 6,
    life: 7000 + hash(i + 601) * 9000, phase: hash(i + 901),
    distance: 72 + hash(i + 1201) * 96, color: palette[i % palette.length],
  }));
  let land, frame = 0, last = 0, elapsed = 0, visible = true;
  function draw() {
    context.clearRect(0, 0, 1200, 560);
    for (const particle of particles) {
      const phase = (elapsed / particle.life + particle.phase) % 1;
      const x = Math.floor(((particle.x + phase * particle.distance) % 1200) / 6) * 6;
      // Sample at the center of the land cell, including its white grid gutter.
      // This keeps every ocean pixel off the continents, even at coastlines.
      const sample = ((particle.y + 2) * 1200 + x + 2) * 4 + 3;
      if (land[sample]) continue;
      context.globalAlpha = Math.sin(phase * Math.PI) ** 2 * .55;
      context.fillStyle = particle.color;
      context.fillRect(x, particle.y, 5, 5);
    }
    context.globalAlpha = 1;
  }
  function tick(now) {
    frame = 0;
    if (!last || now - last >= 40) {
      elapsed += last ? Math.min(now - last, 100) : 0;
      last = now; draw();
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    if (!land) return;
    draw();
    if (!reduced.matches && !document.hidden && visible && !root.classList.contains('journey-motion-paused')) frame = requestAnimationFrame(tick);
  }
  function load() {
    const mask = document.createElement('canvas'); mask.width = 1200; mask.height = 560;
    const source = mask.getContext('2d', { willReadFrequently: true });
    source.drawImage(map, 0, 0, 1200, 560);
    land = source.getImageData(0, 0, 1200, 560).data;
    sync();
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting; root.classList.toggle('journey-offscreen', !visible); sync();
  }).observe(canvas);
  root.addEventListener('journey:motion', sync);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  if (map.complete && map.naturalWidth) load(); else map.addEventListener('load', load, { once: true });
})();
