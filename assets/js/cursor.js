/* ==========================================================
   Hiệu ứng con trỏ & chuyển động
   - Nút hút nam châm, thẻ nghiêng 3D, bông sáng rơi, hạt nổ khi bấm
   ========================================================== */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Bông sáng rơi ---------- */
  (function sparkles() {
    if (reduce) return;
    var box = document.getElementById('sparkles');
    if (!box) return;
    var glyphs = ['✦', '❅', '✧', '·'];
    var n = window.innerWidth < 700 ? 5 : 9;
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.className = 'sparkle';
      s.textContent = glyphs[i % glyphs.length];
      s.style.left = (Math.random() * 100).toFixed(1) + '%';
      s.style.setProperty('--s', (9 + Math.random() * 10).toFixed(0) + 'px');
      s.style.setProperty('--t', (11 + Math.random() * 12).toFixed(1) + 's');
      s.style.setProperty('--dl', (-Math.random() * 20).toFixed(1) + 's');
      box.appendChild(s);
    }
  })();

  if (!finePointer || reduce) return;

  /* ---------- Hạt nổ khi bấm ---------- */
  window.addEventListener('click', function (e) {
    if (e.detail === 0) return; // bấm bằng bàn phím
    var colors = ['#16b56b', '#0ea5e9', '#d4f970', '#5eead4'];
    for (var i = 0; i < 8; i++) {
      var p = document.createElement('span');
      p.className = 'click-burst';
      var ang = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
      var dist = 22 + Math.random() * 18;
      p.style.left = e.clientX + 'px';
      p.style.top = e.clientY + 'px';
      p.style.background = colors[i % colors.length];
      p.style.setProperty('--tx', (Math.cos(ang) * dist).toFixed(1) + 'px');
      p.style.setProperty('--ty', (Math.sin(ang) * dist).toFixed(1) + 'px');
      document.body.appendChild(p);
      setTimeout(p.remove.bind(p), 750);
    }
  });

  /* ---------- Nút nam châm ---------- */
  function bindMagnet(el) {
    var strength = 0.3;
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var x = e.clientX - (r.left + r.width / 2);
      var y = e.clientY - (r.top + r.height / 2);
      el.style.transform = 'translate(' + (x * strength).toFixed(1) + 'px,' + (y * strength * 1.2).toFixed(1) + 'px)';
    });
    el.addEventListener('pointerleave', function () { el.style.transform = ''; });
  }

  /* ---------- Thẻ nghiêng 3D + đèn rọi ---------- */
  function bindTilt(el) {
    var max = 6;
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * max).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * max).toFixed(2) + 'deg) translateY(-4px)';
    });
    el.addEventListener('pointerleave', function () { el.style.transform = ''; });
  }

  window.bindFx = function (scope) {
    (scope || document).querySelectorAll('[data-magnetic]:not([data-fx])').forEach(function (el) { el.setAttribute('data-fx', ''); bindMagnet(el); });
    (scope || document).querySelectorAll('[data-tilt]:not([data-fx])').forEach(function (el) { el.setAttribute('data-fx', ''); bindTilt(el); });
  };
  document.addEventListener('DOMContentLoaded', function () { window.bindFx(); });
})();
