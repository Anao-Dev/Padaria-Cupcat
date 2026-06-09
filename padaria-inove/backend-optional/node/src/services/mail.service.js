import nodemailer from "nodemailer";
import { escapeHTML } from "../utils/sanitizer.js";

export class MailService {
  constructor() {
    this.recipient = process.env.MAIL_TO || "kathelengomes3000@gmail.com";
    this.enabled = String(process.env.MAIL_ENABLED || "false") === "true";
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT || 465),
      secure: String(process.env.MAIL_SECURE || "true") === "true",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });
  }

  async sendPedidoEmail({ pedido, payload }) {
    if (!this.enabled || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.warn("Email desativado. Pedido salvo sem envio de email.");
      return {
        sent: false,
        reason: "MAIL_DISABLED"
      };
    }

    const subject = `Novo pedido da Padaria Inove - ${payload.produto}`;
    const text = [
      "Novo pedido recebido pelo site da Padaria Inove.",
      "",
      `Pedido: ${pedido.id}`,
      `Nome: ${payload.nome}`,
      `Telefone: ${payload.telefone}`,
      `Email: ${payload.email || "Nao informado"}`,
      `Produto: ${payload.produto}`,
      "",
      "Mensagem:",
      payload.mensagem
    ].join("\n");

    const html = `
      <div style="font-family: Arial, sans-serif; color: #4A2C1A; line-height: 1.6;">
        <h1 style="color: #C47A32;">Novo pedido recebido</h1>
        <p>Um cliente enviou um pedido pelo site da <strong>Padaria Inove</strong>.</p>
        <ul>
          <li><strong>Pedido:</strong> ${escapeHTML(pedido.id)}</li>
          <li><strong>Nome:</strong> ${escapeHTML(payload.nome)}</li>
          <li><strong>Telefone:</strong> ${escapeHTML(payload.telefone)}</li>
          <li><strong>Email:</strong> ${escapeHTML(payload.email || "Nao informado")}</li>
          <li><strong>Produto:</strong> ${escapeHTML(payload.produto)}</li>
        </ul>
        <p><strong>Mensagem:</strong></p>
        <p>${escapeHTML(payload.mensagem)}</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: this.recipient,
        subject,
        text,
        html,
        replyTo: payload.email || undefined
      });

      return {
        sent: true
      };
    } catch (error) {
      console.error("Falha ao enviar email do pedido:", error);
      return {
        sent: false,
        reason: "MAIL_SEND_FAILED"
      };
    }
  }
}
