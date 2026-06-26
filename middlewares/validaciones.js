export const soloTexto = (texto) => {

    return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
        .test(texto);

};

export const validarDNI = (dni) => {

    return /^\d{7,8}$/
        .test(dni);

};

export const validarTelefono = (telefono) => {

    if(!telefono){
        return true;
    }

    return /^\d{6,15}$/
        .test(telefono);

};

export const validarEmail = (email) => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

};

export const validarSexo = (sexo) => {

    return sexo === "M" ||
           sexo === "F";

};

export const validarFechaNacimiento = (fecha) => {

    if(!fecha){
        return true;
    }

    const hoy = new Date();

    return new Date(fecha) <= hoy;

};

export const validarPassword = (password) => {

    return password &&
           password.length >= 6;

};

export const validarMatricula = (matricula) => {

    if(!matricula){
        return true;
    }

    return /^[A-Za-z0-9\-]+$/
        .test(matricula);

};

export const validarLocalidad = (localidad) => {

    if(!localidad){
        return true;
    }

    return soloTexto(localidad);

};