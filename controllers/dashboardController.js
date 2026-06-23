import pool from "../config/db.js";

export const mostrarDashboard = async (req, res) => {

    const [[internados]] = await pool.query(`
        SELECT COUNT(*) total
        FROM admisiones
        WHERE estado='activa'
    `);

    const [[libres]] = await pool.query(`
        SELECT COUNT(*) total
        FROM camas
        WHERE estado='libre'
    `);

    const [[ocupadas]] = await pool.query(`
        SELECT COUNT(*) total
        FROM camas
        WHERE estado='ocupada'
    `);

    const [[higienizando]] = await pool.query(`
        SELECT COUNT(*) total
        FROM camas
        WHERE estado='higienizando'
    `);

    const [[altasHoy]] = await pool.query(`
        SELECT COUNT(*) total
        FROM altas
        WHERE DATE(fecha_alta)=CURDATE()
    `);

    res.render("dashboard", {
        internados: internados.total,
        libres: libres.total,
        ocupadas: ocupadas.total,
        higienizando: higienizando.total,
        altasHoy: altasHoy.total,

        usuario: req.session.usuario.usuario
    });
};