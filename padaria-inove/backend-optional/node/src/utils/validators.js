import { z } from "zod";

const suspiciousPattern = /<\s*script|<\/?\w+[^>]*>|javascript:|on\w+\s*=|document\.|window\.|eval\s*\(/i;

const safeText = (fieldName, min, max) => z.string()
  .trim()
  .min(min, `${fieldName} esta muito curto.`)
  .max(max, `${fieldName} esta muito longo.`)
  .refine((value) => !suspiciousPattern.test(value), `${fieldName} contem caracteres suspeitos.`);

export const ContactValidator = z.object({
  nome: safeText("Nome", 2, 80),
  telefone: z.string()
    .trim()
    .min(10, "Telefone esta muito curto.")
    .max(20, "Telefone esta muito longo.")
    .regex(/^[0-9()\s+-]+$/, "Telefone invalido."),
  email: z.string()
    .trim()
    .max(120, "Email esta muito longo.")
    .email("Email invalido.")
    .optional()
    .or(z.literal("")),
  produto: safeText("Produto", 2, 120),
  mensagem: safeText("Mensagem", 8, 500),
  empresa: z.string().trim().max(80).optional().default("")
}).strict();
