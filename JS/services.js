/* 
   D40 — SERVICES PAGE SCRIPTS
   Load common.js BEFORE this file.
    */

(function () {
  var hero = document.querySelector('.services-hero');
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
    requestAnimationFrame(function () { requestAnimationFrame(reveal); });
  }
})();

/* Our Two Growth Engines — columns settle, then beams converge, then GROWTH */
(function () {
  var section = document.querySelector('.engines');
  if (!section) return;

  var headline = section.querySelector('.headline');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    section.classList.add('in-view');
    if (headline) headline.classList.add('reveal-in');
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        section.classList.add('in-view');
        if (headline) headline.classList.add('reveal-in');
        observer.unobserve(section);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(section);
})();

/* SEO deep dive + pricing — scroll reveal */
(function () {
  var section = document.querySelector('.seo-detail');
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
  }, { threshold: 0.12 });

  observer.observe(section);
})();

/* Section break — doors-opening wipe */
(function () {
  var brk = document.querySelector('.section-break');
  if (!brk) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    brk.classList.add('in-view');
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        brk.classList.add('in-view');
        observer.unobserve(brk);
      }
    });
  }, { threshold: 0.4 });

  observer.observe(brk);
})();

/* Web Development deep dive + pricing — scroll reveal */
(function () {
  var section = document.querySelector('.web-detail');
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
  }, { threshold: 0.12 });

  observer.observe(section);
})();