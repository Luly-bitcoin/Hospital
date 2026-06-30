import pool from "../config/db.js";

export const listarAdmisiones = async (req, res) => {

    const [admisiones] = await pool.query(`
        SELECT
            a.id_admision,
            a.fecha_ingreso,
            a.estado,
            p.nombre,
            p.apellido,
            c.codigo
        FROM admisiones a
        JOIN pacientes p ON a.dni_paciente = p.dni
        LEFT JOIN camas c ON a.id_cama = c.id_cama
        ORDER BY a.id_admision DESC
    `);

    admisiones.forEach(admision => {

        admision.fecha_formateada =
            new Date(admision.fecha_ingreso)
            .toLocaleString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

    });

    res.render("admisiones/lista", {
        admisiones
    });
};

export const mostrarNuevaAdmision = async (req, res) => {

    const [pacientes] = await pool.query(`
        SELECT
            p.dni,
            p.nombre,
            p.apellido
        FROM pacientes p
        WHERE p.activo = 1
        AND p.dni NOT IN (
            SELECT a.dni_paciente
            FROM admisiones a
            WHERE a.estado = 'activa'
        )
    `);

   const [camas] = await pool.query(`
        SELECT
            c.id_cama,
            c.codigo,
            c.id_habitacion
        FROM camas c
        WHERE c.estado='libre'
    `);

    res.render("admisiones/nueva", {
        pacientes,
        camas
    });
};

export const guardarAdmision = async (req, res) => {

    try{

        const {
            dni_paciente,
            motivo,
            id_cama
        } = req.body;

        const [[paciente]] =
        await pool.query(`
            SELECT sexo
            FROM pacientes
            WHERE dni = ?
        `,[dni_paciente]);

        const [[cama]] =
        await pool.query(`
            SELECT
                c.id_cama,
                h.id_habitacion
            FROM camas c
            JOIN habitaciones h
                ON c.id_habitacion = h.id_habitacion
            WHERE c.id_cama = ?
        `,[id_cama]);

        const [ocupantes] =
        await pool.query(`
            SELECT
                p.sexo
            FROM camas c
            JOIN admisiones a
                ON a.id_cama = c.id_cama
                AND a.estado = 'activa'
            JOIN pacientes p
                ON p.dni = a.dni_paciente
            WHERE c.id_habitacion = ?
        `,[cama.id_habitacion]);

        for(const ocupante of ocupantes){

            if(
                ocupante.sexo !== paciente.sexo
            ){

                return res.send(
                    "No se puede internar pacientes de distinto sexo en la misma habitación."
                );

            }

        }

        await pool.query(`
            INSERT INTO admisiones
            (
                dni_paciente,
                motivo,
                estado,
                id_cama
            )
            VALUES (?, ?, 'activa', ?)
        `,[
            dni_paciente,
            motivo,
            id_cama
        ]);

        await pool.query(`
            UPDATE camas
            SET estado='ocupada'
            WHERE id_cama=?
        `,[id_cama]);

        res.redirect("/admisiones");

    }catch(error){

        console.log(error);

        res.send(
            "Error al registrar admisión"
        );

    }

};