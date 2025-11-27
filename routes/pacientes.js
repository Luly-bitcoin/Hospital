import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// ====== Registro de paciente ======
// Formulario de registro
router.get("/registrar", (req, res) => {
  res.render("pacientes/registrar");
});

// Guardar paciente
router.post("/guardar", async (req, res) => {
  const {
    dni,
    nombre,
    apellido,
    direccion,
    localidad,
    fecha_nacimiento,
    telefono,
    tel_emergencia,
    nombre_dueno,
    sexo
  } = req.body;

  // Validación mínima
  if (!dni || !nombre || !apellido || !direccion || !localidad || !telefono) {
    return res.send("Faltan datos obligatorios.");
  }

  try {
    const [[existe]] = await db.query("SELECT dni FROM pacientes WHERE dni = ?", [dni]);
    if (existe) return res.send("Paciente existente");

    await db.query(
      `INSERT INTO pacientes 
        (dni, nombre, apellido, direccion, localidad, fecha_nacimiento, telefono, tel_emergencia, nombre_dueno, sexo, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        dni,
        nombre,
        apellido,
        direccion,
        localidad,
        fecha_nacimiento || null,
        telefono,
        tel_emergencia || null,
        nombre_dueno || null,
        sexo || null
      ]
    );

    res.redirect("/pacientes/lista-pacientes");
  } catch (err) {
    console.error(err);
    res.send("Error al guardar paciente");
  }
});

// ====== Listado de pacientes ======
router.get("/lista-pacientes", async (req, res) => {
  try {
    const [pacientes] = await db.query("SELECT * FROM pacientes WHERE activo = 1");
    res.render("pacientes/lista-pacientes", { pacientes });
  } catch (err) {
    console.error(err);
    res.send("Error al cargar lista de pacientes");
  }
});

// ====== Edición de paciente ======
router.get("/editar/:dni", async (req, res) => {
  const { dni } = req.params;
  try {
    const [[paciente]] = await db.query("SELECT * FROM pacientes WHERE dni = ?", [dni]);
    if (!paciente) return res.send("Paciente no encontrado");
    res.render("pacientes/editar-paciente", { paciente });
  } catch (err) {
    console.error(err);
    res.send("Error al cargar paciente");
  }
});

router.post("/editar/:dni", async (req, res) => {
  const { dni } = req.params;
  const {
    nombre,
    apellido,
    direccion,
    localidad,
    fecha_nacimiento,
    telefono,
    tel_emergencia,
    nombre_dueno,
    sexo
  } = req.body;

  try {
    await db.query(
      `UPDATE pacientes SET 
        nombre = ?, apellido = ?, direccion = ?, localidad = ?, fecha_nacimiento = ?, 
        telefono = ?, tel_emergencia = ?, nombre_dueno = ?, sexo = ?
       WHERE dni = ?`,
      [nombre, apellido, direccion, localidad, fecha_nacimiento, telefono, tel_emergencia, nombre_dueno, sexo, dni]
    );

    res.redirect("/pacientes/lista-pacientes");
  } catch (err) {
    console.error(err);
    res.send("Error al actualizar paciente");
  }
});

// ====== Ver paciente con historial ======
router.get("/ver/:dni", async (req, res) => {
  const { dni } = req.params;
  try {
    const [[paciente]] = await db.query("SELECT * FROM pacientes WHERE dni = ?", [dni]);
    if (!paciente) return res.status(404).send("Paciente no encontrado");

    const [admisiones] = await db.query(
      `SELECT a.*, c.codigo AS cama_codigo, h.numero AS habitacion_numero, al.nombre AS ala_nombre,
              ur.id_usuario AS usuario_id, ur.nombre AS usuario_nombre, rr.nombre AS usuario_rol
       FROM admisiones a
       LEFT JOIN camas c ON a.id_cama = c.id_cama
       LEFT JOIN habitaciones h ON c.id_habitacion = h.id_habitacion
       LEFT JOIN alas al ON h.id_ala = al.id_ala
       LEFT JOIN usuarios ur ON a.usuario_registra = ur.id_usuario
       LEFT JOIN roles rr ON ur.id_rol = rr.id_rol
       WHERE a.dni_paciente = ?
       ORDER BY a.fecha_ingreso DESC`,
      [dni]
    );

    res.render("pacientes/ver-paciente", { paciente, admisiones });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar la información del paciente");
  }
});

// ====== API para frontend dinámico ======
router.get("/api/pacientes", async (req, res) => {
  const buscar = req.query.buscar || "";
  try {
    const [rows] = await db.query(
      `SELECT dni, nombre, apellido FROM pacientes
       WHERE activo = 1 
       AND (dni LIKE ? OR nombre LIKE ? OR apellido LIKE ?)`,
      [`%${buscar}%`, `%${buscar}%`, `%${buscar}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

router.delete("/api/pacientes/:dni", async (req, res) => {
  const { dni } = req.params;
  try {
    await db.query("UPDATE pacientes SET activo = 0 WHERE dni = ?", [dni]);
    res.json({ success: true, message: "Paciente desactivado correctamente" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error al desactivar paciente" });
  }
});

// ====== BUSCAR PACIENTE POR DNI (AJAX) ======
router.get("/buscar", async (req, res) => {
  const { dni } = req.query;
  if (!dni) return res.json({ existe: false });

  try {
    const [[paciente]] = await db.query("SELECT * FROM pacientes WHERE dni = ?", [dni]);
    if (!paciente) return res.json({ existe: false });

    res.json({ existe: true, datos: paciente });
  } catch (err) {
    console.error(err);
    res.status(500).json({ existe: false });
  }
});


export default router;
