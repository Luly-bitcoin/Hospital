import pool from "../config/db.js";
import { validarDNI,
        soloTexto,
        validarTelefono,
        validarFechaNacimiento,
        validarEmail,
        validarMatricula
    } from "../middlewares/validaciones.js";

export const listarMedicos = async (req, res) => {

    const [medicos] = await pool.query(`
        SELECT *
        FROM medicos
        ORDER BY apellido,nombre
    `);

    res.render("medicos/lista", {
        medicos
    });
};

export const mostrarFormulario = (req, res) => {

    res.render("medicos/nuevo");
};

export const guardarMedico = async (req, res) => {

    const {
        dni,
        nombre,
        apellido,
        sexo,
        fecha_nacimiento,
        telefono,
        correo_electronico,
        especialidad,
        matricula
    } = req.body;

    if(!validarDNI(dni) || !soloTexto(nombre) || !soloTexto(apellido) || !validarSexo(sexo) || !validarFechaNacimiento(fecha_nacimiento) || !validarTelefono(telefono) || !validarEmail(correo_electronico) || !soloTexto(especialidad) || !validarMatricula(matricula)) {
        return res.status(400).json({ error: "Datos inválidos" });
    }

    await pool.query(`
        INSERT INTO medicos
        (
            dni,
            nombre,
            apellido,
            sexo,
            fecha_nacimiento,
            telefono,
            correo_electronico,
            especialidad,
            matricula
        )
        VALUES (?,?,?,?,?,?,?,?,?)
    `,[
        dni,
        nombre,
        apellido,
        sexo,
        fecha_nacimiento,
        telefono,
        correo_electronico,
        especialidad,
        matricula
    ]);

    res.redirect("/medicos");
};