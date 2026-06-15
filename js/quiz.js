/* quiz.js — multiple-choice quizzes with instant feedback and a scored result ring. */
(function () {
  "use strict";

  var startCard  = document.getElementById("startCard");
  var quizCard   = document.getElementById("quizCard");
  var resultCard = document.getElementById("resultCard");
  if (!startCard || !quizCard || !resultCard) return;

  var BANK = {
    python: [
      { q: "Which function displays text on the screen?",
        options: ["print()", "input()", "echo()", "say()"], answer: 0,
        explain: "print() writes its arguments to the output." },
      { q: "How do you start a single-line comment in Python?",
        options: ["//", "#", "<!--", "--"], answer: 1,
        explain: "Everything after # on a line is ignored by Python." },
      { q: "What does range(3) produce?",
        options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3, 2, 1"], answer: 1,
        explain: "range(n) counts from 0 up to but not including n." },
      { q: "Which of these is a list?",
        options: ["(1, 2, 3)", "{1, 2, 3}", "[1, 2, 3]", '"123"'], answer: 2,
        explain: "Square brackets create a list; parentheses make a tuple, braces a set." },
      { q: "What is the type of the value 3.14?",
        options: ["int", "float", "str", "bool"], answer: 1,
        explain: "Numbers with a decimal point are floats." }
    ],
    ai: [
      { q: "What does a machine-learning model mainly learn from?",
        options: ["The live internet", "Example data", "Random guesses", "Nothing"], answer: 1,
        explain: "Models adjust their parameters to fit patterns in training data." },
      { q: "A large language model primarily predicts…",
        options: ["The next token", "The weather", "Image pixels", "Your mood"], answer: 0,
        explain: "LLMs are trained to predict the next token in a sequence." },
      { q: "“Training” a model means…",
        options: ["Deleting its data", "Adjusting parameters from data", "Printing results", "Buying a GPU"], answer: 1,
        explain: "Training tunes the model's parameters so its predictions improve." },
      { q: "Bias in an AI system most often comes from…",
        options: ["Too much RAM", "A fast CPU", "Biased training data", "Dark mode"], answer: 2,
        explain: "If the data reflects bias, the model tends to reproduce it." },
      { q: "A “prompt” is…",
        options: ["The input you give a model", "The model's hardware", "A kind of GPU", "A database"], answer: 0,
        explain: "The prompt is the text (or other input) you send the model to respond to." }
    ]
  };

  var qs = [], idx = 0, score = 0, locked = false;

  var qText = document.getElementById("qText");
  var qOpts = document.getElementById("qOptions");
  var qFb   = document.getElementById("qFeedback");
  var qBar  = document.getElementById("qBar");
  var qCount = document.getElementById("qCount");
  var nextBtn = document.getElementById("nextBtn");

  function show(card) {
    [startCard, quizCard, resultCard].forEach(function (c) { c.style.display = "none"; });
    card.style.display = "block";
  }

  function start(topic) {
    qs = BANK[topic] ? BANK[topic].slice() : [];
    idx = 0; score = 0;
    show(quizCard);
    renderQuestion();
  }

  function renderQuestion() {
    locked = false;
    var item = qs[idx];
    qText.textContent = item.q;
    qFb.textContent = ""; qFb.className = "q-feedback";
    nextBtn.style.display = "none";
    nextBtn.textContent = idx === qs.length - 1 ? "See results →" : "Next →";
    qCount.textContent = (idx + 1) + " / " + qs.length;
    qBar.style.width = ((idx) / qs.length) * 100 + "%";

    qOpts.innerHTML = "";
    item.options.forEach(function (opt, i) {
      var b = document.createElement("button");
      b.className = "option";
      b.textContent = opt;
      b.addEventListener("click", function () { choose(i, b, item); });
      qOpts.appendChild(b);
    });
  }

  function choose(i, btn, item) {
    if (locked) return;
    locked = true;
    var buttons = qOpts.querySelectorAll(".option");
    buttons.forEach(function (b) { b.disabled = true; });
    buttons[item.answer].classList.add("correct");
    if (i === item.answer) {
      score++;
      qFb.className = "q-feedback ok";
      qFb.innerHTML = "Correct! <small>" + item.explain + "</small>";
    } else {
      btn.classList.add("wrong");
      qFb.className = "q-feedback no";
      qFb.innerHTML = "Not quite. <small>" + item.explain + "</small>";
    }
    qBar.style.width = ((idx + 1) / qs.length) * 100 + "%";
    nextBtn.style.display = "inline-flex";
  }

  if (nextBtn) nextBtn.addEventListener("click", function () {
    idx++;
    if (idx < qs.length) renderQuestion();
    else finish();
  });

  function finish() {
    show(resultCard);
    var pct = Math.round((score / qs.length) * 100);
    var ring = document.getElementById("ringFill");
    var num = document.getElementById("scoreNum");
    var title = document.getElementById("resultTitle");
    var msg = document.getElementById("resultMsg");

    // animate the ring (circumference = 2*pi*70 ≈ 439.8)
    var C = 439.8;
    if (ring) {
      ring.style.strokeDashoffset = C;
      requestAnimationFrame(function () {
        ring.style.strokeDashoffset = C * (1 - pct / 100);
      });
    }
    // count the number up
    if (num) {
      var start = performance.now();
      (function tick(now) {
        var p = Math.min((now - start) / 1100, 1);
        num.textContent = Math.round(pct * (1 - Math.pow(1 - p, 3))) + "%";
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    }

    if (title && msg) {
      if (pct === 100) { title.textContent = "Perfect score! 🏆"; msg.textContent = "Flawless. You clearly know this cold."; }
      else if (pct >= 60) { title.textContent = "Nice work! 👍"; msg.textContent = "Solid understanding — a quick review and you've got it all."; }
      else { title.textContent = "Good start 🌱"; msg.textContent = "Revisit the tutorial, then come back and try again."; }
    }
  }

  // Topic buttons on the start screen.
  startCard.querySelectorAll("[data-topic]").forEach(function (b) {
    b.addEventListener("click", function () { start(b.getAttribute("data-topic")); });
  });

  var retry = document.getElementById("retryBtn");
  if (retry) retry.addEventListener("click", function () { show(startCard); });
})();
