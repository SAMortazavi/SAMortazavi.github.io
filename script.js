(() => {
  'use strict';
  const doc = document.documentElement;
  doc.classList.add('js');
  const themeButton = document.getElementById('themeToggle');
  const menuButton = document.getElementById('menuToggle');
  const nav = document.getElementById('primaryNav');
  const progress = document.getElementById('readingProgress');
  const year = document.getElementById('currentYear');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme: dark by default; remember each visitor's explicit choice.
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('sam-theme'); } catch (_) { /* private browsing */ }
  const preferred = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
  function setTheme(next) {
    doc.setAttribute('data-theme', next);
    themeButton?.setAttribute('aria-label', `Switch to ${next === 'dark' ? 'light' : 'dark'} theme`);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#0b1118' : '#f4f6f3');
    try { localStorage.setItem('sam-theme', next); } catch (_) { /* optional storage */ }
  }
  setTheme(preferred);
  themeButton?.addEventListener('click', () => setTheme(doc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

  // Mobile navigation.
  function closeMenu() {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open menu');
  }
  menuButton?.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    nav?.classList.toggle('open', opening);
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 1020) closeMenu(); }, { passive: true });
  document.addEventListener('click', e => {
    if (nav?.classList.contains('open') && !nav.contains(e.target) && !menuButton?.contains(e.target)) closeMenu();
  });

  // Scroll: progress indicator is passive and not a requirement for navigation.
  let scrollQueued = false;
  function onScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(() => {
      if (progress) {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        progress.style.width = `${Math.max(0, Math.min(100, 100 * window.scrollY / maxScroll))}%`;
      }
      scrollQueued = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reduced-motion-aware entrance reveals.
  const revealed = [...document.querySelectorAll('.reveal')];
  revealed.forEach(el => el.style.setProperty('--reveal-delay', `${Number(el.dataset.delay || 0)}ms`));
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealed.forEach(el => el.classList.add('in-view'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: '0px 0px -28px 0px' });
    revealed.forEach(el => revealObserver.observe(el));
  }

  // Active section in both navigation layouts.
  const navAnchors = [...document.querySelectorAll('.nav a')];
  if ('IntersectionObserver' in window && navAnchors.length) {
    const sections = navAnchors.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const navigationObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: '-18% 0px -66% 0px', threshold: [0, .15, .45] });
    sections.forEach(section => navigationObserver.observe(section));
  }

  // Public project filters: update accessible pressed state.
  const filters = [...document.querySelectorAll('.filter-btn')];
  const projects = [...document.querySelectorAll('.project-card')];
  filters.forEach(button => button.addEventListener('click', () => {
    const tag = button.dataset.filter || 'all';
    filters.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    projects.forEach(card => {
      const visible = tag === 'all' || (card.dataset.tags || '').split(/\s+/).includes(tag);
      card.classList.toggle('filtered-out', !visible);
      card.hidden = !visible;
    });
  }));

  if (year) year.textContent = String(new Date().getFullYear());
})();
