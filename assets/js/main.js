/* ==========================================================
   Ntahien Tech — tương tác trang
   ========================================================== */
(function () {
  'use strict';
  var S = window.SITE || {};
  var root = document.documentElement;
  var body = document.body;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var fmt = function (n) { return Math.round(n).toLocaleString('vi-VN'); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var icon = function (id, cls) { return '<svg class="ico' + (cls ? ' ' + cls : '') + '"><use href="#' + id + '"/></svg>'; };

  /* ---------- Thông báo nhỏ ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-show'); }, 2600);
  }

  /* ---------- Chữ tách từng từ ---------- */
  $$('[data-split]').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    var base = parseFloat(el.closest('.line') ? Array.prototype.indexOf.call($$('.hero__title [data-split]'), el) : 0) * 0.12;
    el.innerHTML = words.map(function (w, i) {
      return '<span class="split-word"><span style="--wd:' + (0.15 + base + i * 0.07).toFixed(2) + 's">' + esc(w) + '</span></span>';
    }).join(' ');
  });

  /* ---------- Vào thẳng trang: chữ tiêu đề hiện lên ngay ---------- */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { body.classList.add('is-ready'); root.classList.add('is-ready'); });
  });

  /* ---------- Giao diện sáng / tối ---------- */
  $('#themeBtn').addEventListener('click', function () {
    var dark = root.getAttribute('data-theme') ? root.getAttribute('data-theme') === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    var next = dark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    toast(next === 'dark' ? 'Đã chuyển sang giao diện tối' : 'Đã chuyển sang giao diện sáng');
  });

  /* ---------- Thanh điều hướng ---------- */
  var nav = $('#nav'), navProg = $('#navProgress'), toTop = $('#toTop'), ring = $('#toTopRing');
  var lastY = window.scrollY, ticking = false;
  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? y / max : 0;
    nav.classList.toggle('is-scrolled', y > 30);
    if (!body.classList.contains('menu-open')) nav.classList.toggle('is-hidden', y > lastY && y > 500);
    lastY = y;
    navProg.style.width = (p * 100).toFixed(2) + '%';
    toTop.classList.toggle('is-show', y > 700);
    ring.style.strokeDashoffset = (138.2 * (1 - p)).toFixed(1);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  // Đánh dấu mục đang xem
  var navLinks = $$('.nav__links a');
  var secObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach(function (a) { var s = $(a.getAttribute('href')); if (s) secObs.observe(s); });

  /* ---------- Menu điện thoại ---------- */
  var burger = $('#burger'), menu = $('#menu');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    body.classList.toggle('is-locked', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    menu.setAttribute('aria-hidden', !open);
    if (open) nav.classList.remove('is-hidden');
  }
  burger.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
  $$('#menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* ---------- Xuất hiện khi cuộn ---------- */
  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); revObs.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  function observeReveal(scope) { $$('[data-reveal]:not(.is-in), .svc, .stack__card, .meter', scope).forEach(function (el) { revObs.observe(el); }); }
  observeReveal();
  $$('mark.hl').forEach(function (m) { revObs.observe(m); });

  /* ---------- Đếm số ---------- */
  var cntObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target, to = +el.getAttribute('data-count'), t0 = performance.now(), dur = 1600;
      cntObs.unobserve(el);
      (function step(now) {
        var k = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 4)));
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(function (el) { cntObs.observe(el); });

  /* ---------- Dải giao diện ở hero ---------- */
  (function showcase() {
    var track = $('#showcaseTrack');
    var items = [];
    (S.projects || []).forEach(function (p) {
      if (p.mock) return;
      if (p.mobile) p.shots.slice(0, 2).forEach(function (src) { items.push({ src: src, title: p.title, phone: true }); });
      else items.push({ src: p.shots[0], title: p.title });
    });
    var html = items.map(function (it) {
      return '<a class="shot' + (it.phone ? ' shot--phone' : '') + '" href="#du-an" data-cursor="Xem" tabindex="-1"><span class="shot__inner"><img src="' + it.src + '" alt="Giao diện ' + esc(it.title) + '" loading="lazy" /><span class="shot__label">' + esc(it.title) + '</span></span></a>';
    }).join('');
    track.innerHTML = html + html.replace(/alt="[^"]*"/g, 'alt=""');

    // Chạy bằng JS để khi rê chuột thì giảm tốc êm rồi dừng hẳn, rời chuột thì tăng tốc lại
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var box = track.parentNode, BASE = 'rotateX(18deg) rotateZ(-3deg) ';
    var x = 0, v = 0, hover = false, visible = true, last = 0, half = 0;
    function measure() { half = track.scrollWidth / 2; }
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    box.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hover = true; });
    box.addEventListener('pointerleave', function () { hover = false; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(box);
    function frame(t) {
      var dt = last ? Math.min(t - last, 50) / 1000 : 0; last = t;
      if (visible && !document.hidden && half) {
        var speed = half / 55;                       // hết một vòng trong 55 giây
        v += ((hover ? 0 : speed) - v) * Math.min(1, dt * (hover ? 7 : 2.5));
        if (v < 0.5 && hover) v = 0;
        x = (x + v * dt) % half;
        track.style.transform = BASE + 'translate3d(' + (-x).toFixed(2) + 'px,0,0)';
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  /* ---------- Thẻ dịch vụ sống động ---------- */
  (function serviceMocks() {
    // giỏ hàng
    var btns = $$('.mock-shop .p button'), cart = $('.mock-shop__cart'), count = $('#cartCount'), n = 2, i = 0;
    setInterval(function () {
      if (document.hidden) return;
      var b = btns[i % btns.length]; i++;
      b.classList.add('is-click');
      setTimeout(function () { b.classList.remove('is-click'); n = n >= 9 ? 1 : n + 1; count.textContent = n; cart.classList.remove('bump'); void cart.offsetWidth; cart.classList.add('bump'); }, 260);
    }, 2200);
    // đếm ngược
    var sec = $('#lpSec'), s = 18;
    setInterval(function () { s = s <= 0 ? 59 : s - 1; sec.textContent = (s < 10 ? '0' : '') + s; }, 1000);
    // chat AI
    var bubbles = $$('#mockChat .b'), k = 0;
    function playChat() {
      bubbles.forEach(function (b) { b.classList.remove('show'); });
      k = 0;
      (function next() {
        if (k >= bubbles.length) { setTimeout(playChat, 3200); return; }
        bubbles[k].classList.add('show'); k++;
        setTimeout(next, 900);
      })();
    }
    var chatObs = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { playChat(); chatObs.disconnect(); } }, { threshold: 0.4 });
    chatObs.observe($('#mockChat'));
  })();

  /* ---------- Dự án ---------- */
  var grid = $('#projGrid');
  var projects = S.projects || [];
  function mediaHTML(p) {
    if (p.mock === 'chat') {
      return '<div class="proj__media proj__media--chat" style="--accent:' + p.accent + '"><div class="tg"><div class="tg__head"><i></i>Nhóm Công việc · Bot</div><div class="tg__body">' +
        '<div class="tg__msg">/giao @Lan Thiết kế banner khuyến mãi — hạn 17h</div>' +
        '<div class="tg__msg tg__msg--bot">📌 Việc mới cho Lan: Thiết kế banner khuyến mãi · Hạn 17:00<div class="tg__btns"><span>Đang làm</span><span>Xong ✓</span><span>Cần hỗ trợ</span></div></div>' +
        '<div class="tg__msg tg__msg--bot">⏰ Nhắc hạn: còn 1 giờ · 📊 Báo cáo ngày: 8/10 việc hoàn thành</div></div></div></div>';
    }
    if (p.mobile) {
      return '<div class="proj__media proj__media--phones" style="--accent:' + p.accent + '">' + p.shots.map(function (s) { return '<img src="' + s + '" alt="" loading="lazy" />'; }).join('') + '</div>';
    }
    return '<div class="proj__media" style="--accent:' + p.accent + '"><img src="' + p.cover + '" alt="Giao diện ' + esc(p.title) + '" loading="lazy" /></div>';
  }
  function renderProjects() {
    grid.innerHTML = projects.map(function (p, idx) {
      var live = (p.links || []).some(function (l) { return /vercel|http/.test(l.url) && /trực tiếp/i.test(l.label); });
      var wide = idx < 2 ? ' proj--wide' : '';
      return '<article tabindex="0" role="button" class="proj' + wide + '" data-id="' + p.id + '" data-cat="' + p.cat.join(' ') + '" data-cursor="Xem" data-tilt data-reveal aria-label="Xem chi tiết dự án ' + esc(p.title) + '">' +
        '<span class="proj__badge"><span>' + p.year + '</span>' + (live ? '<span class="live">Đang chạy</span>' : '') + '</span>' +
        mediaHTML(p) +
        '<span class="proj__body"><span class="proj__kind">' + esc(p.kind) + '</span><span class="proj__title">' + esc(p.title) + '</span><span class="proj__sum">' + esc(p.summary) + '</span>' +
        '<span class="proj__foot">' + p.tech.slice(0, 3).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '<span class="proj__more">Chi tiết ' + icon('i-arrow-ur') + '</span></span></span></article>';
    }).join('');
    observeReveal(grid);
    if (window.bindFx) window.bindFx(grid);
    // số lượng mỗi bộ lọc
    $$('#filters button').forEach(function (b) {
      var f = b.getAttribute('data-filter');
      var c = f === 'all' ? projects.length : projects.filter(function (p) { return p.cat.indexOf(f) > -1; }).length;
      $('sup', b).textContent = c;
      if (!c) b.hidden = true;
    });
  }
  renderProjects();

  $('#filters').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var f = b.getAttribute('data-filter');
    $$('#filters button').forEach(function (x) { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', x === b); });
    $$('.proj', grid).forEach(function (card) {
      var show = f === 'all' || card.getAttribute('data-cat').split(' ').indexOf(f) > -1;
      card.classList.toggle('is-out', !show);
      card.classList.remove('is-pop');
      if (show) { void card.offsetWidth; card.classList.add('is-pop', 'is-in'); }
    });
  });

  /* ---------- Hộp thoại ---------- */
  var lastFocus = null;
  function openModal(m) {
    lastFocus = document.activeElement;
    m.classList.add('is-open');
    m.setAttribute('aria-hidden', 'false');
    body.classList.add('is-locked');
    setTimeout(function () { var c = $('.modal__close', m); if (c) c.focus(); }, 60);
  }
  function closeModal(m) {
    m.classList.remove('is-open');
    m.setAttribute('aria-hidden', 'true');
    if (!$('.modal.is-open') && !body.classList.contains('menu-open')) body.classList.remove('is-locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$('.modal').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeModal(m); });
  });
  document.addEventListener('keydown', function (e) {
    var open = $('.modal.is-open');
    if (e.key === 'Escape') { if (open) closeModal(open); else if (body.classList.contains('menu-open')) setMenu(false); }
    if (open && open.id === 'modal' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { var nb = $(e.key === 'ArrowRight' ? '.pm-gallery__nav--next' : '.pm-gallery__nav--prev', open); if (nb) nb.click(); }
    if (open && e.key === 'Tab') { // giữ tiêu điểm trong hộp thoại
      var f = $$('a[href], button:not([disabled]), input, select, textarea', open).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  function showProject(id) {
    var p = projects.filter(function (x) { return x.id === id; })[0]; if (!p) return;
    var shots = p.shots || [];
    var gallery = '';
    if (p.mock === 'chat') {
      gallery = '<div class="pm-gallery">' + mediaHTML(p).replace('proj__media proj__media--chat', 'pm-gallery__main proj__media--chat') + '</div>';
    } else {
      gallery = '<div class="pm-gallery' + (p.mobile ? ' pm-gallery--phone' : '') + '"><div class="pm-gallery__main"><img id="pmImg" src="' + shots[0] + '" alt="Giao diện ' + esc(p.title) + '" /></div>' +
        (shots.length > 1 ? '<button type="button" class="pm-gallery__nav pm-gallery__nav--prev" aria-label="Ảnh trước">' + icon('i-chev-l') + '</button><button type="button" class="pm-gallery__nav pm-gallery__nav--next" aria-label="Ảnh sau">' + icon('i-chev-r') + '</button>' : '') +
        '</div>' + (shots.length > 1 ? '<div class="pm-thumbs">' + shots.map(function (s, i) { return '<button type="button" class="' + (i ? '' : 'is-active') + '" data-i="' + i + '" aria-label="Ảnh ' + (i + 1) + '"><img src="' + s + '" alt="" /></button>'; }).join('') + '</div>' : '');
    }
    var links = (p.links || []).map(function (l, i) {
      return '<a class="btn ' + (i ? 'btn--ghost' : 'btn--brand') + '" href="' + l.url + '" target="_blank" rel="noopener">' + (/mã nguồn/i.test(l.label) ? icon('i-github') : icon('i-globe')) + '<span>' + esc(l.label) + '</span>' + icon('i-arrow-ur') + '</a>';
    }).join('');
    $('#modalContent').innerHTML = gallery +
      '<div class="pm-body"><div><p class="proj__kind">' + esc(p.kind) + ' · ' + p.year + '</p><h2 id="modalTitle">' + esc(p.title) + '</h2><p class="lead">' + esc(p.summary) + '</p>' +
      '<ul class="pm-feat">' + p.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></div>' +
      '<aside class="pm-side"><div><h4>Công nghệ</h4><div class="tags">' + p.tech.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</div></div>' +
      '<div class="pm-links">' + (links || '<p class="pm-note">Dự án làm cho khách hàng — demo trực tiếp khi trao đổi.</p>') +
      '<a class="btn btn--dark" href="#lien-he" data-close-go>' + icon('i-zalo', 'ico--zalo') + '<span>Tôi muốn làm tương tự</span></a></div></aside></div>';
    var cur = 0, img = $('#pmImg');
    function go(i) {
      cur = (i + shots.length) % shots.length;
      img.src = shots[cur];
      img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
      $$('.pm-thumbs button').forEach(function (b, j) { b.classList.toggle('is-active', j === cur); });
    }
    var m = $('#modal');
    $$('.pm-gallery__nav--prev', m).forEach(function (b) { b.onclick = function () { go(cur - 1); }; });
    $$('.pm-gallery__nav--next', m).forEach(function (b) { b.onclick = function () { go(cur + 1); }; });
    $$('.pm-thumbs button', m).forEach(function (b) { b.onclick = function () { go(+b.getAttribute('data-i')); }; });
    var goBtn = $('[data-close-go]', m);
    goBtn.addEventListener('click', function () {
      closeModal(m);
      var msg = $('#cMessage');
      if (msg && !msg.value) msg.value = 'Tôi muốn làm một sản phẩm tương tự dự án "' + p.title + '" (' + p.kind + ').';
    });
    $('.modal__panel', m).scrollTop = 0;
    openModal(m);
  }
  grid.addEventListener('click', function (e) { var c = e.target.closest('.proj'); if (c) showProject(c.getAttribute('data-id')); });
  grid.addEventListener('keydown', function (e) {
    var c = e.target.closest('.proj');
    if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); showProject(c.getAttribute('data-id')); }
  });

  /* ---------- Quy trình ---------- */
  (function process() {
    var data = [
      { t: 'NGÀY 1', ico: 'i-msg', items: [['Lắng nghe mục tiêu kinh doanh', 'Gọi điện hoặc gặp trực tiếp'], ['Tìm hiểu khách hàng & đối thủ', 'Ghi chú mong muốn của anh chị'], ['Đề xuất giải pháp phù hợp', 'Miễn phí, không ràng buộc']] },
      { t: 'NGÀY 2', ico: 'i-file', items: [['Báo giá từng hạng mục', 'Rõ ràng, không chi phí ẩn'], ['Lên mốc thời gian', 'Ngày demo, ngày bàn giao'], ['Ký hợp đồng, đặt cọc 30%', 'Bắt đầu làm ngay']] },
      { t: 'TUẦN 1', ico: 'i-pen', items: [['Thiết kế giao diện máy tính', 'Theo màu sắc thương hiệu'], ['Thiết kế giao diện điện thoại', 'Ưu tiên khách xem bằng điện thoại'], ['Chỉnh sửa đến khi ưng ý', 'Duyệt rồi mới lập trình']] },
      { t: 'TUẦN 2 – 3', ico: 'i-code', items: [['Lập trình tính năng', 'Theo đúng bản thiết kế đã duyệt'], ['Gửi link demo mỗi tuần', 'Anh chị bấm thử, góp ý'], ['Kiểm thử tự động', 'Hạn chế lỗi trước khi lên mạng']] },
      { t: 'TUẦN 4', ico: 'i-rocket', items: [['Đưa website lên tên miền', 'Cài SSL, Google Search Console'], ['Bàn giao mã nguồn & tài khoản', 'Đứng tên anh chị 100%'], ['Video hướng dẫn sử dụng', 'Quay riêng cho website của anh chị']] },
      { t: 'MỖI THÁNG', ico: 'i-shield', items: [['Sao lưu dữ liệu', 'Tự động mỗi đêm'], ['Theo dõi & sửa lỗi', 'Phản hồi trong 24 giờ'], ['Báo cáo số liệu', 'Lượt truy cập, khách liên hệ']] }
    ];
    var steps = $$('#steps .step'), list = $('#consoleList'), ticks = $('#consoleTicks');
    var tickHTML = ''; for (var i = 0; i < 30; i++) tickHTML += '<i></i>'; ticks.innerHTML = tickHTML;
    var tickEls = $$('i', ticks), active = -1, doneTimer;
    function set(i) {
      if (i === active) return; active = i;
      var d = data[i];
      steps.forEach(function (s, j) { s.classList.toggle('is-active', j === i); });
      $('#stepNow').textContent = '0' + (i + 1);
      $('#stepBar').style.width = ((i + 1) / 6 * 100).toFixed(1) + '%';
      $('#consoleTitle').textContent = 'ĐANG CHẠY · ' + d.t;
      $('#consoleNo').textContent = '0' + (i + 1) + '/06';
      $('#consoleIcon').innerHTML = '<use href="#' + d.ico + '"/>';
      list.innerHTML = d.items.map(function (it) { return '<li><span class="ci">' + icon(d.ico) + '</span><span><b>' + esc(it[0]) + '</b><small>' + esc(it[1]) + '</small></span><span class="ok">' + icon('i-check') + '</span></li>'; }).join('');
      var pct = Math.round((i + 1) / 6 * 100);
      $('#consolePct').textContent = pct + '%';
      tickEls.forEach(function (t, j) { t.classList.toggle('on', j < Math.round(pct / 100 * 30)); });
      clearTimeout(doneTimer);
      var oks = $$('.ok', list), n = 0;
      (function mark() { if (n < oks.length) { oks[n].classList.add('is-done'); n++; doneTimer = setTimeout(mark, 550); } })();
    }
    set(0);
    var stepObs = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) set(+e.target.getAttribute('data-step')); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (s) { stepObs.observe(s); s.addEventListener('click', function () { set(+s.getAttribute('data-step')); }); });
  })();

  /* ---------- Bảng giá ---------- */
  function renderPrice(kind) {
    var list = (S.pricing && S.pricing[kind]) || [];
    var g = $('#priceGrid');
    g.style.setProperty('--cols', list.length);
    g.innerHTML = list.map(function (p, i) {
      return '<article class="price' + (p.hot ? ' price--hot' : '') + '" style="animation-delay:' + (i * 0.07) + 's">' +
        '<span class="price__tag">' + esc(p.tag) + '</span><h3>' + esc(p.name) + '</h3><p class="price__desc">' + esc(p.desc) + '</p>' +
        '<div class="price__val">' + (p.prefix ? '<small>' + p.prefix + '</small>' : '') + '<b>' + p.price + '</b><span>' + esc(p.unit) + '</span></div>' +
        '<p class="price__time">' + icon('i-clock') + esc(p.time) + '</p>' +
        '<ul>' + p.items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
        '<a class="btn ' + (p.hot ? 'btn--ghost' : 'btn--ghost') + '" href="#lien-he" data-plan-pick="' + esc(p.name) + '" data-magnetic><span>Chọn gói này</span>' + icon('i-arrow-r') + '</a></article>';
    }).join('');
    if (window.bindFx) window.bindFx(g);
  }
  renderPrice('build');
  $('#priceSeg').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var btns = $$('#priceSeg button');
    btns.forEach(function (x) { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', x === b); });
    this.setAttribute('data-pos', btns.indexOf(b));
    renderPrice(b.getAttribute('data-plan'));
  });
  $('#priceGrid').addEventListener('click', function (e) {
    var a = e.target.closest('[data-plan-pick]'); if (!a) return;
    var msg = $('#cMessage');
    msg.value = 'Tôi quan tâm gói "' + a.getAttribute('data-plan-pick') + '". ' + msg.value.replace(/^Tôi quan tâm gói "[^"]*"\. /, '');
  });

  /* ---------- Ước tính chi phí ---------- */
  (function estimator() {
    var E = S.estimator; if (!E) return;
    $('#calcTypes').innerHTML = E.types.map(function (t, i) {
      return '<label class="opt"><input type="radio" name="ptype" value="' + t.id + '"' + (i === 1 ? ' checked' : '') + ' /><span>' + esc(t.label) + '<small>từ ' + (t.base / 1e6).toLocaleString('vi-VN') + ' triệu</small></span></label>';
    }).join('');
    $('#calcAddons').innerHTML = E.addons.map(function (a) {
      return '<label class="chk"><input type="checkbox" value="' + a.id + '" />' + esc(a.label) + '<em>+' + (a.price / 1e6).toLocaleString('vi-VN') + 'tr</em></label>';
    }).join('');
    var range = $('#pages'), out = $('#pagesOut'), lowEl = $('#calcLow'), highEl = $('#calcHigh'), timeEl = $('#calcTime');
    var shownLow = 0, shownHigh = 0, anim;
    function type() { var v = ($('input[name=ptype]:checked') || {}).value; return E.types.filter(function (t) { return t.id === v; })[0] || E.types[0]; }
    function calc() {
      var t = type(), pages = +range.value;
      var extraPages = Math.max(0, pages - t.pages);
      var sum = t.base + extraPages * E.perPage;
      var chosen = $$('#calcAddons input:checked').map(function (c) { return E.addons.filter(function (a) { return a.id === c.value; })[0]; });
      chosen.forEach(function (a) { sum += a.price; });
      var rush = $('#rush').checked;
      if (rush) sum *= 1.2;
      var low = Math.round(sum / 100000) * 100000, high = Math.round(sum * 1.25 / 100000) * 100000;
      var d = t.days.map(function (x) { return Math.ceil((x + extraPages * 0.5 + chosen.length * 1.5) * (rush ? 0.7 : 1)); });
      timeEl.textContent = 'Thời gian dự kiến: ' + d[0] + ' – ' + d[1] + ' ngày';
      out.textContent = pages;
      range.style.setProperty('--p', ((pages - 1) / 29 * 100) + '%');
      // con số chạy mượt
      cancelAnimationFrame(anim);
      var fromL = shownLow, fromH = shownHigh, t0 = performance.now();
      (function step(now) {
        var k = Math.min(1, (now - t0) / 500), e = 1 - Math.pow(1 - k, 3);
        shownLow = fromL + (low - fromL) * e; shownHigh = fromH + (high - fromH) * e;
        lowEl.textContent = fmt(shownLow); highEl.textContent = fmt(shownHigh);
        if (k < 1) anim = requestAnimationFrame(step);
      })(t0);
      return { t: t, pages: pages, chosen: chosen, rush: rush, low: low, high: high, d: d };
    }
    $('#calc').addEventListener('input', calc);
    $('#calc').addEventListener('change', function (e) {
      if (e.target.name === 'ptype') { range.value = Math.max(1, type().pages); calc(); }
    });
    calc();
    $('#calcSend').addEventListener('click', function () {
      var r = calc();
      var txt = 'Cấu hình tôi ước tính:\n• Loại: ' + r.t.label + '\n• Số trang/màn hình: ' + r.pages +
        (r.chosen.length ? '\n• Tính năng thêm: ' + r.chosen.map(function (a) { return a.label; }).join(', ') : '') +
        (r.rush ? '\n• Cần gấp' : '') + '\n• Chi phí dự kiến: ' + fmt(r.low) + ' – ' + fmt(r.high) + 'đ';
      $('#cMessage').value = txt;
      var map = { landing: 'Landing page', company: 'Website doanh nghiệp', shop: 'Website bán hàng', webapp: 'Web app / phần mềm', mobile: 'App di động' };
      $$('#needChips input').forEach(function (c) { c.checked = c.value === map[r.t.id] || (c.value.indexOf('Chatbot') === 0 && r.chosen.some(function (a) { return a.id === 'chatbot'; })); });
      $('#lien-he').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      setTimeout(function () { $('#cform input[name=name]').focus({ preventScroll: true }); }, 900);
      toast('Đã chép cấu hình vào form liên hệ');
    });
  })();

  /* ---------- Vòng chữ gõ ---------- */
  (function typing() {
    var el = $('#typing'); if (!el) return;
    var words = ['website bán hàng', 'website doanh nghiệp', 'landing page', 'app di động', 'chatbot AI', 'phần mềm quản lý', 'tự động hoá n8n'];
    if (reduce) { el.textContent = words[0]; return; }
    var w = 0, c = words[0].length, del = true;
    (function loop() {
      var word = words[w];
      if (del) { c--; if (c <= 0) { del = false; w = (w + 1) % words.length; } }
      else { c++; if (c >= words[w].length) { del = true; el.textContent = words[w]; return setTimeout(loop, 1800); } }
      el.textContent = words[w].slice(0, Math.max(0, c));
      setTimeout(loop, del ? 40 : 75);
    })();
  })();

  /* ---------- Công nghệ ---------- */
  (function tech() {
    var list = [['React', 'react'], ['Next.js', 'nextdotjs'], ['TypeScript', 'typescript'], ['Node.js', 'nodedotjs'], ['Express', 'express'], ['Tailwind CSS', 'tailwindcss'], ['Flutter', 'flutter'], ['React Native', 'react'], ['Firebase', 'firebase'], ['Supabase', 'supabase'], ['PostgreSQL', 'postgresql'], ['SQLite', 'sqlite'], ['Prisma', 'prisma'], ['n8n', 'n8n'], ['Gemini', 'googlegemini'], ['Claude', 'anthropic'], ['Python', 'python'], ['Figma', 'figma'], ['Vercel', 'vercel'], ['Telegram Bot', 'telegram'], ['GitHub Actions', 'githubactions']];
    var html = list.map(function (t) { return '<span class="tech"><img src="https://cdn.simpleicons.org/' + t[1] + '" alt="" loading="lazy" width="22" height="22" onerror="this.remove()" />' + t[0] + '</span>'; }).join('');
    $('#techMarquee').innerHTML = html + html;
  })();

  /* ---------- Hỏi đáp ---------- */
  (function faq() {
    var box = $('#faqList');
    box.innerHTML = (S.faq || []).map(function (f, i) {
      var n = (i + 1 < 10 ? '0' : '') + (i + 1);
      return '<div class="qa' + (i === 0 ? ' is-open' : '') + '" data-reveal style="--d:' + (i * 0.04) + 's"><button type="button" class="qa__q" aria-expanded="' + (i === 0) + '" aria-controls="qa' + i + '" id="qaq' + i + '"><i>' + n + '</i><span>' + esc(f.q) + '</span><span class="pm">' + icon('i-chev') + '</span></button>' +
        '<div class="qa__a" id="qa' + i + '" role="region" aria-labelledby="qaq' + i + '"><div><p>' + esc(f.a) + '</p></div></div></div>';
    }).join('');
    observeReveal(box);
    box.addEventListener('click', function (e) {
      var q = e.target.closest('.qa__q'); if (!q) return;
      var item = q.parentNode, open = !item.classList.contains('is-open');
      $$('.qa', box).forEach(function (x) { x.classList.remove('is-open'); $('.qa__q', x).setAttribute('aria-expanded', 'false'); });
      if (open) { item.classList.add('is-open'); q.setAttribute('aria-expanded', 'true'); }
    });
  })();

  /* ---------- Form liên hệ ---------- */
  (function contact() {
    var form = $('#cform'), sendModal = $('#sendModal'), msgBox = $('#sendMsg'), text = '';
    function copy(t) {
      if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t).then(function () { return true; }, function () { return false; });
      try {
        var ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); var ok = document.execCommand('copy'); ta.remove();
        return Promise.resolve(ok);
      } catch (e) { return Promise.resolve(false); }
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim(), phone = form.phone.value.trim();
      var ok = true;
      [[form.name, name.length >= 2], [form.phone, /^[0-9+ .()-]{8,}$/.test(phone)]].forEach(function (pair) {
        pair[0].closest('.field').classList.toggle('is-error', !pair[1]);
        if (!pair[1]) ok = false;
      });
      if (!ok) { toast('Anh chị vui lòng nhập họ tên và số điện thoại hợp lệ'); (name.length < 2 ? form.name : form.phone).focus(); return; }
      var needs = $$('input[name=need]:checked', form).map(function (c) { return c.value; });
      text = 'Chào An, mình là ' + name + ' (SĐT/Zalo: ' + phone + ').\n' +
        (needs.length ? 'Nhu cầu: ' + needs.join(', ') + '\n' : '') +
        (form.budget.value ? 'Ngân sách: ' + form.budget.value + '\n' : '') +
        (form.message.value.trim() ? '\n' + form.message.value.trim() : '');
      msgBox.textContent = text;
      $('#sendMail').href = 'mailto:' + S.email + '?subject=' + encodeURIComponent('Yêu cầu tư vấn từ ' + name) + '&body=' + encodeURIComponent(text);
      copy(text);
      openModal(sendModal);
    });
    $$('#cform input').forEach(function (i) { i.addEventListener('input', function () { i.closest('.field') && i.closest('.field').classList.remove('is-error'); }); });
    $('#sendZalo').addEventListener('click', function () { copy(text).then(function (ok) { toast(ok ? 'Đã sao chép — dán vào ô chat Zalo nhé!' : 'Hãy sao chép nội dung rồi gửi qua Zalo'); }); });
    $('#sendCopy').addEventListener('click', function () { copy(text).then(function (ok) { toast(ok ? 'Đã sao chép nội dung' : 'Không sao chép được, anh chị bôi đen để chép nhé'); }); });
  })();

  $('#year').textContent = new Date().getFullYear();
})();
