import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router = Router();

/*Gestión de Usuarios*/
router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.post("/", userController.addUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/permission-by-iduser/:id_user", userController.permissionByIdUser);
router.post("/validate-permission-by-iduser/:id_user", userController.validatePermissionByIuser);
router.post("/login", userController.loginUser);

export default router;
