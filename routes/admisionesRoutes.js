import { Router } from "express";

import {
    listarAdmisiones,
    mostrarNuevaAdmision,
    guardarAdmision
} from "../controllers/admisionesController.js";

import { verificarSesion } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get("/", verificarSesion, listarAdmisiones);

router.get("/nueva", verificarSesion, mostrarNuevaAdmision);

router.post("/nueva", verificarSesion, guardarAdmision);

export default router;