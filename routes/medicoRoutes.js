import { Router } from "express";

import {
    listarPacientes,
    mostrarEvaluacion,
    guardarEvaluacion
} from "../controllers/medicoController.js";

import { verificarSesion, permitirRoles } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get(
    "/",
    verificarSesion,
    permitirRoles(1, 3),
    listarPacientes
);

router.get(
    "/evaluar/:id",
    verificarSesion,
    permitirRoles(1, 3),
    mostrarEvaluacion
);

router.post(
    "/guardar",
    verificarSesion,
    permitirRoles(1, 3),
    guardarEvaluacion
);

export default router;