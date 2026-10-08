(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  $('#year').textContent = new Date().getFullYear();

  /* Mobile-Menü */
  var toggle = $('.nav__toggle'), menu = $('#menu');
  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  $$('a', menu).forEach(function (a) {
    a.addEventListener('click', function () { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', false); });
  });

  /* Funkeln im Hero */
  var sp = $('.sparkles');
  for (var i = 0; i < 26; i++) {
    var d = document.createElement('i');
    d.style.left = Math.random() * 100 + '%';
    d.style.top = Math.random() * 80 + '%';
    d.style.animationDelay = (Math.random() * 3.6).toFixed(2) + 's';
    d.style.animationDuration = (2.6 + Math.random() * 2.4).toFixed(2) + 's';
    sp.appendChild(d);
  }

  /* Einblenden beim Scrollen */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: .12 });
    reveals.forEach(function (el, idx) {
      el.style.transitionDelay = (idx % 4) * 90 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* Klick aufs Logo: Auto fährt eine Extra-Runde */
  var heroCar = $('#heroCar');
  $('#logoBtn').addEventListener('click', function () {
    if (reduce) return;
    heroCar.style.animation = 'none';
    void heroCar.offsetWidth;
    heroCar.style.animation = 'drive 4s cubic-bezier(.45,.05,.55,.95) 1';
    heroCar.addEventListener('animationend', function back() {
      heroCar.removeEventListener('animationend', back);
      heroCar.style.animation = '';
    });
  });

  /* Scroll-Effekte: drehende Felge, Auto auf der Straße */
  var bgrim = $('#bgrim');
  var road = $('#scrollRoad'), roadCar = $('#scrollCar'), roadLine = $('#scrollLine');
  var wheels = $$('.wheel', roadCar);
  var ticking = false;

  function update() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight;

    bgrim.style.transform = 'rotate(' + (y * 0.25) + 'deg)';

    var r = road.getBoundingClientRect();
    var p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    var carW = roadCar.offsetWidth;
    var x = -carW + p * (r.width + carW * 2);
    roadCar.style.transform = 'translateX(' + x.toFixed(1) + 'px)';
    var rot = (x * 1.6) % 360;
    wheels.forEach(function (w) { w.style.setProperty('--rot', rot + 'deg'); });
    roadLine.style.backgroundPositionX = (-x * 0.6) + 'px';
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  if (!reduce) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  } else {
    roadCar.style.transform = 'translateX(30vw)';
  }

  /* Vorher/Nachher-Regler */
  var ba = $('#ba'), range = $('.ba__range', ba);
  range.addEventListener('input', function () { ba.style.setProperty('--pos', range.value + '%'); });

  /* Zahlen hochzählen */
  var counters = $$('[data-count]');
  if (!reduce && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        var el = e.target, end = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10), t0 = performance.now();
        (function tick(t) {
          var k = Math.min(1, (t - t0) / 1400), v = end * (1 - Math.pow(1 - k, 3));
          el.textContent = v.toFixed(dec).replace('.', ',');
          if (k < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: .6 });
    counters.forEach(function (c) { co.observe(c); });
  }
})();
