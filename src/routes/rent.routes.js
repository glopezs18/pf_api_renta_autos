import { Router } from "express";
import { rentController } from "../controllers/rent.controller";

const router = Router();

/*Gestión de Usuarios*/
router.get("/", rentController.getRents);
router.get("/:id", rentController.getRent);
router.post("/", rentController.createRent);
router.put("/:id", rentController.updateRent);
router.delete("/:id", rentController.deleteRent);

export default router;
