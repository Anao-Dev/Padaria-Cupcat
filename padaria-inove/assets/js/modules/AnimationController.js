import { prefersReducedMotion } from "./Utils.js";

export class AnimationController {
  constructor(selector) {
    this.elements = Array.from(document.querySelectorAll(selector));
    this.observer = null;
  }

  init() {
    if (prefersReducedMotion()) {
      this.elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    this.observeElements();
  }

  observeElements() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.reveal(entry);
        }
      });
    }, { threshold: 0.16 });

    this.elements.forEach((element) => this.observer.observe(element));
  }

  reveal(entry) {
    entry.target.classList.add("is-visible");
    this.observer?.unobserve(entry.target);
  }

  applyParallax() {
    return null;
  }

  destroy() {
    this.observer?.disconnect();
  }
}
