/* ==========================================================================
   NanoRa Technologies — main.js
   Non-animation interaction logic: navigation, counters, accordion,
   slider, forms, and general page behaviour.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initBackToTop();
  initScrollProgress();
  initUnifiedScrollHandler();
  initCounters();
  initFaqAccordion();
  initTestimonialSlider();
  initRippleButtons();
  initNewsletterForm();
  initServiceModal();
});

/* --------------------------------------------------------------------------
   Sticky / blurred navbar — element is cached here, updated by the
   unified scroll handler below
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.__navbarEl = navbar;
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}

/* --------------------------------------------------------------------------
   Mobile hamburger menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

/* --------------------------------------------------------------------------
   Smooth scroll for in-page anchor links
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight + 1;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* --------------------------------------------------------------------------
   Back-to-top button — visibility handled by the unified scroll handler
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.__backToTopBtn = btn;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   Scroll progress bar — element cached here, updated by the unified
   scroll handler below
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;
  window.__scrollProgressBar = bar;
}

/* --------------------------------------------------------------------------
   Single rAF-throttled scroll listener drives the navbar, back-to-top
   button and progress bar together, instead of three independent scroll
   listeners each forcing their own read/write per event — smoother on
   mobile where scroll events fire densely.
   -------------------------------------------------------------------------- */
function initUnifiedScrollHandler() {
  let ticking = false;

  const update = () => {
    const scrollTop = window.scrollY;
    const navbar = window.__navbarEl;
    const btn = window.__backToTopBtn;
    const bar = window.__scrollProgressBar;

    if (navbar) navbar.classList.toggle('scrolled', scrollTop > 40);
    if (btn) btn.classList.toggle('visible', scrollTop > 500);
    if (bar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${docHeight > 0 ? (scrollTop / docHeight) * 100 : 0}%`;
    }
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

/* --------------------------------------------------------------------------
   Animated counters (triggered once each enters the viewport)
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1600;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
}

/* --------------------------------------------------------------------------
   FAQ accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach((i) => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

/* --------------------------------------------------------------------------
   Testimonial slider (auto-advancing, dot navigation)
   -------------------------------------------------------------------------- */
function initTestimonialSlider() {
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  if (!track || !dotsWrap) return;

  const slides = Array.from(track.children);
  if (!slides.length) return;

  let index = 0;
  let autoplayTimer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
    restartAutoplay();
  }

  function restartAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goTo(index + 1), 6000);
  }

  restartAutoplay();
}

/* --------------------------------------------------------------------------
   Ripple effect on primary buttons (click feedback)
   -------------------------------------------------------------------------- */
function initRippleButtons() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);

      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* --------------------------------------------------------------------------
   Newsletter form (front-end only — replace with real endpoint as needed)
   -------------------------------------------------------------------------- */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button');
    if (!input || !input.value) return;

    const original = button.innerHTML;
    button.innerHTML = '<i class="fa-solid fa-check"></i>';
    input.value = '';

    setTimeout(() => {
      button.innerHTML = original;
    }, 2200);
  });
}

/* --------------------------------------------------------------------------
   Mobile service cards → bottom sheet modal (icon + title on card,
   full description revealed on tap). Desktop cards keep their own
   hover/link behaviour untouched.
   -------------------------------------------------------------------------- */
function initServiceModal() {
  const modal = document.getElementById('serviceModal');
  if (!modal) return;

  const backdrop = document.getElementById('serviceModalBackdrop');
  const iconEl = document.getElementById('serviceModalIcon');
  const titleEl = document.getElementById('serviceModalTitle');
  const descEl = document.getElementById('serviceModalDesc');
  const cta = document.getElementById('serviceModalCta');
  const cards = document.querySelectorAll('.service-card');

  const open = (card) => {
    const icon = card.querySelector('.service-icon i');
    const title = card.querySelector('h3');
    const desc = card.querySelector('p');
    iconEl.innerHTML = icon ? icon.outerHTML : '';
    titleEl.textContent = title ? title.textContent : '';
    descEl.textContent = desc ? desc.textContent : '';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      if (!matchMedia('(max-width: 768px)').matches) return;
      open(card);
    });
  });

  backdrop?.addEventListener('click', close);
  cta?.addEventListener('click', close);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}