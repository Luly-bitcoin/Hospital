import { Router } from "express";
import {
    verCamas,
    crearAla,
    crearHabitacion,
    crearCama,
    limpiarCama
} from "../controllers/camasController.js";

import { verificarSesion, soloLimpieza } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get(
    "/",
    verificarSesion,
    verCamas
);

router.post(
    "/ala",
    verificarSesion,
    crearAla
);

router.post(
    "/habitacion",
    verificarSesion,
    crearHabitacion
);

router.post(
    "/cama",
    verificarSesion,
    crearCama
);

router.post(
    "/limpiar/:id",
    verificarSesion,
    soloLimpieza,
    limpiarCama
);

export default router;