/* ===================================================================
   Arjun Rana — Arter CV Portfolio Script
   Sidebar, Navigation Scroll Spy, Portfolio Filters & Contact Form
   =================================================================== */

/* ── Preloader ─────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  document.getElementById('preloader')?.classList.add('done');
});

/* ── Arter Profile Sidebar Toggle (Mobile & Responsive) ─────────── */
const sidebar = document.getElementById('profile-sidebar');
const overlay = document.getElementById('sidebar-overlay');

function openSidebar() {
  sidebar?.classList.add('open');
  overlay?.classList.add('active');
  if (window.innerWidth <= 1080) {
    document.body.style.overflow = 'hidden';
  }
}

function closeSidebar() {
  sidebar?.classList.remove('open');
  overlay?.classList.remove('active');
  document.body.style.overflow = '';
}

function toggleSidebar() {
  if (sidebar?.classList.contains('open')) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

/* ── Mobile Top Navigation Menu ─────────────────────────────────── */
const menu = document.getElementById('sidemenu');

function openmenu() {
  if (menu) menu.classList.add('open');
}

function closemenu() {
  if (menu) menu.classList.remove('open');
}

document.querySelectorAll('#sidemenu a').forEach(a => {
  a.addEventListener('click', () => {
    closemenu();
    if (window.innerWidth <= 1080) {
      closeSidebar();
    }
  });
});

/* ── Scroll Spy Active Link Indicator ──────────────────────────── */
const navLinks = document.querySelectorAll('.nav-menu .nav-link');
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  let current = '';
  const scrollBottom = (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 50;

  if (scrollBottom) {
    current = 'contact';
  } else {
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 180 && rect.bottom >= 120) {
        current = section.getAttribute('id');
      }
    });
  }

  if (current) {
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
window.addEventListener('load', updateActiveNav);

/* ── Portfolio Category Filtering ──────────────────────────────── */
const filterTabs = document.querySelectorAll('.filter-tab');
const workCards = document.querySelectorAll('.work-list .work');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;

    workCards.forEach(card => {
      const categories = card.dataset.cat || '';
      if (filter === 'all' || categories.includes(filter)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ── Contact Form → Google Sheets ───────────────────────────────── */
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyDanjzL5W9wfoXg-QixhMNWHqXovLbfQzAOQLD8syzXeF2jAlDDA4Cyr7dNTDSbAJEag/exec';

const contactForm = document.querySelector('form[name="submit-to-google-sheet"]');
const formMsg = document.getElementById('msg');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;
    btn.innerHTML = '<span>Sending…</span> <i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;

    fetch(SHEET_URL, { method: 'POST', body: new FormData(contactForm) })
      .then(() => {
        formMsg.textContent = '✓ Message sent! I\'ll get back to you within 24 hours.';
        formMsg.style.color = '#ffc107';
        contactForm.reset();
      })
      .catch(() => {
        formMsg.textContent = 'Something went wrong. Please email me at rana.arjun62000@gmail.com';
        formMsg.style.color = '#f87171';
      })
      .finally(() => {
        btn.innerHTML = origText;
        btn.disabled = false;
        setTimeout(() => { formMsg.textContent = ''; }, 7000);
      });
  });
}
