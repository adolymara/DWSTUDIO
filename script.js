/* ==========================================================
   DW STUDIO — SCRIPT

   THE ONLY PART YOU MAY WANT TO EDIT IS THE "SETTINGS" BLOCK
   JUST BELOW. Everything else works by itself.
   ========================================================== */

/* ---------- SETTINGS (edit here) ---------- */
const CONFIG = {
  // These are NOT shown on the website. They are only used
  // when someone clicks "Send by email" or "DM on WhatsApp".
  email:        "mohamed.wejni11@gmail.com",   // where messages are sent
  whatsapp:     "21620638627",                 // WhatsApp number: country code + number, no + and no spaces

  // Add your links between the quotes. Leave "" to hide a button.
  instagram: "",
  behance:   "",
  linkedin:  ""
};

/* ---------- YOUR WORK (the 3D carousel) ----------
   To add a new sheet:
   1) put the image in the "images" folder
   2) copy one block below, paste it, and change the 4 lines  */
const WORKS = [
  {
    tag:   "Ideas into Identities",
    title: "Logo Design",
    desc:  "Monograms, emblems and wordmarks — Newly Partner, GFL, L’Bankeji and more.",
    src:   "images/LOGO_DESIGN7.jpg"
  },
  {
    tag:   "Newly Partner",
    title: "Branding",
    desc:  "A complete brand identity: logo versions, colors, typography and brand guidelines.",
    src:   "images/BRANDING4.jpg"
  },
  {
    tag:   "Menus · Posters · Invoices",
    title: "Print Media",
    desc:  "Menus, posters and business documents designed to look sharp on paper and on the wall.",
    src:   "images/PRINT_MEDIA6.jpg"
  },
  {
    tag:   "Ads",
    title: "Social Media",
    desc:  "Scroll-stopping posts and ads for brands in tech, food, gaming and construction.",
    src:   "images/SOCIAL_MEDIA5.jpg"
  }
];
/* ================== END OF SETTINGS ================== */


(() => {
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;

  /* ---------- Social links (email and phone stay hidden) ---------- */
  const socials = $("#socials");
  [["Instagram", CONFIG.instagram], ["Behance", CONFIG.behance], ["LinkedIn", CONFIG.linkedin]]
    .forEach(([name, url]) => {
      if (!url) return;
      const a = document.createElement("a");
      a.href = url; a.target = "_blank"; a.rel = "noopener"; a.textContent = name;
      socials.appendChild(a);
    });

  $("#year").textContent = new Date().getFullYear();

  /* ---------- Opening animation ---------- */
  const loader = $("#loader");
  function finishLoading() {
    loader.classList.add("done");
    body.classList.remove("loading");
    body.classList.add("ready");
    setTimeout(() => loader.remove(), 1400);
  }
  if (reduce) {
    finishLoading();
  } else {
    const count = $("#count"), bar = $("#lbar"), t0 = performance.now(), dur = 1700;
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      count.textContent = String(Math.round(p * 100)).padStart(3, "0");
      bar.style.transform = `scaleX(${p})`;
      p < 1 ? requestAnimationFrame(tick) : setTimeout(finishLoading, 250);
    })(t0);
  }

  /* ---------- Scroll progress bar ---------- */
  const progress = $("#progress");
  const toTop = $("#toTop"), toTopBar = $("#toTopBar"), RING = 2 * Math.PI * 47;
  toTopBar.style.strokeDasharray = RING;
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    progress.style.transform = `scaleX(${p})`;
    toTopBar.style.strokeDashoffset = RING * (1 - p);
    toTop.classList.toggle("show", scrollY > innerHeight * 0.7);
  }
  toTop.addEventListener("pointermove", e => {
    if (e.pointerType === "touch") return;
    const r = toTop.getBoundingClientRect();
    toTop.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.28}px ${(e.clientY - r.top - r.height / 2) * 0.28}px`;
  });
  toTop.addEventListener("pointerleave", () => { toTop.style.translate = ""; });
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Page transition when clicking menu links ---------- */
  const wipe = $("#wipe");
  let moving = false;
  function jumpTo(target) {
    const y = target.getBoundingClientRect().top + scrollY;
    try { window.scrollTo({ top: y, behavior: "instant" }); } catch (e) { window.scrollTo(0, y); }
  }
  $$("[data-go]").forEach(link => {
    link.addEventListener("click", e => {
      const target = $(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      if (moving) return;
      if (reduce) { jumpTo(target); return; }
      moving = true;
      wipe.className = "wipe in";
      setTimeout(() => {
        jumpTo(target);
        wipe.className = "wipe out";
        setTimeout(() => {
          wipe.className = "wipe reset";
          setTimeout(() => { wipe.className = "wipe"; moving = false; }, 60);
        }, 700);
      }, 700);
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.2 });
  $$(".reveal, .fstrip").forEach(el => io.observe(el));

  /* ---------- Dark / Light switch ---------- */
  const root = document.documentElement, toggle = $("#themeToggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  function paintTheme(t) {
    root.setAttribute("data-theme", t);
    toggle.setAttribute("aria-pressed", String(t === "dark"));
    if (themeMeta) themeMeta.setAttribute("content", t === "dark" ? "#0b0b0b" : "#e4dcbb");
    try { localStorage.setItem("dw-theme", t); } catch (e) {}
  }
  paintTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");
  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    const b = toggle.getBoundingClientRect();
    const x = b.left + b.width / 2, y = b.top + b.height / 2;
    if (document.startViewTransition && !reduce) {
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const vt = document.startViewTransition(() => paintTheme(next));
      vt.ready.then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 800, easing: "cubic-bezier(.77,0,.18,1)", pseudoElement: "::view-transition-new(root)" }
        );
      });
    } else {
      root.classList.add("theme-fade");
      paintTheme(next);
      setTimeout(() => root.classList.remove("theme-fade"), 700);
    }
  });

  /* ---------- Footer strip: letters, 3D tilt ---------- */
  $$("[data-split]").forEach(el => {
    let i = 0;
    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts.map(line =>
      [...line].map(chr => chr === " "
        ? " "
        : `<span class="ch" style="--i:${i++}">${chr}</span>`).join("")
    ).join("<br>");
  });
  const fstrip = $("#fstrip"), fsTilt = $("#fsTilt");
  new IntersectionObserver((en, ob) => {
    if (en[0].isIntersecting) { setTimeout(() => fstrip.classList.add("done"), 4200); ob.disconnect(); }
  }, { threshold: 0.3 }).observe(fstrip);
  fstrip.addEventListener("pointermove", e => {
    if (e.pointerType === "touch") return;
    const r = fstrip.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    fsTilt.style.transform = `rotateX(${-y * 12}deg) rotateY(${x * 16}deg)`;
    fstrip.style.setProperty("--mx", (e.clientX - r.left) + "px");
    fstrip.style.setProperty("--my", (e.clientY - r.top) + "px");
  });
  fstrip.addEventListener("pointerleave", () => { fsTilt.style.transform = ""; });

  /* ---------- 3D tilt: hero stack ---------- */
  const scene = $("#scene"), stack = $("#stack");
  scene.addEventListener("pointermove", e => {
    if (e.pointerType === "touch") return;
    const r = scene.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    stack.style.transform = `rotateX(${10 - y * 22}deg) rotateY(${-18 + x * 34}deg)`;
  });
  scene.addEventListener("pointerleave", () => { stack.style.transform = ""; });

  /* ---------- 3D tilt: image cards ---------- */
  $$("[data-tilt]").forEach(el => {
    el.addEventListener("pointermove", e => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.02)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });

  /* ---------- 3D carousel ---------- */
  const car = $("#carousel"), ring = $("#ring"), dotsBox = $("#dots");
  const capTag = $("#capTag"), capTitle = $("#capTitle"), capDesc = $("#capDesc");
  const n = WORKS.length, step = 360 / n;
  let idx = 0, rot = 0, radius = 0, dragging = false, moved = 0, sx = 0, sr = 0, paused = false;

  WORKS.forEach((w, i) => {
    const f = document.createElement("figure");
    f.className = "panel";
    f.innerHTML = `<img src="${w.src}" alt="${w.title}" draggable="false">`;
    ring.appendChild(f);
    const d = document.createElement("button");
    d.setAttribute("aria-label", w.title);
    d.addEventListener("click", () => go(i));
    dotsBox.appendChild(d);
  });
  const panels = $$(".panel", ring), dots = $$("button", dotsBox);

  function layout() {
    const pw = panels[0].offsetWidth;
    radius = Math.round((pw / 2) / Math.tan(Math.PI / n) * 1.12);
    panels.forEach((p, i) => { p.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`; });
    apply();
  }
  function apply() { ring.style.transform = `translateZ(${-radius}px) rotateY(${rot}deg)`; }
  function current() { return ((idx % n) + n) % n; }
  function go(i) {
    idx = i; rot = -i * step;
    ring.classList.remove("drag");
    apply(); update();
  }
  function update() {
    const k = current(), w = WORKS[k];
    panels.forEach((p, i) => p.classList.toggle("active", i === k));
    dots.forEach((d, i) => d.classList.toggle("on", i === k));
    capTag.textContent = w.tag; capTitle.textContent = w.title; capDesc.textContent = w.desc;
  }

  $("#prev").addEventListener("click", () => go(idx - 1));
  $("#next").addEventListener("click", () => go(idx + 1));
  document.addEventListener("keydown", e => {
    if (lb.classList.contains("open")) return;
    if (e.key === "ArrowLeft") go(idx - 1);
    if (e.key === "ArrowRight") go(idx + 1);
  });

  car.addEventListener("pointerdown", e => {
    dragging = true; moved = 0; sx = e.clientX; sr = rot;
    ring.classList.add("drag");
  });
  addEventListener("pointermove", e => {
    if (!dragging) return;
    const dx = e.clientX - sx;
    moved = Math.max(moved, Math.abs(dx));
    rot = sr + dx * 0.25;
    apply();
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    go(Math.round(-rot / step));
  }
  addEventListener("pointerup", endDrag);
  addEventListener("pointercancel", endDrag);

  car.addEventListener("click", () => { if (moved < 6) openLB(current()); });
  $("#capOpen").addEventListener("click", () => openLB(current()));

  car.addEventListener("pointerenter", () => { paused = true; });
  car.addEventListener("pointerleave", () => { paused = false; });
  if (!reduce) {
    setInterval(() => {
      if (!paused && !dragging && !lb.classList.contains("open") && document.hidden === false) {
        const r = car.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) go(idx + 1);
      }
    }, 5000);
  }
  addEventListener("resize", layout);

  /* ---------- Full sheet viewer ---------- */
  var lb = $("#lightbox");
  const lbImg = $("#lbImg"), lbCap = $("#lbCap");
  function openLB(i) {
    lbImg.src = WORKS[i].src; lbImg.alt = WORKS[i].title; lbCap.textContent = WORKS[i].title;
    lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); body.classList.add("lock");
  }
  function closeLB() {
    lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); body.classList.remove("lock");
  }
  $("#lbClose").addEventListener("click", closeLB);
  lb.addEventListener("click", e => { if (e.target === lb) closeLB(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLB(); });

  layout();
  update();
  addEventListener("load", layout);

  /* ---------- Collab form ---------- */
  const form = $("#collabForm"), note = $("#formNote");
  function readForm() {
    const name = $("#fname").value.trim();
    const email = $("#femail").value.trim();
    const type = $("#ftype").value;
    const msg = $("#fmsg").value.trim();
    if (!name || !msg) { note.textContent = "Please add your name and a short message."; return null; }
    note.textContent = "";
    const text =
      `Hi Dali, I'm ${name}.\n` +
      `I'd like to collaborate on: ${type}.\n\n` +
      `${msg}` + (email ? `\n\nMy email: ${email}` : "");
    return { type, text };
  }
  $("#sendMail").addEventListener("click", () => {
    const d = readForm(); if (!d) return;
    location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Collab request — " + d.type)}&body=${encodeURIComponent(d.text)}`;
    note.textContent = "Your email app should open with the message ready to send.";
  });
  $("#sendWa").addEventListener("click", () => {
    const d = readForm(); if (!d) return;
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(d.text)}`, "_blank", "noopener");
    note.textContent = "WhatsApp is opening with the message ready to send.";
  });
  form.addEventListener("submit", e => e.preventDefault());
})();
