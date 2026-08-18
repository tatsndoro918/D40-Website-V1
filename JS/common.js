/* 
   D40 — COMMON / SHARED SCRIPTS
   Load this on every page, alongside that page's own script
   file (e.g. home.js, about.js). Each block below is self-
   contained and checks for its own elements before running,
   so it's harmless on a page that doesn't include them.
    */

/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

(function () {

  var header = document.querySelector('.site-header');
  var toggle = document.getElementById('navToggle');
  var panel = document.getElementById('mobileMenu');

  if (!header || !toggle || !panel) return;


  /* Mobile breakpoint */

  var mq = window.matchMedia('(max-width: 860px)');


  /* -------------------------------------------------------
     CLOSE MENU
     ------------------------------------------------------- */

  function closeMenu() {

    header.classList.remove('nav-open');

    toggle.setAttribute('aria-expanded', 'false');

    toggle.setAttribute('aria-label', 'Open menu');

    if (mq.matches) {
      panel.setAttribute('aria-hidden', 'true');
    }
  }


  /* -------------------------------------------------------
     OPEN MENU
     ------------------------------------------------------- */

  function openMenu() {

    header.classList.add('nav-open');

    toggle.setAttribute('aria-expanded', 'true');

    toggle.setAttribute('aria-label', 'Close menu');

    panel.setAttribute('aria-hidden', 'false');
  }


  /* -------------------------------------------------------
     SYNC WITH SCREEN SIZE
     ------------------------------------------------------- */

  function syncToViewport() {

    if (mq.matches) {

      /*
        Mobile:
        menu starts closed.
      */

      if (!header.classList.contains('nav-open')) {
        panel.setAttribute('aria-hidden', 'true');
      }

    } else {

      /*
        Desktop:
        remove all mobile menu state.
      */

      header.classList.remove('nav-open');

      toggle.setAttribute('aria-expanded', 'false');

      toggle.setAttribute('aria-label', 'Open menu');

      panel.removeAttribute('aria-hidden');
    }
  }


  /* -------------------------------------------------------
     HAMBURGER CLICK
     ------------------------------------------------------- */

  toggle.addEventListener('click', function () {

    if (header.classList.contains('nav-open')) {

      closeMenu();

    } else {

      openMenu();

    }

  });


  /* -------------------------------------------------------
     CLOSE AFTER CLICKING A LINK
     ------------------------------------------------------- */

  panel.addEventListener('click', function (e) {

    if (e.target.closest('a')) {
      closeMenu();
    }

  });


  /* -------------------------------------------------------
     ESCAPE KEY
     ------------------------------------------------------- */

  document.addEventListener('keydown', function (e) {

    if (
      e.key === 'Escape' &&
      header.classList.contains('nav-open')
    ) {
      closeMenu();
    }

  });


  /* -------------------------------------------------------
     CLICK OUTSIDE
     ------------------------------------------------------- */

  document.addEventListener('click', function (e) {

    if (
      header.classList.contains('nav-open') &&
      !header.contains(e.target)
    ) {
      closeMenu();
    }

  });


  /* -------------------------------------------------------
     INITIALISE
     ------------------------------------------------------- */

  syncToViewport();


  /* Listen for viewport changes */

  if (mq.addEventListener) {

    mq.addEventListener('change', syncToViewport);

  } else {

    /* Older Safari fallback */

    mq.addListener(syncToViewport);

  }

})();

/* Mouse-follow spotlight */
(function () {
  var light = document.getElementById('cursor-light');
  if (!light) return;

  var reduceMotion   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (reduceMotion || !hasFinePointer) return; // no mouse, or motion is off — skip entirely

  var HALF = 320; // half of #cursor-light's 640px size, for centering
  var EASE = 0.08; // lower = lazier trail, higher = snappier tracking

  var target  = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  var current = { x: target.x, y: target.y };
  var started = false;

  function onMove(e) {
    target.x = e.clientX;
    target.y = e.clientY;
    if (!started) {
      started = true;
      current.x = target.x;
      current.y = target.y;
      light.classList.add('active');
    }
  }

  function tick() {
    current.x += (target.x - current.x) * EASE;
    current.y += (target.y - current.y) * EASE;
    light.style.transform = 'translate3d(' + (current.x - HALF).toFixed(1) + 'px,' + (current.y - HALF).toFixed(1) + 'px,0)';
    requestAnimationFrame(tick);
  }

  window.addEventListener('mousemove', onMove, { passive: true });
  requestAnimationFrame(tick);
})();

/* CTA */
(function () {
  var section = document.querySelector('.final-cta');
  if (!section) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    section.classList.add('in-view');
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        section.classList.add('in-view');
        observer.unobserve(section);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(section);
})();

/* Footer */
(function () {
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();