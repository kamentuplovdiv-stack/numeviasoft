(() => {
  'use strict';

  const launcher = document.getElementById('bug-launch');
  const game = document.getElementById('bug-game');
  if (!launcher || typeof game?.showModal !== 'function') return;

  const target = game.querySelector('.bug-target');
  const finishPanel = game.querySelector('.bug-finish');
  const closeButton = game.querySelector('.bug-close');
  const replay = game.querySelector('#bug-replay');
  const scoreText = game.querySelector('#bug-score');
  const timeText = game.querySelector('#bug-time');
  const result = game.querySelector('#bug-result');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const duration = 15000;
  let score = 0;
  let deadline = 0;
  let nextMove = 0;
  let timer;
  let cell = 4;

  function move() {
    // Choose one of the other eight cells. Its centre stays within the arena on resize.
    cell = (cell + 1 + Math.floor(Math.random() * 8)) % 9;
    const position = (index) => ['max(32px,17%)', '50%', 'min(calc(100% - 32px),83%)'][index];
    target.style.setProperty('--bug-x', position(cell % 3));
    target.style.setProperty('--bug-y', position(Math.floor(cell / 3)));
    target.style.setProperty('--bug-angle', (Math.floor(Math.random() * 100) - 50) + 'deg');
    nextMove = performance.now() + 1450;
  }

  function finish() {
    clearInterval(timer);
    deadline = 0;
    const returnFocus = document.activeElement === target;
    target.hidden = true;
    finishPanel.hidden = false;
    result.textContent = score === 1 ? '1 уловен бъг!' : score + ' уловени бъга!';
    timeText.textContent = '0 сек.';
    if (returnFocus) replay.focus();
  }

  function tick() {
    const now = performance.now();
    if (now >= deadline) { finish(); return; }
    timeText.textContent = Math.ceil((deadline - now) / 1000) + ' сек.';
    if (now >= nextMove && !reducedMotion.matches && !target.matches(':active')) move();
  }

  function start() {
    clearInterval(timer);
    score = 0;
    scoreText.textContent = '0';
    timeText.textContent = '15 сек.';
    finishPanel.hidden = true;
    result.textContent = '';
    target.hidden = false;
    if (!game.open) game.showModal();
    deadline = performance.now() + duration;
    move();
    target.focus({preventScroll:true});
    timer = setInterval(tick, 150);
  }

  launcher.addEventListener('click', start);
  replay.addEventListener('click', start);
  closeButton.addEventListener('click', () => game.close());
  game.addEventListener('close', () => {
    clearInterval(timer);
    deadline = 0;
    launcher.focus({preventScroll:true});
  });

  target.addEventListener('keydown', event => {
    if (event.repeat && (event.key === 'Enter' || event.key === ' ')) event.preventDefault();
  });
  target.addEventListener('click', () => {
    if (!deadline || !game.open) return;
    if (performance.now() >= deadline) { finish(); return; }
    scoreText.textContent = String(++score);
    move();
  });

  launcher.hidden = false;
})();
