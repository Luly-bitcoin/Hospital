import pool from "../config/db.js";

export const listarEmergencias = async (req, res) => {

    const [emergencias] = await pool.query(`
        SELECT
            e.*,
            c.codigo AS cama_codigo,
            p.nombre,
            p.apellido

        FROM emergencias e

        LEFT JOIN camas c
            ON c.id_cama = e.id_cama

        LEFT JOIN pacientes p
            ON p.dni = e.dni_paciente

        ORDER BY e.fecha_ingreso DESC
    `);

    res.render(
        "emergencias/lista",
        { emergencias }
    );
};

export const mostrarFormulario = async (req, res) => {

    const [camas] = await pool.query(`
        SELECT
            c.id_cama,
            c.codigo

        FROM camas c

        JOIN habitaciones h
            ON h.id_habitacion = c.id_habitacion

        WHERE
            h.id_ala = 3
            AND c.estado='libre'
    `);

    res.render(
        "emergencias/nuevo",
        { camas }
    );
};

export const guardarEmergencia = async (req, res) => {

    const {
        sexo,
        descripcion,
        id_cama
    } = req.body;

    const codigo =
        "EMG-" +
        Date.now();

    await pool.query(`
        INSERT INTO emergencias
        (
            codigo_temporal,
            sexo,
            descripcion,
            id_cama
        )
        VALUES
        (
            ?,?,?,?
        )
    `,
    [
        codigo,
        sexo,
        descripcion,
        id_cama
    ]);

    await pool.query(`
        UPDATE camas
        SET estado='ocupada'
        WHERE id_cama=?
    `,
    [id_cama]);

    res.redirect("/emergencias");
};

export const mostrarIdentificacion = async (req, res) => {

    const id = req.params.id;

    const [pacientes] = await pool.query(`
        SELECT *
        FROM pacientes
        ORDER BY apellido,nombre
    `);

    const [emergencia] = await pool.query(`
        SELECT *
        FROM emergencias
        WHERE id_emergencia=?
    `,
    [id]);

    res.render(
        "emergencias/identificar",
        {
            pacientes,
            emergencia: emergencia[0]
        }
    );
};

export const identificarPaciente = async (req, res) => {

    const id = req.params.id;

    const {
        dni_paciente
    } = req.body;

    await pool.query(`
        UPDATE emergencias
        SET
            dni_paciente=?,
            estado='identificado'
        WHERE id_emergencia=?
    `,
    [
        dni_paciente,
        id
    ]);

    res.redirect("/emergencias");
};

export const mostrarCambioCama = async (req,res)=>{

    const { id } = req.params;

    const [emergencias] =
    await pool.query(`
        SELECT *
        FROM emergencias
        WHERE id_emergencia = ?
    `,[id]);

    if(
        emergencias.length === 0 ||
        emergencias[0].estado === "sin_identificar"
    ){
        return res.redirect("/emergencias");
    }

    const [camas] =
    await pool.query(`
        SELECT *
        FROM camas
        WHERE estado='libre'
    `);

    res.render(
        "emergencias/cambiar-cama",
        {
            emergencia:emergencias[0],
            camas
        }
    );

};

export const guardarCambioCama = async (req,res)=>{

    try{

        const {
            id_emergencia,
            id_cama
        } = req.body;

        const [emergencias] =
        await pool.query(`
            SELECT *
            FROM emergencias
            WHERE id_emergencia=?
        `,[id_emergencia]);

        if(emergencias.length===0){
            return res.redirect("/emergencias");
        }

        const emergencia = emergencias[0];

        const [[camaNueva]] =
        await pool.query(`
            SELECT id_habitacion
            FROM camas
            WHERE id_cama=?
        `,[id_cama]);

        if(!camaNueva){
            return res.send("La cama seleccionada no existe.");
        }

        const [ocupantes] =
        await pool.query(`
            SELECT
                p.sexo
            FROM admisiones a
            JOIN pacientes p
                ON p.dni = a.dni_paciente
            JOIN camas c
                ON c.id_cama = a.id_cama
            WHERE c.id_habitacion = ?
            AND a.estado='activa'
        `,[
            camaNueva.id_habitacion
        ]);

        const [[paciente]] =
        await pool.query(`
            SELECT sexo
            FROM pacientes
            WHERE dni = ?
        `,[
            emergencia.dni_paciente
        ]);

        if(!paciente){
            return res.send("No se encontró el paciente.");
        }

        for(const ocupante of ocupantes){

            if(
                ocupante.sexo !== paciente.sexo
            ){

                return res.send(
                    "No puede moverse a una habitación con pacientes de distinto sexo."
                );

            }

        }

        const camaUrgencia = emergencia.id_cama;

        await pool.query(`
            INSERT INTO admisiones
            (
                dni_paciente,
                motivo,
                estado,
                id_cama
            )
            VALUES
            (
                ?, ?, 'activa', ?
            )
        `,[
            emergencia.dni_paciente,
            emergencia.descripcion,
            id_cama
        ]);

        await pool.query(`
            UPDATE camas
            SET estado='ocupada'
            WHERE id_cama=?
        `,[id_cama]);

        await pool.query(`
            UPDATE camas
            SET estado='libre'
            WHERE id_cama=?
        `,[camaUrgencia]);

        await pool.query(`
            DELETE FROM emergencias
            WHERE id_emergencia=?
        `,[id_emergencia]);

        res.redirect("/emergencias");

    }catch(error){

        console.error(error);

        return res
            .status(500)
            .send(error.message);

    }

};
export const darAltaEmergencia = async (req,res)=>{

    const { id } = req.params;

    const [emergencias] =
    await pool.query(`
        SELECT *
        FROM emergencias
        WHERE id_emergencia=?
    `,[id]);

    if(emergencias.length===0){
        return res.redirect("/emergencias");
    }

    const emergencia =
    emergencias[0];

    await pool.query(`
        UPDATE camas
        SET estado='higienizando'
        WHERE id_cama=?
    `,[emergencia.id_cama]);

    await pool.query(`
        DELETE FROM emergencias
        WHERE id_emergencia=?
    `,[id]);

    res.redirect("/emergencias");

};