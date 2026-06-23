import pool from "../config/db.js";

export const listarPacientesInternados = async (req, res) => {

    const [pacientes] = await pool.query(`
        SELECT
            a.id_admision,
            p.nombre,
            p.apellido,
            a.fecha_ingreso,
            a.estado
        FROM admisiones a
        JOIN pacientes p
            ON p.dni = a.dni_paciente
        WHERE a.estado='activa'
    `);

    pacientes.forEach(paciente => {

        const fecha = new Date(paciente.fecha_ingreso);

        paciente.fecha_formateada =
            fecha.toLocaleDateString('es-AR') +
            " - " +
            fecha.toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit'
            }) +
            " hs";
    });

    res.render("enfermeria/lista", {
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
        WHERE a.id_admision = ?
    `,[id]);

    res.render("enfermeria/evaluaciones", {
        admision: admision[0]
    });
};

export const guardarEvaluacion = async (req, res) => {

    const {
        id_admision,
        antecedentes,
        alergias,
        medicamentos,
        motivo_internacion,
        temperatura,
        frecuencia_cardiaca,
        frecuencia_respiratoria,
        presion
    } = req.body;

    await pool.query(`
        INSERT INTO evaluacion_enfermeria
        (
            id_admision,
            antecedentes,
            alergias,
            medicamentos,
            motivo_internacion,
            signos_vitales_temp,
            signos_vitales_fc,
            signos_vitales_fr,
            signos_vitales_pa
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,[
        id_admision,
        antecedentes,
        alergias,
        medicamentos,
        motivo_internacion,
        temperatura,
        frecuencia_cardiaca,
        frecuencia_respiratoria,
        presion
    ]);

    res.redirect("/enfermeria");
};