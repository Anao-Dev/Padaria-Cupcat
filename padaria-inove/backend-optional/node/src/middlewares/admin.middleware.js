import crypto from "node:crypto";
import { env } from "../config/env.js";

const safeCompare = (received, expected) => {
  const receivedBuffer = Buffer.from(received || "", "utf8");
  const expectedBuffer = Buffer.from(expected || "", "utf8");

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
};

export const adminMiddleware = (request, response, next) => {
  if (!env.adminRoutesEnabled) {
    return response.status(404).json({
      success: false,
      message: "Rota nao encontrada."
    });
  }

  const configuredToken = env.adminToken;
  const receivedToken = request.get("x-admin-token");

  if (!configuredToken || configuredToken.length < 16) {
    return response.status(500).json({
      success: false,
      message: "Configure ADMIN_TOKEN no .env antes de consultar pedidos."
    });
  }

  if (!safeCompare(receivedToken, configuredToken)) {
    return response.status(401).json({
      success: false,
      message: "Token administrativo invalido."
    });
  }

  return next();
};
