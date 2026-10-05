(() => {
  document.querySelectorAll('.tool-marquee').forEach(initMarquee);
  function initMarquee(root) {
    const toggle = root.querySelector('.marquee-toggle');
    const label = root.getAttribute('aria-label').toLowerCase();
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const palette = ['#000000', '#3049d9', '#536bfa', '#f6ce25', '#fa593e', '#d8ee40'];
    const lanes = [...root.querySelectorAll('.tool-lane')].map(element => {
      const canvas = element.querySelector('canvas');
      const buffer = document.createElement('canvas');
      return {
        element, canvas, context: canvas.getContext('2d'), buffer,
        ink: buffer.getContext('2d', { willReadFrequently: true }),
        words: [...element.querySelectorAll('li')].map(item => item.textContent),
        direction: Number(element.dataset.direction), offset: 0,
        width: 0, height: 0, cycle: 0, fontSize: 0, items: [],
      };
    });
    // Ordinary HTML tool lists remain visible if a canvas context is unavailable.
    if (lanes.some(lane => !lane.context || !lane.ink)) return;
    let visible = false, paused = false, hovered = false, focused = false, frame = 0, last = 0;
    let initialized = false;
    const running = () => initialized && visible && !paused && !hovered && !focused && !preference.matches && !document.hidden;

    function paint(lane) {
      const { context, ink, buffer, width, height, fontSize, cycle } = lane;
      if (!width || !cycle) return;
      ink.clearRect(0, 0, width, height);
      ink.font = `400 ${fontSize}px Malinton, Arial, sans-serif`;
      ink.textBaseline = 'middle';
      ink.fillStyle = '#101010';
      const origin = ((lane.offset % cycle) + cycle) % cycle - cycle;
      for (let base = origin; base < width; base += cycle) {
        for (const item of lane.items) {
          ink.fillText(item.word, base + item.x, height / 2 + 2);
          ink.fillRect(base + item.x + item.width + 28, height / 2 - 4, 8, 8);
        }
      }
      context.clearRect(0, 0, width, height);
      const edge = Math.min(width < 600 ? 40 : 128, Math.floor(width * .12 / 8) * 8);
      // The center is clean text. At either edge the actual glyphs become 8px cells.
      context.save();
      context.beginPath();
      context.rect(edge, 0, width - edge * 2, height);
      context.clip();
      context.drawImage(buffer, 0, 0);
      context.restore();
      for (const side of [0, 1]) {
        const start = side ? width - edge : 0;
        const pixels = ink.getImageData(start, 0, edge, height).data;
        for (let x = 0; x < edge; x += 8) {
          const inward = side ? (edge - x - 4) / edge : (x + 4) / edge;
          for (let y = 8; y < height - 8; y += 8) {
            let alpha = 0;
            for (let sx = 1; sx < 8; sx += 2) {
              for (let sy = 1; sy < 8; sy += 2) {
                alpha += pixels[((y + sy) * edge + x + sx) * 4 + 3] || 0;
              }
            }
            const grain = Math.sin((x + lane.offset) * .045 + y * .21 + side * 3);
            const band = Math.abs(y - height / 2) / (height / 2);
            // Sparse outer particles meet the moving letterforms; no blur or fading.
            const particle = inward < .65 && band < .78 && grain > .38 + inward * .65;
            if (alpha < 350 && !particle) continue;
            if (inward < .2 && grain < 0) continue;
            context.fillStyle = inward > .78 ? '#101010' : palette[1 + ((Math.floor(inward * 7 + y / 16 + lane.offset / 32) % 5) + 5) % 5];
            const size = inward < .22 ? 4 : 7;
            context.fillRect(start + x, y, size, size);
          }
        }
      }
    }

    function resize() {
      for (const lane of lanes) {
        lane.width = Math.floor(lane.element.clientWidth);
        lane.height = innerWidth <= 700 ? 80 : 104;
        lane.fontSize = innerWidth <= 700 ? Math.min(28, Math.max(23, lane.width * .078)) : Math.min(44, Math.max(30, innerWidth * .03));
        const dpr = Math.min(devicePixelRatio || 1, 2);
        lane.canvas.width = Math.round(lane.width * dpr);
        lane.canvas.height = Math.round(lane.height * dpr);
        lane.context.setTransform(dpr, 0, 0, dpr, 0, 0);
        lane.buffer.width = lane.width;
        lane.buffer.height = lane.height;
        lane.ink.font = `400 ${lane.fontSize}px Malinton, Arial, sans-serif`;
        let x = 0;
        lane.items = lane.words.map(word => {
          const width = lane.ink.measureText(word).width;
          const item = { word, width, x };
          x += width + 72;
          return item;
        });
        lane.cycle = x;
        paint(lane);
      }
    }

    function tick(now) {
      frame = 0;
      if (!running()) { last = 0; return; }
      if (!last) last = now;
      const delta = now - last;
      if (delta >= 32) {
        for (const lane of lanes) {
          lane.offset = (lane.offset + lane.direction * Math.min(delta, 80) * .036) % lane.cycle;
          paint(lane);
        }
        last = now;
      }
      frame = requestAnimationFrame(tick);
    }

    function sync() {
      root.classList.toggle('is-ready', initialized && !preference.matches);
      toggle.hidden = !initialized || preference.matches;
      for (const lane of lanes) {
        if (initialized && !preference.matches) lane.element.tabIndex = 0;
        else lane.element.removeAttribute('tabindex');
      }
      root.dataset.motion = preference.matches ? 'reduced' : running() ? 'playing' : 'paused';
      if (running() && !frame) frame = requestAnimationFrame(tick);
      if (!running()) { cancelAnimationFrame(frame); frame = 0; last = 0; }
    }

    toggle.addEventListener('click', () => {
      paused = !paused;
      toggle.setAttribute('aria-label', `${paused ? 'Play' : 'Pause'} ${label} animation`);
      toggle.querySelector('.marquee-toggle-text').textContent = paused ? 'Play' : 'Pause';
      toggle.querySelector('.marquee-toggle-icon').textContent = paused ? '▷' : 'Ⅱ';
      sync();
    });
    for (const lane of lanes) {
      const move = distance => {
        lane.offset = (lane.offset - distance) % lane.cycle;
        paint(lane);
      };
      lane.element.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; sync(); } });
      lane.element.addEventListener('pointerleave', () => { hovered = false; sync(); });
      lane.element.addEventListener('focusin', () => { focused = true; sync(); });
      lane.element.addEventListener('focusout', () => { focused = false; sync(); });
      lane.element.addEventListener('wheel', event => {
        // Only the tool line consumes scrolling. Keep browser zoom and the rest of
        // the page's normal vertical scroll behavior intact.
        if (!initialized || preference.matches || event.ctrlKey || event.metaKey || !lane.cycle) return;
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        if (!delta) return;
        event.preventDefault();
        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? lane.width : 1;
        move(delta * unit);
      }, { passive: false });
      lane.element.addEventListener('keydown', event => {
        if (!initialized || preference.matches || event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          move(event.key === 'ArrowRight' ? 80 : -80);
        } else if (event.key === 'Home') {
          event.preventDefault();
          lane.offset = 0;
          paint(lane);
        }
      });
    }
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(root);
    new ResizeObserver(() => { if (initialized) resize(); }).observe(root);
    document.fonts.ready.then(() => {
      initialized = true;
      resize();
      sync();
    });
  }
})();
