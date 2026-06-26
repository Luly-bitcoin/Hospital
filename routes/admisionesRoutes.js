import { Router } from "express";

import {
    listarAdmisiones,
    mostrarNuevaAdmision,
    guardarAdmision
} from "../controllers/admisionesController.js";

import { verificarSesion, permitirRoles } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get("/", verificarSesion, permitirRoles(1, 4), listarAdmisiones);

router.get("/nueva", verificarSesion, permitirRoles(1, 4), mostrarNuevaAdmision);

router.post("/nueva", verificarSesion, permitirRoles(1, 4), guardarAdmision);

export default router;