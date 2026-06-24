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

  /* ── emblem: draw-in "creation" on every spiral it appears (not nav/footer) ── */
  const emblems = $$('.draw-emblem');
  if (emblems.length && !reduce && 'IntersectionObserver' in window) {
    emblems.forEach((svg) => {
      const path = $('.draw-spiral', svg), dot = $('.draw-dot', svg);
      if (!path) return;
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)';
      if (dot) { dot.style.opacity = '0'; dot.style.transition = 'opacity .4s ease .95s'; }
    });
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const path = $('.draw-spiral', en.target), dot = $('.draw-dot', en.target);
        if (path) path.style.strokeDashoffset = '0';
        if (dot) dot.style.opacity = '1';
        obs.unobserve(en.target);
      });
    }, { threshold: 0.4 });
    emblems.forEach((svg) => io.observe(svg));
  }

  /* ── explainer video: play-in-view + click toggle ──────── */
  const dVideo = $('#demoVideo'), dFrame = $('#demoFrame'), dToggle = $('#demoToggle');
  if (dVideo && dFrame) {
    const setPlay = (play) => {
      if (play) { dVideo.play().then(() => dFrame.classList.add('playing')).catch(() => {}); }
      else { dVideo.pause(); }
      if (dToggle) dToggle.setAttribute('aria-label', play ? 'Pause the explainer' : 'Play the explainer');
    };
    const toggle = () => setPlay(dVideo.paused);
    dToggle && dToggle.addEventListener('click', toggle);
    dVideo.addEventListener('click', toggle);
    dVideo.addEventListener('play', () => dFrame.classList.add('playing'));
    dVideo.addEventListener('pause', () => dFrame.classList.remove('playing'));
    if (!reduce && 'IntersectionObserver' in window) {
      new IntersectionObserver((ents) => {
        ents.forEach((en) => setPlay(en.isIntersecting && en.intersectionRatio >= 0.4));
      }, { threshold: [0, 0.4, 0.75] }).observe(dFrame);
    }
  }

  /* ── living walkers (sakana-style beetles crossing the field) ── */
  const WB = `<svg class="wb" viewBox="0 0 120 150" fill="none">
    <g stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path class="leg la" style="--ox:40px;--oy:50px" d="M40 50 L17 41 L7 47"/>
      <path class="leg lb" style="--ox:80px;--oy:50px" d="M80 50 L103 41 L113 47"/>
      <path class="leg lb" style="--ox:36px;--oy:73px" d="M36 73 L10 73 L2 86"/>
      <path class="leg la" style="--ox:84px;--oy:73px" d="M84 73 L110 73 L118 86"/>
      <path class="leg la" style="--ox:39px;--oy:99px" d="M39 99 L15 113 L8 128"/>
      <path class="leg lb" style="--ox:81px;--oy:99px" d="M81 99 L105 113 L112 128"/>
    </g>
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
  // two-tier swarm: a few LARGE + SLOW anchors (graceful depth) and MANY tiny + very fast ones
  const heroWalk = [
    // large, slow anchors
    { lane: 16, size: 102, dur: 32, delay: -5,  op: .46, dir: 1,  bob: 1.9, leg: .74, color: '#9b6bff' },
    { lane: 70, size: 90,  dur: 36, delay: -16, op: .4,  dir: -1, bob: 2.1, leg: .82 },
    { lane: 44, size: 56,  dur: 24, delay: -9,  op: .3,  dir: 1,  bob: 1.6, leg: .64 },
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
    { lane: 20, size: 84, dur: 28, delay: -6, op: .82, dir: 1,  bob: 1.8, leg: .72, color: '#b491ff' },
    { lane: 68, size: 52, dur: 21, delay: -11, op: .66, dir: -1, bob: 1.5, leg: .6,  color: '#8a5cff' },
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
