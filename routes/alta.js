import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// LISTAR INTERNACIONES ACTIVAS PARA DAR EL ALTA
router.get("/", async (req, res) => {
    const [internaciones] = await db.query(`
        SELECT a.id_internacion, p.nombre, p.apellido, p.dni, c.codigo AS cama
        FROM internaciones a
        JOIN pacientes p ON p.dni = a.dni_paciente
        JOIN camas c ON c.id_cama = a.id_cama
        WHERE a.estado = 'activa'
    `);

    res.render("alta/listar-internaciones", { internaciones });
});

// FORMULARIO PARA CONFIRMAR EL ALTA
router.get("/procesar/:id_internacion", async (req, res) => {
    const { id_internacion } = req.params;

    const [[internacion]] = await db.query(`
        SELECT a.*, p.nombre, p.apellido, c.codigo AS cama
        FROM internaciones a
        JOIN pacientes p ON p.dni = a.dni_paciente
        JOIN camas c ON c.id_cama = a.id_cama
        WHERE a.id_internacion = ?
    `, [id_internacion]);

    res.render("alta/form-alta", { internacion });
});

// GUARDAR ALTA
router.post("/guardar", async (req, res) => {
    const { id_internacion } = req.body;
    const usuario_alta = 1; // cuando hagamos login se reemplaza

    // 1) Obtener cama asociada
    const [[adm]] = await db.query(`
        SELECT id_cama FROM internaciones WHERE id_internacion = ?
    `, [id_internacion]);

    const id_cama = adm.id_cama;

    // 2) Cerrar admisión (registrar fecha de egreso)
    await db.query(`
        UPDATE internaciones
        SET estado = 'cerrada',
            fecha_egreso = NOW()
        WHERE id_internacion = ?
    `, [id_internacion]);

    // 3) Liberar la cama asociada
    await db.query(`
        UPDATE camas
        SET estado = 'higienizando'
        WHERE id_cama = ?
    `, [id_cama]);

    res.redirect("/alta/confirmacion");
});

router.get("/confirmacion", (req, res) => {
    res.render("alta/confirmacion");
});

export default router;
