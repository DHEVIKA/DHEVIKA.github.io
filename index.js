/**
 * M Dhevika Portfolio - Retro Terminal Edition
 * Interactive JS Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initBootSequence();
  initCursorTrail();
  initTypewriter();
  initNavbar();
  initScrollSpy();
  initScrollReveal();
  initMobileMenu();
});

/* -------------------------------------------------------
 * Dynamic Hardwork Quote System (Random per visit)
 * New quote picked from localStorage to avoid repeats.
 * ------------------------------------------------------- */
const hardworkQuotes = [
  {
    text: "Hard work beats talent when talent doesn't work hard.",
    author: "— Tim Notke"
  },
  {
    text: "The only place where success comes before work is in the dictionary.",
    author: "— Vidal Sassoon"
  },
  {
    text: "Dreams don't work unless you do.",
    author: "— John C. Maxwell"
  },
  {
    text: "Opportunities are usually disguised as hard work, so most people don't recognize them.",
    author: "— Ann Landers"
  },
  {
    text: "There are no shortcuts to any place worth going.",
    author: "— Beverly Sills"
  },
  {
    text: "Talent is cheaper than table salt. What separates the talented individual from the successful one is a lot of hard work.",
    author: "— Stephen King"
  },
  {
    text: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.",
    author: "— Pelé"
  },
  {
    text: "The difference between try and triumph is just a little umph!",
    author: "— Marvin Phillips"
  },
  {
    text: "I am a great believer in luck, and I find the harder I work, the more I have of it.",
    author: "— Thomas Jefferson"
  },
  {
    text: "Without hard work, nothing grows but weeds.",
    author: "— Gordon B. Hinckley"
  },
  {
    text: "It's not about how bad you want it. It's about how hard you're willing to work for it.",
    author: "— Anonymous"
  },
  {
    text: "The road to success is dotted with many tempting parking spaces.",
    author: "— Will Rogers"
  },
  {
    text: "Things may come to those who wait, but only the things left by those who hustle.",
    author: "— Abraham Lincoln"
  },
  {
    text: "Hustle in silence and let your success make the noise.",
    author: "— Anonymous"
  },
  {
    text: "Work hard in silence, let your success be your noise.",
    author: "— Frank Ocean"
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "— Mark Twain"
  },
  {
    text: "A winner is just a loser who tried one more time.",
    author: "— George M. Moore Jr."
  },
  {
    text: "You don't get what you wish for. You get what you work for.",
    author: "— Anonymous"
  },
  {
    text: "Eighty percent of success is showing up.",
    author: "— Woody Allen"
  },
  {
    text: "Great things are not done by impulse, but by a series of small things brought together.",
    author: "— Vincent Van Gogh"
  }
];

function initQuoteSystem() {
  // Track visit count via localStorage
  let visitCount = parseInt(localStorage.getItem('dhevika_visits') || '0') + 1;
  localStorage.setItem('dhevika_visits', visitCount);

  // Pick a new quote different from the last shown
  let lastIndex = parseInt(localStorage.getItem('dhevika_last_quote') || '-1');
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * hardworkQuotes.length);
  } while (newIndex === lastIndex);

  localStorage.setItem('dhevika_last_quote', newIndex);

  displayQuote(hardworkQuotes[newIndex], visitCount);
}

function displayQuote(quote, visitCount) {
  const quoteTextEl = document.getElementById('dynamic-quote');
  const quoteAuthorEl = document.getElementById('dynamic-author');
  const visitCounterEl = document.getElementById('visit-counter-text');

  if (!quoteTextEl || !quoteAuthorEl || !visitCounterEl) return;

  // Typewriter effect for the quote
  quoteTextEl.textContent = '';
  quoteAuthorEl.textContent = '';
  let i = 0;
  const text = `"${quote.text}"`;

  const typeQuote = () => {
    if (i < text.length) {
      quoteTextEl.textContent += text.charAt(i);
      i++;
      setTimeout(typeQuote, 22);
    } else {
      // Fade in the author once the quote is done typing
      quoteAuthorEl.style.opacity = '0';
      quoteAuthorEl.textContent = quote.author;
      quoteAuthorEl.style.transition = 'opacity 0.8s ease';
      setTimeout(() => { quoteAuthorEl.style.opacity = '1'; }, 100);
    }
  };

  setTimeout(typeQuote, 800); // Delay start to let page settle

  // Visit counter with ordinal suffix
  const ordinal = (n) => {
    const s = ['th','st','nd','rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  if (visitCount === 1) {
    visitCounterEl.textContent = `> WELCOME! This is your first visit. // quote #${parseInt(localStorage.getItem('dhevika_last_quote')) + 1}`;
  } else {
    visitCounterEl.textContent = `> This is your ${ordinal(visitCount)} visit. New quote loaded automatically.`;
  }
}

function selectRandomQuote() {
  // Manual refresh button action
  const visitCount = parseInt(localStorage.getItem('dhevika_visits') || '1');
  let lastIndex = parseInt(localStorage.getItem('dhevika_last_quote') || '-1');
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * hardworkQuotes.length);
  } while (newIndex === lastIndex);
  localStorage.setItem('dhevika_last_quote', newIndex);

  // Animate widget
  const widgetBody = document.querySelector('.widget-body');
  widgetBody.style.opacity = '0';
  widgetBody.style.transform = 'translateY(5px)';
  widgetBody.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

  setTimeout(() => {
    displayQuote(hardworkQuotes[newIndex], visitCount);
    widgetBody.style.opacity = '1';
    widgetBody.style.transform = 'translateY(0)';
  }, 300);

  // Spin the refresh icon
  const btn = document.querySelector('.btn-reroll i');
  if (btn) {
    btn.style.transition = 'transform 0.5s ease';
    btn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      btn.style.transition = 'none';
      btn.style.transform = 'rotate(0deg)';
    }, 500);
  }
}

/* -------------------------------------------------------
 * Hero Typewriter — Roles cycle
 * ------------------------------------------------------- */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = [
    'AI/ML Developer',
    'Full Stack Engineer',
    'Cloud Architect',
    'Problem Solver',
    'Open Source Contributor'
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let speed = 100;

  function type() {
    const current = words[wordIndex];
    if (isDeleting) {
      charIndex--;
      speed = 50;
    } else {
      charIndex++;
      speed = 100;
    }

    el.textContent = current.substring(0, charIndex);

    if (!isDeleting && charIndex === current.length) {
      speed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  type();
}

/* -------------------------------------------------------
 * Navbar scroll-based opacity and background tint
 * ------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.background = 'rgba(12, 12, 12, 0.95)';
      navbar.style.backdropFilter = 'blur(10px)';
    } else {
      navbar.style.background = 'transparent';
      navbar.style.backdropFilter = 'none';
    }
  });
}

/* -------------------------------------------------------
 * Scroll Spy — Active nav links, left sidebar number,
 * and right scroll dot position.
 * ------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[data-sec]');
  const navLinks = document.querySelectorAll('.nav-link');
  const sidebarNum = document.getElementById('sidebar-section-num');
  const scrollDot = document.getElementById('scroll-dot');

  const sectionIds = ['home', 'about', 'projects', 'skills', 'contact'];

  function onScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(scrollY / docHeight, 1);

    // Move scroll dot along the line (0px → 75px height of the line)
    if (scrollDot) {
      scrollDot.style.top = `${scrollPercent * 75}px`;
    }

    // Determine active section
    let current = 'home';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    // Update sidebar number
    if (sidebarNum) {
      const secData = document.getElementById(current);
      if (secData) {
        sidebarNum.textContent = secData.getAttribute('data-sec') || '01';
      }
    }

    // Update nav active states
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run on load
}

/* -------------------------------------------------------
 * Scroll Reveal — IntersectionObserver fade-in
 * ------------------------------------------------------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* -------------------------------------------------------
 * Mobile Menu Toggle
 * ------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('active');
    const icon = btn.querySelector('i');
    icon.className = menu.classList.contains('active')
      ? 'fa-solid fa-xmark'
      : 'fa-solid fa-bars';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      btn.querySelector('i').className = 'fa-solid fa-bars';
    });
  });
}

/* -------------------------------------------------------
 * Project Filter Tabs
 * ------------------------------------------------------- */
function filterProjects(category) {
  const cards = document.querySelectorAll('.project-card');
  const buttons = document.querySelectorAll('.tab-btn');

  buttons.forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');

  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-cat') === category) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

/* -------------------------------------------------------
 * Project Detail Modal Data & Handlers
 * ------------------------------------------------------- */
const projectData = {
  'neuro-fusion': {
    title: 'NEURO FUSION',
    subtitle: 'Brain Tumor Detection Platform',
    category: 'Computer Vision & Deep Learning',
    status: 'Patent Filed & Best Paper Award',
    highlights: [
      'Engineered CNN pipeline achieving 93% classification accuracy on clinical MRI datasets.',
      'Patent filed: "Neuro Fusion: Advancing Brain Tumor Analysis using CNN Architecture".',
      'Best Scientific Paper Award at Saveetha University International Conference 2025.',
      'Django administrative portal integration for healthcare scan predictions.'
    ],
    description: 'Neuro Fusion is a medical image processing system integrating deep convolutional neural networks into clinical tumor detection workflows. The platform accepts raw MRI scan inputs, filters noise, and classifies tumor presence with 93% accuracy. A full-stack Django backend enables healthcare professionals to log, scan, and track diagnostic metrics.',
    tech: ['Python', 'TensorFlow', 'Keras', 'Django', 'CNN', 'NumPy', 'OpenCV']
  },
  'sahayak': {
    title: 'SAHAYAK',
    subtitle: 'Intelligent Multilingual Learning Assistant',
    category: 'Generative AI & Natural Language Processing',
    status: 'Google AI Hackathon 2025 Finalist',
    highlights: [
      'Finalist — Google Agentic AI Hackathon 2025 out of hundreds of submissions.',
      'Automated lecture summarization and interactive quiz generation via NLP chains.',
      'Supports multilingual classroom environments for low-resource schools.',
      'Dockerized Flask stack deployed on AWS ECS with elastic scaling.'
    ],
    description: 'Sahayak is an agentic AI tutor built to address structural education gaps in remote schools. It digests text lessons and audio inputs, then generates tailored lecture notes, multilingual explanations, and formative quizzes through custom NLP pipeline chains.',
    tech: ['Python', 'Flask', 'NLP Pipelines', 'Generative AI', 'Docker', 'AWS ECS', 'REST APIs']
  },
  'meeting-summarizer': {
    title: 'MEETING SUMMARIZER',
    subtitle: 'AI Powered Meeting Productivity Platform',
    category: 'Natural Language Processing & Backend Integration',
    status: '60% Manual Labor Saved — 500+ Users',
    highlights: [
      'Integrates Hugging Face text models for audio transcription and action-item extraction.',
      'Secured JWT session auth serving 500+ active user summaries.',
      'Reduces corporate documentation time by 60% with automated summaries.',
      'Backend API responses optimized to under 2 seconds per request.'
    ],
    description: 'Meeting Summarizer automates corporate meeting transcription and summary generation. The system processes audio files or speech recordings, extracts structured action items and key decisions via Hugging Face model APIs, and presents results through a secure Flask/PostgreSQL backend.',
    tech: ['Hugging Face APIs', 'Flask', 'PostgreSQL', 'NLP', 'REST APIs', 'JWT Auth', 'Python']
  }
};

function openProjectModal(projectId) {
  const modal = document.getElementById('project-modal');
  const container = document.getElementById('modal-project-details');
  const data = projectData[projectId];
  if (!data || !modal) return;

  container.innerHTML = `
    <div class="project-modal-header">
      <div class="section-label">${data.category}</div>
      <h2>${data.title}</h2>
      <p style="color: var(--text-gray); font-size: 0.9rem; margin-top: 4px;">${data.subtitle}</p>
    </div>
    <div class="project-meta-pills">
      <span class="project-meta-pill"><i class="fa-solid fa-trophy" style="color:#f59e0b;"></i> ${data.status}</span>
      <span class="project-meta-pill"><i class="fa-solid fa-circle-check" style="color:#10b981;"></i> Production Ready</span>
    </div>
    <p class="modal-proj-desc">${data.description}</p>
    <div class="project-highlights-box">
      <h4>KEY IMPLEMENTATIONS</h4>
      <ul>${data.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
    </div>
    <div class="project-modal-tech">
      <h4>TECHNOLOGIES USED</h4>
      <div class="modal-tags">${data.tech.map(t => `<span class="modal-tag">${t}</span>`).join('')}</div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  document.getElementById('project-modal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

/* -------------------------------------------------------
 * Resume Modal
 * ------------------------------------------------------- */
function openResumeModal() {
  document.getElementById('resume-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeResumeModal() {
  document.getElementById('resume-modal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

function printResume() {
  window.print();
}

/* -------------------------------------------------------
 * Console-styled Contact Form Handler
 * ------------------------------------------------------- */
function handleFormSubmit(event) {
  event.preventDefault();

  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  submitBtn.disabled = true;
  submitBtn.innerHTML = `[ENCRYPTING_PAYLOAD...] <i class="fa-solid fa-spinner fa-spin"></i>`;
  statusDiv.className = 'form-status';
  statusDiv.textContent = '';

  setTimeout(() => {
    submitBtn.innerHTML = `[TRANSMITTING...] <i class="fa-solid fa-satellite-dish fa-spin"></i>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `[TRANSMIT_MESSAGE] <i class="fa-solid fa-paper-plane"></i>`;
      statusDiv.className = 'form-status success';
      statusDiv.innerHTML = `<i class="fa-solid fa-circle-check"></i> >> TRANSMISSION_SUCCESS: Dhevika will receive and respond shortly.`;
      form.reset();
    }, 1200);
  }, 1000);
}

/* -------------------------------------------------------
 * Keyboard Shortcut Easter Egg: Press 'H' to cycle quote
 * ------------------------------------------------------- */
document.addEventListener('keydown', (e) => {
  if (e.key === 'h' || e.key === 'H') {
    if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      selectRandomQuote();
    }
  }
});

/* -------------------------------------------------------
 * Terminal Boot Sequence Overlay
 * ------------------------------------------------------- */
const bootLines = [
  { text: 'BIOS v2.026 — Initializing hardware checks...', cls: 'boot-green', delay: 0 },
  { text: 'CPU: [▓▓▓▓▓▓▓▓▓▓] 100% OK', cls: 'boot-white', delay: 180 },
  { text: 'RAM: 16384MB [▓▓▓▓▓▓▓▓] PASSED', cls: 'boot-white', delay: 320 },
  { text: 'GPU: NVIDIA-RETRO-CRT — PASSED', cls: 'boot-white', delay: 450 },
  { text: '\n[DHEVIKA-OS] Kernel loading...', cls: 'boot-green', delay: 600 },
  { text: '  Loading modules: nlp.ko... tensorflow.ko... django.ko... aws.ko... OK', cls: 'boot-white', delay: 800 },
  { text: '  Mounting file systems: /portfolio ... /projects ... /skills ... OK', cls: 'boot-white', delay: 960 },
  { text: '\n[NET] Establishing secure connection...', cls: 'boot-green', delay: 1150 },
  { text: '  dhevika0608@gmail.com — LINKED', cls: 'boot-blue', delay: 1280 },
  { text: '  linkedin.com/in/dhevika-m-54636825a — LINKED', cls: 'boot-blue', delay: 1380 },
  { text: '  github.com/DHEVIKA — LINKED', cls: 'boot-blue', delay: 1480 },
  { text: '\n[AI] Loading neural network parameters...', cls: 'boot-green', delay: 1620 },
  { text: '  Neuro-Fusion CNN: 93% accuracy on MRI datasets', cls: 'boot-white', delay: 1740 },
  { text: '  Sahayak NLP pipeline: Ready', cls: 'boot-white', delay: 1840 },
  { text: '  Meeting Summarizer: 500+ sessions processed', cls: 'boot-white', delay: 1940 },
  { text: '\n[AWARD] Achievements cache loaded:', cls: 'boot-green', delay: 2090 },
  { text: '  ★ Google Agentic AI Hackathon — FINALIST', cls: 'boot-white', delay: 2200 },
  { text: '  ★ Best Paper Award — Saveetha University IC 2025', cls: 'boot-white', delay: 2300 },
  { text: '  ★ Patent Filed — Indian Patent Office', cls: 'boot-white', delay: 2400 },
  { text: '\n[SYS] Welcome, visitor.', cls: 'boot-green', delay: 2560 },
  { text: '  Booting portfolio of M DHEVIKA...', cls: 'boot-white', delay: 2660 },
  { text: '  AI/ML & Full Stack Developer | Chennai, India', cls: 'boot-white', delay: 2760 },
  { text: '\n>>> SYSTEM READY. Launching interface...', cls: 'boot-green', delay: 2950 },
];

function initBootSequence() {
  const screen = document.getElementById('boot-screen');
  const logContainer = document.getElementById('boot-logs');
  if (!screen || !logContainer) return;

  // Create each log line with delay
  bootLines.forEach(({ text, cls, delay }) => {
    setTimeout(() => {
      const span = document.createElement('span');
      span.className = cls;
      span.textContent = text + '\n';
      logContainer.appendChild(span);
      logContainer.scrollTop = logContainer.scrollHeight;
    }, delay);
  });

  // Dismiss boot screen after last line + transition
  const totalTime = bootLines[bootLines.length - 1].delay + 900;
  setTimeout(() => {
    screen.classList.add('fade-out');
    // After fade, fully hide, then run remaining inits
    setTimeout(() => {
      screen.style.display = 'none';
      initQuoteSystem();
      initKindnessQuotes();
    }, 800);
  }, totalTime);
}

/* -------------------------------------------------------
 * Neon Cursor Trail Effect
 * ------------------------------------------------------- */
function initCursorTrail() {
  const trailLength = 12;
  const trails = [];

  // Create trail nodes
  for (let i = 0; i < trailLength; i++) {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    dot.style.opacity = (1 - i / trailLength).toString();
    dot.style.width = `${6 - i * 0.3}px`;
    dot.style.height = `${6 - i * 0.3}px`;
    document.body.appendChild(dot);
    trails.push({ el: dot, x: 0, y: 0 });
  }

  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateTrail() {
    let x = mouseX, y = mouseY;
    trails.forEach((trail, i) => {
      trail.el.style.left = `${x}px`;
      trail.el.style.top = `${y}px`;
      const prevX = trail.x;
      const prevY = trail.y;
      trail.x = x;
      trail.y = y;
      x = prevX || x;
      y = prevY || y;
    });
    requestAnimationFrame(animateTrail);
  }

  animateTrail();

  // Hide on mobile/touch devices
  if ('ontouchstart' in window) {
    trails.forEach(t => t.el.style.display = 'none');
  }
}

/* -------------------------------------------------------
 * Dynamic Kindness Quotes (Bottom console block)
 * ------------------------------------------------------- */
const kindnessQuotes = [
  { text: "No act of kindness, no matter how small, is ever wasted.", author: "— Aesop" },
  { text: "Kindness is the language which the deaf can hear and the blind can see.", author: "— Mark Twain" },
  { text: "Be kind, for everyone you meet is fighting a harder battle.", author: "— Plato" },
  { text: "Carry out a random act of kindness, with no expectation of reward.", author: "— Princess Diana" },
  { text: "The simplest acts of kindness are by far more powerful than a thousand heads bowing in prayer.", author: "— Mahatma Gandhi" },
  { text: "A single act of kindness throws out roots in all directions, and the roots spring up and make new trees.", author: "— Amelia Earhart" },
  { text: "Kindness in words creates confidence. Kindness in thinking creates profoundness. Kindness in giving creates love.", author: "— Lao Tzu" },
  { text: "When I was young, I admired clever people. Now that I am old, I admire kind people.", author: "— Abraham Joshua Heschel" },
  { text: "Be the reason someone smiles today. Be the reason someone feels loved and believes in the goodness in people.", author: "— Roy T. Bennett" },
  { text: "What wisdom can you find that is greater than kindness?", author: "— Jean-Jacques Rousseau" },
  { text: "Kindness is not an act. It is a lifestyle.", author: "— Anthony Douglas Williams" },
  { text: "Three things in human life are important: the first is to be kind; the second is to be kind; and the third is to be kind.", author: "— Henry James" },
  { text: "Too often we underestimate the power of a touch, a smile, a kind word, a listening ear.", author: "— Leo Buscaglia" },
  { text: "Beginning today, treat everyone you meet as if they were going to be dead by midnight.", author: "— Og Mandino" },
  { text: "You cannot do a kindness too soon, for you never know how soon it will be too late.", author: "— Ralph Waldo Emerson" },
  { text: "In a world where you can be anything, be kind.", author: "— Jennifer Dukes Lee" },
  { text: "Real generosity toward the future lies in giving all to the present.", author: "— Albert Camus" },
  { text: "There is no exercise better for the heart than reaching down and lifting people up.", author: "— John Holmes" },
];

function initKindnessQuotes() {
  const textEl = document.getElementById('kindness-quote-text');
  const authorEl = document.getElementById('kindness-quote-author');
  if (!textEl || !authorEl) return;

  // Pick a random non-repeating quote
  let lastIdx = parseInt(localStorage.getItem('dhevika_last_kindness') || '-1');
  let newIdx;
  do {
    newIdx = Math.floor(Math.random() * kindnessQuotes.length);
  } while (newIdx === lastIdx);
  localStorage.setItem('dhevika_last_kindness', newIdx);

  const quote = kindnessQuotes[newIdx];
  const fullText = `"${quote.text}"`;

  textEl.textContent = '';
  authorEl.textContent = '';
  authorEl.style.opacity = '0';

  let i = 0;
  function typeKindness() {
    if (i < fullText.length) {
      textEl.textContent += fullText.charAt(i++);
      setTimeout(typeKindness, 25);
    } else {
      authorEl.textContent = quote.author;
      authorEl.style.transition = 'opacity 1s ease';
      setTimeout(() => { authorEl.style.opacity = '1'; }, 100);
    }
  }
  setTimeout(typeKindness, 600);
}
