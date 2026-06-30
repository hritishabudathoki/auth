import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import {
  adminMiddleware,
  authorizedMiddleware,
} from "../middlewares/authorized.middleware.js";
import { uploadUserImage } from "../middlewares/upload.middleware.js";

const router = Router();
const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/whoami", authorizedMiddleware, userController.whoAmI);
router.patch("/update", authorizedMiddleware, uploadUserImage, userController.update);

// Admin-specific CRUD operations for managing users
router.get("/users", authorizedMiddleware, adminMiddleware, userController.listUsers);
router.post("/users", authorizedMiddleware, adminMiddleware, userController.adminCreateUser);
router.get("/users/:id", authorizedMiddleware, adminMiddleware, userController.getUserDetail);
router.patch("/users/:id", authorizedMiddleware, adminMiddleware, userController.adminUpdateUser);
router.delete("/users/:id", authorizedMiddleware, adminMiddleware, userController.adminDeleteUser);

export default router;
