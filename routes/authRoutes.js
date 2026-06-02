import { Router } from "express";

import {
    mostrarLogin,
    login,
    logout,
    mostrarRegistro,
    registrar
} from "../controllers/authController.js";

const router = Router();

router.get("/", mostrarLogin);
router.post("/login", login);

router.get("/register", mostrarRegistro);
router.post("/register", registrar);

router.get("/logout", logout);

export default router;