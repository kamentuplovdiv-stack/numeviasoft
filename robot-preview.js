(() => {
  'use strict';

  const get = id => document.getElementById(id);
  const drawing = get('robot-drawing');
  if (!drawing || !window.NumeviaMath) return;

  const world = get('robot-world');
  const shoulder = get('robot-shoulder');
  const elbow = get('robot-elbow');
  const target = get('robot-target');
  const handle = get('robot-handle');
  const route = get('robot-route');
  const description = get('robot-figure-desc');
  const xInput = get('robot-x');
  const yInput = get('robot-y');
  const xValue = get('robot-x-value');
  const yValue = get('robot-y-value');
  const q1 = get('robot-q1');
  const q2 = get('robot-q2');
  const demo = get('robot-motion');
  const demoText = demo.querySelector('span');
  const detail = get('robot-detail');
  const labUrl = new URL(detail.href);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const degrees = new Intl.NumberFormat('bg-BG', { maximumFractionDigits: 1 });
  const minX = Number(xInput.min), maxX = Number(xInput.max);
  const minY = Number(yInput.min), maxY = Number(yInput.max);
  const poses = [{ x: 148, y: 200 }, { x: 321, y: 183 }, { x: 267, y: 65 }];
  const upperLength = 250, forearmLength = 180;
  let current = null;
  let animation = null;
  let poseIndex = 0;
  let drag = null;
  let draggedHandle = false;

  function angleLabel(angle) {
    return degrees.format(angle).replace('-', '−') + '°';
  }

  function showTarget(x, y) {
    x = Math.max(minX, Math.min(maxX, Math.round(x)));
    y = Math.max(minY, Math.min(maxY, Math.round(y)));
    if (current && x === current.x && y === current.y) return;
    const pose = window.NumeviaMath.robotIK(upperLength, forearmLength, x, y, -1);
    if (!pose.reachable) return;

    current = { x, y };
    shoulder.setAttribute('transform', 'rotate(' + pose.q1 + ')');
    elbow.setAttribute('transform', 'translate(' + upperLength + ' 0) rotate(' + pose.q2 + ')');
    target.setAttribute('transform', 'translate(' + x + ' ' + y + ')');
    q1.textContent = angleLabel(pose.q1);
    q2.textContent = angleLabel(pose.q2);
    xInput.value = x;
    yInput.value = y;
    xValue.textContent = x + ' mm';
    yValue.textContent = y + ' mm';
    xInput.setAttribute('aria-valuetext', xValue.textContent);
    yInput.setAttribute('aria-valuetext', yValue.textContent);
    description.textContent = 'Звена 250 и 180 mm. Работната точка е при X ' + x + ' mm и Y ' + y + ' mm.';
    labUrl.searchParams.set('x', String(x));
    labUrl.searchParams.set('y', String(y));
    detail.href = labUrl.href;
  }

  function setDemoLabel() {
    demo.dataset.state = reduced.matches ? 'step' : animation === null ? 'play' : 'stop';
    demoText.textContent = reduced.matches ? 'Следваща поза' : animation === null ? 'Пусни демо' : 'Спри демото';
  }

  function stopDemo() {
    if (animation !== null) cancelAnimationFrame(animation);
    animation = null;
    route.removeAttribute('d');
    setDemoLabel();
  }

  demo.addEventListener('click', () => {
    if (animation !== null) { stopDemo(); return; }
    if (reduced.matches) {
      const pose = poses[poseIndex];
      showTarget(pose.x, pose.y);
      poseIndex = (poseIndex + 1) % poses.length;
      return;
    }
    const stops = [current, ...poses, current];
    route.setAttribute('d', stops.map((point, i) => (i ? 'L' : 'M') + point.x + ' ' + point.y).join(' '));
    const duration = 1450;
    const start = performance.now();
    function tick(time) {
      const elapsed = Math.max(0, (time - start) / duration);
      const segment = Math.floor(elapsed);
      if (segment >= stops.length - 1) {
        showTarget(stops[0].x, stops[0].y);
        stopDemo();
        return;
      }
      const t = elapsed - segment;
      const mix = t * t * (3 - 2 * t);
      const from = stops[segment], to = stops[segment + 1];
      showTarget(from.x + (to.x - from.x) * mix, from.y + (to.y - from.y) * mix);
      animation = requestAnimationFrame(tick);
    }
    animation = requestAnimationFrame(tick);
    setDemoLabel();
  });

  for (const input of [xInput, yInput]) {
    input.addEventListener('input', () => {
      stopDemo();
      showTarget(xInput.valueAsNumber, yInput.valueAsNumber);
    });
  }

  function toWorld(event) {
    const point = new DOMPoint(event.clientX, event.clientY);
    return point.matrixTransform(world.getScreenCTM().inverse());
  }

  handle.addEventListener('pointerdown', event => {
    if (drag || !event.isPrimary || event.button !== 0) return;
    stopDemo();
    const point = toWorld(event);
    draggedHandle = false;
    drag = { id: event.pointerId, dx: point.x - current.x, dy: point.y - current.y, startX: event.clientX, startY: event.clientY };
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return;
    if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 2 && !draggedHandle) return;
    draggedHandle = true;
    const point = toWorld(event);
    showTarget(point.x - drag.dx, point.y - drag.dy);
  });
  handle.addEventListener('lostpointercapture', () => { drag = null; });

  drawing.addEventListener('click', event => {
    if (draggedHandle && target.contains(event.target)) { draggedHandle = false; return; }
    draggedHandle = false;
    const point = toWorld(event);
    if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) return;
    stopDemo();
    showTarget(point.x, point.y);
  });

  document.addEventListener('visibilitychange', () => { if (document.hidden) stopDemo(); });
  reduced.addEventListener('change', stopDemo);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && animation !== null) stopDemo();
    }).observe(drawing);
  }

  showTarget(xInput.valueAsNumber, yInput.valueAsNumber);
  setDemoLabel();
  drawing.classList.add('interactive');
  demo.closest('.robot-controls').hidden = false;
})();
