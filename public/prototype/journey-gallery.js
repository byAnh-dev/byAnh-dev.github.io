(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.location-gallery').forEach(gallery => {
    const track = gallery.querySelector('.location-photo-track');
    const slides = [...track.querySelectorAll('.location-slide')];
    const previous = gallery.querySelector('.photo-prev');
    const next = gallery.querySelector('.photo-next');
    const count = gallery.querySelector('.photo-count');
    let index = 0, settleTimer = 0, drag = null;

    function update() {
      index = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / Math.max(1, track.clientWidth))));
      count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      previous.disabled = index === 0;
      next.disabled = index === slides.length - 1;
      slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== index)));
    }
    function go(target) {
      index = Math.max(0, Math.min(slides.length - 1, target));
      track.scrollTo({ left: index * track.clientWidth, behavior: reduced.matches ? 'instant' : 'smooth' });
    }
    previous.addEventListener('click', () => go(index - 1));
    next.addEventListener('click', () => go(index + 1));
    track.addEventListener('keydown', event => {
      const target = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: slides.length - 1 }[event.key];
      if (target === undefined) return;
      event.preventDefault(); go(target);
    });
    // Touch and trackpad swipes use native scrolling. Add the same gesture for a mouse.
    track.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: track.scrollLeft, active: false };
      track.setPointerCapture(event.pointerId);
    });
    track.addEventListener('pointermove', event => {
      if (!drag || drag.id !== event.pointerId) return;
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      if (!drag.active && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
        drag.active = true; track.classList.add('is-dragging');
      }
      if (drag.active) { event.preventDefault(); track.scrollLeft = drag.left - dx; }
    });
    function release(event) {
      if (!drag || drag.id !== event.pointerId) return;
      const active = drag.active;
      drag = null; track.classList.remove('is-dragging');
      if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
      if (active) { update(); go(index); }
    }
    track.addEventListener('pointerup', release);
    track.addEventListener('pointercancel', release);
    track.addEventListener('lostpointercapture', release);
    track.addEventListener('scroll', () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => { if (!drag?.active) update(); }, 100);
    }, { passive: true });
    new ResizeObserver(() => {
      track.scrollTo({ left: index * track.clientWidth, behavior: 'instant' });
      update();
    }).observe(track);
    gallery.querySelector('.location-photo-controls').hidden = false;
    update();
  });
})();
