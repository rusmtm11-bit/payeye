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
    function setMenuOpen(open) {
      links.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    toggle.addEventListener("click", function () {
      setMenuOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenuOpen(false); });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false);
        toggle.focus();
      }
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
        var data = new FormData(form);
        var fields = [
          ["Name", "name"], ["Company", "company"], ["Email", "email"],
          ["Phone", "phone"], ["Service", "service"]
        ];
        var details = fields.map(function (field) {
          var value = data.get(field[1]);
          return value ? field[0] + ": " + value : "";
        }).filter(Boolean);
        var body = details.join("\n") + "\n\n" + data.get("message");
        window.location.href =
          "mailto:hello@payeye.ae?subject=" +
          encodeURIComponent("Website enquiry — " + data.get("name")) +
          "&body=" + encodeURIComponent(body);
      }
    });
  }
})();
