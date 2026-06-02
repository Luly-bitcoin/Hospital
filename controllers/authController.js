import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const mostrarLogin = (req, res) => {
    res.render("login");
};

export const login = async (req, res) => {

    try {

        const { usuario, password } = req.body;

        const [rows] = await pool.query(
            "SELECT * FROM usuarios WHERE usuario = ?",
            [usuario]
        );

        if (rows.length === 0) {
            return res.send("Usuario incorrecto");
        }

        const user = rows[0];

        const coincide = await bcrypt.compare(
    password,
    user.password
);

if (!coincide) {
    return res.send("Contraseña incorrecta");
}

        req.session.usuario = user;

        res.redirect("/dashboard");

    } catch (error) {
        console.log(error);
        res.send("Error");
    }
};

export const logout = (req, res) => {

    req.session.destroy(() => {
        res.redirect("/");
    });
};

export const mostrarRegistro = (req, res) => {
    res.render("register");
};

export const registrar = async (req, res) => {

    try {

        const {
            usuario,
            password,
            nombre,
            email,
            id_rol
        } = req.body;

        const [existe] = await pool.query(
            "SELECT * FROM usuarios WHERE usuario=?",
            [usuario]
        );

        if (existe.length > 0) {
            return res.send("El usuario ya existe");
        }

        const hash = await bcrypt.hash(password, 10);

        await pool.query(
            `
            INSERT INTO usuarios
            (
                usuario,
                password,
                nombre,
                email,
                id_rol
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                usuario,
                hash,
                nombre,
                email,
                id_rol
            ]
        );

        res.redirect("/");

    } catch (error) {

        console.log(error);
        res.send("Error al registrar");
    }
};