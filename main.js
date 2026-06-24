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
    '.sec-head, .cmp, .flow, .card, .bench-figure, .bench-stats, .ladder-fig, .bench-line, .text-link, ' +
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

  /* ── living walkers (sakana-style beetles crossing the field) ── */
  const WB = `<svg class="wb" viewBox="0 0 120 150" fill="none">
    <g class="lg lg-a" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M40 50 L17 41 L7 47"/><path d="M84 73 L110 73 L118 86"/><path d="M39 99 L15 113 L8 128"/></g>
    <g class="lg lg-b" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M80 50 L103 41 L113 47"/><path d="M36 73 L10 73 L2 86"/><path d="M81 99 L105 113 L112 128"/></g>
    <g stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M53 17 C46 8 41 5 36 3"/><path d="M67 17 C74 8 79 5 84 3"/></g>
    <ellipse cx="60" cy="20" rx="12" ry="11" fill="currentColor"/>
    <path d="M46 30 Q60 27 74 30 L82 50 Q60 46 38 50 Z" fill="currentColor"/>
    <path d="M60 47 C84 47 92 66 92 90 C92 120 78 140 60 140 C42 140 28 120 28 90 C28 66 36 47 60 47 Z" fill="currentColor"/>
    <line x1="60" y1="52" x2="60" y2="134" stroke="var(--seam,#fff)" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>
    <g transform="translate(60,92) scale(0.40) translate(-50,-50)"><path d="M50 50 L61 50 L61 39 L39 39 L39 61 L72 61 L72 28 L28 28 L28 72 L83 72 L83 17 L17 17" fill="none" stroke="var(--seam,#fff)" stroke-width="6" stroke-linecap="square"/><circle cx="50" cy="50" r="3.4" fill="var(--seam,#fff)"/></g>
  </svg>`;
  const buildWalkers = (stage, configs) => {
    if (!stage) return;
    const frag = document.createDocumentFragment();
    configs.forEach((c) => {
      const w = document.createElement('div');
      // legs are imperceptible below ~52px — skip their two keyframe animations there
      w.className = 'walker' + (c.dir < 0 ? ' rtl' : '') + (c.size < 52 ? ' no-legs' : '');
      w.style.cssText = `--lane:${c.lane}%;--size:${c.size}px;--dur:${c.dur}s;--delay:${c.delay}s;--op:${c.op};--bd:${c.bob}s;--ld:${c.leg}s`;
      if (c.color) w.style.color = c.color;
      w.innerHTML = `<div class="walker-bob">${WB}</div>`;
      frag.appendChild(w);
    });
    stage.appendChild(frag);
  };
  const small = matchMedia('(max-width:640px)').matches;
  const heroWalk = [
    { lane: 17, size: 104, dur: 34, delay: -5,  op: .5,  dir: 1,  bob: 2.3, leg: .8,  color: '#9b6bff' },
    { lane: 63, size: 62,  dur: 26, delay: -13, op: .36, dir: -1, bob: 1.9, leg: .66 },
    { lane: 39, size: 46,  dur: 42, delay: -22, op: .28, dir: 1,  bob: 2.6, leg: .9 },
    { lane: 79, size: 54,  dur: 23, delay: -3,  op: .32, dir: -1, bob: 1.7, leg: .6 },
    { lane: 7,  size: 40,  dur: 37, delay: -18, op: .24, dir: 1,  bob: 2.1, leg: .85 },
    { lane: 51, size: 34,  dur: 29, delay: -9,  op: .22, dir: -1, bob: 1.5, leg: .7 },
  ];
  buildWalkers($('#swarm'), small ? heroWalk.filter((_, i) => i < 3) : heroWalk);
  // dark "core" band walkers (brighter on black)
  buildWalkers($('#coreWalk'), [
    { lane: 22, size: 90,  dur: 30, delay: -7,  op: .85, dir: 1,  bob: 2.2, leg: .74, color: '#b491ff' },
    { lane: 66, size: 58,  dur: 24, delay: -15, op: .7,  dir: -1, bob: 1.8, leg: .62, color: '#8a5cff' },
    { lane: 44, size: 40,  dur: 36, delay: -2,  op: .6,  dir: 1,  bob: 2.5, leg: .82, color: '#c9b6ff' },
    { lane: 84, size: 46,  dur: 20, delay: -11, op: .55, dir: -1, bob: 1.6, leg: .58, color: '#9b6bff' },
  ].filter((_, i) => small ? i < 2 : true));

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
