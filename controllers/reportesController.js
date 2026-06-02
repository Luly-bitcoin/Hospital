import pool from "../config/db.js";

export const dashboardReportes = async (req, res) => {

    const [[pacientes]] = await pool.query(`
        SELECT COUNT(*) total
        FROM pacientes
        WHERE activo = 1
    `);

    const [[medicos]] = await pool.query(`
        SELECT COUNT(*) total
        FROM medicos
        WHERE estado='activo'
    `);

    const [[turnos]] = await pool.query(`
        SELECT COUNT(*) total
        FROM turnos
        WHERE estado='pendiente'
    `);

    const [[internados]] = await pool.query(`
        SELECT COUNT(*) total
        FROM admisiones
        WHERE estado='activa'
    `);

    const [[camasLibres]] = await pool.query(`
        SELECT COUNT(*) total
        FROM camas
        WHERE estado='libre'
    `);

    const [[camasOcupadas]] = await pool.query(`
        SELECT COUNT(*) total
        FROM camas
        WHERE estado='ocupada'
    `);

    res.render("reportes/dashboard", {
        pacientes: pacientes.total,
        medicos: medicos.total,
        turnos: turnos.total,
        internados: internados.total,
        camasLibres: camasLibres.total,
        camasOcupadas: camasOcupadas.total
    });
};