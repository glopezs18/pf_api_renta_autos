import express from "express";
import morgan from "morgan";
// Routes
import rolRoutes from "./routes/rol.routes";
import clientRoutes from "./routes/client.routes";
import userRoutes from "./routes/user.routes";

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

export default app;
