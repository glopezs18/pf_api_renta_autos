import express from "express";
import morgan from "morgan";
// Routes
import rolRoutes from "./routes/rol.routes";
import clientRoutes from "./routes/client.routes";
import userRoutes from "./routes/user.routes";
import vehicleRoutes from "./routes/vehicle.routes";
import rentRoutes from "./routes/rent.routes";
import invoiceRoutes from "./routes/invoice.routes";
import dashboardRoutes from "./routes/dashboard.routes";

const app = express();

// Settings
app.set("port", 5000);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/project/pf_rol", rolRoutes);
app.use("/api/project/pf_client", clientRoutes);
app.use("/api/project/pf_user", userRoutes);
app.use("/api/project/pf_vehicle", vehicleRoutes);
app.use("/api/project/pf_rent", rentRoutes);
app.use("/api/project/pf_billing", invoiceRoutes);
app.use("/api/project/pf_dashboard", dashboardRoutes);

export default app;
