# TechQuest Code Lab — Feature Guide

The **Code Lab** is TechQuest's signature feature: a complete Python interpreter that runs **inside your browser tab**. You write Python, press Run, and see real output in milliseconds — no installs, no sign-up, no server. This guide explains what it is, why it's useful, and exactly how to use it.

---

## 1. What is the Code Lab?

Most learning sites show you code as a picture you can't touch, then ask you to install Python before you can try anything. The Code Lab removes that gap entirely.

It embeds a real Python runtime (CPython compiled to WebAssembly via **Pyodide**) directly in the page. Every line you run is executed by genuine Python — the same language used in industry — not a simulation or a limited sandbox of pre-baked answers.

**Why it matters:**

- **Zero setup** — nothing to download or configure; a browser tab is the entire environment.
- **Completely private** — your code runs locally on your own device and is never uploaded to any server.
- **Instant feedback** — after a one-time engine load, runs are effectively immediate.
- **Real Python** — loops, functions, comprehensions, the standard library, errors and tracebacks all behave exactly as they would on your machine.

---

## 2. Where you'll find it

The Code Lab powers three places across TechQuest:

| Location | What it does |
|---|---|
| **Code Lab page** (`playground.html`) | A full, blank editor for free experimentation and loadable examples. |
| **Tutorials** (`tutorial.html`) | Every lesson example is editable and runnable inline — read a concept, then run it. |
| **Exercises** (`exercises.html`) | Your code is executed and its output auto-checked against the expected answer. |

It's the same engine in all three — so anything you learn to do in one place works in the others.

---

## 3. Using the Code Lab page — step by step

### Step 1 — Open it
Click **Code Lab** in the top navigation (or the button on the home page). You'll see two panels: the **editor** on the left and the **output** on the right.

### Step 2 — Write or load code
Either type your own Python in the editor, or click one of the **example chips** at the top:

- 👋 **Hello** — a friendly first program
- 🔁 **Loop & math** — sums and times tables
- 📋 **Lists** — min/max/average and filtering
- 🧩 **Function** — defining and calling a function (prime finder)
- 🤖 **Mini AI scorer** — a rule-based sentiment classifier that introduces input → output thinking

### Step 3 — Run it
Press the green **▶ Run** button, or use the keyboard shortcut **`Ctrl` + `Enter`** (**`Cmd` + `Enter`** on Mac). The output appears on the right.

> **First run note:** The very first run downloads the Python engine (a few seconds). Watch the status pill in the output panel — it moves from *Engine idle* → *Starting engine…* → *Engine ready*. Every run after that is instant. The Code Lab even pre-loads the engine quietly in the background when the page is idle, so it's often ready before you click.

### Step 4 — Iterate
Edit your code and run again as many times as you like. Use the toolbar buttons:

- **Clear** — empties the editor for a fresh start
- **Copy** — copies your code to the clipboard

---

## 4. The status pill (reading engine state)

The small pill in the output panel header tells you what the engine is doing:

| Pill | Meaning |
|---|---|
| ⚪ **Engine idle** | Not loaded yet — it will load on your first run. |
| 🟡 **Starting engine… / Pre-loading** | The runtime is downloading or booting. |
| 🟢 **Engine ready** | Loaded — runs are instant from here on. |
| 🔴 **Engine unavailable** | The engine couldn't be downloaded (almost always a network issue — see Troubleshooting). |

---

## 5. Editor tips

- **Indentation matters in Python.** Press **Tab** to insert four spaces (the editor does this for you).
- **`print()` is how you see things.** If a run produces no output, add a `print(...)` to inspect a value.
- **Errors are friends.** When Python raises an error, the output panel shows the traceback in red. Read the **last line** first — it names the error and usually points right at the problem.
- **State resets every run.** Each run starts clean, so include everything your program needs in the editor.

---

## 6. What's supported

- Core Python 3 syntax: variables, conditionals, loops, functions, classes, comprehensions, f-strings.
- Built-in functions (`print`, `len`, `range`, `max`, `sum`, `sorted`, …) and standard-library modules such as `math`, `random`, `statistics`, `json`, `datetime`.
- Full exceptions and tracebacks.

**Current boundaries (by design, for a browser):**

- `input()` for interactive typing isn't wired into the UI — set values as variables instead.
- Heavy third-party packages (e.g. large ML libraries) aren't pre-loaded to keep things fast and light. The lessons are built around what's available out of the box.
- No file-system or network access from inside your Python code — it's a clean, contained sandbox.

---

## 7. Troubleshooting

**"Engine unavailable" / it won't load.**
The Code Lab downloads its runtime once from a public CDN, so it needs an internet connection on first use. If you opened the site as a local `file://` page with no network, host it (e.g. GitHub Pages) and it will work automatically. After the first successful load, the browser caches it.

**My program ran but nothing appeared.**
Add a `print()` — expressions alone don't display in this output panel; you print what you want to see.

**I get an `IndentationError`.**
Python is strict about indentation. Make sure lines inside an `if`, `for`, or `def` are indented (use Tab).

**It feels slow the first time.**
That's the one-time engine download. Subsequent runs are instant. Leaving the page open a moment before your first run lets the background pre-load finish.

---

## 8. A 30-second first session

1. Open **Code Lab**.
2. Click the **👋 Hello** example.
3. Change `"explorer"` to your name.
4. Press **`Ctrl` + `Enter`**.
5. See your personalised greeting print instantly. 🎉

That's the whole loop — read, edit, run. Everything else on TechQuest is built on it.
