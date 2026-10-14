// Website portfolio: filters, live card previews and the case-study site viewer.
(function () {
  // Live iframes are heavy, so phones, data-saver and reduced-motion users keep the screenshot.
  const conn = navigator.connection || {};
  const allowLive = window.matchMedia('(min-width: 900px)').matches && !conn.saveData &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Filters: category (live / assisted / concept) plus an "actively managed" toggle
  const cards = Array.from(document.querySelectorAll('.pf-card'));
  const catBtns = document.querySelectorAll('[data-pf-filter]');
  const empty = document.querySelector('.pf-empty');
  if (cards.length && catBtns.length) {
    let active = 'all';
    const render = () => {
      let visible = 0;
      catBtns.forEach(btn => {
        const on = btn.dataset.pfFilter === active;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', on);
      });
      cards.forEach(card => {
        const show = active === 'all' ||
          (active === 'managed' ? card.dataset.managed === 'true' : card.dataset.category === active);
        card.classList.toggle('is-hidden', !show);
        if (show) visible++;
      });
      if (empty) empty.classList.toggle('is-hidden', visible > 0);
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    };
    catBtns.forEach(btn => btn.addEventListener('click', () => {
      active = btn.dataset.pfFilter;
      render();
    }));
    render();
  }

  // 2. Card previews: screenshot by default, live site scaled to fit while hovered
  const screens = document.querySelectorAll('.pf-screen[data-src]');
  if (screens.length && allowLive && window.matchMedia('(hover: hover)').matches) {
    const fit = (screen) => screen.style.setProperty('--pf-scale', (screen.clientWidth / 1440).toFixed(4));
    // Open the connection to every site once the page is idle, so a hover starts loading straight away
    (window.requestIdleCallback || setTimeout)(() => {
      new Set(Array.from(screens, sc => new URL(sc.dataset.src).origin)).forEach(origin => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = origin;
        document.head.appendChild(link);
      });
    });
    screens.forEach(screen => {
      const card = screen.closest('.pf-card') || screen;
      let timer = 0;
      const start = () => {
        clearTimeout(timer);
        // short delay so sweeping the mouse across the grid doesn't load every site
        timer = setTimeout(() => {
          if (screen.querySelector('iframe')) return;
          const frame = document.createElement('iframe');
          frame.src = screen.dataset.src;
          frame.title = 'Live preview of ' + (screen.dataset.name || 'the website');
          frame.tabIndex = -1;
          frame.setAttribute('aria-hidden', 'true');
          frame.setAttribute('scrolling', 'no');
          frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
          frame.addEventListener('load', () => setTimeout(() => {
            if (frame.isConnected) screen.classList.add('is-live');
          }, 150));
          fit(screen);
          screen.appendChild(frame);
        }, 80);
      };
      const stop = () => {
        clearTimeout(timer);
        screen.classList.remove('is-live');
        screen.querySelector('iframe')?.remove();
      };
      card.addEventListener('mouseenter', start);
      card.addEventListener('mouseleave', stop);
    });
  }

  // 3. Case-study window: the live site rendered at a real device size, scaled to fit the frame
  const win = document.querySelector('.pf-desk-screen[data-src]');
  if (win) {
    const SIZES = { desktop: [1440, 900], tablet: [820, 1180], mobile: [390, 844] };
    let device = 'desktop';
    const fit = () => {
      const [w, h] = SIZES[device];
      const s = device === 'desktop' ? win.clientWidth / w : Math.min(win.clientWidth / w, (win.clientHeight - 32) / h);
      win.style.setProperty('--pf-w', w + 'px');
      win.style.setProperty('--pf-h', h + 'px');
      win.style.setProperty('--pf-scale', s.toFixed(4));
      win.style.setProperty('--pf-left', ((win.clientWidth - w * s) / 2).toFixed(1) + 'px');
    };
    const mount = () => {
      if (win.querySelector('iframe')) return;
      const frame = document.createElement('iframe');
      frame.src = win.dataset.src;
      frame.title = 'Live website: ' + (win.dataset.name || '');
      win.replaceChildren(frame);
      fit();
    };
    new ResizeObserver(fit).observe(win);
    if (allowLive) mount();
    else win.querySelector('[data-pf-load]')?.addEventListener('click', mount);

    const btns = document.querySelectorAll('.pf-view-switch button');
    btns.forEach(btn => btn.addEventListener('click', () => {
      device = btn.dataset.device;
      win.dataset.device = device;
      btns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', b === btn);
      });
      mount();
      fit();
    }));
  }
})();
