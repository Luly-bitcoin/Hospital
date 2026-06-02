import pool from "../config/db.js";

export const listarAdmisiones = async (req, res) => {

    const [admisiones] = await pool.query(`
        SELECT
            a.id_admision,
            a.fecha_ingreso,
            a.estado,
            p.nombre,
            p.apellido,
            c.codigo
        FROM admisiones a
        JOIN pacientes p ON a.dni_paciente = p.dni
        LEFT JOIN camas c ON a.id_cama = c.id_cama
        ORDER BY a.id_admision DESC
    `);

    res.render("admisiones/lista", {
        admisiones
    });
};

export const mostrarNuevaAdmision = async (req, res) => {

    const [pacientes] = await pool.query(`
        SELECT *
        FROM pacientes
        WHERE activo = 1
    `);

    const [camas] = await pool.query(`
        SELECT *
        FROM camas
        WHERE estado='libre'
    `);

    res.render("admisiones/nueva", {
        pacientes,
        camas
    });
};

export const guardarAdmision = async (req, res) => {

    const {
        dni_paciente,
        motivo,
        id_cama
    } = req.body;

    await pool.query(`
        INSERT INTO admisiones
        (
            dni_paciente,
            motivo,
            estado,
            id_cama
        )
        VALUES (?, ?, 'activa', ?)
    `, [
        dni_paciente,
        motivo,
        id_cama
    ]);

    await pool.query(`
        UPDATE camas
        SET estado='ocupada'
        WHERE id_cama=?
    `, [id_cama]);

    res.redirect("/admisiones");
};