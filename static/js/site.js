/* FitForge site motion. Lenis + GSAP share one ticker; three curves (expo-out reveals, quart-out UI, linear scrub).
   Everything is visible without JS or with reduced motion: CSS only hides start states under
   (prefers-reduced-motion: no-preference) and html.js. */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EXPO = "expo.out";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Fail-safe: if the motion libraries never arrive, show everything.
  const reveal = () => { document.documentElement.classList.remove("js"); };
  const failSafe = setTimeout(reveal, 3000);

  /* ── Header: solid after the hero top ─────────────────────── */
  const header = $("#site-header");
  const onScroll = () => header && header.classList.toggle("is-solid", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ──────────────────────────────────────────── */
  const toggle = $("#menu-toggle"), menu = $("#mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      $("[data-open]", toggle).classList.toggle("hidden", open);
      $("[data-close]", toggle).classList.toggle("hidden", !open);
      if (open) header.classList.add("is-solid"); else onScroll();
    });
  }

  /* ── Hero footage: crossfade slides, tabs fill while a clip plays ── */
  const hero = $("[data-hero]");
  if (hero) {
    const slides = $$("[data-hero-slide]", hero);
    const tabs = $$("[data-hero-tab]", hero);
    const tall = () => innerHeight > innerWidth;
    const DURATION = 7000;
    let i = 0, timer = null, started = 0, raf = 0;
    const video = (s) => $("video", s);
    const load = (s) => {
      const v = video(s);
      if (!v) return null;
      const src = tall() ? v.dataset.tall : v.dataset.wide;
      if (src && v.dataset.loaded !== src) { v.src = src; v.dataset.loaded = src; }
      return v;
    };
    const fill = () => {
      const t = Math.min(1, (performance.now() - started) / DURATION);
      const bar = tabs[i] && $(".bar i", tabs[i]);
      if (bar) bar.style.transform = `scaleX(${t})`;
      raf = requestAnimationFrame(fill);
    };
    const show = (n) => {
      slides.forEach((s, k) => {
        s.classList.toggle("is-on", k === n);
        const v = video(s);
        if (v && k !== n) v.pause();
      });
      tabs.forEach((t, k) => {
        t.setAttribute("aria-selected", String(k === n));
        const bar = $(".bar i", t);
        if (bar) bar.style.transform = k < n ? "scaleX(1)" : "scaleX(0)";
      });
      i = n;
      if (reduce) return; // stills only: no autoplay footage when motion is reduced
      const v = load(slides[n]);
      if (v) { v.currentTime = 0; v.play().catch(() => {}); }
      // warm the next clip
      if (slides[n + 1]) load(slides[n + 1]);
      started = performance.now();
      clearTimeout(timer);
      if (slides.length > 1) timer = setTimeout(() => show((i + 1) % slides.length), DURATION);
    };
    tabs.forEach((t, k) => t.addEventListener("click", () => show(k)));
    if (slides.length) show(0);
    if (!reduce && tabs.length) raf = requestAnimationFrame(fill);
    // pause footage when the hero is off screen
    new IntersectionObserver(([e]) => {
      const v = video(slides[i] || hero);
      if (!v || reduce) return;
      e.isIntersecting ? v.play().catch(() => {}) : v.pause();
    }).observe(hero);
  }

  /* ── Motion libraries ─────────────────────────────────────── */
  const boot = () => {
    if (!window.gsap || !window.ScrollTrigger) return reveal();
    clearTimeout(failSafe);
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    if (reduce) { reveal(); return; }

    // Lenis on the GSAP ticker: one clock for smooth scroll and scroll-linked motion.
    if (window.Lenis) {
      const lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 0.9 }); // house feel (vale); touch stays native
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
        const el = $(a.getAttribute("href"));
        if (el) { e.preventDefault(); lenis.resize(); lenis.scrollTo(el, { offset: -80 }); }
      }));
    }

    // Hero arrival: lines rise out of their masks, then copy and controls. Settled in ~1.1 s.
    const lines = $$(".hero-in .line > span");
    if (lines.length) {
      gsap.to(lines, { yPercent: 0, y: 0, duration: 1.05, ease: EXPO, stagger: 0.09, startAt: { yPercent: 105 } });
      gsap.to(".hero-fade", { opacity: 1, duration: 0.8, ease: "power4.out", stagger: 0.08, delay: 0.35 });
      gsap.fromTo("[data-hero-media]", { scale: 1.08 }, { scale: 1, duration: 1.6, ease: EXPO });
      // Scroll: footage drifts and dims, copy lifts away.
      gsap.to("[data-hero-media]", { yPercent: 12, ease: "none", scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true } });
      gsap.to("[data-hero-copy]", { y: -60, opacity: 0.2, ease: "none", scrollTrigger: { trigger: "[data-hero]", start: "center center", end: "bottom top", scrub: true } });
    }

    // Page-header pictures drift a little.
    $$("[data-drift]").forEach((el) => gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } }));

    // Choreographed entrances: fire once at ~88% down the viewport, staggered per batch.
    ScrollTrigger.batch(".rv", {
      start: "top 88%",
      once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.95, ease: EXPO, stagger: 0.07, overwrite: true }),
    });

    /* Scroll picks where a fill should be; it gets there at its own speed (never faster than `rate` per second,
       a far jump squeezed into 1.8 s), so a fast wheel or thumb flick can't rush it (playbooks/scroll-feel.md). */
    const pacedFill = (st, render, rate) => {
      let target = 0, v = 0, shown = -1;
      ScrollTrigger.create(Object.assign({}, st, { onUpdate: (s) => { target = s.progress; } }));
      gsap.ticker.add(() => {
        const dt = Math.min(0.05, gsap.ticker.deltaRatio(60) / 60), d = target - v, ad = Math.abs(d);
        if (ad < 1e-4) v = target;
        else v += Math.sign(d) * Math.min(ad * (1 - Math.exp(-8 * dt)), Math.max(rate * (d < 0 ? 2 : 1), ad / 1.8) * dt);
        if (Math.abs(v - shown) > 1e-4) { shown = v; render(v); }
      });
    };

    // Statement fills word by word as you scroll (paced).
    $$("[data-fill]").forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
      el.setAttribute("aria-label", words.join(" "));
      const spans = $$(".w", el);
      spans.forEach((s) => s.setAttribute("aria-hidden", "true"));
      pacedFill({ trigger: el, start: "top 80%", end: "bottom 45%" }, (v) => {
        const p = v * spans.length;
        spans.forEach((s, k) => s.style.setProperty("--o", String(0.18 + 0.82 * Math.min(1, Math.max(0, p - k)))));
      }, 0.7);
      spans.forEach((s) => s.style.setProperty("--o", "0.18"));
    });

    // Counters tick up once.
    $$("[data-count]").forEach((el) => {
      const end = +el.dataset.count, fmt = new Intl.NumberFormat("en-IN");
      const o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.6, ease: "power4.out", delay: 0.5, onUpdate: () => { el.textContent = fmt.format(Math.round(o.v)) + "+"; } });
    });
  };

  boot(); // deferred scripts run in order, so GSAP/Lenis are already here (or failed to load)
})();
