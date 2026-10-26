/* Sprout, the Arboreal Labs mascot.
   A small guide docked in the corner of every page: it blinks, follows the
   cursor with its eyes, notices links and buttons, and opens a page-aware help
   bubble. On the contact page it reacts to the form; on the 404 page it looks
   around for the missing page. The drawing is the master SVG from the brand
   guidelines (output/arboreal-mascot.html), only wrapped in groups so the eyes
   and antenna can move. Nothing loops: it only reacts to events. */
(function () {
  if (window.__sprout) return;
  window.__sprout = true;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const path = location.pathname.replace(/\.html$/, '').replace(/\/index$/, '').replace(/\/$/, '') || '/';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };

  // ---------- The character (master drawing, unchanged) ----------
  let uid = 0;
  function botSVG(viewBox) {
    const n = ++uid;
    return `<svg class="sprout-svg" viewBox="${viewBox}" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="sp-eye-glow-${n}" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#FF3B3B" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#FF3B3B" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sp-shell-${n}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="#D0D4D9"/>
    </linearGradient>
  </defs>
  <g class="sp-bot">
    <rect x="232" y="356" width="48" height="30" rx="8" fill="#868B91"/>
    <rect x="160" y="378" width="192" height="180" rx="56" fill="url(#sp-shell-${n})" style="stroke:var(--ab-outline,none);stroke-width:4"/>
    <g fill="none" stroke="#FF3B3B" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M256 470 V430 M256 448 L238 430 V418 M256 440 L274 422"/>
      <path d="M244 470 H268"/>
    </g>
    <g fill="#F0F2F5" stroke="#FF3B3B" stroke-width="5">
      <circle cx="238" cy="413" r="5"/><circle cx="278" cy="418" r="5"/><circle cx="256" cy="425" r="5"/>
    </g>
    <g fill="none" stroke="#FF3B3B" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
      <path d="M256 168 V110"/>
      <path d="M256 150 L222 116 H212"/>
      <path d="M256 136 L284 108 H296"/>
    </g>
    <g stroke="#FF3B3B" stroke-width="8">
      <circle class="sp-node" cx="202" cy="116" r="10"/>
      <circle class="sp-node" cx="256" cy="98" r="11"/>
      <circle class="sp-node" cx="306" cy="108" r="10"/>
    </g>
    <rect x="112" y="228" width="34" height="84" rx="14" fill="#AEB2B7"/>
    <rect x="366" y="228" width="34" height="84" rx="14" fill="#AEB2B7"/>
    <rect x="104" y="256" width="12" height="28" rx="6" fill="#FF3B3B"/>
    <rect x="396" y="256" width="12" height="28" rx="6" fill="#FF3B3B"/>
    <rect x="132" y="164" width="248" height="204" rx="68" fill="url(#sp-shell-${n})" style="stroke:var(--ab-outline,none);stroke-width:4"/>
    <rect x="162" y="204" width="188" height="120" rx="48" fill="#11131A"/>
    <rect x="178" y="214" width="70" height="10" rx="5" fill="#F0F2F5" fill-opacity="0.10"/>
    <g class="sp-gaze">
      <circle cx="218" cy="258" r="34" fill="url(#sp-eye-glow-${n})"/>
      <circle cx="294" cy="258" r="34" fill="url(#sp-eye-glow-${n})"/>
      <g class="sp-eye">
        <rect x="204" y="236" width="28" height="44" rx="14" fill="#FF3B3B"/>
        <circle cx="213" cy="248" r="5" fill="#FFFFFF" fill-opacity="0.85"/>
      </g>
      <g class="sp-eye">
        <rect x="280" y="236" width="28" height="44" rx="14" fill="#FF3B3B"/>
        <circle cx="289" cy="248" r="5" fill="#FFFFFF" fill-opacity="0.85"/>
      </g>
    </g>
    <path d="M236 296 Q256 312 276 296" fill="none" stroke="#FF3B3B" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="160" cy="330" rx="14" ry="8" fill="#FF3B3B" fill-opacity="0.35"/>
    <ellipse cx="352" cy="330" rx="14" ry="8" fill="#FF3B3B" fill-opacity="0.35"/>
  </g>
</svg>`;
  }
  const CUTOUT = '80 60 352 500';

  // ---------- Page-aware help ----------
  const PRODUCTS = ['/inventory-management', '/sales-pipeline-crm', '/deal-pipeline-platform', '/precision-variance', '/growx', '/athenalms'];
  const touch = !finePointer;
  function tip() {
    if (path === '/') return { text: 'I can point you to the right place. What would you like to know?' };
    if (path === '/custom-solutions') return { text: 'The questions people ask most about custom software are answered further down this page.', links: [['Jump to the questions', '#faq']] };
    if (path === '/website-solutions') return { text: 'A few of the websites we have built are further down, and you can browse them all too.', links: [['Jump to our work', '#work'], ['All websites', '/websites']] };
    if (path === '/projects') return { text: 'Use the industry buttons to find systems built for businesses like yours.' };
    if (path === '/websites') return { text: touch ? 'Tap any card to read the story behind the site. The buttons at the top sort them by type.' : 'Hover over any card to see the site live. The buttons at the top sort them by type.' };
    if (path.startsWith('/websites/')) return { text: 'Use the Desktop, Tablet and Mobile buttons to see this site on any screen.' };
    if (PRODUCTS.includes(path)) return { text: 'Every system we build is shaped around how your team already works. Happy to talk through yours.', links: [['Talk to the team', '/contact']] };
    if (path === '/blog') return { text: 'Pick a topic with the buttons at the top, or start with the featured guide.' };
    if (path.startsWith('/blog/')) return { text: 'My antenna fills up as you read. If this sounds like your business, the team is happy to talk it through.', links: [['Talk to the team', '/contact?from=sprout-blog']] };
    if (path === '/contact') return { text: 'Tell us a little about your project. The form goes straight to the founders.' };
    return { text: 'I can point you to the right place. What would you like to know?' };
  }
  const QUESTIONS = [
    ['What do you build?', 'Custom business software with AI built in, like inventory, sales CRM and deal pipeline systems, and websites designed to bring in enquiries.',
      [['Custom software', '/custom-solutions'], ['Websites', '/website-solutions']]],
    ['How long does it take?', 'Most custom software is ready to use in 4 to 10 weeks, and you see progress every week. For a website, tell us what you need and we will give you a clear timeline.',
      [['Start a project', '/contact']]],
    ['Who owns the data?', 'You do. Your data is yours, exportable at any time, and you are never locked in.', []],
    ['Can I see your work?', 'Of course. Here is the software and the websites we have built.',
      [['Custom software', '/projects'], ['Websites', '/websites']]],
  ];
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const linksHTML = (links) => links && links.length
    ? `<p class="sprout-links">${links.map(([t, h]) => `<a href="${h}">${esc(t)}</a>`).join('')}</p>` : '';

  // ---------- Behaviour shared by every Sprout on the page ----------
  function animate(root) {
    const gaze = root.querySelector('.sp-gaze');
    let look = { x: 0, y: 0 };
    const setLook = (x, y) => {
      look = { x, y };
      gaze.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    };
    // Points the eyes at a screen position, within the visor
    const lookAt = (px, py) => {
      const r = root.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height * 0.42;
      const dx = px - cx, dy = py - cy;
      const d = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, d / 260);
      setLook((dx / d) * 11 * reach, (dy / d) * 8 * reach);
    };
    return { setLook, lookAt, get look() { return look; } };
  }

  // ---------- Tips inside articles: the same character, glancing at what it says ----------
  document.querySelectorAll('[data-sprout-tip]').forEach((slot) => {
    slot.innerHTML = `<span class="sprout-bot${reduceMotion ? '' : ' is-alive'}">${botSVG(CUTOUT)}</span>`;
    animate(slot.firstElementChild).setLook(9, 1);
  });

  // ---------- 404: a bigger Sprout looking for the page ----------
  const lostSlot = document.querySelector('[data-sprout-lost]');
  if (lostSlot) {
    lostSlot.innerHTML = `<div class="sprout-lost${reduceMotion ? '' : ' is-searching'}" role="img" aria-label="Sprout, the Arboreal Labs mascot, looking around">${botSVG(CUTOUT)}</div>`;
    return; // the corner guide stays away from the 404 page
  }

  // ---------- The corner guide ----------
  const dock = document.createElement('div');
  dock.className = 'sprout-dock';
  dock.innerHTML = `
    <div class="sprout-bubble" id="sprout-bubble" role="dialog" aria-label="Sprout, the site guide" hidden>
      <button type="button" class="sprout-close" aria-label="Close"><i class="ph ph-x" aria-hidden="true"></i></button>
      <p class="sprout-hi">Hi, I'm Sprout.</p>
      <div class="sprout-body"></div>
    </div>
    <p class="sprout-hello" aria-hidden="true" hidden></p>
    <button type="button" class="sprout-btn" aria-label="Open Sprout, the site guide" aria-expanded="false" aria-controls="sprout-bubble">
      <span class="sprout-bot${reduceMotion ? '' : ' is-alive'}">${botSVG(CUTOUT)}</span>
    </button>`;
  document.body.appendChild(dock);

  const btn = dock.querySelector('.sprout-btn');
  const bot = dock.querySelector('.sprout-bot');
  const bubble = dock.querySelector('.sprout-bubble');
  const body = dock.querySelector('.sprout-body');
  const hello = dock.querySelector('.sprout-hello');
  const eyes = animate(bot);

  function renderHome() {
    const t = tip();
    body.innerHTML = `<p class="sprout-tip">${esc(t.text)}</p>${linksHTML(t.links)}
      <ul class="sprout-qs">${QUESTIONS.map(([q], i) => `<li><button type="button" data-q="${i}">${esc(q)}<i class="ph ph-arrow-right" aria-hidden="true"></i></button></li>`).join('')}</ul>
      ${path === '/contact' ? '' : '<p class="sprout-foot"><a href="/contact">Talk to the team</a></p>'}`;
  }
  function renderAnswer(i) {
    const [q, a, links] = QUESTIONS[i];
    body.innerHTML = `<p class="sprout-q">${esc(q)}</p><p class="sprout-tip">${esc(a)}</p>${linksHTML(links)}
      <p class="sprout-foot"><button type="button" class="sprout-back"><i class="ph ph-arrow-left" aria-hidden="true"></i> Other questions</button></p>`;
    body.querySelector('.sprout-back').focus();
  }

  function open() {
    hideHello();
    renderHome();
    bubble.hidden = false;
    requestAnimationFrame(() => dock.classList.add('is-open'));
    btn.setAttribute('aria-expanded', 'true');
    store.set('al-sprout-met', '1');
    const first = bubble.querySelector('a, button:not(.sprout-close)');
    if (first) first.focus({ preventScroll: true });
  }
  function close(returnFocus) {
    dock.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    setTimeout(() => { if (!dock.classList.contains('is-open')) bubble.hidden = true; }, 200);
    if (returnFocus) btn.focus({ preventScroll: true });
  }
  btn.addEventListener('click', () => (dock.classList.contains('is-open') ? close(false) : open()));
  dock.querySelector('.sprout-close').addEventListener('click', () => close(true));
  body.addEventListener('click', (e) => {
    const q = e.target.closest('[data-q]');
    if (q) return renderAnswer(+q.dataset.q);
    if (e.target.closest('.sprout-back')) { renderHome(); bubble.querySelector('[data-q]').focus(); return; }
    if (e.target.closest('a')) close(false);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && dock.classList.contains('is-open')) close(true); });
  document.addEventListener('pointerdown', (e) => { if (dock.classList.contains('is-open') && !dock.contains(e.target)) close(false); });

  // ---------- Say hello once ----------
  let helloTimer = 0;
  function say(text, ms) {
    hello.textContent = text;
    hello.hidden = false;
    requestAnimationFrame(() => hello.classList.add('is-on'));
    clearTimeout(helloTimer);
    helloTimer = setTimeout(hideHello, ms);
  }
  function hideHello() {
    hello.classList.remove('is-on');
    setTimeout(() => { if (!hello.classList.contains('is-on')) hello.hidden = true; }, 300);
  }
  const firstVisit = !store.get('al-sprout-met');
  if (firstVisit && !reduceMotion) {
    dock.classList.add('is-arriving');
    window.addEventListener('load', () => setTimeout(() => {
      dock.classList.remove('is-arriving');
      setTimeout(() => say(touch ? 'Hi! Tap me if you need a hand.' : 'Hi! Click me if you need a hand.', 4500), 700);
      store.set('al-sprout-met', '1');
    }, 1200), { once: true });
  }

  // ---------- Eyes follow the cursor; on touch, they follow the scroll ----------
  if (!reduceMotion) {
    if (finePointer) {
      let raf = 0, mx = 0, my = 0;
      window.addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY;
        if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (!bot.classList.contains('is-busy')) eyes.lookAt(mx, my); });
      }, { passive: true });
      document.addEventListener('mouseleave', () => eyes.setLook(0, 0));
    } else {
      let lastY = window.scrollY, idle = 0;
      window.addEventListener('scroll', () => {
        if (bot.classList.contains('is-busy')) return;
        const y = window.scrollY;
        if (Math.abs(y - lastY) > 2) eyes.setLook(0, y > lastY ? 7 : -7);
        lastY = y;
        clearTimeout(idle);
        idle = setTimeout(() => eyes.setLook(0, 0), 500);
      }, { passive: true });
    }
  }

  // ---------- Notices links and buttons: the antenna lights up ----------
  let noticeTimer = 0;
  const notice = () => {
    bot.classList.add('is-noticing');
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => bot.classList.remove('is-noticing'), 700);
  };
  const INTERACTIVE = 'a[href], button, .pf-card, .glass-card, [role="button"]';
  document.addEventListener('pointerover', (e) => {
    const el = e.target.closest(INTERACTIVE);
    if (el && !dock.contains(el) && !(e.relatedTarget && el.contains(e.relatedTarget))) notice();
  });

  // ---------- Contact page: watches the form, thinks, then celebrates ----------
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('focusin', (e) => {
      if (reduceMotion || bot.classList.contains('is-busy')) return;
      const r = e.target.getBoundingClientRect();
      eyes.lookAt(r.left + r.width / 2, r.top + r.height / 2);
    });
    form.addEventListener('submit', () => {
      close(false);
      bot.classList.add('is-busy', 'is-thinking');
      eyes.setLook(0, -9);
    });
    const submit = document.getElementById('submit-btn');
    if (submit) {
      new MutationObserver(() => {
        const label = submit.textContent;
        if (/sent/i.test(label)) {
          bot.classList.remove('is-thinking');
          bot.classList.add('is-happy');
          eyes.setLook(0, 0);
          say('Sent! The team will be in touch.', 5000);
          setTimeout(() => bot.classList.remove('is-happy', 'is-busy'), 3200);
        } else if (/submit/i.test(label)) {
          bot.classList.remove('is-thinking', 'is-busy');
          eyes.setLook(0, 0);
        }
      }).observe(submit, { childList: true, characterData: true, subtree: true });
    }
  }

  // ---------- Reading progress (blog posts): the antenna fills as you read ----------
  const article = document.querySelector('[data-sprout-progress]');
  if (article) {
    const nodes = bot.querySelectorAll('.sp-node');
    const update = () => {
      const r = article.getBoundingClientRect();
      const read = Math.min(1, Math.max(0, (innerHeight - r.top) / (r.height || 1)));
      nodes.forEach((n, i) => n.classList.toggle('is-lit', read >= (i + 1) / nodes.length - 0.02));
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
})();
