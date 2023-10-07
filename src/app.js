import express from "express";
import morgan from "morgan";
// Routes
import rolRoutes from "./routes/rol.routes";
import clientRoutes from "./routes/client.routes";

const app = express();

// Settings
app.set("port", 5000);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/project/pf_rol", rolRoutes);
app.use("/api/project/pf_client", clientRoutes);

export default app;
