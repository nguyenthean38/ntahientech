/* ==========================================================
   Hiệu ứng con trỏ & chuyển động
   - Dải lụa ánh sáng neon bám theo chuột: đầu to, đuôi thon, đổi màu, phát sáng
   - Tia sao 4 cánh tung ra khi lướt nhanh
   - Khung ngắm 4 góc thay cho con trỏ tròn, nhãn "Xem" trên dự án
   - Nút hút nam châm, thẻ nghiêng 3D, ký hiệu code bay lên, hạt nổ khi bấm
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

  /* ---------- Ký hiệu code bay lên ---------- */
  (function floaters() {
    if (reduce) return;
    var box = document.getElementById('sparkles');
    if (!box) return;
    var glyphs = ['</>', '{ }', '=>', '01', '#', '( )', ';', '[ ]'];
    var n = window.innerWidth < 700 ? 4 : 8;
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.className = 'sparkle';
      s.textContent = glyphs[i % glyphs.length];
      s.style.left = (4 + Math.random() * 92).toFixed(1) + '%';
      s.style.setProperty('--s', (11 + Math.random() * 6).toFixed(0) + 'px');
      s.style.setProperty('--t', (16 + Math.random() * 14).toFixed(1) + 's');
      s.style.setProperty('--dl', (-Math.random() * 30).toFixed(1) + 's');
      box.appendChild(s);
    }
  })();

  if (!finePointer || reduce) return;

  /* ---------- Dải lụa ánh sáng neon + tia sao ---------- */
  var canvas = document.getElementById('fxField');
  var ctx = canvas && canvas.getContext('2d');
  var W = 0, H = 0;
  var N = 44;                                   // số đốt của dải lụa
  var target = { x: -999, y: -999 }, lens = { x: -999, y: -999 };
  var pts = [], sparks = [], running = false, lastMove = 0;
  var energy = 0, hueT = 0, prevHead = { x: 0, y: 0 };

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function resetTrail(x, y) { pts = []; for (var i = 0; i < N; i++) pts.push({ x: x, y: y }); prevHead.x = x; prevHead.y = y; }

  // bảng màu thương hiệu: xanh lá → ngọc → xanh dương → chanh
  var PAL = [[22, 181, 107], [45, 212, 191], [14, 165, 233], [163, 230, 53]];
  function pal(t) {
    t = (((t % 1) + 1) % 1) * PAL.length;
    var i = Math.floor(t), f = t - i, a = PAL[i], b = PAL[(i + 1) % PAL.length];
    return [Math.round(a[0] + (b[0] - a[0]) * f), Math.round(a[1] + (b[1] - a[1]) * f), Math.round(a[2] + (b[2] - a[2]) * f)];
  }
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  // tia sao 4 cánh
  function spawn(x, y, speed, vx, vy) {
    var n = Math.min(3, 1 + Math.floor(speed / 25));
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, v = 0.4 + Math.random() * 1.6;
      sparks.push({ x: x, y: y, vx: Math.cos(a) * v + (vx || 0) * 0.15, vy: Math.sin(a) * v + (vy || 0) * 0.15, life: 1, decay: 0.014 + Math.random() * 0.02, s: 2 + Math.random() * 4, rot: Math.random() * 3, vr: (Math.random() - 0.5) * 0.2, c: pal(hueT + Math.random() * 0.5) });
    }
    if (sparks.length > 120) sparks.splice(0, sparks.length - 120);
  }
  function star(x, y, s, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, -s); ctx.quadraticCurveTo(0, 0, s, 0); ctx.quadraticCurveTo(0, 0, 0, s);
    ctx.quadraticCurveTo(0, 0, -s, 0); ctx.quadraticCurveTo(0, 0, 0, -s);
    ctx.fill(); ctx.restore();
  }

  // vẽ dải thon dần: đầu to, đuôi nhọn
  function ribbonPath(scale) {
    var L = [], Rr = [], n = pts.length;
    var base = 3.5 + 16 * energy;
    for (var i = 0; i < n; i++) {
      var a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
      var dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
      var w = base * Math.pow(1 - i / (n - 1), 1.1) * scale + 0.3;
      var nx = -dy / d * w, ny = dx / d * w;
      L.push([pts[i].x + nx, pts[i].y + ny]); Rr.push([pts[i].x - nx, pts[i].y - ny]);
    }
    ctx.beginPath();
    ctx.moveTo(L[0][0], L[0][1]);
    for (var j = 1; j < n - 1; j++) ctx.quadraticCurveTo(L[j][0], L[j][1], (L[j][0] + L[j + 1][0]) / 2, (L[j][1] + L[j + 1][1]) / 2);
    ctx.lineTo(pts[n - 1].x, pts[n - 1].y);
    for (var k = n - 2; k > 0; k--) ctx.quadraticCurveTo(Rr[k][0], Rr[k][1], (Rr[k][0] + Rr[k - 1][0]) / 2, (Rr[k][1] + Rr[k - 1][1]) / 2);
    ctx.lineTo(Rr[0][0], Rr[0][1]);
    // đầu dải bo tròn
    var hw = base * scale + 0.3;
    var a0 = Math.atan2(L[0][1] - pts[0].y, L[0][0] - pts[0].x);
    ctx.arc(pts[0].x, pts[0].y, hw, a0 + Math.PI, a0 + 2 * Math.PI, false);
    ctx.closePath();
  }

  function draw() {
    var dark = isDark();
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over';
    hueT += 0.0035;

    // đầu dải bám chuột, các đốt sau nối đuôi nhau
    var head = pts[0];
    head.x += (target.x - head.x) * 0.45;
    head.y += (target.y - head.y) * 0.45;
    for (var i = 1; i < pts.length; i++) {
      pts[i].x += (pts[i - 1].x - pts[i].x) * 0.42;
      pts[i].y += (pts[i - 1].y - pts[i].y) * 0.42;
    }
    var hvx = head.x - prevHead.x, hvy = head.y - prevHead.y, sp = Math.sqrt(hvx * hvx + hvy * hvy);
    prevHead.x = head.x; prevHead.y = head.y;
    energy += (Math.min(1, sp / 28) - energy) * 0.12;

    var tail = pts[pts.length - 1], len = 0;
    for (var m = 1; m < pts.length; m++) len += Math.abs(pts[m].x - pts[m - 1].x) + Math.abs(pts[m].y - pts[m - 1].y);

    if (len > 3) {
      var c1 = pal(hueT), c2 = pal(hueT + 0.33), c3 = pal(hueT + 0.66);
      var g = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
      g.addColorStop(0, rgba(c1, dark ? 0.95 : 0.9));
      g.addColorStop(0.5, rgba(c2, dark ? 0.7 : 0.65));
      g.addColorStop(1, rgba(c3, 0));
      // lớp phát sáng
      ctx.shadowColor = rgba(c1, dark ? 0.9 : 0.7);
      ctx.shadowBlur = 14 + 26 * energy;
      ctx.fillStyle = g;
      ribbonPath(1); ctx.fill();
      ctx.shadowBlur = 0;
      // lõi sáng ở giữa
      var core = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
      core.addColorStop(0, dark ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.85)');
      core.addColorStop(0.6, dark ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.2)');
      core.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = core;
      ribbonPath(0.32); ctx.fill();
      // tung tia sao khi lướt nhanh
      if (energy > 0.3 && Math.random() < energy) {
        var p = pts[2 + Math.floor(Math.random() * 6)];
        spawn(p.x, p.y, sp, -hvx, -hvy);
      }
    }

    for (var s = sparks.length - 1; s >= 0; s--) {
      var q = sparks[s];
      q.x += q.vx; q.y += q.vy; q.vx *= 0.95; q.vy = q.vy * 0.95 + 0.03; q.rot += q.vr;
      q.life -= q.decay;
      if (q.life <= 0) { sparks.splice(s, 1); continue; }
      ctx.globalAlpha = q.life;
      ctx.fillStyle = rgba(q.c, 1);
      star(q.x, q.y, q.s * (0.5 + q.life * 0.5), q.rot);
    }
    ctx.globalAlpha = 1;

    if (len <= 3 && energy < 0.02 && !sparks.length) { running = false; ctx.clearRect(0, 0, W, H); return; }
    requestAnimationFrame(draw);
  }

  function wake() {
    lastMove = performance.now();
    if (!running) { running = true; requestAnimationFrame(draw); }
  }

  if (ctx) { resize(); resetTrail(W / 2, H / 2); window.addEventListener('resize', resize); }

  /* ---------- Khung ngắm con trỏ ---------- */
  var cur = document.getElementById('cursor');
  var dot = document.getElementById('cursorDot');
  var label = document.getElementById('cursorLabel');
  var mx = W / 2, my = H / 3, cx = mx, cy = my, prevX = mx, prevY = my, tilt = 0;
  root.classList.add('has-cursor');

  function loopCursor() {
    cx += (mx - cx) * 0.22;
    cy += (my - cy) * 0.22;
    // khung nghiêng nhẹ theo hướng di chuyển
    var vx = mx - prevX; prevX += (mx - prevX) * 0.3; prevY += (my - prevY) * 0.3;
    tilt += (Math.max(-25, Math.min(25, vx * 0.6)) - tilt) * 0.15;
    cur.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0) rotate(' + tilt.toFixed(1) + 'deg)';
    requestAnimationFrame(loopCursor);
  }
  requestAnimationFrame(loopCursor);

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY;
    target.x = mx; target.y = my;
    if (lens.x < -500) { lens.x = mx; lens.y = my; if (ctx) resetTrail(mx, my); }
    dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    if (ctx) wake();
  }, { passive: true });

  document.addEventListener('mouseleave', function () { cur.classList.add('is-hidden'); dot.classList.add('is-hidden'); lastMove = 0; });
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

  /* ---------- Sóng vuông lan ra khi bấm ---------- */
  window.addEventListener('click', function (e) {
    if (e.detail === 0) return; // bấm bằng bàn phím
    var w = document.createElement('span');
    w.className = 'click-wave';
    w.style.left = e.clientX + 'px';
    w.style.top = e.clientY + 'px';
    document.body.appendChild(w);
    setTimeout(w.remove.bind(w), 700);
    if (ctx) { for (var i = 0; i < 5; i++) spawn(e.clientX, e.clientY, 60); wake(); }
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
