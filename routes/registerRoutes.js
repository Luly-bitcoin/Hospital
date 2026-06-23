import express from "express";

import {
    mostrarRegistro,
    registrarUsuario
} from "../controllers/registerController.js";

const router = express.Router();

router.get(
    "/",
    mostrarRegistro
);

router.post(
    "/",
    registrarUsuario
);

export default router;