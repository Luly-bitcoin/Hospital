import { buscarPacientePorDni } from "../models/Paciente.js";
import { getMedicos } from "../models/medico.js";
import { getTurnosPendientes, agregarTurno, cancelarTurno, getTurnoById, actualizarTurno, verificarDisponibilidadMedico } from "../models/Turno.js";

export const vistaTurnos = async (req, res) => {
  const turnos = await getTurnosPendientes();
  const medicos = await getMedicos();
  res.render("turnos", { turnos, medicos });
};

export const buscarPaciente = async (req, res) => {
  const { dni } = req.body;
  const paciente = await buscarPacientePorDni(dni);
  if(paciente){
    res.json({ success: true, paciente });
  } else {
    res.json({ success: false, message: "Paciente no registrado" });
  }
};

export const crearTurno = async (req, res) => {
  const { dni_paciente, id_medico, fecha_solicitada, motivo } = req.body;
  const fechaTurno = new Date(fecha_solicitada);
  const ahora = new Date();

  // Validar horario de hospital (07 a 22hs)
  const hora = fechaTurno.getHours();
  if(hora < 7 || hora >= 22) return res.json({ success: false, message: "Horario fuera del horario de atención" });

  // Validar 24h antes
  if(fechaTurno - ahora < 24*60*60*1000) return res.json({ success: false, message: "Debe pedir turno con al menos 24h de anticipación" });

  // Validar disponibilidad médico
  const disponible = await verificarDisponibilidadMedico(id_medico, fecha_solicitada);
  if(!disponible) return res.json({ success: false, message: "El médico ya tiene un turno a esa hora" });

  // Guardar turno
  await agregarTurno({ dni_paciente, id_medico, fecha_solicitada, motivo, usuario_registra: 1 });
  res.json({ success: true, message: "Turno creado correctamente" });
};

export const eliminarTurno = async (req, res) => {
  const { id_turno } = req.params;
  await cancelarTurno(id_turno);
  res.json({ success: true });
};

export const editarTurno = async (req, res) => {
  const { id_turno } = req.params;
  const turno = await getTurnoById(id_turno);
  res.json({ success: true, turno });
};

export const actualizarTurnoController = async (req, res) => {
  const { id_turno, id_medico, fecha_solicitada, motivo } = req.body;
  const turno = await getTurnoById(id_turno);
  const fechaTurno = new Date(fecha_solicitada);
  const ahora = new Date();

  // Validar edición 8h antes
  if(fechaTurno - ahora < 8*60*60*1000) return res.json({ success: false, message: "No se puede editar el turno a menos de 8 horas" });

  // Validar disponibilidad médico
  const disponible = await verificarDisponibilidadMedico(id_medico, fecha_solicitada, id_turno);
  if(!disponible) return res.json({ success: false, message: "El médico ya tiene un turno a esa hora" });

  await actualizarTurno({ id_turno, id_medico, fecha_solicitada, motivo });
  res.json({ success: true, message: "Turno actualizado" });
};
