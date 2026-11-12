/* ==========================================================
   Hiệu ứng con trỏ & chuyển động
   - Dải sóng bám theo chuột (canvas)
   - Vòng tròn con trỏ + nhãn "Xem"
   - Nút hút nam châm, thẻ nghiêng 3D, bông sáng rơi, hạt nổ khi bấm
   ========================================================== */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var root = document.documentElement;

  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

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

  /* ---------- Dải sóng bám chuột ---------- */
  var canvas = document.getElementById('ribbons');
  var ctx = canvas && canvas.getContext('2d');
  var pos = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
  var lines = [];
  var running = false;
  var lastMove = 0;
  var hue = 0;
  var CFG = { friction: 0.5, trails: 22, size: 46, dampening: 0.025, tension: 0.985 };

  function Node() { this.x = pos.x; this.y = pos.y; this.vx = 0; this.vy = 0; }
  function Line(spring) {
    this.spring = spring + 0.1 * Math.random() - 0.05;
    this.friction = CFG.friction + 0.01 * Math.random() - 0.005;
    this.nodes = [];
    for (var i = 0; i < CFG.size; i++) this.nodes.push(new Node());
  }
  Line.prototype.update = function () {
    var e = this.spring, t = this.nodes[0];
    t.vx += (pos.x - t.x) * e;
    t.vy += (pos.y - t.y) * e;
    for (var i = 0, n = this.nodes.length; i < n; i++) {
      t = this.nodes[i];
      if (i > 0) {
        var p = this.nodes[i - 1];
        t.vx += (p.x - t.x) * e;
        t.vy += (p.y - t.y) * e;
        t.vx += p.vx * CFG.dampening;
        t.vy += p.vy * CFG.dampening;
      }
      t.vx *= this.friction;
      t.vy *= this.friction;
      t.x += t.vx;
      t.y += t.vy;
      e *= CFG.tension;
    }
  };
  Line.prototype.draw = function () {
    var n = this.nodes, x = n[0].x, y = n[0].y, a, b;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (var i = 1, len = n.length - 2; i < len; i++) {
      a = n[i]; b = n[i + 1];
      x = 0.5 * (a.x + b.x);
      y = 0.5 * (a.y + b.y);
      ctx.quadraticCurveTo(a.x, a.y, x, y);
    }
    a = n[n.length - 2]; b = n[n.length - 1];
    ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
    ctx.stroke();
  };

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function initLines() {
    lines = [];
    for (var i = 0; i < CFG.trails; i++) lines.push(new Line(0.45 + (i / CFG.trails) * 0.025));
  }
  function frame(now) {
    if (!running) return;
    var idle = now - lastMove > 2600;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hue += 0.6;
    var h = 165 + Math.sin(hue / 60) * 28; // xanh lá → xanh dương
    var dark = isDark();
    ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over';
    ctx.strokeStyle = 'hsla(' + h.toFixed(0) + ',' + (dark ? '90%' : '80%') + ',' + (dark ? '55%' : '42%') + ',' + (dark ? 0.09 : 0.14) + ')';
    ctx.lineWidth = 1;
    for (var i = 0; i < lines.length; i++) { lines[i].update(); lines[i].draw(); }
    canvas.style.opacity = idle ? '0' : '1';
    if (now - lastMove > 4000) { running = false; return; }
    requestAnimationFrame(frame);
  }
  function wake() {
    lastMove = performance.now();
    if (!running) { running = true; requestAnimationFrame(frame); }
  }

  if (ctx) {
    resize();
    initLines();
    window.addEventListener('resize', resize);
  }

  /* ---------- Vòng tròn con trỏ ---------- */
  var cur = document.getElementById('cursor');
  var dot = document.getElementById('cursorDot');
  var label = document.getElementById('cursorLabel');
  var mx = pos.x, my = pos.y, cx = mx, cy = my;
  root.classList.add('has-cursor');

  function loopCursor() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cur.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
    requestAnimationFrame(loopCursor);
  }
  requestAnimationFrame(loopCursor);

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY;
    pos.x = mx; pos.y = my;
    dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    if (ctx) wake();
  }, { passive: true });

  document.addEventListener('mouseleave', function () { cur.classList.add('is-hidden'); dot.classList.add('is-hidden'); });
  document.addEventListener('mouseenter', function () { cur.classList.remove('is-hidden'); dot.classList.remove('is-hidden'); });
  window.addEventListener('pointerdown', function () { cur.classList.add('is-down'); });
  window.addEventListener('pointerup', function () { cur.classList.remove('is-down'); });

  var HOVER = 'a, button, [data-tilt], label, select, summary, input[type=range]';
  document.addEventListener('pointerover', function (e) {
    var view = e.target.closest('[data-cursor]');
    if (view) {
      cur.classList.add('is-view'); cur.classList.remove('is-hover');
      label.textContent = view.getAttribute('data-cursor');
      dot.classList.add('is-hover');
      return;
    }
    if (e.target.closest('input[type=text], input[type=tel], input:not([type]), textarea')) {
      cur.classList.add('is-hidden'); dot.classList.add('is-hidden');
      return;
    }
    cur.classList.remove('is-hidden'); dot.classList.remove('is-hidden');
    if (e.target.closest(HOVER)) { cur.classList.add('is-hover'); dot.classList.add('is-hover'); }
  });
  document.addEventListener('pointerout', function (e) {
    var to = e.relatedTarget;
    if (!to || !to.closest || !to.closest('[data-cursor]')) { cur.classList.remove('is-view'); label.textContent = ''; }
    if (!to || !to.closest || !to.closest(HOVER)) { cur.classList.remove('is-hover'); dot.classList.remove('is-hover'); }
  });

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
