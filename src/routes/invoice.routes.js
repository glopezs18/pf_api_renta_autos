import { Router } from "express";
import { invoiceController } from "../controllers/invoice.controller";

const router = Router();

/*Gestión de Usuarios*/
router.get("/summary", invoiceController.getInvoiceSummary);
router.get("/", invoiceController.getInvoices);
router.get("/:id", invoiceController.getInvoice);
router.post("/", invoiceController.createInvoice);
router.put("/:id", invoiceController.updateInvoice);
router.delete("/:id", invoiceController.deleteInvoice);

export default router;
