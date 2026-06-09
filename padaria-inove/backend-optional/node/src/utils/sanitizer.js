export const sanitizeText = (value) => String(value ?? "")
  .replace(/[<>]/g, "")
  .replace(/[\u0000-\u001F\u007F]/g, " ")
  .replace(/javascript:/gi, "")
  .replace(/on\w+=/gi, "")
  .replace(/\s+/g, " ")
  .trim();

export const normalizePhone = (value) => sanitizeText(value).replace(/[^\d+]/g, "");

export const sanitizePedido = (payload) => ({
  nome: sanitizeText(payload.nome),
  telefone: normalizePhone(payload.telefone),
  email: payload.email ? sanitizeText(payload.email).toLowerCase() : "",
  produto: sanitizeText(payload.produto),
  mensagem: sanitizeText(payload.mensagem),
  empresa: sanitizeText(payload.empresa)
});

export const escapeHTML = (value) => {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  };

  return String(value ?? "").replace(/[&<>"']/g, (char) => map[char]);
};
