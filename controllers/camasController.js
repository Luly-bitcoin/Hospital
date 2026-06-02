import pool from "../config/db.js";

export const verCamas = async (req, res) => {

    const [camas] = await pool.query(`
        SELECT

            a.nombre AS ala,
            h.numero AS habitacion,

            c.id_cama,
            c.codigo,
            c.estado,

            p.nombre AS paciente_nombre,
            p.apellido AS paciente_apellido

        FROM camas c

        JOIN habitaciones h
            ON h.id_habitacion = c.id_habitacion

        JOIN alas a
            ON a.id_ala = h.id_ala

        LEFT JOIN admisiones ad
            ON ad.id_cama = c.id_cama
            AND ad.estado = 'activa'

        LEFT JOIN pacientes p
            ON p.dni = ad.dni_paciente

        ORDER BY
            a.nombre,
            h.numero,
            c.codigo
    `);

    res.render("camas/lista", {
        camas
    });

};