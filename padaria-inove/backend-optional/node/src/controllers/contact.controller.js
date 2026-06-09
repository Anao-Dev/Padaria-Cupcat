import { ContactValidator } from "../utils/validators.js";
import { PedidoService } from "../services/pedido.service.js";
import { MailService } from "../services/mail.service.js";
import { sanitizePedido } from "../utils/sanitizer.js";

export class ContactController {
  constructor() {
    this.pedidoService = new PedidoService();
    this.mailService = new MailService();
  }

  async create(request, response, next) {
    try {
      const validation = ContactValidator.safeParse(request.body);
      if (!validation.success) {
        return response.status(422).json({
          success: false,
          message: "Revise os dados enviados.",
          errors: validation.error.flatten().fieldErrors
        });
      }

      const payload = sanitizePedido(validation.data);
      if (payload.empresa) {
        return response.status(204).send();
      }

      const pedido = await this.pedidoService.create(payload);
      const mailResult = await this.mailService.sendPedidoEmail({ pedido, payload });

      return response.status(201).json({
        success: true,
        message: mailResult.sent
          ? "Pedido enviado com carinho. A Padaria Inove vai responder em breve."
          : "Pedido recebido com carinho. A Padaria Inove vai consultar seu pedido e responder em breve.",
        pedidoId: pedido.id,
        emailSent: mailResult.sent
      });
    } catch (error) {
      return next(error);
    }
  }

  async list(_request, response, next) {
    try {
      const pedidos = await this.pedidoService.list();
      return response.json({
        success: true,
        pedidos
      });
    } catch (error) {
      return next(error);
    }
  }
}
