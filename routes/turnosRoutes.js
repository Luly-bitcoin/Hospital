import { Router } from "express";

import {
    listarTurnos,
    mostrarFormulario,
    guardarTurno
} from "../controllers/turnosController.js";

import { verificarSesion, permitirRoles } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get(
    "/",
    verificarSesion,
    permitirRoles(1, 3, 4),
    listarTurnos
);

router.get(
    "/nuevo",
    verificarSesion,
    permitirRoles(1, 3, 4),
    mostrarFormulario
);

router.post(
    "/guardar",
    verificarSesion,
    permitirRoles(1, 3, 4),
    guardarTurno
);

export default router;