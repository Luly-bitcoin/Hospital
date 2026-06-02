import { Router } from "express";

import {
    buscarPaciente,
    verHistorial
} from "../controllers/historialController.js";

import { verificarSesion } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get(
    "/",
    verificarSesion,
    buscarPaciente
);

router.get(
    "/:dni",
    verificarSesion,
    verHistorial
);

export default router;