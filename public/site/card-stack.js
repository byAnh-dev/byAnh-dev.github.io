(() => {
  const deck = document.querySelector('.work-deck');
  if (!deck) return;
  const track = deck.querySelector('.deck-track');
  const cards = [...deck.querySelectorAll('.work-card')];
  const dots = [...deck.querySelectorAll('.deck-dots button')];
  const previous = deck.querySelector('.deck-prev');
  const next = deck.querySelector('.deck-next');
  const count = deck.querySelector('.deck-count');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let frame = 0;
  let drag = null;
  let dragged = false;
  let positions = [];
  let destination = null;
  let settleTimer = 0;

  const position = index => positions[index] || 0;
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  function finishScroll() {
    if (destination !== null && Math.abs(track.scrollLeft - destination) > 1) return;
    destination = null;
    track.classList.remove('is-settling');
    update();
  }
  function update() {
    frame = 0;
    const nearest = cards.reduce((best, _, index) =>
      Math.abs(position(index) - track.scrollLeft) < Math.abs(position(best) - track.scrollLeft) ? index : best, 0);
    active = nearest;
    cards.forEach((card, index) => {
      const spacing = position(1) || track.clientWidth;
      const offset = clamp((position(index) - track.scrollLeft) / spacing, -1, 1);
      const distance = Math.abs(offset);
      const eased = distance * distance * (3 - 2 * distance);
      const angle = matchMedia('(max-width: 600px)').matches ? 3 : 4;
      card.querySelector('.card-surface').style.transform = reducedMotion.matches
        ? 'none' : `rotate(${Math.sign(offset) * angle * eased}deg) scale(${1 - .06 * eased})`;
      card.classList.toggle('is-active', index === active);
      card.classList.toggle('is-before', index < active);
      dots[index].setAttribute('aria-pressed', String(index === active));
    });
    count.textContent = `${String(active + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    previous.disabled = active === 0;
    next.disabled = active === cards.length - 1;
  }
  function go(index) {
    destination = position(clamp(index, 0, cards.length - 1));
    track.classList.add('is-settling');
    track.classList.remove('is-dragging');
    track.scrollTo({ left: destination, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    clearTimeout(settleTimer);
    settleTimer = setTimeout(finishScroll, 160);
  }
  track.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(update);
    clearTimeout(settleTimer);
    settleTimer = setTimeout(finishScroll, 160);
  }, { passive: true });
  track.addEventListener('scrollend', finishScroll);
  const selected = () => destination === null ? active : positions.indexOf(destination);
  previous.addEventListener('click', () => go(selected() - 1));
  next.addEventListener('click', () => go(selected() + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => go(index)));
  cards.forEach((card, index) => card.addEventListener('click', () => {
    if (!dragged && index !== active) go(index);
  }));
  track.addEventListener('keydown', event => {
    const destinations = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: cards.length - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    go(destinations[event.key]);
  });
  // Touch and trackpads use native scrolling. Mouse drag adds the stack's grab interaction.
  track.addEventListener('pointerdown', event => {
    dragged = false;
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    destination = null;
    track.classList.remove('is-settling');
    track.classList.add('is-dragging');
    track.scrollTo({ left: track.scrollLeft, behavior: 'instant' });
    drag = { x: event.clientX, scroll: track.scrollLeft, index: active };
  });
  track.addEventListener('pointermove', event => {
    if (!drag) return;
    if (Math.abs(drag.x - event.clientX) > 5) {
      dragged = true;
      track.setPointerCapture(event.pointerId);
    }
    track.scrollLeft = drag.scroll + drag.x - event.clientX;
  });
  function finish(event) {
    if (!drag) return;
    const distance = drag.x - event.clientX;
    const index = Math.abs(distance) > 48 ? drag.index + Math.sign(distance) : active;
    drag = null;
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    go(index);
  }
  window.addEventListener('pointerup', finish);
  track.addEventListener('pointercancel', () => {
    drag = null;
    track.classList.remove('is-dragging');
    go(active);
  });
  track.addEventListener('lostpointercapture', () => {
    if (!drag) return;
    drag = null;
    track.classList.remove('is-dragging');
    go(active);
  });
  // Keep the selected project aligned when the review frame changes width.
  new ResizeObserver(() => {
    positions = cards.map(card => card.offsetLeft - cards[0].offsetLeft);
    destination = null;
    track.classList.remove('is-settling');
    track.scrollTo({ left: position(active), behavior: 'instant' });
    update();
  }).observe(track);
  reducedMotion.addEventListener('change', () => { go(active); update(); });
  track.addEventListener('wheel', () => {
    destination = null;
    track.classList.remove('is-settling');
  }, { passive: true });
  positions = cards.map(card => card.offsetLeft - cards[0].offsetLeft);
  deck.querySelector('.deck-controls').hidden = false;
  update();
})();
