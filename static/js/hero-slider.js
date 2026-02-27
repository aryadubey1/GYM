document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("[data-hero-slider]");
  if (!container) return;

  const slides = Array.from(container.querySelectorAll("[data-hero-slide]"));
  const dots   = Array.from(container.querySelectorAll("[data-hero-dot]"));

  if (!slides.length) return;

  const IMAGE_INTERVAL = 3000; // 3 seconds for image slides
  let index = 0;
  let timer;

  /* ── Card spotlight effect ────────────────────────────────── */
  document.querySelectorAll(".card-hover").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", x + "%");
      card.style.setProperty("--mouse-y", y + "%");
    });
  });

  /* ── Video helpers ────────────────────────────────────────── */
  function getVideo(slide) {
    return slide.querySelector("[data-hero-video]");
  }

  function pauseAllVideos() {
    slides.forEach((slide) => {
      const v = getVideo(slide);
      if (v) { v.pause(); v.currentTime = 0; }
    });
  }

  function playSlideVideo(slide) {
    const v = getVideo(slide);
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  }

  /* ── Activate a slide ─────────────────────────────────────── */
  function setActive(newIndex) {
    pauseAllVideos();

    slides.forEach((slide, i) => {
      slide.classList.toggle("opacity-100",        i === newIndex);
      slide.classList.toggle("opacity-0",          i !== newIndex);
      slide.classList.toggle("pointer-events-auto",  i === newIndex);
      slide.classList.toggle("pointer-events-none",  i !== newIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("hero-dot-active", i === newIndex);
      dot.classList.toggle("bg-slate-600",    i !== newIndex);
    });

    index = newIndex;
    playSlideVideo(slides[newIndex]);
  }

  /* ── Auto-advance ─────────────────────────────────────────── */
  function intervalForSlide(slide) {
    const v = getVideo(slide);
    if (!v) return IMAGE_INTERVAL;
    const dur = v.duration;
    return isFinite(dur) && dur > 0 ? dur * 1000 : IMAGE_INTERVAL;
  }

  function scheduleNext() {
    stop();
    const slide = slides[index];
    const video = getVideo(slide);

    function doSchedule() {
      const ms = intervalForSlide(slide);
      timer = window.setTimeout(() => {
        setActive((index + 1) % slides.length);
        scheduleNext();
      }, ms);
    }

    if (video && !isFinite(video.duration)) {
      video.addEventListener("loadedmetadata", doSchedule, { once: true });
    } else {
      doSchedule();
    }
  }

  function stop() {
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timer = undefined;
    }
  }

  /* ── Dot click ────────────────────────────────────────────── */
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      stop();
      setActive(i);
      scheduleNext();
    });
  });

  /* ── Pause on hover ───────────────────────────────────────── */
  const sliderCard = container.querySelector("[data-slider-card]");
  if (sliderCard) {
    sliderCard.addEventListener("mouseenter", stop);
    sliderCard.addEventListener("mouseleave", scheduleNext);
  }

  /* ── Counter animation ────────────────────────────────────── */
  const counters = document.querySelectorAll("[data-counter]");
  if (counters.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((el) => observer.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.counter, 10);
    const duration = 1800;
    const start = performance.now();
    const suffix = el.dataset.suffix || "";

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ── Boot ─────────────────────────────────────────────────── */
  setActive(0);
  scheduleNext();
});