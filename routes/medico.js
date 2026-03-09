import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// LISTAR INTERNACIONES ACTIVAS
router.get("/", async (req, res) => {
    const [internaciones] = await db.query(`
        SELECT a.id_internacion, p.nombre, p.apellido, p.dni
        FROM internaciones a
        JOIN pacientes p ON p.dni = a.dni_paciente
        WHERE a.estado = 'activa'
    `);

    res.render("medico/listar-admisiones", { internaciones });
});

// FORMULARIO + HISTORIAL
router.get("/evaluar/:id_internacion", async (req, res) => {
    const { id_internacion } = req.params;

    // Datos del paciente
    const [[internacion]] = await db.query(`
        SELECT a.*, p.nombre, p.apellido, p.dni
        FROM internaciones a
        JOIN pacientes p ON p.dni = a.dni_paciente
        WHERE a.id_internacion = ?
    `, [id_internacion]);

    // Evolución médica desde tu tabla REAL
    const [historial] = await db.query(`
        SELECT *
        FROM d_eval_med
        WHERE id_internacion = ?
        ORDER BY fecha_registro DESC
    `, [id_internacion]);

    res.render("medico/form-evolucion", { internacion, historial });
});

// GUARDAR EVOLUCIÓN
router.post("/guardar", async (req, res) => {
    const {
        ad_internacion,
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
