export const verificarSesion = (req, res, next) => {

    if (!req.session.usuario) {
        return res.redirect("/");
    }

    next();
};

export const soloAdmin = (req,res,next)=>{

    if(
        Number(req.session.usuario.id_rol) !== 1
    ){
        return res.status(403).render(
            "error/acceso-denegado"
        );
    }

    next();

};

export const soloEnfermeria = (req,res,next)=>{

    if(
        Number(req.session.usuario.id_rol) !== 2
    ){
        return res.status(403).render(
            "error/acceso-denegado"
        );
    }

    next();

};

export const soloMedico = (req,res,next)=>{

    if(
        Number(req.session.usuario.id_rol) !== 3
    ){
        return res.status(403).render(
            "error/acceso-denegado"
        );
    }

    next();

};

export const soloAdmision = (req,res,next)=>{

    if(
        Number(req.session.usuario.id_rol) !== 4
    ){
        return res.status(403).render(
            "error/acceso-denegado"
        );
    }

    next();

};

export const soloLimpieza = (req,res,next)=>{

    if(
        Number(req.session.usuario.id_rol) !== 5
    ){
        return res.status(403).render(
            "error/acceso-denegado"
        );
    }

    next();

};

export const noLimpieza = (req,res,next)=>{

    if(
        Number(req.session.usuario.id_rol) === 5
    ){
        return res.status(403).render(
            "error/acceso-denegado"
        );
    }

    next();

};

export const permitirRoles = (...roles)=>{

    return (req,res,next)=>{

        const rol =
        Number(
            req.session.usuario.id_rol
        );

        if(!roles.includes(rol)){

            return res.status(403).render(
                "error/acceso-denegado"
            );

        }

        next();

    };

};