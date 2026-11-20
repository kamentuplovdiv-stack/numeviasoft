(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const menu = document.querySelector('.menu');
  const nav = byId('navigation');

  function setMenu(open) {
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  }
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', e => { if (!e.target.closest('.head')) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus();
    }
  });
  matchMedia('(max-width:660px)').addEventListener('change', () => setMenu(false));
  if (document.body.dataset.page === 'index') {
    function markSection() {
      const section = location.hash.slice(1);
      nav.querySelectorAll('a').forEach(a => {
        const matches = a.hash === location.hash && a.hash !== '' || (a.dataset.nav === 'products' && section === 'product');
        if (matches) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    }
    markSection();
    window.addEventListener('hashchange', markSection);
  }

  const form = byId('brief');
  if (!form) return;
  const topic = byId('topic');
  const message = byId('message');
  const draft = byId('brief-result');
  const prepared = byId('prepared');
  const error = byId('brief-error');
  const status = byId('copy-status');
  const send = byId('send-mail');
  const recipient = 'kamentuplovdiv@gmail.com';
  function resetDraft() {
    draft.hidden = true;
    prepared.value = '';
    send.href = 'mailto:' + recipient;
    status.textContent = '';
    error.hidden = true;
    message.removeAttribute('aria-invalid');
  }
  const requestedTopic = new URLSearchParams(location.search).get('topic');
  if ([...topic.options].some(option => option.value === requestedTopic)) topic.value = requestedTopic;
  form.noValidate = true;
  form.addEventListener('input', resetDraft);
  document.querySelectorAll('[data-topic]').forEach(link => link.addEventListener('click', () => {
    topic.value = link.dataset.topic;
    resetDraft();
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const body = message.value.trim();
    if (body.length < 10) {
      draft.hidden = true;
      error.textContent = 'Опиши задачата с поне 10 знака.';
      error.hidden = false;
      message.setAttribute('aria-invalid','true');
      message.focus();
      return;
    }
    const subject = 'Numevia — ' + topic.selectedOptions[0].text;
    prepared.value = 'До: ' + recipient + '\nТема: ' + subject + '\n\n' + body;
    send.href = 'mailto:' + recipient + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    draft.hidden = false;
    byId('draft-title').focus();
  });
  byId('copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(prepared.value);
      status.textContent = 'Текстът е копиран.';
    } catch {
      prepared.focus();
      prepared.select();
      status.textContent = 'Текстът е маркиран. Избери „Копирай“ от менюто на устройството.';
    }
  });
})();
