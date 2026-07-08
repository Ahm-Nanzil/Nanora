/* ==========================================================================
   NanoRa Technologies — portfolio.js
   Page-specific interaction logic for the Portfolio landing page.
   Covers only what's unique to this page: category filtering of the
   project cards. Navbar, scroll progress, back-to-top, counters, reveal
   animations, cursor glow, magnetic buttons, ripple, and particles are
   already handled by main.js / animation.js / particles.js and are
   reused as-is.

   Future-proof: works for any number of .portfolio-project-card elements
   as long as each one carries a data-category attribute — no changes
   needed here when more projects are added later.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPortfolioFilter();
});

function initPortfolioFilter() {
  const buttons = document.querySelectorAll('.portfolio-filter-btn');
  const cards = document.querySelectorAll('.portfolio-project-card');
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      buttons.forEach((b) => b.classList.toggle('active', b === btn));

      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
}