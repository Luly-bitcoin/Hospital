import pool from "../config/db.js";

export const verCamas = async (req, res) => {

    const [camas] = await pool.query(`
    SELECT

        a.id_ala,
        a.nombre AS ala,

        h.id_habitacion,
        h.numero AS habitacion,

        c.id_cama,
        c.codigo,
        c.estado,

        p.nombre AS paciente_nombre,
        p.apellido AS paciente_apellido

    FROM alas a

    LEFT JOIN habitaciones h
        ON h.id_ala = a.id_ala

    LEFT JOIN camas c
        ON c.id_habitacion = h.id_habitacion

    LEFT JOIN admisiones ad
        ON ad.id_cama = c.id_cama
        AND ad.estado = 'activa'

    LEFT JOIN pacientes p
        ON p.dni = ad.dni_paciente

    ORDER BY
        a.nombre,
        h.numero,
        c.codigo
`);

    const alas = [];

    for (const cama of camas) {

        let ala = alas.find(a => a.nombre === cama.ala);

        if (!ala) {

            ala = {
                id_ala: cama.id_ala,
                nombre: cama.ala,
                habitaciones: []
            };

            alas.push(ala);
        }

        let habitacion = ala.habitaciones.find(
            h => h.numero === cama.habitacion
        );

        if (!habitacion) {

            habitacion = {
                id_habitacion: cama.id_habitacion,
                numero: cama.habitacion,
                camas: []
            };

            ala.habitaciones.push(habitacion);
        }

        habitacion.camas.push(cama);
    }

    res.render("camas/lista", {
        alas,
        rol: req.session.usuario.id_rol
    });

};
export const crearAla = async (req, res) => {

    const { tipo } = req.body;

    try {

        let prefijo;

        if(tipo === "urgencias"){
            prefijo = "Urgencias";
        }else{
            prefijo = "Ala";
        }

        const [[fila]] = await pool.query(`
            SELECT COUNT(*) AS total
            FROM alas
            WHERE nombre LIKE ?
        `, [`${prefijo}%`]);

        const nombre =
            tipo === "urgencias"
                ? `Urgencias ${fila.total + 1}`
                : `Ala ${fila.total + 1}`;

        await pool.query(`
            INSERT INTO alas(nombre)
            VALUES(?)
        `,[nombre]);

        res.sendStatus(200);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);
    }
};
export const crearHabitacion = async (req, res) => {

    const { id_ala } = req.body;

    try {

        const [[cantidad]] = await pool.query(`
            SELECT COUNT(*) AS total
            FROM habitaciones
            WHERE id_ala = ?
        `, [id_ala]);

        const numero = String(101 + cantidad.total);

        await pool.query(`
            INSERT INTO habitaciones
            (
                numero,
                capacidad,
                id_ala
            )
            VALUES
            (
                ?,
                2,
                ?
            )
        `, [
            numero,
            id_ala
        ]);

        res.sendStatus(200);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);
    }
};

export const crearCama = async (req, res) => {

    const { id_habitacion } = req.body;

    try {

        const [[cantidad]] = await pool.query(`
            SELECT COUNT(*) AS total
            FROM camas
            WHERE id_habitacion = ?
        `, [id_habitacion]);

        const codigo =
            `H${id_habitacion}-C${cantidad.total + 1}`;

        await pool.query(`
            INSERT INTO camas
            (
                codigo,
                id_habitacion
            )
            VALUES
            (
                ?,
                ?
            )
        `, [
            codigo,
            id_habitacion
        ]);

        res.sendStatus(200);

    } catch (error) {

        console.error(error);
        res.sendStatus(500);
    }
};

export const limpiarCama = async(req,res)=>{

    try{

        const idCama =
        req.params.id;

        await pool.query(
            `
            UPDATE camas
            SET estado='libre'
            WHERE id_cama=?
            AND estado='higienizando'
            `,
            [idCama]
        );

        res.sendStatus(200);

    }catch(error){

        console.error(error);

        res.sendStatus(500);

    }

};