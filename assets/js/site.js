/* The Money Research Lab · site script · Stage 1
   One small file, no libraries. Every motion respects prefers-reduced-motion. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ CONFIG
     Fill these when the accounts exist. Nothing here is secret: the site is public. */
  var CONFIG = {
    gtmId: 'GTM-5L73VZFV',          // Google Tag Manager container (GA4 G-Y6RTV6GK3M is configured inside it)
    consentKey: 'ml-consent',
    consentDays: 182,               // the choice is kept for 6 months, then the banner asks again
    forms: {
      // Google Forms: action = https://docs.google.com/forms/d/e/<FORM_ID>/formResponse ; fields = site name -> entry.<ID>
      contact:    { action: 'https://docs.google.com/forms/d/e/1FAIpQLScQ87IhnVCdZZ-GD4dab7N3K-eovEEO63zhXKAbbawK0gN2nQ/formResponse', fields: { name: 'entry.1458910955', email: 'entry.1900738472', message: 'entry.1909908519' } },
      experiment: { action: 'https://docs.google.com/forms/d/e/1FAIpQLSc8ua6RD7ydFLOnEZWXE8DpKN3FEfkP_4s8UkaxiMa_Q6HObg/formResponse', fields: { name: 'entry.1458910955', email: 'entry.1900738472', idea: 'entry.647128729' } },
      research:   { action: 'https://docs.google.com/forms/d/e/1FAIpQLScvTnbwC0jzhWWbY9iM_IwJEyodhg_bsHyUkG9wQEIu1rZNnw/formResponse', fields: { name: 'entry.1458910955', email: 'entry.1900738472', topic: 'entry.647128729' } },
      first:      { action: 'https://docs.google.com/forms/d/e/1FAIpQLScLx6pG5I33XLY3fxkehqto4_7YFBqKkYEZcHB9iul4QhldKw/formResponse', fields: { name: 'entry.1458910955', email: 'entry.1900738472' } },
      quote:      { action: '', fields: { quote: '', consent: '' } },
      // Brevo form "דוח המעבדה – אתר", list "דוח המעבדה", double opt-in, confirm page redirects to cherrixlabs.com
      report:     { action: 'https://48fee61e.sibforms.com/serve/MUIFAFEY49P015n7Mc4Kr4ZxR6ZoRzUh5oMsltJknmPEMq3Fw0axg-pyownl2zTOrCsmNlhvrxzkxvRF_d0dd7o1iw1UgUOM8Fh0jf4smhjfiOUjgzqj2kMMZIoBhBbp24ympSQFEIzP1CxqmT1nIRmnl-GYgmG6DsjQpNCY3RJGZOpPEtPq3972D2iuGWvbWkE5Jaoxj2cBwv0hrA==', brevo: true, fields: { email: 'EMAIL', name: 'FIRSTNAME' } }
    },
    videos: {
      // hero loops: approved by Moran 15.11.2026 (12 s seamless, 30 fps)
      hero: {
        desktop: { webm: '/assets/video/hero-desktop.webm', mp4: '/assets/video/hero-desktop.mp4' },
        mobile:  { webm: '/assets/video/hero-mobile.webm',  mp4: '/assets/video/hero-mobile.mp4' }
      },
      // participation loops: approved by Moran 15.11.2026 (12 s seamless, marble hand and particle sphere); heavier, mounted only near the section
      participation: {
        desktop: { webm: '/assets/video/participation-desktop.webm', mp4: '/assets/video/participation-desktop.mp4' },
        mobile:  { webm: '/assets/video/participation-desktop.webm', mp4: '/assets/video/participation-desktop.mp4' }   // 16.11: phones use the wide loop so the whole sphere shows
      }
    }
  };

  var doc = document, root = doc.documentElement;
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  var MOB = window.matchMedia('(max-width: 899px)');
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  window.dataLayer = window.dataLayer || [];
  function track(name, params) { var o = { event: name }; for (var k in params) o[k] = params[k]; window.dataLayer.push(o); }

  /* ------------------------------------------------------------------ stages */
  var MOB_Q = window.matchMedia('(max-width: 899px)');
  function fitStages() {
    $$('[data-stage]').forEach(function (w) {
      var sw = parseFloat(getComputedStyle(w).getPropertyValue('--w'));
      var max = parseFloat(w.getAttribute('data-max') || '1');
      var s = Math.min(max, w.clientWidth / sw);
      var fh = w.getAttribute('data-fit-h');   // persona card: the whole card fits the screen under the nav
      if (fh && !MOB_Q.matches) s = Math.min(s, Math.max(0.72, (window.innerHeight - 46 - parseFloat(fh)) / parseFloat(getComputedStyle(w).getPropertyValue('--h'))));
      if (w.clientWidth) w.style.setProperty('--s', s.toFixed(4));
    });
  }
  fitStages();
  window.addEventListener('resize', fitStages, { passive: true });

  /* ------------------------------------------------------------------ header */
  var menuBtn = $('.menu-btn'), mmenu = $('#mmenu');
  function setMenu(open) {
    if (!mmenu) return;
    if (open) { mmenu.hidden = false; requestAnimationFrame(function () { mmenu.classList.add('open'); }); }
    else { mmenu.classList.remove('open'); setTimeout(function () { if (!mmenu.classList.contains('open')) mmenu.hidden = true; }, 260); }
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
    doc.body.classList.toggle('menu-open', open);
    var l1 = $('.l1', menuBtn), l2 = $('.l2', menuBtn);
    l1.setAttribute('d', open ? 'M4 3l14 14' : 'M1 5h20');
    l2.setAttribute('d', open ? 'M18 3L4 17' : 'M1 13h13');
    $$('li', mmenu).forEach(function (li, i) { li.style.transitionDelay = open ? (0.04 * i) + 's' : '0s'; });
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    $$('a', mmenu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mmenu.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });
  }
  // current section in the nav (homepage)
  if ('IntersectionObserver' in window && doc.body.getAttribute('data-page') === 'home') {
    var navMap = {};
    $$('.nav-links a').forEach(function (a) { var h = a.getAttribute('href'); if (h.indexOf('/#') === 0) navMap[h.slice(2)] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var a = navMap[e.target.id]; if (!a) return;
        if (e.target.id === 'top') { if (e.isIntersecting) $$('.nav-links a[aria-current]').forEach(function (x) { x.removeAttribute('aria-current'); }); return; }
        if (e.isIntersecting) { $$('.nav-links a[aria-current]').forEach(function (x) { x.removeAttribute('aria-current'); }); a.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(navMap).concat(['top']).forEach(function (id) { var s = doc.getElementById(id); if (s) io.observe(s); });
  } else if (doc.body.getAttribute('data-page') === 'quotes') {
    var qa = $('.nav-links a[href="/quotes/"]'); if (qa) qa.setAttribute('aria-current', 'true');
  }

  /* ------------------------------------------------------------------ background videos
     Poster first. The video is loaded only near its section, never under reduced motion or Save-Data. */
  function canPlayVideo() {
    var c = navigator.connection;
    return !RM.matches && !(c && (c.saveData || /2g/.test(c.effectiveType || '')));
  }
  function mountVideo(box) {
    var conf = CONFIG.videos[box.getAttribute('data-video')];
    if (!conf || box.__v) return;
    var src = MOB.matches ? conf.mobile : conf.desktop; if (!src) return;
    var v = doc.createElement('video');
    v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('muted', '');
    v.setAttribute('aria-hidden', 'true'); v.setAttribute('tabindex', '-1'); v.preload = 'auto';
    var img = $('img', box); if (img) v.poster = img.currentSrc || img.src;
    if (src.webm) { var s1 = doc.createElement('source'); s1.src = src.webm; s1.type = 'video/webm'; v.appendChild(s1); }
    if (src.mp4) { var s2 = doc.createElement('source'); s2.src = src.mp4; s2.type = 'video/mp4'; v.appendChild(s2); }
    v.addEventListener('playing', function () { v.classList.add('ready'); });
    box.appendChild(v); box.__v = v;
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  }
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var box = e.target;
        if (e.isIntersecting) {
          if (!box.__v && canPlayVideo()) mountVideo(box);
          else if (box.__v && !RM.matches) { var p = box.__v.play(); if (p && p.catch) p.catch(function () {}); }
        } else if (box.__v) box.__v.pause();
      });
    }, { rootMargin: '400px 0px' });
    var startVideos = function () { $$('[data-video]').forEach(function (b) { vio.observe(b); }); };
    if (doc.readyState === 'complete') setTimeout(startVideos, 300); else window.addEventListener('load', function () { setTimeout(startVideos, 300); });
  }
  RM.addEventListener && RM.addEventListener('change', function () { $$('[data-video]').forEach(function (b) { if (b.__v) { if (RM.matches) b.__v.pause(); else b.__v.play(); } }); });

  /* ------------------------------------------------------------------ story flow lines (port of story-generator.py) */
  var NS = 'http://www.w3.org/2000/svg', TL = '#3AA9AE';
  function box(el) {
    var cx = parseFloat(el.style.left), cy = parseFloat(el.style.top), w = el.offsetWidth, h = el.offsetHeight;
    return { l: cx - w / 2, r: cx + w / 2, t: cy - h / 2, b: cy + h / 2, cx: cx, cy: cy };
  }
  function drawFlow(flow) {
    var M = flow.getAttribute('data-flow') === 'm', svg = $('svg', flow);
    if (!flow.offsetWidth && !flow.parentNode.offsetWidth) return;
    var SC = M ? 1 : 1.3125, GAP = 7, J = M ? 30 : 40 * SC;
    svg.innerHTML = '<defs><marker id="ar' + (M ? 'm' : 'd') + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" stroke="' + TL + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>';
    var R = function (k) { return box($('[data-k="' + k + '"]', flow)); };
    var add = function (d, arrow, w) {
      var p = doc.createElementNS(NS, 'path');
      p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', TL); p.setAttribute('stroke-width', (w || 1.4) * SC);
      if (arrow) p.setAttribute('marker-end', 'url(#ar' + (M ? 'm' : 'd') + ')');
      svg.appendChild(p);
      var L = p.getTotalLength(); if (L < 30) return;
      var s = doc.createElementNS(NS, 'path');
      s.setAttribute('d', d); s.setAttribute('fill', 'none'); s.setAttribute('stroke', TL); s.setAttribute('stroke-width', '3');
      s.setAttribute('stroke-linecap', 'round');
      s.setAttribute('class', 'seg');
      s.style.animationDelay = (-Math.random() * 0.8).toFixed(2) + 's';
      svg.appendChild(s);
    };
    var c = R('conf'), a = R('act');
    ['know', 'feel', 'dec'].forEach(function (k) {
      var s = R(k), m;
      if (!M) { var jx = c.l - J, sx = s.r + GAP; m = (sx + jx) / 2; add('M' + sx + ' ' + s.cy + ' C ' + m + ' ' + s.cy + ', ' + m + ' ' + c.cy + ', ' + jx + ' ' + c.cy); }
      else { var jy = c.t - J, sy = s.b + GAP; m = (sy + jy) / 2; add('M' + s.cx + ' ' + sy + ' C ' + s.cx + ' ' + m + ', ' + c.cx + ' ' + m + ', ' + c.cx + ' ' + jy); }
    });
    if (!M) { add('M' + (c.l - J) + ' ' + c.cy + ' H' + (c.l - GAP), true); add('M' + (c.r + GAP) + ' ' + c.cy + ' H' + (a.l - GAP - 2), true, 2); }
    else { add('M' + c.cx + ' ' + (c.t - J) + ' V' + (c.t - GAP), true); add('M' + c.cx + ' ' + (c.b + GAP) + ' V' + (a.t - GAP - 2), true, 2); }
    // spark (Moran 15.11): a glowing dash arrives, circles the "ביטחון" pill and runs on to "פעולה"
    if (RM.matches) return;
    var o = 6, x0 = c.l - o, x1 = c.r + o, y0 = c.t - o, y1 = c.b + o, r = (y1 - y0) / 2, A = ' A' + r + ' ' + r + ' 0 0 1 ', d;
    if (!M) d = 'M' + (c.l - J) + ' ' + c.cy + ' H' + x0 + A + (x0 + r) + ' ' + y0 + ' H' + (x1 - r) + A + x1 + ' ' + c.cy + A + (x1 - r) + ' ' + y1 + ' H' + (x0 + r) + A + x0 + ' ' + c.cy +
                A + (x0 + r) + ' ' + y0 + ' H' + (x1 - r) + A + x1 + ' ' + c.cy + ' H' + (a.l - GAP - 2);
    else d = 'M' + c.cx + ' ' + (c.t - J) + ' V' + y0 + ' H' + (x1 - r) + A + x1 + ' ' + c.cy + A + (x1 - r) + ' ' + y1 + ' H' + (x0 + r) + A + x0 + ' ' + c.cy + A + (x0 + r) + ' ' + y0 +
             ' H' + (x1 - r) + A + x1 + ' ' + c.cy + A + (x1 - r) + ' ' + y1 + ' H' + c.cx + ' V' + (a.t - GAP - 2);
    var sp = doc.createElementNS(NS, 'path');
    sp.setAttribute('d', d); sp.setAttribute('fill', 'none'); sp.setAttribute('class', 'spark');
    svg.appendChild(sp);
    var SL = sp.getTotalLength(), K = 64;
    sp.style.strokeDasharray = K + ' ' + (SL + K * 2);
    if (sp.animate) sp.animate([{ strokeDashoffset: K }, { strokeDashoffset: -SL, offset: .78 }, { strokeDashoffset: -SL }], { duration: 8200, iterations: Infinity, easing: 'ease-in-out' });
  }
  function drawFlows() { $$('[data-flow]').forEach(function (f) { if (f.offsetParent !== null) drawFlow(f); }); }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(drawFlows); else window.addEventListener('load', drawFlows);
  MOB.addEventListener && MOB.addEventListener('change', function () { setTimeout(function () { fitStages(); drawFlows(); }, 50); });

  /* ------------------------------------------------------------------ process cards (one open at a time) */
  var procRow = $('[data-proc]');
  if (procRow) {
    var pcs = $$('.pcard', procRow);
    pcs.forEach(function (card) {
      var btn = $('.plus', card);
      btn.addEventListener('click', function () {
        var open = !card.classList.contains('open');
        pcs.forEach(function (o) {
          if (o !== card && o.classList.contains('open')) closeP(o);
        });
        if (open) { card.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); btn.setAttribute('aria-label', 'סגירת ' + $('h3', card).textContent); track('process_open', { stage: $('h3', card).textContent }); }
        else closeP(card);
      });
    });
    function closeP(card) {
      var b = $('.plus', card); card.classList.remove('open'); b.setAttribute('aria-expanded', 'false');
      b.setAttribute('aria-label', 'פתיחת ' + $('h3', card).textContent);
      b.classList.add('closing'); setTimeout(function () { b.classList.remove('closing'); }, 560);
    }
    var pdots = $$('.process .dots i');
    procRow.addEventListener('scroll', function () {
      var mid = procRow.getBoundingClientRect().left + procRow.clientWidth / 2, best = 0, bd = 1e9;
      pcs.forEach(function (c, i) { var r = c.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid); if (d < bd) { bd = d; best = i; } });
      pdots.forEach(function (d, i) { d.classList.toggle('on', i === best); });
    }, { passive: true });
  }

  /* ------------------------------------------------------------------ personas */
  var tabsWrap = $('[data-tabs]');
  if (tabsWrap) {
    var tabs = $$('[role=tab]', tabsWrap), panels = $$('.ppanel'), figs = $$('.pfig img'), figsm = $$('.figm img');
    var knob = $('.knob', tabsWrap), cur = 0, data = JSON.parse($('#personas-data').textContent);
    var moveKnob = function () { var t = tabs[cur]; knob.style.left = t.offsetLeft + 'px'; knob.style.width = t.offsetWidth + 'px'; };
    moveKnob(); window.addEventListener('resize', moveKnob, { passive: true });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(moveKnob);
    var fillBars = function (panel, instant) {
      $$('.bars', panel).forEach(function (b, row) {
        var n = $$('i', b).length; $$('i', b).forEach(function (i) { i.classList.remove('f'); });
        var filled = parseInt((b.getAttribute('aria-label') || '0'), 10);
        $$('i', b).forEach(function (i, k) {
          if (k >= filled) return;
          var delay = instant || RM.matches ? 0 : (row * 0.22 * 1000 + k * 60);
          setTimeout(function () { i.classList.add('f'); }, delay);
        });
      });
    };
    var mob = $('[data-pmob]');
    var fillMobile = function () {
      if (!mob) return;
      var p = panels[cur];
      $('[data-m=name]', mob).textContent = data[cur].name;
      $('[data-m=id]', mob).textContent = data[cur].id;
      $('[data-m=id2]', mob).textContent = data[cur].id;
      var content = '<div class="brand">המעבדה לחקר הכסף</div><div class="bn">' + data[cur].name + '</div>' +
        '<p class="desc">' + $('.desc', p).textContent + '</p><p class="quote">' + $('.quote', p).textContent + '</p><h3>מיפוי התנהגותי</h3>' +
        $$('.mr', p).map(function (m) { return m.outerHTML; }).join('');
      $('[data-m=content]', mob).innerHTML = content;
      $$('.bars i', $('[data-m=content]', mob)).forEach(function (i) { i.classList.remove('f'); });
    };
    var timers = [];
    var later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
    var go = function (n, fromUser) {
      n = (n + panels.length) % panels.length; if (n === cur) return;
      timers.forEach(clearTimeout); timers = [];            // a new click interrupts the running switch
      cur = n;
      tabs.forEach(function (t, i) { t.setAttribute('aria-selected', i === cur ? 'true' : 'false'); t.tabIndex = i === cur ? 0 : -1; });
      moveKnob();                                            // the pill moves at once
      var instant = RM.matches, newP = panels[cur];
      var T = instant ? [0, 0, 0, 0] : [150, 400, 450, 900];
      later(function () {
        figs.forEach(function (f, i) { f.classList.toggle('on', i === cur); });
        figsm.forEach(function (f, i) { f.classList.toggle('on', i === cur); });
      }, T[0]);
      panels.forEach(function (p) { if (!p.hidden) $$('.ptxt', p).forEach(function (x) { x.classList.remove('in-fade'); x.classList.add('out'); }); });
      later(function () {
        panels.forEach(function (p) { if (p !== newP) { p.hidden = true; $$('.ptxt', p).forEach(function (x) { x.classList.remove('out', 'in-fade'); }); } });
        $$('.ptxt', newP).forEach(function (x) { x.classList.add('out'); });
        newP.hidden = false; $$('.bars i', newP).forEach(function (i) { i.classList.remove('f'); });
      }, T[1]);
      later(function () { $$('.ptxt', newP).forEach(function (x) { x.classList.add('in-fade'); x.classList.remove('out'); }); fillMobile(); }, T[2]);
      later(function () { fillBars(newP, instant); $$('.ptxt', newP).forEach(function (x) { x.classList.remove('in-fade'); }); }, T[3]);
      var live = $('[data-m=live]'); if (live) live.textContent = data[cur].id + ', ' + data[cur].name;
      if (fromUser) track('persona_view', { persona: data[cur].id });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { go(i, true); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = null;
        if (k === 'ArrowRight') n = cur + 1; else if (k === 'ArrowLeft') n = cur - 1; else if (k === 'Home') n = 0; else if (k === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); n = (n + tabs.length) % tabs.length; go(n, true); tabs[n].focus(); }
      });
    });
    // bars fill when the section first comes into view
    var pIO = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { fillBars(panels[cur]); pIO.disconnect(); } }, { threshold: 0.3 });
    pIO.observe($('#personas'));
    // mobile flip card
    if (mob) {
      fillMobile();
      var card = $('.pcardm', mob), who = $('[data-m=who]', mob), back = $('[data-m=back]', mob);
      var flip = function (on) {
        card.classList.toggle('flipped', on); who.setAttribute('aria-expanded', on ? 'true' : 'false'); back.setAttribute('aria-hidden', on ? 'false' : 'true');
        if (on) { fillBars($('[data-m=content]', mob)); $('[data-m=flipback]', mob).focus(); track('persona_who', { persona: data[cur].id }); } else who.focus();
      };
      who.addEventListener('click', function () { flip(true); });
      $('[data-m=flipback]', mob).addEventListener('click', function () { flip(false); });
      var step = function (d) { if (card.classList.contains('flipped')) { card.classList.remove('flipped'); back.setAttribute('aria-hidden', 'true'); who.setAttribute('aria-expanded', 'false'); } go(cur + d, true); };
      $('[data-m=next]', mob).addEventListener('click', function () { step(1); });
      $('[data-m=prev]', mob).addEventListener('click', function () { step(-1); });
      var sx = null;
      card.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
      card.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 45) step(dx > 0 ? 1 : -1); sx = null; });
    }
  }

  /* ------------------------------------------------------------------ carousels (RTL: next scrolls toward the left) */
  function carousel(track_, next, prev) {
    if (!track_) return;
    var stepW = function () { var c = track_.children[0]; var g = parseFloat(getComputedStyle(track_).columnGap || getComputedStyle(track_).gap) || 0; return c ? c.getBoundingClientRect().width + g : 300; };
    var smooth = RM.matches ? 'auto' : 'smooth';
    next && next.addEventListener('click', function () { track_.scrollBy({ left: -stepW(), behavior: smooth }); });
    prev && prev.addEventListener('click', function () { track_.scrollBy({ left: stepW(), behavior: smooth }); });
    var upd = function () {
      var max = track_.scrollWidth - track_.clientWidth, x = Math.abs(track_.scrollLeft);
      if (prev) prev.disabled = x < 4; if (next) next.disabled = x > max - 4;
      var nav = next && next.closest('.car-nav'); if (nav) nav.classList.toggle('nofit', max < 4);   // all cards visible: no arrows
    };
    track_.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd, { passive: true }); upd();
  }
  carousel($('[data-car]'), $('[data-car-next]'), $('[data-car-prev]'));
  carousel($('[data-fcar]'), $('[data-fcar-next]'), $('[data-fcar-prev]'));

  /* ------------------------------------------------------------------ pop-ups on <dialog> */
  var lastFocus = null;
  // page scroll locked while a pop-up is open and restored to the exact position (iOS ignores overflow:hidden alone)
  var lockY = 0, locked = false;
  function lockScroll(on) {
    var b = doc.body;
    if (on && !locked) { lockY = window.scrollY; b.style.position = 'fixed'; b.style.top = -lockY + 'px'; b.style.left = '0'; b.style.right = '0'; b.style.width = '100%'; locked = true; }
    else if (!on && locked) { b.style.position = ''; b.style.top = ''; b.style.left = ''; b.style.right = ''; b.style.width = ''; locked = false; root.style.scrollBehavior = 'auto'; window.scrollTo(0, lockY); root.style.scrollBehavior = ''; }
  }
  /* "למה קמה המעבדה?": two steps in one modal, always opens on step 01 */
  function whySet(d, n, animate, focusHead) {
    var cur = $('.st:not([hidden])', d), next = $('[data-why-st="' + n + '"]', d);
    $$('.tabs [data-why-go]', d).forEach(function (b) { if (b.getAttribute('data-why-go') === String(n)) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    var hh = $('h2', next); if (hh && hh.id) d.setAttribute('aria-labelledby', hh.id);
    var show = function () {
      if (cur && cur !== next) { cur.hidden = true; cur.classList.remove('out'); }
      next.hidden = false; var wb = $('.sc', next); if (wb) wb.scrollTop = 0; var cd = $('.card', d); if (cd) cd.classList.remove('scrolled');
      if (animate) { next.classList.add('out'); requestAnimationFrame(function () { requestAnimationFrame(function () { next.classList.remove('out'); }); }); }
      if (focusHead) { var h = $('h2', next); if (h) h.focus({ preventScroll: true }); }
    };
    if (!cur || cur === next) { show(); return; }
    if (animate) { cur.classList.add('out'); setTimeout(show, 200); } else show();
  }
  /* header "קבלת דו״ח מעבדה": opens the report sign-up pop-up on the homepage; from inner pages it goes to /#report, which opens it on load */
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('[data-report]'); if (!a || !doc.getElementById('dlg-report')) return;
    e.preventDefault(); var op = a;
    if (a.closest('#mmenu') && menuBtn) { setMenu(false); op = menuBtn; }
    openDlg('dlg-report', op);
  });
  if (location.hash === '#report' && doc.getElementById('dlg-report')) {
    history.replaceState(null, '', location.pathname + location.search);
    setTimeout(function () { openDlg('dlg-report', $('.nav-cta') || null); }, 300);
  }
  function whyReset(d) { whySet(d, 1, false, false); }
  // focus stays inside the modal (Tab and Shift+Tab cycle)
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var d = $('dialog.tabm[open], dialog.mag[open]'); if (!d) return;
    var f = $$('button:not([disabled])', d).filter(function (el) { return el.offsetParent !== null && !el.closest('[hidden]'); });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1], a = doc.activeElement;
    if (e.shiftKey && (a === first || !d.contains(a) || a === $('.card', d))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (a === last || !d.contains(a))) { e.preventDefault(); first.focus(); }
  });
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-why-go]'); if (!b) return;
    var d = b.closest('dialog'), n = b.getAttribute('data-why-go');
    if ($('[data-why-st="' + n + '"]', d).hidden === false) return;
    whySet(d, n, true, !b.closest('.tabs'));
  });
  function openDlg(id, opener) {
    var d = doc.getElementById(id); if (!d) return;
    lastFocus = opener || doc.activeElement;
    if (d.classList.contains('tabm')) whyReset(d);
    var sr = $('.scr', d); if (sr) sr.scrollTop = 0;
    if (!$('dialog[open]')) lockScroll(true);
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    var card = $('.card', d); if (card) { card.setAttribute('tabindex', '-1'); card.focus({ preventScroll: true }); }   // no focus ring on the × when opened by touch
    doc.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('show'); }); });
    var f = $('input:not(.hp),textarea,select', d); if (f && !MOB.matches) setTimeout(function () { f.focus(); }, 60);
  }
  function closeDlg(d, then, swap) {
    if (!d.open) return;
    d.classList.remove('show'); d.classList.add('closing');
    setTimeout(function () {
      d.classList.remove('closing', 'instant'); d.close ? d.close() : d.removeAttribute('open');
      if (!swap && !$('dialog[open]')) { doc.body.style.overflow = ''; lockScroll(false); }
      if (d.id === 'dlg-video') $('[data-vframe]', d).innerHTML = '';
      if (then) then(); else if (lastFocus && lastFocus.focus) lastFocus.focus();
    }, RM.matches ? 0 : 200);
  }
  doc.addEventListener('click', function (e) {
    var o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); var op = o; if (o.closest('#mmenu') && menuBtn) { setMenu(false); op = menuBtn; } openDlg(o.getAttribute('data-open'), op); return; }
    var c = e.target.closest('[data-close]');
    if (c) { closeDlg(c.closest('dialog')); return; }
    var sw = e.target.closest('[data-swap]');
    if (sw) { var d0 = sw.closest('dialog'), keep = lastFocus, d1 = doc.getElementById(sw.getAttribute('data-swap')); if (d1) d1.classList.add('instant'); closeDlg(d0, function () { openDlg(sw.getAttribute('data-swap'), keep); }, true); return; }
    if (e.target.matches && e.target.matches('dialog.pop, dialog.pop .shell')) closeDlg(e.target.closest('dialog'));
  });
  $$('dialog.tabm .sc').forEach(function (sc) {
    sc.addEventListener('scroll', function () { var cd = sc.closest('.card'); if (cd) cd.classList.toggle('scrolled', sc.scrollTop > 8); }, { passive: true });
  });
  $$('dialog.pop').forEach(function (d) {
    d.addEventListener('cancel', function (e) { e.preventDefault(); closeDlg(d); });
  });
  // YouTube, privacy-enhanced, loaded only on click
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-video-id]'); if (!b) return;
    var d = doc.getElementById('dlg-video'), fr = $('[data-vframe]', d);
    var ifr = doc.createElement('iframe');
    ifr.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(b.getAttribute('data-video-id')) + '?autoplay=1&rel=0&modestbranding=1';
    ifr.title = b.getAttribute('data-video-title') || 'וידאו';
    ifr.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; ifr.referrerPolicy = 'strict-origin-when-cross-origin';
    fr.innerHTML = ''; fr.appendChild(ifr);
    openDlg('dlg-video', b);
  });

  /* ------------------------------------------------------------------ forms */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function validate(form) {
    var ok = true, first = null;
    $$('.fld', form).forEach(function (f) {
      var c = $('input,textarea,select', f); if (!c || c.type === 'radio') return;
      var v = (c.value || '').trim(), bad = (c.required && !v) || (c.type === 'email' && v && !EMAIL.test(v));
      if (c.type === 'email' && c.required && !v) { var em = $('.em', f); if (em) em.textContent = 'צריך למלא את השדה הזה.'; }
      else if (c.type === 'email') { var em2 = $('.em', f); if (em2) em2.textContent = 'נראה שכתובת האימייל לא תקינה. כדאי לבדוק שוב.'; }
      f.classList.toggle('err', bad); c.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad) { ok = false; first = first || c; }
    });
    $$('.chk', form).forEach(function (l) {
      var c = $('input', l), bad = c.required && !c.checked; l.classList.toggle('err', bad); c.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad) { ok = false; first = first || c; }
    });
    if (first) first.focus();
    return ok;
  }
  function send(key, form) {
    var conf = CONFIG.forms[key] || {}, fd = new FormData(form), out = new FormData();
    if (!conf.action) return Promise.reject(new Error('form "' + key + '" is not connected yet (CONFIG.forms)'));
    Object.keys(conf.fields).forEach(function (k) {
      var target = conf.fields[k]; if (!target) return;
      var v = fd.get(k); if (k === 'consent') v = v ? 'כן' : ''; if (v !== null && v !== '') out.append(target, v);
    });
    if (conf.brevo) {
      // Brevo answers CORS with JSON {success:true|false} (checked 15.11.2026 from cherrixlabs.com), so this is a real confirmation
      out.append('email_address_check', ''); out.append('locale', 'he');
      return fetch(conf.action + '?isAjax=1', { method: 'POST', body: out })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (j) { if (!j || j.success !== true) throw new Error('brevo: ' + JSON.stringify((j && j.errors) || j)); });
    }
    return fetch(conf.action, { method: 'POST', mode: 'no-cors', body: out });
  }
  $$('.js-form').forEach(function (form) {
    $$('input,textarea', form).forEach(function (c) { c.addEventListener('input', function () { var f = c.closest('.fld,.chk'); if (f && f.classList.contains('err')) { f.classList.remove('err'); c.setAttribute('aria-invalid', 'false'); } }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var key = form.getAttribute('data-form'), msg = $('.form-msg', form), btn = $('[type=submit]', form);
      msg.className = 'form-msg'; msg.textContent = '';
      if ($('.hp', form).value) return;                 // spam trap filled: silently ignore
      if (!validate(form)) return;
      btn.disabled = true; form.setAttribute('aria-busy', 'true');
      send(key, form).then(function () {
        msg.className = 'form-msg ok'; msg.textContent = msg.getAttribute('data-ok'); form.reset();
        track('form_submit', { form_name: key });
      }).catch(function (err) {
        if (window.console) console.warn('[lab]', err.message);
        msg.className = 'form-msg bad'; msg.textContent = msg.getAttribute('data-bad');
      }).then(function () { btn.disabled = false; form.removeAttribute('aria-busy'); });
    });
  });

  /* ------------------------------------------------------------------ consent (opt-in, basic Consent Mode)
     Nothing from Google loads before "agree": GTM itself is injected only after consent. */
  var ck = $('#ck'), ckDlg = $('#dlg-cookies'), anSw = $('#ck-an');
  function readConsent() {
    try { var c = JSON.parse(localStorage.getItem(CONFIG.consentKey)); if (c && c.t && (Date.now() - c.t) < CONFIG.consentDays * 864e5) return c; } catch (e) {}
    return null;
  }
  function writeConsent(analytics) {
    var c = { v: 1, analytics: !!analytics, t: Date.now() };
    try { localStorage.setItem(CONFIG.consentKey, JSON.stringify(c)); } catch (e) {}
    return c;
  }
  function gtag() { window.dataLayer.push(arguments); }
  var gtmLoaded = false;
  function loadGTM() {
    if (gtmLoaded || !CONFIG.gtmId) return; gtmLoaded = true;
    gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    var s = doc.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtm.js?id=' + CONFIG.gtmId;
    doc.head.appendChild(s);
  }
  function dropGaCookies() {
    doc.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim(); if (!/^_ga|^_gid|^_gat/.test(n)) return;
      var host = location.hostname, parts = host.split('.');
      for (var i = 0; i < parts.length - 1; i++) {
        var dom = parts.slice(i).join('.');
        doc.cookie = n + '=; Max-Age=0; path=/; domain=' + dom; doc.cookie = n + '=; Max-Age=0; path=/; domain=.' + dom;
      }
      doc.cookie = n + '=; Max-Age=0; path=/';
    });
  }
  function apply(c, fresh) {
    if (c.analytics) { loadGTM(); if (fresh) track('consent_choice', { choice: 'analytics' }); }
    else if (gtmLoaded) { gtag('consent', 'update', { analytics_storage: 'denied' }); dropGaCookies(); }
    else dropGaCookies();
  }
  function hideBanner() { if (!ck) return; ck.classList.remove('show'); setTimeout(function () { ck.hidden = true; }, 400); }
  function showBanner() { if (!ck) return; ck.hidden = false; requestAnimationFrame(function () { requestAnimationFrame(function () { ck.classList.add('show'); }); }); }
  function choose(analytics) { var c = writeConsent(analytics); apply(c, true); hideBanner(); }
  if (ck) {
    var existing = readConsent();
    if (existing) apply(existing); else setTimeout(showBanner, 1000);
    doc.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ck]'); var p = e.target.closest('.js-cookie-prefs');
      if (p) { var c0 = readConsent(); anSw.setAttribute('aria-checked', c0 && c0.analytics ? 'true' : 'false'); openDlg('dlg-cookies', p); return; }
      if (!b) return;
      var k = b.getAttribute('data-ck');
      if (k === 'all') choose(true);
      else if (k === 'none') choose(false);
      else if (k === 'prefs') { var c1 = readConsent(); anSw.setAttribute('aria-checked', c1 && c1.analytics ? 'true' : 'false'); openDlg('dlg-cookies', b); }
      else if (k === 'save') { var had = gtmLoaded, on = anSw.getAttribute('aria-checked') === 'true'; choose(on); closeDlg(ckDlg); if (had && !on) setTimeout(function () { location.reload(); }, 250); }
    });
    anSw.addEventListener('click', function () { anSw.setAttribute('aria-checked', anSw.getAttribute('aria-checked') === 'true' ? 'false' : 'true'); });
  }

  /* ------------------------------------------------------------------ measurement events (go to GA4 only after consent) */
  doc.addEventListener('click', function (e) {
    var el = e.target.closest('[data-ev]'); if (el) track('ui_click', { ui_id: el.getAttribute('data-ev') });
  });
  if ('IntersectionObserver' in window) {
    var seen = {}, tin = {};
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var id = e.target.getAttribute('data-section');
        if (e.isIntersecting) { tin[id] = Date.now(); if (!seen[id]) { seen[id] = 1; track('section_view', { section: id }); } }
        else if (tin[id]) { var s = Math.round((Date.now() - tin[id]) / 1000); tin[id] = 0; if (s >= 2) track('section_time', { section: id, seconds: s }); }
      });
    }, { threshold: 0.4 });
    $$('[data-section]').forEach(function (s) { sio.observe(s); });
  }
  var depths = [25, 50, 75, 100], hit = {};
  window.addEventListener('scroll', function () {
    var h = root.scrollHeight - innerHeight; if (h <= 0) return;
    var p = (scrollY / h) * 100;
    depths.forEach(function (d) { if (p >= d - 1 && !hit[d]) { hit[d] = 1; track('scroll_depth', { percent: d }); } });
  }, { passive: true });

  /* ------------------------------------------------------------------ quotes wall page */
  var wall = $('[data-wall]');
  if (wall) {
    var cards = $$('.wcard', wall), LS = 'ml-hearts';
    var mine = {}; try { mine = JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) {}
    var fmt = function (n) { return n >= 1000 ? (Math.round(n / 100) / 10).toString().replace('.0', '') + 'K' : String(n); };
    var setHeart = function (btn, on, n) {
      btn.classList.toggle('on', on); btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      $('span', btn).textContent = fmt(n); btn.setAttribute('data-n', n);
      btn.setAttribute('aria-label', (on ? 'הסרת לב מהציטוט. ' : 'הוספת לב לציטוט. ') + 'מספר הלבבות: ' + n);
    };
    // Hearts storage (Firebase Firestore, Spark) is Stage 2: counts start at 0 and the choice is kept only in this browser for now.
    cards.forEach(function (c) {
      var id = c.getAttribute('data-id'), btn = $('.heart', c), base = parseInt(btn.getAttribute('data-n') || '0', 10);
      setHeart(btn, !!mine[id], base + (mine[id] ? 1 : 0));
      btn.addEventListener('click', function () {
        var on = !btn.classList.contains('on'), n = parseInt(btn.getAttribute('data-n'), 10) + (on ? 1 : -1);
        if (on) mine[id] = 1; else delete mine[id];
        try { localStorage.setItem(LS, JSON.stringify(mine)); } catch (e) {}
        setHeart(btn, on, Math.max(0, n));
        if (on && !RM.matches) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
        track('quote_heart', { quote_id: id, state: on ? 'on' : 'off' });
      });
    });
    // order: random by default; sort toggle "הכי אהובים" / "חדשים"
    var grid = $('.masonry', wall);
    var shuffle = function () { var a = cards.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
    var place = function (arr) { arr.forEach(function (c) { grid.appendChild(c); }); };
    place(shuffle());
    $$('[data-sort]', wall).forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-sort'), on = b.getAttribute('aria-pressed') !== 'true';
        $$('[data-sort]', wall).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        if (!on) { place(shuffle()); return; }
        b.setAttribute('aria-pressed', 'true');
        var arr = cards.slice().sort(function (a, c) {
          if (k === 'loved') return parseInt($('.heart', c).getAttribute('data-n'), 10) - parseInt($('.heart', a).getAttribute('data-n'), 10);
          return (c.getAttribute('data-date') || '').localeCompare(a.getAttribute('data-date') || '');
        });
        place(arr); track('quotes_sort', { sort: k });
      });
    });
    // card hover: turns on its vertical axis like a door, up to 16deg toward the pointer (desktop, fine pointer only)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !RM.matches) {
      cards.forEach(function (c) {
        var target = 0, ang = 0, raf = null;
        var loop = function () {
          ang += (target - ang) * 0.12;
          c.style.transform = 'perspective(1100px) rotateY(' + ang.toFixed(2) + 'deg)';
          c.style.setProperty('--sx', (-ang * 0.9).toFixed(1) + 'px');
          if (Math.abs(target - ang) > 0.05) raf = requestAnimationFrame(loop); else raf = null;
        };
        c.addEventListener('pointermove', function (e) {
          var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5;
          target = x * 32; if (!raf) raf = requestAnimationFrame(loop);
        });
        c.addEventListener('pointerleave', function () { target = 0; if (!raf) raf = requestAnimationFrame(loop); });
      });
    }
    // add-quote form: live counter, send stays grey until consent is checked
    var qf = $('[data-form=quote]');
    if (qf) {
      var ta = $('textarea', qf), cnt = $('[data-count]', qf), cb = $('input[type=checkbox]', qf), sb = $('[type=submit]', qf);
      var upd = function () { cnt.textContent = ta.value.length + '/200'; sb.disabled = !cb.checked; };
      ta.addEventListener('input', upd); cb.addEventListener('change', upd); upd();
      qf.addEventListener('reset', function () { setTimeout(upd, 0); });
    }
  }
})();
