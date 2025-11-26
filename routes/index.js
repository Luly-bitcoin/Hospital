import {Router} from "express";
import db from "../config/db.js";
const router = Router();

router.get("/test-db", async (req, res) => {
    const [rows] = await db.query("SELECT * FROM pacientes LIMIT 10");
    res.json(rows);
});

router.get("/", (req, res) => {
    res.render("index", { titulo: "HIS Internación" });
});

export default router;
