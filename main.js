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
  // a dense, fast swarm of mostly-small beetles — the scale spreading & moving quickly,
  // with a couple of larger anchors for depth
  const heroWalk = [
    { lane: 15, size: 70,  dur: 12,  delay: -3,  op: .42, dir: 1,  bob: 1.0, leg: .38, color: '#9b6bff' },
    { lane: 72, size: 56,  dur: 10,  delay: -5,  op: .34, dir: -1, bob: .9,  leg: .34 },
    { lane: 40, size: 30,  dur: 6,   delay: -2,  op: .26, dir: 1,  bob: .62 },
    { lane: 84, size: 26,  dur: 5,   delay: -4,  op: .24, dir: -1, bob: .55 },
    { lane: 8,  size: 24,  dur: 6.5, delay: -1,  op: .22, dir: 1,  bob: .6 },
    { lane: 56, size: 22,  dur: 4.5, delay: -3,  op: .2,  dir: -1, bob: .5 },
    { lane: 28, size: 20,  dur: 4,   delay: -2,  op: .2,  dir: 1,  bob: .48 },
    { lane: 64, size: 34,  dur: 7.5, delay: -6,  op: .26, dir: 1,  bob: .7 },
    { lane: 48, size: 18,  dur: 3.6, delay: -1,  op: .18, dir: -1, bob: .44 },
    { lane: 90, size: 22,  dur: 5,   delay: -5,  op: .2,  dir: 1,  bob: .52 },
    { lane: 34, size: 26,  dur: 5.5, delay: -4,  op: .22, dir: -1, bob: .56 },
    { lane: 78, size: 18,  dur: 3.4, delay: -2,  op: .18, dir: -1, bob: .42 },
    { lane: 20, size: 30,  dur: 6,   delay: -7,  op: .24, dir: 1,  bob: .64 },
  ];
  buildWalkers($('#swarm'), small ? heroWalk.filter((_, i) => i < 7) : heroWalk);
  // dark "core" band — same fast swarm, brighter on black
  buildWalkers($('#coreWalk'), [
    { lane: 20, size: 62, dur: 11,  delay: -4, op: .85, dir: 1,  bob: 1.0, leg: .36, color: '#b491ff' },
    { lane: 70, size: 40, dur: 8,   delay: -6, op: .72, dir: -1, bob: .8,  color: '#8a5cff' },
    { lane: 44, size: 26, dur: 5,   delay: -2, op: .62, dir: 1,  bob: .58, color: '#c9b6ff' },
    { lane: 86, size: 30, dur: 6,   delay: -5, op: .6,  dir: -1, bob: .6,  color: '#9b6bff' },
    { lane: 32, size: 20, dur: 3.8, delay: -1, op: .5,  dir: 1,  bob: .46, color: '#b491ff' },
    { lane: 58, size: 22, dur: 4.4, delay: -3, op: .52, dir: -1, bob: .5,  color: '#c9b6ff' },
    { lane: 78, size: 18, dur: 3.4, delay: -2, op: .46, dir: 1,  bob: .42, color: '#9b6bff' },
  ].filter((_, i) => small ? i < 4 : true));

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
