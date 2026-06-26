import { Router } from "express";

import {
    listarPacientesInternados,
    mostrarEvaluacion,
    guardarEvaluacion
} from "../controllers/enfermeriaController.js";

import { verificarSesion, permitirRoles } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get(
    "/",
    verificarSesion,
    permitirRoles(1, 2),
    listarPacientesInternados
);

router.get(
    "/evaluar/:id",
    verificarSesion,
    permitirRoles(1, 2),
    mostrarEvaluacion
);

router.post(
    "/guardar",
    verificarSesion,
    permitirRoles(1, 2),
    guardarEvaluacion
);

export default router;