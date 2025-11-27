import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// LISTAR ADMISIONES ACTIVAS PARA DAR EL ALTA
router.get("/", async (req, res) => {
    const [admisiones] = await db.query(`
        SELECT a.id_admision, p.nombre, p.apellido, p.dni, c.codigo AS cama
        FROM admisiones a
        JOIN pacientes p ON p.dni = a.dni_paciente
        JOIN camas c ON c.id_cama = a.id_cama
        WHERE a.estado = 'activa'
    `);

    res.render("alta/listar-admisiones", { admisiones });
});

// FORMULARIO PARA CONFIRMAR EL ALTA
router.get("/procesar/:id_admision", async (req, res) => {
    const { id_admision } = req.params;

    const [[admision]] = await db.query(`
        SELECT a.*, p.nombre, p.apellido, c.codigo AS cama
        FROM admisiones a
        JOIN pacientes p ON p.dni = a.dni_paciente
        JOIN camas c ON c.id_cama = a.id_cama
        WHERE a.id_admision = ?
    `, [id_admision]);

    res.render("alta/form-alta", { admision });
});

// GUARDAR ALTA
router.post("/guardar", async (req, res) => {
    const { id_admision } = req.body;
    const usuario_alta = 1; // cuando hagamos login se reemplaza

    // 1) Obtener cama asociada
    const [[adm]] = await db.query(`
        SELECT id_cama FROM admisiones WHERE id_admision = ?
    `, [id_admision]);

    const id_cama = adm.id_cama;

    // 2) Cerrar admisión (registrar fecha de egreso)
    await db.query(`
        UPDATE admisiones
        SET estado = 'cerrada',
            fecha_egreso = NOW()
        WHERE id_admision = ?
    `, [id_admision]);

    // 3) Liberar la cama asociada
    await db.query(`
        UPDATE camas
        SET estado = 'libre'
        WHERE id_cama = ?
    `, [id_cama]);

    res.redirect("/alta/confirmacion");
});

router.get("/confirmacion", (req, res) => {
    res.render("alta/confirmacion");
});

export default router;
