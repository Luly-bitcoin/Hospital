import { verificarDisponibilidadMedico, getTurnoById } from "../models/Turno.js";

export const validarNuevoTurno = async (req, res, next) => {
  try {
    const { fecha_solicitada, id_medico } = req.body;
    const fechaTurno = new Date(fecha_solicitada);
    const ahora = new Date();

    // Validar horario de hospital (07 a 22hs)
    const hora = fechaTurno.getHours();
    if (hora < 7 || hora >= 22) return res.json({ success: false, message: "Horario fuera del horario de atención (07-22)" });

    // Validar 24h antes
    if (fechaTurno - ahora < 24*60*60*1000) return res.json({ success: false, message: "Debe pedir turno con al menos 24h de anticipación" });

    // Validar disponibilidad del médico
    const disponible = await verificarDisponibilidadMedico(id_medico, fecha_solicitada);
    if (!disponible) return res.json({ success: false, message: "El médico ya tiene un turno a esa hora" });

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al validar turno" });
  }
};

export const validarEdicionTurno = async (req, res, next) => {
  try {
    const { id_turno } = req.params;
    const { fecha_solicitada, id_medico } = req.body;
    const fechaTurno = new Date(fecha_solicitada);
    const ahora = new Date();

    const turno = await getTurnoById(id_turno);
    if (!turno) return res.json({ success: false, message: "Turno no encontrado" });

    // Validar edición 8h antes
    if (fechaTurno - ahora < 8*60*60*1000) return res.json({ success: false, message: "No se puede editar el turno a menos de 8 horas" });

    // Validar disponibilidad del médico (excepto este turno)
    const disponible = await verificarDisponibilidadMedico(id_medico, fecha_solicitada, id_turno);
    if (!disponible) return res.json({ success: false, message: "El médico ya tiene un turno a esa hora" });

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al validar edición de turno" });
  }
};
