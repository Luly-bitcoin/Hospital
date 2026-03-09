import { Router } from "express";
import { vistaTurnos, buscarPaciente, crearTurno, eliminarTurno, editarTurno, actualizarTurnoController } from "../controllers/turnosController.js";
import { validarNuevoTurno, validarEdicionTurno } from "../middlewares/validarTurno.js";
import { getMedicos } from "../models/medico.js";
import db from "../config/db.js";

const router = Router();

// Vista principal de turnos
router.get("/", vistaTurnos);

// Nueva vista para crear turno
router.get("/nuevo", async (req, res) => {
  const medicos = await getMedicos();
  res.render("turnos_nuevo", { medicos });
});

router.post("/buscar-paciente", async (req,res) => {
  const { dni } = req.body;
  try {
    const [rows] = await db.query(
      "SELECT nombre, apellido, fecha_nacimiento, telefono FROM pacientes WHERE dni = ?",
      [dni]
    );
    if(rows.length > 0) {
      res.json({ existe: true, paciente: rows[0] });
    } else {
      res.json({ existe: false });
    }
  } catch(err) {
    console.error(err);
    res.status(500).json({ existe: false });
  }
});


router.post("/crear", validarNuevoTurno, crearTurno);
router.delete("/cancelar/:id_turno", eliminarTurno);
router.get("/editar/:id_turno", editarTurno);
router.put("/actualizar/:id_turno", validarEdicionTurno, actualizarTurnoController);

export default router;
