import { Router } from "express";
import { vehicleController } from "../controllers/vehicle.controller";

const router = Router();

/*Gestión de Vehiculos*/
router.get("/summary", vehicleController.getVehicleSummary);
router.get("/", vehicleController.getVehicles);
router.get("/:id", vehicleController.getVehicle);
router.post("/", vehicleController.addVehicle);
router.put("/:id", vehicleController.updateVehicle);
router.delete("/:id", vehicleController.deleteVehicle);

export default router;
