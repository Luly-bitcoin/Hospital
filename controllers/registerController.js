import pool from "../config/db.js";
import bcrypt from "bcryptjs";

export const mostrarRegistro = (req, res) => {

    res.render("register", {
        error: null
    });

};

export const registrarUsuario = async (req, res) => {

    try{

        const {
            nombre,
            apellido,
            dni,
            matricula,
            email,
            usuario,
            password,
            confirmPassword,
            rol,
            codigoRol
        } = req.body;

        if(
            !nombre ||
            !apellido ||
            !dni ||
            !matricula ||
            !email ||
            !usuario ||
            !password ||
            !confirmPassword ||
            !rol ||
            !codigoRol
        ){
            return res.render("register",{
                error:"Todos los campos son obligatorios"
            });
        }

        const soloTexto =
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

        if(!soloTexto.test(nombre)){
            return res.render("register",{
                error:"Nombre inválido"
            });
        }

        if(!soloTexto.test(apellido)){
            return res.render("register",{
                error:"Apellido inválido"
            });
        }

        if(!/^\d{7,8}$/.test(dni)){
            return res.render("register",{
                error:"DNI inválido"
            });
        }

        if(password !== confirmPassword){
            return res.render("register",{
                error:"Las contraseñas no coinciden"
            });
        }

        const [roles] =
        await pool.query(
            `
            SELECT *
            FROM roles
            WHERE nombre=?
            `,
            [rol]
        );

        if(roles.length === 0){
            return res.render("register",{
                error:"Rol inválido"
            });
        }

        const [codigos] =
        await pool.query(
            `
            SELECT *
            FROM codigos_roles
            WHERE id_rol=?
            AND codigo=?
            AND activo=1
            `,
            [
                roles[0].id_rol,
                codigoRol
            ]
        );

        if(codigos.length === 0){
            return res.render("register",{
                error:"Código de rol incorrecto"
            });
        }

        const [usuarios] =
        await pool.query(
            `
            SELECT *
            FROM usuarios
            WHERE usuario=?
            `,
            [usuario]
        );

        if(usuarios.length > 0){
            return res.render("register",{
                error:"El usuario ya existe"
            });
        }

       const passwordHash = await bcrypt.hash(password, 10);

        await pool.query(
            `
            INSERT INTO usuarios
            (
                usuario,
                password,
                nombre,
                apellido,
                dni,
                matricula,
                email,
                id_rol
            )
            VALUES
            (?,?,?,?,?,?,?,?)
            `,
            [
                usuario,
                passwordHash,
                nombre,
                apellido,
                dni,
                matricula,
                email,
                roles[0].id_rol
            ]
        );
        res.redirect("/");

    }catch(error){

        console.log(error);

        res.render("register",{
            error:"Error al registrar usuario"
        });

    }

};