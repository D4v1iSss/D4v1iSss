(() => {
  document.documentElement.classList.add('js-enabled');

  const menuButton = document.getElementById('menu-btn');
  const navLinks = document.getElementById('nav-links');
  const musicToggleButton = document.getElementById('music-toggle-button');
  const musicPanel = document.getElementById('music-panel');
  const player = document.getElementById('spotify-player');
  const playerStatus = document.getElementById('player-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  menuButton?.addEventListener('click', () => {
    const open = navLinks?.getAttribute('data-open') === 'true';
    navLinks?.setAttribute('data-open', String(!open));
    menuButton.setAttribute('aria-expanded', String(!open));
  });

  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks?.setAttribute('data-open', 'false');
      menuButton?.setAttribute('aria-expanded', 'false');
    });
  });

  const sections = Array.from(document.querySelectorAll('section[id]'));
  const indicatorLinks = Array.from(document.querySelectorAll('.section-indicator a'));

  const activateSection = (id) => {
    indicatorLinks.forEach((link) => {
      link.setAttribute('aria-current', String(link.getAttribute('href') === `#${id}`));
    });
  };

  if (sections.length > 0 && indicatorLinks.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateSection(entry.target.id);
        }
      });
    }, { threshold: 0.5 });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  if (!reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    const updateScrollState = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      doc.style.setProperty('--progress', `${ratio * 100}%`);
      doc.style.setProperty('--scroll-ratio', ratio.toFixed(3));
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
  } else {
    document.documentElement.style.setProperty('--progress', '0%');
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  musicToggleButton?.addEventListener('click', () => {
    const isOpen = musicPanel?.getAttribute('data-open') === 'true';
    musicPanel?.setAttribute('data-open', String(!isOpen));
    musicToggleButton.setAttribute('aria-expanded', String(!isOpen));
  });

  let statusSettled = false;

  player?.addEventListener('load', () => {
    statusSettled = true;
    if (playerStatus) {
      playerStatus.textContent = 'Player ready. Press play in the Spotify embed to start music.';
    }
  });

  window.setTimeout(() => {
    if (!statusSettled && playerStatus) {
      playerStatus.textContent = 'Player may be blocked or still loading. Use the “Open on Spotify” link below if needed.';
    }
  }, 8000);

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
