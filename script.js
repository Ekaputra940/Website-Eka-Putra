/* ═══════════════════════════════════════════════════════
   script.js — Scientific Notation Scanner
   Handles: logic, animations, DOM interactions
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ─── DOM References ─────────────────────────────────── */
const inputEl      = document.getElementById('main-input');
const runBtn       = document.getElementById('run-btn');
const verdictEl    = document.getElementById('verdict');
const badgeEl      = document.getElementById('result-badge');
const subEl        = document.getElementById('result-sub');
const inputRow     = document.getElementById('input-row');
const mainCard     = document.getElementById('main-card');
const siteHeader   = document.getElementById('site-header');
const siteFooter   = document.querySelector('.site-footer');
const logoBrand    = document.getElementById('logo-brand');
const aboutModal   = document.getElementById('about-modal');

/* ─── Page Load Animations ───────────────────────────── */
function initPageAnimations() {
  // Staggered entrance: header → card → footer
  const elements = [
    { el: siteHeader,  delay: 80  },
    { el: mainCard,    delay: 200 },
    { el: siteFooter,  delay: 340 },
  ];

  elements.forEach(({ el, delay }) => {
    setTimeout(() => {
      el.style.animation = 'fadeUp .55s cubic-bezier(.22,1,.36,1) forwards';
    }, delay);
  });

  // Stagger example chips entrance
  setTimeout(() => {
    const chips = document.querySelectorAll('.chip');
    chips.forEach((chip, i) => {
      chip.style.opacity = '0';
      chip.style.transform = 'translateY(8px)';
      setTimeout(() => {
        chip.style.transition = 'opacity .3s ease, transform .3s ease';
        chip.style.opacity = '1';
        chip.style.transform = 'translateY(0)';
      }, 400 + i * 45);
    });
  }, 300);
}

/* ─── Core Logic ─────────────────────────────────────── */
function isScientificNotation(str) {
  const s = str.trim().replace(/\s/g, '');
  // Support: 3.5e4, -5.3E-4, 3x10^2, 3X10^-9
  if (/^-?[1-9](\.\d+)?[xX]10\^[+-]?\d+$/.test(s)) return true;
  return /^-?[1-9](\.\d+)?[eE][+-]?\d+$/.test(s);
}

function formatDecimal(str) {
  const s = str.trim().replace(/\s/g, '');
  const normalized = s.replace(/[xX]10\^/, 'e');
  const num = parseFloat(normalized);
  if (isNaN(num)) return null;
  return num.toLocaleString('id-ID');
}

function getSuggestion(str) {
  const num = parseFloat(str.trim());
  if (isNaN(num)) return 'Input tidak dikenali';
  return 'Saran: ' + num.toExponential().replace('e+', 'e');
}

/* ─── Animation Helpers ──────────────────────────────── */
function triggerAnim(el, className) {
  el.classList.remove(className);
  void el.offsetWidth; // reflow to restart
  el.classList.add(className);
  el.addEventListener('animationend', () => {
    el.classList.remove(className);
  }, { once: true });
}

function animateVerdictIn() {
  triggerAnim(verdictEl, 'anim-pop');
}

function animateInvalidShake() {
  triggerAnim(inputRow, 'anim-shake');
}

function animateRunBtnPulse() {
  triggerAnim(runBtn, 'anim-pulse');
}

/* ─── Result Renderer ────────────────────────────────── */
function renderResult(raw) {
  if (!raw) {
    verdictEl.textContent = '?';
    verdictEl.className = 'verdict';
    badgeEl.textContent = 'Menunggu input...';
    badgeEl.className = 'result-badge';
    subEl.textContent = '';
    return;
  }

  const ok = isScientificNotation(raw);

  // Update verdict
  verdictEl.textContent = ok ? 'YES' : 'NO';
  verdictEl.className = 'verdict ' + (ok ? 'is-yes' : 'is-no');
  animateVerdictIn();

  // Update badge
  badgeEl.textContent = ok ? '✓  Scientific Notation' : '✗  Bukan Notasi Ilmiah';
  badgeEl.className = 'result-badge ' + (ok ? 'is-yes' : 'is-no');

  // Update sub info
  if (ok) {
    const dec = formatDecimal(raw);
    subEl.textContent = dec ? '= ' + dec : '';
  } else {
    subEl.textContent = getSuggestion(raw);
    animateInvalidShake();
  }

  animateRunBtnPulse();

  // Tampilkan modal about project setelah hasil keluar
  setTimeout(() => {
    openAboutModal();
  }, 500);
}

/* ─── Main Scanner Function ──────────────────────────── */
function runScanner() {
  const raw = inputEl.value.trim();
  renderResult(raw);
}

/* ─── Example Chips ──────────────────────────────────── */
function tryExample(value) {
  inputEl.value = value;

  // Brief highlight animation on input
  inputEl.style.transition = 'background .15s';
  inputEl.style.background = 'rgba(26, 188, 156, .08)';
  setTimeout(() => { inputEl.style.background = 'transparent'; }, 300);

  runScanner();
  inputEl.focus();
}

/* ─── Keyboard Support ───────────────────────────────── */
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    runScanner();
  }
  // Clear result on new typing
  if (e.key.length === 1 || e.key === 'Backspace') {
    if (verdictEl.textContent !== '?') {
      verdictEl.className = 'verdict';
      verdictEl.textContent = '?';
      badgeEl.textContent = 'Menunggu input...';
      badgeEl.className = 'result-badge';
      subEl.textContent = '';
    }
  }
});

/* ─── Init ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initPageAnimations();

  // Event listener untuk logo brand (buka modal)
  logoBrand.addEventListener('click', openAboutModal);
});

/* ─── Modal Functions ────────────────────────────────── */
function openAboutModal() {
  aboutModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeAboutModal() {
  aboutModal.classList.remove('show');
  document.body.style.overflow = 'auto';
}

// Tutup modal saat klik di luar
document.addEventListener('click', (e) => {
  if (e.target.id === 'about-modal') {
    closeAboutModal();
  }
});

// Tutup modal dengan tombol Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && aboutModal.classList.contains('show')) {
    closeAboutModal();
  }
});