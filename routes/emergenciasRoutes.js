import { Router } from "express";

import {
    listarEmergencias,
    mostrarFormulario,
    guardarEmergencia,
    mostrarIdentificacion,
    identificarPaciente,
    mostrarCambioCama,
    guardarCambioCama,
    darAltaEmergencia
}
from "../controllers/emergenciasController.js";

import {
    verificarSesion,
    noLimpieza
}
from "../middlewares/authMiddlewares.js";

const router = Router();

router.get(
    "/",
    verificarSesion,
    noLimpieza,
    listarEmergencias
);

router.get(
    "/nuevo",
    verificarSesion,
    noLimpieza,
    mostrarFormulario
);

router.post(
    "/guardar",
    verificarSesion,
    noLimpieza,
    guardarEmergencia
);

router.get(
    "/identificar/:id",
    verificarSesion,
    noLimpieza,
    mostrarIdentificacion
);

router.post(
    "/identificar/:id",
    verificarSesion,
    noLimpieza,
    identificarPaciente
);

router.get(
    "/cambiar-cama/:id",
    verificarSesion,
    mostrarCambioCama
);

router.post(
    "/cambiar-cama",
    verificarSesion,
    guardarCambioCama
);

router.get(
    "/alta/:id",
    verificarSesion,
    darAltaEmergencia
);
export default router;