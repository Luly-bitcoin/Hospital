import pool from "../config/db.js";

export const listarEmergencias = async (req, res) => {

    const [emergencias] = await pool.query(`
        SELECT
            e.*,
            c.codigo AS cama_codigo,
            p.nombre,
            p.apellido

        FROM emergencias e

        LEFT JOIN camas c
            ON c.id_cama = e.id_cama

        LEFT JOIN pacientes p
            ON p.dni = e.dni_paciente

        ORDER BY e.fecha_ingreso DESC
    `);

    res.render(
        "emergencias/lista",
        { emergencias }
    );
};

export const mostrarFormulario = async (req, res) => {

    const [camas] = await pool.query(`
        SELECT
            c.id_cama,
            c.codigo

        FROM camas c

        JOIN habitaciones h
            ON h.id_habitacion = c.id_habitacion

        WHERE
            h.id_ala = 3
            AND c.estado='libre'
    `);

    res.render(
        "emergencias/nuevo",
        { camas }
    );
};

export const guardarEmergencia = async (req, res) => {

    const {
        sexo,
        descripcion,
        id_cama
    } = req.body;

    const codigo =
        "EMG-" +
        Date.now();

    await pool.query(`
        INSERT INTO emergencias
        (
            codigo_temporal,
            sexo,
            descripcion,
            id_cama
        )
        VALUES
        (
            ?,?,?,?
        )
    `,
    [
        codigo,
        sexo,
        descripcion,
        id_cama
    ]);

    await pool.query(`
        UPDATE camas
        SET estado='ocupada'
        WHERE id_cama=?
    `,
    [id_cama]);

    res.redirect("/emergencias");
};

export const mostrarIdentificacion = async (req, res) => {

    const id = req.params.id;

    const [pacientes] = await pool.query(`
        SELECT *
        FROM pacientes
        ORDER BY apellido,nombre
    `);

    const [emergencia] = await pool.query(`
        SELECT *
        FROM emergencias
        WHERE id_emergencia=?
    `,
    [id]);

    res.render(
        "emergencias/identificar",
        {
            pacientes,
            emergencia: emergencia[0]
        }
    );
};

export const identificarPaciente = async (req, res) => {

    const id = req.params.id;

    const {
        dni_paciente
    } = req.body;

    await pool.query(`
        UPDATE emergencias
        SET
            dni_paciente=?,
            estado='identificado'
        WHERE id_emergencia=?
    `,
    [
        dni_paciente,
        id
    ]);

    res.redirect("/emergencias");
};