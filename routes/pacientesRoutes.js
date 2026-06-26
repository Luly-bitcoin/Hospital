import { Router } from "express";

import {
    listarPacientes,
    mostrarAgregar,
    agregarPaciente,
    mostrarEditar,
    editarPaciente
} from "../controllers/pacientesController.js";
import { verificarSesion, permitirRoles} from "../middlewares/authMiddlewares.js";

const router = Router();

router.get("/", verificarSesion, permitirRoles(1, 2, 3, 4), listarPacientes);

router.get("/nuevo", verificarSesion, permitirRoles(1, 2, 3, 4), mostrarAgregar);

router.post("/nuevo", verificarSesion, permitirRoles(1, 2, 3, 4), agregarPaciente);

router.get("/editar/:dni", verificarSesion, permitirRoles(1, 2, 3, 4), mostrarEditar);

router.post("/editar/:dni", verificarSesion, permitirRoles(1, 2, 3, 4), editarPaciente);

export default router;