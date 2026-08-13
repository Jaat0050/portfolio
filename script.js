/* ===================================================================
   ARJUN RANA — PREMIUM 3D PORTFOLIO
   Main JavaScript — Three.js + Animations + Interactions
   =================================================================== */

'use strict';

// ===================================================================
// POLYFILLS
// ===================================================================
// ctx.roundRect polyfill for Safari < 16 and older browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
}

// ===================================================================
// CONSTANTS & STATE
// ===================================================================
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
const IS_TOUCH = 'ontouchstart' in window;

let threeLoaded = false;

// ===================================================================
// LOADER
// ===================================================================
(function initLoader() {
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');

  if (!loader) return;

  // Animate bar
  requestAnimationFrame(() => {
    setTimeout(() => { loaderBar.style.width = '60%'; }, 100);
    setTimeout(() => { loaderBar.style.width = '90%'; }, 500);
    setTimeout(() => {
      loaderBar.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
        triggerHeroReveal();
      }, 300);
    }, 1400);
  });
})();

function triggerHeroReveal() {
  const elements = document.querySelectorAll('#hero .reveal');
  elements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, i * 120);
  });
}

// ===================================================================
// CUSTOM CURSOR (Desktop only)
// ===================================================================
(function initCursor() {
  if (IS_TOUCH) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states
  const interactives = document.querySelectorAll('a, button, .project-card, .arch-layer, .ailab-card, .service-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();

// ===================================================================
// NAVIGATION — Scroll spy & hamburger
// ===================================================================
(function initNav() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const navLinks = document.querySelectorAll('.nav-links a[data-section]');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Scroll: frosted glass
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll spy via Intersection Observer
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
})();

// ===================================================================
// REVEAL ANIMATIONS — Intersection Observer
// ===================================================================
(function initReveal() {
  if (REDUCED_MOTION) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.timeline-item').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.process-step').forEach(el => el.classList.add('visible'));
    return;
  }

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .timeline-item, .process-step').forEach(el => {
    // Don't double-observe hero elements (handled by loader)
    if (!el.closest('#hero')) {
      revealObs.observe(el);
    }
  });
})();

// ===================================================================
// ANIMATED COUNTERS
// ===================================================================
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const duration = REDUCED_MOTION ? 0 : 1200;
      const start = performance.now();

      function update(time) {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      if (REDUCED_MOTION) {
        el.textContent = target + suffix;
      } else {
        requestAnimationFrame(update);
      }

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// ===================================================================
// PROJECT CARD 3D TILT
// ===================================================================
(function initCardTilt() {
  if (IS_TOUCH || REDUCED_MOTION) return;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) * 8;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });

    card.addEventListener('click', () => {
      const project = card.dataset.project;
      if (project) openModal(project);
    });
  });
})();

// ===================================================================
// PROJECT MODALS
// ===================================================================
function openModal(id) {
  const overlay = document.getElementById('modal-' + id);
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  overlay.focus();
}

function closeModal(id) {
  const overlay = document.getElementById('modal-' + id);
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      const id = overlay.id.replace('modal-', '');
      closeModal(id);
    }
  });
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(overlay => {
      const id = overlay.id.replace('modal-', '');
      closeModal(id);
    });
  }
});

// Make openModal/closeModal global
window.openModal = openModal;
window.closeModal = closeModal;

// ===================================================================
// ARCHITECTURE ACCORDION
// ===================================================================
window.toggleArch = function(el) {
  const isExpanded = el.classList.contains('expanded');
  document.querySelectorAll('.arch-layer').forEach(l => l.classList.remove('expanded'));
  if (!isExpanded) el.classList.add('expanded');
};

// ===================================================================
// CONTACT FORM (Google Sheets)
// ===================================================================
(function initContactForm() {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyDanjzL5W9wfoXg-QixhMNWHqXovLbfQzAOQLD8syzXeF2jAlDDA4Cyr7dNTDSbAJEag/exec';
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  const btn = document.getElementById('formSubmitBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    btn.textContent = 'Sending...';
    btn.disabled = true;

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
      .then(() => {
        msg.textContent = '✓ Message sent! I\'ll get back to you soon.';
        msg.style.color = '#4ade80';
        form.reset();
        setTimeout(() => { msg.textContent = ''; }, 6000);
      })
      .catch(() => {
        msg.textContent = 'Something went wrong. Please email me directly.';
        msg.style.color = '#f87171';
      })
      .finally(() => {
        btn.textContent = 'Send Message';
        btn.disabled = false;
      });
  });
})();

// ===================================================================
// THREE.JS SCENES — Load after DOM ready
// ===================================================================
window.addEventListener('load', initThreeJS);

function initThreeJS() {
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded — 3D scenes skipped');
    return;
  }
  threeLoaded = true;
  initHeroScene();
  initTechUniverse();
  initAICanvas();
}

// -------------------------------------------------------------------
// HERO SCENE — Floating phone with particles
// -------------------------------------------------------------------
function initHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !IS_MOBILE,
    powerPreference: 'default'
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, IS_MOBILE ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 8);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x0d1a2e, 1.5);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x00d4ff, IS_MOBILE ? 1 : 2, 30);
  cyanLight.position.set(5, 5, 5);
  scene.add(cyanLight);

  const violetLight = new THREE.PointLight(0x7c3aed, IS_MOBILE ? 0.5 : 1, 20);
  violetLight.position.set(-5, -3, 3);
  scene.add(violetLight);

  // Particles
  const particleCount = IS_MOBILE ? 150 : 400;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 30;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x00d4ff,
    size: 0.03,
    transparent: true,
    opacity: 0.4,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(geometry, particleMat);
  scene.add(particles);

  // Mouse tracking
  const mouse = { x: 0, y: 0 };
  let targetRotX = 0, targetRotY = 0;

  if (!IS_TOUCH) {
    document.addEventListener('mousemove', (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });

  let frame = 0;

  function animate() {
    requestAnimationFrame(animate);
    frame++;

    // Slow particle rotation
    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0001;

    // Subtle camera drift from mouse
    targetRotX += (mouse.y * 0.3 - targetRotX) * 0.04;
    targetRotY += (mouse.x * 0.3 - targetRotY) * 0.04;

    camera.position.x += (targetRotY * 0.5 - camera.position.x) * 0.03;
    camera.position.y += (-targetRotX * 0.5 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();
}

// -------------------------------------------------------------------
// TECH UNIVERSE — Interactive 3D orbital system
// -------------------------------------------------------------------
const TECH_DATA = [
  { name: 'Flutter', icon: '💙', color: 0x54C5F8, desc: 'Primary framework. Flutter apps for iOS, Android, and web. State management with BLoC, GetX, Provider, and Riverpod.', size: 1.4 },
  { name: 'Dart', icon: '🎯', color: 0x00B4D8, desc: 'Core programming language. Asynchronous programming, streams, isolates, and high-performance Dart code.', size: 0.8 },
  { name: 'Firebase', icon: '🔥', color: 0xFFA000, desc: 'Authentication, Firestore, Storage, Cloud Functions, Push Notifications (FCM), App Check, and Remote Config.', size: 0.9 },
  { name: 'Supabase', icon: '⚡', color: 0x3ECF8E, desc: 'PostgreSQL-backed backend. Real-time subscriptions, Row Level Security, Supabase Auth, and Storage.', size: 0.75 },
  { name: 'REST APIs', icon: '🌐', color: 0x7C3AED, desc: 'RESTful API integration, HTTP clients (Dio, http), JSON parsing, authentication headers, interceptors.', size: 0.8 },
  { name: 'AI APIs', icon: '🤖', color: 0x00D4FF, desc: 'LLM API integration, AI-powered features, structured prompts, response parsing, and intelligent mobile UX.', size: 0.8 },
  { name: 'WebSockets', icon: '🔄', color: 0xE040FB, desc: 'Real-time communication using WebSockets and STOMP protocol (stomp_dart_client). Live chat and updates.', size: 0.7 },
  { name: 'Google Maps', icon: '🗺️', color: 0x4CAF50, desc: 'Google Maps SDK, Google Places API, map markers, geofencing, and location-based features.', size: 0.7 },
  { name: 'iOS', icon: '🍎', color: 0xA8A8A8, desc: 'iOS development with Flutter. Xcode, CocoaPods, TestFlight, App Store Connect, and iOS-specific implementations.', size: 0.75 },
  { name: 'Android', icon: '🤖', color: 0x3DDC84, desc: 'Android development. Google Play Console, Android Studio, APK/AAB builds, and platform-specific channels.', size: 0.75 },
  { name: 'Git', icon: '📦', color: 0xF05033, desc: 'Version control with Git and GitHub. Feature branches, pull requests, code reviews, and collaborative workflows.', size: 0.65 },
  { name: 'BLoC', icon: '🔵', color: 0x0175C2, desc: 'Business Logic Component pattern. Streams, events, states, and clean separation of UI and logic.', size: 0.65 },
];

function initTechUniverse() {
  const canvas = document.getElementById('tech-universe-canvas');
  if (!canvas) return;

  // Build mobile fallback grid
  buildTechGrid();

  // Hide canvas on mobile
  if (IS_MOBILE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0d1117, 1);

  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  renderer.setSize(W, H, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);
  camera.position.set(0, 0, 22);

  // Lighting
  scene.add(new THREE.AmbientLight(0x112244, 2));
  const ptLight = new THREE.PointLight(0x00d4ff, 2, 60);
  ptLight.position.set(0, 0, 10);
  scene.add(ptLight);

  const nodes = [];
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  // Center node — Flutter
  const centerGeo = new THREE.SphereGeometry(1.5, 32, 32);
  const centerMat = new THREE.MeshPhongMaterial({
    color: 0x54C5F8,
    emissive: 0x0044aa,
    emissiveIntensity: 0.4,
    shininess: 100,
    transparent: true,
    opacity: 0.9
  });
  const centerMesh = new THREE.Mesh(centerGeo, centerMat);
  centerMesh.userData = TECH_DATA[0];
  scene.add(centerMesh);
  nodes.push(centerMesh);

  // Orbit nodes
  const orbitData = TECH_DATA.slice(1);
  const rings = [
    { techs: orbitData.slice(0, 5), radius: 6, speed: 0.0006, tilt: 0.3 },
    { techs: orbitData.slice(5, 11), radius: 10, speed: -0.0004, tilt: -0.2 }
  ];

  rings.forEach((ring, ri) => {
    ring.techs.forEach((tech, ti) => {
      const angle = (ti / ring.techs.length) * Math.PI * 2;
      const geo = new THREE.SphereGeometry(tech.size || 0.7, 24, 24);
      const mat = new THREE.MeshPhongMaterial({
        color: tech.color,
        emissive: tech.color,
        emissiveIntensity: 0.15,
        shininess: 80,
        transparent: true,
        opacity: 0.85
      });
      const mesh = new THREE.Mesh(geo, mat);

      // Store orbit params
      mesh.userData = { ...tech, orbitRadius: ring.radius, orbitAngle: angle, orbitTilt: ring.tilt, ringIndex: ri, nodeIndex: ti };

      const x = Math.cos(angle) * ring.radius;
      const y = Math.sin(angle) * ring.radius * 0.35 + (ring.tilt * ri * 2);
      const z = Math.sin(angle) * ring.radius * 0.5;
      mesh.position.set(x, y, z);
      scene.add(mesh);
      nodes.push(mesh);
    });
  });

  // Ring wireframes
  rings.forEach(ring => {
    const ringGeo = new THREE.RingGeometry(ring.radius - 0.02, ring.radius + 0.02, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI * 0.15 + ring.tilt;
    scene.add(ringMesh);
  });

  // Stars background
  const starsGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(600 * 3);
  for (let i = 0; i < 600 * 3; i++) starPositions[i] = (Math.random() - 0.5) * 120;
  starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0x334455, size: 0.1, transparent: true, opacity: 0.6 })));

  // Drag rotation
  let isDragging = false;
  let prevMouse = { x: 0, y: 0 };
  let sceneRotY = 0;
  let sceneRotX = 0;
  let autoRotate = true;

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    autoRotate = false;
    prevMouse = { x: e.clientX, y: e.clientY };
  });

  canvas.addEventListener('mousemove', (e) => {
    // Raycaster hover
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (isDragging) {
      sceneRotY += (e.clientX - prevMouse.x) * 0.005;
      sceneRotX += (e.clientY - prevMouse.y) * 0.005;
      prevMouse = { x: e.clientX, y: e.clientY };
    }
  });

  canvas.addEventListener('mouseup', () => {
    isDragging = false;
    setTimeout(() => { autoRotate = true; }, 3000);
  });

  canvas.addEventListener('mouseleave', () => { isDragging = false; });

  // Click to select
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(nodes);
    if (hits.length > 0) {
      showTechInfo(hits[0].object.userData);
    }
  });

  let t = 0;
  const centerOrigColor = new THREE.Color(0x54C5F8);

  function animateUniverse() {
    requestAnimationFrame(animateUniverse);
    t += 0.01;

    // Auto rotate
    if (autoRotate && !isDragging) {
      sceneRotY += 0.001;
    }

    // Update all orbit nodes
    let nodeIdx = 1;
    rings.forEach((ring, ri) => {
      ring.techs.forEach((_, ti) => {
        const mesh = nodes[nodeIdx];
        if (!mesh) return;
        const data = mesh.userData;
        const angle = data.orbitAngle + t * (ri === 0 ? 0.06 : -0.04);
        const x = Math.cos(angle) * data.orbitRadius;
        const y = Math.sin(angle) * data.orbitRadius * 0.25 + data.orbitTilt * 1.5;
        const z = Math.sin(angle) * data.orbitRadius * 0.4;
        mesh.position.set(x, y, z);
        mesh.rotation.y += 0.01;
        nodeIdx++;
      });
    });

    // Center pulse
    const pulse = 1 + Math.sin(t * 1.5) * 0.03;
    centerMesh.scale.setScalar(pulse);
    centerMesh.rotation.y += 0.005;

    // Apply scene rotation
    scene.rotation.y += (sceneRotY - scene.rotation.y) * 0.1;
    scene.rotation.x += (sceneRotX - scene.rotation.x) * 0.1;

    renderer.render(scene, camera);
  }

  animateUniverse();

  // Resize
  const resizeObs = new ResizeObserver(() => {
    const W2 = canvas.clientWidth;
    const H2 = canvas.clientHeight;
    renderer.setSize(W2, H2, false);
    camera.aspect = W2 / H2;
    camera.updateProjectionMatrix();
  });
  resizeObs.observe(canvas);
}

function showTechInfo(data) {
  const panel = document.getElementById('techInfoPanel');
  const icon = document.getElementById('techInfoIcon');
  const name = document.getElementById('techInfoName');
  const desc = document.getElementById('techInfoDesc');
  if (!panel || !data.name) return;

  panel.classList.remove('visible');
  setTimeout(() => {
    icon.textContent = data.icon || '💡';
    name.textContent = data.name;
    desc.textContent = data.desc;
    panel.classList.add('visible');
  }, 150);
}

function buildTechGrid() {
  const grid = document.getElementById('techGridMobile');
  if (!grid) return;
  TECH_DATA.forEach(tech => {
    const item = document.createElement('div');
    item.className = 'tech-grid-item';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', tech.name);
    item.innerHTML = `<div class="tech-grid-icon">${tech.icon}</div><div class="tech-grid-name">${tech.name}</div>`;
    item.addEventListener('click', () => showTechInfo(tech));
    item.addEventListener('keydown', e => { if (e.key === 'Enter') showTechInfo(tech); });
    grid.appendChild(item);
  });
}

// -------------------------------------------------------------------
// AI LAB CANVAS — Animated node network
// -------------------------------------------------------------------
function initAICanvas() {
  const canvas = document.getElementById('ai-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = canvas.offsetWidth;
  let H = canvas.offsetHeight;
  canvas.width = W;
  canvas.height = H;

  const nodes = [
    { label: 'Flutter App', x: 0.15, y: 0.5, color: '#54C5F8', radius: 28 },
    { label: 'REST API', x: 0.38, y: 0.3, color: '#7C3AED', radius: 22 },
    { label: 'AI Model', x: 0.6, y: 0.5, color: '#00D4FF', radius: 34 },
    { label: 'Response', x: 0.38, y: 0.72, color: '#3ECF8E', radius: 20 },
    { label: 'Mobile UI', x: 0.85, y: 0.5, color: '#F59E0B', radius: 26 },
  ];

  const connections = [
    [0, 1], [1, 2], [0, 3], [3, 2], [2, 4]
  ];

  let t = 0;
  const particlesOnEdge = [];

  // Init edge particles
  connections.forEach(([from, to]) => {
    particlesOnEdge.push({ from, to, progress: Math.random(), speed: 0.005 + Math.random() * 0.008 });
  });

  function draw() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    ctx.clearRect(0, 0, W, H);

    // Background
    const bg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H));
    bg.addColorStop(0, 'rgba(17,8,35,0.95)');
    bg.addColorStop(1, 'rgba(7,11,20,0.98)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const getPos = (node) => ({
      x: node.x * W,
      y: node.y * H
    });

    // Draw connections
    connections.forEach(([fromIdx, toIdx]) => {
      const from = getPos(nodes[fromIdx]);
      const to = getPos(nodes[toIdx]);

      const grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
      grad.addColorStop(0, nodes[fromIdx].color + '60');
      grad.addColorStop(1, nodes[toIdx].color + '60');

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Animate particles on edges
    particlesOnEdge.forEach(p => {
      p.progress += p.speed;
      if (p.progress > 1) p.progress = 0;

      const from = getPos(nodes[p.from]);
      const to = getPos(nodes[p.to]);
      const px = from.x + (to.x - from.x) * p.progress;
      const py = from.y + (to.y - from.y) * p.progress;
      const color = nodes[p.from].color;

      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Glow
      const glow = ctx.createRadialGradient(px, py, 0, px, py, 10);
      glow.addColorStop(0, color + 'aa');
      glow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(px, py, 10, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    });

    // Draw nodes
    nodes.forEach((node, i) => {
      const pos = getPos(node);
      const pulse = node.radius + Math.sin(t * 2 + i) * 3;

      // Outer glow
      const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, pulse * 2.5);
      glow.addColorStop(0, node.color + '40');
      glow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pulse * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Node circle
      const grad = ctx.createRadialGradient(pos.x - pulse * 0.3, pos.y - pulse * 0.3, 0, pos.x, pos.y, pulse);
      grad.addColorStop(0, node.color + 'ff');
      grad.addColorStop(0.6, node.color + 'cc');
      grad.addColorStop(1, node.color + '44');
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pulse, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Border
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pulse, 0, Math.PI * 2);
      ctx.strokeStyle = node.color + 'cc';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#f0f6fc';
      ctx.font = `${IS_MOBILE ? 10 : 11}px Inter, sans-serif`;
      ctx.fontWeight = '600';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Background pill for label
      const labelY = pos.y + pulse + 18;
      const textW = ctx.measureText(node.label).width + 16;
      ctx.fillStyle = 'rgba(13,17,23,0.85)';
      ctx.beginPath();
      ctx.roundRect(pos.x - textW / 2, labelY - 10, textW, 20, 5);
      ctx.fill();
      ctx.fillStyle = '#f0f6fc';
      ctx.fillText(node.label, pos.x, labelY);
    });

    t += 0.016;
    requestAnimationFrame(draw);
  }

  if (!REDUCED_MOTION) {
    draw();
  } else {
    // Static version for reduced motion
    draw();
  }
}

// ===================================================================
// PROCESS STEPS — CSS reveal handled by global observer
// ===================================================================
(function staggerProcessSteps() {
  const steps = document.querySelectorAll('.process-step');
  const observer = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) {
      steps.forEach((step, i) => {
        setTimeout(() => step.classList.add('visible'), i * 80);
      });
      observer.disconnect();
    }
  }, { threshold: 0.2 });

  const section = document.getElementById('process');
  if (section) observer.observe(section);
})();

// ===================================================================
// MAGNETIC BUTTONS (Desktop only)
// ===================================================================
(function initMagnetic() {
  if (IS_TOUCH || REDUCED_MOTION) return;

  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => { btn.style.transition = ''; }, 400);
    });
  });
})();

// ===================================================================
// SCROLL — Section fade & parallax
// ===================================================================
(function initScrollEffects() {
  if (REDUCED_MOTION) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Parallax grid bg
    const gridBg = document.querySelector('.hero-grid-bg');
    if (gridBg) {
      gridBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  }, { passive: true });
})();

// ===================================================================
// SMOOTH ANCHOR SCROLL
// ===================================================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===================================================================
// INTERSECTION OBSERVER — timeline items extra delay per item
// ===================================================================
(function staggerTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  items.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.15}s`;
  });
})();
