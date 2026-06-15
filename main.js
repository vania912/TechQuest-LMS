/* main.js — shared interactions across every page.
   Floating navbar, mobile drawer, scroll reveals, animated counters,
   active nav highlighting. JS only toggles classes; CSS does the motion. */
(function () {
  "use strict";

  /* ---- active nav (match data-nav to current file) ---- */
  var file = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach(function (a) {
    if (a.getAttribute("data-nav") === file) a.classList.add("active");
  });

  /* ---- floating navbar shadow on scroll ---- */
  var navWrap = document.querySelector(".nav-wrap");
  function onScroll() {
    if (!navWrap) return;
    navWrap.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile drawer menu ---- */
  var burger = document.querySelector(".hamburger");
  var overlay = document.querySelector(".overlay");
  var drawer = document.querySelector(".mobile-menu");
  function setMenu(open) {
    if (burger) burger.classList.toggle("open", open);
    if (overlay) overlay.classList.toggle("open", open);
    if (drawer) drawer.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (burger) burger.addEventListener("click", function () {
    setMenu(!drawer.classList.contains("open"));
  });
  if (overlay) overlay.addEventListener("click", function () { setMenu(false); });
  if (drawer) drawer.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });

  /* ---- scroll reveals + counters ---- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce) { el.textContent = target + suffix; return; }
    var start = performance.now(), dur = 1300;
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var reveals = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    // No IO support — just show everything.
    reveals.forEach(function (el) { el.classList.add("in"); });
    document.querySelectorAll("[data-count]").forEach(animateCount);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        e.target.querySelectorAll("[data-count]").forEach(animateCount);
        if (e.target.hasAttribute("data-count")) animateCount(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });

    // counters that aren't inside a .reveal
    document.querySelectorAll("[data-count]").forEach(function (el) {
      if (!el.closest(".reveal")) io.observe(el);
    });
  }

  /* ---- safety net: reveal anything still hidden after load ---- */
  window.addEventListener("load", function () {
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.in)").forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add("in");
      });
    }, 400);
  });
})();
