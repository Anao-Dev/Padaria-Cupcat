import { Router } from "express";
import { ContactController } from "../controllers/contact.controller.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

export const contactRouter = Router();
const controller = new ContactController();

contactRouter.post("/pedidos", controller.create.bind(controller));
contactRouter.get("/pedidos", adminMiddleware, controller.list.bind(controller));
