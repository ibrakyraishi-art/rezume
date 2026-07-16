/* ============================================================
   ИБРАГИМ КУРАЙШИ — RESUME SITE / effects
   ============================================================ */

(function () {
  'use strict';

  /* ---------- ПРЕЛОАДЕР ---------- */
  const preloader = document.getElementById('preloader');
  const countEl = document.getElementById('preloader-count');
  const barEl = document.getElementById('preloader-bar');
  const PRELOAD_MS = 1300;

  let start = null;
  function tickPreloader(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / PRELOAD_MS, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(eased * 100);
    countEl.textContent = val;
    barEl.style.width = val + '%';
    if (p < 1) {
      requestAnimationFrame(tickPreloader);
    } else {
      setTimeout(() => {
        preloader.classList.add('done');
        setTimeout(() => preloader.remove(), 800);
      }, 150);
    }
  }
  requestAnimationFrame(tickPreloader);

  /* ---------- ПРОГРЕСС ЧТЕНИЯ ---------- */
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }, { passive: true });

  /* ---------- КАСТОМНЫЙ КУРСОР ---------- */
  const cursor = document.getElementById('cursor');
  let cx = -100, cy = -100, tx = -100, ty = -100;
  document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
  (function moveCursor() {
    cx += (tx - cx) * 0.2;
    cy += (ty - cy) * 0.2;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(moveCursor);
  })();
  document.querySelectorAll('a, button, .stat, .result, .contact').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
  });

  /* ---------- ТОЧКИ НАВЫКОВ ---------- */
  document.querySelectorAll('.dots').forEach((el) => {
    const n = parseInt(el.dataset.dots, 10) || 0;
    for (let i = 0; i < 5; i++) {
      const dot = document.createElement('i');
      if (i < n) dot.classList.add('fill');
      el.appendChild(dot);
    }
  });

  /* ---------- SCRAMBLE-ЗАГОЛОВКИ ---------- */
  const SCRAMBLE_CHARS = '#%&@$0123456789ABCDEF';
  function scramble(el) {
    const original = el.dataset.original || el.textContent;
    el.dataset.original = original;
    let frame = 0;
    const total = Math.max(original.length * 2, 20);
    function step() {
      frame++;
      const progress = frame / total;
      let out = '';
      for (let i = 0; i < original.length; i++) {
        if (original[i] === ' ') { out += ' '; continue; }
        if (i / original.length < progress) {
          out += original[i];
        } else {
          out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      el.textContent = out;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = original;
    }
    requestAnimationFrame(step);
  }

  /* ---------- СЧЁТЧИКИ ---------- */
  function countUp(el) {
    const target = parseInt(el.dataset.count, 10);
    const dur = 1600;
    let t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- REVEAL ПРИ СКРОЛЛЕ ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('visible');
      el.querySelectorAll('.count').forEach(countUp);
      if (el.classList.contains('count')) countUp(el);
      const title = el.querySelector('[data-scramble]');
      if (title) scramble(title);
      if (el.id === 'dash-line' || el.querySelector('#dash-line')) {
        document.getElementById('dash-line').classList.add('draw');
      }
      io.unobserve(el);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* ---------- LIVE KPI (лёгкая пульсация цифр) ---------- */
  function jitter(id, base, spread, suffixInt) {
    const el = document.getElementById(id);
    if (!el) return;
    setInterval(() => {
      const v = base + Math.round((Math.random() - 0.5) * spread);
      el.textContent = suffixInt ? v : v;
    }, 2200 + Math.random() * 800);
  }
  jitter('kpi-roas', 142, 10, true);
  jitter('kpi-cpa', 318, 24, true);
  jitter('kpi-fraud', 96, 3, true);

  /* ---------- HALFTONE-ФОТО ---------- */
  const canvas = document.getElementById('halftone');
  const photo = document.getElementById('photo-real');
  const box = document.getElementById('photo-box');
  const ctx = canvas.getContext('2d');

  function renderHalftone(source) {
    const rect = box.getBoundingClientRect();
    const W = Math.max(rect.width, 300);
    const H = Math.max(rect.height, 375);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // отрисовать источник в offscreen для сэмплирования
    const off = document.createElement('canvas');
    const cell = 7;
    const cols = Math.ceil(W / cell);
    const rows = Math.ceil(H / cell);
    off.width = cols;
    off.height = rows;
    const octx = off.getContext('2d');

    if (source) {
      // cover-кадрирование
      const sr = source.naturalWidth / source.naturalHeight;
      const tr = W / H;
      let sw, sh, sx, sy;
      if (sr > tr) { sh = source.naturalHeight; sw = sh * tr; sx = (source.naturalWidth - sw) / 2; sy = 0; }
      else { sw = source.naturalWidth; sh = sw / tr; sx = 0; sy = (source.naturalHeight - sh) * 0.25; }
      octx.drawImage(source, sx, sy, sw, sh, 0, 0, cols, rows);
    } else {
      // процедурная заглушка: диагональный градиент + «портретное» пятно
      const g = octx.createLinearGradient(0, 0, cols, rows);
      g.addColorStop(0, '#666');
      g.addColorStop(1, '#ddd');
      octx.fillStyle = g;
      octx.fillRect(0, 0, cols, rows);
      const rg = octx.createRadialGradient(cols / 2, rows * 0.42, 4, cols / 2, rows * 0.45, rows * 0.55);
      rg.addColorStop(0, '#222');
      rg.addColorStop(1, 'rgba(34,34,34,0)');
      octx.fillStyle = rg;
      octx.fillRect(0, 0, cols, rows);
    }

    const data = octx.getImageData(0, 0, cols, rows).data;
    const dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = (y * cols + x) * 4;
        const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
        const r = (1 - lum) * cell * 0.62;
        if (r > 0.4) dots.push({ x: x * cell + cell / 2, y: y * cell + cell / 2, r, t: (y / rows) + Math.random() * 0.25 });
      }
    }

    // анимация сборки из точек
    let t0 = null;
    const DUR = 1400;
    function draw(ts) {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / DUR, 1);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#111111';
      for (const d of dots) {
        const local = Math.min(Math.max((p * 1.25 - d.t) / 0.25, 0), 1);
        if (local <= 0) continue;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * local, 0, Math.PI * 2);
        ctx.fill();
      }
      if (p < 1) requestAnimationFrame(draw);
    }

    const hio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          requestAnimationFrame(draw);
          hio.disconnect();
        }
      });
    }, { threshold: 0.25 });
    hio.observe(box);
  }

  if (photo.complete && photo.naturalWidth > 0) {
    photo.classList.add('loaded');
    canvas.classList.add('has-photo');
    renderHalftone(photo);
  } else {
    photo.addEventListener('load', () => {
      photo.classList.add('loaded');
      canvas.classList.add('has-photo');
      renderHalftone(photo);
    });
    photo.addEventListener('error', () => {
      photo.style.display = 'none';
      renderHalftone(null);
    });
  }
})();
