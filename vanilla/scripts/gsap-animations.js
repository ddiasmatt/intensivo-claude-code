(function (global) {
  var prefersReducedMotion = global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ensureGsap() {
    return typeof global.gsap !== 'undefined';
  }

  function splitHeadlineIntoWords(h1) {
    var walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT, null);
    var textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(function (textNode) {
      var frag = document.createDocumentFragment();
      var parts = textNode.textContent.split(/(\s+)/);
      parts.forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          return;
        }
        var word = document.createElement('span');
        word.className = 'word';
        var inner = document.createElement('span');
        inner.className = 'word__inner';
        inner.textContent = part;
        word.appendChild(inner);
        frag.appendChild(word);
      });
      textNode.parentNode.replaceChild(frag, textNode);
    });
  }

  function animateHeadline(h1) {
    if (!ensureGsap()) return;
    splitHeadlineIntoWords(h1);
    var inners = h1.querySelectorAll('.word__inner');
    global.gsap.set(inners, { yPercent: 110, opacity: 0 });
    global.gsap.to(inners, {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.04,
      delay: 0.1,
    });
  }

  function animateAurora() {
    if (!ensureGsap() || prefersReducedMotion) return;
    var orbs = document.querySelectorAll('.aurora__orb');
    orbs.forEach(function (orb, i) {
      var signX = i % 2 === 0 ? 1 : -1;
      var signY = i % 2 === 0 ? -1 : 1;
      global.gsap.to(orb, {
        x: 120 * signX,
        y: 80 * signY,
        scale: 1.15,
        duration: 8 + i * 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });
  }

  function animateMagnetic() {
    if (!ensureGsap() || prefersReducedMotion) return;
    var buttons = document.querySelectorAll('[data-magnetic]');
    buttons.forEach(function (btn) {
      var qx = global.gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power3.out' });
      var qy = global.gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power3.out' });

      btn.addEventListener('pointermove', function (e) {
        var rect = btn.getBoundingClientRect();
        var relX = e.clientX - rect.left - rect.width / 2;
        var relY = e.clientY - rect.top - rect.height / 2;
        qx(relX * 0.25);
        qy(relY * 0.35);
      });
      btn.addEventListener('pointerleave', function () {
        qx(0);
        qy(0);
      });
    });
  }

  function animateScrollReveals() {
    if (!ensureGsap() || typeof global.ScrollTrigger === 'undefined') {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }
    global.gsap.registerPlugin(global.ScrollTrigger);

    global.gsap.utils.toArray('.reveal').forEach(function (el) {
      global.gsap.fromTo(
        el,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: function () { el.classList.add('is-visible'); },
          },
        }
      );
    });

    global.gsap.utils.toArray('.benefits__grid .benefit-card').forEach(function (card, i) {
      global.gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: card, start: 'top 90%', once: true },
        }
      );
    });
  }

  function animateSparkles() {
    var canvas = document.getElementById('urgency-sparkles');
    if (!canvas || prefersReducedMotion) return;
    var ctx = canvas.getContext('2d');
    var sparkles = [];
    var width = 0;
    var height = 0;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = global.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn() {
      sparkles.push({
        x: Math.random() * width,
        y: height + 10,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.6 - Math.random() * 1.1,
        life: 1,
        decay: 0.005 + Math.random() * 0.01,
        size: Math.random() * 2.2 + 0.8,
        color: Math.random() > 0.35 ? '224, 122, 58' : '245, 158, 83',
      });
    }

    function frame() {
      ctx.clearRect(0, 0, width, height);
      if (Math.random() < 0.45) spawn();
      for (var i = sparkles.length - 1; i >= 0; i--) {
        var s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;
        if (s.life <= 0) { sparkles.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = s.life * 0.85;
        ctx.fillStyle = 'rgba(' + s.color + ',1)';
        ctx.shadowColor = 'rgba(' + s.color + ',0.9)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      global.requestAnimationFrame(frame);
    }

    function start() {
      resize();
      global.addEventListener('resize', resize);
      frame();
    }

    if (typeof global.IntersectionObserver === 'function') {
      var io = new global.IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            start();
            io.disconnect();
          }
        });
      }, { threshold: 0.1 });
      io.observe(canvas);
    } else {
      start();
    }
  }

  function initHeadline() {
    var h1 = document.querySelector('[data-split-reveal]');
    if (h1) animateHeadline(h1);
  }

  function init() {
    animateAurora();
    initHeadline();
    animateMagnetic();
    animateScrollReveals();
    animateSparkles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.GSAPEffects = { init: init };
})(window);
