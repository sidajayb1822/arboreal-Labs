document.addEventListener("DOMContentLoaded", () => {
  const isMobile = window.innerWidth <= 768;
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

  // 0. Light/Dark Mode Toggle (footer switch)
  const themeSwitch = document.getElementById('theme-switch');
  const themeLabel = document.getElementById('theme-toggle-label');
  const updateThemeLabel = () => {
    if (!themeLabel) return;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    themeLabel.textContent = `Experience our website in ${isLight ? 'Dark' : 'Light'} Mode`;
  };
  if (themeSwitch) {
    themeSwitch.checked = document.documentElement.getAttribute('data-theme') === 'light';
    updateThemeLabel();
    themeSwitch.addEventListener('change', () => {
      const isLight = themeSwitch.checked;
      document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
      try { localStorage.setItem('al-theme', isLight ? 'light' : 'dark'); } catch (e) {}
      updateThemeLabel();
    });
  }

  // Hamburger Menu Logic
  const hamburger = document.querySelector('.hamburger-btn');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
          hamburger.classList.toggle('active');
          navLinks.classList.toggle('active');
          document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
      });
      
      document.querySelectorAll('.nav-links a').forEach(link => {
          link.addEventListener('click', () => {
              if (window.innerWidth <= 768) {
                  hamburger.classList.remove('active');
                  navLinks.classList.remove('active');
                  document.body.style.overflow = '';
              }
          });
      });
  }

  const nav = document.querySelector('nav');
  // Phones: hide the header after a deliberate scroll down, bring it back after a short scroll up
  let lastNavY = window.scrollY, navDir = 0, navTurnY = lastNavY;
  const syncNavState = () => {
    const y = window.scrollY, dir = Math.sign(y - lastNavY);
    nav?.classList.toggle('is-scrolled', y > 40);
    if (dir && dir !== navDir) { navDir = dir; navTurnY = lastNavY; }
    lastNavY = y;
    const menuOpen = document.querySelector('.nav-links.active');
    if (window.innerWidth > 768 || menuOpen || y < 80) nav?.classList.remove('is-tucked');
    else if (navDir > 0 && y - navTurnY > 48) nav?.classList.add('is-tucked');
    else if (navDir < 0 && navTurnY - y > 24) nav?.classList.remove('is-tucked');
  };
  syncNavState();
  window.addEventListener('scroll', syncNavState, { passive: true });

  // 1. Lenis Smooth Scroll — driven by GSAP's ticker to keep every layer in sync.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lenis = typeof Lenis !== 'undefined' ? new Lenis({
    duration: reduceMotion ? 0 : 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !reduceMotion,
  }) : null;

  gsap.registerPlugin(ScrollTrigger);
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // 2. Custom Cursor (Desktop Only)
  const cursor = document.querySelector('.custom-cursor');
  if (cursor && !isTouchDevice) {
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });
    
    window.addEventListener('mousemove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });
    
    document.querySelectorAll('a, button, .magnetic, .theme-toggle').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  }

  // 3. Text Stagger Logic (Split string to words)
  const animTexts = document.querySelectorAll('.hero-anim-text');
  animTexts.forEach(textEl => {
    let resultHTML = "";
    Array.from(textEl.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const words = text.split(" ");
        resultHTML += words.map((w, i) => {
          if (w === "") return (i < words.length - 1) ? "&nbsp;" : "";
          return `<span class="word"><span class="char">${w}</span></span>` + ((i < words.length - 1) ? "&nbsp;" : "");
        }).join('');
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(true);
        if(clone.innerText) {
           const text = clone.innerText;
           const words = text.split(" ");
           clone.innerHTML = words.map((w, i) => {
             if (w === "") return (i < words.length - 1) ? "&nbsp;" : "";
             return `<span class="word"><span class="char">${w}</span></span>` + ((i < words.length - 1) ? "&nbsp;" : "");
           }).join('');
        }
        resultHTML += clone.outerHTML;
      }
    });
    textEl.innerHTML = resultHTML;
  });

  // 4. Preloader & Hero Timeline
  const tlIntro = gsap.timeline();
  if (document.querySelector('.preloader')) {
    tlIntro.to('.preloader', { opacity: 0, duration: 0.8, ease: "power2.inOut" })
           .set('.preloader', { display: "none" });
  }

  tlIntro.from('nav', { y: -30, opacity: 0, duration: 1, ease: "expo.out" }, "-=0.3")
         .from('.hero-anim-text .char', { 
           y: 50, opacity: 0, duration: 1.2, stagger: 0.05, ease: "power3.out"
         }, "-=0.8")
         .from('.hero-fade', { y: 20, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, "-=0.5");

  // 5. Section Scroll Reveals
  gsap.utils.toArray('.scroll-reveal').forEach(section => {
    gsap.from(section, {
      y: 60, opacity: 0, duration: 1.2, ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top 85%" }
    });
  });

  // 6. 3D Card Tilt & Flashlight mapped onto CSS vars
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; 
      const y = e.clientY - rect.top;
      
      // Update the CSS flashlight
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Wide panels stay flat: in perspective their far edge swings out and they look stretched
      if (!isTouchDevice && rect.width <= 640) {
        // Compute 3D tilt
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;  // max 8 deg
        const rotateY = ((x - centerX) / centerX) * 8;
        
        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          ease: "power2.out",
          duration: 0.5
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      if (!isTouchDevice) {
        gsap.to(card, { rotateX: 0, rotateY: 0, ease: "power2.out", duration: 0.5 });
      }
    });
  });

  // 7. Magnetic Buttons
  document.querySelectorAll('.magnetic').forEach(btn => {
    if(!isTouchDevice) {
      const xTo = gsap.quickTo(btn, "x", {duration: 0.4, ease: "power3"}, "px");
      const yTo = gsap.quickTo(btn, "y", {duration: 0.4, ease: "power3"}, "px");
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        xTo(relX * 0.25);
        yTo(relY * 0.25);
      });
      btn.addEventListener("mouseleave", () => {
        xTo(0); yTo(0);
      });
    }
  });

  // 8. Mouse Parallax on Orbs
  if (!isTouchDevice) {
    const orbs = document.querySelectorAll('.bg-orb');
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 50; 
      const y = (e.clientY / window.innerHeight - 0.5) * 50;
      gsap.to(orbs, { x: -x, y: -y, duration: 2, ease: 'power2.out', stagger: 0.05 });
    });
  }

  // Continuous subtle glow scaling
  gsap.to('.breathing', { scale: 1.02, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  // 9. Homepage cinematic depth system
  const heroVisual = document.querySelector('.pillar-globe');
  if (heroVisual && !reduceMotion) {
    gsap.to(heroVisual, {
      y: 60,
      scale: .86,
      ease: 'none',
      scrollTrigger: { trigger: '.hero-cinematic', start: 'top top', end: 'bottom top', scrub: 1.1 }
    });
    gsap.to('.hero-content', {
      yPercent: 18,
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: '.hero-cinematic', start: '42% top', end: 'bottom top', scrub: true }
    });
  }

  // Give internal pages the same spatial rhythm without requiring page-specific markup.
  if (!document.querySelector('.home-main')) {
    const pageHeaderElements = document.querySelectorAll('.page-header > .back-link, .page-header > .tagline, .page-header > h1, .page-header > p');
    if (pageHeaderElements.length && !reduceMotion) {
      gsap.from(pageHeaderElements, {
        y: 34,
        rotateX: -8,
        opacity: 0,
        duration: 1,
        stagger: .08,
        ease: 'power3.out',
        delay: .15
      });
    }

    gsap.utils.toArray('.page-header section').forEach((section) => {
      if (!reduceMotion) {
        gsap.fromTo(section,
          { y: 54, opacity: 0.35 },
          {
            y: 0, opacity: 1, ease: 'none',
            scrollTrigger: { trigger: section, start: 'top 92%', end: 'top 58%', scrub: .65 }
          }
        );
      }
    });
  }

  const storySteps = gsap.utils.toArray('.story-step');
  storySteps.forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 62%',
      end: 'bottom 38%',
      toggleClass: { targets: step, className: 'active' }
    });
    if (!reduceMotion) {
      gsap.from(step.querySelector('i'), {
        rotate: -35,
        scale: .7,
        scrollTrigger: { trigger: step, start: 'top 85%', end: 'top 45%', scrub: .8 }
      });
    }
  });

  gsap.utils.toArray('.service-panel').forEach((panel, index) => {
    if (!reduceMotion) {
      gsap.from(panel, {
        y: 100 + index * 28,
        rotateX: 12,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.services-deck', start: 'top 82%' }
      });
    }
  });

  // 10. Lazy-load promo video (defer the ~3MB download until it scrolls into view)
  const lazyVideo = document.querySelector('video[data-src]');
  if (lazyVideo) {
    const loadVideo = () => {
      if (!lazyVideo.src) {
        lazyVideo.src = lazyVideo.dataset.src;
        lazyVideo.load();
      }
    };
    if ('IntersectionObserver' in window) {
      const vObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadVideo();
            lazyVideo.play().catch(() => {});
          } else if (lazyVideo.src) {
            lazyVideo.pause();
          }
        });
      }, { rootMargin: '200px 0px' });
      vObserver.observe(lazyVideo);
    } else {
      // No IntersectionObserver support: load and play immediately
      loadVideo();
      lazyVideo.play().catch(() => {});
    }
  }

  // 11. Projects page filters (project type + industry)
  const projectGroups = document.querySelectorAll('.project-group');
  if (projectGroups.length) {
    const typeBtns = document.querySelectorAll('[data-type-filter]');
    const industryBtns = document.querySelectorAll('[data-industry-filter]');
    let activeType = 'all';
    let activeIndustry = 'all';

    const markActive = (btns, key, value) => btns.forEach(btn => {
      const isActive = btn.dataset[key] === value;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });

    const render = () => {
      markActive(typeBtns, 'typeFilter', activeType);
      markActive(industryBtns, 'industryFilter', activeIndustry);
      // Websites have their own filters (portfolio.js), so the industry row only applies to custom software
      const industryRow = document.querySelector('.work-filters-sub[aria-label="Filter by industry"]');
      if (industryRow) industryRow.classList.toggle('is-hidden', activeType === 'websites');
      projectGroups.forEach(group => {
        group.classList.toggle('is-hidden', activeType !== 'all' && group.dataset.type !== activeType);
        if (group.querySelector('.pf-grid')) return;
        let visible = 0;
        group.querySelectorAll('.work-card').forEach(card => {
          const show = activeIndustry === 'all' || card.dataset.industries.split(' ').includes(activeIndustry);
          card.classList.toggle('is-hidden', !show);
          if (show) visible++;
        });
        group.querySelector('.work-empty').classList.toggle('is-hidden', visible > 0);
      });
      // Hiding cards changes page height, so later scroll-reveal triggers need new positions
      ScrollTrigger.refresh();
    };

    typeBtns.forEach(btn => btn.addEventListener('click', () => {
      activeType = btn.dataset.typeFilter;
      history.replaceState(null, '', activeType === 'all' ? location.pathname : '#' + activeType);
      render();
    }));
    industryBtns.forEach(btn => btn.addEventListener('click', () => {
      activeIndustry = btn.dataset.industryFilter;
      render();
    }));

    const initialType = location.hash.slice(1);
    if (Array.from(typeBtns).some(btn => btn.dataset.typeFilter === initialType)) activeType = initialType;
    render();
  }

  // 12. Scroll-drawn process roadmap (Custom Systems page)
  const roadmap = document.querySelector('.roadmap');
  if (roadmap) {
    const track = roadmap.querySelector('.roadmap-track');
    const svg = roadmap.querySelector('.roadmap-svg');
    const paths = svg.querySelectorAll('path');
    const progressPath = svg.querySelector('.road-progress');
    const car = roadmap.querySelector('.roadmap-car');
    const stops = Array.from(roadmap.querySelectorAll('.roadmap-stop'));
    let length = 0, stopLengths = [], current = reduceMotion ? 1 : 0;

    // Trace a smooth road through the centre of every stop node.
    const build = () => {
      const box = track.getBoundingClientRect();
      const pts = stops.map((stop) => {
        const r = stop.querySelector('.stop-node').getBoundingClientRect();
        return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top];
      });
      const all = [[pts[0][0], 0], ...pts, [pts[pts.length - 1][0], box.height]];
      let d = `M${all[0][0]},${all[0][1]}`;
      for (let i = 1; i < all.length; i++) {
        const [x1, y1] = all[i - 1], [x2, y2] = all[i];
        const my = (y1 + y2) / 2;
        d += ` C${x1},${my} ${x2},${my} ${x2},${y2}`;
      }
      svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
      paths.forEach((p) => p.setAttribute('d', d));
      length = progressPath.getTotalLength();
      progressPath.style.strokeDasharray = length;
      // Distance along the road at which each stop is reached (y rises monotonically).
      stopLengths = pts.map(([, y]) => {
        let lo = 0, hi = length;
        for (let k = 0; k < 24; k++) {
          const mid = (lo + hi) / 2;
          if (progressPath.getPointAtLength(mid).y < y) lo = mid; else hi = mid;
        }
        return lo;
      });
      render(current);
      roadmap.classList.add('is-ready');
    };

    const render = (progress) => {
      current = progress;
      const drawn = length * progress;
      progressPath.style.strokeDashoffset = length - drawn;
      const pt = progressPath.getPointAtLength(drawn);
      car.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
      stops.forEach((stop, i) => stop.classList.toggle('is-reached', drawn >= stopLengths[i] - 4));
    };

    build();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(build, 150); });

    if (!reduceMotion) {
      const proxy = { p: 0 };
      gsap.to(proxy, {
        p: 1,
        ease: 'none',
        onUpdate: () => render(proxy.p),
        scrollTrigger: { trigger: track, start: 'top 72%', end: 'bottom 60%', scrub: 0.6 }
      });
    }
  }
});
