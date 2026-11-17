(() => {
  'use strict';
  const root = document.documentElement;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const themeButton = $('#themeToggle');
  const nav = $('#primaryNav');
  const menuButton = $('#menuToggle');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Dark/light preference. Failing storage must not break the page.
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('sam-portfolio-theme'); } catch (_) { /* private browsing */ }
  const preferredTheme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
  const applyTheme = (value) => {
    root.dataset.theme = value;
    themeButton?.setAttribute('aria-label', `Switch to ${value === 'dark' ? 'light' : 'dark'} theme`);
    $('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#0b1014' : '#f5f5ef');
    try { localStorage.setItem('sam-portfolio-theme', value); } catch (_) { /* storage optional */ }
  };
  applyTheme(preferredTheme);
  themeButton?.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  // Mobile menu, with Escape / route close.
  const closeMenu = () => {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
    const cvDropdown = $('.cv-dropdown');
    if (cvDropdown) cvDropdown.open = false;
  };
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav?.classList.toggle('open', open);
  });
  $$('.primary-nav a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => { const cvDropdown = $('.cv-dropdown'); if (cvDropdown && !cvDropdown.contains(e.target)) cvDropdown.open = false; });
  window.addEventListener('resize', () => { if (innerWidth > 1020) closeMenu(); }, { passive: true });

  // Scroll progress and active navigation.
  let scrollRequested = false;
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
    const bar = $('#readingProgress');
    if (bar) bar.style.width = `${progress}%`;
    scrollRequested = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollRequested) { requestAnimationFrame(updateScroll); scrollRequested = true; }
  }, { passive: true });
  updateScroll();
  if ('IntersectionObserver' in window) {
    const links = $$('.primary-nav a[href^="#"]');
    const sections = links.map(link => $(link.getAttribute('href'))).filter(Boolean);
    const observer = new IntersectionObserver(entries => {
      const candidate = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!candidate) return;
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${candidate.target.id}`));
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, .2, .45] });
    sections.forEach(section => observer.observe(section));
  }

  // Public project filtering. Links remain ordinary links for full keyboard support.
  const filterButtons = $$('.project-filter');
  const projects = $$('.project-card');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(b => {
      const selected = b === button;
      b.classList.toggle('active', selected);
      b.setAttribute('aria-pressed', String(selected));
    });
    projects.forEach(project => {
      const visible = filter === 'all' || (project.dataset.tags || '').split(' ').includes(filter);
      project.classList.toggle('filtered-out', !visible);
      project.hidden = !visible;
    });
  }));

  const year = $('#currentYear');
  if (year) year.textContent = String(new Date().getFullYear());
  if (reduceMotion) root.classList.add('reduce-motion');
})();
