import { Router } from "express";

import {
    listarPacientes,
    mostrarAgregar,
    agregarPaciente
} from "../controllers/pacientesController.js";

import { verificarSesion } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get("/", verificarSesion, listarPacientes);

router.get("/nuevo", verificarSesion, mostrarAgregar);

router.post("/nuevo", verificarSesion, agregarPaciente);

export default router;