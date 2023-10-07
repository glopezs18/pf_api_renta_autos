import { Router } from "express";
import { rolController } from "../controllers/rol.controller";

const router = Router();

/*Gestión de Roles*/
router.get("/", rolController.getRoles);
router.get("/:id", rolController.getRol);
router.post("/", rolController.addRol);
router.put("/:id", rolController.updateRol);
router.delete("/:id", rolController.deleteRol);

export default router;
