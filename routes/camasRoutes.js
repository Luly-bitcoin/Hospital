import { Router } from "express";
import {
    verCamas,
    crearAla,
    crearHabitacion,
    crearCama
} from "../controllers/camasController.js";

import { verificarSesion } from "../middlewares/authMiddlewares.js";

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

export default router;