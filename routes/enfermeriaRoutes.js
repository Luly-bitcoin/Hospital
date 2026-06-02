import { Router } from "express";

import {
    listarPacientesInternados,
    mostrarEvaluacion,
    guardarEvaluacion
} from "../controllers/enfermeriaController.js";

import { verificarSesion } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get(
    "/",
    verificarSesion,
    listarPacientesInternados
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