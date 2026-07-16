/* ============================================================
   ИБРАГИМ КУРАЙШИ — RESUME SITE / поведение по дизайн-макету
   ============================================================ */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- ХЕДЕР: снять обрезку строк после анимации букв ---------- */
  var heroName = document.querySelector('.hero__name');
  if (heroName) {
    setTimeout(function () { heroName.classList.add('settled'); }, reduceMotion ? 0 : 2400);
  }

  /* ---------- ТОЧКИ НАВЫКОВ ---------- */
  document.querySelectorAll('.dots').forEach(function (el) {
    var level = parseInt(el.getAttribute('data-level'), 10) || 0;
    for (var i = 0; i < 5; i++) {
      var dot = document.createElement('i');
      if (i < level) dot.className = 'on';
      el.appendChild(dot);
    }
  });

  /* ---------- ФОТО: fallback, если файла нет ---------- */
  var photo = document.getElementById('photo-real');
  if (photo) {
    var showFallback = function () {
      photo.style.display = 'none';
      var fb = photo.parentElement.querySelector('.photo__fallback');
      if (fb) fb.hidden = false;
    };
    if (photo.complete && photo.naturalWidth === 0) showFallback();
    photo.addEventListener('error', showFallback);
  }

  /* ---------- СЧЁТЧИКИ (ease-out cubic, 1.4s) ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    var DUR = 1400;
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / DUR, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counted = false;
  function fireCounters() {
    if (counted) return;
    counted = true;
    document.querySelectorAll('.count').forEach(countUp);
  }

  if ('IntersectionObserver' in window) {
    var statsEl = document.querySelector('.stats');
    if (statsEl) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { fireCounters(); cio.disconnect(); }
        });
      }, { threshold: 0.4 });
      cio.observe(statsEl);
    }
  } else {
    fireCounters();
  }

  /* ---------- SCROLL-REVEAL (+ fallback) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  function revealByScroll() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    revealEls.forEach(function (el) {
      if (el.classList.contains('visible')) return;
      if (el.getBoundingClientRect().top < vh - 20) el.classList.add('visible');
    });
  }

  if ('IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          rio.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(function (el) { rio.observe(el); });
    // страховка: не блокировать контент, если observer не сработал
    window.addEventListener('scroll', revealByScroll, { passive: true });
    setTimeout(revealByScroll, 400);
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- МАГНИТНАЯ КНОПКА PDF ---------- */
  var btn = document.getElementById('btn-pdf');
  if (btn && !reduceMotion) {
    btn.addEventListener('mousemove', function (e) {
      var r = btn.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = 'translate(' + dx * 0.12 + 'px, ' + dy * 0.25 + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  }
})();
