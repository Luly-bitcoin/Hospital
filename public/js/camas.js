import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// MOSTRAR TODAS LAS CAMAS CON HABITACIONES Y ALAS
router.get("/", async (req, res) => {

    // 1️⃣ OBTENER ALAS
    const [alas] = await db.query(`
        SELECT * FROM alas ORDER BY nombre
    `);

    // 2️⃣ OBTENER HABITACIONES CON EL NOMBRE DEL ALA
    const [habitaciones] = await db.query(`
        SELECT h.*, a.nombre AS ala_nombre
        FROM habitaciones h
        JOIN alas a ON a.id_ala = h.id_ala
        ORDER BY a.nombre, h.numero
    `);

    // 3️⃣ OBTENER CAMAS + ESTADO + PACIENTE SI ESTÁ OCUPADA
    const [camas] = await db.query(`
        SELECT 
            c.*, 
            h.numero AS habitacion_num,
            a.nombre AS ala_nombre,
            p.sexo AS sexo_paciente
        FROM camas c
        JOIN habitaciones h ON h.id_habitacion = c.id_habitacion
        JOIN alas a ON a.id_ala = h.id_ala
        LEFT JOIN admisiones ad ON ad.id_cama = c.id_cama AND ad.estado = 'activa'
        LEFT JOIN pacientes p ON p.dni = ad.dni_paciente
        ORDER BY a.nombre, h.numero, c.codigo
    `);

    res.render("camas/vista-camas", {
        alas,
        habitaciones,
        camas
    });
});

export default router;
