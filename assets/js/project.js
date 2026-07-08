/* ==========================================================================
   NanoRa Technologies — project.js
   Page-specific interaction logic for individual project case study pages
   (e.g. flowershop.html). Covers only what's unique to this page:
     1. UI Showcase tab filtering (Desktop / Tablet / Mobile)
     2. Gallery lightbox with prev/next navigation and keyboard support
   Everything else — navbar, scroll progress, back-to-top, counters,
   reveal animations, cursor glow, magnetic buttons, particles — is
   already handled by main.js / animation.js / particles.js and is
   reused as-is; nothing here duplicates that logic.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initShowcaseFilter();
  initGalleryLightbox();
});

/* --------------------------------------------------------------------------
   UI Showcase — filters the gallery grid by device type without
   re-fetching or re-rendering anything, just toggling a class.
   -------------------------------------------------------------------------- */
function initShowcaseFilter() {
  const tabs = document.querySelectorAll('.showcase-tab');
  const items = document.querySelectorAll('.gallery-item');
  if (!tabs.length || !items.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;

      tabs.forEach((t) => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });

      items.forEach((item) => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !match);
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Gallery lightbox — opens on click, supports prev/next, keyboard
   (Escape / Arrow keys) and only ever considers the currently visible
   (non-filtered) gallery items when navigating.
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const lightbox = document.getElementById('projectLightbox');
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!lightbox || !items.length) return;

  const imageEl = document.getElementById('lightboxImage');
  const captionEl = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  let currentIndex = 0;

  const visibleItems = () => items.filter((item) => !item.classList.contains('hidden'));

  const renderAt = (index) => {
    const list = visibleItems();
    if (!list.length) return;
    currentIndex = (index + list.length) % list.length;

    const item = list[currentIndex];
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-caption');

    imageEl.src = img.src;
    imageEl.alt = img.alt || '';
    captionEl.textContent = caption ? caption.textContent.trim() : '';
  };

  const open = (item) => {
    const list = visibleItems();
    currentIndex = list.indexOf(item);
    if (currentIndex === -1) currentIndex = 0;
    renderAt(currentIndex);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  items.forEach((item) => {
    item.addEventListener('click', () => open(item));
  });

  closeBtn?.addEventListener('click', close);
  prevBtn?.addEventListener('click', () => renderAt(currentIndex - 1));
  nextBtn?.addEventListener('click', () => renderAt(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') renderAt(currentIndex - 1);
    if (e.key === 'ArrowRight') renderAt(currentIndex + 1);
  });
}