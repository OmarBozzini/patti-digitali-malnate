/* Patti Digitali Malnate — menu mobile e contenuti letti da data/*.json */
(function () {
  "use strict";

  /* ----- Menu su smartphone ----- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  if (nav && toggle) {
    var label = toggle.querySelector(".nav__toggle-label");
    var setOpen = function (open) {
      nav.setAttribute("data-open", open ? "true" : "false");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (label) label.textContent = open ? "Chiudi" : "Menu";
    };
    toggle.addEventListener("click", function () {
      setOpen(nav.getAttribute("data-open") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.getAttribute("data-open") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ----- Utilità ----- */
  var SVGNS = "http://www.w3.org/2000/svg";
  var ICONS = {
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>'
  };

  function icon(name, small) {
    var s = document.createElementNS(SVGNS, "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("class", "icon" + (small ? " icon--s" : ""));
    s.setAttribute("aria-hidden", "true");
    s.innerHTML = ICONS[name] || "";
    return s;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function load(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(url + " " + r.status);
      return r.json();
    });
  }

  function fail(node, what) {
    node.textContent = "";
    var box = el("div", "empty");
    box.appendChild(icon("mail"));
    var p = el("p");
    p.appendChild(document.createTextNode("Non riesco a caricare " + what + ". Riprova tra poco oppure scrivici a "));
    var a = el("a", null, "pattidigitalimalnate@gmail.com");
    a.href = "mailto:pattidigitalimalnate@gmail.com";
    p.appendChild(a);
    p.appendChild(document.createTextNode("."));
    box.appendChild(p);
    node.appendChild(box);
  }

  function formatDate(iso, ora) {
    var d = new Date(iso + "T12:00:00");
    if (isNaN(d)) return null;
    var s = new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long" }).format(d);
    return ora ? s + ", ore " + ora : s;
  }

  function statusPill(stato) {
    if (stato === "Svolto") return el("span", "pill pill--done", "Svolto");
    if (stato === "Confermato") return el("span", "pill pill--ok", "Confermato");
    if (stato === "In preparazione") return el("span", "pill pill--status", "In preparazione");
    return null; /* "Da organizzare": non mostriamo nulla */
  }

  /* ----- Calendario compatto (home) ----- */
  function renderAgenda(root, incontri) {
    root.textContent = "";
    incontri.forEach(function (e) {
      var li = el("li", "agenda__row" + (e.stato === "Svolto" ? " is-done" : ""));
      li.appendChild(el("span", "agenda__month", e.mese));
      li.appendChild(el("span", "agenda__title", e.titolo));
      li.appendChild(el("span", "agenda__format", e.formato));
      root.appendChild(li);
    });
  }

  /* ----- Calendario completo ----- */
  function renderTimeline(root, incontri) {
    root.textContent = "";
    var nextId = null;
    incontri.some(function (e) {
      if (e.stato !== "Svolto") { nextId = e.id; return true; }
      return false;
    });

    incontri.forEach(function (e) {
      var done = e.stato === "Svolto";
      var li = el("li", "event" + (done ? " is-done" : "") + (e.id === nextId ? " is-next" : ""));

      var head = el("div", "event__when");
      var m = el("span", "event__month", e.mese);
      m.appendChild(el("span", "event__year", String(e.anno)));
      head.appendChild(m);
      li.appendChild(head);

      var card = el("div", "event__card");
      var pills = el("div", "event__pills");
      if (e.id === nextId) pills.appendChild(el("span", "pill pill--next", "Prossimo"));
      pills.appendChild(el("span", "pill", e.formato));
      var sp = statusPill(e.stato);
      if (sp) pills.appendChild(sp);
      card.appendChild(pills);
      card.appendChild(el("h3", null, e.titolo));

      var meta = el("ul", "meta");
      var when = e.data ? formatDate(e.data, e.ora) : null;
      var row = el("li");
      row.appendChild(icon("calendar", true));
      row.appendChild(el("span", null, when || "Data in arrivo"));
      meta.appendChild(row);
      if (e.luogo) {
        var l = el("li");
        l.appendChild(icon("pin", true));
        l.appendChild(el("span", null, e.luogo));
        meta.appendChild(l);
      }
      if (e.con) {
        var c = el("li");
        c.appendChild(icon("user", true));
        c.appendChild(el("span", null, e.con));
        meta.appendChild(c);
      }
      card.appendChild(meta);

      if (e.descrizione) card.appendChild(el("p", null, e.descrizione));

      var actions = el("div", "btn-row");
      if (e.iscrizione) {
        var a = el("a", "btn btn--primary", e.formato === "Newsletter" ? "Iscriviti alla newsletter" : "Iscriviti");
        a.href = e.iscrizione;
        if (/^https?:/.test(e.iscrizione)) {
          a.target = "_blank";
          a.rel = "noopener";
        }
        actions.appendChild(a);
      }
      (e.materiali || []).forEach(function (mt) {
        var b = el("a", "btn btn--ghost", mt.titolo);
        b.href = mt.url;
        b.target = "_blank";
        b.rel = "noopener";
        actions.appendChild(b);
      });
      if (actions.childNodes.length) card.appendChild(actions);

      li.appendChild(card);
      root.appendChild(li);
    });
  }

  /* ----- Archivio newsletter ----- */
  function renderNewsletter(root, numeri) {
    root.textContent = "";
    if (!numeri.length) {
      var box = el("div", "empty");
      box.appendChild(icon("mail"));
      box.appendChild(el("p", null, "I numeri della newsletter compariranno qui, a partire da dicembre."));
      root.appendChild(box);
      return;
    }
    var ul = el("ul", "link-list");
    numeri.forEach(function (n) {
      var li = el("li");
      var a = el("a", null, n.titolo);
      a.href = n.url;
      a.target = "_blank";
      a.rel = "noopener";
      li.appendChild(a);
      var s = el("span", null, [n.data ? formatDate(n.data) : "", n.descrizione || ""].filter(Boolean).join(" — "));
      li.appendChild(s);
      ul.appendChild(li);
    });
    root.appendChild(ul);
  }

  var agenda = document.querySelector("[data-agenda]");
  var timeline = document.querySelector("[data-timeline]");
  if (agenda || timeline) {
    load("data/eventi.json")
      .then(function (data) {
        if (agenda) renderAgenda(agenda, data.incontri);
        if (timeline) renderTimeline(timeline, data.incontri);
      })
      .catch(function () {
        if (agenda) fail(agenda, "il calendario");
        if (timeline) fail(timeline, "il calendario");
      });
  }

  var news = document.querySelector("[data-newsletter]");
  if (news) {
    load("data/newsletter.json")
      .then(function (data) { renderNewsletter(news, data.numeri || []); })
      .catch(function () { fail(news, "l’archivio"); });
  }
})();
