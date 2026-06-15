# TechQuest — Tech Stack

This document explains what TechQuest is built with, how it's structured, and *why* each choice was made. It's written for a developer picking up the project, a reviewer evaluating it, or a curious learner.

---

## 1. At a glance

| Layer | Technology | Why |
|---|---|---|
| Markup | **HTML5** (semantic, multi-page) | Simple, fast, hostable anywhere; great for SEO and accessibility. |
| Styling | **CSS3** — custom design system, CSS variables, Grid/Flexbox | Full control over a distinctive look; no framework weight. |
| Behaviour | **Vanilla JavaScript (ES6+)** | No build step, no dependencies, tiny payload, easy to read. |
| Code execution | **Pyodide (CPython → WebAssembly)** | Runs *real* Python in the browser — the heart of the Code Lab. |
| Fonts | **Google Fonts**: Fredoka, Plus Jakarta Sans, JetBrains Mono | Friendly, readable, with a proper monospace for code. |
| Hosting | **Static files** (e.g. GitHub Pages, Netlify, Vercel) | Zero servers to run; deploy by pushing to a repo. |

**Guiding principle:** no backend, no database, no build tooling. The entire product is static files plus one CDN-loaded runtime. That keeps it fast, free to host, privacy-preserving, and trivial to maintain.

---

## 2. Frontend

### HTML5 — multi-page architecture
The site is a set of standalone pages rather than a single-page app:

```
index.html       → landing / home
about.html       → about & mission
courses.html     → filterable course catalog
tutorial.html    → W3Schools-style lesson with runnable examples
exercises.html   → auto-checked coding exercises
quiz.html        → multiple-choice quizzes with scoring
playground.html  → the Code Lab (flagship feature)
```

Multi-page (vs. a SPA framework) was chosen deliberately: each page loads independently and instantly, it's perfectly suited to static hosting like GitHub Pages, there's no hydration or routing layer to maintain, and it degrades gracefully.

### CSS3 — a hand-built design system
All styling lives in one file, `css/styles.css`, organised as a small design system:

- **Design tokens** via CSS custom properties (`--indigo-600`, `--mint-400`, radii, shadows, easing curves) for consistency and easy theming.
- **Layout** with CSS Grid and Flexbox; responsive breakpoints at 980px and 760px including a mobile drawer menu.
- **Motion** is CSS-first: the floating navbar, hover/active link animations, card lifts, floating badges, and staggered scroll reveals are driven by transitions and keyframes. JavaScript only toggles classes.
- **Accessibility**: honours `prefers-reduced-motion`, uses visible focus outlines, and maintains WCAG-AA-minded contrast.

**Design language:** *Indigo + Mint* (`#4F46E5` primary, `#34D399` accent) on a warm off-white "paper" background, with a sunny `#FBBF24` pop. The pairing is friendly and approachable — chosen over a colder "navy + cyan" palette because the audience is beginners. Type pairs **Fredoka** (rounded, cute display) with **Plus Jakarta Sans** (clean, readable body) and **JetBrains Mono** (code).

### Vanilla JavaScript
No framework. The JS is split by concern:

```
js/main.js         → shared: floating navbar, mobile menu,
                     IntersectionObserver scroll-reveals, animated counters
js/pyrunner.js     → the Python runtime wrapper (loads Pyodide,
                     captures stdout/stderr, exposes a clean run() API)
js/playground.js   → Code Lab: editor, run/clear/copy, examples,
                     status pill, Ctrl+Enter, background pre-load
js/exercises.js    → exercise data + run-and-check-against-expected logic
js/quiz.js         → question banks, quiz flow, scoring, animated result ring
```

Browser APIs used instead of libraries: **IntersectionObserver** (scroll reveals and counters), **Clipboard API** (copy button), and **`requestIdleCallback`** (to warm up the Python engine without blocking the page).

---

## 3. The Code Lab runtime — Pyodide / WebAssembly

The signature feature runs genuine Python in the browser using **[Pyodide](https://pyodide.org)**, which is CPython compiled to **WebAssembly (WASM)**.

**How it works:**

1. On first use, `pyrunner.js` lazily injects the Pyodide loader script from a CDN and calls `loadPyodide()`.
2. The instance is cached as a singleton, so it loads **once per session** and every later run is instant.
3. `run(code)` redirects Python's `stdout`/`stderr` into JavaScript buffers, executes the code with `runPythonAsync`, and returns `{ ok, out, err }` for the UI to render.
4. The Code Lab page pre-warms the engine during idle time for a snappier first run.

**Why Pyodide:** it's the only approach that runs *real* Python client-side. That delivers the product's core promises — **no setup**, **complete privacy** (code never leaves the device), and **authentic behaviour** including real tracebacks. The trade-off is a one-time download on first run, which is mitigated by browser caching and background pre-loading.

---

## 4. Fonts & assets

Loaded from Google Fonts with `preconnect` for speed:

- **Fredoka** — display / headings (rounded, characterful)
- **Plus Jakarta Sans** — body (highly legible at long lengths)
- **JetBrains Mono** — code editors and output

Icons are inline **SVG** (no icon-font or image requests), which keeps them crisp at any size and recolourable via `currentColor`.

---

## 5. Architecture diagram

```
                    ┌─────────────────────────────┐
                    │        Browser (client)      │
                    │                              │
   HTML pages  ───► │  Semantic HTML + CSS system  │
                    │             │                │
                    │             ▼                │
                    │     Vanilla JS modules       │
                    │   (nav, reveals, quiz, ...)  │
                    │             │                │
                    │             ▼                │
                    │   pyrunner.js  ──loads──►  Pyodide (WASM)
                    │   (singleton)              real CPython
                    │             ▲                │
                    │   Code Lab / Tutorials /     │
                    │   Exercises call run()       │
                    └─────────────────────────────┘
                                  ▲
                                  │ static files only
                    ┌─────────────────────────────┐
                    │  Static host (GitHub Pages)  │
                    │  + CDN for Pyodide runtime   │
                    └─────────────────────────────┘
```

No application server, no database, no API keys. Quizzes and the UI work fully offline; only the Code Lab's Python engine needs a network on first load.

---

## 6. Project structure

```
techquest/
├── index.html
├── about.html
├── courses.html
├── tutorial.html
├── exercises.html
├── quiz.html
├── playground.html
├── css/
│   └── styles.css          # design tokens + all components
├── js/
│   ├── main.js             # shared site interactions
│   ├── pyrunner.js         # Pyodide loader + run() API
│   ├── playground.js       # Code Lab logic
│   ├── exercises.js        # exercises + auto-checking
│   └── quiz.js             # quiz flow + scoring
└── docs/
    ├── CODELAB_FEATURE_GUIDE.md
    └── TECH_STACK.md        # this file
```

---

## 7. Running & deploying

**Locally:** serve the folder with any static server so the browser can fetch the Pyodide runtime, for example:

```bash
# Python 3
python -m http.server 8080
# then open http://localhost:8080
```

(Opening the HTML as a bare `file://` works for everything except the Code Lab, which needs `http(s)` to download its runtime.)

**Deploy:** push the folder to a static host. With **GitHub Pages**, enable Pages on the repository and the site is live — no build step required.

---

## 8. Why this stack, in one line

> Static HTML/CSS/JS keeps it fast, free, and maintainable; Pyodide makes the learning *real*. Together they deliver an industry-grade learning experience with zero backend to run.

### Sensible next steps if the project grows
- Persist quiz/exercise progress with **localStorage** (still no backend needed).
- Add a lightweight framework (e.g. **Astro**) only if content scales enough to warrant templating — it still outputs static files.
- Lazy-load extra Python packages on demand for advanced AI lessons.
