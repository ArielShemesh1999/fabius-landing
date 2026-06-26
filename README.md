# fabius — landing page

Marketing site for **fabius** — the autonomous AI agent that runs on every major model under a single Fabian stance: *scout wide, strike narrow.* The agent's brain is a private, provenance-sealed work; its console is [synapse](https://synapse-vert-one.vercel.app).

- **Stack:** vanilla HTML + CSS + JS. No build step.
- **Design:** Apple / Figma / Framer language — clean white canvas, one purple accent (`#7a3dff`), self-hosted Inter. Bug/insect identity: a custom SVG beetle carrying the squared-spiral Fabius emblem.
- **Deploy:** static on Vercel.

## Develop

```bash
python3 -m http.server 8799   # then open http://localhost:8799
```

## Structure

```
index.html      structure + inline SVG symbols (emblem, beetle, 9 skill bugs, wordmark)
styles.css      design system (tokens) + all sections + motion
main.js         nav, beetle swarm, scroll reveals, emblem draw-in, explainer video, copy buttons
assets/         inter.woff2 · og.png · fabius-explainer.mp4 · fabius-explainer-poster.webp
vercel.json     security headers + asset caching + CSP
```

© 2026 Ariel Shemesh — all rights reserved. The fabius agent and its brain are private and provenance-sealed; not licensed for redistribution.
