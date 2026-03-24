import './style.css'

const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

const supportsIntersectionObserver = 'IntersectionObserver' in window;
const observer = supportsIntersectionObserver
  ? new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  )
  : null;

// Scroll to top button functionality
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  if (!scrollTopBtn) return;

  if (window.scrollY > 300) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  sections.forEach((section) => {
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    if (observer) {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      observer.observe(section);
    } else {
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }
  });

  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  // We'll create the spyObserver later but declare it here so click handlers can pause/resume it.
  let spyObserver = null;

  function getNavbarHeight() {
    if (!navbar) return 0;
    // Use boundingClientRect to account for actual rendered height
    const rect = navbar.getBoundingClientRect();
    // Add a small extra offset so the section heading isn't hidden under the nav
    return Math.ceil(rect.height) + 12; // 12px breathing room
  }

  function pauseSpyFor(duration = 800) {
    if (!spyObserver) return;
    try {
      spyObserver.disconnect();
    } catch (err) {
      // ignore
    }
    // Re-observe after duration
    setTimeout(() => {
      sections.forEach((sec) => spyObserver.observe(sec));
    }, duration);
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return; // external or non-anchor

      const targetId = href.slice(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navbarHeight = getNavbarHeight();
      const targetY = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;

      // Blur the link so it doesn't keep browser focus styles
      try { link.blur(); } catch (err) { /* ignore */ }
      // Clear any active state immediately so it doesn't stay blue
      clearActiveLinks();
      // Pause the spy while the smooth scroll happens so it won't re-add `.active` prematurely
      pauseSpyFor(900);

      // Use smooth scroll and do NOT modify location.hash. This keeps the URL unchanged.
      window.scrollTo({ top: Math.max(0, Math.floor(targetY)), behavior: 'smooth' });
    });
  });

  // Scrollspy: highlight the active nav-link based on section visibility, WITHOUT changing the URL
  function clearActiveLinks() {
    navLinks.forEach((l) => l.classList.remove('active'));
  }

  if (supportsIntersectionObserver) {
    const spyOptions = {
      root: null,
      // We want the section to be considered active when more than ~40% is visible.
      threshold: 0.4,
      // Compensate visually for the fixed navbar so the observer triggers when the content is under the navbar
      rootMargin: `-${getNavbarHeight()}px 0px -40% 0px`
    };

    spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (!link) return;

        if (entry.isIntersecting) {
          clearActiveLinks();
          link.classList.add('active');
        } else {
          if (link.classList.contains('active') && !entry.isIntersecting) {
            link.classList.remove('active');
          }
        }
      });
    }, spyOptions);

    sections.forEach((sec) => spyObserver.observe(sec));
  }


  // Fix progress circles
  const progressCircles = document.querySelectorAll('.progress-circle');
  progressCircles.forEach((circle) => {
    const progress = parseInt(circle.getAttribute('data-progress'));
    const progressRing = circle.querySelector('.progress-ring-circle.progress');
    
    if (progressRing && !isNaN(progress)) {
      // Circle radius is 20, so circumference = 2πr = 2π × 20 ≈ 125.66
      const circumference = 2 * Math.PI * 20;
      const offset = circumference * (1 - progress / 100);
      
      progressRing.style.strokeDasharray = circumference;
      progressRing.style.strokeDashoffset = circumference;
      
      // Animate the progress
      setTimeout(() => {
        progressRing.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        progressRing.style.strokeDashoffset = offset;
      }, 100);
    }
  });
});
