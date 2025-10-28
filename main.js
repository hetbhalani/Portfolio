import './style.css'

const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

const observer = new IntersectionObserver(
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
);

// Scroll to top button functionality
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  sections.forEach((section) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

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
