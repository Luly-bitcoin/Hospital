import express from "express";
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import router from "./routes/index.js";
import db from "./config/db.js";
import admisionesRouter from "./routes/admisiones.js";
import enfermeriaRouter from "./routes/enfermeria.js";
import camasRouter from "./routes/camas.js";
import altaRouter from "./routes/alta.js";


dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", router);
try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    console.log("Conexión a la base de datos exitosa:", rows[0].result);
}catch (error) {
    console.error("Error de conexión a la base de datos:", error);
}
app.use("/admisiones", admisionesRouter);
app.use("/enfermeria", enfermeriaRouter);
app.use("/camas", camasRouter);
app.use("/alta", altaRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
