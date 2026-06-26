import { Router } from "express";

import {
    buscarPaciente,
    verHistorial
} from "../controllers/historialController.js";

import { verificarSesion, permitirRoles } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get(
    "/",
    verificarSesion,
    permitirRoles(1, 3, 4),
    buscarPaciente
);

router.get(
    "/:dni",
    verificarSesion,
    permitirRoles(1, 3, 4),
    verHistorial
);

export default router;