import db from "../config/db.js";

export const buscarPacientePorDni = async (dni) => {
  const [rows] = await db.query("SELECT dni, nombre, apellido, fecha_nacimiento, telefono FROM pacientes WHERE dni = ?", [dni]);
  return rows[0];
};
