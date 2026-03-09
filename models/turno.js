import db from "../config/db.js";

export const getTurnosPendientes = async () => {
  const [rows] = await db.query(`
    SELECT t.id_turno, t.fecha_solicitada, t.estado, t.motivo,
           p.nombre AS nombre_paciente, p.apellido AS apellido_paciente,
           m.nombre AS nombre_medico, m.apellido AS apellido_medico
    FROM turnos t
    JOIN pacientes p ON t.dni_paciente = p.dni
    JOIN medicos m ON t.id_medico = m.id_medico
    WHERE t.estado = 'pendiente'
    ORDER BY t.fecha_solicitada ASC
  `);
  return rows;
};

export const agregarTurno = async (turno) => {
  const { dni_paciente, id_medico, fecha_solicitada, motivo, usuario_registra } = turno;
  const [result] = await db.query(
    "INSERT INTO turnos (dni_paciente, id_medico, fecha_solicitada, motivo, usuario_registra) VALUES (?,?,?,?,?)",
    [dni_paciente, id_medico, fecha_solicitada, motivo, usuario_registra]
  );
  return result.insertId;
};

export const cancelarTurno = async (id_turno) => {
  await db.query("UPDATE turnos SET estado='cancelado' WHERE id_turno = ?", [id_turno]);
};

export const getTurnoById = async (id_turno) => {
  const [rows] = await db.query("SELECT * FROM turnos WHERE id_turno = ?", [id_turno]);
  return rows[0];
};

export const actualizarTurno = async (turno) => {
  const { id_turno, id_medico, fecha_solicitada, motivo } = turno;
  await db.query("UPDATE turnos SET id_medico=?, fecha_solicitada=?, motivo=? WHERE id_turno=?", 
  [id_medico, fecha_solicitada, motivo, id_turno]);
};

export const verificarDisponibilidadMedico = async (id_medico, fecha_solicitada, id_turno = null) => {
  let query = "SELECT * FROM turnos WHERE id_medico=? AND fecha_solicitada=? AND estado='pendiente'";
  let params = [id_medico, fecha_solicitada];
  if(id_turno) { 
    query += " AND id_turno <> ?";
    params.push(id_turno);
  }
  const [rows] = await db.query(query, params);
  return rows.length === 0;
};
