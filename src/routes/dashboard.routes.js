import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";

const router = Router();

/*Gestión de Usuarios*/
router.get("/vehicle-summary", dashboardController.getVehicleSummary);
router.get("/invoice-summary", dashboardController.getInvoiceSummary);
router.get("/rent-summary", dashboardController.getRentSummary);
router.get("/rent-summary/by-status", dashboardController.getRentSummaryByStatus);

export default router;
