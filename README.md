# 🚀 TechQuest — Learn AI & Python by Doing

A hands-on, browser-first learning platform for **Python** and **AI**. Every concept you read is something you can immediately *run* — there's no gap between learning and trying, because real Python executes right in the browser.

🔗 **Live demo:** https://vania912.github.io/TechQuest-LMS/

---

## Overview

Most learning sites make you read a wall of text, then send you off to install an environment before you can write a single line. By then the spark is gone. TechQuest flips that: read a short, friendly lesson, edit the example, hit **Run**, and see real output in milliseconds — no installs, no sign-up, no server.

The whole product is static files plus one CDN-loaded runtime. That keeps it fast, free to host, privacy-preserving, and trivial to maintain.

## ✨ Features

- **Code Lab** — a full Python interpreter running inside the browser tab (the signature feature).
- **Tutorials** — bite-sized lessons where every example is editable and runnable inline.
- **Exercises** — coding tasks that run your code and auto-check the output against the expected answer.
- **Quizzes** — multiple-choice quizzes with instant feedback and an animated score ring.
- **Course catalog** — filterable Python and AI tracks.
- **Zero backend** — no database, no API keys, no build step. Works offline except the Code Lab's one-time engine download.
- **Accessible & responsive** — keyboard focus styles, `prefers-reduced-motion` support, and a mobile drawer menu.

## 🧪 The Code Lab

The signature feature runs genuine Python using **[Pyodide](https://pyodide.org)** — CPython compiled to **WebAssembly**.

- **Zero setup** — a browser tab is the entire environment.
- **Completely private** — code runs locally on your device and is never uploaded.
- **Real Python** — loops, functions, comprehensions, the standard library, and real tracebacks all behave as they would on your machine.
- **Instant after first load** — the engine downloads once per session (and pre-warms during idle time), then every run is immediate.

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic, multi-page) |
| Styling | CSS3 — hand-built design system, custom properties, Grid & Flexbox |
| Behaviour | Vanilla JavaScript (ES6+) — no framework, no build step |
| Code execution | Pyodide (CPython → WebAssembly) |
| Fonts | Fredoka · Plus Jakarta Sans · JetBrains Mono |
| Hosting | Static files on GitHub Pages |

**Design language:** *Indigo + Mint* (`#4F46E5` primary, `#34D399` accent) on a warm off-white background, with a sunny `#FBBF24` pop.

## 📁 Project Structure

```
TechQuest-LMS/
├── index.html          # landing / home
├── about.html          # about & mission
├── courses.html        # filterable course catalog
├── tutorial.html       # lessons with runnable examples
├── exercises.html      # auto-checked coding exercises
├── quiz.html           # multiple-choice quizzes
├── playground.html     # the Code Lab
├── css/
│   └── styles.css      # design tokens + all components
├── js/
│   ├── main.js         # nav, mobile menu, scroll reveals, counters
│   ├── pyrunner.js     # Pyodide loader + run() API
│   ├── playground.js   # Code Lab logic
│   ├── exercises.js    # exercises + auto-checking
│   └── quiz.js         # quiz flow + scoring
└── docs/
    ├── CODELAB_FEATURE_GUIDE.md
    └── TECH_STACK.md
```

## 🧑‍💻 Run locally

The Code Lab needs `http(s)` to fetch its runtime, so serve the folder rather than opening the HTML directly:

```bash
# from the project root
python -m http.server 8080
# then open http://localhost:8080
```

## 🌐 Deploy

Push to a static host. With **GitHub Pages**: repo **Settings → Pages → Deploy from a branch → `main` / root**. No build step required — the site goes live automatically.

## 📚 Docs

- [`docs/CODELAB_FEATURE_GUIDE.md`](docs/CODELAB_FEATURE_GUIDE.md) — how to use the Code Lab
- [`docs/TECH_STACK.md`](docs/TECH_STACK.md) — architecture and the reasoning behind each choice

---

Built by [@vania912](https://github.com/vania912) — the hands-on way to learn AI & Python.
