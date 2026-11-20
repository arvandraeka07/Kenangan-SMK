/* =========================================================================
   DKVEARLESS — interactions
   Offline only. No fetch, no backend, no external services.
   ========================================================================= */
(function () {
  "use strict";

  var data = window.DKV3_MEDIA || {};
  var photos = Array.isArray(data.photos) ? data.photos.slice() : [];
  var timeline = Array.isArray(data.timeline) ? data.timeline.slice() : [];
  var students = Array.isArray(data.students) ? data.students.slice() : [];
  var categories = Array.isArray(data.categories) && data.categories.length
    ? data.categories.slice()
    : ["Semua"];

  var $ = function (selector, context) {
    return (context || document).querySelector(selector);
  };
  var $$ = function (selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  };

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (err) {
    reduceMotion = false;
  }

  /* ---------- ELEMENTS ---------- */
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

  var timelineList = $("#timelineList");
  var galleryFilters = $("#galleryFilters");
  var galleryGrid = $("#galleryGrid");
  var galleryCount = $("#galleryCount");
  var gallerySearch = $("#gallerySearch");
  var searchClear = $("#searchClear");
  var galleryEmpty = $("#galleryEmpty");
  var resetFilters = $("#resetFilters");
  var randomButtons = [$("#randomMemory"), $("#randomMemoryFloat")].filter(Boolean);
  var startSlideshow = $("#startSlideshow");
  var layoutButtons = $$("[data-layout]");

  var guessImage = $("#guessImage");
  var guessFrame = $("#guessFrame");
  var guessProgress = $("#guessProgress");
  var guessQuestion = $("#guessQuestion");
  var guessOptions = $("#guessOptions");
  var guessFeedback = $("#guessFeedback");
  var guessCaption = $("#guessCaption");
  var nextGuess = $("#nextGuess");

  var lightbox = $("#lightbox");
  var lbImage = $("#lbImage");
  var lbCaption = $("#lbCaption");
  var lbMeta = $("#lbMeta");
  var lbCounter = $("#lbCounter");
  var lbProgress = $("#lbProgress");
  var lbClose = $("#lbClose");
  var lbPrev = $("#lbPrev");
  var lbNext = $("#lbNext");
  var lbSlideshow = $("#lbSlideshow");
  var lbPlayLabel = $("#lbPlayLabel");

  var video = $("#memoryVideo");
  var videoFrame = $("#videoFrame");
  var videoBigPlay = $("#videoBigPlay");
  var videoPlay = $("#videoPlay");
  var videoSeek = $("#videoSeek");
  var videoTime = $("#videoTime");
  var videoVolume = $("#videoVolume");
  var filmCaption = $("#filmCaption");
  var filmDuration = $("#filmDuration");
  var videoMute = $("#videoMute");
  var videoFullscreen = $("#videoFullscreen");
  var iconPlay = $(".icon-play", videoPlay);
  var iconPause = $(".icon-pause", videoPlay);
  var iconVolume = $(".icon-volume", videoMute);
  var iconMuted = $(".icon-muted", videoMute);

  var studentList = $("#studentList");
  var studentTotal = $("#studentTotal");

  var awardList = $("#awardList");
  var awardForm = $("#awardForm");
  var awardIndexInput = $("#awardIndex");
  var awardName = $("#awardName");
  var awardPhoto = $("#awardPhoto");
  var awardPreview = $("#awardPreview");
  var awardPreviewImg = $("#awardPreviewImg");
  var awardPhotoClear = $("#awardPhotoClear");
  var awardStatus = $("#awardStatus");
  var awardReset = $("#awardReset");
  var awardModalTitle = $("#awardModalTitle");

  var tabGuestbook = $("#tabGuestbook");
  var tabLetters = $("#tabLetters");
  var panelGuestbook = $("#panelGuestbook");
  var panelLetters = $("#panelLetters");

  var guestbookForm = $("#guestbookForm");
  var guestName = $("#guestName");
  var guestMessage = $("#guestMessage");
  var guestCount = $("#guestCount");
  var guestbookStatus = $("#guestbookStatus");
  var guestbookList = $("#guestbookList");
  var guestbookEmpty = $("#guestbookEmpty");
  var guestbookTotal = $("#guestbookTotal");
  var clearGuestbook = $("#clearGuestbook");

  var letterForm = $("#letterForm");
  var letterTo = $("#letterTo");
  var letterMessage = $("#letterMessage");
  var letterCount = $("#letterCount");
  var lettersStatus = $("#lettersStatus");
  var lettersList = $("#lettersList");
  var lettersEmpty = $("#lettersEmpty");
  var lettersTotal = $("#lettersTotal");

  var guideModal = $("#guideModal");
  var eggModal = $("#eggModal");
  var pageChrome = $$(".floating-tools, .skip-link");

  /* ---------- STATE ---------- */
  var state = {
    filter: "Semua",
    query: "",
    layout: "editorial",
    visible: [],
    lightboxIndex: 0,
    lightboxTrigger: null,
    slideshow: false,
    slideshowTimer: 0,
    modalOpen: null,
    modalTrigger: null,
    introDone: false,
    toastTimer: 0,
    eggClicks: 0,
    eggTimer: 0,
    keyBuffer: ""
  };

  var storageFallback = {};
  var storageWorks = true;
  try {
    var probeKey = "__dkvearless_probe__";
    window.localStorage.setItem(probeKey, "1");
    window.localStorage.removeItem(probeKey);
  } catch (err) {
    storageWorks = false;
  }

  var awards = Array.isArray(data.awards) ? data.awards.slice() : [];
  var awardsKey = "dkvearless.awards.v1";
  var awardsSaved = {};
  try {
    var parsedAwards = JSON.parse(storageGet(awardsKey) || "{}");
    if (parsedAwards && typeof parsedAwards === "object" && !Array.isArray(parsedAwards)) {
      awardsSaved = parsedAwards;
    }
  } catch (err) {
    awardsSaved = {};
  }
  var awardEditingIndex = -1;
  var awardPendingPhoto = "";

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

  function safeJson(value, fallback) {
    try {
      var parsed = JSON.parse(value);
      return parsed == null ? fallback : parsed;
    } catch (err) {
      return fallback;
    }
  }

  function storageGet(key) {
    if (!storageWorks) {
      return Object.prototype.hasOwnProperty.call(storageFallback, key) ? storageFallback[key] : null;
    }
    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function storageSet(key, value) {
    if (!storageWorks) {
      storageFallback[key] = value;
      return;
    }
    try {
      window.localStorage.setItem(key, value);
    } catch (err) {
      storageFallback[key] = value;
    }
  }

  function readList(key) {
    var raw = storageGet(key);
    var list = raw ? safeJson(raw, []) : [];
    return Array.isArray(list) ? list : [];
  }

  function writeList(key, list) {
    storageSet(key, JSON.stringify(list));
  }

  function formatDate(iso) {
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).format(new Date(iso));
    } catch (err) {
      return "";
    }
  }

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) {
      return "0:00";
    }
    var total = Math.floor(seconds);
    var minutes = Math.floor(total / 60);
    var secs = total % 60;
    return minutes + ":" + (secs < 10 ? "0" : "") + secs;
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
    window.requestAnimationFrame(function () {
      toast.classList.add("is-visible");
    });
    state.toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 3600);
  }

  function setSiteInert(value) {
    if (site) {
      site.inert = value;
      if (value) {
        site.setAttribute("aria-hidden", "true");
      } else {
        site.removeAttribute("aria-hidden");
      }
    }
    pageChrome.forEach(function (element) {
      element.inert = value;
      if (value) {
        element.setAttribute("aria-hidden", "true");
      } else {
        element.removeAttribute("aria-hidden");
      }
    });
  }

  /* ---------- LOADER & OPENING ---------- */
  var loaderHidden = false;

  function hideLoader() {
    if (loaderHidden || !loader) {
      return;
    }
    loaderHidden = true;
    loader.classList.add("is-done");
    if (!state.introDone && openMemories) {
      window.setTimeout(function () {
        openMemories.focus({ preventScroll: true });
      }, 120);
    }
  }

  if (site) {
    setSiteInert(true);
  }

  window.addEventListener("load", function () {
    window.setTimeout(hideLoader, 380);
  });
  window.setTimeout(hideLoader, 1500);

  function openArchive() {
    if (!opening || opening.classList.contains("is-opening")) {
      return;
    }
    opening.classList.add("is-opening");
    if (state.musicWanted) {
      playMusic();
    }
    window.setTimeout(function () {
      opening.classList.add("is-hidden");
      opening.setAttribute("aria-hidden", "true");
      opening.inert = true;
      state.introDone = true;
      body.classList.remove("is-locked");
      setSiteInert(false);
      window.scrollTo(0, 0);
      var home = document.getElementById("home");
      if (home) {
        home.setAttribute("tabindex", "-1");
        home.focus({ preventScroll: true });
      }
    }, reduceMotion ? 50 : 1180);
  }

  if (openMemories) {
    openMemories.addEventListener("click", openArchive);
  }

  /* ---------- MUSIC ---------- */
  var stateMusicWanted = storageGet("dkvearless.music") === "on";
  state.musicWanted = stateMusicWanted;

  if (music && data.music && data.music.src) {
    if (music.getAttribute("src") !== data.music.src) {
      music.setAttribute("src", data.music.src);
      music.load();
    }
  }

  var musicFadeTimer = 0;

  function updateMusicUI(isPlaying) {
    if (!musicToggle) {
      return;
    }
    musicToggle.classList.toggle("is-playing", !!isPlaying);
    musicToggle.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    musicToggle.setAttribute("aria-label", isPlaying ? "Matikan musik kenangan" : "Nyalakan musik kenangan");
    if (musicLabel) {
      musicLabel.textContent = isPlaying ? "Musik Nyala" : "Musik Mati";
    }
  }

  function fadeMusicTo(target, duration) {
    if (!music) {
      return;
    }
    window.clearInterval(musicFadeTimer);
    var start = music.volume;
    var steps = Math.max(1, Math.round((duration || 800) / 50));
    var step = 0;
    musicFadeTimer = window.setInterval(function () {
      step += 1;
      music.volume = Math.max(0, Math.min(0.32, start + (target - start) * (step / steps)));
      if (step >= steps) {
        window.clearInterval(musicFadeTimer);
        music.volume = target;
      }
    }, 50);
  }

  function playMusic() {
    if (!music) {
      return;
    }
    music.volume = 0;
    var attempt = music.play();
    if (attempt && typeof attempt.then === "function") {
      attempt.then(function () {
        fadeMusicTo(0.28, 900);
        updateMusicUI(true);
      }).catch(function () {
        updateMusicUI(false);
      });
    }
  }

  function pauseMusic() {
    if (!music) {
      return;
    }
    music.pause();
    updateMusicUI(false);
  }

  if (music) {
    music.volume = 0;
    music.addEventListener("play", function () {
      updateMusicUI(true);
    });
    music.addEventListener("pause", function () {
      updateMusicUI(false);
    });
  }

  if (musicToggle) {
    musicToggle.addEventListener("click", function () {
      if (music.paused) {
        state.musicWanted = true;
        storageSet("dkvearless.music", "on");
        playMusic();
        if (!state.introDone) {
          showToast("Musik akan mulai setelah album dibuka.");
        }
      } else {
        state.musicWanted = false;
        storageSet("dkvearless.music", "off");
        pauseMusic();
      }
    });
  }

  updateMusicUI(false);

  /* ---------- HEADER / NAV / SCROLL ---------- */
  function closeNav() {
    if (!nav || !navToggle) {
      return;
    }
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Buka menu");
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", function (event) {
    if (nav && nav.classList.contains("is-open") && !nav.contains(event.target)) {
      closeNav();
    }
  });

  var ticking = false;

  function updateParallax(y) {
    if (reduceMotion || window.innerWidth <= 1020) {
      $$("[data-parallax]").forEach(function (element) {
        element.style.setProperty("--parallax-y", "0px");
      });
      return;
    }
    $$("[data-parallax]").forEach(function (element) {
      var rect = element.getBoundingClientRect();
      var speed = parseFloat(element.getAttribute("data-parallax")) || 0;
      var offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      offset = Math.max(-36, Math.min(36, offset));
      element.style.setProperty("--parallax-y", offset.toFixed(1) + "px");
    });
  }

  function onScroll() {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset || 0;

      if (siteHeader) {
        siteHeader.classList.toggle("is-scrolled", y > 16);
      }
      if (toTop) {
        toTop.hidden = y < 520;
      }
      if (scrollProgress) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var ratio = max > 0 ? Math.min(1, y / max) : 0;
        scrollProgress.style.width = (ratio * 100).toFixed(2) + "%";
      }

      var activeId = "home";
      ["home", "journey", "gallery", "film", "students", "messages"].forEach(function (id) {
        var section = document.getElementById(id);
        if (section && y + 130 >= section.offsetTop) {
          activeId = id;
        }
      });
      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + activeId);
      });

      updateParallax(y);
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  if (toTop) {
    toTop.addEventListener("click", scrollToTop);
  }
  if (footerTop) {
    footerTop.addEventListener("click", scrollToTop);
  }

  /* ---------- REVEAL ---------- */
  var revealObserver = null;

  function showReveal(element) {
    if (element) {
      element.classList.add("is-visible");
    }
  }

  function observeReveals(root) {
    var items = $$(".reveal:not(.is-visible)", root || document);

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(showReveal);
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    }

    items.forEach(function (item) {
      revealObserver.observe(item);
    });
  }

  /* ---------- RENDER TIMELINE ---------- */
  function renderTimeline() {
    if (!timelineList) {
      return;
    }

    if (!timeline.length) {
      timelineList.innerHTML = '<p class="chapter-note">Belum ada timeline. Tambahkan datanya di <code>js/media-data.js</code>.</p>';
      return;
    }

    timelineList.innerHTML = timeline.map(function (item, index) {
      return '<article class="timeline-entry reveal" style="--reveal-delay:' + (index * 70) + 'ms">' +
        '<div class="timeline-entry__year">' +
          '<strong>' + escapeHtml(item.year) + '</strong>' +
          '<span>' + escapeHtml(item.chapter || "Chapter") + '</span>' +
        '</div>' +
        '<div class="timeline-entry__body">' +
          '<h3>' + escapeHtml(item.title) + '</h3>' +
          '<p>' + escapeHtml(item.text) + '</p>' +
          '<span class="timeline-entry__prompt">Tambahkan satu detail kecil yang ingin diingat dari tahun ini.</span>' +
        '</div>' +
        '<figure class="timeline-photo">' +
          '<img src="' + escapeHtml(item.photo || "") + '" alt="' + escapeHtml(item.alt || "") + '" loading="lazy" decoding="async">' +
          '<figcaption>' + escapeHtml(item.caption || "") + '</figcaption>' +
        '</figure>' +
      '</article>';
    }).join("");

    observeReveals(timelineList);
  }

  /* ---------- RENDER NAMA SISWA ---------- */
  function renderStudents() {
    if (!studentList) {
      return;
    }

    if (studentTotal) {
      studentTotal.textContent = String(students.length);
    }

    if (!students.length) {
      studentList.innerHTML = '<li class="student-card student-card--empty"><span class="student-card__name">Belum ada nama siswa. Tambahkan datanya di <code>js/media-data.js</code>.</span></li>';
      return;
    }

    studentList.innerHTML = students.map(function (student, index) {
      var name = typeof student === "string"
        ? student
        : (student && student.name) || "Nama belum diisi";
      return '<li class="student-card reveal" style="--reveal-delay:' + Math.min(index, 17) * 30 + 'ms">' +
        '<span class="student-card__number" aria-hidden="true">' + String(index + 1).padStart(2, "0") + '</span>' +
        '<span class="student-card__name">' + escapeHtml(name) + '</span>' +
      '</li>';
    }).join("");

    observeReveals(studentList);
  }

  /* ---------- PENGHARGAAN ---------- */
  function renderAwards() {
    if (!awardList) {
      return;
    }

    if (!awards.length) {
      awardList.innerHTML = '<p class="chapter-note">Belum ada kategori penghargaan. Tambahkan di <code>js/media-data.js</code>.</p>';
      return;
    }

    awardList.innerHTML = awards.map(function (award, index) {
      var saved = awardsSaved[index] || {};
      var name = typeof saved.name === "string"
        ? saved.name
        : (typeof award.name === "string" ? award.name : "");
      var photo = typeof saved.photo === "string"
        ? saved.photo
        : (typeof award.photo === "string" ? award.photo : "");
      var number = String(index + 1).padStart(2, "0");
      var photoHtml = photo
        ? '<img src="' + escapeHtml(photo) + '" alt="Foto ' + escapeHtml(name || award.title) + '" loading="lazy" decoding="async">'
        : '<span class="award-item__placeholder" aria-hidden="true">' + number + '</span>';

      return '<article class="award-item reveal" style="--reveal-delay:' + Math.min(index, 6) * 45 + 'ms">' +
        '<span class="award-item__index" aria-hidden="true">' + number + '</span>' +
        '<div class="award-item__copy">' +
          '<h3>' + escapeHtml(award.title || "Penghargaan") + '</h3>' +
          '<p>' + escapeHtml(award.note || "Kategori bebas, isi sesuka kelas.") + '</p>' +
        '</div>' +
        '<div class="award-item__person">' +
          '<span class="award-item__photo' + (photo ? " is-filled" : "") + '">' + photoHtml + '</span>' +
          '<span class="award-item__name' + (name ? "" : " is-empty") + '">' + escapeHtml(name || "Belum diisi") + '</span>' +
        '</div>' +
        '<button class="award-item__edit" type="button" data-award-edit="' + index + '">' +
          (name || photo ? "Ubah" : "Isi sendiri") +
        '</button>' +
      '</article>';
    }).join("");

    observeReveals(awardList);
  }

  function updateAwardPreview() {
    if (!awardPreview) {
      return;
    }
    awardPreview.hidden = !awardPendingPhoto;
    if (awardPreviewImg && awardPendingPhoto) {
      awardPreviewImg.src = awardPendingPhoto;
    }
  }

  function openAwardEditor(index, trigger) {
    var award = awards[index];
    if (!award) {
      return;
    }

    var saved = awardsSaved[index] || {};
    var savedName = typeof saved.name === "string"
      ? saved.name
      : (typeof award.name === "string" ? award.name : "");
    awardEditingIndex = index;
    awardPendingPhoto = typeof saved.photo === "string"
      ? saved.photo
      : (typeof award.photo === "string" ? award.photo : "");

    if (awardModalTitle) {
      awardModalTitle.textContent = award.title || "Penghargaan";
    }
    if (awardIndexInput) {
      awardIndexInput.value = String(index);
    }
    if (awardName) {
      awardName.value = savedName;
    }
    if (awardPhoto) {
      awardPhoto.value = "";
    }
    if (awardReset) {
      awardReset.hidden = !savedName && !awardPendingPhoto;
    }
    if (awardStatus) {
      awardStatus.textContent = "";
      awardStatus.classList.remove("is-error");
    }
    updateAwardPreview();
    openModal("awardModal", trigger);

    if (awardName) {
      window.setTimeout(function () {
        awardName.focus({ preventScroll: true });
      }, 80);
    }
  }

  function saveAwards() {
    storageSet(awardsKey, JSON.stringify(awardsSaved));
  }

  function compressAwardPhoto(file) {
    if (!file) {
      return;
    }
    if (!/^image\//.test(file.type)) {
      if (awardStatus) {
        awardStatus.textContent = "File harus berupa gambar JPG atau PNG.";
        awardStatus.classList.add("is-error");
      }
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      if (awardStatus) {
        awardStatus.textContent = "Fotonya terlalu besar. Maksimal 6 MB.";
        awardStatus.classList.add("is-error");
      }
      return;
    }

    if (awardStatus) {
      awardStatus.textContent = "Menyiapkan foto...";
      awardStatus.classList.remove("is-error");
    }

    var reader = new FileReader();
    reader.onload = function (event) {
      var image = new Image();
      image.onload = function () {
        var maxSide = 720;
        var scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        var canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        var context = canvas.getContext("2d");
        var dataUrl = "";
        try {
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          dataUrl = canvas.toDataURL("image/jpeg", 0.74);
          if (dataUrl.length > 900000) {
            dataUrl = canvas.toDataURL("image/jpeg", 0.52);
          }
        } catch (err) {
          dataUrl = event.target.result;
        }
        awardPendingPhoto = dataUrl;
        updateAwardPreview();
        if (awardStatus) {
          awardStatus.textContent = "Foto siap. Jangan lupa simpan.";
          awardStatus.classList.remove("is-error");
        }
      };
      image.onerror = function () {
        if (awardStatus) {
          awardStatus.textContent = "Fotonya nggak bisa dibaca. Coba file lain.";
          awardStatus.classList.add("is-error");
        }
      };
      image.src = event.target.result;
    };
    reader.onerror = function () {
      if (awardStatus) {
        awardStatus.textContent = "Fotonya gagal dibaca. Coba sekali lagi.";
        awardStatus.classList.add("is-error");
      }
    };
    reader.readAsDataURL(file);
  }

  if (awardList) {
    awardList.addEventListener("click", function (event) {
      var button = event.target.closest("[data-award-edit]");
      if (!button) {
        return;
      }
      var index = parseInt(button.getAttribute("data-award-edit"), 10);
      if (!isNaN(index)) {
        openAwardEditor(index, button);
      }
    });
  }

  if (awardPhoto) {
    awardPhoto.addEventListener("change", function () {
      if (awardPhoto.files && awardPhoto.files[0]) {
        compressAwardPhoto(awardPhoto.files[0]);
      }
    });
  }

  if (awardPhotoClear) {
    awardPhotoClear.addEventListener("click", function () {
      awardPendingPhoto = "";
      if (awardPhoto) {
        awardPhoto.value = "";
      }
      updateAwardPreview();
      if (awardStatus) {
        awardStatus.textContent = "Foto dihapus dari pratinjau.";
        awardStatus.classList.remove("is-error");
      }
    });
  }

  if (awardForm) {
    awardForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (awardEditingIndex < 0) {
        return;
      }
      var name = awardName ? awardName.value.trim().slice(0, 40) : "";

      if (!name && !awardPendingPhoto) {
        if (awardStatus) {
          awardStatus.textContent = "Isi nama atau pilih foto dulu.";
          awardStatus.classList.add("is-error");
        }
        return;
      }

      awardsSaved[awardEditingIndex] = {
        name: name,
        photo: awardPendingPhoto
      };
      saveAwards();
      closeModal(document.getElementById("awardModal"));
      renderAwards();
      showToast("Penghargaan tersimpan. Cek lagi siapa yang paling pantas.");
    });
  }

  if (awardReset) {
    awardReset.addEventListener("click", function () {
      if (awardEditingIndex < 0) {
        return;
      }
      delete awardsSaved[awardEditingIndex];
      saveAwards();
      closeModal(document.getElementById("awardModal"));
      renderAwards();
      showToast("Penghargaan dikosongkan lagi.");
    });
  }

  /* ---------- GALLERY ---------- */
  function getFilteredPhotos() {
    var query = normalize(state.query);
    return photos.filter(function (photo) {
      if (!photo) {
        return false;
      }
      if (state.filter !== "Semua" && photo.category !== state.filter) {
        return false;
      }
      if (!query) {
        return true;
      }
      var haystack = normalize([
        photo.caption,
        photo.category,
        photo.year,
        photo.frame,
        photo.alt,
        photo.file
      ].join(" "));
      return haystack.indexOf(query) !== -1;
    });
  }

  function renderFilters() {
    if (!galleryFilters) {
      return;
    }
    galleryFilters.innerHTML = categories.map(function (category) {
      return '<button class="filter-chip' + (category === state.filter ? " is-active" : "") + '" type="button" data-category="' + escapeHtml(category) + '" aria-pressed="' + (category === state.filter ? "true" : "false") + '">' + escapeHtml(category) + '</button>';
    }).join("");
  }

  function makeCard(photo, index) {
    var caption = photo.caption || "Kenangan DKV 3";
    var alt = photo.alt || caption;
    var category = photo.category || "Arsip";
    var year = photo.year || "";
    var frame = photo.frame || ("BINGKAI " + String(index + 1).padStart(2, "0"));

    return '<button class="gallery-card" type="button" data-index="' + index + '" aria-label="Buka foto: ' + escapeHtml(caption) + '">' +
      '<span class="gallery-card__media">' +
        '<img src="' + escapeHtml(photo.file || "") + '" alt="' + escapeHtml(alt) + '" loading="' + (index < 4 ? "eager" : "lazy") + '" decoding="async">' +
        '<span class="gallery-card__stamp">' + escapeHtml(frame) + (year ? " / " + escapeHtml(year) : "") + '</span>' +
        '<span class="gallery-card__zoom" aria-hidden="true">+</span>' +
      '</span>' +
      '<span class="gallery-card__caption">' + escapeHtml(caption) + '</span>' +
      '<span class="gallery-card__meta"><span>' + escapeHtml(category) + '</span><span>' + escapeHtml(year) + '</span></span>' +
    '</button>';
  }

  function renderGallery() {
    if (!galleryGrid) {
      return;
    }

    state.visible = getFilteredPhotos();

    $$(".filter-chip", galleryFilters).forEach(function (chip) {
      var active = chip.getAttribute("data-category") === state.filter;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", active ? "true" : "false");
    });

    if (searchClear) {
      searchClear.hidden = !state.query;
    }

    if (galleryCount) {
      if (!state.visible.length) {
        galleryCount.innerHTML = "<strong>0</strong> foto ditemukan";
      } else {
        galleryCount.innerHTML = "Menampilkan <strong>" + state.visible.length + "</strong> dari <strong>" + photos.length + "</strong> foto";
      }
    }

    var empty = state.visible.length === 0;
    galleryGrid.hidden = empty;
    if (galleryEmpty) {
      galleryEmpty.hidden = !empty;
    }

    galleryGrid.innerHTML = state.visible.map(makeCard).join("");

    $$(".gallery-card img", galleryGrid).forEach(function (img) {
      img.addEventListener("error", function () {
        var media = img.closest(".gallery-card__media");
        if (media) {
          media.classList.add("is-missing");
        }
        img.alt = "Foto belum ditemukan. Periksa nama file di assets/images.";
      });
    });
  }

  function setLayout(layout) {
    var allowed = ["editorial", "masonry", "polaroid", "film"];
    if (allowed.indexOf(layout) === -1) {
      layout = "editorial";
    }
    state.layout = layout;
    if (galleryGrid) {
      allowed.forEach(function (name) {
        galleryGrid.classList.toggle("gallery--" + name, name === layout);
      });
    }
    layoutButtons.forEach(function (button) {
      var active = button.getAttribute("data-layout") === layout;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    storageSet("dkvearless.layout", layout);
  }

  function resetGallery() {
    state.filter = "Semua";
    state.query = "";
    if (gallerySearch) {
      gallerySearch.value = "";
    }
    renderGallery();
  }

  function openRandomMemory() {
    if (!photos.length) {
      return;
    }
    if (!state.visible.length) {
      resetGallery();
    }
    if (!state.visible.length) {
      return;
    }
    var index = Math.floor(Math.random() * state.visible.length);
    openLightbox(index);
  }

  if (galleryFilters) {
    galleryFilters.addEventListener("click", function (event) {
      var chip = event.target.closest(".filter-chip");
      if (!chip) {
        return;
      }
      state.filter = chip.getAttribute("data-category") || "Semua";
      renderGallery();
    });
  }

  if (gallerySearch) {
    gallerySearch.addEventListener("input", function () {
      state.query = gallerySearch.value.trim();
      renderGallery();
    });
    gallerySearch.addEventListener("search", function () {
      state.query = gallerySearch.value.trim();
      renderGallery();
    });
  }

  if (searchClear) {
    searchClear.addEventListener("click", function () {
      state.query = "";
      if (gallerySearch) {
        gallerySearch.value = "";
        gallerySearch.focus();
      }
      renderGallery();
    });
  }

  if (resetFilters) {
    resetFilters.addEventListener("click", function () {
      resetGallery();
      if (gallerySearch) {
        gallerySearch.focus();
      }
    });
  }

  if (galleryGrid) {
    galleryGrid.addEventListener("click", function (event) {
      var card = event.target.closest(".gallery-card");
      if (!card) {
        return;
      }
      var index = parseInt(card.getAttribute("data-index"), 10);
      if (!isNaN(index)) {
        openLightbox(index);
      }
    });
  }

  layoutButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setLayout(button.getAttribute("data-layout"));
    });
  });

  randomButtons.forEach(function (button) {
    button.addEventListener("click", openRandomMemory);
  });

  if (startSlideshow) {
    startSlideshow.addEventListener("click", function () {
      if (!state.visible.length) {
        resetGallery();
      }
      if (!state.visible.length) {
        return;
      }
      openLightbox(0);
      startLightboxSlideshow();
    });
  }

  /* ---------- TEBAK MOMEN ---------- */
  var guessPool = photos.filter(function (photo) {
    return photo && photo.year && photo.category && photo.category !== "Semua";
  });
  var guessRound = 0;
  var guessCorrect = 0;
  var guessLocked = false;
  var guessCurrent = null;
  var guessMode = "year";

  function shuffleArray(list) {
    var copy = list.slice();
    for (var index = copy.length - 1; index > 0; index -= 1) {
      var swapIndex = Math.floor(Math.random() * (index + 1));
      var temporary = copy[index];
      copy[index] = copy[swapIndex];
      copy[swapIndex] = temporary;
    }
    return copy;
  }

  function makeGuessChoices(answer, source, maximum) {
    var unique = [];
    source.forEach(function (value) {
      if (value && unique.indexOf(value) === -1) {
        unique.push(value);
      }
    });
    if (unique.indexOf(answer) === -1) {
      unique.unshift(answer);
    }
    var picked = shuffleArray(unique).slice(0, maximum);
    if (picked.indexOf(answer) === -1) {
      picked[maximum - 1] = answer;
    }
    return shuffleArray(picked);
  }

  function pickGuess() {
    if (!guessOptions || !guessQuestion || !guessPool.length) {
      if (guessQuestion) {
        guessQuestion.textContent = "Belum ada foto untuk ditebak.";
      }
      if (guessCaption) {
        guessCaption.textContent = "Tambahkan foto dengan tahun dan kategori di js/media-data.js.";
      }
      return;
    }

    var nextIndex = Math.floor(Math.random() * guessPool.length);
    if (guessPool.length > 1 && guessCurrent) {
      while (guessPool[nextIndex].file === guessCurrent.file) {
        nextIndex = Math.floor(Math.random() * guessPool.length);
      }
    }

    guessCurrent = guessPool[nextIndex];
    guessRound += 1;
    guessLocked = false;
    guessMode = guessRound % 2 === 1 ? "year" : "category";

    var answer;
    var choices;
    if (guessMode === "year") {
      answer = guessCurrent.year;
      choices = makeGuessChoices(answer, guessPool.map(function (photo) {
        return photo.year;
      }), 4);
      guessQuestion.textContent = "Foto ini dari tahun berapa?";
    } else {
      answer = guessCurrent.category;
      choices = makeGuessChoices(answer, categories.filter(function (category) {
        return category !== "Semua";
      }), 4);
      guessQuestion.textContent = "Ini masuk kegiatan apa?";
    }

    if (guessImage) {
      guessImage.src = guessCurrent.file || "";
      guessImage.alt = "Foto misteri DKV 3";
    }
    if (guessFrame) {
      guessFrame.textContent = guessCurrent.frame || "BINGKAI RAHASIA";
    }
    if (guessProgress) {
      guessProgress.textContent = "Tebakan ke-" + guessRound +
        (guessCorrect ? " · skor " + guessCorrect + " benar" : "");
    }
    if (guessFeedback) {
      guessFeedback.textContent = "";
      guessFeedback.className = "guess__feedback";
    }
    if (guessCaption) {
      guessCaption.textContent = "Pilih satu jawaban. Jawaban dan keterangan asli muncul setelah itu.";
    }
    if (nextGuess) {
      nextGuess.hidden = true;
    }

    guessOptions.innerHTML = choices.map(function (choice) {
      return '<button class="guess__option" type="button" data-answer="' +
        escapeHtml(choice) + '">' + escapeHtml(choice) + '</button>';
    }).join("");
  }

  function answerGuess(button) {
    if (!guessCurrent || guessLocked) {
      return;
    }
    guessLocked = true;
    var answer = guessMode === "year" ? guessCurrent.year : guessCurrent.category;
    var chosen = button.getAttribute("data-answer");
    var correct = chosen === answer;
    var buttons = $$(".guess__option", guessOptions);

    buttons.forEach(function (option) {
      option.disabled = true;
      if (option.getAttribute("data-answer") === answer) {
        option.classList.add("is-correct");
      }
    });
    if (!correct) {
      button.classList.add("is-wrong");
    }
    if (correct) {
      guessCorrect += 1;
    }

    if (guessFeedback) {
      guessFeedback.classList.add(correct ? "is-correct" : "is-wrong");
      guessFeedback.textContent = correct
        ? "Benar. Masih ingat, berarti benar-benar ikut."
        : "Belum tepat. Jawabannya: " + answer + ".";
    }
    if (guessProgress) {
      guessProgress.textContent = "Skor " + guessCorrect + " benar dari " + guessRound + " tebakan";
    }
    if (guessCaption) {
      guessCaption.textContent = (guessCurrent.caption || "Tanpa keterangan.") +
        " · " + guessCurrent.category + " / " + guessCurrent.year;
    }
    if (guessImage) {
      guessImage.alt = guessCurrent.alt || "Foto kenangan DKV 3";
    }
    if (nextGuess) {
      nextGuess.hidden = false;
    }
  }

  if (guessOptions) {
    guessOptions.addEventListener("click", function (event) {
      var button = event.target.closest(".guess__option");
      if (button) {
        answerGuess(button);
      }
    });
  }

  if (nextGuess) {
    nextGuess.addEventListener("click", pickGuess);
  }

  /* ---------- LIGHTBOX ---------- */
  function stopLightboxSlideshow() {
    state.slideshow = false;
    window.clearInterval(state.slideshowTimer);
    state.slideshowTimer = 0;
    if (lightbox) {
      lightbox.classList.remove("is-playing");
    }
    if (lbSlideshow) {
      lbSlideshow.setAttribute("aria-pressed", "false");
    }
    if (lbPlayLabel) {
      lbPlayLabel.textContent = "Putar Otomatis";
    }
  }

  function scheduleSlide() {
    window.clearInterval(state.slideshowTimer);
    state.slideshowTimer = window.setInterval(function () {
      showNextPhoto(1);
    }, 4500);
  }

  function startLightboxSlideshow() {
    if (!lightbox || lightbox.hidden) {
      return;
    }
    state.slideshow = true;
    if (lightbox) {
      lightbox.classList.add("is-playing");
    }
    if (lbSlideshow) {
      lbSlideshow.setAttribute("aria-pressed", "true");
    }
    if (lbPlayLabel) {
      lbPlayLabel.textContent = "Jeda Otomatis";
    }
    scheduleSlide();
  }

  function toggleLightboxSlideshow() {
    if (state.slideshow) {
      stopLightboxSlideshow();
    } else {
      startLightboxSlideshow();
    }
  }

  function updateLightbox() {
    var photo = state.visible[state.lightboxIndex];
    if (!photo) {
      return;
    }
    if (lbImage) {
      lbImage.src = photo.file || "";
      lbImage.alt = photo.alt || photo.caption || "Foto kenangan DKV 3";
    }
    if (lbCaption) {
      lbCaption.textContent = photo.caption || "Kenangan DKV 3";
    }
    if (lbMeta) {
      lbMeta.textContent = [photo.category, photo.year, photo.frame].filter(Boolean).join(" / ");
    }
    if (lbCounter) {
      lbCounter.textContent = String(state.lightboxIndex + 1).padStart(2, "0") + " / " + String(state.visible.length).padStart(2, "0");
    }
    if (lbProgress) {
      lbProgress.textContent = String(state.lightboxIndex + 1).padStart(2, "0");
    }
  }

  function openLightbox(index) {
    if (!lightbox || !state.visible.length) {
      return;
    }
    if (state.modalOpen) {
      closeModal(state.modalOpen, false);
    }
    state.lightboxTrigger = document.activeElement;
    state.lightboxIndex = (index + state.visible.length) % state.visible.length;
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
    setSiteInert(true);
    updateLightbox();
    if (lbClose) {
      lbClose.focus({ preventScroll: true });
    }
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) {
      return;
    }
    stopLightboxSlideshow();
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    if (!state.modalOpen) {
      body.classList.remove("modal-open");
      setSiteInert(false);
    }
    if (state.lightboxTrigger && typeof state.lightboxTrigger.focus === "function") {
      state.lightboxTrigger.focus({ preventScroll: true });
    }
    state.lightboxTrigger = null;
  }

  function showNextPhoto(direction) {
    if (!state.visible.length) {
      return;
    }
    state.lightboxIndex = (state.lightboxIndex + direction + state.visible.length) % state.visible.length;
    updateLightbox();
    if (state.slideshow) {
      scheduleSlide();
    }
  }

  if (lbClose) {
    lbClose.addEventListener("click", closeLightbox);
  }
  if (lbPrev) {
    lbPrev.addEventListener("click", function () {
      showNextPhoto(-1);
    });
  }
  if (lbNext) {
    lbNext.addEventListener("click", function () {
      showNextPhoto(1);
    });
  }
  if (lbSlideshow) {
    lbSlideshow.addEventListener("click", toggleLightboxSlideshow);
  }
  $$("[data-close-lightbox]").forEach(function (element) {
    element.addEventListener("click", closeLightbox);
  });

  if (lightbox) {
    var touchStartX = null;
    lightbox.addEventListener("touchstart", function (event) {
      if (event.touches.length === 1) {
        touchStartX = event.touches[0].clientX;
      }
    }, { passive: true });
    lightbox.addEventListener("touchend", function (event) {
      if (touchStartX === null) {
        return;
      }
      var delta = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 52) {
        showNextPhoto(delta < 0 ? 1 : -1);
      }
      touchStartX = null;
    }, { passive: true });
    lightbox.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNextPhoto(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showNextPhoto(-1);
      }
      trapFocus(lightbox, event);
    });
  }

  /* ---------- MODALS ---------- */
  function getFocusable(container) {
    return $$('button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', container)
      .filter(function (element) {
        return element.offsetParent !== null;
      });
  }

  function trapFocus(container, event) {
    if (event.key !== "Tab") {
      return;
    }
    var focusables = getFocusable(container);
    if (!focusables.length) {
      return;
    }
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openModal(id, trigger) {
    var modal = document.getElementById(id);
    if (!modal) {
      return;
    }
    if (lightbox && !lightbox.hidden) {
      closeLightbox();
    }
    if (state.modalOpen && state.modalOpen !== modal) {
      closeModal(state.modalOpen, false);
    }
    state.modalTrigger = trigger || document.activeElement;
    state.modalOpen = modal;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
    setSiteInert(true);
    var target = $(".modal__close", modal) || $("button, a, input", modal);
    if (target) {
      window.setTimeout(function () {
        target.focus({ preventScroll: true });
      }, 50);
    }
  }

  function closeModal(modal, restoreFocus) {
    var target = modal || state.modalOpen;
    if (!target) {
      return;
    }
    target.hidden = true;
    target.setAttribute("aria-hidden", "true");
    if (state.modalOpen === target) {
      state.modalOpen = null;
    }
    if (!lightbox || lightbox.hidden) {
      body.classList.remove("modal-open");
      setSiteInert(false);
    }
    if (restoreFocus !== false && state.modalTrigger && typeof state.modalTrigger.focus === "function") {
      state.modalTrigger.focus({ preventScroll: true });
    }
    state.modalTrigger = null;
  }

  $$("[data-open-guide]").forEach(function (button) {
    button.addEventListener("click", function () {
      closeNav();
      openModal("guideModal", button);
    });
  });

  $$("[data-close-modal]").forEach(function (element) {
    element.addEventListener("click", function () {
      var modal = element.closest(".modal");
      closeModal(modal || state.modalOpen);
    });
  });

  /* ---------- EASTER EGG ---------- */
  function revealEasterEgg(trigger) {
    openModal("eggModal", trigger || brandLogo);
    state.eggClicks = 0;
  }

  if (brandLogo) {
    brandLogo.addEventListener("click", function () {
      state.eggClicks += 1;
      window.clearTimeout(state.eggTimer);
      state.eggTimer = window.setTimeout(function () {
        state.eggClicks = 0;
      }, 5000);

      if (state.eggClicks === 3) {
        showToast("Terus. Ada satu bingkai lagi.");
      }
      if (state.eggClicks >= 5) {
        window.clearTimeout(state.eggTimer);
        revealEasterEgg(brandLogo);
      }
    });
  }

  /* ---------- VIDEO ---------- */
  var resumeMusicAfterVideo = false;
  var lastVideoVolume = 1;

  if (video && data.video && data.video.src) {
    var source = video.querySelector("source");
    if (source) {
      source.src = data.video.src;
    }
    if (data.video.poster) {
      video.setAttribute("poster", data.video.poster);
    }
    if (filmCaption && data.video.caption) {
      filmCaption.textContent = data.video.caption;
    }
    video.load();
  }

  function updateVideoIcons() {
    var paused = !video || video.paused || video.ended;
    if (iconPlay) {
      iconPlay.hidden = !paused;
    }
    if (iconPause) {
      iconPause.hidden = paused;
    }
    if (videoPlay) {
      videoPlay.setAttribute("aria-label", paused ? "Putar video" : "Jeda video");
    }
    if (videoFrame) {
      videoFrame.classList.toggle("is-playing", !paused);
    }
  }

  function updateVideoTime() {
    if (!video) {
      return;
    }
    var duration = isFinite(video.duration) ? video.duration : 0;
    var current = isFinite(video.currentTime) ? video.currentTime : 0;
    if (videoTime) {
      videoTime.textContent = formatTime(current) + " / " + formatTime(duration);
    }
    if (filmDuration && duration > 0) {
      filmDuration.textContent = "DURASI " + formatTime(duration);
    }
    if (videoSeek && duration > 0) {
      videoSeek.max = String(duration);
      videoSeek.value = String(current);
    }
  }

  function updateMuteIcon() {
    if (!video) {
      return;
    }
    var silent = video.muted || video.volume === 0;
    if (iconVolume) {
      iconVolume.hidden = silent;
    }
    if (iconMuted) {
      iconMuted.hidden = !silent;
    }
    if (videoVolume) {
      videoVolume.value = String(video.volume);
    }
    if (videoMute) {
      videoMute.setAttribute("aria-label", silent ? "Nyalakan suara video" : "Matikan suara video");
    }
  }

  function toggleVideo() {
    if (!video) {
      return;
    }
    if (video.paused) {
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {
          showToast("Video belum bisa diputar. Pastikan assets/videos/kenangan.mp4 tersedia.");
        });
      }
    } else {
      video.pause();
    }
  }

  if (video) {
    video.muted = false;
    video.volume = 1;
    lastVideoVolume = 1;
    if (videoVolume) {
      videoVolume.value = "1";
    }
    updateVideoIcons();
    updateMuteIcon();
    updateVideoTime();

    video.addEventListener("play", function () {
      if (music && !music.paused) {
        resumeMusicAfterVideo = true;
        pauseMusic();
      }
      updateVideoIcons();
    });
    video.addEventListener("pause", function () {
      updateVideoIcons();
    });
    video.addEventListener("ended", function () {
      updateVideoIcons();
      if (resumeMusicAfterVideo && state.musicWanted) {
        playMusic();
      }
      resumeMusicAfterVideo = false;
    });
    video.addEventListener("timeupdate", updateVideoTime);
    video.addEventListener("loadedmetadata", updateVideoTime);
    video.addEventListener("durationchange", updateVideoTime);
    video.addEventListener("volumechange", updateMuteIcon);
    video.addEventListener("click", toggleVideo);

    if (videoSeek) {
      videoSeek.addEventListener("input", function () {
        if (isFinite(video.duration)) {
          video.currentTime = Number(videoSeek.value);
        }
      });
    }

    if (videoVolume) {
      videoVolume.addEventListener("input", function () {
        var value = Math.max(0, Math.min(1, Number(videoVolume.value) || 0));
        video.volume = value;
        video.muted = value === 0;
        if (value > 0) {
          lastVideoVolume = value;
        }
        updateMuteIcon();
      });
    }

    if (videoMute) {
      videoMute.addEventListener("click", function () {
        if (video.muted || video.volume === 0) {
          video.muted = false;
          if (video.volume === 0) {
            video.volume = lastVideoVolume || 0.8;
          }
        } else {
          lastVideoVolume = video.volume;
          video.muted = true;
        }
        updateMuteIcon();
      });
    }

    if (videoBigPlay) {
      videoBigPlay.addEventListener("click", toggleVideo);
    }
    if (videoPlay) {
      videoPlay.addEventListener("click", toggleVideo);
    }

    if (videoFullscreen) {
      videoFullscreen.addEventListener("click", function () {
        var frame = videoFrame || video;
        if (document.fullscreenElement) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        } else if (frame && frame.requestFullscreen) {
          frame.requestFullscreen().catch(function () {
            showToast("Layar penuh belum didukung browser ini.");
          });
        } else if (frame && frame.webkitRequestFullscreen) {
          frame.webkitRequestFullscreen();
        } else {
          showToast("Layar penuh belum didukung browser ini.");
        }
      });
    }

    document.addEventListener("fullscreenchange", function () {
      if (!videoFullscreen) {
        return;
      }
      videoFullscreen.setAttribute(
        "aria-label",
        document.fullscreenElement === videoFrame ? "Keluar dari layar penuh" : "Masuk ke layar penuh"
      );
    });
  }

  /* ---------- GUESTBOOK ---------- */
  var guestbookKey = "dkvearless.guestbook.v1";
  var guestbook = readList(guestbookKey).filter(function (entry) {
    return entry && typeof entry.name === "string" && typeof entry.message === "string";
  });

  function updateGuestCount() {
    if (guestCount && guestMessage) {
      guestCount.textContent = guestMessage.value.length + " / 240";
    }
  }

  function renderGuestbook() {
    if (!guestbookList) {
      return;
    }

    if (guestbookTotal) {
      guestbookTotal.textContent = String(guestbook.length);
    }
    if (clearGuestbook) {
      clearGuestbook.hidden = guestbook.length === 0;
    }
    if (guestbookEmpty) {
      guestbookEmpty.hidden = guestbook.length !== 0;
    }

    guestbookList.innerHTML = guestbook.slice().reverse().map(function (entry) {
      return '<article class="wall-entry" data-id="' + escapeHtml(entry.id) + '">' +
        '<div class="wall-entry__head">' +
          '<strong>' + escapeHtml(entry.name) + '</strong>' +
          '<time datetime="' + escapeHtml(entry.date) + '">' + escapeHtml(formatDate(entry.date)) + '</time>' +
        '</div>' +
        '<p>' + escapeHtml(entry.message) + '</p>' +
        '<button class="icon-delete" type="button" data-delete-guest="' + escapeHtml(entry.id) + '" aria-label="Hapus pesan dari ' + escapeHtml(entry.name) + '">×</button>' +
      '</article>';
    }).join("");
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

      if (!name || !message) {
        if (guestbookStatus) {
          guestbookStatus.textContent = "Nama dan pesan perlu diisi.";
          guestbookStatus.classList.add("is-error");
        }
        (name ? guestMessage : guestName).focus();
        return;
      }

      guestbook.push({
        id: "g-" + Date.now() + "-" + Math.floor(Math.random() * 9999),
        name: name.slice(0, 40),
        message: message.slice(0, 240),
        date: new Date().toISOString()
      });
      writeList(guestbookKey, guestbook);
      renderGuestbook();
      guestbookForm.reset();
      updateGuestCount();
      if (guestbookStatus) {
        guestbookStatus.classList.remove("is-error");
        guestbookStatus.textContent = "Pesan tersimpan. Terima kasih sudah mampir.";
      }
      if (guestName) {
        guestName.focus();
      }
    });
  }

  if (guestbookList) {
    guestbookList.addEventListener("click", function (event) {
      var button = event.target.closest("[data-delete-guest]");
      if (!button) {
        return;
      }
      var id = button.getAttribute("data-delete-guest");
      if (!window.confirm("Hapus pesan ini?")) {
        return;
      }
      guestbook = guestbook.filter(function (entry) {
        return String(entry.id) !== String(id);
      });
      writeList(guestbookKey, guestbook);
      renderGuestbook();
    });
  }

  if (clearGuestbook) {
    clearGuestbook.addEventListener("click", function () {
      if (!guestbook.length || !window.confirm("Hapus semua pesan di buku pesan?")) {
        return;
      }
      guestbook = [];
      writeList(guestbookKey, guestbook);
      renderGuestbook();
    });
  }

  /* ---------- LETTERS ---------- */
  var lettersKey = "dkvearless.letters.v1";
  var letters = readList(lettersKey).filter(function (entry) {
    return entry && typeof entry.message === "string";
  });

  function updateLetterCount() {
    if (letterCount && letterMessage) {
      letterCount.textContent = letterMessage.value.length + " / 700";
    }
  }

  function renderLetters() {
    if (!lettersList) {
      return;
    }

    if (lettersTotal) {
      lettersTotal.textContent = String(letters.length);
    }
    if (lettersEmpty) {
      lettersEmpty.hidden = letters.length !== 0;
    }

    lettersList.innerHTML = letters.slice().reverse().map(function (entry, index) {
      var revealId = "letter-reveal-" + index;
      return '<article class="letter-entry" data-letter-id="' + escapeHtml(entry.id) + '">' +
        '<div class="letter-entry__head">' +
          '<span>Untuk: ' + escapeHtml(entry.to || "DKV 3") + '</span>' +
          '<time datetime="' + escapeHtml(entry.date) + '">' + escapeHtml(formatDate(entry.date)) + '</time>' +
        '</div>' +
        '<button class="letter-entry__toggle" type="button" aria-expanded="false" aria-controls="' + revealId + '">Buka surat</button>' +
        '<div class="letter-entry__reveal" id="' + revealId + '" aria-hidden="true" inert>' +
          '<div class="letter-entry__reveal-inner">' +
            '<div class="letter-entry__body">' +
              '<p>' + escapeHtml(entry.message) + '</p>' +
              '<button type="button" data-delete-letter="' + escapeHtml(entry.id) + '">Hapus surat</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join("");
  }

  if (letterMessage) {
    letterMessage.addEventListener("input", updateLetterCount);
    updateLetterCount();
  }

  if (letterForm) {
    letterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var message = letterMessage ? letterMessage.value.trim() : "";
      if (!message) {
        if (lettersStatus) {
          lettersStatus.textContent = "Isi suratnya dulu, ya.";
          lettersStatus.classList.add("is-error");
        }
        if (letterMessage) {
          letterMessage.focus();
        }
        return;
      }

      letters.push({
        id: "l-" + Date.now() + "-" + Math.floor(Math.random() * 9999),
        to: (letterTo ? letterTo.value.trim() : "").slice(0, 50) || "DKV 3",
        message: message.slice(0, 700),
        date: new Date().toISOString()
      });
      writeList(lettersKey, letters);
      renderLetters();
      letterForm.reset();
      updateLetterCount();
      if (lettersStatus) {
        lettersStatus.classList.remove("is-error");
        lettersStatus.textContent = "Surat disegel dan disimpan di perangkat ini.";
      }
      if (letterTo) {
        letterTo.focus();
      }
    });
  }

  if (lettersList) {
    lettersList.addEventListener("click", function (event) {
      var toggle = event.target.closest(".letter-entry__toggle");
      if (toggle) {
        var entry = toggle.closest(".letter-entry");
        if (!entry) {
          return;
        }
        var open = entry.classList.toggle("is-open");
        var reveal = $(".letter-entry__reveal", entry);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.textContent = open ? "Tutup surat" : "Buka surat";
        if (reveal) {
          reveal.inert = !open;
          if (open) {
            reveal.removeAttribute("inert");
          } else {
            reveal.setAttribute("inert", "");
          }
          reveal.setAttribute("aria-hidden", open ? "false" : "true");
        }
        return;
      }

      var deleteButton = event.target.closest("[data-delete-letter]");
      if (deleteButton) {
        var id = deleteButton.getAttribute("data-delete-letter");
        if (!window.confirm("Hapus surat ini?")) {
          return;
        }
        letters = letters.filter(function (letter) {
          return String(letter.id) !== String(id);
        });
        writeList(lettersKey, letters);
        renderLetters();
      }
    });
  }

  /* ---------- TABS ---------- */
  function activateTab(name) {
    var guest = name === "guestbook";
    if (tabGuestbook) {
      tabGuestbook.classList.toggle("is-active", guest);
      tabGuestbook.setAttribute("aria-selected", guest ? "true" : "false");
      tabGuestbook.tabIndex = guest ? 0 : -1;
    }
    if (tabLetters) {
      tabLetters.classList.toggle("is-active", !guest);
      tabLetters.setAttribute("aria-selected", guest ? "false" : "true");
      tabLetters.tabIndex = guest ? -1 : 0;
    }
    if (panelGuestbook) {
      panelGuestbook.hidden = !guest;
    }
    if (panelLetters) {
      panelLetters.hidden = guest;
    }
  }

  if (tabGuestbook) {
    tabGuestbook.addEventListener("click", function () {
      activateTab("guestbook");
    });
  }
  if (tabLetters) {
    tabLetters.addEventListener("click", function () {
      activateTab("letters");
    });
  }
  $$(".message-tabs [role='tab']").forEach(function (tab) {
    tab.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        var next = tab === tabGuestbook ? tabLetters : tabGuestbook;
        if (next) {
          next.focus();
          activateTab(next === tabLetters ? "letters" : "guestbook");
        }
      }
    });
  });

  /* ---------- GLOBAL KEYBOARD ---------- */
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (lightbox && !lightbox.hidden) {
        closeLightbox();
      } else if (state.modalOpen) {
        closeModal(state.modalOpen);
      } else if (nav && nav.classList.contains("is-open")) {
        closeNav();
      }
    }

    if (lightbox && !lightbox.hidden) {
      trapFocus(lightbox, event);
    } else if (state.modalOpen) {
      trapFocus(state.modalOpen, event);
    } else if (!state.introDone && opening && !opening.classList.contains("is-hidden")) {
      if (event.key === "Tab") {
        event.preventDefault();
        if (openMemories) {
          openMemories.focus();
        }
      }
    }

    if (!state.introDone || state.modalOpen || (lightbox && !lightbox.hidden)) {
      return;
    }

    var tag = (event.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || event.target.isContentEditable) {
      return;
    }

    if (event.key && event.key.length === 1) {
      state.keyBuffer = (state.keyBuffer + event.key.toLowerCase()).slice(-8);
      if (state.keyBuffer.indexOf("dkv3") !== -1 || state.keyBuffer.indexOf("rindu") !== -1) {
        state.keyBuffer = "";
        revealEasterEgg(brandLogo);
      }
    }
  });

  /* ---------- INIT ---------- */
  renderTimeline();
  renderStudents();
  renderAwards();
  renderFilters();
  setLayout(storageGet("dkvearless.layout") || "editorial");
  renderGallery();
  pickGuess();
  renderGuestbook();
  renderLetters();
  observeReveals();

  if (!storageWorks) {
    $$(".storage-note").forEach(function (note) {
      note.textContent = "Penyimpanan browser tidak tersedia. Data hanya bertahan selama halaman terbuka.";
    });
  }

  /* If for some reason the opening element is missing, unlock the page. */
  if (!opening) {
    state.introDone = true;
    body.classList.remove("is-locked");
    setSiteInert(false);
    hideLoader();
  }
})();
