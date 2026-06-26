export const cargarDatosVista = (req, res, next) => {

    if (req.session.usuario) {

        res.locals.usuario = req.session.usuario.usuario;
        res.locals.nombre = req.session.usuario.nombre;
        res.locals.apellido = req.session.usuario.apellido;
        res.locals.rol = Number(req.session.usuario.id_rol);

    }

    next();

};