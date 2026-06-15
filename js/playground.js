/* playground.js — the Code Lab page.
   Wires the editor, Run/Clear/Copy, example chips, the status pill,
   Ctrl/Cmd+Enter, and a quiet background pre-load of the engine. */
(function () {
  "use strict";

  var editor   = document.getElementById("editor");
  var output   = document.getElementById("output");
  var runBtn   = document.getElementById("runBtn");
  var clearBtn = document.getElementById("clearBtn");
  var copyBtn  = document.getElementById("copyBtn");
  var statusEl = document.getElementById("status");
  var statusTx = document.getElementById("statusText");
  if (!editor || !runBtn) return;

  var EXAMPLES = {
    hello:
"# A friendly first program\n" +
"name = \"explorer\"\n" +
"print(f\"Hello, {name}! Welcome to TechQuest.\")\n",
    loop:
"# Loops & math: a times table\n" +
"for i in range(1, 6):\n" +
"    print(f\"{i} x 7 = {i * 7}\")\n" +
"\n" +
"print(\"sum 1..10 =\", sum(range(1, 11)))\n",
    list:
"# Working with lists\n" +
"nums = [4, 8, 15, 16, 23, 42]\n" +
"print(\"min:\", min(nums))\n" +
"print(\"max:\", max(nums))\n" +
"print(\"avg:\", sum(nums) / len(nums))\n" +
"print(\"evens:\", [n for n in nums if n % 2 == 0])\n",
    func:
"# Define and call a function\n" +
"def is_prime(n):\n" +
"    if n < 2:\n" +
"        return False\n" +
"    for d in range(2, int(n ** 0.5) + 1):\n" +
"        if n % d == 0:\n" +
"            return False\n" +
"    return True\n" +
"\n" +
"print([n for n in range(2, 30) if is_prime(n)])\n",
    ai:
"# A tiny rule-based sentiment scorer (input -> output)\n" +
"GOOD = {\"love\", \"great\", \"awesome\", \"happy\", \"good\"}\n" +
"BAD  = {\"hate\", \"bad\", \"awful\", \"sad\", \"terrible\"}\n" +
"\n" +
"def score(text):\n" +
"    words = text.lower().split()\n" +
"    s = sum(w in GOOD for w in words) - sum(w in BAD for w in words)\n" +
"    return \"positive\" if s > 0 else \"negative\" if s < 0 else \"neutral\"\n" +
"\n" +
"for line in [\"I love this great course\", \"this is awful and sad\"]:\n" +
"    print(f\"{line!r} -> {score(line)}\")\n"
  };

  function setStatus(kind, text) {
    if (!statusEl) return;
    statusEl.className = "status " + kind;
    if (statusTx) statusTx.textContent = text;
  }

  function esc(s) {
    return s.replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
  }

  function render(result) {
    var html = "";
    if (result.out) html += esc(result.out);
    if (result.err) html += (html ? "\n" : "") + '<span class="err">' + esc(result.err) + "</span>";
    output.innerHTML = html || '<span class="muted">(no output — add a print() to see a value)</span>';
  }

  async function runCode() {
    runBtn.disabled = true;
    var label = runBtn.innerHTML;
    output.innerHTML = '<span class="muted">⏳ Running…</span>';
    try {
      var result = await TechQuestPy.run(editor.value, function (msg) {
        setStatus("loading", msg);
      });
      setStatus("ready", "Engine ready");
      render(result);
    } catch (err) {
      setStatus("failed", "Engine unavailable");
      output.innerHTML = '<span class="err">⚠ Could not load the Python engine. ' +
        'It downloads once from a CDN, so this needs an internet connection. ' +
        'On a hosted site (e.g. GitHub Pages) it works automatically.</span>';
    } finally {
      runBtn.disabled = false;
      runBtn.innerHTML = label;
    }
  }

  runBtn.addEventListener("click", runCode);

  // Ctrl/Cmd + Enter to run.
  editor.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); runCode(); }
    if (e.key === "Tab") {
      e.preventDefault();
      var s = editor.selectionStart;
      editor.value = editor.value.slice(0, s) + "    " + editor.value.slice(editor.selectionEnd);
      editor.selectionStart = editor.selectionEnd = s + 4;
    }
  });

  if (clearBtn) clearBtn.addEventListener("click", function () {
    editor.value = "";
    output.innerHTML = '<span class="muted">Editor cleared. Write some Python and press Run.</span>';
    editor.focus();
  });

  if (copyBtn) copyBtn.addEventListener("click", function () {
    navigator.clipboard.writeText(editor.value).then(function () {
      var orig = copyBtn.innerHTML;
      copyBtn.innerHTML = "✓ Copied";
      setTimeout(function () { copyBtn.innerHTML = orig; }, 1400);
    }).catch(function () {});
  });

  // Example chips.
  document.querySelectorAll("#examples [data-ex]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var key = chip.getAttribute("data-ex");
      if (EXAMPLES[key]) editor.value = EXAMPLES[key];
      document.querySelectorAll("#examples .chip").forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      editor.focus();
    });
  });

  // Warm the engine quietly while the page is idle.
  function warm() {
    if (TechQuestPy.state() !== "idle") return;
    setStatus("loading", "Pre-loading engine…");
    TechQuestPy.preload(function (msg) { setStatus("loading", msg); }).then(function () {
      setStatus(TechQuestPy.state() === "ready" ? "ready" : "failed",
                TechQuestPy.state() === "ready" ? "Engine ready" : "Engine unavailable");
    });
  }
  if ("requestIdleCallback" in window) requestIdleCallback(warm, { timeout: 2500 });
  else setTimeout(warm, 1800);
})();
