import { prefersReducedMotion } from "./Utils.js";

export class MotionController {
  constructor() {
    this.reducedMotion = prefersReducedMotion();
    this.progress = document.querySelector("[data-scroll-progress]");
    this.cursorSpotlight = document.querySelector("[data-cursor-spotlight]");
    this.backgroundLayers = Array.from(document.querySelectorAll("[data-background-parallax]"));
    this.parallaxScenes = Array.from(document.querySelectorAll("[data-parallax-scene]"));
    this.parallaxItems = Array.from(document.querySelectorAll("[data-parallax]"));
    this.tiltCards = Array.from(document.querySelectorAll("[data-tilt-card]"));
    this.magneticItems = Array.from(document.querySelectorAll(".button"));
    this.storyDots = Array.from(document.querySelectorAll("[data-story-dot]"));
    this.storySections = this.storyDots
      .map((dot) => document.getElementById(dot.dataset.storyDot))
      .filter(Boolean);
    this.ticking = false;
    this.handleScroll = this.handleScroll.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
  }

  init() {
    this.splitText();
    this.observeText();
    this.updateScrollEffects();

    if (this.reducedMotion) {
      return;
    }

    window.addEventListener("scroll", this.handleScroll, { passive: true });
    window.addEventListener("pointermove", this.handlePointerMove, { passive: true });
    this.bindTiltCards();
    this.bindMagneticItems();
  }

  splitText() {
    document.querySelectorAll("[data-split-text]").forEach((element) => {
      if (element.dataset.splitReady === "true") {
        return;
      }

      const words = element.textContent.trim().split(/\s+/);
      element.textContent = "";
      words.forEach((word, index) => {
        const wrapper = document.createElement("span");
        const inner = document.createElement("span");
        wrapper.className = "word";
        wrapper.style.setProperty("--word-index", index);
        inner.textContent = word;
        wrapper.appendChild(inner);
        element.appendChild(wrapper);
        if (index < words.length - 1) {
          element.appendChild(document.createTextNode(" "));
        }
      });
      element.dataset.splitReady = "true";
    });
  }

  observeText() {
    const items = Array.from(document.querySelectorAll(".kinetic-text"));
    if (!items.length) {
      return;
    }

    if (this.reducedMotion) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.28 });

    items.forEach((item) => observer.observe(item));
  }

  handleScroll() {
    if (this.ticking) {
      return;
    }

    this.ticking = true;
    window.requestAnimationFrame(() => {
      this.updateScrollEffects();
      this.ticking = false;
    });
  }

  updateScrollEffects() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    this.progress?.style.setProperty("transform", `scaleX(${Math.min(progress, 1)})`);
    this.updateParallax();
    this.updateParallaxScenes();
    this.updateBackgroundParallax();
    this.updateStoryMeter();
  }

  updateBackgroundParallax() {
    if (this.reducedMotion) {
      return;
    }

    const scroll = window.scrollY;
    this.backgroundLayers.forEach((layer, index) => {
      const strength = Number(layer.dataset.backgroundParallax || 0);
      const y = scroll * strength;
      const rotate = scroll * strength * 0.006 * (index % 2 === 0 ? 1 : -1);
      layer.style.setProperty("--bg-parallax-y", `${y.toFixed(2)}px`);
      layer.style.setProperty("--bg-parallax-rotate", `${rotate.toFixed(3)}deg`);
    });
  }

  updateParallax() {
    if (this.reducedMotion) {
      return;
    }

    const viewportHeight = window.innerHeight;
    this.parallaxItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const progress = this.clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
      const centeredProgress = progress - 0.5;
      const yStrength = Number(item.dataset.parallax || 0);
      const xStrength = Number(item.dataset.parallaxX || 0);
      const rotateStrength = Number(item.dataset.parallaxRotate || 0);
      const scaleStrength = Number(item.dataset.parallaxScale || 0);

      const y = centeredProgress * yStrength;
      const x = centeredProgress * xStrength;
      const rotate = centeredProgress * rotateStrength;
      const scale = 1 + Math.abs(centeredProgress) * scaleStrength;

      item.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
      item.style.setProperty("--parallax-x", `${x.toFixed(2)}px`);
      item.style.setProperty("--parallax-rotate-current", `${rotate.toFixed(3)}deg`);
      item.style.setProperty("--parallax-scale-current", scale.toFixed(4));
      item.style.setProperty("--parallax-progress", progress.toFixed(3));
    });
  }

  updateParallaxScenes() {
    if (this.reducedMotion) {
      return;
    }

    const viewportHeight = window.innerHeight;
    this.parallaxScenes.forEach((scene) => {
      const rect = scene.getBoundingClientRect();
      const progress = this.clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
      const centeredProgress = progress - 0.5;
      scene.style.setProperty("--scene-progress", progress.toFixed(3));

      scene.querySelectorAll("[data-scene-layer]").forEach((layer) => {
        const yStrength = Number(layer.dataset.sceneY || 0);
        const xStrength = Number(layer.dataset.sceneX || 0);
        const rotateStrength = Number(layer.dataset.sceneRotate || 0);
        const scaleStrength = Number(layer.dataset.sceneScale || 0);
        const y = centeredProgress * yStrength;
        const x = centeredProgress * xStrength;
        const rotate = centeredProgress * rotateStrength;
        const scale = 1 + Math.abs(centeredProgress) * scaleStrength;

        layer.style.setProperty("--scene-y-current", `${y.toFixed(2)}px`);
        layer.style.setProperty("--scene-x-current", `${x.toFixed(2)}px`);
        layer.style.setProperty("--scene-rotate-current", `${rotate.toFixed(3)}deg`);
        layer.style.setProperty("--scene-scale-current", scale.toFixed(4));
      });
    });
  }

  updateStoryMeter() {
    const offset = window.scrollY + window.innerHeight * 0.42;
    const current = this.storySections.findLast((section) => section.offsetTop <= offset);

    this.storyDots.forEach((dot) => {
      dot.classList.toggle("is-active", current?.id === dot.dataset.storyDot);
    });
  }

  handlePointerMove(event) {
    const x = `${event.clientX}px`;
    const y = `${event.clientY}px`;
    this.cursorSpotlight?.style.setProperty("--cursor-x", x);
    this.cursorSpotlight?.style.setProperty("--cursor-y", y);
  }

  bindTiltCards() {
    this.tiltCards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 8;
        const rotateX = (0.5 - y) * 7;
        card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
        card.style.setProperty("--shine-x", `${(x * 100).toFixed(1)}%`);
        card.style.setProperty("--shine-y", `${(y * 100).toFixed(1)}%`);
      }, { passive: true });

      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  bindMagneticItems() {
    this.magneticItems.forEach((item) => {
      item.addEventListener("pointermove", (event) => {
        const rect = item.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.16;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.22;
        item.style.setProperty("--magnet-x", `${x.toFixed(2)}px`);
        item.style.setProperty("--magnet-y", `${y.toFixed(2)}px`);
      }, { passive: true });

      item.addEventListener("pointerleave", () => {
        item.style.setProperty("--magnet-x", "0px");
        item.style.setProperty("--magnet-y", "0px");
      });
    });
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  destroy() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("pointermove", this.handlePointerMove);
  }
}
