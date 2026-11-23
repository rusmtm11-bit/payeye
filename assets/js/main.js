/* PayEye — interactions. Vanilla, dependency-free. */
(function () {
  "use strict";

  if (window.location.pathname.endsWith("/index.html")) {
    var canonicalPath = new URL(window.location.href);
    canonicalPath.pathname = canonicalPath.pathname.slice(0, -"index.html".length);
    window.location.replace(canonicalPath.href);
    return;
  }

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

  /* ---- Contact form: friendly UX around the 3rd-party endpoint ---------- */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    var email = form.elements.namedItem("email");
    var emailError = form.querySelector("#email-error");
    var phone = form.elements.namedItem("phone");

    if (email && emailError) {
      function updateEmailError() {
        var invalid = email.validity.typeMismatch;
        emailError.hidden = !invalid;
        if (invalid) email.setAttribute("aria-invalid", "true");
        else email.removeAttribute("aria-invalid");
      }

      email.addEventListener("blur", updateEmailError);
      email.addEventListener("invalid", updateEmailError);
      email.addEventListener("input", function () {
        if (!emailError.hidden) updateEmailError();
      });
    }

    if (phone) {
      phone.addEventListener("input", function () {
        // Typing a second international dialling prefix replaces the UAE default.
        var international = phone.value.replace(/^\+971\s*(?=\+|00)/, "");
        if (international !== phone.value) phone.value = international;
      });
      phone.addEventListener("paste", function (event) {
        var pasted = event.clipboardData?.getData("text").trim();
        if (phone.value.trim() === phone.defaultValue.trim() && /^(?:\+|00)\s*\d/.test(pasted || "")) {
          event.preventDefault();
          phone.value = pasted;
        }
      });
    }

    form.addEventListener("submit", function (e) {
      var endpoint = form.getAttribute("action") || "";
      // If the placeholder endpoint hasn't been replaced, fall back to mailto.
      if (endpoint.indexOf("REPLACE_WITH") !== -1 || endpoint === "" || endpoint === "#") {
        e.preventDefault();
        var data = new FormData(form);
        if (phone && phone.value.trim() === phone.defaultValue.trim()) {
          data.delete("phone");
        }
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
          "mailto:office@payeyesolutions.com?subject=" +
          encodeURIComponent("Website enquiry — " + data.get("name")) +
          "&body=" + encodeURIComponent(body);
      }
    });
  }
})();
