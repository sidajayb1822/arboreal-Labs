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
      
      document.querySelectorAll('.dropdown').forEach(dd => {
          dd.addEventListener('click', (e) => {
              if (window.innerWidth <= 768 && e.target.tagName.toLowerCase() === 'a' && e.target.nextElementSibling?.classList.contains('dropdown-content')) {
                  e.preventDefault();
                  dd.classList.toggle('active');
              }
          });
      });
      
      document.querySelectorAll('.nav-links a:not(.dropdown > a)').forEach(link => {
          link.addEventListener('click', () => {
              if (window.innerWidth <= 768) {
                  hamburger.classList.remove('active');
                  navLinks.classList.remove('active');
                  document.body.style.overflow = '';
              }
          });
      });
  }

  // 1. Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

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
    
    document.querySelectorAll('a, button, .magnetic, .dropdown, .theme-toggle').forEach(el => {
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

      if (!isTouchDevice) {
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

  // 10. Custom Systems — Netflix-style mosaic overlay (click to open)
  const csTriggers = document.querySelectorAll('.cs-trigger');
  if (csTriggers.length) {
    const csTiles = [
      { href: '/custom-solutions', title: 'Custom Software', desc: 'Bespoke platforms and AI tools, built exactly for how your business runs.', icon: 'ph-cpu', cls: 'cs-feat', accent: 'rgba(255,59,59,0.30)', solid: '#FF3B3B', live: true },
      { href: '/precision-variance', title: 'Precision Variance Analysis', desc: 'Catch every cost and quantity variance against a signed, auditable baseline.', icon: 'ph-chart-scatter', cls: 'cs-wide', accent: 'rgba(99,102,241,0.30)', solid: '#6366F1' },
      { href: '/customs-clearance', title: 'Customs Clearance & Compliance', desc: 'Customs docs, duties, and trade compliance in one connected workflow.', icon: 'ph-package', cls: '', accent: 'rgba(45,212,191,0.28)', solid: '#2DD4BF' },
      { href: '/client-engagement', title: 'Client Engagement', desc: 'Every client touchpoint and approval in one place.', icon: 'ph-chats-circle', cls: '', accent: 'rgba(251,191,36,0.26)', solid: '#FBBF24' },
      { href: '/accounting-compliance', title: 'Accounting Compliance', desc: 'Automated ledgers, reconciliations, and audit-ready reporting.', icon: 'ph-calculator', cls: 'cs-banner', accent: 'rgba(52,211,153,0.26)', solid: '#34D399' },
    ];
    const tilesHTML = csTiles.map(t => `
        <a class="cs-tile ${t.cls}" href="${t.href}" style="--cs-accent:${t.accent}; --cs-solid:${t.solid};">
          <i class="ph ${t.icon} cs-wm"></i>
          ${t.live ? '' : '<span class="cs-badge">Coming Soon</span>'}
          <h3>${t.title}</h3>
          <p>${t.desc}</p>
          <span class="cs-go">${t.live ? 'Explore' : 'Preview'} <i class="ph ph-arrow-right"></i></span>
        </a>`).join('');

    const overlay = document.createElement('div');
    overlay.className = 'cs-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Custom Systems');
    overlay.innerHTML = `
      <button class="cs-close" aria-label="Close">&times;</button>
      <div class="cs-overlay-inner">
        <div class="cs-overlay-head">
          <p class="cs-eyebrow">Custom Systems</p>
          <h2>Software, tailored to your operation</h2>
          <p class="cs-sub">Purpose-built tools we design, host, and run for you.</p>
        </div>
        <div class="cs-mosaic">${tilesHTML}</div>
      </div>`;
    document.body.appendChild(overlay);

    const openCS = () => { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const closeCS = () => { overlay.classList.remove('open'); document.body.style.overflow = ''; };

    csTriggers.forEach(t => t.addEventListener('click', (e) => { e.preventDefault(); openCS(); }));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.cs-close')) { e.preventDefault(); closeCS(); }
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeCS(); });

    if (cursor && !isTouchDevice) {
      overlay.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
      });
    }
  }

  // 9. Lazy-load promo video (defer the ~3MB download until it scrolls into view)
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
});
