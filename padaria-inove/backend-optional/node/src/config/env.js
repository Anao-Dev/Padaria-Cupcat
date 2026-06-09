const required = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variavel obrigatoria ausente: ${name}`);
  }
  return value;
};

const parseOrigins = (value) => String(value || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isProduction = process.env.NODE_ENV === "production";

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction,
  port: Number(process.env.PORT || 3000),
  databaseUrl: required("DATABASE_URL"),
  frontendOrigins: parseOrigins(process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN || "http://127.0.0.1:8080"),
  adminRoutesEnabled: String(process.env.ADMIN_ROUTES_ENABLED || "false") === "true",
  adminToken: process.env.ADMIN_TOKEN || "",
  mailEnabled: String(process.env.MAIL_ENABLED || "false") === "true",
  mailHost: process.env.MAIL_HOST,
  mailPort: Number(process.env.MAIL_PORT || 465),
  mailSecure: String(process.env.MAIL_SECURE || "true") === "true",
  mailUser: process.env.MAIL_USER,
  mailPass: process.env.MAIL_PASS,
  mailFrom: process.env.MAIL_FROM,
  mailTo: process.env.MAIL_TO || "kathelengomes3000@gmail.com"
};

export const validateProductionEnv = () => {
  if (!isProduction) {
    return;
  }

  if (env.frontendOrigins.length === 0) {
    throw new Error("Configure FRONTEND_ORIGINS em producao.");
  }

  if (env.adminRoutesEnabled && env.adminToken.length < 32) {
    throw new Error("ADMIN_TOKEN precisa ter pelo menos 32 caracteres em producao.");
  }

  if (env.databaseUrl.includes("localhost") || env.databaseUrl.includes("127.0.0.1")) {
    throw new Error("DATABASE_URL de producao nao pode apontar para localhost.");
  }

  if (env.mailEnabled && (!env.mailUser || !env.mailPass || !env.mailFrom)) {
    throw new Error("MAIL_ENABLED=true exige MAIL_USER, MAIL_PASS e MAIL_FROM.");
  }
};
