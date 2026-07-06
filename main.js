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
    '.sec-head, .cmp, .pt-console, .card, .fam-figure, .ladder-fig, .bench-line, .text-link, ' +
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

  /* ── explainer video: play-in-view + auto-hiding controls ──────── */
  const dVideo = $('#demoVideo'), dFrame = $('#demoFrame'), dToggle = $('#demoToggle');
  if (dVideo && dFrame) {
    let hideTimer = null;
    // keep the button up only while sitting on the poster (so it stays discoverable)
    const atPoster = () => dVideo.paused && dVideo.currentTime < 0.06;
    const showControls = () => {
      dFrame.classList.add('show-controls');
      clearTimeout(hideTimer);
      if (!atPoster()) hideTimer = setTimeout(() => dFrame.classList.remove('show-controls'), 2600);
    };
    const hideControls = () => { clearTimeout(hideTimer); dFrame.classList.remove('show-controls'); };
    const setPlay = (play) => {
      if (play) dVideo.play().catch(() => {});
      else dVideo.pause();
      if (dToggle) dToggle.setAttribute('aria-label', play ? 'Pause the explainer' : 'Play the explainer');
    };
    const toggle = () => { setPlay(dVideo.paused); showControls(); };
    dToggle && dToggle.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    dVideo.addEventListener('click', toggle);
    dVideo.addEventListener('play', () => { dFrame.classList.add('playing'); showControls(); });
    dVideo.addEventListener('pause', () => { dFrame.classList.remove('playing'); showControls(); });
    dFrame.addEventListener('pointermove', showControls);
    dFrame.addEventListener('pointerleave', () => { if (!atPoster()) hideControls(); });
    // tap/click anywhere outside the video dismisses the controls
    document.addEventListener('pointerdown', (e) => { if (!dFrame.contains(e.target)) hideControls(); });
    showControls();
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
  const coreWalk = [
    { lane: 20, size: 84, dur: 28, delay: -6, op: .82, dir: 1,  bob: 1.8, leg: .72, color: '#b491ff' },
    { lane: 68, size: 52, dur: 21, delay: -11, op: .66, dir: -1, bob: 1.5, leg: .6,  color: '#8a5cff' },
    { lane: 44, size: 20, dur: 3.6, delay: -2, op: .6,  dir: 1,  bob: .46, color: '#c9b6ff' },
    { lane: 86, size: 16, dur: 2.8, delay: -1, op: .55, dir: -1, bob: .4,  color: '#9b6bff' },
    { lane: 34, size: 18, dur: 3,   delay: -3, op: .55, dir: 1,  bob: .42, color: '#b491ff' },
    { lane: 58, size: 14, dur: 2.4, delay: -1, op: .5,  dir: -1, bob: .38, color: '#c9b6ff' },
    { lane: 78, size: 18, dur: 3.2, delay: -2, op: .5,  dir: 1,  bob: .44, color: '#9b6bff' },
    { lane: 14, size: 16, dur: 2.6, delay: -1, op: .52, dir: -1, bob: .4,  color: '#b491ff' },
    { lane: 50, size: 14, dur: 2.3, delay: -3, op: .48, dir: 1,  bob: .36, color: '#c9b6ff' },
  ].filter((_, i) => small ? i < 5 : true);
  // defer the decorative swarm DOM build off the critical path → smoother first paint / input
  const buildSwarms = () => {
    buildWalkers($('#swarm'), small ? heroWalk.filter((_, i) => i < 9) : heroWalk);
    buildWalkers($('#coreWalk'), coreWalk);
  };
  if ('requestIdleCallback' in window) requestIdleCallback(buildSwarms, { timeout: 700 });
  else setTimeout(buildSwarms, 150);

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

/* ── the mechanism: live dispatch console (praetorium) ─────────────
   Give fabius a task; watch it Sense → Classify → Route → Strike →
   Prove → Compound and dispatch to the right layer(s). Reduced-motion
   aware (instant, no typing); starts once the console scrolls in. */
(() => {
  'use strict';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const svg = $('#ptDiagram'), stepsWrap = $('#ptSteps'), chipsWrap = $('#ptChips');
  if (!svg || !stepsWrap || !chipsWrap) return;   // section absent — no-op

  const NS = 'http://www.w3.org/2000/svg';
  const svgel = (t, a = {}, kids = []) => {
    const n = document.createElementNS(NS, t);
    for (const k in a) { if (k === 'text') n.textContent = a[k]; else n.setAttribute(k, a[k]); }
    (Array.isArray(kids) ? kids : [kids]).forEach((c) => c && n.appendChild(c));
    return n;
  };
  const sleep = (ms) => new Promise((r) => setTimeout(r, RM ? 0 : ms));
  const CODE = (id) => id === 'parcus' ? 'fabius-parcus' : id === 'router' ? 'fabius' : 'fabius-' + id;

  const RING = ['disciplina','decor','cohors','archivum','mercatus','praesidium','ludus','catena','machina','scientia','doctrina','fortuna','concilium'];
  const STEPS = ['Sense','Classify','Route','Strike','Prove','Compound'];
  const VERB = { Sense:'read', Classify:'weigh', Route:'dispatch', Strike:'build', Prove:'verify', Compound:'file' };
  const AX = [['memory','memory'],['tools','tools·action'],['planning','planning'],['domain','domain']];
  const A = (m, t, p, d) => ({ memory:m, tools:t, planning:p, domain:d });

  const SC = {
    landing:{ label:'Build a landing page', tag:'design', task:'Build me a landing page for my app',
      axes:A(0,1,3,3), tier:'strong', mach:'one agent', lead:'decor', layers:['disciplina','decor'],
      loop:{ Sense:'read context · no existing design system · small surface, no repo map needed',
        Classify:'load — planning HIGH · domain(design) HIGH · tools low · memory low → tier <span class="hl">strong</span> (design judgment, not mechanical)',
        Route:'process first: <span class="hl">disciplina</span> brainstorms the spec → <span class="hl">decor</span> executes · under parcus · one agent, no swarm',
        Strike:'smallest correct page — design tokens, one accent, one elevation, real copy',
        Prove:'headless screenshot · <span class="g">0 overflow</span> · contrast AA · single h1',
        Compound:'file the design tokens → the next page starts ahead' } },
    secure:{ label:'Is this contract secure?', tag:'security', task:'Is this smart contract secure?',
      axes:A(0,2,2,3), tier:'strong', mach:'studio · multi-layer', lead:'praesidium', layers:['disciplina','praesidium','catena'],
      loop:{ Sense:'read the contract · map the trust boundaries first',
        Classify:'domain(security + on-chain) HIGH · tools med · planning med → tier <span class="hl">strong</span> (a threat model is not haiku work)',
        Route:'<span class="hl">praesidium</span> leads (defensive) + <span class="hl">catena</span> (money-safe on-chain) · disciplina plans the pass · parcus underneath',
        Strike:'STRIDE per boundary → each finding ships severity + fix + a regression test',
        Prove:'the regression test runs <span class="g">red → green</span> · the re-entrancy path is closed',
        Compound:'file the vuln class → it’s caught for free next time' } },
    backtest:{ label:'Backtest a strategy', tag:'markets', task:'Backtest this trading strategy for me',
      axes:A(0,2,2,3), tier:'strong', mach:'one agent', lead:'fortuna', layers:['disciplina','fortuna'],
      loop:{ Sense:'read the strategy rules · pull the price series',
        Classify:'domain(markets) HIGH · tools med · planning med → tier <span class="hl">strong</span>',
        Route:'<span class="hl">fortuna</span> leads — analysis, never advice · disciplina plans · parcus underneath',
        Strike:'honest backtest — out-of-sample, costs modeled, position size risk-bounded',
        Prove:'walk-forward holds · <span class="g">no look-ahead leak</span> · the edge survives fees',
        Compound:'file the edge and its decay window' } },
    remember:{ label:'Remember this', tag:'memory', task:'Remember this API-key convention for next time',
      axes:A(3,0,0,0), tier:'cheap', mach:'single tool', lead:'archivum', layers:['archivum'],
      loop:{ Sense:'no map needed · this is a write, not a search',
        Classify:'memory HIGH · every other axis low → tier <span class="g">cheap</span> (mechanical, low-judgment)',
        Route:'<span class="hl">archivum</span> only · parcus underneath · don’t pay opus to file a note',
        Strike:'one memory file · one index pointer · interlinked to what it relates to',
        Prove:'recall test — a cold next session retrieves it',
        Compound:'this <em>is</em> compounding — the knowledge base just grew' } },
    game:{ label:'Make a small game', tag:'game', task:'Make me a small browser game',
      axes:A(0,1,2,3), tier:'strong', mach:'studio · multi-layer', lead:'ludus', layers:['disciplina','decor','ludus'],
      loop:{ Sense:'read the pitch · find the core loop before anything else',
        Classify:'domain(game) HIGH · design med · planning med → tier <span class="hl">strong</span>',
        Route:'<span class="hl">ludus</span> leads a studio → <span class="hl">decor</span> (pixel art) + disciplina (plan) · parcus underneath',
        Strike:'core loop first · game feel deliberate · a jam-sized cut — ship one, not ten',
        Prove:'it’s playable · <span class="g">win/lose state fires</span> · the loop is actually fun',
        Compound:'file what made it feel good' } },
    council:{ label:'Ask several models', tag:'ensemble', task:'This call is high-stakes — ask several models',
      axes:A(0,1,3,2), tier:'strong', mach:'council · gated', lead:'concilium', layers:['concilium'],
      loop:{ Sense:'high-stakes · genuinely contested · one model’s miss is costly',
        Classify:'judgment HIGH → tier <span class="hl">strong</span> · machinery → <span class="hl">council</span> (expensive — gate first)',
        Route:'<span class="hl">concilium</span> · N models answer blind → anonymized peer-review → a chairman synthesizes · parcus underneath',
        Strike:'one better answer — consensus surfaced, dissent kept, not averaged to mush',
        Prove:'the panel’s disagreement is <span class="g">shown, not hidden</span>',
        Compound:'file the answer + why it beat the lone take' } },
    rename:{ label:'Rename a variable', tag:'lean', task:'Rename a variable across the whole repo',
      axes:A(0,0,0,0), tier:'cheap', mach:'stay in core', lead:'parcus', layers:[],
      loop:{ Sense:'read the call sites · mechanical, bounded, known',
        Classify:'load — every axis low · zero specialist load → tier <span class="g">cheap</span>',
        Route:'<span class="hl">stay in the lean core</span> · no layer pulled · no swarm · don’t spend opus to rename',
        Strike:'surgical rename · match the surrounding style · nothing extra',
        Prove:'grep clean · <span class="g">typecheck green</span>',
        Compound:'nothing worth filing — and that is the correct call' } },
  };
  const ORDER = ['landing','secure','backtest','remember','game','council','rename'];

  /* build the dispatch diagram */
  const CX = 280, CY = 195, RX = 225, RY = 150;
  const nodeEls = {}, linkEls = {}, pos = {};
  RING.forEach((id, i) => {
    const ang = -Math.PI / 2 + (i / RING.length) * Math.PI * 2;
    pos[id] = { x: CX + Math.cos(ang) * RX, y: CY + Math.sin(ang) * RY };
    const ln = svgel('line', { x1: CX, y1: CY, x2: pos[id].x, y2: pos[id].y, class: 'pt-lnk' });
    svg.appendChild(ln); linkEls[id] = ln;
  });
  const pbar = svgel('g', { class: 'pt-pbar' });
  pbar.appendChild(svgel('rect', { x: 60, y: 388, width: 440, height: 30, rx: 8 }));
  pbar.appendChild(svgel('text', { x: 280, y: 407, text: 'fabius-parcus · always on, underneath' }));
  svg.appendChild(pbar);
  RING.forEach((id) => {
    const w = 74, h = 30, { x, y } = pos[id];
    const g = svgel('g', { class: 'pt-node', transform: `translate(${(x - w / 2).toFixed(1)},${(y - h / 2).toFixed(1)})` });
    g.appendChild(svgel('rect', { x: 0, y: 0, width: w, height: h, rx: 8 }));
    g.appendChild(svgel('text', { x: w / 2, y: h / 2 + 3.4, text: id }));
    svg.appendChild(g); nodeEls[id] = g;
  });
  const hub = svgel('g', { class: 'pt-hub', transform: `translate(${CX - 52},${CY - 30})` });
  hub.appendChild(svgel('rect', { x: 0, y: 0, width: 104, height: 60, rx: 12 }));
  hub.appendChild(svgel('text', { x: 52, y: 26, text: 'fabius', 'font-size': 13 }));
  hub.appendChild(svgel('text', { x: 52, y: 42, text: 'ROUTER', class: 'sub' }));
  svg.appendChild(hub);

  /* reasoning-stream skeleton */
  const stepEls = {};
  STEPS.forEach((s, i) => {
    const d = document.createElement('div'); d.className = 'pt-step';
    d.innerHTML = `<div class="pt-sh"><span class="pt-idx">${i + 1}</span><span class="pt-nm">${s}</span><span class="pt-verb">${VERB[s]}</span></div>`
      + `<div class="pt-txt"></div>${s === 'Classify' ? '<div class="pt-meters" hidden></div><div class="pt-tierbadge" hidden></div>' : ''}`;
    stepsWrap.appendChild(d); stepEls[s] = d;
  });

  /* chips */
  const selectChip = (key) => chipsWrap.querySelectorAll('.pt-chip')
    .forEach((c) => c.setAttribute('aria-pressed', c.dataset.key === key ? 'true' : 'false'));
  ORDER.forEach((key, i) => {
    const sc = SC[key];
    const b = document.createElement('button'); b.type = 'button'; b.className = 'pt-chip';
    b.dataset.key = key; b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    b.innerHTML = `${sc.label}<span class="pt-tag">${sc.tag}</span>`;
    b.addEventListener('click', () => { $('#ptTask').value = sc.task; selectChip(key); run(key); });
    chipsWrap.appendChild(b);
  });

  let runToken = 0;
  async function typeInto(node, html, token) {
    node.innerHTML = html;
    if (RM) return;
    const full = node.textContent;
    node.innerHTML = ''; const cur = document.createElement('span'); cur.className = 'cur'; node.appendChild(cur);
    let out = '';
    for (let i = 0; i < full.length; i++) {
      if (token !== runToken) return;
      out += full[i]; node.textContent = out; node.appendChild(cur);
      await sleep(full[i] === ' ' ? 7 : 13);
    }
    node.innerHTML = html;
  }
  function resetRun() {
    Object.values(stepEls).forEach((s) => { s.classList.remove('on'); s.querySelector('.pt-txt').innerHTML = ''; });
    const m = stepEls.Classify.querySelector('.pt-meters'), t = stepEls.Classify.querySelector('.pt-tierbadge');
    m.hidden = true; m.innerHTML = ''; t.hidden = true; t.innerHTML = '';
    Object.values(nodeEls).forEach((n) => n.classList.remove('active', 'lead'));
    Object.values(linkEls).forEach((l) => l.classList.remove('active'));
    hub.classList.remove('live'); pbar.classList.remove('on');
    $('#ptLead').textContent = '—'; $('#ptMach').textContent = '—'; $('#ptTier').textContent = '—';
  }
  async function run(arg) {
    const sc = typeof arg === 'string' ? SC[arg] : arg;
    if (!sc) return;
    runToken++; const token = runToken;
    resetRun();   // Dispatch stays clickable mid-run — a new task just interrupts (runToken guards the rest)
    $('#ptClock').textContent = 'running…'; $('#ptDispSt').textContent = 'routing…';
    for (const step of STEPS) {
      if (token !== runToken) return;
      $('#ptPhase').textContent = '→ ' + step;
      const node = stepEls[step]; node.classList.add('on');
      const txt = node.querySelector('.pt-txt');
      if (step === 'Classify') {
        const m = node.querySelector('.pt-meters'); m.hidden = false;
        AX.forEach(([kk, lab]) => {
          const v = sc.axes[kk], pct = [8, 38, 68, 100][v], hi = v >= 3, lo = v === 0;
          const mm = document.createElement('div'); mm.className = 'pt-meter' + (hi ? ' hi' : '') + (lo ? ' lo' : '');
          mm.innerHTML = `<div class="pt-mt"><span>${lab}</span><span class="pt-mv">${['—', 'low', 'med', 'HIGH'][v]}</span></div>`
            + `<div class="pt-track"><div class="pt-fill" data-p="${pct}"></div></div>`;
          m.appendChild(mm);
        });
        await sleep(60);
        m.querySelectorAll('.pt-fill').forEach((f) => { f.style.width = f.dataset.p + '%'; });
        const t = node.querySelector('.pt-tierbadge'); t.hidden = false;
        const cls = sc.tier === 'strong' ? 'strong' : 'cheap';
        const label = sc.tier === 'strong' ? 'opus-class · strong' : 'haiku-class · cheap';
        t.innerHTML = `spend the cheapest tier that holds → <span class="pt-pill ${cls}">${label}</span>`;
      }
      if (step === 'Route') {
        $('#ptDispSt').textContent = 'dispatched';
        hub.classList.add('live'); pbar.classList.add('on');
        for (const lid of sc.layers) {
          if (linkEls[lid]) linkEls[lid].classList.add('active');
          if (nodeEls[lid]) nodeEls[lid].classList.add('active');
          await sleep(160);
        }
        if (sc.lead && nodeEls[sc.lead]) nodeEls[sc.lead].classList.add('lead');
        $('#ptLead').textContent = CODE(sc.lead);
        $('#ptMach').textContent = sc.mach;
        $('#ptTier').textContent = sc.tier === 'strong' ? 'strong' : 'cheap';
      }
      await typeInto(txt, sc.loop[step], token);
      await sleep(step === 'Route' ? 120 : 260);
    }
    if (token !== runToken) return;
    $('#ptPhase').textContent = '✓ done · proven'; $('#ptClock').textContent = 'complete';
  }

  /* classify ANY typed task by detected domain, echoing the user's own words.
     Every branch routes to a real layer; nothing typed is ignored. */
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const DOMAINS = [
    { re:/(secur|vulnerab|exploit|threat|harden|\baudit|owasp|\bauth\b|xss|csrf|injection|secret)/, dom:'defensive security', lead:'praesidium', layers:['disciplina','praesidium'], tier:'strong', mach:'one agent', axes:A(0,1,2,3),
      strike:'STRIDE per trust boundary → each finding ships severity + fix + a regression test', prove:'the regression test runs <span class="g">red → green</span>', compound:'file the vuln class → caught free next time' },
    { re:/(contract|solidity|foundry|on-?chain|wallet|erc-?20|\btoken\b|\bmint\b|solana|anchor|\bevm\b|seal this|provenance|sign this)/, dom:'on-chain + provenance', lead:'catena', layers:['disciplina','catena'], tier:'strong', mach:'one agent', axes:A(0,2,2,3),
      strike:'account-validation first · money-safe tx · nothing speculative', prove:'the tx sim passes · <span class="g">no unchecked account</span>', compound:'file the pattern' },
    { re:/(chart|graph|\bplot\b|visuali|dashboard|dataviz|heatmap|sparkline)/, dom:'data visualization', lead:'decor', layers:['disciplina','decor'], tier:'strong', mach:'one agent', axes:A(0,1,2,3),
      strike:'the right mark · a faint grid · an emphasized endpoint · honest, zero-based scale', prove:'reads at a glance · <span class="g">accessible in light + dark</span>', compound:'file the chart spec' },
    { re:/(design|\bui\b|\bux\b|landing|website|web ?page|\bcss\b|brand|figma|layout|component|screen|mockup|\bhero\b|logo)/, dom:'ship-grade design', lead:'decor', layers:['disciplina','decor'], tier:'strong', mach:'one agent', axes:A(0,1,3,3),
      strike:'design tokens · one accent · one elevation · mobile-first', prove:'headless screenshot · <span class="g">0 overflow</span> · contrast AA', compound:'file the design tokens → the next page starts ahead' },
    { re:/(\bgame\b|playable|gameplay|\bjuice\b|arcade|pixel|roguelike|platformer|mechanic)/, dom:'game craft', lead:'ludus', layers:['disciplina','decor','ludus'], tier:'strong', mach:'studio · multi-layer', axes:A(0,1,2,3),
      strike:'core loop first · game feel deliberate · a jam-sized cut — ship one, not ten', prove:'it’s playable · <span class="g">win/lose state fires</span> · the loop is fun', compound:'file what made it feel good' },
    { re:/(market|stock|ticker|equit|invest|portfolio|backtest|\btrad|econom|valuation|\brisk\b|indicator|\bgdp\b|\bcpi\b)/, dom:'markets & economics', lead:'fortuna', layers:['disciplina','fortuna'], tier:'strong', mach:'one agent', axes:A(0,2,2,3),
      strike:'risk sized first · out-of-sample · costs modeled — analysis, not advice', prove:'<span class="g">no look-ahead leak</span> · the edge survives fees', compound:'file the edge + its decay window' },
    { re:/(remember|memor(y|ise|ize)|knowledge base|note this|save this|recall|re-?derive)/, dom:'persistent memory', lead:'archivum', layers:['archivum'], tier:'cheap', mach:'single tool', axes:A(3,0,0,0),
      strike:'one memory file · one index pointer · interlinked', prove:'recall test — a cold next session retrieves it', compound:'this <em>is</em> compounding — the base just grew' },
    { re:/(agent|subagent|swarm|orchestrat|multi-?agent|tool-?use|cohort)/, dom:'agent engineering', lead:'cohors', layers:['disciplina','cohors'], tier:'strong', mach:'one agent', axes:A(0,1,3,3),
      strike:'least privilege · a precise output contract · the smallest orchestration that holds', prove:'the agent hits its contract · <span class="g">no over-broad tools</span>', compound:'file the agent shape' },
    { re:/(automat|workflow|webhook|zapier|\bn8n\b|make\.com|integrat|\bcron\b|connect .* to)/, dom:'automation', lead:'machina', layers:['disciplina','machina'], tier:'strong', mach:'one agent', axes:A(0,2,2,2),
      strike:'discover from the live schema · build incrementally · verify the wiring before it runs live', prove:'the wiring fires end-to-end · <span class="g">no silent miswire</span>', compound:'file the integration map' },
    { re:/(biolog|genom|rna-?seq|protein|molecul|chemistr|hypothes|\bgene\b|variant|clinical|omics|scientif)/, dom:'scientific method', lead:'scientia', layers:['disciplina','scientia'], tier:'strong', mach:'one agent', axes:A(0,2,2,3),
      strike:'competing falsifiable hypotheses · DB-grounded, never guessed', prove:'<span class="g">each claim traces to an authoritative database</span>', compound:'file the finding' },
    { re:/(fine-?tune|serve .*model|inference|mlops|\beval|\bvllm\b|mlflow|train(ing)? .*model|checkpoint|quantiz)/, dom:'AI/ML engineering', lead:'doctrina', layers:['disciplina','doctrina'], tier:'strong', mach:'one agent', axes:A(0,2,2,3),
      strike:'held-out, leakage-free eval · blind judges · a regression gate', prove:'the model earns <span class="g">“better”</span> on a held-out set', compound:'file the eval' },
    { re:/(council|several models|panel of|ensemble|ask (multiple|many|other) models|cross-?model)/, dom:'cross-model council', lead:'concilium', layers:['concilium'], tier:'strong', mach:'council · gated', axes:A(0,1,3,2),
      strike:'N answer blind → anonymized peer-review → a chairman synthesizes', prove:'the panel’s disagreement is <span class="g">shown, not hidden</span>', compound:'file the answer + why it won' },
    { re:/(copy|market this|position(ing)?|launch|\bads?\b|\bseo\b|funnel|headline|slogan|outreach|\bpitch\b)/, dom:'go-to-market', lead:'mercatus', layers:['disciplina','mercatus'], tier:'strong', mach:'one agent', axes:A(0,1,2,3),
      strike:'message matched to awareness · proof over adjectives · one clear next step', prove:'the value is <span class="g">legible</span> · the next step is obvious', compound:'file the positioning' },
    { re:/(\bbug\b|\bfix\b|debug|error|crash|failing|broken|regression|stack ?trace|throws?)/, dom:'debugging', lead:'disciplina', layers:['disciplina'], tier:'strong', mach:'one agent', axes:A(0,1,3,1),
      strike:'reproduce → root cause → the minimal fix', prove:'a regression test locks it · <span class="g">red → green</span>', compound:'file the root cause' },
    { re:/(rename|typo|reformat|\blint\b|one-?liner|trivial|small (fix|change)|\btweak\b)/, dom:'zero-load · lean', lead:'parcus', layers:[], tier:'cheap', mach:'stay in core', axes:A(0,0,0,0),
      strike:'surgical change · match the surrounding style · nothing extra', prove:'grep clean · <span class="g">typecheck green</span>', compound:'nothing worth filing — and that is correct' },
  ];
  const GENERIC = { dom:'general build', lead:'disciplina', layers:['disciplina'], tier:'strong', mach:'one agent', axes:A(0,1,2,1),
    strike:'the smallest correct artifact · climb the YAGNI ladder, stop at the first rung that holds', prove:'run it · show the evidence — no “should work”', compound:'file what was learned' };

  function buildDynamic(text) {
    const d = DOMAINS.find((x) => x.re.test(text.toLowerCase())) || GENERIC;
    const shown = esc(text.length > 60 ? text.slice(0, 57) + '…' : text) || 'an empty task';
    const tierWord = d.tier === 'strong' ? '<span class="hl">strong</span>' : '<span class="g">cheap</span>';
    const others = d.layers.filter((l) => l !== d.lead).map((l) => 'fabius-' + l).join(' + ');
    const route = d.layers.length
      ? `<span class="hl">fabius-${d.lead}</span> leads${others ? ' · ' + others : ''} · parcus underneath`
      : `<span class="hl">stay in the lean core</span> · no specialist pulled · parcus only`;
    return { lead: d.lead, layers: d.layers, tier: d.tier, mach: d.mach, axes: d.axes, loop: {
      Sense: `read your task · “${shown}” · scope it before deciding`,
      Classify: `read as <span class="hl">${d.dom}</span> · load weighed on 4 axes → tier ${tierWord} · machinery: ${d.mach}`,
      Route: route, Strike: d.strike, Prove: d.prove, Compound: d.compound } };
  }

  function dispatch() {
    const raw = $('#ptTask').value.trim();
    if (!raw) { selectChip('landing'); $('#ptTask').value = SC.landing.task; run('landing'); return; }
    // if a preset chip is pressed and the text still matches it verbatim, use the polished preset
    const pressed = chipsWrap.querySelector('.pt-chip[aria-pressed="true"]')?.dataset.key;
    if (pressed && SC[pressed] && raw === SC[pressed].task) { run(pressed); return; }
    // otherwise: a custom task — deselect chips and route it dynamically, echoing the words typed
    chipsWrap.querySelectorAll('.pt-chip').forEach((c) => c.setAttribute('aria-pressed', 'false'));
    run(buildDynamic(raw));
  }
  $('#ptRun').addEventListener('click', dispatch);
  $('#ptTask').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); dispatch(); } });

  /* start the first run once the console scrolls into view — but never
     clobber a run the user already kicked off (runToken > 0) */
  const kick = () => { if (runToken > 0) return; run('landing'); };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((ents, obs) => {
      ents.forEach((en) => { if (en.isIntersecting) { kick(); obs.disconnect(); } });
    }, { threshold: 0.35 });
    io.observe(svg);
  } else { kick(); }
})();
