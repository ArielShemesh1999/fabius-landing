/* fabius — landing interactions. Progressive enhancement, reduced-motion aware. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ── nav: frosted on scroll ─────────────────────────────── */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── mobile menu ────────────────────────────────────────── */
  const toggle = $('#navToggle'), menu = $('#mobileMenu');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
    menu.hidden = !open;
    if (!open && menu.contains(document.activeElement)) toggle.focus();
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  matchMedia('(min-width:901px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ── copy buttons ───────────────────────────────────────── */
  $$('[data-copy]').forEach((box) => {
    const btn = $('.copy', box);
    if (!btn) return;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(box.dataset.copy);
        const old = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('done');
        setTimeout(() => { btn.textContent = old; btn.classList.remove('done'); }, 1600);
      } catch (_) { /* clipboard blocked — no-op */ }
    });
  });

  /* ── scroll reveals ─────────────────────────────────────── */
  const revealTargets = $$(
    '.sec-head, .cmp, .flow, .card, .bench-figure, .fam-figure, .ladder-fig, .bench-line, .text-link, ' +
    '.formula-band, .gate-fig, .math-work, ' +
    '.research-copy, .tool-list li, .install-in, .idea-in, .core-in, .latin'
  );
  if (!reduce && 'IntersectionObserver' in window) {
    revealTargets.forEach((el, i) => {
      el.classList.add('reveal');
      // gentle stagger only within tight groups
      if (el.matches('.card, .tool-list li')) el.style.transitionDelay = (i % 3) * 70 + 'ms';
    });
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        obs.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealTargets.forEach((el) => io.observe(el));
  }

  /* ── idea emblem: draw-in spiral ────────────────────────── */
  const ideaPath = $('#ideaPath');
  if (ideaPath && !reduce && 'IntersectionObserver' in window) {
    const len = ideaPath.getTotalLength();
    ideaPath.style.strokeDasharray = len;
    ideaPath.style.strokeDashoffset = len;
    ideaPath.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)';
    new IntersectionObserver((e, o) => {
      e.forEach((en) => { if (en.isIntersecting) { ideaPath.style.strokeDashoffset = '0'; o.disconnect(); } });
    }, { threshold: 0.4 }).observe($('#ideaEmblem'));
  }

  /* ── living walkers — the nine fabius-beetle variants crossing the field ── */
  const VARIANTS = ['bug-router','bug-parcus','bug-disciplina','bug-decor','bug-cohors','bug-archivum','bug-mercatus','bug-praesidium','bug-ludus'];
  const symCache = {};
  const symMarkup = (id) => {
    if (symCache[id] === undefined) {
      const sym = document.getElementById(id);
      symCache[id] = sym ? Array.from(sym.children).map((n) => n.outerHTML).join('') : '';
    }
    return symCache[id];
  };
  let walkerIdx = 0;
  const buildWalkers = (stage, configs) => {
    if (!stage) return;
    const frag = document.createDocumentFragment();
    configs.forEach((c) => {
      const w = document.createElement('div');
      // legs are imperceptible below ~52px — skip their keyframe animations there
      w.className = 'walker' + (c.dir < 0 ? ' rtl' : '') + (c.size < 52 ? ' no-legs' : '');
      w.style.cssText = `--lane:${c.lane}%;--size:${c.size}px;--dur:${c.dur}s;--delay:${c.delay}s;--op:${c.op};--bd:${c.bob}s;--ld:${c.leg}s`;
      if (c.color) w.style.color = c.color;
      const v = c.v || VARIANTS[walkerIdx++ % VARIANTS.length];
      w.innerHTML = `<div class="walker-bob"><svg class="wb" viewBox="0 0 44 48" fill="currentColor">${symMarkup(v)}</svg></div>`;
      frag.appendChild(w);
    });
    stage.appendChild(frag);
  };
  const small = matchMedia('(max-width:640px)').matches;
  // two-tier swarm: a few LARGE + SLOW anchors (graceful depth) and MANY tiny + very fast ones
  const heroWalk = [
    // large, slow anchors
    { lane: 16, size: 80, dur: 32, delay: -5,  op: .46, dir: 1,  bob: 1.9, leg: .74, color: '#9b6bff' },
    { lane: 70, size: 70, dur: 36, delay: -16, op: .4,  dir: -1, bob: 2.1, leg: .82 },
    { lane: 44, size: 54, dur: 24, delay: -9,  op: .3,  dir: 1,  bob: 1.6, leg: .64 },
    // many small, very fast
    { lane: 8,  size: 22, dur: 4,   delay: -1, op: .24, dir: 1,  bob: .5 },
    { lane: 30, size: 18, dur: 3,   delay: -2, op: .2,  dir: -1, bob: .44 },
    { lane: 52, size: 20, dur: 3.4, delay: -1, op: .22, dir: 1,  bob: .46 },
    { lane: 84, size: 16, dur: 2.6, delay: -2, op: .18, dir: -1, bob: .4 },
    { lane: 38, size: 24, dur: 4.4, delay: -3, op: .24, dir: 1,  bob: .5 },
    { lane: 62, size: 14, dur: 2.4, delay: -1, op: .16, dir: -1, bob: .38 },
    { lane: 22, size: 18, dur: 3.2, delay: -2, op: .2,  dir: 1,  bob: .44 },
    { lane: 76, size: 20, dur: 3.6, delay: -4, op: .2,  dir: 1,  bob: .46 },
    { lane: 48, size: 16, dur: 2.8, delay: -1, op: .18, dir: -1, bob: .4 },
    { lane: 90, size: 18, dur: 3,   delay: -3, op: .2,  dir: -1, bob: .42 },
    { lane: 14, size: 14, dur: 2.5, delay: -2, op: .16, dir: 1,  bob: .38 },
    { lane: 58, size: 22, dur: 4,   delay: -1, op: .22, dir: 1,  bob: .48 },
    { lane: 34, size: 16, dur: 2.7, delay: -4, op: .18, dir: -1, bob: .4 },
    { lane: 80, size: 14, dur: 2.3, delay: -1, op: .16, dir: 1,  bob: .36 },
  ];
  buildWalkers($('#swarm'), small ? heroWalk.filter((_, i) => i < 9) : heroWalk);
  // dark "core" band — same two-tier idea, brighter on black
  buildWalkers($('#coreWalk'), [
    { lane: 20, size: 70, dur: 28, delay: -6, op: .82, dir: 1,  bob: 1.8, leg: .72, color: '#b491ff' },
    { lane: 68, size: 50, dur: 21, delay: -11, op: .66, dir: -1, bob: 1.5, leg: .6,  color: '#8a5cff' },
    { lane: 44, size: 20, dur: 3.6, delay: -2, op: .6,  dir: 1,  bob: .46, color: '#c9b6ff' },
    { lane: 86, size: 16, dur: 2.8, delay: -1, op: .55, dir: -1, bob: .4,  color: '#9b6bff' },
    { lane: 34, size: 18, dur: 3,   delay: -3, op: .55, dir: 1,  bob: .42, color: '#b491ff' },
    { lane: 58, size: 14, dur: 2.4, delay: -1, op: .5,  dir: -1, bob: .38, color: '#c9b6ff' },
    { lane: 78, size: 18, dur: 3.2, delay: -2, op: .5,  dir: 1,  bob: .44, color: '#9b6bff' },
    { lane: 14, size: 16, dur: 2.6, delay: -1, op: .52, dir: -1, bob: .4,  color: '#b491ff' },
    { lane: 50, size: 14, dur: 2.3, delay: -3, op: .48, dir: 1,  bob: .36, color: '#c9b6ff' },
  ].filter((_, i) => small ? i < 5 : true));

  /* ── active section in nav ──────────────────────────────── */
  const links = $$('.nav-links a');
  if (links.length && 'IntersectionObserver' in window) {
    const map = new Map();
    links.forEach((a) => { const id = a.getAttribute('href').slice(1); const s = document.getElementById(id); if (s) map.set(s, a); });
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const a = map.get(en.target);
        if (a && en.isIntersecting) {
          links.forEach((l) => l.removeAttribute('aria-current'));
          a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, s) => spy.observe(s));
  }
})();
