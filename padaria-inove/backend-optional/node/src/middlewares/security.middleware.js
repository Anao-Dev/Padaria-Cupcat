import crypto from "node:crypto";

export const requireJsonContent = (request, response, next) => {
  if (["POST", "PUT", "PATCH"].includes(request.method) && !request.is("application/json")) {
    return response.status(415).json({
      success: false,
      message: "Content-Type deve ser application/json."
    });
  }

  return next();
};

export const requestIdMiddleware = (request, response, next) => {
  const requestId = crypto.randomUUID();
  request.id = requestId;
  response.setHeader("X-Request-Id", requestId);
  return next();
};

export const noStoreForApi = (_request, response, next) => {
  response.setHeader("Cache-Control", "no-store");
  return next();
};
