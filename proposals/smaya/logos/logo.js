// Shared playback for the SMAYAA logo options: fits the 720×800 artboard to the frame and gives the
// proposal page replay, pause, loop and speed controls over the CSS animations (window.logo)
(() => {
  const art = document.querySelector('.art');
  const CYCLE = 10000, HOLD_AT = 5000; // every intro element is on screen and still at 5s of the 10s cycle
  let speed = 1, loop = false, paused = false, held = false;

  const fit = () => { art.style.transform = `translate(-50%, -50%) scale(${Math.min(innerWidth / 720, innerHeight / 800)})`; };
  addEventListener('resize', fit); fit();

  const all = () => document.getAnimations();
  // .a elements build the logo in and out; everything else (water, orbits, shine) keeps moving
  const intro = () => all().filter(a => a.effect && a.effect.target && a.effect.target.classList.contains('a'));
  const hold = v => { held = v; for (const a of intro()) v || paused ? a.pause() : a.play(); };

  function watch() {
    // without looping, stop the build on the finished logo instead of letting it fade out
    if (!loop && !held && !paused) {
      const a = intro()[0], ct = a && (a.currentTime % CYCLE);
      if (a && ct >= HOLD_AT && ct < HOLD_AT + 2000) {
        for (const b of intro()) b.currentTime = Math.floor(b.currentTime / CYCLE) * CYCLE + HOLD_AT;
        hold(true);
      }
    }
    requestAnimationFrame(watch);
  }

  window.logo = {
    replay() {
      held = false; paused = false;
      for (const a of all()) { a.currentTime = 0; a.playbackRate = speed; a.play(); }
    },
    pause(v) {
      paused = v;
      for (const a of all()) v || (held && intro().includes(a)) ? a.pause() : a.play();
    },
    setLoop(v) { loop = v; if (v && held) hold(false); },
    setSpeed(v) { speed = v; for (const a of all()) a.playbackRate = v; },
  };

  document.addEventListener('click', () => window.logo.replay());
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(watch);
})();
