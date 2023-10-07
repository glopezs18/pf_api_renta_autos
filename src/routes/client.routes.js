import { Router } from "express";
import { clientController } from "../controllers/client.controller";

const router = Router();

/*Gestión de Roles*/
router.get("/", clientController.getClients);
router.get("/:id", clientController.getClient);
router.post("/", clientController.addClient);
router.put("/:id", clientController.updateClient);
router.delete("/:id", clientController.deleteClient);

export default router;
