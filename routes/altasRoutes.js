import { Router } from "express";

import {
    listarInternados,
    mostrarAlta,
    guardarAlta
} from "../controllers/altasController.js";
import { verificarSesion } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get(
    "/",
    verificarSesion,
    listarInternados
);

router.get(
    "/generar/:id",
    verificarSesion,
    mostrarAlta
);

router.post(
    "/guardar",
    verificarSesion,
    guardarAlta
);

export default router;