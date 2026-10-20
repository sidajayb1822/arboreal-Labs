/* Pillar globe — vanilla port of the "interactive-globe" React component.
   Draws a dotted, draggable globe with the four pillars of digital
   transformation as markers. Pauses when off-screen or the tab is hidden. */
(function () {
  const canvas = document.querySelector('.pillar-globe');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PILLARS = [
    { lat: 22, lng: -30, label: 'People', sub: 'Support & teams' },
    { lat: -18, lng: 60, label: 'Processes', sub: 'Workflows' },
    { lat: 22, lng: 150, label: 'Presence', sub: 'Brand awareness' },
    { lat: -18, lng: -120, label: 'Partners', sub: 'Vendors & outsiders' },
  ];
  // Pillars sit 90° apart, so at least two always face the viewer.
  // Neighbours are linked in a ring: one connected system.
  const CONNECTIONS = PILLARS.map((p, i) => [p, PILLARS[(i + 1) % PILLARS.length]]);

  // Fibonacci sphere, kept sparse for a cleaner, more compact look.
  const NUM_DOTS = 520;
  const dots = [];
  const golden = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < NUM_DOTS; i++) {
    const theta = (2 * Math.PI * i) / golden;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / NUM_DOTS);
    dots.push([Math.cos(theta) * Math.sin(phi), Math.cos(phi), Math.sin(theta) * Math.sin(phi)]);
  }

  function latLngToXYZ(lat, lng, r) {
    const phi = ((90 - lat) * Math.PI) / 180;
    const theta = ((lng + 180) * Math.PI) / 180;
    return [-(r * Math.sin(phi) * Math.cos(theta)), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)];
  }
  function rotate(p, rx, ry) {
    let [x, y, z] = p;
    const cx = Math.cos(rx), sx = Math.sin(rx);
    [y, z] = [y * cx - z * sx, y * sx + z * cx];
    const cy = Math.cos(ry), sy = Math.sin(ry);
    return [x * cy + z * sy, y, -x * sy + z * cy];
  }
  const FOV = 600;
  function project(x, y, z, cx, cy) {
    const s = FOV / (FOV + z);
    return [x * s + cx, y * s + cy];
  }

  const displayFont = getComputedStyle(document.documentElement).getPropertyValue('--font-display').trim() || 'system-ui, sans-serif';

  function palette() {
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    return light
      ? { dot: '30, 30, 36', red: '220, 38, 38', label: '20, 20, 24', outline: 'rgba(220, 38, 38, 0.25)', shadow: 'rgba(255, 255, 255, 0.9)' }
      : { dot: '245, 246, 248', red: '255, 59, 59', label: '245, 246, 248', outline: 'rgba(255, 59, 59, 0.35)', shadow: 'rgba(0, 0, 0, 0.85)' };
  }

  let w = 0, h = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);

  let rotY = 1.2, rotX = 0.28, time = 0;
  const drag = { active: false, x: 0, y: 0, ry: 0, rx: 0 };

  function draw() {
    const c = palette();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2, cy = h / 2;
    const r = Math.min(w, h) * 0.34;

    // Soft brand glow + outline
    const glow = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 1.45);
    glow.addColorStop(0, `rgba(${c.red}, 0.07)`);
    glow.addColorStop(1, `rgba(${c.red}, 0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = c.outline;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Dots (front hemisphere only)
    for (let i = 0; i < dots.length; i++) {
      const [x, y, z] = rotate([dots[i][0] * r, dots[i][1] * r, dots[i][2] * r], rotX, rotY);
      if (z > 0) continue;
      const [sx, sy] = project(x, y, z, cx, cy);
      const depth = Math.max(0.08, 1 - (z + r) / (2 * r));
      ctx.beginPath();
      ctx.arc(sx, sy, 1 + depth * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.dot}, ${(0.3 + depth * 0.6).toFixed(2)})`;
      ctx.fill();
    }

    // Arcs between pillars, each with a travelling pulse
    CONNECTIONS.forEach(([a, b], idx) => {
      const p1 = rotate(latLngToXYZ(a.lat, a.lng, r), rotX, rotY);
      const p2 = rotate(latLngToXYZ(b.lat, b.lng, r), rotX, rotY);
      // Dim (never hide) arcs as either end rotates behind the globe
      const front = (z) => Math.max(0, Math.min(1, (r * 0.15 - z) / (r * 0.4)));
      const vis = 0.3 + 0.7 * Math.min(front(p1[2]), front(p2[2]));
      const [sx1, sy1] = project(...p1, cx, cy);
      const [sx2, sy2] = project(...p2, cx, cy);
      const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2, mz = (p1[2] + p2[2]) / 2;
      const len = Math.hypot(mx, my, mz) || 1;
      const lift = r * 1.3;
      const [qx, qy] = project((mx / len) * lift, (my / len) * lift, (mz / len) * lift, cx, cy);

      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.quadraticCurveTo(qx, qy, sx2, sy2);
      ctx.strokeStyle = `rgba(${c.red}, ${(0.8 * vis).toFixed(2)})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      const t = (Math.sin(time * 1.1 + idx * 1.3) + 1) / 2;
      const tx = (1 - t) * (1 - t) * sx1 + 2 * (1 - t) * t * qx + t * t * sx2;
      const ty = (1 - t) * (1 - t) * sy1 + 2 * (1 - t) * t * qy + t * t * sy2;
      ctx.beginPath();
      ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.red}, ${vis.toFixed(2)})`;
      ctx.fill();
    });

    // Pillar markers + labels
    PILLARS.forEach((m) => {
      const [x, y, z] = rotate(latLngToXYZ(m.lat, m.lng, r), rotX, rotY);
      // Pillars behind the globe stay visible, just dimmer
      const a = z > 0 ? 0.45 : 1;
      const [sx, sy] = project(x, y, z, cx, cy);
      ctx.globalAlpha = a;
      const pulse = Math.sin(time * 2 + m.lat) * 0.5 + 0.5;

      ctx.beginPath();
      ctx.arc(sx, sy, 5 + pulse * 5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${c.red}, ${(0.22 + pulse * 0.18).toFixed(2)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.red}, 1)`;
      ctx.shadowColor = `rgba(${c.red}, 0.8)`;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.shadowColor = c.shadow;
      ctx.shadowBlur = 6;
      // Labels on the right half sit left of the dot so they never clip
      const flip = sx > cx + r * 0.3;
      const lx = flip ? sx - 12 : sx + 12;
      ctx.textAlign = flip ? 'right' : 'left';
      const fs = Math.max(12, Math.min(17, r * 0.09));
      ctx.font = `700 ${fs}px ${displayFont}`;
      ctx.fillStyle = `rgba(${c.label}, 1)`;
      ctx.fillText(m.label.toUpperCase(), lx, sy + 2);
      ctx.font = `500 ${Math.round(fs * 0.76)}px ${displayFont}`;
      ctx.fillStyle = `rgba(${c.label}, 0.8)`;
      ctx.fillText(m.sub, lx, sy + fs * 1.2);
      ctx.textAlign = 'left';
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    });
  }

  // Animation loop — only runs while visible
  // Phones draw at ~30fps; steps scale with elapsed time so the speed is unchanged.
  const lowPower = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768;
  const FRAME_MS = lowPower ? 33 : 0;
  let raf = 0, visible = true, last = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (now - last < FRAME_MS) return;
    const steps = FRAME_MS && last ? Math.min((now - last) / 16.7, 3) : 1;
    last = now;
    if (!drag.active && !reduceMotion) rotY += 0.0022 * steps;
    time += 0.015 * steps;
    draw();
  }
  function start() { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); }
  function stop() { cancelAnimationFrame(raf); raf = 0; last = 0; }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? start() : stop(); }).observe(canvas);
  }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  draw();
  start();

  // Drag to rotate
  canvas.addEventListener('pointerdown', (e) => {
    Object.assign(drag, { active: true, x: e.clientX, y: e.clientY, ry: rotY, rx: rotX });
    canvas.setPointerCapture(e.pointerId);
    if (reduceMotion) start();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag.active) return;
    rotY = drag.ry + (e.clientX - drag.x) * 0.005;
    rotX = Math.max(-1, Math.min(1, drag.rx + (e.clientY - drag.y) * 0.005));
    if (reduceMotion) draw();
  });
  const end = () => { drag.active = false; };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
})();
