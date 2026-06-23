import { Router } from "express";

import {
    listarPacientes,
    mostrarAgregar,
    agregarPaciente,
    mostrarEditar,
    editarPaciente
} from "../controllers/pacientesController.js";
import { verificarSesion } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get("/", verificarSesion, listarPacientes);

router.get("/nuevo", verificarSesion, mostrarAgregar);

router.post("/nuevo", verificarSesion, agregarPaciente);

router.get("/editar/:dni", verificarSesion, mostrarEditar);

router.post("/editar/:dni", verificarSesion, editarPaciente);

export default router;