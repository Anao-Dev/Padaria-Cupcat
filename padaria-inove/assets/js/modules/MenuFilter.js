export class MenuFilter {
  constructor(filterSelector, gridSelector) {
    this.group = document.querySelector(filterSelector);
    this.grid = document.querySelector(gridSelector);
    this.buttons = [];
    this.cards = [];
    this.activeCategory = "todos";
  }

  init() {
    if (!this.group || !this.grid) {
      return;
    }

    this.buttons = Array.from(this.group.querySelectorAll("[data-filter]"));
    this.cards = Array.from(this.grid.querySelectorAll("[data-category]"));
    this.group.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (button) {
        this.setFilter(button.dataset.filter);
      }
    });
  }

  setFilter(category) {
    this.activeCategory = category || "todos";
    this.filterCards();
    this.updateARIA();
  }

  filterCards() {
    this.cards.forEach((card) => {
      const shouldShow = this.activeCategory === "todos" || card.dataset.category === this.activeCategory;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  }

  updateARIA() {
    this.buttons.forEach((button) => {
      const isActive = button.dataset.filter === this.activeCategory;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  resetFilter() {
    this.setFilter("todos");
  }
}
