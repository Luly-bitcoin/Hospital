import pool from "../config/db.js";

export const listarPacientes = async (req, res) => {

    const [pacientes] = await pool.query(`
        SELECT
            a.id_admision,
            p.nombre,
            p.apellido,
            a.fecha_ingreso
        FROM admisiones a
        JOIN pacientes p
            ON p.dni = a.dni_paciente
        WHERE a.estado='activa'
    `);

    res.render("medico/lista", {
        pacientes
    });
};

export const mostrarEvaluacion = async (req, res) => {

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

    res.render("medico/evaluaciones", {
        admision: admision[0]
    });
};

export const guardarEvaluacion = async (req, res) => {

    const {
        id_admision,
        diagnostico,
        estudios,
        tratamiento,
        evolucion
    } = req.body;

    await pool.query(`
        INSERT INTO evaluacion_medica
        (
            id_admision,
            diagnostico,
            estudios,
            tratamiento,
            evolucion
        )
        VALUES (?, ?, ?, ?, ?)
    `,[
        id_admision,
        diagnostico,
        estudios,
        tratamiento,
        evolucion
    ]);

    res.redirect("/medico");
};