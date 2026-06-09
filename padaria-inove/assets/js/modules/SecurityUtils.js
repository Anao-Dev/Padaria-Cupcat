export class SecurityUtils {
  static escapeHTML(value) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;"
    };

    return String(value).replace(/[&<>"']/g, (char) => map[char]);
  }

  static sanitizeText(value) {
    return String(value)
      .replace(/[<>]/g, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+=/gi, "")
      .trim();
  }

  static safeSetText(element, value) {
    if (element) {
      element.textContent = SecurityUtils.sanitizeText(value);
    }
  }

  static isSuspiciousInput(value) {
    const text = String(value).toLowerCase();
    const patterns = [
      /<\s*script/,
      /<\/?\w+[^>]*>/,
      /javascript:/,
      /on\w+\s*=/,
      /document\./,
      /window\./,
      /eval\s*\(/
    ];

    return patterns.some((pattern) => pattern.test(text));
  }
}
