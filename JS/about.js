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