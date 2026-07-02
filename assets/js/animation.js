/* ==========================================================================
   NanoRa Technologies — animation.js
   Visual / motion behaviour: scroll reveals, hero effects, cursor glow,
   parallax, progress bars, and the hero typing animation.
   All DOM writes use transform/opacity and are batched with rAF where
   the effect runs continuously (cursor, parallax) to stay at 60fps.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initProgressBars();
  initTypingAnimation();
  initCursorGlow();
  initMouseParallax();
  initMagneticButtons();
});

/* --------------------------------------------------------------------------
   Scroll reveal — fades/translates [data-reveal] elements into place
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  items.forEach((el) => {
    const delay = el.dataset.delay;
    if (delay) el.style.setProperty('--delay', `${delay}ms`);
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Animated progress bars (About section)
   -------------------------------------------------------------------------- */
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const width = el.dataset.width || 0;
        requestAnimationFrame(() => {
          el.style.width = `${width}%`;
        });
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach((bar) => observer.observe(bar));
}

/* --------------------------------------------------------------------------
   Hero code-block typing animation
   -------------------------------------------------------------------------- */
function initTypingAnimation() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const lines = [
    'const app = NanoRa.deploy();',
    'status: build passing ✓',
    'scaling to 12 regions...',
    'AI pipeline: online'
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    const current = lines[lineIndex];

    if (!deleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 1600);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
      }
    }

    setTimeout(type, deleting ? 30 : 55);
  };

  type();
}

/* --------------------------------------------------------------------------
   Cursor glow — follows the pointer, smoothed with lerp inside rAF
   -------------------------------------------------------------------------- */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || matchMedia('(pointer: coarse)').matches) {
    if (glow) glow.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  const loop = () => {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}

/* --------------------------------------------------------------------------
   Mouse parallax — subtle background blob drift + hero floating cards
   -------------------------------------------------------------------------- */
function initMouseParallax() {
  const blobs = document.querySelectorAll('.blob');
  const cards = document.querySelectorAll('.floating-card');
  if (!blobs.length && !cards.length) return;
  if (matchMedia('(pointer: coarse)').matches) return;

  let targetX = 0;
  let targetY = 0;
  let curX = 0;
  let curY = 0;

  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const loop = () => {
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;

    blobs.forEach((blob, i) => {
      const strength = 14 + i * 6;
      blob.style.transform = `translate(${curX * strength}px, ${curY * strength}px)`;
    });

    cards.forEach((card, i) => {
      const strength = 8 + i * 3;
      card.style.setProperty('--parallax-x', `${curX * strength}px`);
      card.style.setProperty('--parallax-y', `${curY * strength}px`);
    });

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}

/* --------------------------------------------------------------------------
   Magnetic buttons — pulls .btn-magnetic toward the cursor on hover
   -------------------------------------------------------------------------- */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-magnetic');
  if (!buttons.length || matchMedia('(pointer: coarse)').matches) return;

  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}