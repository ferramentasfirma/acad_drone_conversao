(function () {
  "use strict";

  // ---------- Config ----------
  // TODO: replace with the real WhatsApp number (digits only, country + DDD + number).
  var WHATSAPP_NUMBER = "5500000000000";
  var WHATSAPP_GENERIC_MSG = "Olá! Vim pelo site da Academia do Drone e gostaria de mais informações sobre o curso.";
  // Next class deadline: 15/08/2026 23:59 America/Sao_Paulo (UTC-3) == 16/08/2026 02:59 UTC.
  var COUNTDOWN_TARGET = Date.UTC(2026, 7, 16, 2, 59, 0);

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  // ---------- WhatsApp links ----------
  function waLink(number, message) {
    return "https://wa.me/" + number.replace(/\D/g, "") + "?text=" + encodeURIComponent(message);
  }
  var headerWa = $("#whatsapp-header-link");
  var mobileWa = $("#whatsapp-mobile-link");
  var genericLink = waLink(WHATSAPP_NUMBER, WHATSAPP_GENERIC_MSG);
  if (headerWa) headerWa.href = genericLink;
  if (mobileWa) mobileWa.href = genericLink;

  // ---------- Header scroll shadow ----------
  var header = $("#site-header");
  var lastTick = false;
  function onScrollHeader() {
    if (lastTick) return;
    lastTick = true;
    requestAnimationFrame(function () {
      lastTick = false;
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      updateStickyCta();
    });
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  window.addEventListener("resize", onScrollHeader, { passive: true });

  // ---------- Mobile nav drawer (hidden by default; toggled by the hamburger) ----------
  var navToggle = $("#nav-toggle");
  var navClose = $("#nav-close");
  var mobileNav = $("#mobile-nav");
  var mobileBackdrop = $("#mobile-nav-backdrop");
  function openNav() {
    mobileNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    mobileNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (navToggle) navToggle.addEventListener("click", openNav);
  if (navClose) navClose.addEventListener("click", closeNav);
  if (mobileBackdrop) mobileBackdrop.addEventListener("click", closeNav);
  $all(".mobile-nav-panel a").forEach(function (a) { a.addEventListener("click", closeNav); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileNav.classList.contains("is-open")) closeNav();
  });

  // ---------- Countdown ----------
  var cdD = $("#cd-d"), cdH = $("#cd-h"), cdM = $("#cd-m"), cdS = $("#cd-s");
  var cdCells = $("#countdown-cells"), cdEnded = $("#countdown-ended");
  function pad(n) { return String(n).padStart(2, "0"); }
  function tickCountdown() {
    var diff = COUNTDOWN_TARGET - Date.now();
    if (diff <= 0) {
      cdCells.hidden = true;
      cdEnded.hidden = false;
      clearInterval(cdTimer);
      return;
    }
    var sec = Math.floor(diff / 1000);
    cdD.textContent = pad(Math.floor(sec / 86400));
    cdH.textContent = pad(Math.floor((sec % 86400) / 3600));
    cdM.textContent = pad(Math.floor((sec % 3600) / 60));
    cdS.textContent = pad(sec % 60);
  }
  tickCountdown();
  var cdTimer = setInterval(tickCountdown, 1000);

  // ---------- Sticky mobile CTA (shows once user scrolls past hero, on mobile only) ----------
  var stickyCta = $("#sticky-cta");
  function updateStickyCta() {
    if (!stickyCta) return;
    var isMobile = window.innerWidth < 900;
    var pastHero = window.scrollY > window.innerHeight * 0.75;
    var modalOpen = overlay.classList.contains("is-open");
    stickyCta.classList.toggle("is-visible", isMobile && pastHero && !modalOpen);
  }

  // ---------- Lead modal ----------
  var overlay = $("#lead-overlay");
  var modalCard = $("#lead-modal-card");
  var modalClose = $("#modal-close");
  var lastOpener = null;

  function openModal(e) {
    lastOpener = e && e.currentTarget ? e.currentTarget : null;
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    updateStickyCta();
    setTimeout(function () { var el = $("#f-name"); if (el) el.focus(); }, 60);
  }
  function closeModal() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    updateStickyCta();
    if (lastOpener && lastOpener.focus) lastOpener.focus();
  }
  $all(".js-open-modal").forEach(function (btn) { btn.addEventListener("click", openModal); });
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (overlay) overlay.addEventListener("click", function (e) { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", function (e) {
    if (!overlay.classList.contains("is-open")) return;
    if (e.key === "Escape") { e.preventDefault(); closeModal(); return; }
    if (e.key === "Tab") {
      var nodes = $all('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', modalCard)
        .filter(function (el) { return !el.disabled && el.offsetParent !== null; });
      if (!nodes.length) return;
      var first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // ---------- Form: phone mask, validation, WhatsApp handoff ----------
  var form = $("#lead-form");
  var whatsInput = $("#f-whats");
  function maskPhone(v) {
    var d = String(v).replace(/\D/g, "").slice(0, 11);
    var out = "";
    if (d.length > 0) out = "(" + d.slice(0, 2);
    if (d.length >= 2) out += ") ";
    if (d.length > 2) out += d.slice(2, 7);
    if (d.length > 7) out += "-" + d.slice(7, 11);
    return out;
  }
  if (whatsInput) {
    whatsInput.addEventListener("input", function (e) {
      e.target.value = maskPhone(e.target.value);
    });
  }

  function setError(field, msg) {
    var el = $("#err-" + field);
    if (!el) return;
    if (msg) { el.textContent = msg; el.hidden = false; }
    else { el.textContent = ""; el.hidden = true; }
  }

  function validate() {
    var name = $("#f-name").value.trim();
    var email = $("#f-email").value.trim();
    var whats = $("#f-whats").value;
    var occupation = $("#f-occupation").value;
    var err = {};

    if (name.length < 3) err.name = "Informe seu nome completo (mínimo 3 letras).";
    else if (/^\d+$/.test(name) || !/[A-Za-zÀ-ÿ]/.test(name)) err.name = "Digite um nome válido, não apenas números.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = "Digite um e-mail válido, ex.: nome@email.com.";

    var digits = whats.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 11) err.whats = "Informe um WhatsApp válido com DDD.";

    if (!occupation) err.occupation = "Selecione sua ocupação.";

    return { err: err, name: name, email: email, whats: whats, occupation: occupation };
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = validate();
      ["name", "email", "whats", "occupation"].forEach(function (f) { setError(f, v.err[f]); });
      var firstErrKey = ["name", "email", "whats", "occupation"].find(function (k) { return v.err[k]; });
      if (firstErrKey) { var el = $("#f-" + firstErrKey); if (el) el.focus(); return; }

      var msg = "Olá! Meu nome é " + v.name + ". Tenho interesse em garantir uma vaga na próxima turma do Curso de Piloto de Drone Agrícola. Minha ocupação é " + v.occupation + ". Gostaria de receber mais informações.";
      var url = waLink(WHATSAPP_NUMBER, msg);
      var lead = { name: v.name, email: v.email, whatsapp: v.whats, occupation: v.occupation, ts: new Date().toISOString() };
      try { (window.dataLayer = window.dataLayer || []).push({ event: "generate_lead", lead: lead }); } catch (e2) {}
      try { localStorage.setItem("adb_lead", JSON.stringify(lead)); } catch (e3) {}

      $("#form-success").hidden = false;
      setTimeout(function () { window.location.href = url; }, 800);
    });
  }

  // ---------- VTurb video player ----------
  (function mountVturb() {
    var slot = $("#vturb-slot");
    if (!slot) return;
    slot.innerHTML = '<vturb-smartplayer id="vid-69fcdb5fd85776718d9a0869" style="display:block;margin:0 auto;width:100%;max-width:400px"></vturb-smartplayer>';
    var s = document.createElement("script");
    s.src = "https://scripts.converteai.net/12c16187-ebaa-430c-bc3f-9601c00518f4/players/69fcdb5fd85776718d9a0869/v4/player.js";
    s.async = true;
    document.head.appendChild(s);
  })();

  updateStickyCta();
})();
