(function () {
  var introEl  = document.getElementById('intro-screen');
  var fieldEl  = document.getElementById('starRain');
  var skipBtn  = document.getElementById('introSkip');
  var htmlEl   = document.documentElement;

  // TODO: point this at your real star logo file (same one used in the demo).
  var STAR_SRC = "Imgs/D40 Star White Trans.png";

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  var stars      = [];   // physics state for each star: { el, x, y, vx, vy, rot, rotVel }
  var spawnTimer = null;
  var rafId      = null;
  var lastT      = null;
  var leaving    = false;
  var armed      = false; // ignores any stray wheel/touch event fired during page load

  // Cursor position + velocity, used to push and flick stars around.
  var mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };
  var lastMouse = { x: null, y: null, t: 0 };

  function onMouseMove(e) {
    var now = performance.now();
    if (lastMouse.x === null) { // first sample: just record position, no velocity yet
      lastMouse.x = e.clientX; lastMouse.y = e.clientY; lastMouse.t = now;
      mouse.x = e.clientX; mouse.y = e.clientY;
      return;
    }
    var dt = Math.max(now - lastMouse.t, 1) / 1000;
    mouse.vx = (e.clientX - lastMouse.x) / dt;
    mouse.vy = (e.clientY - lastMouse.y) / dt;
    mouse.x = e.clientX; mouse.y = e.clientY;
    lastMouse.x = e.clientX; lastMouse.y = e.clientY; lastMouse.t = now;
  }
  function onMouseLeave() {
    mouse.x = -9999; mouse.y = -9999; mouse.vx = 0; mouse.vy = 0;
    lastMouse.x = null;
  }

  // Creates one falling star as a physics object (position/velocity), not a CSS animation.
  function spawnStar() {
    var size = rand(56, 72);
    var el = document.createElement('img');
    el.src = STAR_SRC;
    el.alt = '';
    el.className = 'rain-star';
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.opacity = rand(.55, 1).toFixed(2);
    fieldEl.appendChild(el);

    stars.push({
      el: el,
      x: rand(0, window.innerWidth),
      y: rand(-140, -20),
      vx: rand(-8, 8),
      vy: rand(70, 120),
      rot: rand(0, 360),
      rotVel: rand(-30, 30)
    });
  }

  function startRain() {
    for (var i = 0; i < 1; i++) spawnStar();     // initial burst, screen isn't empty on paint
    spawnTimer = setInterval(function () {
      if (stars.length < 140) spawnStar();          // keep raining, capped so it can't run away
    }, 350);
    lastT = null;
    rafId = requestAnimationFrame(tick);
  }

  // Runs every frame: falls under gravity, and gets pushed/flicked near the cursor.
  function tick(t) {
    if (lastT === null) lastT = t;
    var dt = Math.min((t - lastT) / 1000, 0.05); // clamp so a dropped frame can't cause a jump
    lastT = t;

    var REPEL_RADIUS = 85;   // px — how close the cursor needs to be to touch a star
    var PUSH         = 1400; // proximity push strength
    var SWIPE        = 0.5;  // how much of the cursor's own speed gets "flicked" onto a star

    for (var i = stars.length - 1; i >= 0; i--) {
      var s = stars[i];

      s.vy = Math.min(s.vy + 45 * dt, 220);   // gentle gravity toward a terminal fall speed
      s.vx *= Math.pow(0.92, dt * 60);        // drag, so a push settles instead of spinning out forever
      s.rotVel *= Math.pow(0.95, dt * 60);

      var dx = s.x - mouse.x, dy = s.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;
      if (dist < REPEL_RADIUS) {
        var falloff = 1 - dist / REPEL_RADIUS;    // 1 = right on the cursor, 0 = at the edge of range
        s.vx += (dx / dist) * falloff * PUSH * dt;
        s.vy += (dy / dist) * falloff * PUSH * dt;
        s.vx += mouse.vx * SWIPE * falloff * dt;  // fast swipes "hit" the star, not just nudge it
        s.vy += mouse.vy * SWIPE * falloff * dt;
        s.rotVel += (Math.random() - 0.5) * falloff * 260 * dt;
      }

      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.rot += s.rotVel * dt;
      s.el.style.transform = 'translate3d(' + s.x.toFixed(1) + 'px,' + s.y.toFixed(1) + 'px,0) rotate(' + s.rot.toFixed(1) + 'deg)';

      if (s.y > window.innerHeight + 60) {
        s.el.remove();
        stars.splice(i, 1);
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  function onWheel(e) { e.preventDefault(); reveal(); }
  function onTouchMove(e) { e.preventDefault(); reveal(); }

  // Fades the intro out, cross-dissolving into the home page underneath.
  function reveal() {
    if (!armed || leaving) return; // no reveal until the user actually does something
    leaving = true;
    clearInterval(spawnTimer);
    introEl.classList.add('leaving');
    var headline = document.querySelector('.headline');
    if (headline) headline.classList.add('reveal-in');
    window.removeEventListener('keydown', onKey);
    // wheel/touchmove + the scroll lock stay in place until the fade fully
    // finishes below, removing them here would let this same gesture (or
    // its trackpad momentum) scroll the home page while it's still fading in.
    introEl.addEventListener('transitionend', function () {
      cancelAnimationFrame(rafId);
      htmlEl.classList.remove('intro-active');
      document.body.classList.remove('intro-active');
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      introEl.remove();
    }, { once: true });
  }

  function onKey(e) {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') reveal();
  }

  if (reduceMotion) {
    introEl.remove(); // respect reduced-motion: skip straight to the home page
  } else {
    htmlEl.classList.add('intro-active');
    document.body.classList.add('intro-active');
    startRain();
    setTimeout(function () { armed = true; }, 400);   // ignore any spurious wheel/touch on load
    window.addEventListener('wheel', reveal, { passive: true });
    window.addEventListener('touchmove', reveal, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    skipBtn.addEventListener('click', function () { armed = true; reveal(); });
  }
})();

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

///Positioning section
(function () {
  var section = document.querySelector('.positioning');
  if (!section) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    section.classList.add('in-view'); // show immediately, no scroll-reveal
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        section.classList.add('in-view');
        observer.unobserve(section); // reveal once, don't re-trigger scrolling back up
      }
    });
  }, { threshold: 0.25 });

  observer.observe(section);
})();

/* Service Cards */

(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('.service-card'));
  if (!cards.length) return;

  function closeCard(card) {
    card.classList.remove('is-open');
    var btn = card.querySelector('.service-card__toggle');
    var detail = card.querySelector('.service-card__detail');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (detail) detail.setAttribute('aria-hidden', 'true');
  }
  function openCard(card) {
    card.classList.add('is-open');
    var btn = card.querySelector('.service-card__toggle');
    var detail = card.querySelector('.service-card__detail');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    if (detail) detail.setAttribute('aria-hidden', 'false');
  }

  cards.forEach(function (card) {
    var btn = card.querySelector('.service-card__toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var wasOpen = card.classList.contains('is-open');
      cards.forEach(closeCard);       // accordion: only one open at a time
      if (!wasOpen) openCard(card);
    });
  });
})();