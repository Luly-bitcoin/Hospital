import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// LISTAR INTERNACIONES ACTIVAS PARA ELEGIR PACIENTE
router.get("/", async (req, res) => {
    const [internaciones] = await db.query(`
        SELECT a.id_internacion, p.nombre, p.apellido, p.dni
        FROM internaciones a
        JOIN pacientes p ON p.dni = a.dni_paciente
        WHERE a.estado = 'activa'
    `);

    res.render("enfermeria/listar-internaciones", { internaciones });
});

// FORMULARIO DE EVALUACIÓN INICIAL
router.get("/evaluar/:id_internacion", async (req, res) => {
    const { id_internacion } = req.params;

    const [[internacion]] = await db.query(`
        SELECT a.*, p.nombre, p.apellido
        FROM internaciones a
        JOIN pacientes p ON p.dni = a.dni_paciente
        WHERE a.id_internacion = ?
    `, [id_internacion]);

    res.render("enfermeria/form-evaluacion", { internacion });
});

// GUARDAR EVALUACIÓN
router.post("/guardar", async (req, res) => {
    const {
        id_internacion, antecedentes, alergias, medicamentos, motivo_internacion,
        temp, fc, fr, pa
    } = req.body;

    await db.query(`
        INSERT INTO evaluacion_enfermeria
        (id_internacion, antecedentes, alergias, medicamentos, motivo_internacion,
         signos_vitales_temp, signos_vitales_fc, signos_vitales_fr, signos_vitales_pa)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        id_internacion, antecedentes, alergias, medicamentos, motivo_internacion,
        temp, fc, fr, pa
    ]);

    res.redirect("/enfermeria/confirmacion");
});

// CONFIRMACIÓN
router.get("/confirmacion", (req, res) => {
    res.render("enfermeria/confirmacion");
});

export default router;
