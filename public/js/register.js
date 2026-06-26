const form =
document.querySelector("form");

form.addEventListener(
    "submit",
    (e)=>{

        const nombre =
        document.querySelector(
            '[name="nombre"]'
        ).value;

        const apellido =
        document.querySelector(
            '[name="apellido"]'
        ).value;

        const dni =
        document.querySelector(
            '[name="dni"]'
        ).value;

        const password =
        document.querySelector(
            '[name="password"]'
        ).value;

        const confirmPassword =
        document.querySelector(
            '[name="confirmPassword"]'
        ).value;

        const soloTexto =
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

        if(!soloTexto.test(nombre)){
            alert(
                "Nombre inválido"
            );
            e.preventDefault();
            return;
        }

        if(!soloTexto.test(apellido)){
            alert(
                "Apellido inválido"
            );
            e.preventDefault();
            return;
        }

        if(!/^\d{7,8}$/.test(dni)){
            alert(
                "DNI inválido"
            );
            e.preventDefault();
            return;
        }

        if(password !== confirmPassword){
            alert(
                "Las contraseñas no coinciden"
            );
            e.preventDefault();
        }

    }
);

const rol =
document.querySelector("#rol");

const grupoEspecialidad =
document.querySelector("#grupoEspecialidad");

function actualizarCamposRol(){

    if(rol.value === "MEDICO"){

        grupoEspecialidad.style.display = "block";

    }else{

        grupoEspecialidad.style.display = "none";

    }

}

rol.addEventListener(
    "change",
    actualizarCamposRol
);

actualizarCamposRol();