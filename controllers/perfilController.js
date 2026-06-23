import pool from "../config/db.js";

export const mostrarPerfil = async (req, res) => {

    const idUsuario =
        req.session.usuario.id_usuario;

    const [usuarios] = await pool.query(`
        SELECT
            u.*,
            r.nombre AS rol
        FROM usuarios u
        JOIN roles r
            ON u.id_rol = r.id_rol
        WHERE u.id_usuario = ?
    `, [idUsuario]);

    if (usuarios.length === 0) {
        return res.redirect("/dashboard");
    }

    res.render(
        "perfil/perfil",
        {
            usuario: usuarios[0]
        }
    );
};