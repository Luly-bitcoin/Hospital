import { Router } from "express";
import { verCamas } from "../controllers/camasController.js";
import { verificarSesion } from "../middlewares/authMiddlewares.js";

const router = Router();

router.get(
    "/",
    verificarSesion,
    verCamas
);

export default router;