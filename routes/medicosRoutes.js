import { Router } from "express";

import {
    listarMedicos,
    mostrarFormulario,
    guardarMedico
} from "../controllers/medicosController.js";

import { verificarSesion, permitirRoles } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get(
    "/",
    verificarSesion,
    permitirRoles(1, 2, 3, 4),
    listarMedicos
);

router.get(
    "/nuevo",
    verificarSesion,
    permitirRoles(1, 2, 3, 4),
    mostrarFormulario
);

router.post(
    "/guardar",
    verificarSesion,
    permitirRoles(1, 2, 3, 4),
    guardarMedico
);

export default router;