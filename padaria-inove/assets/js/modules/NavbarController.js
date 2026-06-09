export class NavbarController {
  constructor(selector) {
    this.header = document.querySelector(selector);
    this.menu = document.querySelector("[data-menu]");
    this.toggle = document.querySelector("[data-menu-toggle]");
    this.links = Array.from(document.querySelectorAll(".nav__links a"));
    this.sections = this.links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);
    this.handleScroll = this.handleScroll.bind(this);
    this.closeOnEscape = this.closeOnEscape.bind(this);
  }

  init() {
    if (!this.header) {
      return;
    }

    this.toggle?.addEventListener("click", () => this.toggleMobileMenu());
    this.links.forEach((link) => link.addEventListener("click", () => this.closeMenu()));
    document.addEventListener("keydown", this.closeOnEscape);
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    this.handleScroll();
  }

  handleScroll() {
    this.header.classList.toggle("is-scrolled", window.scrollY > 12);
    this.setActiveLink();
  }

  toggleMobileMenu() {
    const isOpen = this.menu?.classList.toggle("is-open") ?? false;
    this.toggle?.setAttribute("aria-expanded", String(isOpen));
  }

  closeMenu() {
    this.menu?.classList.remove("is-open");
    this.toggle?.setAttribute("aria-expanded", "false");
  }

  setActiveLink() {
    const offset = window.scrollY + 160;
    const current = this.sections.findLast((section) => section.offsetTop <= offset);

    this.links.forEach((link) => {
      const isActive = current && link.getAttribute("href") === `#${current.id}`;
      link.classList.toggle("is-active", Boolean(isActive));
    });
  }

  closeOnEscape(event) {
    if (event.key === "Escape") {
      this.closeMenu();
    }
  }

  destroy() {
    document.removeEventListener("keydown", this.closeOnEscape);
    window.removeEventListener("scroll", this.handleScroll);
  }
}
