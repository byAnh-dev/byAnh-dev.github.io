(async () => {
  // Independent acceptance probe: exercise real handlers and inspect real pixels.
  // Run at 1280x720 with reduced motion disabled. No rendering is substituted.
  const initialScroll = { x: scrollX, y: scrollY };
  const canvas = document.querySelector('.pixel-cursor');
  if (!canvas) throw new Error('Missing actual .pixel-cursor canvas');
  if (innerWidth !== 1280 || innerHeight !== 720) throw new Error('Set viewport to 1280x720');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) throw new Error('Disable reduced motion for this motion probe');
  const frames = async (count = 1) => {
    for (let i = 0; i < count; i++) await new Promise(requestAnimationFrame);
  };
  const release = () => document.dispatchEvent(new PointerEvent('pointerout', {
    pointerType: 'mouse', relatedTarget: null, bubbles: true
  }));
  const move = (x, y) => document.dispatchEvent(new PointerEvent('pointermove', {
    pointerId: 1, pointerType: 'mouse', clientX: x, clientY: y, bubbles: true
  }));
  const clear = async () => {
    release();
    // Real elapsed time lets the actual implementation retire prior marks.
    await new Promise(resolve => setTimeout(resolve, 1100));
    await frames(2);
  };
  const capture = () => {
    const ctx = canvas.getContext('2d');
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const sx = canvas.width / innerWidth, sy = canvas.height / innerHeight;
    return (x, y) => {
      const px = Math.max(0, Math.min(canvas.width - 1, Math.floor(x * sx)));
      const py = Math.max(0, Math.min(canvas.height - 1, Math.floor(y * sy)));
      return pixels.data[(py * canvas.width + px) * 4 + 3];
    };
  };
  const thickness = alpha => {
    const counts = [];
    // Take the largest populated cross sections near the moving end, avoiding
    // dependence on a precise smoothing lag or on 1px grid gutters.
    for (let x = 1000; x <= 1150; x++) {
      let count = 0;
      for (let y = 500; y <= 700; y++) if (alpha(x + .5, y + .5) >= 96) count++;
      if (count) counts.push(count);
    }
    counts.sort((a, b) => b - a);
    const top = counts.slice(0, Math.max(1, Math.ceil(counts.length * .2)));
    return { width: top.reduce((sum, n) => sum + n, 0) / (top.length || 1), populatedColumns: counts.length };
  };
  const continuity = (alpha, axis, start, end, fixed, halfSpan) => {
    let empty = 0, run = 0, longestGap = 0, minimumPeak = 255;
    const peaks = [];
    // An 8px bin spans a full grid pitch, so grid gutters cannot count as gaps.
    for (let p = start; p < end; p += 8) {
      let peak = 0;
      for (let q = p; q < Math.min(p + 8, end); q++) {
        for (let cross = fixed - halfSpan; cross <= fixed + halfSpan; cross++) {
          peak = Math.max(peak, axis === 'x' ? alpha(q + .5, cross + .5) : alpha(cross + .5, q + .5));
        }
      }
      peaks.push(peak);
      minimumPeak = Math.min(minimumPeak, peak);
      if (peak < 48) { empty++; run++; longestGap = Math.max(longestGap, run * 8); }
      else run = 0;
    }
    return { pass: empty === 0, emptyBins: empty, longestGapCssPx: longestGap, minimumPeakAlpha: minimumPeak, peaks };
  };
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    await frames(3);
    const fieldBounds = document.querySelector('.pixel-stage').getBoundingClientRect();
    if (fieldBounds.right >= 800) throw new Error('Probe region must remain outside actual field');
    const runLine = async step => {
      await clear();
      move(850, 600);
      await frames(2);
      const started = performance.now();
      for (let x = 850 + step; x <= 1150; x += step) {
        await frames();
        move(x, 600);
      }
      await frames();
      const alpha = capture();
      return {
        elapsedMs: performance.now() - started,
        nominalStepCssPx: step,
        ...thickness(alpha),
        continuity: continuity(alpha, 'x', 1030, 1126, 600, 80)
      };
    };
    const slow = await runLine(5);
    const fast = await runLine(60);
    await clear();
    move(1060, 600);
    await frames(3);
    const before = scrollY;
    window.scrollTo({ top: before + 180, left: 0, behavior: 'instant' });
    await frames(2);
    const scrollDelta = scrollY - before;
    if (scrollDelta < 150) throw new Error('Insufficient document scroll range for bridge probe');
    const bridge = continuity(capture(), 'y', 600 - scrollDelta + 40, 600 - 40, 1060, 16);
    const ratio = fast.width / slow.width;
    return {
      execution: 'Real browser canvas; assign evidence grade after checks and negative controls',
      oracleSource: 'User: fluid fast motion and scrolling; faster movement yields a thinner brush',
      viewport: { width: innerWidth, height: innerHeight },
      slow, fast,
      widthRatioFastToSlow: ratio,
      scroll: { deltaCssPx: scrollDelta, bridge },
      checks: {
        visibleSlowAndFast: slow.width > 0 && fast.width > 0,
        fastIsMeaningfullyThinner: ratio < .85,
        fastPathConnected: fast.continuity.pass,
        scrollPathConnected: bridge.pass
      },
      assumptions: [
        'Normal motion mode; 1280x720 viewport; visible foreground page',
        'At least 15% smaller alpha cross section makes speed response visibly meaningful',
        'Continuity means no empty 8px bin at alpha >= 48 through the recent path',
        'Synthetic pointer inputs drive actual DOM handlers; actual scrollTo drives scroll; no rendering mocks'
      ]
    };
  } finally {
    release();
    window.scrollTo({ top: initialScroll.y, left: initialScroll.x, behavior: 'instant' });
    await frames(2);
    release();
  }
})()
