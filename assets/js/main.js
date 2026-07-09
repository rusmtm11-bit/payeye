/* PayEye — interactions. Vanilla, dependency-free. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Current year in footer ------------------------------------------ */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Mobile nav toggle ----------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---- Sticky header compaction ---------------------------------------- */
  var head = document.querySelector(".site-head");
  if (head) {
    var onScroll = function () {
      if (window.scrollY > 40) head.classList.add("is-compact");
      else head.classList.remove("is-compact");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Scroll reveal ---------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Aperture open animation on load --------------------------------- */
  var aperture = document.querySelector(".aperture");
  if (aperture && !reduce) {
    var blades = aperture.querySelectorAll(".blade");
    // start closed
    blades.forEach(function (b) { b.style.transform = "rotate(0deg) scale(1)"; });
    window.requestAnimationFrame(function () {
      window.setTimeout(function () {
        blades.forEach(function (b, i) {
          b.style.transition = "transform 1.1s cubic-bezier(0.22,1,0.36,1) " + (i * 0.05) + "s";
          b.style.transform = "rotate(" + (i * 45) + "deg) scale(0.62)";
        });
      }, 200);
    });
  }

  /* Header brand mark micro-open on hover */
  var brandMark = document.querySelector(".brand__mark");
  if (brandMark && !reduce) {
    brandMark.closest(".brand").addEventListener("mouseenter", function () {
      brandMark.querySelectorAll(".blade").forEach(function (b, i) {
        b.style.transform = "rotate(" + (i * 30) + "deg) scale(0.8)";
      });
    });
    brandMark.closest(".brand").addEventListener("mouseleave", function () {
      brandMark.querySelectorAll(".blade").forEach(function (b) {
        b.style.transform = "";
      });
    });
  }

  /* ---- Cookie notice (privacy-first, no tracking loaded) ---------------- */
  var cookie = document.querySelector(".cookie");
  if (cookie) {
    var KEY = "payeye_cookie_choice";
    var stored = null;
    try { stored = window.localStorage.getItem(KEY); } catch (e) {}
    if (!stored) {
      window.setTimeout(function () { cookie.classList.add("is-in"); }, 1200);
    }
    cookie.querySelectorAll("[data-cookie]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        try { window.localStorage.setItem(KEY, btn.getAttribute("data-cookie")); } catch (e) {}
        cookie.classList.remove("is-in");
      });
    });
  }

  /* ---- Contact form: friendly UX around the 3rd-party endpoint ---------- */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      var endpoint = form.getAttribute("action") || "";
      // If the placeholder endpoint hasn't been replaced, fall back to mailto.
      if (endpoint.indexOf("REPLACE_WITH") !== -1 || endpoint === "" || endpoint === "#") {
        e.preventDefault();
        var name = (form.querySelector("[name=name]") || {}).value || "";
        var msg = (form.querySelector("[name=message]") || {}).value || "";
        window.location.href =
          "mailto:hello@payeye.ae?subject=" +
          encodeURIComponent("Website enquiry — " + name) +
          "&body=" + encodeURIComponent(msg);
      }
    });
  }
})();
