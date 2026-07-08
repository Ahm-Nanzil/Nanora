/* ==========================================================================
   NanoRa Technologies — service.js
   Page-specific interaction logic for service detail pages.
   Everything else (navbar, scroll progress, back-to-top, FAQ accordion,
   reveal animations, newsletter form, cursor glow, magnetic buttons) is
   already handled by main.js and animation.js, which are safely re-used
   here — every init function in those files guards on element existence,
   so nothing breaks on a page that doesn't have every homepage section.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCaseStudyToggle();
});

/* --------------------------------------------------------------------------
   Case study "View Details" toggle — only visible/active on mobile
   (≤768px, see service.css). On desktop the button is hidden and all
   details are shown by default, so this simply no-ops there.
   -------------------------------------------------------------------------- */
function initCaseStudyToggle() {
  const cards = document.querySelectorAll('.case-study-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    const toggle = card.querySelector('.case-study-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const expanded = card.classList.toggle('expanded');
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.querySelector('span').textContent = expanded ? 'Hide Details' : 'View Details';
    });
  });
}