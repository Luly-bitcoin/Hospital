import express from "express";

import {
    mostrarPerfil,
    mostrarVistaPassword,
    mostrarVistaRol,
    cambiarPassword,
    cambiarRol,
    editarPerfil
} from "../controllers/perfilController.js";
import {
    verificarSesion
} from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get(
    "/",
    verificarSesion,
    mostrarPerfil
);

router.get("/", (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            return res.redirect("/perfil");
        }

        res.redirect("/login");

    });

});

router.get(
    "/cambiar-password",
    verificarSesion,
    mostrarVistaPassword
);

router.post(
    "/cambiar-password",
    verificarSesion,
    cambiarPassword
);

router.get(
    "/cambiar-rol",
    verificarSesion,
    mostrarVistaRol
);

router.post(
    "/cambiar-rol",
    verificarSesion,
    cambiarRol
);

router.post(
    "/editar",
    verificarSesion,
    editarPerfil
);

export default router;