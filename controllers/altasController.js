import pool from "../config/db.js";

export const listarInternados = async (req, res) => {

    const [pacientes] = await pool.query(`
        SELECT
            a.id_admision,
            p.nombre,
            p.apellido,
            c.codigo
        FROM admisiones a
        JOIN pacientes p
            ON p.dni = a.dni_paciente
        LEFT JOIN camas c
            ON c.id_cama = a.id_cama
        WHERE a.estado='activa'
    `);

    res.render("altas/lista", {
        pacientes
    });
};

export const mostrarAlta = async (req, res) => {

    const { id } = req.params;

    const [admision] = await pool.query(`
        SELECT
            a.id_admision,
            p.nombre,
            p.apellido
        FROM admisiones a
        JOIN pacientes p
            ON p.dni = a.dni_paciente
        WHERE a.id_admision=?
    `,[id]);

    res.render("altas/alta", {
        admision: admision[0]
    });
};

export const guardarAlta = async (req, res) => {

    const {
        id_admision,
        indicaciones
    } = req.body;

    const [admision] = await pool.query(`
        SELECT *
        FROM admisiones
        WHERE id_admision=?
    `,[id_admision]);

    const cama = admision[0].id_cama;

    await pool.query(`
        INSERT INTO altas
        (
            id_admision,
            indicaciones
        )
        VALUES (?,?)
    `,[
        id_admision,
        indicaciones
    ]);

    await pool.query(`
        UPDATE admisiones
        SET
            estado='finalizada',
            fecha_egreso=NOW()
        WHERE id_admision=?
    `,[id_admision]);

    await pool.query(`
        UPDATE camas
        SET estado='higienizando'
        WHERE id_cama=?
    `,[cama]);

    res.redirect("/altas");
};