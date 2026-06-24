# fabius — launch kit

Honest, channel-fit copy for publishing fabius. Every claim matches the measured data (blind 3-arm eval; not "10×"; Mistral's lift is small and stated). Tune voice as you like, but **keep the caveats** — HN/Reddit reward honesty and punish hype.

> **Pre-launch checks**
> - Confirm `paper/fabius-as-a-system.pdf` is committed in the product repo and is actually ~36 pages — the "36-page paper" claim recurs below; fix the number everywhere if it differs.
> - The `og.png` social card's baked subline still reads *"…equips Claude end to end."* The HTML/footer/JSON-LD are model-agnostic; only the image lags. Regenerate `og.png` with *"equips your AI agent end to end"* if you want the card itself agnostic.
> - Add your X/Twitter handle to `twitter:site`/`twitter:creator` (there's a TODO in `index.html`) and to the X thread below.

---

## Positioning

**Best one-liner:**
> A scope-control system for LLM agents: scout wide, strike narrow — one markdown super-skill that beat a "be concise" control on every model family tested, blind-judged, while cutting output 32–52%.

**Alternates:**
1. *(install-first)* One install, nine coordinated skills: fabius equips any LLM agent end-to-end — code, prose, agents, design, debug, memory — under a single Fabian stance.
2. *(skeptic-disarming)* Not "be concise", not "10×", not smarter — a measured scope-control stance that ships the smallest correct artifact. Structure beats brevity, blind-judged across Claude, GPT, Gemini, Grok and Mistral.
3. *(breadth)* The agent operating system in plain markdown: one stance, nine skills, every agent — drop in an `AGENTS.md` or run `/plugin install fabius`.

---

## Show HN

**Title (≤80 chars):**
> Show HN: Fabius – a markdown agent skill that beat a "be concise" control, blind-judged

**First comment:**

Author here. Fabius is a single Claude Code plugin (also a plain `AGENTS.md` you can paste into Codex/Cursor/Windsurf/Cline/Copilot/any LLM) that sets *how* an agent works under one stance — "scout wide, strike narrow": investigate broadly, then ship the smallest correct artifact. It's nine non-overlapping markdown skills behind one router: a lean core, a process/debug layer, design + data-viz, agent orchestration, persistent memory, marketing, defensive security, and game craft. No code, no runtime — it's all prose, which is the whole point: it's model- and tool-agnostic.

Why I built it: I kept writing the same "be terse, don't over-engineer, root-cause the bug, plan before you build" preamble into every project, and watched it decay over a long session. I wanted it version-controlled, measurable, and portable across models instead of living in my head.

The honest result, because this is the part that matters: I ran a blind 3-arm eval — (a) baseline, (b) a generic "be concise" control, (c) full fabius — with the judge never told which arm wrote which answer. The real test isn't beating the baseline, it's beating the *control*, because almost any structured prompt beats nothing. Fabius beats the "be concise" control on every Claude tier while cutting output 32–52%: Opus 13.88, Sonnet 12.5, Haiku 10.38 (out of 15). Cross-family, on genuine build tasks, the lift over the control was Grok +8.5, GPT +7, Claude +7, Mistral +2.5 (/15) — note Mistral's gain is the smallest, which I think is real signal, not noise (more below).

What I want to be very clear about: this is NOT "10×", it's not making the model smarter, and the gains are near-zero on tasks that are already pure-YAGNI — by design. The honest framing is "structure beats brevity": it's a scope-control system that knows when to compress and when to expand, and the advantage grows as the model's own default discipline drops (which is why Haiku and Grok gain the most, and a more disciplined model gains less).

What I think is actually novel vs. "yet another prompt pack": the routing is one inequality. Every decision — add a tool? spawn a reviewer? branch wider? retry? — reduces to "does the expected loss removed exceed the cost of the machinery?" Eighteen rules, each tagged for what the cited papers actually measured vs. what fabius borrows by analogy, and the rule set is checked to be internally consistent. There's a paper with the derivations.

Where it's weak / what I'd love torn apart: n is small, the judge is itself an LLM (I report the blind setup but it's not human-rated), and "genuine-build" task selection is mine, so there's selection risk. I'd genuinely value people re-running it on their own tasks and telling me where it loses.

Everything is open (MIT): repo with the skills, BENCHMARKS.md with method + caveats, and the paper.
- Repo: https://github.com/ArielShemesh1999/fabius
- Benchmarks (method, mechanism, caveats): https://github.com/ArielShemesh1999/fabius/blob/main/BENCHMARKS.md
- Paper: https://github.com/ArielShemesh1999/fabius/blob/main/paper/fabius-as-a-system.pdf
- Site: https://fabius-landing.vercel.app/

Install in Claude Code: `/plugin marketplace add ArielShemesh1999/fabius` then `/plugin install fabius`

---

## Reddit — r/ClaudeAI

**Title:** I made a Claude Code plugin that cuts output 32–52% and still beat a blind "be concise" control on Opus/Sonnet/Haiku

I kept re-typing the same instructions into every Claude session — be terse, don't over-engineer, plan before building, root-cause bugs instead of patching symptoms, keep memory across sessions. So I turned it into one plugin and then actually measured whether it does anything.

It's called fabius (after the Roman general who won by refusing the big pitched battle): one stance — "scout wide, strike narrow" — split into nine non-overlapping markdown skills behind a router (lean core, process/debug, design, agent orchestration, memory, marketing, security, game craft). Install is just:

    /plugin marketplace add ArielShemesh1999/fabius
    /plugin install fabius

The measurement (this is the honest part): a blind 3-arm eval — baseline vs. a generic "be concise" control vs. full fabius — judge never told which arm wrote which. The point of the "be concise" control is that almost anything beats a bare baseline; the real bar is beating plain brevity. Fabius cleared it on every tier while cutting output length: Opus 13.88, Sonnet 12.5, Haiku 10.38 (/15). Haiku gains the most, which fits the thesis — the weaker the model's default discipline, the more structure helps.

What it is NOT: not "10×", not making Claude smarter, and basically no gain on already-trivial tasks (by design). It's a scope-control system — knows when to compress and when to expand. That's the whole claim.

It's plain markdown so it also runs on GPT/Gemini/Grok/Mistral via an AGENTS.md bridge. I tested cross-family too: lift over the control on real build tasks was Grok +8.5, GPT +7, Claude +7, Mistral +2.5 (/15) — every family beat the control, though Mistral's margin is slim.

All MIT and open — repo, full benchmark method + caveats, and a paper with the routing math (every decision reduces to one expected-loss vs. cost-of-machinery inequality). Honest weaknesses: small n, LLM-as-judge (blind, but not human-rated), and I picked the tasks. I'd love people to run it on their own work and tell me where it underperforms.

Repo: https://github.com/ArielShemesh1999/fabius · Benchmarks: https://github.com/ArielShemesh1999/fabius/blob/main/BENCHMARKS.md · Site: https://fabius-landing.vercel.app/

---

## Reddit — r/LocalLLaMA

**Title:** A plain-markdown agent "super-prompt" that helped weaker models the most — blind eval, cross-family (Grok/GPT/Claude/Mistral), MIT

Sharing a thing that's relevant here specifically because the gains were biggest on the *less* capable models, which is the regime a lot of us run in locally.

It's called fabius: nine non-overlapping markdown skills under one stance — "scout wide, strike narrow" (investigate broadly, ship the smallest correct artifact). No runtime, no API, no dependencies — it's literally prose you paste in via AGENTS.md / system prompt, so it's model- and tool-agnostic. That portability is the point.

What I measured: a blind 3-arm eval — baseline vs. a generic "be concise" control vs. full fabius — judge blind to which arm wrote which. Beating the "be concise" control (not the bare baseline) is the real test. Cross-family lift over the control on genuine build tasks, out of 15: Grok +8.5, GPT +7, Claude +7, Mistral +2.5. On Claude tiers it also cut output 32–52% while scoring higher (Opus 13.88 / Sonnet 12.5 / Haiku 10.38 of 15). The pattern: the weaker the model's default discipline, the more structure buys you — so this is arguably most useful exactly when you're not running a frontier model.

Honest framing, no hype: this is not "10×", it does not make the model smarter, and it does ~nothing on already-trivial tasks (intentional). It's a scope-control / discipline system, that's all.

Caveats stated plainly: small n, the judge is an LLM (blind setup, but not human-rated), and the task set is mine (selection risk). I have NOT tested it on local open-weights models — I'd genuinely like people to try it on Qwen, Llama, DeepSeek, Mistral variants etc. and report where it helps or hurts.

Everything MIT — skills, BENCHMARKS.md (method + caveats), and a paper deriving the routing as a single expected-loss-vs-cost inequality.
Repo: https://github.com/ArielShemesh1999/fabius · AGENTS.md bridge: https://github.com/ArielShemesh1999/fabius/blob/main/AGENTS.md

---

## Reddit — r/programming

**Title:** I tried to honestly measure whether a structured agent prompt does anything — blind 3-arm eval with a "be concise" control

Most "this prompt makes your AI 10× better" claims compare against a bare baseline, which is meaningless — almost any instruction beats none. So when I built a markdown agent ruleset (fabius), I tried to measure it the way that would actually falsify it: a blind 3-arm eval — (1) baseline, (2) a generic "be concise" control, (3) the full ruleset — with the judge never told which arm produced which answer. The bar is beating the *control*, not the baseline.

Result: it beat the "be concise" control on every Claude tier (Opus 13.88 / Sonnet 12.5 / Haiku 10.38 out of 15) while producing 32–52% LESS output, and the lift held cross-family on genuine build tasks (Grok +8.5, GPT +7, Claude +7, Mistral +2.5 /15). Interesting bit: the weaker the model's default discipline, the bigger the gain — consistent with the idea that this is buying structure/scope-control, not intelligence.

What it is: nine non-overlapping markdown skills under one stance, "scout wide, strike narrow" — investigate broadly, ship the smallest correct artifact. The design conceit is that every routing decision (add a tool? spawn a reviewer? retry?) reduces to one inequality: expected loss removed > cost of the machinery. There's a paper with the derivation.

Limitations, stated up front because this sub will (rightly) push on them: n is small; the judge is an LLM (blind, but not human-rated, so judge bias isn't fully excluded); and I selected the tasks. I'm not claiming a law of nature — I'm claiming "structure beats brevity" with a documented method and the caveats written down. It is explicitly NOT 10× and does nothing on trivial tasks.

It's MIT, plain markdown (no runtime), works in Claude Code as a plugin or anywhere via AGENTS.md. Method and full caveats: https://github.com/ArielShemesh1999/fabius/blob/main/BENCHMARKS.md — repo: https://github.com/ArielShemesh1999/fabius . Tear the methodology apart; that's the useful feedback.

---

## Product Hunt

**Name:** fabius
**Tagline (≤60):** One super-skill that equips your AI agent end to end
*(alts: "Scout wide, strike narrow: one super-skill for agents" · "Equip any AI agent end to end with one super-skill" · "A scope-control super-skill for coding agents")*

**Description:**

fabius is one super-skill that equips an AI agent end to end — code, prose, agents, design, debugging, memory, marketing, defensive security, and games — under a single stance: scout wide, strike narrow (named for the Roman general Fabius Maximus).

It's nine coordinated, non-overlapping skills installed as one plugin: a router plus an always-on lean core, process discipline, design + data-viz, agent orchestration, memory, marketing, defensive security, and game craft. It's plain markdown, so it runs on any LLM — Claude, GPT, Gemini, Grok, Mistral — and on Codex, Cursor, Windsurf, Cline, and Copilot via an AGENTS.md bridge.

The honest pitch: structure beats brevity. Not smarter, not 10× on everything — it's a scope-control system. In a blind 3-arm eval (the judge never knew which arm wrote what), fabius beat a "be concise" control on every Claude tier while cutting output 32–52%. Backed by a paper with proofs. MIT licensed.

Install in Claude Code: `/plugin marketplace add ArielShemesh1999/fabius` then `/plugin install fabius`

**Topics (4):** Developer Tools · Artificial Intelligence · Open Source · Productivity

**Maker's first comment:**

Hi Product Hunt 👋 I'm Ariel, the maker.

fabius started from a frustration: I kept re-explaining HOW I wanted my AI agent to work — stop over-building, talk less, run a real process, design at ship quality — on every single task. So I wrote it down once, as one stance: scout wide, strike narrow. Investigate broadly, then ship the smallest correct thing. (Named for Fabius Maximus, the Roman general who won by patience and narrow, well-chosen strikes.)

That became nine small, non-overlapping skills installed as one plugin — a router on top, an always-on lean core underneath, and specialist layers for process, design, agents, memory, marketing, defensive security, and game craft.

I wanted proof, not vibes, so I ran a blind 3-arm eval: a baseline, a generic "be concise" control, and full fabius. The judge never knew which arm wrote which answer. fabius beat the "be concise" control on every Claude tier — Opus 13.88, Sonnet 12.5, Haiku 10.38 out of 15 — while cutting output 32–52%. On genuine build tasks across model families, the lift over the control was Grok +8.5, GPT +7, Claude +7, Mistral +2.5.

The honest framing I keep coming back to: structure beats brevity. It doesn't make the model smarter and it's not 10× on everything — it's a scope-control system. It's plain markdown, so it isn't a Claude trick — it runs on any LLM and on Codex/Cursor/Windsurf/Cline/Copilot through an AGENTS.md bridge. There's a paper with the proofs, and the whole thing is MIT.

Install in Claude Code: `/plugin marketplace add ArielShemesh1999/fabius` then `/plugin install fabius`

Site: https://fabius-landing.vercel.app/ · Repo: https://github.com/ArielShemesh1999/fabius

I'd genuinely love feedback on two things: (1) does the "scout wide, strike narrow" framing land, or feel abstract? and (2) which of the nine layers would you actually reach for first?

**Gallery shot list (1270×760, first = thumbnail):**
1. The `og.png` hero (already 1200×630, on-brand). *Caption it by what it shows; regenerate first if you want the agnostic subline.*
2. The "Nine coordinated, zero-overlap skills. One install." grid.
3. "The proof" — the blind 3-arm benchmark chart (Opus 13.88 / Sonnet 12.5 / Haiku 10.38), with "output cut 32–52%". Caption: "Blind eval — the judge never knew which arm wrote which."
4. Cross-model lift chart (Grok +8.5 / GPT +7 / Claude +7 / Mistral +2.5). Caption: "Plain markdown — not a Claude trick."
5. "Plain markdown. Model- and tool-agnostic." section (Claude/GPT/Gemini/Grok/Mistral + Codex/Cursor/Windsurf/Cline/Copilot, AGENTS.md bridge).
6. The two-line install. Caption: "Two lines in Claude Code."
7. *(optional)* The explainer video (`assets/fabius-explainer.mp4`, poster `assets/fabius-explainer-poster.webp`).

---

## X / Twitter thread

*(Replace `@HANDLE` once confirmed. Bracketed `[screenshot: …]` lines are author notes — strip before posting.)*

**1/** Most "prompt tricks" tell the model to be smarter. That never works. fabius does the opposite: it controls scope. One idea — scout wide, strike narrow. Investigate everything, then ship the single smallest correct thing. Named for the Roman general who won by refusing the wrong fights. 🪲 [screenshot: hero]

**2/** The mechanism, not vibes: investigating is cheap, being wrong is expensive → fan out. Shipping bloat is expensive → strike narrow. Those live on different axes, so they never fight. Process + memory make you wide. Lean makes you narrow. That's the whole stance.

**3/** Proof — a blind 3-arm eval: baseline vs a generic "be concise" control vs full fabius. The judge never knew which arm wrote which. fabius beats the "be concise" control on every Claude tier while cutting output 32–52%: Opus 13.88 · Sonnet 12.5 · Haiku 10.38 (/15) [screenshot: benchmark chart]

**4/** Honest caveat: it's not magic. Not "smarter," not "10× on everything." It's a scope-control system that knows when to compress and when to expand. The lift shows up on real builds and trust boundaries — and is near zero on trivial tasks, by design. Structure beats brevity.

**5/** Nine coordinated, zero-overlap skills under one install: • fabius — router • parcus — lean core • disciplina — process • decor — design + data-viz • cohors — agents • archivum — memory • mercatus — marketing • praesidium — defensive security • ludus — games

**6/** And it's plain markdown — so it's model- AND tool-agnostic. Measured cross-family on genuine-build tasks, lift over the control (/15): Grok +8.5 · GPT +7 · Claude +7 · Mistral +2.5. Claude Code as a plugin; Codex/Cursor/Windsurf/Cline/Copilot/Gemini via one AGENTS.md bridge.

**7/** MIT licensed. A paper with the proofs. Free. Install in Claude Code: `/plugin marketplace add ArielShemesh1999/fabius` then `/plugin install fabius`. Repo → github.com/ArielShemesh1999/fabius · Site → fabius-landing.vercel.app. Built by @HANDLE

---

## GitHub repo discoverability

**About (≤350):**
> One super-skill that equips any LLM agent end-to-end — code, prose, agents, design, debug, memory — under a single Fabian stance: scout wide, strike narrow. Nine coordinated, zero-overlap skills, one install. Plain markdown, model- & tool-agnostic (Claude, GPT, Gemini, Grok, Mistral). Beats a 'be concise' control, blind-judged. MIT.

**Topics (16):** `claude-code` · `claude-code-plugin` · `claude` · `anthropic` · `ai-agents` · `llm` · `agentic-ai` · `prompt-engineering` · `agent-orchestration` · `developer-tools` · `ai-tools` · `agents-md` · `cursor` · `github-copilot` · `markdown` · `mit-license`

**Social preview:** upload `/assets/og.png` (already 1200×630, on-brand) as the repo's social image.

**Honest ways to earn early stars (no astroturfing):**
1. Lead every post with the reproducible benchmark + the paper, not the pitch — the artifact is the hook.
2. Get listed on relevant `awesome-*` lists and Claude Code / AGENTS.md plugin directories.
3. Publish the `AGENTS.md` bridge as standalone shareable value (it's useful even to people who never install the plugin).

---

## Suggested order

1. Polish the repo (About, topics, social preview, pinned).
2. Verify the pre-launch checks above.
3. Show HN (weekday morning US time) → engage every comment honestly.
4. Same day: X thread + r/ClaudeAI.
5. Day 2–3: r/LocalLLaMA, r/programming (space them out).
6. Product Hunt when you can be present all day to answer.
