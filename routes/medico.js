import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// LISTAR ADMISIONES ACTIVAS
router.get("/", async (req, res) => {
    const [admisiones] = await db.query(`
        SELECT a.id_admision, p.nombre, p.apellido, p.dni
        FROM admisiones a
        JOIN pacientes p ON p.dni = a.dni_paciente
        WHERE a.estado = 'activa'
    `);

    res.render("medico/listar-admisiones", { admisiones });
});

// FORMULARIO + HISTORIAL
router.get("/evaluar/:id_admision", async (req, res) => {
    const { id_admision } = req.params;

    // Datos del paciente
    const [[admision]] = await db.query(`
        SELECT a.*, p.nombre, p.apellido, p.dni
        FROM admisiones a
        JOIN pacientes p ON p.dni = a.dni_paciente
        WHERE a.id_admision = ?
    `, [id_admision]);

    // Evolución médica desde tu tabla REAL
    const [historial] = await db.query(`
        SELECT *
        FROM d_eval_med
        WHERE id_admision = ?
        ORDER BY fecha_registro DESC
    `, [id_admision]);

    res.render("medico/form-evolucion", { admision, historial });
});

// GUARDAR EVOLUCIÓN
router.post("/guardar", async (req, res) => {
    const {
        id_admision,
        diagnostico,
        estudios,
        tratamiento,
        evolucion
    } = req.body;

    // Por ahora “usuario_registra” = 1 (cuando hagamos login se reemplaza)
    const usuario_registra = 1;

    await db.query(`
        INSERT INTO d_eval_med
        (id_admision, diagnostico, estudios, tratamiento, evolucion, usuario_registra)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [
        id_admision,
        diagnostico,
        estudios,
        tratamiento,
        evolucion,
        usuario_registra
    ]);

    res.redirect(`/medico/evaluar/${id_admision}`);
});

export default router;
