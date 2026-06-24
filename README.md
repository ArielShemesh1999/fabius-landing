# fabius — landing page

Marketing site for **[fabius](https://github.com/ArielShemesh1999/fabius)** — one Claude super-skill that equips the agent end-to-end under a single Fabian stance: *scout wide, strike narrow.*

- **Stack:** vanilla HTML + CSS + JS. No build step.
- **Design:** Apple / Figma / Framer language — clean white canvas, one purple accent (`#7a3dff`), self-hosted Inter. Bug/insect identity: a custom SVG beetle carrying the squared-spiral Fabius emblem.
- **Deploy:** static on Vercel.

## Develop

```bash
python3 -m http.server 8799   # then open http://localhost:8799
```

## Structure

```
index.html      structure + reusable SVG symbols (emblem, beetle)
styles.css      design system (tokens) + all sections + motion
main.js         nav, swarm parallax, scroll reveals, count-up, copy buttons
assets/         emblem.svg · beetle.svg · inter.woff2 · bug-field.webp · og.png
vercel.json     security headers + asset caching + CSP
```

MIT © Ariel Shemesh
