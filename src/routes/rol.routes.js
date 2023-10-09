import { Router } from "express";
import { rolController } from "../controllers/rol.controller";

const router = Router();

/*Gestión de Roles*/
router.get("/", rolController.getRoles);
router.get("/:id", rolController.getRol);
router.post("/", rolController.addRol);
router.put("/:id", rolController.updateRol);
router.delete("/:id", rolController.deleteRol);
router.get("/level1-by-idrol/:id_rol", rolController.readLevel1ByIdRol);
router.get("/level2-by-idrol-idpermission/:id_rol", rolController.readLevel2ByIdRolAndIdPermission);
router.get("/delete-permission-idrol/:id_rol", rolController.deletePermissionForIdRol);
router.post("/create-permission-idrol", rolController.createPermissionForIdRol);

export default router;
