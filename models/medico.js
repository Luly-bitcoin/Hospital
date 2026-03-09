import db from "../config/db.js";

export const getMedicos = async () => {
  const [rows] = await db.query("SELECT id_medico, nombre, apellido, especialidad FROM medicos WHERE estado = 'activo'");
  return rows;
};
