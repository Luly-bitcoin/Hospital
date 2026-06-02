import { Router } from "express";

import {
    listarPacientes,
    mostrarEvaluacion,
    guardarEvaluacion
} from "../controllers/medicoController.js";

import { verificarSesion } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get(
    "/",
    verificarSesion,
    listarPacientes
);

router.get(
    "/evaluar/:id",
    verificarSesion,
    mostrarEvaluacion
);

router.post(
    "/guardar",
    verificarSesion,
    guardarEvaluacion
);

export default router;