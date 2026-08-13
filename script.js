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

/* ── Dynamic Technology Universe Mindmap Lines ──────────────────── */
function drawMindmapConnections() {
  const container = document.getElementById('mindmap-container');
  const svg = document.getElementById('mindmap-svg');
  const coreHub = document.querySelector('.mm-core-hub');

  if (!container || !svg || !coreHub || window.innerWidth <= 1024) return;

  const cRect = container.getBoundingClientRect();
  const hubRect = coreHub.getBoundingClientRect();
  const hubX = hubRect.left + hubRect.width / 2 - cRect.left;
  const hubY = hubRect.top + hubRect.height / 2 - cRect.top;

  // Clear existing lines except defs
  const defs = svg.querySelector('defs');
  svg.innerHTML = '';
  if (defs) svg.appendChild(defs);

  const categories = document.querySelectorAll('.mm-node-cat');

  categories.forEach(cat => {
    const badge = cat.querySelector('.mm-cat-badge');
    if (!badge) return;

    const bRect = badge.getBoundingClientRect();
    const bx = bRect.left + bRect.width / 2 - cRect.left;
    const by = bRect.top + bRect.height / 2 - cRect.top;

    // Draw main branch from hub to category badge
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const midX = (hubX + bx) / 2;
    const d = `M ${hubX},${hubY} C ${midX},${hubY} ${midX},${by} ${bx},${by}`;

    path.setAttribute('d', d);
    path.setAttribute('stroke', 'rgba(163, 230, 53, 0.4)');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    path.setAttribute('filter', 'url(#glow-line)');
    svg.appendChild(path);

    // Connector dot at badge
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', bx);
    dot.setAttribute('cy', by);
    dot.setAttribute('r', '3');
    dot.setAttribute('fill', '#a3e635');
    svg.appendChild(dot);

    // Draw sub-branches from badge to sub-pills
    const pills = cat.querySelectorAll('.mm-pill');
    pills.forEach(pill => {
      const pRect = pill.getBoundingClientRect();
      const px = pRect.left + pRect.width / 2 - cRect.left;
      const py = pRect.top + pRect.height / 2 - cRect.top;

      const subPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      subPath.setAttribute('d', `M ${bx},${by} L ${px},${py}`);
      subPath.setAttribute('stroke', 'rgba(163, 230, 53, 0.25)');
      subPath.setAttribute('stroke-width', '1.5');
      subPath.setAttribute('stroke-dasharray', '3,3');
      subPath.setAttribute('fill', 'none');
      svg.appendChild(subPath);

      // Hover glow line effect
      pill.addEventListener('mouseenter', () => {
        subPath.setAttribute('stroke', '#a3e635');
        subPath.setAttribute('stroke-width', '2.5');
        path.setAttribute('stroke', '#a3e635');
        path.setAttribute('stroke-width', '3');
      });
      pill.addEventListener('mouseleave', () => {
        subPath.setAttribute('stroke', 'rgba(163, 230, 53, 0.25)');
        subPath.setAttribute('stroke-width', '1.5');
        path.setAttribute('stroke', 'rgba(163, 230, 53, 0.4)');
        path.setAttribute('stroke-width', '2');
      });
    });

    // Badge hover glow line effect
    badge.addEventListener('mouseenter', () => {
      path.setAttribute('stroke', '#a3e635');
      path.setAttribute('stroke-width', '3');
    });
    badge.addEventListener('mouseleave', () => {
      path.setAttribute('stroke', 'rgba(163, 230, 53, 0.4)');
      path.setAttribute('stroke-width', '2');
    });
  });
}

/* ── Dynamic AI Lab Context Connector Lines ────────────────────────── */
function drawAiLabContextLines() {
  const container = document.querySelector('.ai-pipeline-box');
  const apiCard = document.querySelector('.card-api');
  const aiModelCard = document.querySelector('.card-aimodel');
  const contextCard = document.querySelector('.context-card');
  const svg = document.querySelector('.context-connector-svg');

  if (!container || !apiCard || !aiModelCard || !contextCard || !svg) return;

  const boxRect = container.getBoundingClientRect();
  const apiRect = apiCard.getBoundingClientRect();
  const aiModelRect = aiModelCard.getBoundingClientRect();
  const ctxRect = contextCard.getBoundingClientRect();

  const apiX = (apiRect.left + apiRect.width / 2) - boxRect.left;
  const aimX = (aiModelRect.left + aiModelRect.width / 2) - boxRect.left;
  const ctxX = (ctxRect.left + ctxRect.width / 2) - boxRect.left;

  const svgH = 45;
  const bridgeY = 22;

  svg.setAttribute('viewBox', `0 0 ${boxRect.width} ${svgH}`);
  svg.innerHTML = `<path d="M ${apiX},0 V ${bridgeY} H ${aimX} V 0 M ${ctxX},${bridgeY} V ${svgH}" stroke="#a3e635" stroke-width="2" stroke-dasharray="5,5" fill="none" opacity="0.85"/>`;
}

/* ── Dynamic Section 07 Process Loop Connector Lines ────────── */
function drawProcessLoopLines() {
  const container = document.querySelector('.process-loop-container');
  const svg = document.querySelector('.process-loop-svg');
  const cards = document.querySelectorAll('.pr-card');

  if (!container || !svg || cards.length < 8 || window.innerWidth <= 768) return;

  const cRect = container.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${cRect.width} ${cRect.height}`);

  const cBoxes = Array.from(cards).map(card => {
    const r = card.getBoundingClientRect();
    const b = card.querySelector('.pr-badge');
    const bR = (b || card).getBoundingClientRect();
    return {
      left: r.left - cRect.left,
      right: r.right - cRect.left,
      centerY: (r.top + r.height / 2) - cRect.top,
      badgeX: (bR.left + bR.width / 2) - cRect.left,
      badgeY: (bR.top + bR.height / 2) - cRect.top
    };
  });

  const defs = `<defs>
    <marker id="loop-arrowhead" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#a3e635" />
    </marker>
  </defs>`;

  // Top row horizontal dashed line (01 -> 02 -> 03 -> 04)
  const topDash = `M ${cBoxes[0].badgeX},${cBoxes[0].badgeY} H ${cBoxes[3].badgeX}`;

  // Bottom row horizontal dashed line (05 -> 06 -> 07 -> 08)
  const bottomDash = `M ${cBoxes[4].badgeX},${cBoxes[4].badgeY} H ${cBoxes[7].badgeX}`;

  // Midpoint gap dots on dashed connector lines
  const topDot1 = (cBoxes[0].badgeX + cBoxes[1].badgeX) / 2;
  const topDot2 = (cBoxes[1].badgeX + cBoxes[2].badgeX) / 2;
  const topDot3 = (cBoxes[2].badgeX + cBoxes[3].badgeX) / 2;

  const btmDot1 = (cBoxes[4].badgeX + cBoxes[5].badgeX) / 2;
  const btmDot2 = (cBoxes[5].badgeX + cBoxes[6].badgeX) / 2;
  const btmDot3 = (cBoxes[6].badgeX + cBoxes[7].badgeX) / 2;

  const yTop = cBoxes[0].badgeY;
  const yBtm = cBoxes[4].badgeY;

  // Left C-curve: connects left edge of card 05 up to left edge of card 01 (points RIGHT into card 01)
  const leftX1 = cBoxes[0].left;
  const leftY1 = cBoxes[0].centerY;
  const leftX2 = cBoxes[4].left;
  const leftY2 = cBoxes[4].centerY;
  const leftArcCtrl = Math.min(leftX1, leftX2) - 42;

  const leftCurve = `M ${leftX2},${leftY2} C ${leftArcCtrl},${leftY2} ${leftArcCtrl},${leftY1} ${leftX1 - 3},${leftY1}`;

  // Right C-curve: connects right edge of card 04 down to right edge of card 08 (points LEFT into card 08)
  const rightX1 = cBoxes[3].right;
  const rightY1 = cBoxes[3].centerY;
  const rightX2 = cBoxes[7].right;
  const rightY2 = cBoxes[7].centerY;
  const rightArcCtrl = Math.max(rightX1, rightX2) + 42;

  const rightCurve = `M ${rightX1},${rightY1} C ${rightArcCtrl},${rightY1} ${rightArcCtrl},${rightY2} ${rightX2 + 3},${rightY2}`;

  svg.innerHTML = `${defs}
    <path d="${topDash}" stroke="#a3e635" stroke-width="2" stroke-dasharray="5,5" fill="none" opacity="0.65" />
    <path d="${bottomDash}" stroke="#a3e635" stroke-width="2" stroke-dasharray="5,5" fill="none" opacity="0.65" />
    
    <!-- Glowing green connector dots in center of gaps between cards -->
    <circle cx="${topDot1}" cy="${yTop}" r="4.5" fill="#a3e635" />
    <circle cx="${topDot2}" cy="${yTop}" r="4.5" fill="#a3e635" />
    <circle cx="${topDot3}" cy="${yTop}" r="4.5" fill="#a3e635" />
    <circle cx="${btmDot1}" cy="${yBtm}" r="4.5" fill="#a3e635" />
    <circle cx="${btmDot2}" cy="${yBtm}" r="4.5" fill="#a3e635" />
    <circle cx="${btmDot3}" cy="${yBtm}" r="4.5" fill="#a3e635" />

    <path d="${leftCurve}" stroke="#a3e635" stroke-width="2" fill="none" opacity="0.9" marker-end="url(#loop-arrowhead)" />
    <path d="${rightCurve}" stroke="#a3e635" stroke-width="2" fill="none" opacity="0.9" marker-end="url(#loop-arrowhead)" />
  `;
}

function updateAllDynamicLines() {
  drawMindmapConnections();
  drawAiLabContextLines();
  drawProcessLoopLines();
}

window.addEventListener('load', updateAllDynamicLines);
window.addEventListener('resize', updateAllDynamicLines);
document.addEventListener('DOMContentLoaded', updateAllDynamicLines);

/* ── Section 08: Interactive 3D Stack & Layer Synchronization ─────── */
const layerData = {
  1: { title: "01 PRESENTATION", tech: "Flutter · Dart · Custom Widgets · Responsive UI" },
  2: { title: "02 STATE MANAGEMENT", tech: "BLoC · Riverpod · Provider · GetX" },
  3: { title: "03 DOMAIN & LOGIC", tech: "Business Logic · Use Cases · Entities" },
  4: { title: "04 DATA LAYER", tech: "Repository · REST APIs · Local Storage · SQLite" },
  5: { title: "05 SERVICES & BACKEND", tech: "REST · Firebase · Supabase · Spring Boot · Node.js" },
  6: { title: "06 INTELLIGENCE & REALTIME", tech: "AI APIs · LLMs · TFLite · WebSockets · STOMP" }
};

function initArchitectureInteractivity() {
  const plates = document.querySelectorAll('.stack-plate');
  const cards = document.querySelectorAll('.arch-card');
  const inspTitle = document.getElementById('inspTitle');
  const inspTech = document.getElementById('inspTech');
  const container = document.getElementById('arch3dContainer');
  const svg = document.querySelector('.arch-stack-svg');

  if (!plates.length || !cards.length) return;

  function setActiveLayer(layerNum) {
    plates.forEach(p => p.classList.toggle('active-plate', p.dataset.layer === String(layerNum)));
    cards.forEach(c => c.classList.toggle('active-layer', c.dataset.layer === String(layerNum)));

    if (layerData[layerNum] && inspTitle && inspTech) {
      inspTitle.textContent = layerData[layerNum].title;
      inspTech.textContent = layerData[layerNum].tech;
    }
  }

  plates.forEach(plate => {
    plate.addEventListener('mouseenter', () => {
      setActiveLayer(plate.dataset.layer);
    });
  });

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      setActiveLayer(card.dataset.layer);
    });
  });

  if (container && svg) {
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 16;
      const rotateY = (x / rect.width) * 16;
      svg.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
    });

    container.addEventListener('mouseleave', () => {
      svg.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }
}

document.addEventListener('DOMContentLoaded', initArchitectureInteractivity);
window.addEventListener('load', initArchitectureInteractivity);


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
