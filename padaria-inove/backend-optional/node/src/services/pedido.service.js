import { prisma } from "../utils/prisma.js";

export class PedidoService {
  async create(payload) {
    const usuario = await prisma.usuario.upsert({
      where: {
        telefone: payload.telefone
      },
      update: {
        nome: payload.nome,
        email: payload.email || null
      },
      create: {
        nome: payload.nome,
        telefone: payload.telefone,
        email: payload.email || null
      }
    });

    return prisma.pedido.create({
      data: {
        usuarioId: usuario.id,
        produto: payload.produto,
        mensagem: payload.mensagem
      },
      include: {
        usuario: true
      }
    });
  }

  async list() {
    return prisma.pedido.findMany({
      orderBy: {
        createdAt: "desc"
      },
      include: {
        usuario: true
      },
      take: 100
    });
  }
}
