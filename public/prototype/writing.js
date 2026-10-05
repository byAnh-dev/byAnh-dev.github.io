(() => {
  const filters = document.querySelector('.topic-filters');
  const buttons = [...filters.querySelectorAll('button')];
  const cards = [...document.querySelectorAll('.writing-grid > li')];
  const count = document.querySelector('.gallery-count');

  function render() {
    const requested = new URL(location.href).searchParams.get('topic') || 'All';
    const topic = buttons.some(button => button.dataset.topic === requested) ? requested : 'All';
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === topic)));
    cards.forEach(card => { card.hidden = topic !== 'All' && card.dataset.topic !== topic; });
    const visible = cards.filter(card => !card.hidden).length;
    count.textContent = `${String(visible).padStart(2, '0')} sample ${visible === 1 ? 'article' : 'articles'}`;
  }

  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const url = new URL(location.href);
    if (button.dataset.topic === 'All') url.searchParams.delete('topic');
    else url.searchParams.set('topic', button.dataset.topic);
    history.pushState(null, '', url);
    render();
  });
  window.addEventListener('popstate', render);
  render();
})();
