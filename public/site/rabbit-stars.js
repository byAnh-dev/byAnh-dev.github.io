/* Small, square stars drift in several directions. No per-frame JS needed. */
(() => {
  const field = document.querySelector('.rabbit-stars');
  if (!field) return;
  const colors = ['#687cff', '#72cbd5', '#f6ce25', '#fa795e', '#bbb4ff'];
  const hash = seed => { const n = Math.sin(seed * 127.1) * 43758.5453; return n - Math.floor(n); };
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 96; i++) {
    const star = document.createElement('i');
    const size = i % 13 === 0 ? 5 : i % 3 === 0 ? 3 : 2;
    star.className = i % 13 === 0 ? 'pixel-star is-cross' : 'pixel-star';
    star.style.cssText = `left:${hash(i + 1) * 96 + 2}%;top:${hash(i + 150) * 96 + 2}%;width:${size}px;height:${size}px;color:${colors[i % colors.length]};--star-alpha:${.2 + hash(i + 300) * .45};--drift-x:${Math.round(hash(i + 400) * 64 - 32)}px;--drift-y:${-24 - Math.round(hash(i + 500) * 48)}px;--star-duration:${16 + Math.round(hash(i + 600) * 20)}s;--star-delay:${-hash(i + 700) * 36}s`;
    fragment.append(star);
  }
  field.append(fragment);
  const observer = new IntersectionObserver(([entry]) => {
    field.classList.toggle('is-visible', entry.isIntersecting);
  });
  observer.observe(field);
  document.addEventListener('visibilitychange', () => {
    field.classList.toggle('is-paused', document.hidden);
  });
})();
