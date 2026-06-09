import { getFocusableElements } from "./Utils.js";

export class Lightbox {
  constructor(gallerySelector, lightboxSelector) {
    this.gallery = document.querySelector(gallerySelector);
    this.lightbox = document.querySelector(lightboxSelector);
    this.image = this.lightbox?.querySelector("[data-lightbox-image]");
    this.closeButton = this.lightbox?.querySelector("[data-lightbox-close]");
    this.prevButton = this.lightbox?.querySelector("[data-lightbox-prev]");
    this.nextButton = this.lightbox?.querySelector("[data-lightbox-next]");
    this.items = [];
    this.currentIndex = 0;
    this.handleKeyboard = this.handleKeyboard.bind(this);
  }

  init() {
    if (!this.gallery || !this.lightbox || !this.image) {
      return;
    }

    this.items = Array.from(this.gallery.querySelectorAll("[data-lightbox-index]"));
    this.gallery.addEventListener("click", (event) => {
      const item = event.target.closest("[data-lightbox-index]");
      if (item) {
        this.open(Number(item.dataset.lightboxIndex));
      }
    });
    this.closeButton?.addEventListener("click", () => this.close());
    this.prevButton?.addEventListener("click", () => this.prev());
    this.nextButton?.addEventListener("click", () => this.next());
  }

  open(index) {
    this.currentIndex = index;
    this.render();
    this.lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", this.handleKeyboard);
    this.closeButton?.focus();
  }

  close() {
    this.lightbox.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", this.handleKeyboard);
    this.items[this.currentIndex]?.focus();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.render();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.render();
  }

  trapFocus(event) {
    if (event.key !== "Tab") {
      return;
    }

    const focusable = getFocusableElements(this.lightbox);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  handleKeyboard(event) {
    if (event.key === "Escape") {
      this.close();
    }
    if (event.key === "ArrowRight") {
      this.next();
    }
    if (event.key === "ArrowLeft") {
      this.prev();
    }
    this.trapFocus(event);
  }

  render() {
    const source = this.items[this.currentIndex]?.querySelector("img");
    if (!source || !this.image) {
      return;
    }

    this.image.src = source.currentSrc || source.src;
    this.image.alt = source.alt;
  }
}
