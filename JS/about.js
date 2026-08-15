/* 
   D40 — ABOUT PAGE SCRIPTS
   Load common.js BEFORE this file.
    */

(function () {
  var hero = document.querySelector('.about-hero');
  if (!hero) return;

  var headline = hero.querySelector('.headline');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function reveal() {
    hero.classList.add('reveal-in');
    if (headline) headline.classList.add('reveal-in');
  }

  if (reduceMotion) {
    reveal();
  } else {
    // two rAFs, so the hidden starting state actually paints before the transition begins
    requestAnimationFrame(function () { requestAnimationFrame(reveal); });
  }
})();

/* Why D40 Exists — scroll reveal 
(function () {
  var section = document.querySelector('.why-exists');
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
  }, { threshold: 0.2 });

  observer.observe(section);
})();*/

/* Pillars Section What D40 Actually Is */

/* What D40 Actually Is — hover- and scroll-driven pillar spotlight */
(function () {
  var stack = document.getElementById('pillarsStack');
  if (!stack) return;
  var pillars = Array.prototype.slice.call(stack.querySelectorAll('.pillar'));
  if (!pillars.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setActive(pillar) {
    pillars.forEach(function (p) {
      var isActive = p === pillar;
      p.classList.toggle('is-active', isActive);
      var detail = p.querySelector('.pillar__detail');
      if (detail) detail.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });
    stack.classList.toggle('has-active', !!pillar);
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    stack.classList.add('static'); // show every pillar's detail open, nothing scroll-driven
    return;
  }

  var scrollActive = null;
  var hovering = false;

  // Whichever pillar crosses the vertical center band of the viewport
  // becomes the "resting" active one as the person scrolls.
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        scrollActive = entry.target;
        if (!hovering) setActive(scrollActive);
      }
    });
  }, { threshold: 0, rootMargin: '-42% 0px -42% 0px' });

  pillars.forEach(function (p) { observer.observe(p); });

  // Hover (or keyboard focus) temporarily overrides the scroll-driven one.
  pillars.forEach(function (p) {
    var toggle = p.querySelector('.pillar__toggle');
    if (!toggle) return;
    toggle.addEventListener('mouseenter', function () { hovering = true; setActive(p); });
    toggle.addEventListener('focus', function () { hovering = true; setActive(p); });
  });

  stack.addEventListener('mouseleave', function () { hovering = false; setActive(scrollActive); });
  stack.addEventListener('focusout', function (e) {
    if (!stack.contains(e.relatedTarget)) { hovering = false; setActive(scrollActive); }
  });
})();

/* Our Philosophy — grid accordion + scroll-in reveal */
(function () {
  var section = document.querySelector('.philosophy');
  if (!section) return;
  var grid = document.getElementById('philosophyGrid');
  var principles = Array.prototype.slice.call(section.querySelectorAll('.principle'));

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    section.classList.add('in-view');
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          section.classList.add('in-view');
          observer.unobserve(section);
        }
      });
    }, { threshold: 0.15 });
    observer.observe(section);
  }

  function closePrinciple(p) {
    p.classList.remove('is-open');
    var btn = p.querySelector('.principle__toggle');
    var detail = p.querySelector('.principle__detail');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (detail) detail.setAttribute('aria-hidden', 'true');
  }
  function openPrinciple(p) {
    p.classList.add('is-open');
    var btn = p.querySelector('.principle__toggle');
    var detail = p.querySelector('.principle__detail');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    if (detail) detail.setAttribute('aria-hidden', 'false');
  }

  principles.forEach(function (p) {
    var btn = p.querySelector('.principle__toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var wasOpen = p.classList.contains('is-open');
      principles.forEach(closePrinciple);
      grid.classList.remove('has-open');
      if (!wasOpen) {
        openPrinciple(p);
        grid.classList.add('has-open');
      }
    });
  });
})();

/* Where We're Going — headline, body, then statement, in sequence */
(function () {
  var section = document.querySelector('.going');
  if (!section) return;

  var headline  = section.querySelector('.going__headline');
  var statement = section.querySelector('.going__statement');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function reveal() {
    section.classList.add('in-view');
    if (headline) headline.classList.add('reveal-in');
    if (statement) statement.classList.add('reveal-in');
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveal();
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        reveal();
        observer.unobserve(section);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(section);
})();