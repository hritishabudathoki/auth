import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import {
  authorizedMiddleware,
} from "../middlewares/authorized.middleware.js";
import { uploadUserImage } from "../middlewares/upload.middleware.js";

const router = Router();
const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/whoami", authorizedMiddleware, userController.whoAmI);
router.patch("/update", authorizedMiddleware, uploadUserImage, userController.update);

export default router;
