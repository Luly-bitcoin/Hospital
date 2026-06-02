import pool from "../config/db.js";

export const listarPacientes = async (req, res) => {

    const [pacientes] = await pool.query(
        "SELECT * FROM pacientes"
    );

    res.render("pacientes/lista", {
        pacientes
    });
};

export const mostrarAgregar = (req, res) => {

    res.render("pacientes/agregar");
};

export const agregarPaciente = async (req, res) => {

    const {
        dni,
        nombre,
        apellido,
        sexo,
        fecha_nacimiento,
        telefono,
        localidad
    } = req.body;

    await pool.query(
        `
        INSERT INTO pacientes
        (
            dni,
            nombre,
            apellido,
            sexo,
            fecha_nacimiento,
            telefono,
            localidad,
            edad
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 0)
        `,
        [
            dni,
            nombre,
            apellido,
            sexo,
            fecha_nacimiento,
            telefono,
            localidad
        ]
    );

    res.redirect("/pacientes");
};