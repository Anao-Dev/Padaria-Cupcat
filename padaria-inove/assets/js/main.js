import { NavbarController } from "./modules/NavbarController.js";
import { AnimationController } from "./modules/AnimationController.js";
import { MenuFilter } from "./modules/MenuFilter.js";
import { Lightbox } from "./modules/Lightbox.js";
import { FormValidator } from "./modules/FormValidator.js";
import { ToastNotification } from "./modules/ToastNotification.js";
import { MotionController } from "./modules/MotionController.js";

const toast = new ToastNotification("[data-toast]");

const modules = [
  new NavbarController("[data-navbar]"),
  new AnimationController(".reveal"),
  new MotionController(),
  new MenuFilter("[data-filter-group]", "[data-menu-grid]"),
  new Lightbox("[data-gallery]", "[data-lightbox]"),
  new FormValidator("[data-contact-form]", toast)
];

modules.forEach((module) => {
  try {
    module.init();
  } catch (error) {
    toast.error("Nao foi possivel iniciar um recurso da pagina.");
  }
});
