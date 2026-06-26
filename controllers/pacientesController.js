import pool from "../config/db.js";
import {
    soloTexto,
    validarDNI,
    validarTelefono,
    validarFechaNacimiento,
    validarLocalidad,
} from "../middlewares/validaciones.js";

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

    if(!validarDNI(dni) || !soloTexto(nombre) || !soloTexto(apellido) || !validarFechaNacimiento(fecha_nacimiento) || !validarTelefono(telefono) || !validarLocalidad(localidad)) {
        return res.status(400).json({ error: "Datos inválidos" });
    }

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

export const mostrarEditar = async (req, res) => {

    const { dni } = req.params;

    const [pacientes] = await pool.query(
        "SELECT * FROM pacientes WHERE dni = ?",
        [dni]
    );

    if (pacientes.length === 0) {
        return res.redirect("/pacientes");
    }

    res.render("pacientes/editar", {
        paciente: pacientes[0]
    });
};

export const editarPaciente = async (req, res) => {

    const { dni } = req.params;

    const {
        nombre,
        apellido,
        sexo,
        fecha_nacimiento,
        telefono,
        localidad
    } = req.body;

    if(!validarDNI(dni) || !soloTexto(nombre) || !soloTexto(apellido) || !validarFechaNacimiento(fecha_nacimiento) || !validarTelefono(telefono) || !validarLocalidad(localidad)) {
         return res.status(400).json({ error: "Datos inválidos" });
    }

    await pool.query(

        `
        UPDATE pacientes
        SET
            nombre = ?,
            apellido = ?,
            sexo = ?,
            fecha_nacimiento = ?,
            telefono = ?,
            localidad = ?
        WHERE dni = ?
        `,
        [
            nombre,
            apellido,
            sexo,
            fecha_nacimiento,
            telefono,
            localidad,
            dni
        ]
    );

    res.redirect("/pacientes");
};