/* Once inside, the wand is the only way to release the rabbit hole. */
(() => {
  const closing = document.querySelector('.closing');
  const rabbit = document.querySelector('.rabbit-hole');
  if (!closing || !rabbit) return;
  const stage = rabbit.querySelector('.rabbit-stage');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const storageKey = 'portfolio-wand-found';
  const hint = rabbit.querySelector('.rabbit-stuck-hint');
  // Offer help once per entry, not once forever in this browser.
  let hintSeen = false;
  let touchY = null;
  let unlocked = false;
  try { unlocked = sessionStorage.getItem(storageKey) === 'yes' && location.hash !== '#rabbit-hole'; } catch { /* Storage may be unavailable. */ }
  let locked = false;
  const inertStates = new Map();
  closing.hidden = !unlocked;

  function offerHint() {
    // Internal scrolling on small screens should still work before offering help.
    if (!locked || hintSeen || !hint || stage.scrollTop + stage.clientHeight < stage.scrollHeight - 2) return;
    hintSeen = true;
    const title = document.createElement('strong');
    title.textContent = 'Are you stuck?';
    const copy = document.createElement('span');
    copy.textContent = 'A little magic can get you out.';
    hint.replaceChildren(title, copy);
  }

  stage.addEventListener('wheel', event => {
    if (event.deltaY > 0 && !event.ctrlKey) offerHint();
  }, { passive: true });
  stage.addEventListener('touchstart', event => {
    touchY = event.touches.length === 1 ? event.touches[0].clientY : null;
  }, { passive: true });
  stage.addEventListener('touchmove', event => {
    if (touchY === null || event.touches.length !== 1) return;
    const nextY = event.touches[0].clientY;
    if (touchY - nextY > 12) { offerHint(); touchY = nextY; }
  }, { passive: true });
  const endTouch = () => { touchY = null; };
  stage.addEventListener('touchend', endTouch, { passive: true });
  stage.addEventListener('touchcancel', endTouch, { passive: true });
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (['ArrowDown', 'PageDown', 'End', ' '].includes(event.key)) offerHint();
  });

  function enterRabbit() {
    history.replaceState(null, '', '#rabbit-hole');
    window.dispatchEvent(new Event('rabbit:request-entry'));
  }

  function resetDiscovery() {
    unlocked = false;
    hintSeen = false;
    hint?.replaceChildren();
    closing.hidden = true;
    try { sessionStorage.removeItem(storageKey); } catch { /* The in-memory state is enough. */ }
  }

  function lockRabbit() {
    if (locked || unlocked) return;
    resetDiscovery();
    locked = true;
    rabbit.classList.add('is-locked');
    document.documentElement.classList.add('rabbit-locked');
    document.querySelectorAll('.header, main > section:not(.rabbit-hole), .skip').forEach(element => {
      inertStates.set(element, element.inert);
      element.inert = true;
    });
    stage.setAttribute('role', 'dialog');
    stage.setAttribute('aria-modal', 'true');
    stage.setAttribute('aria-labelledby', 'rabbit-heading');
    history.replaceState(null, '', '#rabbit-hole');
    rabbit.querySelector('#rabbit-heading').focus({ preventScroll: true });
  }

  function openClosing(instant = false) {
    locked = false;
    hint?.replaceChildren();
    unlocked = true;
    try { sessionStorage.setItem(storageKey, 'yes'); } catch { /* Keep this visit usable without storage. */ }
    rabbit.classList.remove('is-locked');
    document.documentElement.classList.remove('rabbit-locked');
    inertStates.forEach((wasInert, element) => { element.inert = wasInert; });
    inertStates.clear();
    stage.removeAttribute('role');
    stage.removeAttribute('aria-modal');
    stage.removeAttribute('aria-labelledby');
    stage.scrollTop = 0;
    closing.hidden = false;
    history.replaceState(null, '', '#contact');
    const showClosing = () => {
      document.querySelector('#closing-heading').focus({ preventScroll: true });
      closing.scrollIntoView({ behavior: instant || preference.matches ? 'instant' : 'smooth', block: 'start' });
    };
    if (instant) {
      // Account for the stage leaving its fixed layout before the shockwave clears.
      rabbit.style.setProperty('--rabbit-stage-height', `${stage.offsetHeight}px`);
      showClosing();
    } else requestAnimationFrame(showClosing);
  }

  window.addEventListener('rabbit:entered', lockRabbit);
  window.addEventListener('rabbit:request-entry', resetDiscovery);
  document.querySelectorAll('a[href="#rabbit-hole"]').forEach(link => {
    link.addEventListener('click', resetDiscovery);
  });
  document.querySelectorAll('a[href="#contact"]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (link.classList.contains('rabbit-wand')) {
        const activation = new CustomEvent('wand:activate', { cancelable: true, detail: { complete: () => openClosing(true) } });
        if (link.dispatchEvent(activation)) openClosing();
      } else if (unlocked) openClosing();
      else if (!locked) enterRabbit();
    });
  });

  // Keep Tab within the visible chapter, even before its links finish assembling.
  document.addEventListener('keydown', event => {
    if (!locked || event.key !== 'Tab') return;
    const links = [...rabbit.querySelectorAll('a[href]')].filter(link => !link.closest('[inert]'));
    const first = links[0], last = links[links.length - 1];
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && (document.activeElement === first || !links.includes(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });

  window.addEventListener('hashchange', () => {
    if (locked) history.replaceState(null, '', '#rabbit-hole');
    else if (location.hash === '#contact') {
      if (unlocked) openClosing();
      else enterRabbit();
    }
  });
  window.addEventListener('pageshow', () => {
    if (location.hash !== '#contact') return;
    document.fonts.ready.then(() => {
      if (unlocked) openClosing();
      else enterRabbit();
    });
  });
})();
