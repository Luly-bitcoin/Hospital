import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import pacientesRoutes from "./routes/pacientesRoutes.js";
import admisionesRoutes from "./routes/admisionesRoutes.js";
import enfermeriaRoutes from "./routes/enfermeriaRoutes.js";
import medicoRoutes from "./routes/medicoRoutes.js";
import altasRoutes from "./routes/altasRoutes.js";
import { mostrarDashboard } from "./controllers/dashboardController.js";
import { verificarSesion } from "./middlewares/authMiddlewares.js";
import { cargarDatosVista } from "./middlewares/viewMiddlewares.js";
import medicosRoutes from "./routes/medicosRoutes.js";
import turnosRoutes from "./routes/turnosRoutes.js";
import historialRoutes from "./routes/historialRoutes.js";
import reportesRoutes from "./routes/reportesRoutes.js";
import camasRoutes from "./routes/camasRoutes.js";
import emergenciasRoutes from "./routes/emergenciasRoutes.js";
import perfilRoutes from "./routes/perfilRoutes.js";
import registerRoutes from "./routes/registerRoutes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

app.use("/", authRoutes);
app.use(cargarDatosVista);
app.use("/pacientes", pacientesRoutes);
app.use("/admisiones", admisionesRoutes);
app.use("/enfermeria", enfermeriaRoutes);
app.use("/medico", medicoRoutes);
app.use("/altas", altasRoutes);
app.use("/medicos", medicosRoutes);
app.use("/turnos", turnosRoutes);
app.use("/historial", historialRoutes);
app.use("/reportes", reportesRoutes);
app.use("/camas", camasRoutes);
app.use("/emergencias", emergenciasRoutes);
app.use("/perfil", perfilRoutes);
app.use("/registro", registerRoutes);

app.get(
    "/dashboard",
    verificarSesion,
    mostrarDashboard
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});