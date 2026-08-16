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