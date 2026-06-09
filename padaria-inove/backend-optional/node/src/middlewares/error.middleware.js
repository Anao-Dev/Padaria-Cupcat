export const errorMiddleware = (error, _request, response, _next) => {
  console.error({
    message: error.message,
    type: error.type,
    status: error.status,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack
  });

  if (error.type === "entity.too.large") {
    return response.status(413).json({
      success: false,
      message: "Payload muito grande."
    });
  }

  if (error.message === "Origem nao permitida por CORS.") {
    return response.status(403).json({
      success: false,
      message: "Origem nao autorizada."
    });
  }

  return response.status(500).json({
    success: false,
    message: "Nao foi possivel enviar o pedido agora. Tente novamente em instantes."
  });
};
