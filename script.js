/* ===================================================================
   Arjun Rana — Portfolio Script
   Clean, no extra dependencies
   =================================================================== */

/* ── Preloader ─────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  document.getElementById('preloader')?.classList.add('done');
});

/* ── Mobile navigation ──────────────────────────────────────────── */
const menu = document.getElementById('sidemenu');
function openmenu() { if (menu) menu.style.right = '0'; }
function closemenu() { if (menu) menu.style.right = '-100%'; }
document.querySelectorAll('#sidemenu a').forEach(a => a.addEventListener('click', closemenu));

/* ── Navbar scroll glass effect ─────────────────────────────────── */
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav-scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ── Cursor glow ────────────────────────────────────────────────── */
const cursor = document.querySelector('.cursor-glow');
if (cursor && !('ontouchstart' in window)) {
  window.addEventListener('pointermove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  }, { passive: true });
} else if (cursor) {
  cursor.style.display = 'none';
}

/* ── Scroll reveal ──────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Tab system (Experience section) ────────────────────────────── */
function opentab(tabname, button) {
  document.querySelectorAll('.tab-links').forEach(t => t.classList.remove('active-link'));
  document.querySelectorAll('.tab-contents').forEach(t => t.classList.remove('active-tab'));
  button.classList.add('active-link');
  document.getElementById(tabname)?.classList.add('active-tab');
}

/* ── Technology Universe — click node to show info ──────────────── */
const techTitle = document.getElementById('tech-title');
const techInfo  = document.getElementById('tech-info');

document.querySelectorAll('.tech-node').forEach(node => {
  node.addEventListener('click', () => {
    document.querySelectorAll('.tech-node').forEach(n => n.classList.remove('active'));
    node.classList.add('active');
    if (techTitle) techTitle.textContent = node.dataset.title || '';
    if (techInfo)  techInfo.textContent  = node.dataset.info  || '';
  });
});

/* ── Contact form → Google Sheets ───────────────────────────────── */
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyDanjzL5W9wfoXg-QixhMNWHqXovLbfQzAOQLD8syzXeF2jAlDDA4Cyr7dNTDSbAJEag/exec';

const contactForm = document.querySelector('form[name="submit-to-google-sheet"]');
const formMsg     = document.getElementById('msg');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;
    btn.innerHTML = 'Sending…';
    btn.disabled  = true;

    fetch(SHEET_URL, { method: 'POST', body: new FormData(contactForm) })
      .then(() => {
        formMsg.textContent = '✓ Message sent! I\'ll get back to you soon.';
        formMsg.style.color = '#76d5a2';
        contactForm.reset();
      })
      .catch(() => {
        formMsg.textContent = 'Something went wrong. Email me at rana.arjun62001@gmail.com';
        formMsg.style.color = '#f87171';
      })
      .finally(() => {
        btn.innerHTML = origText;
        btn.disabled  = false;
        setTimeout(() => { formMsg.textContent = ''; }, 7000);
      });
  });
}

/* ── Three.js background particle field ─────────────────────────── */
(function initScene() {
  const canvas  = document.getElementById('scene');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small   = window.matchMedia('(max-width:800px)').matches;

  if (!window.THREE || !canvas || reduced) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !small });
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.25 : 1.7));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
  camera.position.z = 7;

  const group  = new THREE.Group();
  scene.add(group);

  const positions = [];
  const count = small ? 380 : 700;
  for (let i = 0; i < count; i++) {
    const r = 3.1 + Math.random() * 1.8;
    const a = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 4.5;
    positions.push(Math.cos(a) * r, y, Math.sin(a) * r);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  group.add(new THREE.Points(geo, new THREE.PointsMaterial({
    color: 0xb8ff3d,
    size: small ? 0.024 : 0.018,
    transparent: true,
    opacity: 0.48
  })));

  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize, { passive: true });
  resize();

  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += small ? 0.001 : 0.0016;
    renderer.render(scene, camera);
  }
  animate();
})();
