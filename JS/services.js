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

/* Why We Package Our Services — staircase reveal */
(function () {
  var section = document.querySelector('.tiers');
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
})();

/* SEO + Web Development — pipeline reveal */
(function () {
  var section = document.querySelector('.synergy');
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
  }, { threshold: 0.15 });

  observer.observe(section);
})();

/* Which Package Is Right For You? — business-type selector */
(function () {
  var section = document.getElementById('finder');
  if (!section) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    section.classList.add('in-view');
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          section.classList.add('in-view');
          revealObserver.unobserve(section);
        }
      });
    }, { threshold: 0.2 });
    revealObserver.observe(section);
  }

  var options = Array.prototype.slice.call(section.querySelectorAll('.finder__option'));
  var result  = document.getElementById('finderResult');
  var combo   = document.getElementById('finderCombo');
  var webLink = document.getElementById('finderWebLink');
  var seoLink = document.getElementById('finderSeoLink');

  var RECOMMENDATIONS = {
    local:       { web: 'Web Base',    seo: 'SEO Base',    webId: 'plan-web-base',    seoId: 'plan-seo-base' },
    growing:     { web: 'Web Growth',  seo: 'SEO Growth',  webId: 'plan-web-growth',  seoId: 'plan-seo-growth' },
    established: { web: 'Web Premium', seo: 'SEO Premium', webId: 'plan-web-premium', seoId: 'plan-seo-premium' }
  };

  function highlightPlan(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('plan--pulse');
    void el.offsetWidth; // force reflow so the animation restarts if the same card is targeted twice in a row
    el.classList.add('plan--pulse');
    el.addEventListener('animationend', function handler() {
      el.classList.remove('plan--pulse'); // lets a featured card's own ambient glow resume cleanly
      el.removeEventListener('animationend', handler);
    });
  }

  options.forEach(function (opt) {
    opt.addEventListener('click', function () {
      options.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
      opt.setAttribute('aria-pressed', 'true');

      var rec = RECOMMENDATIONS[opt.getAttribute('data-recommend')];
      if (!rec || !combo || !webLink || !seoLink) return;

      combo.textContent = rec.web + ' + ' + rec.seo;
      webLink.href = '#' + rec.webId;
      webLink.innerHTML = 'View ' + rec.web + ' <span aria-hidden="true">→</span>';
      seoLink.href = '#' + rec.seoId;
      seoLink.innerHTML = 'View ' + rec.seo + ' <span aria-hidden="true">→</span>';

      if (result) result.classList.add('is-visible');
    });
  });

  if (result) {
    result.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('.finder__result-link') : null;
      if (!link) return;
      var id = link.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      highlightPlan(id);
    });
  }
})();

/* FAQ — accordion */
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));
  if (!items.length) return;

  function closeItem(item) {
    item.classList.remove('is-open');
    var btn = item.querySelector('.faq-item__toggle');
    var detail = item.querySelector('.faq-item__detail');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (detail) detail.setAttribute('aria-hidden', 'true');
  }
  function openItem(item) {
    item.classList.add('is-open');
    var btn = item.querySelector('.faq-item__toggle');
    var detail = item.querySelector('.faq-item__detail');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    if (detail) detail.setAttribute('aria-hidden', 'false');
  }

  items.forEach(function (item) {
    var btn = item.querySelector('.faq-item__toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var wasOpen = item.classList.contains('is-open');
      items.forEach(closeItem);
      if (!wasOpen) openItem(item);
    });
  });
})();