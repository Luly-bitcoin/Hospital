import pool from "../config/db.js";

export const listarTurnos = async (req, res) => {

    const [turnos] = await pool.query(`
        SELECT
            t.*,
            p.nombre paciente_nombre,
            p.apellido paciente_apellido,
            m.nombre medico_nombre,
            m.apellido medico_apellido
        FROM turnos t
        JOIN pacientes p
            ON p.dni = t.dni_paciente
        JOIN medicos m
            ON m.id_medico = t.id_medico
        WHERE t.fecha_solicitada >= NOW()
        ORDER BY t.fecha_solicitada
    `);

    turnos.forEach(turno => {

        const fecha = new Date(turno.fecha_solicitada);

        turno.fecha_formateada =
            fecha.toLocaleDateString('es-AR') +
            " - " +
            fecha.toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit'
            }) +
            " hs";
    });

    res.render("turnos/lista", {
        turnos
    });
};

export const mostrarFormulario = async (req, res) => {

    const [pacientes] = await pool.query(`
        SELECT *
        FROM pacientes
        ORDER BY apellido
    `);

    const [medicos] = await pool.query(`
        SELECT *
        FROM medicos
        WHERE estado='activo'
        ORDER BY apellido
    `);

    res.render("turnos/nuevo", {
        pacientes,
        medicos
    });
};

export const guardarTurno = async (req, res) => {

    const {
        dni_paciente,
        id_medico,
        fecha_solicitada,
        motivo
    } = req.body;

    const ahora = new Date();

    const fechaTurno =
        new Date(fecha_solicitada);

    if(fechaTurno <= ahora){

        return res.send(
            "No se puede asignar un turno en una fecha u hora pasada"
        );

    }

    const [[medico]] = await pool.query(`
        SELECT estado
        FROM medicos
        WHERE id_medico = ?
    `, [id_medico]);

    if (!medico || medico.estado !== "activo") {
        return res.send("El médico no está disponible para turnos");
    }

    await pool.query(`
        INSERT INTO turnos
        (
            dni_paciente,
            id_medico,
            fecha_solicitada,
            motivo
        )
        VALUES (?,?,?,?)
    `,[
        dni_paciente,
        id_medico,
        fecha_solicitada,
        motivo
    ]);

    res.redirect("/turnos");
};
