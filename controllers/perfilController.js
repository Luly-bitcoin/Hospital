import pool from "../config/db.js";
import bcrypt from "bcryptjs";

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

export const mostrarVistaPassword = (req,res)=>{

    res.render(
        "perfil/cambiar-password",
        {
            error:null,
            success:null
        }
    );

};

export const mostrarVistaRol = async(req,res)=>{

    const idUsuario =
    req.session.usuario.id_usuario;

    const [usuarios] =
    await pool.query(`
        SELECT
            u.*,
            r.nombre AS rol
        FROM usuarios u
        JOIN roles r
            ON u.id_rol = r.id_rol
        WHERE u.id_usuario = ?
    `,[idUsuario]);

    res.render(
        "perfil/cambiar-rol",
        {
            usuario:usuarios[0],
            error:null,
            success:null
        }
    );

};

export const cambiarPassword = async (req, res) => {

    try {

        const {
            passwordActual,
            passwordNueva,
            confirmPassword
        } = req.body;

        const idUsuario =
            req.session.usuario.id_usuario;

        if (passwordNueva !== confirmPassword) {

            return res.render(
                "perfil/cambiar-password",
                {
                    error: "Las nuevas contraseñas no coinciden",
                    success: null
                }
            );

        }

        const [usuarios] =
            await pool.query(
                `
                SELECT *
                FROM usuarios
                WHERE id_usuario = ?
                `,
                [idUsuario]
            );

        const usuario =
            usuarios[0];

        const coincide =
            await bcrypt.compare(
                passwordActual,
                usuario.password
            );

        if (!coincide) {

            return res.render(
                "perfil/cambiar-password",
                {
                    error: "La contraseña actual es incorrecta",
                    success: null
                }
            );

        }

        const hash =
            await bcrypt.hash(
                passwordNueva,
                10
            );

        await pool.query(
            `
            UPDATE usuarios
            SET password = ?
            WHERE id_usuario = ?
            `,
            [
                hash,
                idUsuario
            ]
        );

        res.render(
            "perfil/cambiar-password",
            {
                error: null,
                success: "Contraseña actualizada correctamente"
            }
        );

    } catch (error) {

        console.log(error);

        res.render(
            "perfil/cambiar-password",
            {
                error: "Error al actualizar contraseña",
                success: null
            }
        );

    }

};

export const cambiarRol = async (req, res) => {

    try {

        const {
            rol,
            codigoRol
        } = req.body;

        const idUsuario =
            req.session.usuario.id_usuario;

        const [roles] =
            await pool.query(
                `
                SELECT *
                FROM roles
                WHERE nombre = ?
                `,
                [rol]
            );

        if (roles.length === 0) {

            return res.render(
                "perfil/cambiar-rol",
                {
                    usuario: req.session.usuario,
                    error: "Rol inválido",
                    success: null
                }
            );

        }

        const idRol =
            roles[0].id_rol;

        const [codigos] =
            await pool.query(
                `
                SELECT *
                FROM codigos_roles
                WHERE id_rol = ?
                AND codigo = ?
                AND activo = 1
                `,
                [
                    idRol,
                    codigoRol
                ]
            );

        if (codigos.length === 0) {

            return res.render(
                "perfil/cambiar-rol",
                {
                    usuario: req.session.usuario,
                    error: "Código de rol incorrecto",
                    success: null
                }
            );

        }

        await pool.query(
            `
            UPDATE usuarios
            SET id_rol = ?
            WHERE id_usuario = ?
            `,
            [
                idRol,
                idUsuario
            ]
        );

        req.session.usuario.id_rol =
            idRol;

        const [usuarioActualizado] =
            await pool.query(
                `
                SELECT
                    u.*,
                    r.nombre AS rol
                FROM usuarios u
                JOIN roles r
                    ON u.id_rol = r.id_rol
                WHERE u.id_usuario = ?
                `,
                [idUsuario]
            );

        res.render(
            "perfil/cambiar-rol",
            {
                usuario: usuarioActualizado[0],
                error: null,
                success: "Rol actualizado correctamente"
            }
        );

    } catch (error) {

        console.log(error);

        res.redirect("/perfil");

    }

};

export const editarPerfil = async (req,res)=>{

    try{

        const {
            nombre,
            apellido,
            email
        } = req.body;

        const idUsuario =
        req.session.usuario.id_usuario;

        const soloTexto =
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

        if(!soloTexto.test(nombre)){
            return res.status(400).send(
                "Nombre inválido"
            );
        }

        if(!soloTexto.test(apellido)){
            return res.status(400).send(
                "Apellido inválido"
            );
        }

        const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).send(
                "Correo electrónico inválido"
            );
        }

        await pool.query(
            `
            UPDATE usuarios
            SET
                nombre=?,
                apellido=?,
                email=?
            WHERE id_usuario=?
            `,
            [
                nombre,
                apellido,
                email,
                idUsuario
            ]
        );

        req.session.usuario.nombre =
        nombre;

        req.session.usuario.apellido =
        apellido;

        req.session.usuario.email =
        email;

        res.redirect("/perfil");

    }catch(error){

        console.log(error);

        res.redirect("/perfil");

    }

};