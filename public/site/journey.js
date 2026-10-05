(() => {
  const root = document.querySelector('.journey-page');
  if (!root) return;
  const $ = selector => root.querySelector(selector);
  const svgNS = 'http://www.w3.org/2000/svg';
  const project = (lon, lat) => ({ x: (lon + 180) / 360 * 1200, y: (85 - lat) / 150 * 560 });
  const places = [
    { id: 'haiphong', label: 'Haiphong', number: '01', country: 'VIETNAM', ...project(106.68, 20.85) },
    { id: 'kansas', label: 'Kansas', number: '02', country: 'UNITED STATES', ...project(-98, 38.5) },
    { id: 'hongkong', label: 'Hong Kong', number: '03', country: 'HONG KONG', ...project(114.17, 22.32) },
    { id: 'japan', label: 'Japan', number: '04', country: 'JAPAN', ...project(138, 36) },
  ];
  const chapters = [
    { place: 0, title: 'Where it began.', copy: 'I was born and grew up in Haiphong, Vietnam. This is where my journey starts.', status: '01 / An egg lands in Haiphong. Home, from the start.' },
    { place: 1, title: 'A first departure.', copy: 'From Haiphong to Kansas. This was my first time outside Vietnam.', status: '02 / Haiphong → Kansas. My first time outside Vietnam.' },
    { place: 2, title: 'On exchange.', copy: 'From Kansas, I headed to Hong Kong for my exchange.', status: '03 / Kansas → Hong Kong. Off on exchange.' },
    { place: 3, title: 'A little further.', copy: 'After Hong Kong, my journey took me to Japan.', status: '04 / Hong Kong → Japan. Another place to explore.' },
    { place: 1, title: 'Back in Kansas.', copy: 'From Japan, I returned to Kansas in the United States.', status: 'RETURN / Japan → Kansas. Back in the US.' },
  ];
  const stops = [...root.querySelectorAll('[data-stop]')];
  const detail = $('#journey-detail');
  const status = $('#journey-status');
  const pause = $('#journey-pause'), skip = $('#journey-skip'), replay = $('#journey-replay');
  const plane = $('#flight-plane'), egg = $('#birth-egg');
  const shells = $('#birth-shells'), crack = $('.egg-crack'), fragments = $('.egg-fragments');
  const leftShell = $('.egg-shell-left'), rightShell = $('.egg-shell-right');
  const chips = [...root.querySelectorAll('.egg-chip')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let playing = false, paused = false, elapsed = 0, frame = 0, last = 0, announced = -1;
  let selected = -1, pinned = false, closeTimer = 0, opener = null, restoringFocus = false;
  const introDuration = 1900, legDuration = 2700, flightDuration = 1800;
  const totalDuration = introDuration + legDuration * 4;
  const markers = places.map((place, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'map-marker'; button.dataset.place = place.id;
    button.style.left = `${place.x / 12}%`; button.style.top = `${place.y / 5.6}%`;
    button.setAttribute('aria-label', `${place.label}, ${place.country}${index === 1 ? ', first arrival and return' : ''}: show story`);
    button.setAttribute('aria-controls', 'journey-detail'); button.setAttribute('aria-expanded', 'false');
    button.innerHTML = `<span class="marker-label" aria-hidden="true"><small>${place.number}</small>${place.label}</span>`;
    const pin = document.createElement('span'); pin.className = 'map-pin'; pin.setAttribute('aria-hidden', 'true');
    pin.style.left = button.style.left; pin.style.top = button.style.top;
    $('.map-markers').append(pin, button);
    return button;
  });
  const paths = chapters.slice(1).map((chapter, i) => {
    const from = places[chapters[i].place], to = places[chapter.place];
    const lift = [130, 180, 48, 220][i];
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', `M${from.x},${from.y} Q${(from.x + to.x) / 2},${Math.min(from.y, to.y) - lift} ${to.x},${to.y}`);
    path.setAttribute('class', 'route-line'); $('.route-lines').append(path);
    const mask = document.createElementNS(svgNS, 'mask');
    mask.id = `route-reveal-${i}`;
    mask.setAttribute('maskUnits', 'userSpaceOnUse');
    mask.setAttribute('x', '0'); mask.setAttribute('y', '-100');
    mask.setAttribute('width', '1200'); mask.setAttribute('height', '760');
    const reveal = path.cloneNode(); reveal.removeAttribute('class');
    reveal.setAttribute('stroke', 'white'); reveal.setAttribute('stroke-width', '8');
    reveal.setAttribute('pathLength', '1'); reveal.style.strokeDasharray = '1';
    mask.append(reveal); $('.journey-routes').prepend(mask);
    const progress = path.cloneNode(); progress.setAttribute('class', 'route-progress');
    progress.setAttribute('mask', `url(#${mask.id})`);
    $('.route-lines').append(progress);
    return { path, progress, reveal, length: path.getTotalLength() };
  });
  // Leaders follow the real HTML label positions, including at narrow widths.
  function layoutLeaders() {
    const box = $('.map-sheet').getBoundingClientRect();
    if (!box.width) return;
    $('.marker-leaders').replaceChildren();
    markers.forEach((marker, i) => {
      const label = marker.querySelector('.marker-label').getBoundingClientRect();
      const x = (label.left + label.width / 2 - box.left) / box.width * 1200;
      const y = (label.top + label.height / 2 - box.top) / box.height * 560;
      const line = document.createElementNS(svgNS, 'path');
      line.setAttribute('d', `M${places[i].x},${places[i].y} L${x},${y}`);
      line.dataset.place = String(i); $('.marker-leaders').append(line);
    });
  }
  new ResizeObserver(layoutLeaders).observe($('.map-sheet'));
  new ResizeObserver(() => {
    const stage = $('.journey-stage');
    const available = Math.max(1, stage.clientHeight - 48);
    $('.map-sheet').style.width = innerWidth > 700 ? `${Math.min(stage.clientWidth, available * 1200 / 560)}px` : '100%';
  }).observe($('.journey-stage'));
  document.fonts.ready.then(layoutLeaders);

  function setExpanded() {
    markers.forEach((button, i) => button.setAttribute('aria-expanded', String(selected >= 0 && chapters[selected].place === i)));
  }
  function closeDetails(restore = false) {
    clearTimeout(closeTimer); selected = -1; pinned = false; detail.hidden = true; setExpanded();
    if (restore && opener?.isConnected) {
      restoringFocus = true; opener.focus({ preventScroll: true }); restoringFocus = false;
    }
  }
  function openDetails(index, pin = false, source = null) {
    clearTimeout(closeTimer);
    if (restoringFocus || (pinned && !pin) || (playing && !pin)) return;
    if (playing) finish();
    selected = index; pinned = pin; if (source) opener = source;
    const chapter = chapters[index], place = places[chapter.place];
    $('#detail-chapter').textContent = `PLACE 0${index + 1} / 04`;
    $('#detail-country').textContent = place.country;
    $('#detail-title').textContent = place.label;
    $('#detail-subtitle').textContent = chapter.title;
    $('#detail-copy').textContent = chapter.copy + (index === 1 ? ' Later, I returned here after Japan.' : '');
    $('#detail-position').textContent = `${index + 1} OF 4`;
    $('.detail-prev').disabled = index === 0; $('.detail-next').disabled = index === 3;
    $('.detail-gallery-link').href = `#gallery-${place.id}`;
    $('.detail-hint').textContent = pin ? 'Story pinned. Close to explore the map.' : 'Click a stop to keep its story open.';
    const icon = (index === 0 ? egg : plane).cloneNode(true);
    icon.removeAttribute('id'); icon.removeAttribute('hidden'); icon.removeAttribute('transform');
    const illustration = document.createElementNS(svgNS, 'svg'); illustration.setAttribute('viewBox', '-28 -28 56 56');
    illustration.append(icon); $('.detail-art').replaceChildren(illustration);
    detail.hidden = false; setExpanded();
  }
  function scheduleClose() {
    clearTimeout(closeTimer);
    if (!pinned) closeTimer = setTimeout(() => {
      if (!detail.matches(':hover') && !detail.contains(document.activeElement)) closeDetails();
    }, 600);
  }
  function bindPreview(button, index) {
    button.setAttribute('aria-controls', 'journey-detail'); button.setAttribute('aria-expanded', 'false');
    button.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') openDetails(index, false, button); });
    button.addEventListener('pointerleave', scheduleClose);
    button.addEventListener('focus', () => openDetails(index, false, button));
    button.addEventListener('blur', scheduleClose);
    button.addEventListener('click', event => {
      openDetails(index, true, button);
      if (event.detail === 0) $('.detail-close').focus({ preventScroll: true });
    });
  }
  markers.forEach((button, i) => bindPreview(button, chapters.findIndex(chapter => chapter.place === i)));
  // Native anchors work without JavaScript and move keyboard focus to each collection.
  [...stops, $('.detail-gallery-link')].forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (playing) finish();
    closeDetails();
  }));
  detail.addEventListener('pointerenter', () => clearTimeout(closeTimer));
  detail.addEventListener('pointerleave', scheduleClose);
  detail.addEventListener('focusin', () => clearTimeout(closeTimer));
  detail.addEventListener('focusout', scheduleClose);
  $('.detail-close').addEventListener('click', () => closeDetails(true));
  $('.detail-prev').addEventListener('click', () => openDetails(Math.max(0, selected - 1), true));
  $('.detail-next').addEventListener('click', () => openDetails(Math.min(3, selected + 1), true));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && selected >= 0) closeDetails(true); });

  function controls() {
    pause.hidden = motion.matches;
    skip.hidden = !playing;
    replay.hidden = playing;
    const label = playing ? (paused ? 'Continue' : 'Pause') : (paused ? 'Play motion' : 'Pause motion');
    pause.innerHTML = `${label} <span aria-hidden="true">${paused ? '▶' : 'Ⅱ'}</span>`;
    pause.setAttribute('aria-label', playing ? (paused ? 'Continue journey animation' : 'Pause journey animation') : label);
    root.classList.toggle('journey-motion-paused', paused || motion.matches || document.hidden);
    root.dispatchEvent(new Event('journey:motion'));
  }
  function remember() { try { sessionStorage.setItem('anh-journey-seen', 'yes'); } catch { /* Storage is optional. */ } }
  function finish() {
    const moveFocus = document.activeElement === pause || document.activeElement === skip;
    playing = paused = false; cancelAnimationFrame(frame); frame = 0; last = 0;
    elapsed = totalDuration; root.classList.remove('journey-playing');
    plane.setAttribute('hidden', ''); egg.setAttribute('hidden', '');
    shells.setAttribute('hidden', '');
    paths.forEach(({ progress, reveal }) => { reveal.style.strokeDashoffset = '0'; progress.classList.remove('is-current'); });
    markers.forEach(marker => { marker.dataset.revealed = 'true'; marker.dataset.current = 'false'; });
    $('.marker-leaders').querySelectorAll('path').forEach(path => path.style.opacity = '1');
    stops.forEach(button => { button.parentElement.classList.add('is-visited'); button.parentElement.classList.remove('is-current'); });
    status.textContent = 'Hover over a place. Click to keep its story open.';
    controls(); remember();
    if (moveFocus) replay.focus({ preventScroll: true });
  }
  function render() {
    const chapter = elapsed < introDuration ? 0 : Math.min(4, Math.floor((elapsed - introDuration) / legDuration) + 1);
    const phase = elapsed < introDuration ? 0 : (elapsed - introDuration) % legDuration;
    const arrived = chapter === 0 ? elapsed > 800 : phase >= flightDuration;
    if (chapter !== announced) { announced = chapter; status.textContent = chapters[chapter].status; }
    stops.forEach((button, i) => {
      button.parentElement.classList.toggle('is-visited', i < chapter || (i === chapter && arrived));
      button.parentElement.classList.toggle('is-current', i === chapters[chapter].place);
    });
    markers.forEach((marker, i) => {
      const firstVisit = chapters.findIndex(stop => stop.place === i);
      marker.dataset.revealed = String(firstVisit < chapter || (firstVisit === chapter && arrived));
      marker.dataset.current = String(chapters[chapter].place === i);
    });
    $('.marker-leaders').querySelectorAll('path').forEach(path => {
      path.style.opacity = markers[Number(path.dataset.place)].dataset.revealed === 'true' ? '1' : '0';
    });
    paths.forEach(({ progress, reveal }, i) => {
      const amount = i < chapter - 1 ? 1 : i === chapter - 1 ? Math.min(1, phase / flightDuration) : 0;
      reveal.style.strokeDashoffset = String(1 - amount);
      progress.classList.toggle('is-current', i === chapter - 1);
    });
    if (chapter === 0) {
      plane.setAttribute('hidden', '');
      const t = Math.min(1, elapsed / 800);
      const y = places[0].y - 160 * (1 - t * t);
      egg.setAttribute('transform', `translate(${places[0].x} ${y}) scale(.85)`);
      egg.toggleAttribute('hidden', elapsed >= 960);
      shells.toggleAttribute('hidden', elapsed < 800);
      shells.setAttribute('transform', `translate(${places[0].x} ${places[0].y}) scale(.85)`);
      crack.toggleAttribute('hidden', elapsed >= 960);
      fragments.toggleAttribute('hidden', elapsed < 960);
      // Crack on impact, then throw the two jagged shell halves apart.
      // Use the journey clock so pausing, replaying, and hiding the tab stay in sync.
      const split = Math.max(0, Math.min(1, (elapsed - 960) / 800));
      const spread = 32 * (1 - (1 - split) ** 2);
      const lift = -24 * Math.sin(split * Math.PI) + 14 * split;
      leftShell.setAttribute('transform', `translate(${-spread} ${lift}) rotate(${-65 * split})`);
      rightShell.setAttribute('transform', `translate(${spread} ${lift}) rotate(${65 * split})`);
      chips.forEach((chip, i) => {
        const dx = (i - 1) * 48 * split;
        const dy = -(38 + i * 6) * Math.sin(split * Math.PI) + 20 * split;
        chip.setAttribute('transform', `translate(${dx} ${dy}) rotate(${(i - 1) * 150 * split})`);
      });
      shells.style.opacity = String(1 - Math.max(0, Math.min(1, (elapsed - 1540) / 300)));
    } else {
      shells.setAttribute('hidden', '');
      egg.setAttribute('hidden', ''); plane.removeAttribute('hidden');
      const { path, length } = paths[chapter - 1];
      const distance = Math.min(1, phase / flightDuration) * length;
      const point = path.getPointAtLength(distance);
      const before = path.getPointAtLength(Math.max(0, distance - 1));
      const after = path.getPointAtLength(Math.min(length, distance + 1));
      const angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI + 90;
      plane.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle}) scale(.72)`);
    }
  }
  function tick(now) {
    frame = 0;
    if (!playing || paused || document.hidden) { last = 0; return; }
    elapsed += last ? Math.min(now - last, 80) : 0; last = now;
    if (elapsed >= totalDuration) { finish(); return; }
    render(); frame = requestAnimationFrame(tick);
  }
  function start() {
    closeDetails(); cancelAnimationFrame(frame);
    if (motion.matches) { finish(); status.textContent = 'Four places, with motion reduced. Select a place to explore.'; return; }
    elapsed = 0; announced = -1; last = 0; playing = true; paused = false;
    root.classList.add('journey-playing'); controls(); render(); frame = requestAnimationFrame(tick);
  }
  pause.addEventListener('click', () => { paused = !paused; controls(); last = 0; if (playing && !paused && !frame) frame = requestAnimationFrame(tick); });
  skip.addEventListener('click', finish);
  replay.addEventListener('click', () => { start(); if (playing) pause.focus({ preventScroll: true }); });
  motion.addEventListener('change', () => { if (motion.matches) finish(); else controls(); });
  document.addEventListener('visibilitychange', () => {
    controls();
    last = 0;
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else if (playing && !paused && !frame) frame = requestAnimationFrame(tick);
  });
  $('.journey-controls').hidden = false;
  let seen = false;
  try { seen = sessionStorage.getItem('anh-journey-seen') === 'yes'; } catch { /* Play normally without storage. */ }
  if (seen || motion.matches || location.hash.startsWith('#gallery-')) finish(); else start();
})();
