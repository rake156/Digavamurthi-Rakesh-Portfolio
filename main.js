(function () {
  "use strict";

  /* ----------------------------------
     Mobile menu
  ---------------------------------- */
  var burger = document.querySelector(".burger");
  var overlay = document.getElementById("overlay");
  var menu = document.getElementById("mobile-menu");
  var body = document.body;

  function openMenu() {
    if (!burger || !overlay || !menu) return;
    burger.setAttribute("aria-expanded", "true");
    overlay.hidden = false;
    menu.hidden = false;
    body.classList.add("menu-open");
  }

  function closeMenu() {
    if (!burger || !overlay || !menu) return;
    burger.setAttribute("aria-expanded", "false");
    overlay.hidden = true;
    menu.hidden = true;
    body.classList.remove("menu-open");
  }

  function toggleMenu() {
    var isOpen = burger.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (burger) {
    burger.addEventListener("click", toggleMenu);
  }
  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });
  if (menu) {
    var menuLinks = menu.querySelectorAll("a");
    for (var i = 0; i < menuLinks.length; i++) {
      menuLinks[i].addEventListener("click", closeMenu);
    }
  }
  window.addEventListener("resize", function () {
    if (window.innerWidth > 720) closeMenu();
  });

  /* ----------------------------------
     Stats count-up
  ---------------------------------- */
  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function formatValue(value, decimals) {
    return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
  }

  function animateStat(el, index) {
    var target = parseFloat(el.getAttribute("data-target"));
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = parseInt(el.getAttribute("data-decimals"), 10) || 0;

    if (prefersReducedMotion) {
      el.textContent = formatValue(target, decimals) + suffix;
      return;
    }

    var duration = 1500 + index * 80;
    var startOffset = 480 + index * 90;

    window.setTimeout(function () {
      var startTime = null;

      function step(timestamp) {
        if (startTime === null) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = easeOutCubic(progress);
        var current = target * eased;

        el.textContent = formatValue(current, decimals) + suffix;

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = formatValue(target, decimals) + suffix;
        }
      }

      window.requestAnimationFrame(step);
    }, startOffset);
  }

  var statValues = document.querySelectorAll(".stat-value");
  var statsSection = document.querySelector(".stats");
  var hasAnimated = false;

  function runAllStats() {
    if (hasAnimated) return;
    hasAnimated = true;
    for (var i = 0; i < statValues.length; i++) {
      animateStat(statValues[i], i);
    }
  }

  if (statsSection && statValues.length) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runAllStats();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.25 }
      );
      observer.observe(statsSection);
    } else {
      runAllStats();
    }
  }
})();
