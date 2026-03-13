/* ─── REFINERS MEDIA — MAIN JS ──────────────────────────────────────────── */

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3001'
  : '';  // Same origin in production

// ─── PAGE LOADER ─────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 2000);
});
document.body.style.overflow = 'hidden';

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const menuBtn = document.getElementById('menu-btn');
const closeMenu = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('#mobile-menu a');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

menuBtn?.addEventListener('click', () => mobileMenu?.classList.add('active'));
closeMenu?.addEventListener('click', () => mobileMenu?.classList.remove('active'));
mobileLinks.forEach(l => l.addEventListener('click', () => mobileMenu?.classList.remove('active')));

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${section.id}`) link.classList.add('active');
      });
    }
  });
});

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ─── ANIMATED COUNTERS ────────────────────────────────────────────────────────
function animateCounter(el, target, suffix = '', duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + suffix;
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

// ─── PROJECTS (DYNAMIC LOAD) ──────────────────────────────────────────────────
const projectsGrid = document.getElementById('projects-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
let allProjects = [];

async function loadProjects(category = 'All') {
  try {
    const url = category === 'All'
      ? `${API_BASE}/api/projects`
      : `${API_BASE}/api/projects?category=${encodeURIComponent(category)}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.success) {
      allProjects = data.data;
      renderProjects(data.data);
    }
  } catch (err) {
    // Fallback to static data if API unavailable
    console.warn('API unavailable, using fallback data');
    renderProjects(FALLBACK_PROJECTS);
  }
}

function renderProjects(projects) {
  if (!projectsGrid) return;
  projectsGrid.innerHTML = '';

  const heights = ['280px', '360px', '320px', '300px', '380px', '260px'];

  projects.forEach((project, i) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.style.height = heights[i % heights.length];
    card.dataset.id = project.id;
    card.innerHTML = `
      <img src="${project.image}" alt="${project.title}" loading="lazy">
      <div class="project-overlay">
        <span class="project-tag">${project.category}</span>
        <h3 style="font-family:var(--font-heading);font-size:1.1rem;font-weight:700;color:white;margin-bottom:6px;">${project.title}</h3>
        <p style="font-size:0.8rem;color:rgba(255,255,255,0.7);line-height:1.5;">${project.description}</p>
        <div style="margin-top:12px;display:flex;gap:6px;flex-wrap:wrap;">
          ${project.tags.map(t => `<span style="background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.8);padding:3px 10px;border-radius:4px;font-size:0.7rem;">${t}</span>`).join('')}
        </div>
      </div>
    `;
    card.addEventListener('click', () => openLightbox(project));
    projectsGrid.appendChild(card);
  });

  // Re-observe new cards
  document.querySelectorAll('.project-card.reveal').forEach(el => revealObserver.observe(el));
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadProjects(btn.dataset.filter);
  });
});

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDesc = document.getElementById('lightbox-desc');
const lightboxTags = document.getElementById('lightbox-tags');
const lightboxCategory = document.getElementById('lightbox-category');
const closeLightbox = document.getElementById('close-lightbox');

function openLightbox(project) {
  if (!lightbox) return;
  lightboxImg.src = project.image;
  lightboxImg.alt = project.title;
  lightboxTitle.textContent = project.title;
  lightboxDesc.textContent = project.description;
  lightboxCategory.textContent = project.category;
  lightboxTags.innerHTML = project.tags
    .map(t => `<span style="background:rgba(255,69,0,0.1);border:1px solid rgba(255,69,0,0.2);color:var(--accent-fire);padding:4px 12px;border-radius:4px;font-size:0.78rem;">${t}</span>`)
    .join('');
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

closeLightbox?.addEventListener('click', closeLightboxFn);
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightboxFn();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightboxFn();
});

function closeLightboxFn() {
  lightbox?.classList.remove('active');
  document.body.style.overflow = '';
}

// ─── TESTIMONIALS CAROUSEL ────────────────────────────────────────────────────
const testimonialTrack = document.getElementById('testimonial-track');
const sliderDots = document.getElementById('slider-dots');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
let currentSlide = 0;
let totalSlides = 0;
let autoplayInterval;

async function loadTestimonials() {
  try {
    const res = await fetch(`${API_BASE}/api/testimonials`);
    const data = await res.json();
    if (data.success) renderTestimonials(data.data);
  } catch {
    renderTestimonials(FALLBACK_TESTIMONIALS);
  }
}

function renderTestimonials(testimonials) {
  if (!testimonialTrack) return;
  totalSlides = testimonials.length;
  testimonialTrack.innerHTML = '';
  sliderDots.innerHTML = '';

  testimonials.forEach((t, i) => {
    const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
    const card = document.createElement('div');
    card.className = `testimonial-card ${i === 0 ? 'active' : ''}`;
    card.innerHTML = `
      <div class="testimonial-quote">"</div>
      <div style="display:flex;gap:2px;margin-bottom:20px;">
        ${Array(t.rating).fill('<span class="star">★</span>').join('')}
      </div>
      <p style="font-size:0.95rem;line-height:1.75;color:var(--text-secondary);margin-bottom:28px;font-style:italic;">"${t.review}"</p>
      <div style="display:flex;align-items:center;gap:14px;">
        <img src="${t.photo}" alt="${t.name}" class="testimonial-avatar" loading="lazy">
        <div>
          <p style="font-family:var(--font-heading);font-weight:700;font-size:0.95rem;">${t.name}</p>
          <p style="font-size:0.78rem;color:var(--text-muted);">${t.role}</p>
        </div>
      </div>
    `;
    testimonialTrack.appendChild(card);

    const dot = document.createElement('button');
    dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    sliderDots.appendChild(dot);
  });

  updateSlider();
  startAutoplay();
}

function updateSlider() {
  if (!testimonialTrack) return;
  const cardWidth = testimonialTrack.querySelector('.testimonial-card')?.offsetWidth + 24 || 424;
  testimonialTrack.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

  document.querySelectorAll('.testimonial-card').forEach((c, i) => {
    c.classList.toggle('active', i === currentSlide);
  });
  document.querySelectorAll('.slider-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

function goToSlide(n) {
  currentSlide = (n + totalSlides) % totalSlides;
  updateSlider();
  resetAutoplay();
}

prevBtn?.addEventListener('click', () => goToSlide(currentSlide - 1));
nextBtn?.addEventListener('click', () => goToSlide(currentSlide + 1));

function startAutoplay() {
  autoplayInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
}
function resetAutoplay() {
  clearInterval(autoplayInterval);
  startAutoplay();
}

window.addEventListener('resize', updateSlider);

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const submitText = document.getElementById('submit-text');
const submitSpinner = document.getElementById('submit-spinner');

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  // Loading state
  submitBtn.disabled = true;
  submitSpinner.style.display = 'block';
  submitText.textContent = 'Sending...';

  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    designNeeded: document.getElementById('design-needed').value,
    message: document.getElementById('message').value,
  };

  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (data.success) {
      showToast(data.message, 'success');
      contactForm.reset();
    } else {
      showToast(data.message || 'Something went wrong.', 'error');
    }
  } catch {
    showToast('Network error. Please email us directly at refinersmedia1@gmail.com', 'error');
  } finally {
    submitBtn.disabled = false;
    submitSpinner.style.display = 'none';
    submitText.textContent = 'Send Message';
  }
});

function validateForm() {
  let valid = true;
  const fields = [
    { id: 'name', msg: 'Name is required' },
    { id: 'email', msg: 'Valid email is required', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    { id: 'message', msg: 'Message is required' },
  ];
  fields.forEach(f => {
    const input = document.getElementById(f.id);
    const err = document.getElementById(`${f.id}-error`);
    const val = input?.value?.trim();

    input?.classList.remove('input-error');
    if (err) err.style.display = 'none';

    if (!val || (f.pattern && !f.pattern.test(val))) {
      input?.classList.add('input-error');
      if (err) { err.textContent = f.msg; err.style.display = 'block'; }
      valid = false;
    }
  });
  return valid;
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
const toast = document.getElementById('toast');
function showToast(msg, type = 'success') {
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `${type} show`;
  setTimeout(() => toast.classList.remove('show'), 4500);
}

// ─── FALLBACK STATIC DATA (when API unavailable) ──────────────────────────────
const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: "Luxe Brand Identity",
    category: "Branding",
    description: "Complete visual identity system for a luxury lifestyle brand.",
    image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=600&q=80",
    tags: ["Branding", "Logo", "Identity"]
  },
  {
    id: 2,
    title: "Social Media Campaign",
    category: "Social Media",
    description: "60-post social media design system for a tech startup.",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80",
    tags: ["Social Media", "Campaign", "Design"]
  },
  {
    id: 3,
    title: "Marketing Collateral Suite",
    category: "Marketing",
    description: "Complete marketing materials including brochures, flyers, banners.",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80",
    tags: ["Marketing", "Print", "Digital"]
  },
  {
    id: 4,
    title: "Fashion Brand Rebrand",
    category: "Branding",
    description: "Full rebrand for an emerging fashion label.",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80",
    tags: ["Branding", "Fashion", "Rebrand"]
  },
  {
    id: 5,
    title: "Restaurant Visual System",
    category: "Graphic Design",
    description: "Menu design, signage, packaging for a premium restaurant chain.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    tags: ["Graphic Design", "Packaging", "Branding"]
  },
  {
    id: 6,
    title: "Creative Campaign — TechX",
    category: "Campaign",
    description: "End-to-end creative campaign for a fintech company.",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80",
    tags: ["Campaign", "Fintech", "Digital"]
  }
];

const FALLBACK_TESTIMONIALS = [
  {
    id: 1,
    name: "Amara Okafor",
    role: "CEO, Lumina Fashion",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80",
    review: "Refiners Media completely transformed our brand identity. Creative, professional, and incredibly detail-oriented. Our social media engagement has grown 3x since the rebrand.",
    rating: 5
  },
  {
    id: 2,
    name: "Chukwuemeka Adeyemi",
    role: "Founder, TechVault Africa",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
    review: "Working with Refiners Media was a game-changer for our startup. They understood our vision perfectly and the marketing campaign they designed tripled our lead conversions.",
    rating: 5
  },
  {
    id: 3,
    name: "Ngozi Eze",
    role: "Marketing Director, PrimeEdge Group",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    review: "Exceptional quality, quick turnaround, and a team that truly cares about results. Refiners Media is our go-to creative partner. Every project looks world-class.",
    rating: 5
  },
  {
    id: 4,
    name: "Daniel Mensah",
    role: "Creative Director, BoldMark Agency",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    review: "The designs from Refiners Media are always fresh, bold, and on-brand. They've become an extension of our creative team. I recommend them to every brand.",
    rating: 5
  }
];

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  loadTestimonials();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Parallax hero text on scroll (subtle)
const heroSection = document.getElementById('hero');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    const parallaxEls = document.querySelectorAll('.hero-parallax');
    parallaxEls.forEach(el => {
      el.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    });
  }
});
