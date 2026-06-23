import express from "express";

import {
    mostrarPerfil
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

export default router;