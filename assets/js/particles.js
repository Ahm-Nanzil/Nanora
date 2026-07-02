/* ==========================================================================
   NanoRa Technologies — particles.js
   Lightweight, dependency-free canvas particle network with mouse
   interaction and connection lines. Runs behind the hero/background.
   ========================================================================== */

(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const isMobile = matchMedia('(max-width: 768px)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

  const config = {
    particleColor: 'rgba(182, 194, 207, 0.6)',
    lineColor: 'rgba(79, 70, 229, 0.18)',
    particleCount: isMobile ? 34 : 70,
    maxParticleCount: isMobile ? 55 : 140,
    connectDistance: isMobile ? 100 : 140,
    mouseConnectDistance: 180,
    speed: 0.25
  };

  let width = 0;
  let height = 0;
  let particles = [];
  let mouse = { x: null, y: null, active: false };
  let rafId = null;

  /* ------------------------------------------------------------------
     Setup
     ------------------------------------------------------------------ */
  function resize() {
    width = canvas.clientWidth || canvas.parentElement.offsetWidth;
    height = canvas.clientHeight || canvas.parentElement.offsetHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  function particleCountForViewport() {
      const area = width * height;
      const divisor = isMobile ? 22000 : 14000;
      const scaled = Math.round(area / divisor);
      return Math.max(isMobile ? 18 : 30, Math.min(config.maxParticleCount, scaled || config.particleCount));
    }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * config.speed,
      vy: (Math.random() - 0.5) * config.speed,
      r: Math.random() * 1.6 + 0.6
    };
  }

  function initParticles() {
    const count = particleCountForViewport();
    particles = Array.from({ length: count }, createParticle);
  }

  /* ------------------------------------------------------------------
     Update + draw
     ------------------------------------------------------------------ */
  function update() {
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x <= 0 || p.x >= width) p.vx *= -1;
      if (p.y <= 0 || p.y >= height) p.vy *= -1;

      p.x = Math.max(0, Math.min(width, p.x));
      p.y = Math.max(0, Math.min(height, p.y));

      // Gentle drift toward the mouse when nearby
      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < config.mouseConnectDistance) {
          p.x += dx * 0.0015;
          p.y += dy * 0.0015;
        }
      }
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Connection lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);

        if (dist < config.connectDistance) {
          ctx.beginPath();
          ctx.strokeStyle = config.lineColor;
          ctx.globalAlpha = 1 - dist / config.connectDistance;
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Lines from mouse to nearby particles
    if (mouse.active) {
      particles.forEach((p) => {
        const dist = Math.hypot(mouse.x - p.x, mouse.y - p.y);
        if (dist < config.mouseConnectDistance) {
          ctx.beginPath();
          ctx.strokeStyle = config.lineColor;
          ctx.globalAlpha = 1 - dist / config.mouseConnectDistance;
          ctx.lineWidth = 1;
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      });
    }

    ctx.globalAlpha = 1;

    // Particles
    ctx.fillStyle = config.particleColor;
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function loop() {
    update();
    draw();
    rafId = requestAnimationFrame(loop);
  }

  /* ------------------------------------------------------------------
     Events
     ------------------------------------------------------------------ */
  function bindEvents() {
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        initParticles();
      }, 150);
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(loop);
      }
    });
  }

  /* ------------------------------------------------------------------
     Init
     ------------------------------------------------------------------ */
  function init() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.style.display = 'none';
      return;
    }
    resize();
    initParticles();
    bindEvents();
    rafId = requestAnimationFrame(loop);
  }

  document.addEventListener('DOMContentLoaded', init);
})();