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
    '.sec-head, .cmp, .flow, .card, .metric, .bench-line, .text-link, ' +
    '.research-copy, .research-card, .tool-list li, .install-in, .idea-in, .latin'
  );
  if (!reduce && 'IntersectionObserver' in window) {
    revealTargets.forEach((el, i) => {
      el.classList.add('reveal');
      // gentle stagger only within tight groups
      if (el.matches('.card, .metric, .tool-list li')) el.style.transitionDelay = (i % 3) * 70 + 'ms';
    });
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        if (en.target.classList.contains('metric')) animateMetric(en.target);
        obs.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    $$('.metric').forEach(animateMetric);
  }

  /* ── benchmark: count-up + bar fill ─────────────────────── */
  function animateMetric(metric) {
    const bars = $('.m-bars', metric);
    if (bars) bars.classList.add('in');
    const score = $('.m-score', metric);
    if (!score) return;
    const to = parseFloat(score.dataset.to || '0');
    if (reduce) { score.textContent = to.toFixed(2); return; }
    const dur = 1100, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      score.textContent = (to * e).toFixed(2);
      if (p < 1) requestAnimationFrame(tick);
      else score.textContent = to.toFixed(2);
    };
    requestAnimationFrame(tick);
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

  /* ── hero swarm parallax (pointer + scroll) ─────────────── */
  const bugs = $$('.swarm .bug');
  if (bugs.length && !reduce && matchMedia('(pointer:fine)').matches) {
    let mx = 0, my = 0, sy = 0, raf = 0;
    const apply = () => {
      raf = 0;
      bugs.forEach((b) => {
        const px = parseFloat(getComputedStyle(b).getPropertyValue('--px')) || 1;
        // use the `translate` property so parallax composes with the CSS drift keyframe (which animates `transform`)
        b.style.translate = `${mx * px * 14}px ${(my * px * 12) - sy * px * 0.04}px`;
      });
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(apply); };
    addEventListener('pointermove', (e) => {
      mx = (e.clientX / innerWidth - 0.5);
      my = (e.clientY / innerHeight - 0.5);
      schedule();
    }, { passive: true });
    addEventListener('scroll', () => { sy = scrollY; if (scrollY < innerHeight) schedule(); }, { passive: true });
  }

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
