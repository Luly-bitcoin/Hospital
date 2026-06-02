import pool from "../config/db.js";

export const buscarPaciente = async (req, res) => {

    const [pacientes] = await pool.query(`
        SELECT *
        FROM pacientes
        ORDER BY apellido,nombre
    `);

    res.render("historial/buscar", {
        pacientes
    });
};


export const verHistorial = async (req, res) => {

    const dni = req.params.dni;

    const [pacienteRows] = await pool.query(
        `SELECT * FROM pacientes WHERE dni=?`,
        [dni]
    );

    const paciente = pacienteRows[0];

    const [internaciones] = await pool.query(`
        SELECT
            a.*,

            ee.antecedentes,
            ee.alergias,
            ee.medicamentos,
            ee.motivo_internacion,
            ee.signos_vitales_temp,
            ee.signos_vitales_fc,
            ee.signos_vitales_fr,
            ee.signos_vitales_pa,

            em.diagnostico,
            em.estudios,
            em.tratamiento,
            em.evolucion,

            al.fecha_alta,
            al.indicaciones

        FROM admisiones a

        LEFT JOIN evaluacion_enfermeria ee
            ON ee.id_admision = a.id_admision

        LEFT JOIN evaluacion_medica em
            ON em.id_admision = a.id_admision

        LEFT JOIN altas al
            ON al.id_admision = a.id_admision

        WHERE a.dni_paciente = ?

        ORDER BY a.fecha_ingreso DESC
    `,[dni]);

    res.render(
        "historial/ver",
        {
            paciente,
            internaciones
        }
    );
};