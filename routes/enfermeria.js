import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// LISTAR ADMISIONES ACTIVAS PARA ELEGIR PACIENTE
router.get("/", async (req, res) => {
    const [admisiones] = await db.query(`
        SELECT a.id_admision, p.nombre, p.apellido, p.dni
        FROM admisiones a
        JOIN pacientes p ON p.dni = a.dni_paciente
        WHERE a.estado = 'activa'
    `);

    res.render("enfermeria/listar-admisiones", { admisiones });
});

// FORMULARIO DE EVALUACIÓN INICIAL
router.get("/evaluar/:id_admision", async (req, res) => {
    const { id_admision } = req.params;

    const [[admision]] = await db.query(`
        SELECT a.*, p.nombre, p.apellido
        FROM admisiones a
        JOIN pacientes p ON p.dni = a.dni_paciente
        WHERE a.id_admision = ?
    `, [id_admision]);

    res.render("enfermeria/form-evaluacion", { admision });
});

// GUARDAR EVALUACIÓN
router.post("/guardar", async (req, res) => {
    const {
        id_admision, antecedentes, alergias, medicamentos, motivo_internacion,
        temp, fc, fr, pa
    } = req.body;

    await db.query(`
        INSERT INTO evaluacion_enfermeria
        (id_admision, antecedentes, alergias, medicamentos, motivo_internacion,
         signos_vitales_temp, signos_vitales_fc, signos_vitales_fr, signos_vitales_pa)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        id_admision, antecedentes, alergias, medicamentos, motivo_internacion,
        temp, fc, fr, pa
    ]);

    res.redirect("/enfermeria/confirmacion");
});

// CONFIRMACIÓN
router.get("/confirmacion", (req, res) => {
    res.render("enfermeria/confirmacion");
});

export default router;
