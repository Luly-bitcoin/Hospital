import { Router } from "express";

import {
    listarInternados,
    mostrarAlta,
    guardarAlta
} from "../controllers/altasController.js";
import { verificarSesion,
    permitirRoles
 } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get(
    "/",
    verificarSesion,
    permitirRoles(1, 2, 3),
    listarInternados
);

router.get(
    "/generar/:id",
    verificarSesion,
    permitirRoles(1, 2, 3),
    mostrarAlta
);

router.post(
    "/guardar",
    verificarSesion,
    permitirRoles(1, 2, 3),
    guardarAlta
);

export default router;