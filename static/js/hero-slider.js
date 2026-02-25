document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("[data-hero-slider]");
  if (!container) return;

  const slides = Array.from(container.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(container.querySelectorAll("[data-hero-dot]"));

  if (!slides.length) return;

  let index = 0;
  let timer;

  function setActive(newIndex) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("opacity-100", i === newIndex);
      slide.classList.toggle("opacity-0", i !== newIndex);
      slide.classList.toggle("pointer-events-auto", i === newIndex);
      slide.classList.toggle("pointer-events-none", i !== newIndex);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("bg-primary-500", i === newIndex);
      dot.classList.toggle("bg-slate-500", i !== newIndex);
    });
    index = newIndex;
  }

  function next() {
    setActive((index + 1) % slides.length);
  }

  function start() {
    timer = window.setInterval(next, 6500);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = undefined;
    }
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      stop();
      setActive(i);
      start();
    });
  });

  container.addEventListener("mouseenter", stop);
  container.addEventListener("mouseleave", start);

  setActive(0);
  start();
});

