(() => {
  const board = document.querySelector('.doodle-board');
  const canvas = board?.querySelector('canvas');
  const context = canvas?.getContext('2d');
  if (!context) return;

  const undo = board.querySelector('[data-doodle-undo]');
  const clear = board.querySelector('[data-doodle-clear]');
  const status = board.querySelector('[data-doodle-status]');
  const strokes = [];
  const storageKey = 'portfolio.owner-doodle.v1';
  try {
    const saved = localStorage.getItem(storageKey);
    const draft = saved && saved.length < 2_000_000 ? JSON.parse(saved) : null;
    if (Array.isArray(draft) && draft.every(stroke => Array.isArray(stroke) && stroke.length > 0 && stroke.every(p =>
      p && Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x <= 640 && p.y >= 0 && p.y <= 440))) {
      for (const stroke of draft) strokes.push(stroke);
    }
  } catch { /* A fresh canvas still works when browser storage is unavailable. */ }

  function saveDraft() {
    try {
      const serialized = JSON.stringify(strokes);
      if (serialized.length >= 2_000_000) throw new Error('Drawing is too large');
      localStorage.setItem(storageKey, serialized);
    } catch {
      status.textContent = 'Your drawing could not be saved in this browser. Keep this page open to retain it.';
    }
  }
  let current = null, pointerId = null, keyboard = false;
  let cursor = { x: 320, y: 220 };

  function paint() {
    context.clearRect(0, 0, 640, 440);
    context.strokeStyle = context.fillStyle = '#101010';
    context.lineWidth = 5;
    context.lineCap = context.lineJoin = 'round';
    for (const stroke of strokes) {
      context.beginPath();
      context.moveTo(stroke[0].x, stroke[0].y);
      if (stroke.length === 1) {
        context.arc(stroke[0].x, stroke[0].y, 2.5, 0, Math.PI * 2);
        context.fill();
      } else {
        for (const point of stroke.slice(1)) context.lineTo(point.x, point.y);
        context.stroke();
      }
    }
    if (keyboard && document.activeElement === canvas) {
      context.strokeStyle = '#3049d9';
      context.lineWidth = 2;
      context.beginPath();
      context.arc(cursor.x, cursor.y, 8, 0, Math.PI * 2);
      context.stroke();
    }
    board.classList.toggle('has-drawing', strokes.length > 0);
    undo.disabled = clear.disabled = strokes.length === 0;
  }

  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(640, (event.clientX - rect.left) / rect.width * 640)),
      y: Math.max(0, Math.min(440, (event.clientY - rect.top) / rect.height * 440))
    };
  }

  function finish() {
    if (current) saveDraft();
    const captured = pointerId;
    pointerId = null;
    current = null;
    if (captured !== null && canvas.hasPointerCapture(captured)) canvas.releasePointerCapture(captured);
  }

  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0 || pointerId !== null) return;
    event.preventDefault();
    document.dispatchEvent(new Event('pixelcursor:absorb'));
    canvas.focus({ preventScroll: true });
    keyboard = false;
    pointerId = event.pointerId;
    canvas.setPointerCapture(pointerId);
    cursor = point(event);
    current = [cursor];
    strokes.push(current);
    paint();
  });
  canvas.addEventListener('pointermove', event => {
    if (event.pointerId !== pointerId || !current) return;
    const points = event.getCoalescedEvents?.() || [];
    for (const sample of points.length ? points : [event]) {
      cursor = point(sample);
      current.push(cursor);
    }
    paint();
  });
  canvas.addEventListener('pointerup', event => {
    if (event.pointerId !== pointerId) return;
    current.push(point(event));
    finish();
    paint();
  });
  canvas.addEventListener('pointercancel', event => { if (event.pointerId === pointerId) finish(); });
  canvas.addEventListener('lostpointercapture', event => { if (event.pointerId === pointerId) finish(); });
  canvas.addEventListener('blur', () => { finish(); keyboard = false; paint(); });

  const directions = { ArrowLeft: [-8, 0], ArrowRight: [8, 0], ArrowUp: [0, -8], ArrowDown: [0, 8] };
  canvas.addEventListener('keydown', event => {
    const direction = directions[event.key];
    if (!direction || event.ctrlKey || event.metaKey || event.altKey || pointerId !== null) return;
    event.preventDefault();
    keyboard = true;
    if (event.shiftKey && !current) { current = [cursor]; strokes.push(current); }
    if (!event.shiftKey) finish();
    cursor = { x: Math.max(0, Math.min(640, cursor.x + direction[0])), y: Math.max(0, Math.min(440, cursor.y + direction[1])) };
    if (current) current.push(cursor);
    paint();
  });
  canvas.addEventListener('keyup', event => { if (event.key === 'Shift') finish(); });

  undo.addEventListener('click', () => {
    finish();
    strokes.pop();
    paint();
    status.textContent = 'Last stroke removed.';
    saveDraft();
  });
  clear.addEventListener('click', () => {
    finish();
    strokes.length = 0;
    paint();
    status.textContent = 'Canvas cleared.';
    saveDraft();
  });
  window.addEventListener('pagehide', saveDraft);
  new ResizeObserver(() => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    context.setTransform(canvas.width / 640, 0, 0, canvas.height / 440, 0, 0);
    paint();
  }).observe(canvas);
})();
