/* =========================================================================
   DKVEARLESS — interactions
   Foto, cerita, dan video tetap lokal. Buku pesan memakai Supabase.
   ========================================================================= */
(function () {
  "use strict";

  var data = window.DKV3_MEDIA || {};
  var photos = Array.isArray(data.photos) ? data.photos.slice() : [];
  var timeline = Array.isArray(data.timeline) ? data.timeline.slice() : [];
  var students = Array.isArray(data.students) ? data.students.slice() : [];
  var videos = Array.isArray(data.videos) ? data.videos.slice() : [];
  var randomPhotos = Array.isArray(data.randomPhotos) ? data.randomPhotos.slice() : [];
  var categories = Array.isArray(data.categories) && data.categories.length
    ? data.categories.slice()
    : ["Semua"];

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (err) { reduceMotion = false; }

  /* ---------- ELEMEN ---------- */
  var body = document.body;
  var site = $("#site");
  var loader = $("#loader");
  var opening = $("#opening");
  var openMemories = $("#openMemories");
  var siteHeader = $("#siteHeader");
  var brandLogo = $("#brandLogo");
  var nav = $(".nav");
  var primaryNav = $("#primaryNav");
  var navToggle = $("#navToggle");
  var navLinks = $$("#primaryNav a");
  var scrollProgress = $("#scrollProgress");
  var toTop = $("#toTop");
  var footerTop = $("#footerTop");
  var music = $("#bgMusic");
  var musicToggle = $("#musicToggle");
  var musicLabel = $("#musicLabel");
  var musicOverlay = $("#musicOverlay");
  var musicOverlayButton = $("#musicOverlayButton");

  var timelineList = $("#timelineList");
  var galleryFilters = $("#galleryFilters");
  var galleryGrid = $("#galleryGrid");
  var galleryCount = $("#galleryCount");
  var gallerySearch = $("#gallerySearch");
  var searchClear = $("#searchClear");
  var galleryEmpty = $("#galleryEmpty");
  var resetFilters = $("#resetFilters");
  var slideshowButton = $("#startSlideshow");
  var layoutButtons = $$("[data-layout]");
  var randomButtons = [$("#randomMemory"), $("#randomMemoryFloat")].filter(Boolean);

  var randomImage = $("#randomImage");
  var randomCaption = $("#randomCaption");
  var randomCount = $("#randomCount");
  var randomStageButton = $("#randomStageButton");
  var randomNext = $("#randomNext");
  var randomFullscreen = $("#randomFullscreen");
  var randomStrip = $("#randomStrip");

  var guessImage = $("#guessImage");
  var guessFrame = $("#guessFrame");
  var guessProgress = $("#guessProgress");
  var guessQuestion = $("#guessQuestion");
  var guessOptions = $("#guessOptions");
  var guessFeedback = $("#guessFeedback");
  var guessCaption = $("#guessCaption");
  var nextGuess = $("#nextGuess");

  var cinema = $("#cinema");
  var video = $("#memoryVideo");
  var cinemaStage = $("#cinemaStage");
  var videoBigPlay = $("#videoBigPlay");
  var videoPlay = $("#videoPlay");
  var videoSeek = $("#videoSeek");
  var videoTime = $("#videoTime");
  var videoVolume = $("#videoVolume");
  var videoMute = $("#videoMute");
  var videoFullscreen = $("#videoFullscreen");
  var filmKicker = $("#filmKicker");
  var filmTitle = $("#filmTitle");
  var filmCaption = $("#filmCaption");
  var filmOrientation = $("#filmOrientation");
  var filmLength = $("#filmLength");
  var filmIndex = $("#filmIndex");
  var filmDuration = $("#filmDuration");
  var filmPrev = $("#filmPrev");
  var filmNext = $("#filmNext");
  var reelLandscape = $("#reelLandscape");
  var reelPortrait = $("#reelPortrait");
  var iconPlay = $(".icon-play", videoPlay);
  var iconPause = $(".icon-pause", videoPlay);
  var iconVolume = $(".icon-volume", videoMute);
  var iconMuted = $(".icon-muted", videoMute);

  var studentList = $("#studentList");
  var studentTotal = $("#studentTotal");

  var guestbookForm = $("#guestbookForm");
  var guestName = $("#guestName");
  var guestMessage = $("#guestMessage");
  var guestCount = $("#guestCount");
  var guestbookStatus = $("#guestbookStatus");
  var guestbookList = $("#guestbookList");
  var guestbookEmpty = $("#guestbookEmpty");
  var guestbookTotal = $("#guestbookTotal");
  var refreshGuestbook = $("#refreshGuestbook");

  var lightbox = $("#lightbox");
  var lbImage = $("#lbImage");
  var lbCaption = $("#lbCaption");
  var lbMeta = $("#lbMeta");
  var lbCounter = $("#lbCounter");
  var lbProgress = $("#lbProgress");
  var lbClose = $("#lbClose");
  var lbPrev = $("#lbPrev");
  var lbNext = $("#lbNext");
  var lbFull = $("#lbFull");
  var lbSlideshow = $("#lbSlideshow");
  var lbPlayLabel = $("#lbPlayLabel");

  var guideModal = $("#guideModal");
  var eggModal = $("#eggModal");
  var pageChrome = $$(".floating-tools, .skip-link");

  /* ---------- STATE ---------- */
  var state = {
    filter: "Semua",
    query: "",
    layout: "editorial",
    visible: [],
    lbItems: [],
    lbIndex: 0,
    lbTrigger: null,
    slideshow: false,
    slideshowTimer: 0,
    modalOpen: null,
    modalTrigger: null,
    introDone: false,
    toastTimer: 0,
    eggClicks: 0,
    eggTimer: 0,
    keyBuffer: "",
    randomIndex: 0,
    videoIndex: 0,
    videoAuto: false,
    resumeMusicAfterVideo: false
  };

  var storage = (function () {
    var fallback = {};
    var ok = true;
    try {
      window.localStorage.setItem("__dkv_probe__", "1");
      window.localStorage.removeItem("__dkv_probe__");
    } catch (err) { ok = false; }
    return {
      get: function (key) {
        if (!ok) return Object.prototype.hasOwnProperty.call(fallback, key) ? fallback[key] : null;
        try { return window.localStorage.getItem(key); } catch (err) { return null; }
      },
      set: function (key, value) {
        if (!ok) { fallback[key] = value; return; }
        try { window.localStorage.setItem(key, value); } catch (err) { fallback[key] = value; }
      }
    };
  })();

  /* ---------- UTIL ---------- */
  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalize(value) {
    return String(value == null ? "" : value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    var total = Math.floor(seconds);
    var m = Math.floor(total / 60);
    var s = total % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function formatDate(iso) {
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit", month: "short", year: "numeric"
      }).format(new Date(iso));
    } catch (err) { return ""; }
  }

  function showToast(message) {
    var toast = $(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    window.clearTimeout(state.toastTimer);
    toast.textContent = message;
    window.requestAnimationFrame(function () { toast.classList.add("is-visible"); });
    state.toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 3600);
  }

  function ratio(w, h, fallback) {
    if (w > 0 && h > 0) return w + " / " + h;
    return fallback || "4 / 3";
  }

  function shapeOf(w, h) {
    if (!w || !h) return "square";
    var ar = w / h;
    if (ar >= 1.35) return "wide";
    if (ar < 0.95) return "portrait";
    return "square";
  }

  function setSiteInert(value) {
    if (site) {
      site.inert = value;
      if (value) site.setAttribute("aria-hidden", "true");
      else site.removeAttribute("aria-hidden");
    }
    pageChrome.forEach(function (el) {
      el.inert = value;
      if (value) el.setAttribute("aria-hidden", "true");
      else el.removeAttribute("aria-hidden");
    });
  }

  function getFocusable(container) {
    return $$('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])', container)
      .filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
  }

  function trapFocus(container, event) {
    if (event.key !== "Tab") return;
    var list = getFocusable(container);
    if (!list.length) return;
    var first = list[0];
    var last = list[list.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* ---------- LOADER & SAMPUL ---------- */
  var loaderHidden = false;

  function hideLoader() {
    if (loaderHidden || !loader) return;
    loaderHidden = true;
    loader.classList.add("is-done");
    if (!state.introDone && openMemories) {
      window.setTimeout(function () { openMemories.focus({ preventScroll: true }); }, 140);
    }
  }

  window.addEventListener("load", function () { window.setTimeout(hideLoader, 350); });
  window.setTimeout(hideLoader, 2200);

  if (site) setSiteInert(true);

  var skipIntro = /(?:\?|&)skipintro=1/.test(window.location.search);

  function openArchive(options) {
    if (state.introDone) return;
    state.introDone = true;
    if (opening) opening.classList.add("is-hidden");
    body.classList.remove("is-locked");
    setSiteInert(false);
    if (options && options.silent) return;
    tryAutoplayMusic();
    window.setTimeout(function () {
      if (opening) opening.setAttribute("hidden", "");
    }, 680);
  }

  if (openMemories) {
    openMemories.addEventListener("click", function () {
      openArchive();
      var first = $("#home");
      if (first) first.scrollIntoView({ block: "start" });
    });
  }

  if (skipIntro) {
    if (opening) opening.classList.add("is-hidden");
    window.setTimeout(function () { openArchive({ silent: true }); }, 30);
  }

  /* ---------- MUSIK ---------- */
  var musicWanted = storage.get("dkvearless.music") !== "off";

  function updateMusicUI(isPlaying) {
    if (musicToggle) musicToggle.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    if (musicLabel) musicLabel.textContent = isPlaying ? "Musik nyala" : "Musik mati";
    if (musicToggle) {
      musicToggle.setAttribute("aria-label", isPlaying ? "Matikan musik kenangan" : "Nyalakan musik kenangan");
    }
  }

  function fadeMusicTo(target, duration) {
    if (!music) return;
    var from = music.volume;
    var start = performance.now();
    function step(now) {
      var t = Math.min(1, (now - start) / duration);
      music.volume = Math.max(0, Math.min(1, from + (target - from) * t));
      if (t < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  function playMusic() {
    if (!music) return Promise.resolve(false);
    musicWanted = true;
    storage.set("dkvearless.music", "on");
    music.volume = 0;
    var attempt = music.play();
    var done = function () {
      fadeMusicTo(0.55, 1200);
      updateMusicUI(true);
      hideMusicOverlay();
    };
    if (attempt && typeof attempt.then === "function") {
      return attempt.then(done).catch(function () {
        updateMusicUI(false);
        return false;
      });
    }
    done();
    return Promise.resolve(true);
  }

  function pauseMusic() {
    if (!music) return;
    music.pause();
    updateMusicUI(false);
  }

  function hideMusicOverlay() {
    if (musicOverlay) musicOverlay.hidden = true;
  }

  function showMusicOverlay() {
    if (musicOverlay) musicOverlay.hidden = false;
  }

  function tryAutoplayMusic() {
    if (!musicWanted) {
      updateMusicUI(false);
      return;
    }
    playMusic().then(function (ok) {
      if (!ok) showMusicOverlay();
    });
  }

  if (musicToggle) {
    musicToggle.addEventListener("click", function () {
      if (music && !music.paused) {
        musicWanted = false;
        storage.set("dkvearless.music", "off");
        pauseMusic();
        hideMusicOverlay();
      } else {
        playMusic();
      }
    });
  }

  if (musicOverlayButton) {
    musicOverlayButton.addEventListener("click", function () {
      playMusic().then(function (ok) {
        if (!ok) {
          hideMusicOverlay();
          showToast("Browser menahan musik. Tekan tombol musik di kanan atas.");
        }
      });
    });
  }

  if (music) {
    music.addEventListener("pause", function () { updateMusicUI(false); });
    music.addEventListener("play", function () { updateMusicUI(true); });
    music.volume = 0.55;
  }
  updateMusicUI(false);

  /* ---------- NAVIGASI ---------- */
  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Buka menu");
    }
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    });
  }

  navLinks.forEach(function (link) { link.addEventListener("click", closeNav); });

  document.addEventListener("click", function (event) {
    if (!nav || !nav.classList.contains("is-open")) return;
    if (nav.contains(event.target)) return;
    closeNav();
  });

  /* ---------- SCROLL ---------- */
  var lastY = 0;
  var ticking = false;

  function updateParallax(y) {
    if (reduceMotion) return;
    $$("[data-parallax]").forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0;
      if (el.classList.contains("reveal") && !el.classList.contains("is-visible")) return;
      var rect = el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      el.style.transform = "translate3d(0," + ((rect.top - window.innerHeight / 2) * -speed).toFixed(2) + "px,0)";
    });
  }

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgress) {
      scrollProgress.style.transform = "scaleX(" + (docHeight > 0 ? Math.min(1, y / docHeight) : 0) + ")";
    }
    if (siteHeader) siteHeader.classList.toggle("is-stuck", y > 12);
    if (y < 80 && navLinks.length) {
      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#home");
      });
    }
    if (toTop) toTop.hidden = y < 500;
    updateParallax(y);
    lastY = y;
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScroll);
  }, { passive: true });

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  if (toTop) toTop.addEventListener("click", scrollToTop);
  if (footerTop) footerTop.addEventListener("click", scrollToTop);

  /* ---------- REVEAL ---------- */
  var revealObserver = null;

  if ("IntersectionObserver" in window && !reduceMotion) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  }

  function observeReveals(root) {
    $$(".reveal", root || document).forEach(function (el) {
      if (el.classList.contains("is-visible")) return;
      if (revealObserver) revealObserver.observe(el);
      else el.classList.add("is-visible");
    });
  }

  /* ---------- SCROLLSPY ---------- */
  var spyTargets = navLinks.map(function (link) {
    var id = link.getAttribute("href");
    return id && id.charAt(0) === "#" ? document.getElementById(id.slice(1)) : null;
  }).filter(Boolean);

  if ("IntersectionObserver" in window && spyTargets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    spyTargets.forEach(function (section) { spy.observe(section); });
  }

  /* ---------- TIMELINE ---------- */
  function renderTimeline() {
    if (!timelineList) return;
    timelineList.innerHTML = timeline.map(function (item, index) {
      var photoIndex = photos.findIndex(function (p) { return p.file === item.photo; });
      var w = item.w || 0;
      var h = item.h || 0;
      return '<article class="timeline__item reveal" data-year="' + escapeHtml(item.year) + '">' +
        '<div class="timeline__rail" aria-hidden="true">' +
          '<span class="timeline__year">' + escapeHtml(item.year) + '</span>' +
          '<i></i>' +
        '</div>' +
        '<div class="timeline__card">' +
          '<p class="timeline__chapter">' + escapeHtml(item.chapter || "Bab") + '</p>' +
          '<h3 class="timeline__title">' + escapeHtml(item.title) + '</h3>' +
          '<div class="timeline__grid">' +
            '<div class="timeline__text">' +
              '<p>' + escapeHtml(item.text) + '</p>' +
              (item.note ? '<p class="timeline__note">' + escapeHtml(item.note) + '</p>' : "") +
            '</div>' +
            '<button class="timeline__photo" type="button" data-timeline="' + index + '" aria-label="Buka foto ' + escapeHtml(item.year) + '">' +
              '<span class="timeline__frame" style="--ar:' + ratio(w, h) + '">' +
                '<img src="' + escapeHtml(item.photo) + '" alt="' + escapeHtml(item.alt || item.title) + '" width="' + (w || 1200) + '" height="' + (h || 900) + '" loading="lazy" decoding="async">' +
              '</span>' +
              '<span class="timeline__cap">' + escapeHtml(item.caption || "") + '</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join("");

    $$("[data-timeline]", timelineList).forEach(function (button) {
      button.addEventListener("click", function () {
        var i = Number(button.getAttribute("data-timeline"));
        var item = timeline[i];
        if (!item) return;
        openLightbox([{
          src: item.photo,
          alt: item.alt || item.title,
          caption: item.caption || item.title,
          meta: item.year + " / " + (item.chapter || ""),
          w: item.w,
          h: item.h
        }], 0, button);
        void photoIndex;
      });
    });

    observeReveals(timelineList);
  }

  /* ---------- GALERI ---------- */
  function getFilteredPhotos() {
    var q = normalize(state.query);
    return photos.filter(function (photo) {
      if (state.filter !== "Semua" && photo.category !== state.filter) return false;
      if (!q) return true;
      var haystack = normalize([photo.caption, photo.category, photo.alt, photo.frame].join(" "));
      return haystack.indexOf(q) !== -1;
    });
  }

  function renderFilters() {
    if (!galleryFilters) return;
    galleryFilters.innerHTML = categories.map(function (name) {
      var count = name === "Semua"
        ? photos.length
        : photos.filter(function (p) { return p.category === name; }).length;
      return '<button class="filter-chip' + (state.filter === name ? " is-active" : "") + (count === 0 ? " is-empty" : "") + '" type="button" data-filter="' + escapeHtml(name) + '" aria-pressed="' + (state.filter === name) + '">' +
        escapeHtml(name) + '<span class="filter-chip__n">' + count + '</span>' +
      '</button>';
    }).join("");

    $$("[data-filter]", galleryFilters).forEach(function (button) {
      button.addEventListener("click", function () {
        state.filter = button.getAttribute("data-filter");
        renderFilters();
        renderGallery();
      });
    });
  }

  /* Kartu galeri memakai versi ringan; lightbox tetap memakai file asli. */
  function cardFile(photo) {
    return String(photo.file)
      .replace("/images/", "/images/gallery-cards/")
      .replace(/\.[^.]+$/, ".jpg");
  }

  function makeCard(photo, index) {
    var w = photo.w || 0;
    var h = photo.h || 0;
    return '<article class="gallery-card" data-shape="' + shapeOf(w, h) + '" data-frame="' + escapeHtml(photo.style || "bleed") + '" style="--ar:' + ratio(w, h) + ';--card-i:' + (index % 6) + '">' +
      '<button class="gallery-card__media" type="button" data-index="' + index + '" aria-label="Buka foto: ' + escapeHtml(photo.caption) + '">' +
        '<img src="' + escapeHtml(cardFile(photo)) + '" data-full="' + escapeHtml(photo.file) + '" alt="' + escapeHtml(photo.alt || photo.caption) + '"' +
          (w ? ' width="' + w + '" height="' + h + '"' : "") +
          ' loading="lazy" decoding="async">' +
        '<span class="gallery-card__stamp">' + escapeHtml(photo.frame || "Bingkai") + '</span>' +
        '<span class="gallery-card__zoom">Lihat penuh</span>' +
      '</button>' +
      '<div class="gallery-card__body">' +
        '<span class="gallery-card__cat">' + escapeHtml(photo.category) + '</span>' +
        '<p class="gallery-card__caption">' + escapeHtml(photo.caption) + '</p>' +
      '</div>' +
    '</article>';
  }

  function renderGallery() {
    if (!galleryGrid) return;
    var list = getFilteredPhotos();
    state.visible = list;

    galleryGrid.innerHTML = list.map(makeCard).join("");
    galleryGrid.style.display = "";
    if (galleryEmpty) galleryEmpty.hidden = list.length !== 0;

    $$("[data-index]", galleryGrid).forEach(function (button) {
      button.addEventListener("click", function () {
        openLightbox(state.visible.map(function (photo) {
          return {
            src: photo.file,
            alt: photo.alt || photo.caption,
            caption: photo.caption,
            meta: photo.category + " / " + (photo.frame || ""),
            w: photo.w,
            h: photo.h
          };
        }), Number(button.getAttribute("data-index")), button);
      });
    });

    $$(".gallery-card__media img", galleryGrid).forEach(function (img) {
      img.addEventListener("error", function () {
        if (img.dataset.fallback) return;
        img.dataset.fallback = "1";
        img.src = img.dataset.full;
      });
    });

    if (galleryCount) {
      galleryCount.textContent = list.length + " dari " + photos.length + " bingkai";
    }
    applyLayout();
  }

  function applyLayout() {
    if (!galleryGrid) return;
    galleryGrid.className = "gallery gallery--" + state.layout;
    layoutButtons.forEach(function (button) {
      var active = button.getAttribute("data-layout") === state.layout;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function setLayout(layout) {
    state.layout = layout;
    storage.set("dkvearless.layout", layout);
    applyLayout();
  }

  layoutButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setLayout(button.getAttribute("data-layout"));
    });
  });

  if (gallerySearch) {
    gallerySearch.addEventListener("input", function () {
      state.query = gallerySearch.value;
      if (searchClear) searchClear.hidden = !state.query;
      renderGallery();
    });
  }

  if (searchClear) {
    searchClear.addEventListener("click", function () {
      gallerySearch.value = "";
      state.query = "";
      searchClear.hidden = true;
      renderGallery();
      gallerySearch.focus();
    });
  }

  if (resetFilters) {
    resetFilters.addEventListener("click", function () {
      state.filter = "Semua";
      state.query = "";
      if (gallerySearch) gallerySearch.value = "";
      if (searchClear) searchClear.hidden = true;
      renderFilters();
      renderGallery();
    });
  }

  /* ---------- ARSIP LEPAS ---------- */
  function renderRandomStage(index) {
    if (!randomImage || !randomPhotos.length) return;
    state.randomIndex = (index + randomPhotos.length) % randomPhotos.length;
    var item = randomPhotos[state.randomIndex];

    randomImage.classList.add("is-swapping");
    var swapSettled = false;
    var swapCommit = function () {
      if (swapSettled) return;
      swapSettled = true;
      randomImage.src = item.file;
      randomImage.alt = item.alt || "Momen random DKV 3";
      randomImage.classList.remove("is-swapping");
    };
    var preload = new Image();
    preload.onload = swapCommit;
    preload.onerror = function () {
      if (swapSettled) return;
      swapSettled = true;
      randomImage.classList.remove("is-swapping");
    };
    if ("fetchPriority" in preload) preload.fetchPriority = "high";
    preload.src = item.file;
    /* Jangan biarkan panggung terkunci kalau pratinjau lambat. */
    setTimeout(swapCommit, 2500);

    if (randomCaption) randomCaption.textContent = item.caption || "";
    if (randomCount) {
      randomCount.textContent = "Arsip " + String(state.randomIndex + 1).padStart(3, "0") +
        " / " + String(randomPhotos.length).padStart(3, "0") + " · tanpa tanggal";
    }
    if (randomStrip) {
      $$(".contact-sheet__item", randomStrip).forEach(function (btn, i) {
        btn.classList.toggle("is-active", i === state.randomIndex);
      });
      var active = $(".contact-sheet__item.is-active", randomStrip);
      if (active && active.getBoundingClientRect && randomStrip.scrollTo) {
        var box = active.getBoundingClientRect();
        var stripBox = randomStrip.getBoundingClientRect();
        var target = randomStrip.scrollLeft + (box.left - stripBox.left) - (stripBox.width - box.width) / 2;
        /* Lompat jauh harus instan: geser halus melewati puluhan thumbnail
           dan memicu puluhan unduhan gambar sekaligus. */
        var farJump = Math.abs(target - randomStrip.scrollLeft) > stripBox.width * 1.5;
        randomStrip.scrollTo({
          left: target,
          behavior: reduceMotion || farJump ? "auto" : "smooth"
        });
      }
    }
  }

  function renderContactSheet() {
    if (!randomStrip) return;
    randomStrip.innerHTML = randomPhotos.map(function (item, i) {
      /* Thumbnail ringan: memakai foto ukuran penuh untuk 119 lembar kontak
         berarti puluhan MB dan membuat foto panggung gagal dimuat. */
      var thumb = item.file.replace("/random/", "/random-thumbs/").replace(/\.[^.]+$/, ".jpg");
      return '<button class="contact-sheet__item" type="button" data-random="' + i + '" style="--ar:' + ratio(item.w, item.h, "1") + '" aria-label="Tampilkan arsip ' + (i + 1) + '">' +
        '<img src="' + escapeHtml(thumb) + '" data-full="' + escapeHtml(item.file) + '" alt="" loading="lazy" decoding="async" fetchpriority="low">' +
      '</button>';
    }).join("");

    $$(".contact-sheet__item img", randomStrip).forEach(function (img) {
      img.addEventListener("error", function () {
        if (img.dataset.fallback) return;
        img.dataset.fallback = "1";
        img.src = img.dataset.full;
      });
    });

    $$("[data-random]", randomStrip).forEach(function (button) {
      button.addEventListener("click", function () {
        renderRandomStage(Number(button.getAttribute("data-random")));
      });
    });
  }

  function pickRandom() {
    if (randomPhotos.length < 2) return renderRandomStage(0);
    var next = state.randomIndex;
    while (next === state.randomIndex) {
      next = Math.floor(Math.random() * randomPhotos.length);
    }
    renderRandomStage(next);
  }

  if (randomNext) randomNext.addEventListener("click", pickRandom);

  function randomLightboxItems() {
    return randomPhotos.map(function (item) {
      return {
        src: item.file,
        alt: item.alt || "Momen random DKV 3",
        caption: item.caption || "",
        meta: "Arsip lepas / tanpa tanggal",
        w: item.w,
        h: item.h
      };
    });
  }

  if (randomStageButton) {
    randomStageButton.addEventListener("click", function () {
      openLightbox(randomLightboxItems(), state.randomIndex, randomStageButton);
    });
  }

  if (randomFullscreen) {
    randomFullscreen.addEventListener("click", function () {
      openLightbox(randomLightboxItems(), state.randomIndex, randomFullscreen);
    });
  }

  randomButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var target = $("#random");
      if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      pickRandom();
    });
  });

  /* ---------- TEBAK MOMEN ---------- */
  var guessPool = [];
  var guessRound = 0;

  function shuffle(list) {
    var copy = list.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp;
    }
    return copy;
  }

  function pickGuess() {
    if (!photos.length || !guessImage) return;
    var pool = guessPool.length ? guessPool : shuffle(photos);
    var photo = pool.pop();
    guessPool = pool;
    if (!photo) return;

    guessRound += 1;
    if (guessProgress) guessProgress.textContent = "Tebakan " + guessRound;
    if (guessFrame) guessFrame.textContent = (photo.frame || "BINGKAI").toUpperCase();
    if (guessQuestion) guessQuestion.textContent = "Ini masuk kegiatan apa?";
    if (guessFeedback) { guessFeedback.textContent = ""; guessFeedback.classList.remove("is-wrong"); }
    if (guessCaption) guessCaption.textContent = "Pilih satu jawaban. Keterangan asli muncul setelah itu.";
    if (nextGuess) nextGuess.hidden = true;

    guessImage.classList.add("is-swapping");
    guessImage.src = photo.file;
    guessImage.alt = photo.alt || "Foto misteri DKV 3";
    guessImage.onload = function () { guessImage.classList.remove("is-swapping"); };
    if (guessImage.parentElement) {
      guessImage.parentElement.style.setProperty("--ar", ratio(photo.w, photo.h, "16 / 9"));
    }

    var options = shuffle(categories.filter(function (c) { return c !== "Semua"; }));
    var correct = photo.category;
    options = [correct].concat(options.filter(function (c) { return c !== correct; }).slice(0, 2));
    options = shuffle(options);

    if (guessOptions) {
      guessOptions.innerHTML = options.map(function (name) {
        return '<button class="guess-option" type="button" data-answer="' + escapeHtml(name) + '">' +
          '<span>' + escapeHtml(name) + '</span>' +
        '</button>';
      }).join("");

      $$("[data-answer]", guessOptions).forEach(function (button) {
        button.addEventListener("click", function () {
          var picked = button.getAttribute("data-answer");
          $$(".guess-option", guessOptions).forEach(function (btn) {
            btn.disabled = true;
            var value = btn.getAttribute("data-answer");
            if (value === correct) btn.classList.add("is-correct");
            else if (btn === button) btn.classList.add("is-wrong");
          });
          if (guessFeedback) {
            var right = picked === correct;
            guessFeedback.textContent = right
              ? "Tepat. Ini memang " + correct.toLowerCase() + "."
              : "Belum tepat. Jawabannya " + correct.toLowerCase() + ".";
            guessFeedback.classList.toggle("is-wrong", !right);
          }
          if (guessCaption) guessCaption.textContent = photo.caption;
          if (nextGuess) nextGuess.hidden = false;
        });
      });
    }
  }

  if (nextGuess) nextGuess.addEventListener("click", pickGuess);

  /* ---------- LIGHTBOX ---------- */
  function updateLightbox() {
    var item = state.lbItems[state.lbIndex];
    if (!item) return;
    lbImage.src = item.src;
    lbImage.alt = item.alt || "";
    lbImage.style.aspectRatio = item.w && item.h ? item.w + " / " + item.h : "";
    if (lbCaption) lbCaption.textContent = item.caption || "Kenangan DKV 3";
    if (lbMeta) lbMeta.textContent = item.meta || "";
    if (lbCounter) {
      lbCounter.textContent = String(state.lbIndex + 1).padStart(2, "0") + " / " +
        String(state.lbItems.length).padStart(2, "0");
    }
    if (lbProgress) lbProgress.textContent = String(state.lbIndex + 1).padStart(2, "0");
    if (lbFull) lbFull.href = item.src;
    var single = state.lbItems.length < 2;
    if (lbPrev) lbPrev.hidden = single;
    if (lbNext) lbNext.hidden = single;
  }

  function openLightbox(items, index, trigger) {
    if (!lightbox || !items || !items.length) return;
    state.lbItems = items;
    state.lbIndex = Math.max(0, Math.min(index || 0, items.length - 1));
    state.lbTrigger = trigger || null;
    lightbox.hidden = false;
    body.classList.add("is-locked");
    updateLightbox();
    window.setTimeout(function () { if (lbClose) lbClose.focus({ preventScroll: true }); }, 30);
  }

  function closeLightbox() {
    if (!lightbox) return;
    stopSlideshow();
    lightbox.hidden = true;
    if (opening && !state.introDone) return;
    body.classList.remove("is-locked");
    if (state.lbTrigger && state.lbTrigger.focus) state.lbTrigger.focus({ preventScroll: true });
    state.lbTrigger = null;
  }

  function showNextPhoto(direction) {
    if (!state.lbItems.length) return;
    state.lbIndex = (state.lbIndex + direction + state.lbItems.length) % state.lbItems.length;
    updateLightbox();
  }

  function stopSlideshow() {
    state.slideshow = false;
    window.clearTimeout(state.slideshowTimer);
    if (lbSlideshow) lbSlideshow.setAttribute("aria-pressed", "false");
    if (lbPlayLabel) lbPlayLabel.textContent = "Putar otomatis";
  }

  function scheduleSlide() {
    window.clearTimeout(state.slideshowTimer);
    if (!state.slideshow) return;
    state.slideshowTimer = window.setTimeout(function () {
      showNextPhoto(1);
      scheduleSlide();
    }, 3600);
  }

  function galleryPhotosForLightbox() {
    return state.visible.map(function (photo) {
      return {
        src: photo.file,
        alt: photo.alt || photo.caption,
        caption: photo.caption,
        meta: photo.category + " / " + (photo.frame || ""),
        w: photo.w,
        h: photo.h
      };
    });
  }

  function startSlideshow() {
    var items = state.lbItems;
    var closed = lightbox && lightbox.hidden;
    if (closed) items = galleryPhotosForLightbox();
    if (!items || items.length < 2) {
      showToast("Butuh lebih dari satu foto untuk memutar otomatis.");
      return;
    }
    if (closed) openLightbox(items, 0, slideshowButton);
    state.slideshow = true;
    if (lbSlideshow) lbSlideshow.setAttribute("aria-pressed", "true");
    if (lbPlayLabel) lbPlayLabel.textContent = "Jeda";
    scheduleSlide();
  }

  function toggleSlideshow() {
    if (state.slideshow) stopSlideshow();
    else startSlideshow();
  }

  if (slideshowButton) slideshowButton.addEventListener("click", startSlideshow);
  if (lbSlideshow) lbSlideshow.addEventListener("click", toggleSlideshow);
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lbPrev) lbPrev.addEventListener("click", function () { showNextPhoto(-1); scheduleSlide(); });
  if (lbNext) lbNext.addEventListener("click", function () { showNextPhoto(1); scheduleSlide(); });
  $$("[data-close-lightbox]").forEach(function (el) {
    el.addEventListener("click", closeLightbox);
  });

  if (lightbox) {
    var swipeStart = null;
    lightbox.addEventListener("touchstart", function (event) {
      if (event.touches.length !== 1) return;
      swipeStart = event.touches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener("touchend", function (event) {
      if (swipeStart == null) return;
      var delta = event.changedTouches[0].clientX - swipeStart;
      swipeStart = null;
      if (Math.abs(delta) < 50) return;
      showNextPhoto(delta < 0 ? 1 : -1);
      scheduleSlide();
    }, { passive: true });
  }

  /* ---------- VIDEO ---------- */
  function videoById(id) {
    return videos.filter(function (item) { return item.id === id; })[0];
  }

  function updateVideoIcons() {
    if (!video) return;
    var paused = video.paused || video.ended;
    if (iconPlay) iconPlay.hidden = !paused;
    if (iconPause) iconPause.hidden = paused;
    if (videoPlay) videoPlay.setAttribute("aria-label", paused ? "Putar video" : "Jeda video");
    if (videoBigPlay) {
      videoBigPlay.hidden = !paused;
      var text = $(".cinema__bigplay-text", videoBigPlay);
      if (text) text.textContent = video.ended ? "Putar ulang" : "Putar video";
    }
    if (cinemaStage) cinemaStage.classList.toggle("is-idle", paused);
  }

  function updateVideoTime() {
    if (!video) return;
    var duration = isFinite(video.duration) ? video.duration : 0;
    var current = isFinite(video.currentTime) ? video.currentTime : 0;
    if (videoTime) videoTime.textContent = formatTime(current) + " / " + formatTime(duration);
    if (videoSeek && duration > 0) {
      videoSeek.max = String(duration);
      videoSeek.value = String(current);
      videoSeek.style.setProperty("--progress", (current / duration * 100).toFixed(2) + "%");
    }
  }

  function updateMuteIcon() {
    if (!video) return;
    var silent = video.muted || video.volume === 0;
    if (iconVolume) iconVolume.hidden = silent;
    if (iconMuted) iconMuted.hidden = !silent;
    if (videoVolume) videoVolume.value = String(video.muted ? 0 : video.volume);
    if (videoMute) videoMute.setAttribute("aria-label", silent ? "Nyalakan suara video" : "Matikan suara video");
  }

  function playVideo() {
    if (!video) return;
    if (music && !music.paused) {
      state.resumeMusicAfterVideo = true;
      pauseMusic();
    }
    var attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(function () {
        showToast("Video belum bisa diputar. Coba tekan lagi.");
      });
    }
  }

  function toggleVideo() {
    if (!video) return;
    if (video.paused || video.ended) playVideo();
    else video.pause();
  }

  function loadVideo(index, autoplay) {
    if (!video || !videos.length) return;
    var i = ((index % videos.length) + videos.length) % videos.length;
    var item = videos[i];
    if (!item) return;
    state.videoIndex = i;
    state.videoAuto = !!autoplay;

    video.pause();
    video.src = item.src;
    if (item.poster) video.setAttribute("poster", item.poster);
    else video.removeAttribute("poster");
    video.load();

    if (cinema) cinema.setAttribute("data-orientation", item.orientation === "portrait" ? "portrait" : "landscape");
    if (filmKicker) filmKicker.textContent = "Rekaman " + String(i + 1).padStart(2, "0") + " / " + String(videos.length).padStart(2, "0");
    if (filmTitle) filmTitle.textContent = item.title || "Video";
    if (filmCaption) filmCaption.textContent = item.caption || "";
    if (filmOrientation) filmOrientation.textContent = item.orientation === "portrait" ? "Vertikal" : "Horizontal";
    if (filmLength) filmLength.textContent = formatTime(item.duration || 0);
    if (filmDuration) filmDuration.textContent = formatTime(item.duration || 0);
    if (filmIndex) filmIndex.textContent = String(i + 1).padStart(2, "0") + " / " + String(videos.length).padStart(2, "0");

    $$(".reel-item").forEach(function (btn) {
      btn.classList.toggle("is-active", Number(btn.getAttribute("data-video")) === i);
    });

    updateVideoIcons();
    updateVideoTime();
    if (autoplay) playVideo();
  }

  function renderReel() {
    if (!reelLandscape || !reelPortrait) return;

    function itemMarkup(item, index) {
      return '<button class="reel-item" type="button" data-video="' + index + '" aria-label="Putar ' + escapeHtml(item.title) + '">' +
        '<span class="reel-item__thumb" style="--ar:' + ratio(item.w, item.h, item.orientation === "portrait" ? "9 / 16" : "16 / 9") + '">' +
          (item.poster ? '<img src="' + escapeHtml(item.poster) + '" alt="" decoding="async">' : "") +
        '</span>' +
        '<span class="reel-item__body">' +
          '<strong>' + escapeHtml(item.title) + '</strong>' +
          '<span>' + escapeHtml(item.caption || "") + '</span>' +
          '<em class="reel-item__meta">' + (item.orientation === "portrait" ? "Vertikal" : "Horizontal") + ' · ' + formatTime(item.duration || 0) + '</em>' +
        '</span>' +
      '</button>';
    }

    var landscapeHtml = "";
    var portraitHtml = "";
    videos.forEach(function (item, index) {
      if (item.orientation === "portrait") portraitHtml += itemMarkup(item, index);
      else landscapeHtml += itemMarkup(item, index);
    });
    reelLandscape.innerHTML = landscapeHtml;
    reelPortrait.innerHTML = portraitHtml;

    $$(".reel-item").forEach(function (button) {
      button.addEventListener("click", function () {
        loadVideo(Number(button.getAttribute("data-video")), true);
      });
    });
  }

  if (video) {
    video.addEventListener("loadedmetadata", function () {
      updateVideoTime();
      if (state.videoAuto) playVideo();
      state.videoAuto = false;
      var item = videos[state.videoIndex];
      if (item && isFinite(video.duration) && video.duration > 0) {
        if (filmLength) filmLength.textContent = formatTime(video.duration);
        if (filmDuration) filmDuration.textContent = formatTime(video.duration);
      }
    });
    video.addEventListener("timeupdate", updateVideoTime);
    video.addEventListener("play", function () {
      if (music && !music.paused) {
        state.resumeMusicAfterVideo = true;
        pauseMusic();
      }
      updateVideoIcons();
    });
    video.addEventListener("pause", updateVideoIcons);
    video.addEventListener("ended", function () {
      updateVideoIcons();
      updateVideoTime();
      if (state.resumeMusicAfterVideo) {
        state.resumeMusicAfterVideo = false;
        if (musicWanted) playMusic();
      }
    });
    video.addEventListener("volumechange", updateMuteIcon);
    video.addEventListener("click", toggleVideo);
  }

  if (videoBigPlay) videoBigPlay.addEventListener("click", function () {
    if (video && video.ended) video.currentTime = 0;
    playVideo();
  });
  if (videoPlay) videoPlay.addEventListener("click", toggleVideo);

  if (videoSeek) {
    videoSeek.addEventListener("input", function () {
      if (!video || !isFinite(video.duration)) return;
      video.currentTime = Number(videoSeek.value);
      updateVideoTime();
    });
  }

  if (videoVolume) {
    videoVolume.addEventListener("input", function () {
      if (!video) return;
      video.volume = Number(videoVolume.value);
      video.muted = video.volume === 0;
      updateMuteIcon();
    });
  }

  if (videoMute) {
    videoMute.addEventListener("click", function () {
      if (!video) return;
      video.muted = !video.muted;
      if (!video.muted && video.volume === 0) video.volume = 0.8;
      updateMuteIcon();
    });
  }

  if (videoFullscreen) {
    videoFullscreen.addEventListener("click", function () {
      var target = cinemaStage || video;
      if (document.fullscreenElement) {
        document.exitFullscreen();
        return;
      }
      if (target.requestFullscreen) {
        target.requestFullscreen().catch(function () {
          showToast("Layar penuh belum didukung browser ini.");
        });
      } else if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen();
      } else {
        showToast("Layar penuh belum didukung browser ini.");
      }
    });
  }

  if (filmPrev) filmPrev.addEventListener("click", function () { loadVideo(state.videoIndex - 1, true); });
  if (filmNext) filmNext.addEventListener("click", function () { loadVideo(state.videoIndex + 1, true); });

  /* ---------- NAMA SISWA ---------- */
  function renderStudents() {
    if (!studentList) return;
    studentList.innerHTML = students.map(function (name, index) {
      return '<li><span>' + String(index + 1).padStart(2, "0") + '</span><strong>' + escapeHtml(name) + '</strong></li>';
    }).join("");
    if (studentTotal) studentTotal.textContent = String(students.length);
  }

  /* ---------- BUKU PESAN ---------- */
  var config = window.DKV_SUPABASE || {};
  var guestbookEndpoint = "";
  var guestbookReady = false;
  var guestbookBusy = false;
  var guestbook = [];

  if (config.url && config.anonKey) {
    guestbookEndpoint = String(config.url).replace(/\/+$/, "") +
      "/rest/v1/" + encodeURIComponent(config.table || "messages");
    guestbookReady = true;
  }

  var guestbookKeyIsJwt = /^eyJ/.test(String(config.anonKey || ""));

  function guestbookHeaders(extra) {
    var headers = {
      apikey: config.anonKey
    };
    if (guestbookKeyIsJwt) headers.Authorization = "Bearer " + config.anonKey;
    if (extra) Object.keys(extra).forEach(function (key) { headers[key] = extra[key]; });
    return headers;
  }

  function setGuestStatus(message, isError) {
    if (!guestbookStatus) return;
    guestbookStatus.textContent = message;
    guestbookStatus.classList.toggle("is-error", !!isError);
  }

  function rowToEntry(row) {
    return {
      id: row.id,
      name: typeof row.name === "string" ? row.name : "",
      message: typeof row.message === "string" ? row.message : "",
      date: row.created_at || new Date().toISOString()
    };
  }

  function updateGuestCount() {
    if (guestCount && guestMessage) guestCount.textContent = guestMessage.value.length + " / 240";
  }

  function renderGuestbook() {
    if (!guestbookList) return;
    if (guestbookTotal) guestbookTotal.textContent = String(guestbook.length);
    if (guestbookEmpty) guestbookEmpty.hidden = guestbook.length !== 0;
    guestbookList.innerHTML = guestbook.slice().reverse().map(function (entry) {
      return '<article class="wall-entry">' +
        '<div class="wall-entry__head">' +
          '<strong>' + escapeHtml(entry.name) + '</strong>' +
          '<time datetime="' + escapeHtml(entry.date) + '">' + escapeHtml(formatDate(entry.date)) + '</time>' +
        '</div>' +
        '<p>' + escapeHtml(entry.message) + '</p>' +
      '</article>';
    }).join("");
  }

  function setGuestbookEnabled(enabled) {
    if (!guestbookForm) return;
    guestbookForm.classList.toggle("is-disabled", !enabled);
    Array.prototype.forEach.call(guestbookForm.elements, function (el) { el.disabled = !enabled; });
  }

  function loadGuestbook() {
    if (!guestbookReady) {
      guestbook = [];
      renderGuestbook();
      setGuestbookEnabled(false);
      setGuestStatus("Buku pesan publik belum aktif. Pemilik album perlu mengatur Supabase.", true);
      return;
    }
    if (guestbookBusy) return;

    guestbookBusy = true;
    setGuestbookEnabled(false);
    setGuestStatus("Memuat pesan...", false);

    fetch(guestbookEndpoint + "?select=id,name,message,created_at&order=created_at.desc&limit=200", {
      headers: guestbookHeaders(),
      cache: "no-store"
    }).then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    }).then(function (rows) {
      guestbook = (Array.isArray(rows) ? rows : []).map(rowToEntry).reverse().filter(function (entry) {
        return entry && entry.name && entry.message;
      });
      renderGuestbook();
      setGuestStatus("", false);
    }).catch(function () {
      guestbook = [];
      renderGuestbook();
      setGuestStatus("Pesan belum bisa dimuat. Periksa koneksi atau konfigurasi Supabase.", true);
    }).then(function () {
      guestbookBusy = false;
      setGuestbookEnabled(true);
    });
  }

  if (guestMessage) {
    guestMessage.addEventListener("input", updateGuestCount);
    updateGuestCount();
  }

  if (guestbookForm) {
    guestbookForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = guestName ? guestName.value.trim() : "";
      var message = guestMessage ? guestMessage.value.trim() : "";
      var submitButton = guestbookForm.querySelector('button[type="submit"]');

      if (!guestbookReady) {
        setGuestStatus("Buku pesan publik belum aktif. Pemilik album perlu mengatur Supabase.", true);
        return;
      }
      if (!name || !message) {
        setGuestStatus("Nama dan pesan perlu diisi.", true);
        (name ? guestMessage : guestName).focus();
        return;
      }
      if (guestbookBusy) return;

      guestbookBusy = true;
      if (submitButton) submitButton.disabled = true;
      setGuestStatus("Mengirim pesan...", false);

      fetch(guestbookEndpoint, {
        method: "POST",
        headers: guestbookHeaders({
          "Content-Type": "application/json",
          Prefer: "return=representation"
        }),
        body: JSON.stringify({
          name: name.slice(0, 40),
          message: message.slice(0, 240)
        })
      }).then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      }).then(function (rows) {
        var entry = rows && rows[0] ? rowToEntry(rows[0]) : null;
        if (entry) {
          guestbook.push(entry);
          renderGuestbook();
        }
        guestbookForm.reset();
        updateGuestCount();
        setGuestStatus("Pesan terkirim. Terima kasih sudah mampir.", false);
        if (guestName) guestName.focus();
      }).catch(function () {
        setGuestStatus("Pesan gagal dikirim. Coba lagi sebentar.", true);
      }).then(function () {
        guestbookBusy = false;
        if (submitButton) submitButton.disabled = false;
      });
    });
  }

  if (refreshGuestbook) refreshGuestbook.addEventListener("click", loadGuestbook);

  /* ---------- MODAL & KEJUTAN ---------- */
  function openModal(modal, trigger) {
    if (!modal) return;
    state.modalOpen = modal;
    state.modalTrigger = trigger || null;
    modal.hidden = false;
    body.classList.add("is-locked");
    var focusable = getFocusable(modal)[0];
    if (focusable) window.setTimeout(function () { focusable.focus({ preventScroll: true }); }, 30);
  }

  function closeModal(modal, restore) {
    if (!modal) return;
    modal.hidden = true;
    state.modalOpen = null;
    body.classList.remove("is-locked");
    if (restore !== false && state.modalTrigger && state.modalTrigger.focus) {
      state.modalTrigger.focus({ preventScroll: true });
    }
    state.modalTrigger = null;
  }

  $$("[data-open-guide]").forEach(function (button) {
    button.addEventListener("click", function () { openModal(guideModal, button); });
  });

  $$("[data-close-modal]").forEach(function (el) {
    el.addEventListener("click", function () {
      closeModal(el.closest(".modal"));
    });
  });

  function revealEasterEgg(trigger) {
    openModal(eggModal, trigger);
  }

  if (brandLogo) {
    brandLogo.addEventListener("click", function () {
      state.eggClicks += 1;
      window.clearTimeout(state.eggTimer);
      state.eggTimer = window.setTimeout(function () { state.eggClicks = 0; }, 2600);
      if (state.eggClicks >= 5) {
        state.eggClicks = 0;
        revealEasterEgg(brandLogo);
      }
    });
  }

  /* ---------- KEYBOARD ---------- */
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (lightbox && !lightbox.hidden) closeLightbox();
      else if (state.modalOpen) closeModal(state.modalOpen);
      else if (nav && nav.classList.contains("is-open")) closeNav();
    }

    if (lightbox && !lightbox.hidden) {
      if (event.key === "ArrowRight") { showNextPhoto(1); scheduleSlide(); }
      if (event.key === "ArrowLeft") { showNextPhoto(-1); scheduleSlide(); }
      trapFocus(lightbox, event);
      return;
    }

    if (state.modalOpen) {
      trapFocus(state.modalOpen, event);
      return;
    }

    if (!state.introDone) {
      if (event.key === "Tab") {
        event.preventDefault();
        if (openMemories) openMemories.focus();
      }
      return;
    }

    var tag = (event.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || event.target.isContentEditable) return;

    if (event.key && event.key.length === 1) {
      state.keyBuffer = (state.keyBuffer + event.key.toLowerCase()).slice(-8);
      if (state.keyBuffer.indexOf("dkv3") !== -1 || state.keyBuffer.indexOf("rindu") !== -1) {
        state.keyBuffer = "";
        revealEasterEgg(brandLogo);
      }
    }
  });

  /* ---------- INIT ---------- */
  function init() {
    var savedLayout = storage.get("dkvearless.layout");
    if (savedLayout && ["editorial", "masonry", "polaroid", "film"].indexOf(savedLayout) !== -1) {
      state.layout = savedLayout;
    }

    renderTimeline();
    renderFilters();
    renderGallery();
    renderStudents();
    renderContactSheet();
    renderRandomStage(Math.floor(Math.random() * Math.max(1, randomPhotos.length)));
    renderReel();
    if (videos.length) loadVideo(0, false);
    pickGuess();
    observeReveals();
    updateVideoIcons();
    updateMuteIcon();
    updateGuestCount();
    loadGuestbook();
    onScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
