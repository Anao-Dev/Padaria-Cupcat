import { SecurityUtils } from "./SecurityUtils.js";

export class FormValidator {
  constructor(selector, toast) {
    this.form = document.querySelector(selector);
    this.toast = toast;
    this.status = this.form?.querySelector("[data-form-status]");
    this.startedAt = Date.now();
    this.endpoint = this.form?.dataset.endpoint || this.resolveEndpoint();
    this.isSubmitting = false;
  }

  init() {
    if (!this.form) {
      return;
    }

    this.form.addEventListener("input", (event) => {
      const field = event.target.closest("input, select, textarea");
      if (field) {
        this.validateField(field);
      }
    });

    this.form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (this.isSubmitting) {
        return;
      }

      if (!this.validateForm()) {
        this.showStatus("Revise os campos destacados antes de enviar.", "error");
        this.toast?.error("Alguns campos precisam de ajuste.");
        return;
      }

      await this.submitForm();
    });
  }

  validateField(field) {
    const value = this.sanitizeInput(field.value);
    let message = "";

    if (field.required && !value) {
      message = "Preencha este campo.";
    } else if (field.name === "nome" && value.length < 2) {
      message = "Informe pelo menos 2 caracteres.";
    } else if (field.name === "telefone" && !/^[0-9()\s+-]{10,20}$/.test(value)) {
      message = "Informe um telefone valido.";
    } else if (field.name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = "Informe um email valido.";
    } else if (field.name === "mensagem" && value.length < 8) {
      message = "Escreva uma mensagem um pouco mais completa.";
    } else if (SecurityUtils.isSuspiciousInput(field.value)) {
      message = "Remova codigos, tags ou caracteres suspeitos.";
    }

    if (message) {
      this.showError(field, message);
      return false;
    }

    this.clearError(field);
    return true;
  }

  validateForm() {
    if (!this.checkHoneypot()) {
      return false;
    }

    if (Date.now() - this.startedAt < 2500) {
      this.showStatus("Envio muito rapido. Aguarde alguns segundos e tente novamente.", "error");
      return false;
    }

    const fields = Array.from(this.form.querySelectorAll("input:not([name='empresa']), select, textarea"));
    return fields.every((field) => this.validateField(field));
  }

  showError(field, message) {
    const error = this.form.querySelector(`#${field.id}-error`);
    field.setAttribute("aria-invalid", "true");
    if (error) {
      error.textContent = message;
      field.setAttribute("aria-describedby", error.id);
    }
  }

  clearError(field) {
    const error = this.form.querySelector(`#${field.id}-error`);
    field.removeAttribute("aria-invalid");
    if (error) {
      error.textContent = "";
    }
  }

  checkHoneypot() {
    const honeypot = this.form.querySelector("[name='empresa']");
    return !honeypot?.value;
  }

  sanitizeInput(value) {
    return SecurityUtils.sanitizeText(value);
  }

  resolveEndpoint() {
    const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    return isLocal ? "http://127.0.0.1:3000/api/pedidos" : "/api/pedidos";
  }

  showStatus(message, type) {
    if (this.status) {
      this.status.textContent = message;
      this.status.dataset.type = type;
    }
  }

  async submitForm() {
    this.isSubmitting = true;
    const button = this.form.querySelector("button[type='submit']");
    const originalLabel = button?.textContent || "Enviar mensagem";
    if (button) {
      button.disabled = true;
      button.textContent = "Enviando...";
    }
    this.showStatus("Enviando seu pedido com carinho...", "loading");

    try {
      const formData = new FormData(this.form);
      const payload = Object.fromEntries(formData.entries());
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Nao foi possivel enviar o pedido.");
      }

      const data = await response.json();
      this.showStatus(data.message || "Pedido enviado com sucesso.", "success");
      this.toast?.success("Pedido enviado. A Cupcat vai responder em breve.");
      this.form.reset();
      this.startedAt = Date.now();
    } catch (error) {
      this.showStatus(error.message || "Falha no envio. Tente novamente.", "error");
      this.toast?.error("Nao foi possivel enviar agora.");
    } finally {
      this.isSubmitting = false;
      if (button) {
        button.disabled = false;
        button.textContent = originalLabel;
      }
    }
  }
}
