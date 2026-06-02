import { Router } from "express";
import { dashboardReportes } from "../controllers/reportesController.js";
import { verificarSesion } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get(
    "/",
    verificarSesion,
    dashboardReportes
);

export default router;