const header = document.querySelector('.site-header');
const nav = document.getElementById('site-nav');
const navToggle = document.querySelector('.nav-toggle');
const yearEl = document.getElementById('year');
const toastEl = document.getElementById('toast');
const themeToggle = document.querySelector('.theme-toggle');

// Theme Management System
const themeManager = {
  currentTheme: 'light',
  
  init() {
    this.loadTheme();
    this.setupToggle();
    this.setupSystemPreference();
  },
  
  loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  },
  
  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update toggle button state
    const isActive = theme === 'light';
    themeToggle.classList.toggle('active', isActive);
    
    // Add switching animation
    themeToggle.classList.add('switching');
    setTimeout(() => {
      themeToggle.classList.remove('switching');
    }, 600);
    
    // Update meta theme-color
    this.updateMetaThemeColor(theme);
    
    // Show toast notification
    this.showToast(theme === 'light' ? '☀️ Light mode activated' : '🌙 Dark mode activated');
  },
  
  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  },
  
  setupToggle() {
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleTheme();
    });
    
    // Add keyboard support
    themeToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  },
  
  setupSystemPreference() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'light' : 'dark');
      }
    });
  },
  
  updateMetaThemeColor(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = theme === 'light' ? '#ffffff' : '#030812';
    }
  },
  
  showToast(message) {
    if (toastEl) {
      toastEl.textContent = message;
      toastEl.classList.add('show');
      
      setTimeout(() => {
        toastEl.classList.remove('show');
      }, 3000);
    }
  }
};

// Enhanced animation and interaction system
const animationSystem = {
  observer: null,
  
  init() {
    this.setupScrollAnimations();
    this.setupParallaxEffects();
    this.setupHoverEffects();
    this.setupSmoothScroll();
  },
  
  setupScrollAnimations() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
              this.observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '0px 0px -50px 0px',
          threshold: 0.1
        }
      );
      
      // Observe elements for animation
      document.querySelectorAll('.card, .section-head, .hero-copy, .hero-card').forEach(el => {
        el.classList.add('animate-ready');
        this.observer.observe(el);
      });
    }
  },
  
  setupParallaxEffects() {
    let ticking = false;
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.hero-profile, .hero-card');
      
      parallaxElements.forEach((el, index) => {
        const speed = index === 0 ? 0.5 : 0.3;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
      
      ticking = false;
    };
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', requestTick);
  },
  
  setupHoverEffects() {
    // Enhanced button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        e.target.style.setProperty('--mouse-x', `${x}px`);
        e.target.style.setProperty('--mouse-y', `${y}px`);
      });
    });
    
    // Card hover effects
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', (e) => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  },
  
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
};

function setToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('is-visible');
  window.clearTimeout(setToast._t);
  setToast._t = window.setTimeout(() => toastEl.classList.remove('is-visible'), 2400);
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function setHeaderVisibility() {
  const y = window.scrollY || 0;
  if (!header) return;
  if (y > 50) header.classList.add('is-scrolled');
  else header.classList.remove('is-scrolled');
}

// Store scroll position when menu opens
let scrollPosition = 0;

function closeMobileNav() {
  if (!nav || !navToggle) return;
  nav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  // Restore body scrolling
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, scrollPosition);
}

function openMobileNav() {
  if (!nav || !navToggle) return;
  nav.classList.add('is-open');
  navToggle.setAttribute('aria-expanded', 'true');
  // Prevent body scrolling when menu is open
  scrollPosition = window.scrollY;
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = '100%';
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('is-open');
    if (isOpen) closeMobileNav();
    else openMobileNav();
  });

  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a && a.getAttribute('href')?.startsWith('#')) closeMobileNav();
  });

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (!nav.classList.contains('is-open')) return;
    if (target.closest('#site-nav') || target.closest('.nav-toggle')) return;
    closeMobileNav();
  });
}

const sections = Array.from(document.querySelectorAll('main section[id]'));
const navLinks = Array.from(document.querySelectorAll('.site-nav .nav-link'));

function setActiveLink(id) {
  console.log('Setting active link for:', id); // Debug log
  navLinks.forEach((a) => {
    const active = a.getAttribute('href') === `#${id}`;
    a.classList.toggle('is-active', active);
    if (active) console.log('Active link:', a.getAttribute('href')); // Debug log
  });
}

if (sections.length > 0 && 'IntersectionObserver' in window) {
  const obs = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));

      if (visible[0]?.target?.id) setActiveLink(visible[0].target.id);
    },
    {
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0.1, 0.3, 0.5, 0.7],
    }
  );

  sections.forEach((s) => obs.observe(s));
} else {
  // Fallback for browsers without IntersectionObserver
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    let current = '';
    
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 100 && scrollY < sectionTop + sectionHeight - 100) {
        current = section.getAttribute('id');
      }
    });
    
    if (current) setActiveLink(current);
  });
}

const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const workItems = Array.from(document.querySelectorAll('.work'));

function applyFilter(filter) {
  workItems.forEach((item) => {
    const category = item.getAttribute('data-category');
    const show = filter === 'all' || category === filter;
    item.classList.toggle('is-hidden', !show);
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => {
      b.classList.remove('is-active');
      b.setAttribute('aria-selected', 'false');
    });

    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');
    applyFilter(btn.getAttribute('data-filter') || 'all');
  });
});

const projectScroller = document.querySelector('.project-scroller');
const scrollBtns = Array.from(document.querySelectorAll('[data-scroll]'));

function scrollProjects(dir) {
  if (!projectScroller) return;
  const amt = Math.round(projectScroller.clientWidth * 0.75);
  const left = dir === 'left' ? -amt : amt;
  projectScroller.scrollBy({ left, behavior: 'smooth' });
}

scrollBtns.forEach((btn) => {
  btn.addEventListener('click', () => scrollProjects(btn.getAttribute('data-scroll')));
});

const testimonials = Array.from(document.querySelectorAll('.testimonial.standard'));
const dots = Array.from(document.querySelectorAll('.dot-btn'));
let tIndex = 0;

function setTestimonial(i) {
  if (testimonials.length === 0) return;
  tIndex = ((i % testimonials.length) + testimonials.length) % testimonials.length;
  
  testimonials.forEach((t, idx) => {
    const active = idx === tIndex;
    t.classList.toggle('is-active', active);
    
    // Smooth scroll to the active testimonial
    if (active) {
      const carousel = t.closest('.carousel-track');
      if (carousel) {
        carousel.scrollTo({
          left: t.offsetLeft - carousel.offsetLeft,
          behavior: 'smooth'
        });
      }
    }
  });
  
  dots.forEach((d, idx) => {
    const active = idx === tIndex;
    d.classList.toggle('is-active', active);
    d.setAttribute('aria-selected', active);
  });
}

document.querySelectorAll('[data-testimonial]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const dir = btn.getAttribute('data-testimonial');
    setTestimonial(dir === 'prev' ? tIndex - 1 : tIndex + 1);
  });
});

dots.forEach((d) => {
  d.addEventListener('click', () => {
    const idx = Number(d.getAttribute('data-dot'));
    if (!Number.isNaN(idx)) setTestimonial(idx);
  });
});

setTestimonial(0);

// Simple email function
function sendEmail() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();
  const formNote = document.getElementById('form-note');

  // Validation
  if (!name || !email || !subject || !message) {
    setFormNote('Please fill in all fields.', true);
    setToast('Please complete the form.');
    return;
  }

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!validEmail) {
    setFormNote('Please enter a valid email address.', true);
    setToast('Invalid email.');
    return;
  }

  if (message.length < 10) {
    setFormNote('Message must be at least 10 characters.', true);
    setToast('Message too short.');
    return;
  }

  // Create email content
  const emailSubject = encodeURIComponent(`Portfolio Contact: ${subject}`);
  const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSent from portfolio website`);
  
  // Open email client
  window.location.href = `mailto:harishahi592@gmail.com?subject=${emailSubject}&body=${emailBody}`;
  
  // Show success message
  setFormNote('Opening your email client...', false);
  setToast('Opening email client...');
  
  // Clear form after a delay
  setTimeout(() => {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('message').value = '';
    setFormNote('Message sent! I\'ll get back to you soon.', false);
  }, 2000);
}

const form = document.getElementById('contact-form');
const formNote = document.getElementById('form-note');

function setFormNote(msg, isError) {
  const formNote = document.getElementById('form-note');
  if (!formNote) return;
  formNote.textContent = msg;
  formNote.style.color = isError ? 'rgba(251,113,133,.95)' : '';
}

if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Mouse Scroll Indicator
function setupMouseScrollIndicator() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (!scrollIndicator) return;
  
  scrollIndicator.addEventListener('click', () => {
    const nextSection = document.querySelector('#about');
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
  
  // Hide scroll indicator after scrolling
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 100;
    
    if (scrolled) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.pointerEvents = 'none';
    } else {
      scrollIndicator.style.opacity = '1';
      scrollIndicator.style.pointerEvents = 'auto';
    }
    
    // Clear existing timeout
    clearTimeout(scrollTimeout);
    
    // Hide after scrolling stops
    scrollTimeout = setTimeout(() => {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      }
    }, 150);
  });
}

// Initialize mouse scroll indicator
setupMouseScrollIndicator();

setHeaderVisibility();
window.addEventListener('scroll', () => {
  setHeaderVisibility();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileNav();
});

// Modal system
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const modalMeta = document.getElementById('modal-meta');
const modalCategory = document.getElementById('modal-category');
const modalDescription = document.getElementById('modal-description');
const modalChallenge = document.getElementById('modal-challenge');
const modalSolution = document.getElementById('modal-solution');
const modalResults = document.getElementById('modal-results');
const modalStack = document.getElementById('modal-stack');
const modalImage = document.getElementById('modal-image');

const projectData = {
  'teal-dashboard': {
    title: 'Teal Dashboard UI',
    category: 'Design',
    meta: 'Product design • UI • 2024',
    description: 'A data-heavy dashboard redesigned for clarity and ease of use, using a modular card-based layout and teal accents to guide attention.',
    challenge: 'The client needed a data-heavy dashboard that felt lightweight and approachable, avoiding the typical dense, overwhelming analytics interface.',
    solution: 'I designed a modular card-based layout with generous whitespace, clear visual hierarchy, and teal accent colors to guide attention. Interactive charts were simplified to key metrics, with expandable details for power users.',
    results: [
      'User task completion time reduced by 32%',
      'Support tickets decreased by 22%',
      'Stakeholder adoption increased within 2 weeks',
      'Positive feedback on clarity and ease of use'
    ],
    stack: ['Figma', 'Principle', 'HTML', 'CSS', 'JavaScript', 'Chart.js']
  },
  'minimal-portfolio': {
    title: 'Minimal Portfolio Site',
    category: 'Web',
    meta: 'Frontend • Performance • 2024',
    description: 'A lightning-fast, minimalist portfolio site optimized for performance and accessibility, with Lighthouse scores consistently above 95.',
    challenge: 'A creative professional wanted a portfolio that loaded instantly, worked on all devices, and stayed out of the way of their work.',
    solution: 'Built a static site with a single-page layout, optimized images, and minimal JavaScript. Used semantic HTML and CSS Grid for responsiveness. Lighthouse scores consistently 95+.',
    results: [
      'Page load under 1.2s on 3G',
      'Lighthouse performance score 98',
      'Zero layout shifts (CLS 0)',
      'Client reported increased inquiry rate'
    ],
    stack: ['HTML', 'CSS', 'Vanilla JS', 'WebP', 'Netlify']
  },
  'coral-brand-kit': {
    title: 'Coral Brand Kit',
    category: 'Branding',
    meta: 'Branding • Identity • 2023',
    description: 'A complete brand identity system centered around coral, including logo variations, typography, color system, and component library.',
    challenge: 'A startup needed a cohesive visual identity that felt modern yet warm, with coral as the signature color.',
    solution: 'Developed a full brand system: logo variations, typography palette, color system, illustration style, and component library. Provided guidelines and templates for consistent application.',
    results: [
      'Brand recognition improved in user surveys',
      'Consistent visual language across all touchpoints',
      'Easy onboarding for new designers',
      'Positive feedback from stakeholders'
    ],
    stack: ['Illustrator', 'Figma', 'After Effects', 'Style Guide']
  },
  'mobile-app-screens': {
    title: 'Mobile App Screens',
    category: 'Design',
    meta: 'UX • UI • 2023',
    description: 'Clean, motivating mobile app onboarding and core flows designed to reduce first-use drop-off and improve retention.',
    challenge: 'A fitness app needed onboarding and core flows that felt motivating and simple, reducing drop-off during first use.',
    solution: 'Designed clean, illustration-accompanied screens with step-by-step onboarding, clear CTAs, and subtle micro-interactions. Conducted two rounds of usability testing to refine flows.',
    results: [
      'Onboarding completion increased by 28%',
      'Day-1 retention improved by 15%',
      'Reduced support questions about getting started',
      'App store ratings improved'
    ],
    stack: ['Figma', 'Principle', 'User Testing', 'Prototyping']
  },
  'landing-page-system': {
    title: 'Landing Page System',
    category: 'Web',
    meta: 'Web • Design system • 2023',
    description: 'A component-based landing page system enabling the marketing team to launch dozens of pages quickly while maintaining brand consistency and performance.',
    challenge: 'A marketing team needed to launch dozens of landing pages quickly while maintaining brand consistency and performance.',
    solution: 'Built a component-based system with reusable sections (hero, features, testimonials, CTAs). Integrated with a CMS for non-technical users. Optimized for SEO and speed.',
    results: [
      'Page creation time reduced from days to hours',
      'SEO scores consistently above 90',
      'Conversion rates improved across variants',
      'Design consistency maintained'
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'React', 'Contentful', 'Vercel']
  },
  'logo-refresh': {
    title: 'Logo Refresh',
    category: 'Branding',
    meta: 'Brand • Visual • 2022',
    description: 'A modern logo evolution that retained brand recognition while improving scalability and perception across digital and print.',
    challenge: 'An established company wanted to modernize their logo without losing brand recognition or alienating existing customers.',
    solution: 'Conducted brand audit and stakeholder interviews. Evolved the logo with cleaner geometry, updated typography, and a flexible lockup system. Provided usage guidelines and transition assets.',
    results: [
      'Positive feedback from 85% of surveyed customers',
      'Improved scalability across digital and print',
      'Clearer brand perception in focus groups',
      'Smooth internal adoption'
    ],
    stack: ['Illustrator', 'Brand Audit', 'Guidelines']
  }
};

function openModal(projectKey) {
  const data = projectData[projectKey];
  if (!data) return;

  modalTitle.textContent = data.title;
  modalCategory.textContent = data.category;
  modalMeta.textContent = data.meta;
  modalDescription.textContent = data.description;
  modalChallenge.textContent = data.challenge;
  modalSolution.textContent = data.solution;
  modalResults.innerHTML = data.results.map(r => `<li>${r}</li>`).join('');
  modalStack.innerHTML = data.stack.map(s => `<span class="chip">${s}</span>`).join('');

  // Set unique image background per project (optional)
  modalImage.className = 'modal-image';
  if (projectKey === 'teal-dashboard') modalImage.style.background = 'radial-gradient(600px 220px at 20% 10%, rgba(20,184,166,.45), transparent 60%), linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))';
  else if (projectKey === 'minimal-portfolio') modalImage.style.background = 'radial-gradient(600px 220px at 80% 20%, rgba(251,113,133,.35), transparent 60%), linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))';
  else if (projectKey === 'coral-brand-kit') modalImage.style.background = 'radial-gradient(600px 220px at 25% 15%, rgba(251,113,133,.35), transparent 60%), radial-gradient(600px 220px at 80% 30%, rgba(20,184,166,.32), transparent 60%), linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))';
  else if (projectKey === 'mobile-app-screens') modalImage.style.background = 'radial-gradient(600px 220px at 35% 10%, rgba(20,184,166,.42), transparent 60%), linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))';
  else if (projectKey === 'landing-page-system') modalImage.style.background = 'radial-gradient(600px 220px at 75% 25%, rgba(20,184,166,.32), transparent 60%), radial-gradient(600px 220px at 25% 15%, rgba(251,113,133,.28), transparent 60%), linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))';
  else if (projectKey === 'logo-refresh') modalImage.style.background = 'radial-gradient(600px 220px at 50% 15%, rgba(251,113,133,.38), transparent 60%), linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))';

  modalOverlay.setAttribute('aria-hidden', 'false');
  modalOverlay.classList.add('is-visible');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.setAttribute('aria-hidden', 'true');
  modalOverlay.classList.remove('is-visible');
  document.body.style.overflow = '';
}

// Triggers
document.querySelectorAll('.modal-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const projectKey = btn.getAttribute('data-project');
    openModal(projectKey);
  });
});

modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('is-visible')) closeModal();
  if (e.key === 'Escape' && legalModalOverlay.classList.contains('is-visible')) closeLegalModal();
});

// Legal modal system
const legalModalOverlay = document.getElementById('legal-modal-overlay');
const legalModalClose = document.getElementById('legal-modal-close');
const legalModalTitle = document.getElementById('legal-modal-title');
const legalContent = document.getElementById('legal-content');

const legalData = {
  privacy: {
    title: 'Privacy Policy',
    content: `
      <h3>Introduction</h3>
      <p>This Privacy Policy describes how Your Name ("I", "me", or "my") collects, uses, and protects your information when you visit my website harishahi22.github.io/wind (the "Site"). By using the Site, you agree to the collection and use of information in accordance with this policy.</p>

      <h3>Information I Collect</h3>
      <p>I may collect the following types of information:</p>
      <ul>
        <li>Contact information you provide via the contact form (name, email address, subject, message).</li>
        <li>Usage data automatically collected by my web server (IP address, browser type, access times, pages visited).</li>
        <li>Cookies and similar tracking technologies for basic site functionality and analytics.</li>
      </ul>

      <h3>How I Use Your Information</h3>
      <p>I use your information to:</p>
      <ul>
        <li>Respond to your inquiries and provide requested services.</li>
        <li>Improve the Site and user experience.</li>
        <li>Analyze site traffic and usage patterns.</li>
        <li>Comply with legal obligations.</li>
      </ul>

      <h3>Data Sharing and Third Parties</h3>
      <p>I do not sell, trade, or otherwise transfer your personal information to third parties, except:</p>
      <ul>
        <li>To trusted service providers who assist in operating my Site (e.g., hosting, email delivery).</li>
        <li>When required by law or to protect my rights, property, or safety.</li>
      </ul>

      <h3>Data Security</h3>
      <p>I implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure.</p>

      <h3>Your Rights</h3>
      <p>You have the right to:</p>
      <ul>
        <li>Access, update, or delete your personal information.</li>
        <li>Opt-out of communications from me.</li>
        <li>Request a copy of the information I hold about you.</li>
      </ul>

      <h3>Changes to This Policy</h3>
      <p>I may update this Privacy Policy from time to time. I will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>

      <h3>Contact Information</h3>
      <p>If you have any questions about this Privacy Policy or my data practices, please contact me at: <strong>harishahi592@gmail.com</strong></p>

      <p><em>Last updated: January 28, 2026</em></p>
    `
  },
  terms: {
    title: 'Terms of Service',
    content: `
      <h3>Agreement to Terms</h3>
      <p>By accessing and using my website harishahi22.github.io/wind (the "Site"), you accept and agree to be bound by the terms and provision of this agreement.</p>

      <h3>Use License</h3>
      <p>Permission is granted to temporarily download one copy of the materials on my Site for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
      <ul>
        <li>modify or copy the materials;</li>
        <li>use the materials for any commercial purpose or for any public display;</li>
        <li>attempt to reverse engineer any software contained on my Site;</li>
        <li>remove any copyright or other proprietary notations from the materials.</li>
      </ul>

      <h3>Disclaimer</h3>
      <p>The materials on my Site are provided on an 'as is' basis. I make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

      <h3>Limitations</h3>
      <p>In no event shall I or my suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on my Site.</p>

      <h3>Accuracy of Materials</h3>
      <p>The materials appearing on my Site could include technical, typographical, or photographic errors. I do not warrant that any of the materials on its Site are accurate, complete, or current. I may make changes to the materials at any time without notice.</p>

      <h3>Links</h3>
      <p>I have not reviewed all of the sites linked to my Site and am not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by me of the site.</p>

      <h3>Intellectual Property</h3>
      <p>All content on this Site, including but not limited to text, graphics, logos, images, and software, is the property of Your Name and protected by international copyright laws.</p>

      <h3>User Responsibilities</h3>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Site for any unlawful purpose or to solicit others to perform or participate in any unlawful acts;</li>
        <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity;</li>
        <li>Upload or transmit viruses or any other type of malicious code;</li>
        <li>Interfere with or disrupt the Site or servers or networks connected to the Site.</li>
      </ul>

      <h3>Termination</h3>
      <p>I may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

      <h3>Governing Law</h3>
      <p>These terms and conditions are governed by and construed in accordance with the laws of Your Jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>

      <h3>Contact Information</h3>
      <p>Questions about the Terms of Service should be sent to me at: <strong>harishahi592@gmail.com</strong></p>

      <p><em>Last updated: January 28, 2026</em></p>
    `
  }
};

function openLegalModal(docKey) {
  const data = legalData[docKey];
  if (!data) return;

  legalModalTitle.textContent = data.title;
  legalContent.innerHTML = data.content;

  legalModalOverlay.setAttribute('aria-hidden', 'false');
  legalModalOverlay.classList.add('is-visible');
  document.body.style.overflow = 'hidden';
}

function closeLegalModal() {
  legalModalOverlay.setAttribute('aria-hidden', 'true');
  legalModalOverlay.classList.remove('is-visible');
  document.body.style.overflow = '';
}

// Legal triggers
document.querySelectorAll('.legal-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const docKey = btn.getAttribute('data-legal');
    openLegalModal(docKey);
  });
});

legalModalClose?.addEventListener('click', closeLegalModal);
legalModalOverlay?.addEventListener('click', (e) => {
  if (e.target === legalModalOverlay) closeLegalModal();
});

// Newsletter form
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value.trim();
    if (!email) {
      setToast('Please enter your email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setToast('Please enter a valid email.');
      return;
    }
    // Demo: show success and reset
    setToast(`Subscribed: ${email}`);
    newsletterForm.reset();
  });
}

// Contact form functionality
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    const website = formData.get('website'); // Honeypot field
    
    // Check honeypot field for spam
    if (website) {
      showFormMessage('Spam detected!', 'error');
      return;
    }
    
    // Validate form
    if (!name || !email || !subject || !message) {
      showFormMessage('Please fill in all required fields.', 'error');
      return;
    }
    
    if (!isValidEmail(email)) {
      showFormMessage('Please enter a valid email address.', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span><div class="loading-spinner"></div>';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual implementation)
    setTimeout(() => {
      // Here you would normally send the data to your server
      console.log('Form submitted:', { name, email, subject, message });
      
      // Show success message
      showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
      
      // Reset form
      contactForm.reset();
      
      // Reset button
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
      
      // Clear message after 5 seconds
      setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
      }, 5000);
      
    }, 2000); // Simulate network delay
  });
}

function showFormMessage(message, type) {
  if (!formMessage) return;
  
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  
  if (type === 'error') {
    formMessage.style.color = 'var(--rose)';
  } else if (type === 'success') {
    formMessage.style.color = 'var(--emerald)';
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Initialize animation system
document.addEventListener('DOMContentLoaded', () => {
  themeManager.init();
  animationSystem.init();
  
  // Initialize typing animation
  initTypingAnimation();
  
  // Hide loading screen after page load
  const pageLoading = document.getElementById('page-loading');
  if (pageLoading) {
    setTimeout(() => {
      pageLoading.classList.add('hide');
      setTimeout(() => {
        pageLoading.style.display = 'none';
      }, 500);
    }, 1000);
  }
});

// Typing Animation Function
function initTypingAnimation() {
  const typedTextElement = document.getElementById('typed-text');
  if (!typedTextElement) return;
  
  const roles = [
    'fullstack developer',
    'designer',
    'engineer',
    'problem solver',
    'creative thinker',
    'tech enthusiast',
    'innovator',
    'coder'
  ];
  
  let currentRoleIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  let deletingSpeed = 50;
  let pauseTime = 2000;
  
  function typeText() {
    const currentRole = roles[currentRoleIndex];
    
    if (isDeleting) {
      // Deleting text
      typedTextElement.textContent = currentRole.substring(0, currentCharIndex - 1);
      currentCharIndex--;
      
      if (currentCharIndex === 0) {
        isDeleting = false;
        currentRoleIndex = (currentRoleIndex + 1) % roles.length;
        setTimeout(typeText, 500); // Pause before typing new word
      } else {
        setTimeout(typeText, deletingSpeed);
      }
    } else {
      // Typing text
      typedTextElement.textContent = currentRole.substring(0, currentCharIndex + 1);
      currentCharIndex++;
      
      if (currentCharIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeText, pauseTime); // Pause before deleting
      } else {
        setTimeout(typeText, typingSpeed);
      }
    }
  }
  
  // Start typing animation
  typeText();
}
