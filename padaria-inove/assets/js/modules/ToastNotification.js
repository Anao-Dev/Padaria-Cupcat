import { SecurityUtils } from "./SecurityUtils.js";

export class ToastNotification {
  constructor(selector) {
    this.toast = document.querySelector(selector);
    this.timeoutId = 0;
  }

  show(message, type = "success") {
    if (!this.toast) {
      return;
    }

    window.clearTimeout(this.timeoutId);
    SecurityUtils.safeSetText(this.toast, message);
    this.toast.dataset.type = type;
    this.toast.hidden = false;
    this.timeoutId = window.setTimeout(() => this.hide(), 4200);
  }

  success(message) {
    this.show(message, "success");
  }

  error(message) {
    this.show(message, "error");
  }

  hide() {
    if (this.toast) {
      this.toast.hidden = true;
    }
  }
}
