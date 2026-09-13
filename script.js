(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const themeToggle = document.getElementById('themeToggle');
  const menuButton = document.getElementById('menuButton');
  const mobileNav = document.getElementById('mobileNav');
  const currentYear = document.getElementById('currentYear');
  const copyEmailButton = document.getElementById('copyEmail');
  const toast = document.getElementById('toast');
  const resumeLinks = document.getElementById('resumeLinks');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme ---------------------------------------------------------------
  const getPreferredTheme = () => {
    const stored = localStorage.getItem('sam-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    localStorage.setItem('sam-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#080b14' : '#f7f8fc'
    );
  };

  applyTheme(getPreferredTheme());

  themeToggle?.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  // Header + mobile navigation -----------------------------------------
  const syncHeader = () => {
    header?.classList.toggle('scrolled', window.scrollY > 12);
  };

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  const closeMobileMenu = () => {
    if (!mobileNav || !menuButton) return;
    mobileNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  };

  menuButton?.addEventListener('click', () => {
    const nextState = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(nextState));
    mobileNav?.classList.toggle('open', nextState);
  });

  mobileNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1020) closeMobileMenu();
  });

  // Reveal-on-scroll ----------------------------------------------------
  const revealElements = [...document.querySelectorAll('.reveal')];
  revealElements.forEach((el) => {
    const delay = Number(el.dataset.delay || 0);
    el.style.setProperty('--reveal-delay', `${delay}ms`);
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // Active navigation ---------------------------------------------------
  const navLinks = [...document.querySelectorAll('.desktop-nav a, .mobile-nav a')];
  const navSections = [...document.querySelectorAll('main section[id]')]
    .filter((section) => navLinks.some((link) => link.getAttribute('href') === `#${section.id}`));

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
      });
    }, {
      rootMargin: '-24% 0px -60% 0px',
      threshold: [0.01, 0.2, 0.5]
    });

    navSections.forEach((section) => navObserver.observe(section));
  }

  // Animated metrics ----------------------------------------------------
  const counters = [...document.querySelectorAll('[data-counter]')];

  const renderCounter = (el, value) => {
    const decimals = Number(el.dataset.decimals || 0);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';

    let formatted;
    if (value >= 10000) {
      formatted = `${Math.round(value / 1000)}K`;
    } else if (value >= 1000) {
      formatted = `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
    } else {
      formatted = Number(value).toFixed(decimals);
    }

    el.textContent = `${prefix}${formatted}${suffix}`;
  };

  const animateCounter = (el) => {
    const target = Number(el.dataset.counter);
    if (!Number.isFinite(target)) return;

    if (reduceMotion) {
      renderCounter(el, target);
      return;
    }

    const start = performance.now();
    const duration = 900;

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      renderCounter(el, target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.65 });

    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  // Impact disclosure ---------------------------------------------------
  document.querySelectorAll('.disclosure-button').forEach((button) => {
    const panel = button.nextElementSibling;
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });

  // Project filtering ---------------------------------------------------
  const filterButtons = [...document.querySelectorAll('.filter-button')];
  const projectCards = [...document.querySelectorAll('.project-card')];

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';
      filterButtons.forEach((item) => item.classList.toggle('active', item === button));

      projectCards.forEach((card) => {
        const tags = (card.dataset.tags || '').split(/\s+/).filter(Boolean);
        const shouldShow = filter === 'all' || tags.includes(filter);
        card.classList.toggle('filtered-out', !shouldShow);
      });
    });
  });

  // Resume links: only expose links when the files actually exist -------
  const hydrateResumeLinks = async () => {
    if (!resumeLinks) return;
    const links = [...resumeLinks.querySelectorAll('[data-resume-link]')];
    if (!links.length) return;

    const statuses = await Promise.all(links.map(async (link) => {
      try {
        const response = await fetch(link.getAttribute('href'), { method: 'HEAD', cache: 'no-store' });
        if (!response.ok) {
          link.hidden = true;
          return false;
        }
        return true;
      } catch {
        link.hidden = true;
        return false;
      }
    }));

    resumeLinks.hidden = !statuses.some(Boolean);
  };

  hydrateResumeLinks();

  // Contact helpers -----------------------------------------------------
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };

  copyEmailButton?.addEventListener('click', async () => {
    const email = copyEmailButton.dataset.email;
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      showToast('Email copied');
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = email;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      showToast('Email copied');
    }
  });

  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
})();
