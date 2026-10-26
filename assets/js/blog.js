// Blog: category filter on /blog; on articles a reading bar, visuals that play in view, checklists, the "On this page" highlight and copy link
(() => {
  // ---------- Category filter ----------
  const buttons = document.querySelectorAll('[data-blog-filter]');
  buttons.forEach((btn) => btn.addEventListener('click', () => {
    const cat = btn.dataset.blogFilter;
    buttons.forEach((b) => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-pressed', String(b === btn));
    });
    document.querySelectorAll('.blog-index .blog-card').forEach((card) => {
      card.classList.toggle('is-hidden', cat !== 'all' && card.dataset.category !== cat);
    });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }));

  const article = document.querySelector('.blog-article');
  if (!article) return;

  // ---------- Visuals play once, when they scroll into view ----------
  const visuals = document.querySelectorAll('[data-bv]');
  if ('IntersectionObserver' in window) {
    const seen = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        seen.unobserve(en.target);
      });
    }, { threshold: 0.35 });
    // Snap each visual to its starting state without animating the way there
    visuals.forEach((v) => v.classList.add('bv-arming', 'bv-armed'));
    void document.body.offsetHeight;
    visuals.forEach((v) => { v.classList.remove('bv-arming'); seen.observe(v); });
  }

  // ---------- Checklists: count the ticks and show the matching advice ----------
  document.querySelectorAll('[data-check]').forEach((box) => {
    const inputs = [...box.querySelectorAll('input[type="checkbox"]')];
    const results = [...box.querySelectorAll('[data-min]')];
    const update = () => {
      const n = inputs.filter((i) => i.checked).length;
      box.style.setProperty('--score', n / inputs.length);
      box.querySelector('[data-check-count]').textContent = n;
      const match = results.filter((r) => n >= +r.dataset.min).pop();
      results.forEach((r) => r.classList.toggle('is-shown', r === match));
    };
    inputs.forEach((i) => i.addEventListener('change', update));
    update();
  });

  // ---------- Reading bar ----------
  const bar = document.createElement('div');
  bar.className = 'blog-progress';
  document.body.appendChild(bar);
  const updateBar = () => {
    const r = article.getBoundingClientRect();
    const read = Math.min(1, Math.max(0, (innerHeight * 0.4 - r.top) / (r.height - innerHeight * 0.4 || 1)));
    bar.style.transform = `scaleX(${read})`;
  };
  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();

  // ---------- "On this page" follows the section being read ----------
  const links = [...document.querySelectorAll('.blog-toc a')];
  const sections = links.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('is-active', a.hash === '#' + en.target.id));
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  // ---------- Copy link ----------
  const copy = document.querySelector('[data-copy-link]');
  if (copy) copy.addEventListener('click', async () => {
    const label = copy.querySelector('span');
    try {
      await navigator.clipboard.writeText(location.origin + location.pathname);
      label.textContent = 'Link copied';
    } catch (e) {
      label.textContent = 'Copy failed';
    }
    setTimeout(() => { label.textContent = 'Copy link'; }, 2000);
  });
})();
