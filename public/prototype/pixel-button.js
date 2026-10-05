(() => {
  const button = document.querySelector('.side-projects-button');
  if (!button) return;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;
  canvas.setAttribute('aria-hidden', 'true');
  button.prepend(canvas);
  button.classList.add('is-pixel-ready');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const colors = ['#3049d9', '#536bfa', '#f6ce25', '#fa593e', '#d8ee40'];
  const cell = 8;
  let width = 0, height = 0, frame = 0, timer = 0;
  let hovered = false, focused = false, visible = true, activating = false;
  const active = () => hovered || focused || activating;
  const running = () => active() && visible && !document.hidden && !preference.matches;

  function absorb() {
    document.dispatchEvent(new Event('pixelcursor:absorb'));
  }

  function paint(now = performance.now()) {
    context.clearRect(0, 0, width, height);
    // The flow only uses time and grid coordinates, never the pointer position.
    const phase = preference.matches ? 0 : Math.floor(now / 90);
    for (let y = 0; y < height; y += cell) {
      for (let x = 0; x < width; x += cell) {
        const column = x / cell, row = y / cell;
        const band = ((column - phase + row * 2) % 20 + 20) % 20;
        const colored = active() && (activating || band < 14);
        context.fillStyle = colored
          ? colors[Math.floor(band / 3) % colors.length]
          : '#242424';
        context.fillRect(x, y, 7, 7);
      }
    }
  }

  function tick(now) {
    frame = 0;
    paint(now);
    if (running()) frame = requestAnimationFrame(tick);
  }

  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    paint();
    if (running()) frame = requestAnimationFrame(tick);
  }

  function reset() {
    clearTimeout(timer);
    timer = 0;
    activating = hovered = focused = false;
    button.removeAttribute('data-pixel-active');
    sync();
  }

  button.addEventListener('pointerenter', event => {
    absorb();
    hovered = event.pointerType !== 'touch';
    sync();
  });
  button.addEventListener('pointerleave', () => { hovered = false; sync(); });
  button.addEventListener('pointercancel', reset);
  button.addEventListener('focusin', () => { focused = true; sync(); });
  button.addEventListener('focusout', () => { focused = false; sync(); });
  button.addEventListener('pixelbutton:activate', event => {
    event.preventDefault();
    if (activating) return;
    absorb();
    activating = true;
    button.dataset.pixelActive = 'true';
    sync();
    timer = setTimeout(() => {
      activating = false;
      timer = 0;
      button.removeAttribute('data-pixel-active');
      event.detail.complete();
      sync();
    }, preference.matches ? 100 : 520);
  });
  new ResizeObserver(() => {
    width = button.clientWidth;
    height = button.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    sync();
  }).observe(button);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(button);
  preference.addEventListener('change', sync);
  window.addEventListener('blur', reset);
  document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
})();
