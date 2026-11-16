(() => {
  'use strict';
  const search = document.getElementById('module-search');
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const list = document.getElementById('module-list');
  let category = 'all';
  function makeCard(module) {
    const card = document.createElement('details');
    card.className = 'module';
    const summary = document.createElement('summary');
    const icon = document.createElement('img');
    icon.src = '/numeviasoft/icons/' + module.icon + '.svg';
    icon.width = 25;
    icon.height = 25;
    icon.alt = '';
    const info = document.createElement('span');
    const name = document.createElement('strong');
    name.textContent = module.name;
    const line = document.createElement('small');
    line.textContent = module.summary;
    info.append(name, line);
    const toggle = document.createElement('i');
    toggle.className = 'plus';
    toggle.setAttribute('aria-hidden','true');
    summary.append(icon, info, toggle);
    const details = document.createElement('p');
    details.textContent = module.details;
    card.append(summary,details);
    return card;
  }
  function render() {
    const q = search.value.trim().toLocaleLowerCase('bg');
    const visible = moduleData.filter(m => (category === 'all' || m.category === category) &&
      [m.name,m.summary,m.details].join(' ').toLocaleLowerCase('bg').includes(q));
    list.replaceChildren(...visible.map(makeCard));
    document.getElementById('no-results').hidden = visible.length > 0;
    document.getElementById('catalog-count').textContent = visible.length + ' от ' + moduleData.length + ' модула';
  }
  function filter(value) {
    category = value;
    buttons.forEach(b => {
      const active = b.dataset.filter === value;
      b.setAttribute('aria-pressed',String(active));
      b.classList.toggle('active',active);
    });
    render();
  }
  search.addEventListener('input',render);
  buttons.forEach(b => b.addEventListener('click',() => filter(b.dataset.filter)));
  document.getElementById('clear-search').addEventListener('click',() => {
    search.value = '';
    filter('all');
    search.focus();
  });
  render();
})();
