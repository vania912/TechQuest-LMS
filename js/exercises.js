/* exercises.js — auto-checked coding exercises.
   Each exercise runs the learner's code with TechQuestPy.run and compares
   the trimmed stdout against the expected output. */
(function () {
  "use strict";

  var grid = document.getElementById("exGrid");
  if (!grid) return;

  var EXERCISES = [
    {
      id: "p1", track: "python", title: "Say hello",
      prompt: "Print exactly: Hello, TechQuest!",
      starter: "# print the exact line below\n",
      expected: "Hello, TechQuest!",
      hint: "Use print() with the text in quotes.",
      solution: 'print("Hello, TechQuest!")'
    },
    {
      id: "p2", track: "python", title: "Add it up",
      prompt: "Print the sum of every whole number from 1 to 10.",
      starter: "# compute and print the total\n",
      expected: "55",
      hint: "range(1, 11) gives 1..10. sum() adds an iterable.",
      solution: "print(sum(range(1, 11)))"
    },
    {
      id: "p3", track: "python", title: "Squares",
      prompt: "Print a list of the squares of 1, 2, 3, 4, 5.",
      starter: "# build the list and print it\n",
      expected: "[1, 4, 9, 16, 25]",
      hint: "A list comprehension: [n*n for n in range(1, 6)].",
      solution: "print([n * n for n in range(1, 6)])"
    },
    {
      id: "p4", track: "python", title: "Reverse it",
      prompt: 'The word is "python". Print it reversed.',
      starter: 'word = "python"\n# print word reversed\n',
      expected: "nohtyp",
      hint: "Slicing with a step of -1 reverses a string: word[::-1].",
      solution: 'word = "python"\nprint(word[::-1])'
    },
    {
      id: "a1", track: "ai", title: "Tokenise (count words)",
      prompt: 'Print how many words are in: "ai makes learning fun".',
      starter: 'text = "ai makes learning fun"\n# print the word count\n',
      expected: "4",
      hint: "split() turns a sentence into a list of words; len() counts them.",
      solution: 'text = "ai makes learning fun"\nprint(len(text.split()))'
    },
    {
      id: "a2", track: "ai", title: "Rule-based classifier",
      prompt: "score = 2. Print \"positive\" if score is above 0, else \"negative\".",
      starter: "score = 2\n# print positive or negative\n",
      expected: "positive",
      hint: "A simple if/else on score > 0.",
      solution: 'score = 2\nprint("positive" if score > 0 else "negative")'
    }
  ];

  var solved = {};
  var current = "all";

  function tagClass(t) { return t === "python" ? "tag-py" : "tag-ai"; }
  function tagLabel(t) { return t === "python" ? "Python" : "AI"; }

  function esc(s) {
    return s.replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
  }

  function updateProgress() {
    var total = EXERCISES.length;
    var done = Object.keys(solved).length;
    var c = document.getElementById("solvedCount");
    var b = document.getElementById("solvedBar");
    if (c) c.textContent = done + " of " + total + " solved";
    if (b) b.style.width = (total ? (done / total) * 100 : 0) + "%";
  }

  function visible() {
    return current === "all" ? EXERCISES : EXERCISES.filter(function (e) { return e.track === current; });
  }

  function render() {
    grid.innerHTML = "";
    visible().forEach(function (ex) {
      var card = document.createElement("article");
      card.className = "card ex-item reveal in";
      card.innerHTML =
        '<div class="ex-row">' +
          '<span class="tag ' + tagClass(ex.track) + '">' + tagLabel(ex.track) + "</span>" +
          '<span class="ex-status' + (solved[ex.id] ? " solved" : "") + '">' +
            (solved[ex.id] ? "✓ Solved" : "To do") + "</span>" +
        "</div>" +
        "<h3>" + esc(ex.title) + "</h3>" +
        "<p>" + esc(ex.prompt) + "</p>" +
        '<textarea class="ex-code" spellcheck="false">' + esc(ex.starter) + "</textarea>" +
        '<div class="ex-actions">' +
          '<button class="btn btn-mint btn-sm act-check">Check answer</button>' +
          '<button class="btn btn-ghost btn-sm act-hint">Hint</button>' +
          '<button class="btn btn-ghost btn-sm act-sol">Solution</button>' +
        "</div>" +
        '<div class="ex-note" style="display:none"></div>' +
        '<div class="ex-out"></div>';

      var ta    = card.querySelector(".ex-code");
      var out   = card.querySelector(".ex-out");
      var note  = card.querySelector(".ex-note");
      var stat  = card.querySelector(".ex-status");

      ta.addEventListener("keydown", function (e) {
        if (e.key === "Tab") {
          e.preventDefault();
          var s = ta.selectionStart;
          ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(ta.selectionEnd);
          ta.selectionStart = ta.selectionEnd = s + 4;
        }
      });

      card.querySelector(".act-check").addEventListener("click", async function () {
        var btn = this; btn.disabled = true;
        out.className = "ex-out show"; out.innerHTML = '<span class="muted">⏳ Running…</span>';
        try {
          var r = await TechQuestPy.run(ta.value, function () {});
          if (r.err) {
            out.className = "ex-out show no";
            out.innerHTML = '<span class="err">' + esc(r.err) + "</span>";
          } else if (r.out.trim() === ex.expected.trim()) {
            out.className = "ex-out show ok";
            out.innerHTML = esc(r.out.trim()) + "\n\n✓ Correct!";
            if (!solved[ex.id]) { solved[ex.id] = true; stat.textContent = "✓ Solved"; stat.classList.add("solved"); updateProgress(); }
          } else {
            out.className = "ex-out show no";
            out.innerHTML = "Your output:\n" + esc(r.out.trim() || "(nothing printed)") +
              '\n\n<span class="muted">Expected:\n' + esc(ex.expected) + "</span>";
          }
        } catch (e) {
          out.className = "ex-out show no";
          out.innerHTML = '<span class="err">⚠ Could not load the Python engine (needs an internet connection on first run).</span>';
        } finally { btn.disabled = false; }
      });

      card.querySelector(".act-hint").addEventListener("click", function () {
        note.style.display = "block";
        note.innerHTML = "💡 " + esc(ex.hint);
      });

      card.querySelector(".act-sol").addEventListener("click", function () {
        ta.value = ex.solution;
        note.style.display = "block";
        note.innerHTML = "Solution loaded into the editor — press <b>Check answer</b> to run it.";
      });

      grid.appendChild(card);
    });
  }

  // Filters.
  var filters = document.getElementById("exFilters");
  if (filters) filters.addEventListener("click", function (e) {
    var btn = e.target.closest(".chip"); if (!btn) return;
    filters.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
    btn.classList.add("active");
    current = btn.getAttribute("data-f");
    render();
  });

  render();
  updateProgress();
})();
