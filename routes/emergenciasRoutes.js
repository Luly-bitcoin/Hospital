import { Router } from "express";

import {
    listarEmergencias,
    mostrarFormulario,
    guardarEmergencia,
    mostrarIdentificacion,
    identificarPaciente
}
from "../controllers/emergenciasController.js";

import {
    verificarSesion
}
from "../middlewares/authMiddlewares.js";

const router = Router();

router.get(
    "/",
    verificarSesion,
    listarEmergencias
);

router.get(
    "/nuevo",
    verificarSesion,
    mostrarFormulario
);

router.post(
    "/guardar",
    verificarSesion,
    guardarEmergencia
);

router.get(
    "/identificar/:id",
    verificarSesion,
    mostrarIdentificacion
);

router.post(
    "/identificar/:id",
    verificarSesion,
    identificarPaciente
);

export default router;