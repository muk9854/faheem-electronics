(function () {
  "use strict";

  const header = document.querySelector(".header");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const TOAST_MS = 4000;

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 10);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealTargets.length) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("in");
    });
  }

  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lbImage = document.getElementById("lbImage");
    const lbCaption = document.getElementById("lbCaption");
    const lbClose = document.getElementById("lbClose");
    const lbItems = Array.prototype.map.call(
      document.querySelectorAll(".g-item"),
      function (item) {
        return {
          img: item.querySelector("img"),
          caption: item.getAttribute("data-caption") || ""
        };
      }
    );
    let lbIndex = 0;
    let lbLastFocus = null;

    function renderLightbox() {
      const entry = lbItems[lbIndex];
      if (!entry) return;
      if (entry.img) {
        lbImage.src = entry.img.src;
        lbImage.alt = entry.caption;
      }
      lbCaption.textContent = entry.caption;
    }

    function openLightbox() {
      lbLastFocus = document.activeElement;
      renderLightbox();
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
      if (lbClose) lbClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
      if (lbLastFocus) lbLastFocus.focus();
    }

    function step(dir) {
      lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
      renderLightbox();
    }

    lbItems.forEach(function (entry, i) {
      if (entry.img) {
        entry.img.addEventListener("click", function () {
          lbIndex = i;
          openLightbox();
        });
      }
    });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    lbClose.addEventListener("click", closeLightbox);
    document.getElementById("lbPrev").addEventListener("click", function () { step(-1); });
    document.getElementById("lbNext").addEventListener("click", function () { step(1); });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "Tab") {
        const focusables = lightbox.querySelectorAll("button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  const form = document.getElementById("contactForm");
  const toast = document.getElementById("toast");
  let toastTimer = null;

  function showToast(message, ok) {
    if (!toast) return;
    toast.classList.toggle("error", !ok);
    toast.querySelector(".t-icon").textContent = ok ? "\u2713" : "!";
    toast.querySelector(".t-text").textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, TOAST_MS);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const fields = form.querySelectorAll("input, select, textarea");
      let valid = form.checkValidity();

      fields.forEach(function (field) {
        const fieldValid = field.checkValidity();
        field.setAttribute("aria-invalid", fieldValid ? "false" : "true");
        if (!fieldValid) valid = false;
      });

      if (!valid) {
        form.classList.add("was-validated");
        showToast("Please fill all required fields correctly.", false);
        return;
      }

      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const body =
        "Name: " + name + "\n" +
        "Phone: " + data.get("phone") + "\n" +
        "Email: " + (data.get("email") || "-") + "\n" +
        "Service: " + (data.get("service") || "Not specified") + "\n\n" +
        "Problem: " + data.get("message");
      const mailto =
        "mailto:info@faheemelectronics.pk" +
        "?subject=" + encodeURIComponent("Service Request — " + name) +
        "&body=" + encodeURIComponent(body);

      form.reset();
      form.classList.remove("was-validated");
      fields.forEach(function (field) {
        field.removeAttribute("aria-invalid");
      });
      showToast("Thank you! Opening your email app to send the message\u2026", true);
      window.location.href = mailto;
    });

    form.addEventListener("input", function (e) {
      if (e.target.hasAttribute("aria-invalid") && e.target.checkValidity()) {
        e.target.removeAttribute("aria-invalid");
      }
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
