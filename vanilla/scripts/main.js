(function () {
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  var TESTIMONIALS = {
    1: [1, 7, 18, 4, 5],
    2: [6, 8, 9, 14, 16],
    3: [10, 15, 11, 12, 2],
    4: [17, 13, 3, 19],
  };

  function pad2(n) { return n < 10 ? '0' + n : String(n); }

  function captureUtms() {
    var params = new URLSearchParams(window.location.search);
    var captured = {};
    UTM_KEYS.forEach(function (k) {
      var v = params.get(k);
      if (v) captured[k] = v;
    });
    return captured;
  }

  function populateTestimonialRows() {
    Object.keys(TESTIMONIALS).forEach(function (rowKey) {
      var track = document.querySelector('[data-testimonial-row][data-row="' + rowKey + '"]');
      if (!track) return;
      var items = TESTIMONIALS[rowKey];
      var doubled = items.concat(items);
      doubled.forEach(function (n) {
        var card = document.createElement('button');
        card.type = 'button';
        card.className = 'marquee__card';
        card.setAttribute('aria-label', 'Ver depoimento ' + n + ' ampliado');

        var img = document.createElement('img');
        img.className = 'marquee__img';
        img.loading = 'lazy';
        img.src = 'assets/depoimentos/depoimento-' + pad2(n) + '.png';
        img.alt = 'Depoimento ' + n;
        card.appendChild(img);

        card.addEventListener('click', function () {
          openTestimonialViewer(img.src);
        });
        track.appendChild(card);
      });
    });
  }

  function openTestimonialViewer(src) {
    var viewer = document.getElementById('testimonial-viewer');
    var img = document.getElementById('testimonial-viewer-img');
    if (!viewer || !img) return;
    img.src = src;
    viewer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeTestimonialViewer() {
    var viewer = document.getElementById('testimonial-viewer');
    if (!viewer) return;
    viewer.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function bindViewer() {
    var viewer = document.getElementById('testimonial-viewer');
    if (!viewer) return;
    viewer.addEventListener('click', function (e) {
      if (e.target === viewer || e.target.hasAttribute('data-close-viewer') || e.target.closest('[data-close-viewer]')) {
        closeTestimonialViewer();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeTestimonialViewer();
    });
  }

  function bindModalTriggers(controller) {
    document.querySelectorAll('[data-open-modal]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        controller.open();
      });
    });
  }

  function init() {
    populateTestimonialRows();
    bindViewer();

    var utms = captureUtms();
    var modal = window.CaptureModal(utms);
    bindModalTriggers(modal);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
