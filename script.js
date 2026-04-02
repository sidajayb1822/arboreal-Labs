document.addEventListener("DOMContentLoaded", () => {
  const isMobile = window.innerWidth <= 768;
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

  // Hamburger Menu Logic
  const hamburger = document.querySelector('.hamburger-btn');
  const navLinks = document.querySelector('.nav-links');
  const dropdownMobile = document.querySelector('.dropdown');

  if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
          hamburger.classList.toggle('active');
          navLinks.classList.toggle('active');
          document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
      });
      
      if (dropdownMobile) {
          dropdownMobile.addEventListener('click', (e) => {
              if (window.innerWidth <= 768 && e.target.tagName.toLowerCase() === 'a' && e.target.nextElementSibling?.classList.contains('dropdown-content')) {
                  e.preventDefault();
                  dropdownMobile.classList.toggle('active');
              }
          });
      }
      
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
    
    document.querySelectorAll('a, button, .magnetic, .dropdown').forEach(el => {
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
});
