/**
 * Illustration helpers for decision HTML (requires anime.js global `anime`).
 * Use for charts / flow demos only — never decorate body copy.
 *
 * Markup:
 *   <figure data-ss-animate="bars">… <rect data-ss-bar data-ss-to="280">
 *   <ol data-ss-animate="steps">… <li data-ss-step>
 *   <div data-ss-animate="pulse">…
 */
(() => {
  const reduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function hasAnime() {
    return typeof window.anime === "function";
  }

  function barTarget(el) {
    return Number(el.getAttribute("data-ss-to") || "0");
  }

  function finalizeBars(root) {
    root.querySelectorAll("[data-ss-bar]").forEach((bar) => {
      const to = barTarget(bar);
      if (bar.tagName.toLowerCase() === "rect") {
        bar.setAttribute("width", String(to));
      } else {
        bar.style.width = `${to}px`;
      }
    });
  }

  function animateBars(root) {
    const bars = Array.from(root.querySelectorAll("[data-ss-bar]"));
    if (!bars.length) {
      return;
    }
    if (reduced || !hasAnime()) {
      finalizeBars(root);
      return;
    }

    const svgBars = bars.filter((bar) => bar.tagName.toLowerCase() === "rect");
    const htmlBars = bars.filter((bar) => bar.tagName.toLowerCase() !== "rect");

    svgBars.forEach((bar) => bar.setAttribute("width", "0"));
    htmlBars.forEach((bar) => {
      bar.style.width = "0px";
    });

    if (svgBars.length) {
      window.anime({
        targets: svgBars,
        width: (_el, i) => barTarget(svgBars[i]),
        duration: 900,
        delay: window.anime.stagger(90, { start: 120 }),
        easing: "easeOutCubic",
      });
    }
    if (htmlBars.length) {
      window.anime({
        targets: htmlBars,
        width: (_el, i) => `${barTarget(htmlBars[i])}px`,
        duration: 900,
        delay: window.anime.stagger(90, { start: 120 }),
        easing: "easeOutCubic",
      });
    }
  }

  function animateSteps(root) {
    const steps = root.querySelectorAll("[data-ss-step]");
    if (!steps.length) {
      return;
    }
    if (reduced || !hasAnime()) {
      steps.forEach((step) => {
        step.style.opacity = "1";
        step.style.transform = "none";
      });
      return;
    }
    steps.forEach((step) => {
      step.style.opacity = "0";
      step.style.transform = "translateY(10px)";
    });
    window.anime({
      targets: steps,
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 520,
      delay: window.anime.stagger(110, { start: 80 }),
      easing: "easeOutQuad",
    });
  }

  function animatePulse(root) {
    if (reduced || !hasAnime()) {
      return;
    }
    window.anime({
      targets: root,
      scale: [1, 1.015],
      direction: "alternate",
      loop: 2,
      duration: 700,
      easing: "easeInOutSine",
    });
  }

  const handlers = {
    bars: animateBars,
    steps: animateSteps,
    pulse: animatePulse,
  };

  function play(node) {
    if (!(node instanceof Element)) {
      return;
    }
    const kind = node.getAttribute("data-ss-animate") || "";
    const handler = handlers[kind];
    if (handler) {
      handler(node);
    }
  }

  function mount(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-ss-animate]").forEach((node) => {
      if (node.dataset.ssAnimated === "1") {
        return;
      }
      const run = () => {
        if (node.dataset.ssAnimated === "1") {
          return;
        }
        node.dataset.ssAnimated = "1";
        play(node);
      };

      if (!("IntersectionObserver" in window)) {
        run();
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }
            run();
            observer.disconnect();
          });
        },
        { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
      );
      observer.observe(node);
    });
  }

  window.SimpleSkillsAnimate = {
    mount,
    play,
    reducedMotion: reduced,
  };

  ready(() => mount(document));
})();
