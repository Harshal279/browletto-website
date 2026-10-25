(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile menu ---------- */
  var t = document.getElementById('menuToggle'), n = document.getElementById('mainNav');
  t.addEventListener('click', function () {
    var open = n.classList.toggle('open');
    t.setAttribute('aria-expanded', open);
  });
  n.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { n.classList.remove('open'); t.setAttribute('aria-expanded', false); }
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Full menu card: page tabs ---------- */
  var tabs = document.querySelectorAll('.card-tab');
  if (tabs.length) {
    var openFull = document.getElementById('openFull');
    tabs.forEach(function (tb) {
      tb.addEventListener('click', function () {
        tabs.forEach(function (o) {
          var on = o === tb;
          o.classList.toggle('is-on', on);
          o.setAttribute('aria-selected', on ? 'true' : 'false');
          document.getElementById(o.getAttribute('data-pane')).classList.toggle('is-on', on);
        });
        var link = document.querySelector('#' + tb.getAttribute('data-pane') + ' a');
        if (openFull && link) { openFull.href = link.href; }
      });
    });
  }

  /* ---------- Outlined food stickers on the cream backgrounds ---------- */
  var ICONS = {
    shake: '<path d="M17 26 L21 56 Q21.4 58.5 24 58.5 H40 Q42.6 58.5 43 56 L47 26"/><path d="M14 26 H50"/><path d="M17 26 Q16 17 24 17 Q26 10 32 12 Q38 8 41 15 Q49 14 47 26"/><path d="M34 12 L40 3 H46"/><path d="M20 38 H44"/><circle cx="27" cy="46" r="2"/><circle cx="36" cy="49" r="2.4"/><circle cx="39" cy="43" r="1.6"/>',
    waffle: '<rect x="9" y="9" width="46" height="46" rx="9"/><path d="M24.3 9 V55 M39.6 9 V55 M9 24.3 H55 M9 39.6 H55"/><rect x="28" y="28" width="8" height="8" rx="1.5"/>',
    coffee: '<path d="M10 26 H42 V40 Q42 52 30 52 H22 Q10 52 10 40 Z"/><path d="M42 30 H46 Q54 30 54 37 Q54 44 45 44"/><path d="M6 58 H48"/><path d="M20 8 Q15 12 20 16 Q25 20 20 23"/><path d="M30 8 Q25 12 30 16 Q35 20 30 23"/>',
    icecream: '<path d="M18 30 A14 14 0 1 1 46 30"/><path d="M15 30 H49 Q49 36 43 36 H21 Q15 36 15 30"/><path d="M20 36 L32 61 L44 36"/><path d="M24 41 L36 49 M40 41 L28 50"/><circle cx="26" cy="20" r="1.8"/><circle cx="36" cy="16" r="1.8"/>',
    brownie: '<path d="M10 24 Q10 17 17 17 H47 Q54 17 54 24 V50 H10 Z"/><path d="M10 24 H54"/><path d="M20 24 V32 Q20 35 23 35 Q26 35 26 32 V24 M36 24 V38 Q36 41 39 41 Q42 41 42 38 V24"/><circle cx="18" cy="43" r="1.8"/><circle cx="30" cy="46" r="1.8"/><circle cx="46" cy="44" r="1.8"/>',
    pancakes: '<ellipse cx="32" cy="22" rx="21" ry="7"/><path d="M11 22 V30 Q11 37 32 37 Q53 37 53 30 V22"/><path d="M11 30 V38 Q11 45 32 45 Q53 45 53 38 V30"/><path d="M11 38 V46 Q11 53 32 53 Q53 53 53 46 V38"/><path d="M20 24 V31 Q20 33.5 22.5 33.5 Q25 33.5 25 31 V25"/><circle cx="32" cy="12" r="3.2"/><path d="M32 8.8 Q34 5 38 5"/>',
    mug: '<path d="M12 26 H44 V44 Q44 56 32 56 H24 Q12 56 12 44 Z"/><path d="M44 30 H48 Q56 30 56 38 Q56 46 46 46"/><path d="M16 26 Q16 18 23 20 Q27 15 33 19 Q40 17 40 26"/><path d="M22 7 Q18 11 22 14 M32 5 Q28 9 32 12"/>',
    cookie: '<circle cx="32" cy="32" r="23"/><circle cx="32" cy="32" r="16"/><path d="M32 22 V26 M32 38 V42 M22 32 H26 M38 32 H42 M25 25 L27.5 27.5 M36.5 36.5 L39 39 M39 25 L36.5 27.5 M27.5 36.5 L25 39"/>',
    kitkat: '<path d="M6 24 L12 20 H52 L58 24 V40 L52 44 H12 L6 40 Z"/><path d="M22 20 V44 M32 20 V44 M42 20 V44"/>',
    sparkle: '<path d="M32 6 Q34 30 58 32 Q34 34 32 58 Q30 34 6 32 Q30 30 32 6 Z"/>'
  };
  var ICON_ORDER = ['shake', 'waffle', 'icecream', 'coffee', 'shake', 'brownie', 'pancakes', 'icecream', 'mug', 'cookie', 'waffle', 'kitkat', 'sparkle', 'coffee'];
  document.body.insertAdjacentHTML('afterbegin', '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' +
    Object.keys(ICONS).map(function (k) { return '<symbol id="ic-' + k + '" viewBox="0 0 64 64">' + ICONS[k] + '</symbol>'; }).join('') + '</defs></svg>');

  document.querySelectorAll('#menu, .about, #outlets, .dishes, .visit').forEach(function (host, hi) {
    host.classList.add('has-stickers');
    var layer = document.createElement('div');
    layer.className = 'stickers';
    layer.setAttribute('aria-hidden', 'true');
    host.insertBefore(layer, host.firstChild);

    var lastW = 0, lastH = 0;
    function place() {
      var W = host.clientWidth, H = host.clientHeight;
      if (!W || !H || (Math.abs(W - lastW) < 2 && Math.abs(H - lastH) < 40)) { return; }
      lastW = W; lastH = H;
      var small = W < 700;
      var rowH = small ? 240 : 200;
      var rows = Math.max(2, Math.round(H / rowH));
      var r = rng(hi * 131 + 7);
      var html = '', k = hi * 3;
      for (var row = 0; row < rows; row++) {
        for (var c = 0; c < (small ? 1 : 2); c++) {
          var size = (small ? 40 : 54) + r() * (small ? 26 : 40);
          var left;
          if (small || r() < 0.25) { left = r() * (W - size); }
          else if (c === 0) { left = r() * Math.max(W * 0.15 - size, 4); }
          else { left = W - size - r() * Math.max(W * 0.15 - size, 4); }
          var top = Math.min(row * rowH + r() * Math.max(rowH - size, 10), H - size);
          var rot = (r() * 50 - 25).toFixed(0);
          var name = ICON_ORDER[k++ % ICON_ORDER.length];
          html += '<svg class="sticker" viewBox="0 0 64 64" style="left:' + left.toFixed(0) + 'px;top:' + top.toFixed(0) + 'px;width:' + size.toFixed(0) + 'px;height:' + size.toFixed(0) + 'px;transform:rotate(' + rot + 'deg)"><use href="#ic-' + name + '"/></svg>';
        }
      }
      layer.innerHTML = html;
    }
    place();
    var t2;
    var again = function () { clearTimeout(t2); t2 = setTimeout(place, 150); };
    window.addEventListener('resize', again);
    window.addEventListener('load', again);
    if ('ResizeObserver' in window) { new ResizeObserver(again).observe(host); }
  });

  /* ---------- Brownie and shake illustrations ---------- */
  document.querySelectorAll('[data-deco]').forEach(function (el) {
    var tpl = document.getElementById('tpl-' + el.getAttribute('data-deco'));
    if (tpl) { el.appendChild(tpl.content.cloneNode(true)); }
  });

  /* ---------- Chocolate drips (header and dark sections) ---------- */
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var x = Math.imul(seed ^ seed >>> 15, 1 | seed);
      x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x;
      return ((x ^ x >>> 14) >>> 0) / 4294967296;
    };
  }

  function buildDrips(el, idx) {
    el.innerHTML = '';
    var w = el.clientWidth || window.innerWidth;
    var max = parseFloat(el.getAttribute('data-max')) || 46;
    var step = w < 560 ? 44 : 62;
    var r = rng(idx * 97 + 13);
    for (var x = -10; x < w; x += step) {
      var d = document.createElement('i');
      d.className = 'dr';
      var h = 10 + r() * (max - 10);
      if (r() < 0.28) { h = max * (0.85 + r() * 0.15); }
      d.style.left = (x + r() * step * 0.7).toFixed(0) + 'px';
      d.style.setProperty('--w', (8 + r() * 8).toFixed(0) + 'px');
      d.style.setProperty('--h', h.toFixed(0) + 'px');
      d.style.setProperty('--t', (2.6 + r() * 2.4).toFixed(1) + 's');
      d.style.setProperty('--dl', (-r() * 4).toFixed(1) + 's');
      if (r() < 0.45) {
        var b = document.createElement('b');
        b.className = 'drop';
        b.style.setProperty('--dd', (-r() * 4).toFixed(1) + 's');
        d.appendChild(b);
      }
      el.appendChild(d);
    }
  }

  var dripBoxes = document.querySelectorAll('.drips');
  function buildAllDrips() {
    dripBoxes.forEach(function (el, i) { buildDrips(el, i + 1); });
  }
  buildAllDrips();

  /* ---------- Scroll progress, header shadow, hero parallax ---------- */
  var header = document.querySelector('.site-header');
  var bar = document.querySelector('.progress');
  var heroImg = document.querySelector('.hero .ph');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(y / max, 1) : 0;
    bar.style.transform = 'scaleX(' + p + ')';
    header.classList.toggle('scrolled', y > 10);
    if (!reduce && heroImg && y < 900 && window.innerWidth > 820) {
      heroImg.style.translate = '0 ' + (y * 0.08).toFixed(1) + 'px';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      buildAllDrips();
    }, 200);
  });

  if (reduce || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.deco').forEach(function (el) { el.classList.add('in'); });
    return;
  }

  /* ---------- Scroll reveal ---------- */
  /* [selector, animation, stagger step in seconds] */
  var targets = [
    ['.hero-copy > *', 'reveal-up', 0.1],
    ['.hero-visual', 'reveal-right', 0],
    ['.cat-hero .wrap > *', 'reveal-up', 0.08],
    ['.deco', 'reveal-zoom', 0],
    ['.fact', 'reveal-up', 0.08],
    ['.section-head', 'reveal-up', 0],
    ['.about-grid > .ph', 'reveal-left', 0],
    ['.about-copy > *', 'reveal-up', 0.08],
    ['.card', 'reveal-up', 0.08],
    ['.family-title', 'reveal-up', 0],
    ['.cat-card', 'reveal-up', 0.05],
    ['.card-viewer', 'reveal-up', 0],
    ['.menu-cta', 'reveal-up', 0],
    ['.why-item', 'reveal-up', 0.09],
    ['.outlet-card', 'reveal-up', 0.1],
    ['.chip', 'reveal-up', 0.05],
    ['.info-block', 'reveal-up', 0.08],
    ['.visit > .wrap > .ph', 'reveal-right', 0],
    ['.dish-sub', 'reveal-up', 0],
    ['.dish', 'reveal-up', 0.03],
    ['.dish-note', 'reveal-up', 0],
    ['.cat-nav a', 'reveal-up', 0.1],
    ['.cat-actions', 'reveal-up', 0],
    ['.footer-grid > div', 'reveal-up', 0.08]
  ];

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) { return; }
      var el = e.target;
      el.classList.add('in');
      io.unobserve(el);
      var d = parseFloat(el.style.getPropertyValue('--d')) || 0;
      setTimeout(function () { el.classList.add('done'); }, (d + 0.8) * 1000);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  targets.forEach(function (item) {
    var counts = new WeakMap();
    document.querySelectorAll(item[0]).forEach(function (el) {
      var parent = el.parentNode;
      var i = counts.get(parent) || 0;
      counts.set(parent, i + 1);
      el.classList.add('reveal');
      if (item[1] === 'reveal-left' || item[1] === 'reveal-right' || item[1] === 'reveal-zoom') {
        el.classList.add(item[1]);
      }
      el.style.setProperty('--d', (Math.min(i, 8) * item[2]).toFixed(2) + 's');
      io.observe(el);
    });
  });

  /* ---------- Count-up numbers ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var countIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) { return; }
      countIO.unobserve(e.target);
      var el = e.target;
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var start = null, dur = 1300;
      function step(ts) {
        if (start === null) { start = ts; }
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
        if (p < 1) { requestAnimationFrame(step); }
      }
      el.textContent = '0';
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  counters.forEach(function (c) { countIO.observe(c); });

  /* ---------- Highlight the nav link of the section in view ---------- */
  var links = {};
  document.querySelectorAll('.nav a[href^="#"]').forEach(function (a) { links[a.getAttribute('href')] = a; });
  var navIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) { return; }
      Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
      var a = links['#' + e.target.id];
      if (a) { a.classList.add('active'); }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  ['menu', 'about', 'outlets', 'franchise', 'visit'].forEach(function (id) {
    var s = document.getElementById(id);
    if (s) { navIO.observe(s); }
  });
})();


/* Respect reduced-motion: do not autoplay the about video */
(function () {
  var v = document.querySelector('.about-video video');
  if (v && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    v.removeAttribute('autoplay'); v.pause(); v.setAttribute('controls', '');
  }
})();
