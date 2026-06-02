import { Router } from "express";

import {
    listarTurnos,
    mostrarFormulario,
    guardarTurno
} from "../controllers/turnosController.js";

import { verificarSesion } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get(
    "/",
    verificarSesion,
    listarTurnos
);

router.get(
    "/nuevo",
    verificarSesion,
    mostrarFormulario
);

router.post(
    "/guardar",
    verificarSesion,
    guardarTurno
);

export default router;