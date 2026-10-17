(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');

  /* ----- Light / night mode ----- */
  var toggle = document.getElementById('themeToggle');
  function syncToggle() {
    var dark = root.getAttribute('data-theme') === 'dark';
    toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to night mode');
  }
  syncToggle();
  toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncToggle();
  });

  /* ----- Mobile menu ----- */
  var menu = document.getElementById('menu');
  var menuBtn = document.getElementById('menuBtn');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 860) setMenu(false); });

  /* ----- Highlight the current section in the menu ----- */
  var links = Array.prototype.slice.call(menu.querySelectorAll('a'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) {
      var s = document.querySelector(a.getAttribute('href'));
      if (s) spy.observe(s);
    });

    /* ----- Fade-in on scroll ----- */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ----- Screenshot viewer ----- */
  var box = document.getElementById('lightbox');
  var img = document.getElementById('lbImg');
  document.querySelectorAll('.shot').forEach(function (b) {
    b.addEventListener('click', function () {
      img.src = b.getAttribute('data-full');
      img.alt = b.getAttribute('data-alt') || '';
      if (box.showModal) box.showModal(); else window.open(img.src, '_blank');
    });
  });
  document.getElementById('lbClose').addEventListener('click', function () { box.close(); });
  box.addEventListener('click', function (e) { if (e.target === box || e.target === img) box.close(); });
})();
