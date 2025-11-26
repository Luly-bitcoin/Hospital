import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// Listar pacientes para elegir
router.get("/", async (req, res) => {
    const [pacientes] = await db.query("SELECT * FROM pacientes ORDER BY apellido");
    res.render("admisiones/listar-pacientes", { pacientes });
});

// Ver camas disponibles para un paciente
router.get("/seleccionar-cama/:dni", async (req, res) => {
    const { dni } = req.params;

    // Traer datos del paciente
    const [[paciente]] = await db.query("SELECT * FROM pacientes WHERE dni = ?", [dni]);

    // Buscar camas que estén libres o higienizando
    const [camas] = await db.query(`
        SELECT c.*, h.numero AS habitacion
        FROM camas c
        JOIN habitaciones h ON c.id_habitacion = h.id_habitacion
        WHERE c.estado IN ('libre','higienizando')
    `);

    res.render("admisiones/seleccionar-cama", { paciente, camas });
});

// Registrar admisión
router.post("/crear", async (req, res) => {
    const { dni, id_cama, motivo } = req.body;

    // Obtener sexo del paciente
    const [[pac]] = await db.query("SELECT sexo FROM pacientes WHERE dni = ?", [dni]);

    // Obtener info de la cama seleccionada
    const [[cama]] = await db.query("SELECT * FROM camas WHERE id_cama = ?", [id_cama]);

    // Verificar si la habitación tiene 2 camas → no mezclar sexo
    const [camasHabitacion] = await db.query(
        "SELECT * FROM camas WHERE id_habitacion = ? AND id_cama != ?",
        [cama.id_habitacion, id_cama]
    );

    if (cama.estado !== "libre" && cama.estado !== "higienizando") {
        return res.send("La cama no está disponible.");
    }

    if (camasHabitacion.length > 0) {
        const otraCama = camasHabitacion[0];
        if (otraCama.estado === "ocupada") {
            // Buscar sexo del paciente en la otra cama
            const [[admOcupada]] = await db.query(
                `SELECT p.sexo 
                 FROM admisiones a 
                 JOIN pacientes p ON p.dni = a.dni_paciente
                 WHERE a.id_cama = ? AND a.estado = 'activa'`,
                [otraCama.id_cama]
            );

            if (admOcupada && admOcupada.sexo !== pac.sexo) {
                return res.send("⚠ No se puede asignar cama a un paciente de sexo distinto en habitación doble.");
            }
        }
    }

    // Registrar admisión
    await db.query(
        "INSERT INTO admisiones (dni_paciente, motivo, id_cama) VALUES (?,?,?)",
        [dni, motivo, id_cama]
    );

    // Actualizar estado de la cama
    await db.query("UPDATE camas SET estado = 'ocupada' WHERE id_cama = ?", [id_cama]);

    res.redirect("/admisiones/confirmacion");
});

// Página de confirmación
router.get("/confirmacion", (req, res) => {
    res.render("admisiones/confirmacion");
});

export default router;
