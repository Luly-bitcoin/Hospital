import { Router } from "express";

import {
    listarMedicos,
    mostrarFormulario,
    guardarMedico
} from "../controllers/medicosController.js";

import { verificarSesion } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get(
    "/",
    verificarSesion,
    listarMedicos
);

router.get(
    "/nuevo",
    verificarSesion,
    mostrarFormulario
);

router.post(
    "/guardar",
    verificarSesion,
    guardarMedico
);

export default router;