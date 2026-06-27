/**
 * M Dhevika Portfolio Interactivity & Animations Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  initTypewriter();
  initScrollReveal();
  initStatsCounter();
  initTiltEffect();
  initTimeline();
});

/* ----------------------------------------------------
 * Navbar Scroll Effects & Mobile Navigation
 * ---------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Change navbar background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  // Toggle Mobile Menu
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (mobileMenu.classList.contains('active')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  // Close Mobile Menu on clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      mobileMenuBtn.querySelector('i').className = 'fa-solid fa-bars';
    });
  });
}

// Active Nav Link highlight on scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  let currentActive = 'home';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentActive = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentActive}`) {
      link.classList.add('active');
    }
  });
}

/* ----------------------------------------------------
 * Canvas Connected Particles System
 * ---------------------------------------------------- */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  let particlesArray = [];
  const numberOfParticles = calculateParticleCount();

  // Mouse interactivity coordinates
  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Resize canvas dynamically
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function calculateParticleCount() {
    const area = window.innerWidth * window.innerHeight;
    // Scaled density based on viewport area
    return Math.floor(area / 16000);
  }

  // Particle Blueprint
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      this.baseColor = Math.random() > 0.5 ? '#6366f1' : '#10b981'; // Primary vs Emerald
    }

    update() {
      // Bounds checking
      if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
      if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

      // Update positions
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse interactive push/pull
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.hypot(dx, dy);
        
        if (distance < mouse.radius) {
          // Subtle attraction
          const force = (mouse.radius - distance) / mouse.radius;
          this.x += (dx / distance) * force * 0.8;
          this.y += (dy / distance) * force * 0.8;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor;
      ctx.fill();
    }
  }

  function init() {
    particlesArray = [];
    const count = calculateParticleCount();
    for (let i = 0; i < count; i++) {
      particlesArray.push(new Particle());
    }
  }

  function connectParticles() {
    let maxDistance = 110;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.hypot(dx, dy);

        if (distance < maxDistance) {
          let opacity = (1 - (distance / maxDistance)) * 0.15;
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Dark radial canvas background
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 50, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height));
    gradient.addColorStop(0, '#0a1024');
    gradient.addColorStop(1, '#040712');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }

  init();
  animate();

  window.addEventListener('resize', () => {
    init();
  });
}

/* ----------------------------------------------------
 * Hero Typer Writer Animation
 * ---------------------------------------------------- */
function initTypewriter() {
  const element = document.getElementById('typewriter');
  const words = ['AI/ML Developer', 'Full Stack Engineer', 'Cloud Architect', 'Problem Solver'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      charIndex--;
      typingSpeed = 50;
    } else {
      charIndex++;
      typingSpeed = 100;
    }

    element.textContent = currentWord.substring(0, charIndex);

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000; // Hold full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ----------------------------------------------------
 * Scroll Reveal Animations & Skill Bar Fills
 * ---------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        
        // Trigger skill progress bars specifically when Skills Section reveals
        if (entry.target.id === 'skills') {
          animateSkillBars();
        }
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    observer.observe(element);
  });
}

function animateSkillBars() {
  const bars = document.querySelectorAll('.skill-progress');
  bars.forEach(bar => {
    const width = bar.getAttribute('data-width');
    bar.style.width = width;
  });
}

/* ----------------------------------------------------
 * Stats Incrementor Counter
 * ---------------------------------------------------- */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  
  stats.forEach(stat => {
    const target = +stat.getAttribute('data-target');
    const increment = target / 60; // 60 frame duration
    let current = 0;

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        stat.textContent = Math.ceil(current);
        setTimeout(updateCounter, 16); // ~60fps
      } else {
        stat.textContent = target;
      }
    };

    // Delay start for dramatic entrance
    setTimeout(updateCounter, 500);
  });
}

/* ----------------------------------------------------
 * 3D Hover Tilt Effect
 * ---------------------------------------------------- */
function initTiltEffect() {
  const tiltElements = document.querySelectorAll('.tilt-element');

  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const width = rect.width;
      const height = rect.height;
      
      const rotateX = ((y / height) - 0.5) * -15; // Max 15 degrees tilt
      const rotateY = ((x / width) - 0.5) * 15;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Update mouse local coordinates variables for glow layers
      const mouseXPercentage = (x / width) * 100;
      const mouseYPercentage = (y / height) * 100;
      el.style.setProperty('--mouse-x', `${mouseXPercentage}%`);
      el.style.setProperty('--mouse-y', `${mouseYPercentage}%`);
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ----------------------------------------------------
 * Timeline Selector Toggle
 * ---------------------------------------------------- */
function switchTimeline(type) {
  const containers = document.querySelectorAll('.timeline-container');
  const buttons = document.querySelectorAll('.tab-btn');

  containers.forEach(container => {
    container.classList.remove('active');
  });
  buttons.forEach(btn => {
    btn.classList.remove('active');
  });

  document.getElementById(`timeline-${type}`).classList.add('active');
  event.currentTarget.classList.add('active');
}

function initTimeline() {
  // Reveal elements dynamically inside timeline on scroll
  const timelineItems = document.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
      }
    });
  }, { threshold: 0.1 });

  timelineItems.forEach(item => observer.observe(item));
}

/* ----------------------------------------------------
 * Project Detail Modals data & interaction
 * ---------------------------------------------------- */
const projectData = {
  'neuro-fusion': {
    title: 'Neuro Fusion',
    subtitle: 'Brain Tumor Detection Platform',
    category: 'Computer Vision & Deep Learning',
    status: 'Patent Filed & Award Winner',
    icon: 'fa-dna',
    gradient: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
    highlights: [
      'Engineered a CNN-based deep learning pipeline yielding 93% classification accuracy on clinical MRI datasets.',
      'Officially filed a patent under "Neuro Fusion: Advancing Brain Tumor Analysis using CNN Architecture".',
      'Awarded "Best Scientific Paper" at Saveetha University International Conference 2025.',
      'Integrated predictions into a Django-based administrative portal for intuitive healthcare metrics rendering.'
    ],
    description: 'Neuro Fusion is a medical image processing system that integrates neural networks into critical healthcare diagnosis assistance. The platform consumes raw neurological MRI scans, performs automatic noise filtering, and processes them through customized Convolutional Neural Networks (CNN) to detect tumors with high reliability (93% accuracy). The project includes a full-stack Django control panel allowing healthcare professionals to log patients, run analytical scans, and view historic diagnosis metrics.',
    tech: ['Python', 'TensorFlow', 'Keras', 'Django', 'CNN', 'NumPy', 'OpenCV', 'Deep Learning']
  },
  'sahayak': {
    title: 'Sahayak',
    subtitle: 'Intelligent Multilingual Learning Assistant',
    category: 'Generative AI & Natural Language Processing',
    status: 'Google AI Hackathon 2025 Finalist',
    icon: 'fa-robot',
    gradient: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)',
    highlights: [
      'Built a multilingual assistant designed for low-resource educational environments.',
      'Achieved Finalist status in the Google Agentic AI Hackathon 2025 out of hundreds of entries.',
      'Designed automated lecture summarization and interactive quiz generators using customized NLP chains.',
      'Dockerized the complete application stack for seamless, elastic scaling on AWS Cloud ECS.'
    ],
    description: 'Sahayak addresses structural education gaps in remote or low-resource schools. Built during the Google Agentic AI Hackathon, the software behaves as an agentic tutor. It digests text lessons or audio inputs and automatically generates tailored lecture notes, multi-language explanations, and formative quizzes. The application leverages a modular Python/Flask API, docker container networks, and elastic deployment nodes.',
    tech: ['Python', 'Flask', 'NLP Pipelines', 'Generative AI', 'Docker', 'AWS ECS', 'REST APIs', 'Git']
  },
  'meeting-summarizer': {
    title: 'Meeting Summarizer',
    subtitle: 'AI Powered Meeting Platform',
    category: 'Natural Language Processing & Backend Integration',
    status: '60% Labor Efficiencies Saved',
    icon: 'fa-list-check',
    gradient: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)',
    highlights: [
      'Integrated Hugging Face text models to transcribe, audit, and extract key action-items from meetings.',
      'Secured session auth modules, serving 500+ active user summaries.',
      'Reduced corporate meeting documentation times by over 60% with automated workflows.',
      'Optimized backend API payloads to serve results within under 2 seconds.'
    ],
    description: 'Meeting Summarizer is a productivity application that automates transcripts extraction and summaries. It consumes audio files or live speech tracks, translates details using Hugging Face model APIs, and outputs structured takeaways (decisions, key dates, assigned developers). The backend, structured with Python Flask and robust SQL databases, implements secure JWT sessions to preserve user privacy and data integrity.',
    tech: ['Hugging Face APIs', 'Flask', 'Python', 'PostgreSQL', 'NLP', 'REST APIs', 'JWT Auth']
  }
};

function openProjectModal(projectId) {
  const modal = document.getElementById('project-modal');
  const detailsContainer = document.getElementById('modal-project-details');
  const data = projectData[projectId];

  if (!data) return;

  detailsContainer.innerHTML = `
    <div class="project-modal-header">
      <span class="project-category">${data.category}</span>
      <h2>${data.title}</h2>
      <p class="text-gradient">${data.subtitle}</p>
    </div>

    <div class="project-meta-pills">
      <span class="project-meta-pill text-primary"><i class="fa-solid fa-trophy"></i> ${data.status}</span>
      <span class="project-meta-pill"><i class="fa-solid fa-code"></i> Production Ready</span>
    </div>

    <p class="modal-proj-desc">${data.description}</p>

    <div class="project-highlights-box">
      <h4><i class="fa-solid fa-circle-check text-emerald"></i> Key Implementations</h4>
      <ul>
        ${data.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    </div>

    <div class="project-modal-tech">
      <h4>Technologies Utilized</h4>
      <div class="modal-tags">
        ${data.tech.map(t => `<span class="modal-tag">${t}</span>`).join('')}
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Lock scroll
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto'; // Unlock scroll
}

/* ----------------------------------------------------
 * Printable Resume Modal Controller
 * ---------------------------------------------------- */
function openResumeModal() {
  const modal = document.getElementById('resume-modal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeResumeModal() {
  const modal = document.getElementById('resume-modal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function printResume() {
  window.print();
}

/* ----------------------------------------------------
 * Interactive Form Handler
 * ---------------------------------------------------- */
function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Trigger cyber glow sending state
  submitBtn.disabled = true;
  submitBtn.innerHTML = `Encrypting Transmission <i class="fa-solid fa-spinner fa-spin"></i>`;
  statusDiv.className = 'form-status';
  statusDiv.textContent = '';

  setTimeout(() => {
    submitBtn.innerHTML = `Transmitting <i class="fa-solid fa-satellite-dish fa-spin"></i>`;
    
    setTimeout(() => {
      // Success confirmation
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Send message <i class="fa-solid fa-paper-plane"></i>`;
      statusDiv.className = 'form-status success';
      statusDiv.innerHTML = `<i class="fa-solid fa-circle-check"></i> Transmission successful! M Dhevika will review your message soon.`;
      
      form.reset();
    }, 1200);
  }, 1000);
}
