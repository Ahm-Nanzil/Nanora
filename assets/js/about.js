/* ==========================================================================
   NanoRa Technologies — about.js
   Page-specific interaction logic for the About page (about.html).
   Covers only what's unique to this page: the scroll-driven progress
   line and active-step highlighting for the vertical "Our Development
   Process" flow. Everything else — navbar, scroll progress, back-to-top,
   reveal animations, cursor glow, tech/industry hover states — is
   already handled by main.js / animation.js and is reused as-is.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProcessProgress();
});

/* --------------------------------------------------------------------------
   Development process — fills the connecting line as the section scrolls
   into view, and marks each step "active" once it has been reached.
   Uses rAF-throttled scroll math (no IntersectionObserver) because the
   fill height needs to track scroll position continuously, not just
   toggle on/off at a threshold.
   -------------------------------------------------------------------------- */
function initProcessProgress() {
  const flow = document.getElementById('processFlow');
  const fill = document.getElementById('processProgressFill');
  const steps = document.querySelectorAll('.process-step');
  if (!flow || !fill || !steps.length) return;

  let ticking = false;

  const update = () => {
    const rect = flow.getBoundingClientRect();
    const viewportH = window.innerHeight;

    // Progress: 0 when the flow's top reaches the vertical center of the
    // viewport, 1 when its bottom reaches the same point.
    const start = viewportH * 0.55;
    const total = rect.height + start;
    const traveled = start - rect.top;
    const progress = Math.min(1, Math.max(0, traveled / total));

    fill.style.height = `${progress * 100}%`;

    steps.forEach((step) => {
      const stepRect = step.getBoundingClientRect();
      const reached = stepRect.top < viewportH * 0.6;
      step.classList.toggle('active', reached);
    });

    ticking = false;
  };

  update();
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', update);
}